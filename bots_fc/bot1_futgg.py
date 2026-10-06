"""Bot 1: scraper de FUT.GG (FUT Gallery) -> jugadores.xlsx

Entra a la grilla de sets, abre cada set y guarda Nombre, Precio, Rating y Equipo.
"""
import re
import sys
from urllib.parse import urljoin

from openpyxl import Workbook
from playwright.sync_api import sync_playwright

from comun import BASE, cargar_config, log, espera, asegurar_chromium

URL_GALERIA = "https://www.fut.gg/fut-gallery/?sort=score"

# ======================================================================
# AJUSTES SI LA WEB CAMBIA (todo lo "frágil" está concentrado acá)
# ======================================================================
# Link de una tarjeta de set: /fut-gallery/<liga>/<equipo>/
REGEX_LINK_SET = re.compile(r"^/fut-gallery/[^/]+/[^/]+/?$")
# Texto que marca un set vacío
TEXTO_SET_VACIO = "not enough cards"
# Link de una carta de jugador: /players/<id>-<slug>/...
SELECTOR_LINK_JUGADOR = 'a[href*="/players/"]'
# Botones de cookies / popups (se prueban por texto)
REGEX_BOTON_COOKIES = re.compile(r"^(accept( all)?|agree|i agree|got it|allow all|aceptar( todo)?|consent|ok)$", re.I)

# JS que extrae las cartas de la página. Para cada link de jugador sube por el DOM
# hasta el contenedor que tenga UN SOLO link de jugador (la "tarjeta" completa, que
# incluye el precio de debajo) y de ahí saca los textos. Ajustar acá si cambia el layout.
JS_EXTRAER_CARTAS = r"""
(selLink) => {
  const vistos = new Set();
  const out = [];
  for (const a of document.querySelectorAll(selLink)) {
    const href = a.getAttribute('href');
    if (vistos.has(href)) continue;
    vistos.add(href);
    let cont = a;
    while (cont.parentElement && cont.parentElement.querySelectorAll(selLink).length === 1
           && cont.parentElement.tagName !== 'BODY' && cont.parentElement.tagName !== 'MAIN') {
      cont = cont.parentElement;
    }
    // Un texto por nodo de texto (así "82" y "CM" quedan separados aunque sean <span> en línea)
    const lineas = [];
    const w = document.createTreeWalker(cont, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) { const t = w.currentNode.textContent.trim(); if (t) lineas.push(t); }
    const img = cont.querySelector('img[alt]');
    out.push({href, lineas, alt: img ? img.alt : ''});
  }
  return out;
}
"""
# ======================================================================


def parse_precio(txt):
    """'1.1K' -> 1100 | '1.5K' -> 1500 | '1.2M' -> 1200000 | '600' -> 600 | otro -> None"""
    t = txt.strip().upper().replace(" ", "")
    m = re.fullmatch(r"(\d+(?:[.,]\d+)?)([KM])", t)
    if m:
        n = float(m.group(1).replace(",", "."))
        return int(round(n * (1000 if m.group(2) == "K" else 1_000_000)))
    if re.fullmatch(r"\d{1,3}(?:[.,]\d{3})+", t):  # 12,500 / 12.500
        return int(re.sub(r"[.,]", "", t))
    if re.fullmatch(r"\d+", t):
        return int(t)
    return None


def nombre_desde_href(href):
    """Respaldo: /players/12345-hans-schmid/... -> 'Hans Schmid'"""
    m = re.search(r"/players/\d+-([^/]+)", href)
    return m.group(1).replace("-", " ").title() if m else ""


def interpretar_carta(c):
    """Convierte las líneas de texto de una carta en (nombre, precio, rating)."""
    lineas = c["lineas"]
    rating = None
    precio = None
    # Rating: primer número de 2 dígitos (40-99) de la carta.
    for l in lineas:
        if re.fullmatch(r"\d{2}", l) and 40 <= int(l) <= 99:
            rating = int(l)
            break
    # Precio: último texto con forma de precio (el que está junto a la moneda).
    for l in reversed(lineas):
        if re.fullmatch(r"\d+(?:[.,]\d+)?[KMkm]?|\d{1,3}(?:[.,]\d{3})+", l):
            if rating is not None and l == str(rating) and lineas.index(l) == lineas.index(str(rating)):
                continue  # es el rating, no el precio
            precio = parse_precio(l)
            if precio is not None:
                break
    # Nombre: primera línea con letras que no sea código de posición (ST, CAM...) ni "Cards".
    nombre = ""
    for l in lineas:
        if re.search(r"[A-Za-zÀ-ÿ]{2}", l) and not re.fullmatch(r"[A-Z]{1,3}", l):
            nombre = l
            break
    if not nombre:
        nombre = nombre_desde_href(c["href"]) or c["alt"]
    return nombre, precio, rating


def cerrar_popups(page):
    """Cierra banners de cookies y popups comunes (por texto, no por clases)."""
    for b in page.get_by_role("button").all()[:40]:
        try:
            if b.is_visible() and REGEX_BOTON_COOKIES.match(b.inner_text(timeout=500).strip()):
                b.click(timeout=1500)
                log("Cerré un popup/cookies")
                espera(0.5, 1)
                return
        except Exception:
            pass


def listar_sets(page, max_sets):
    page.goto(URL_GALERIA, wait_until="domcontentloaded")
    page.wait_for_load_state("networkidle", timeout=30000)
    cerrar_popups(page)
    sets, vistos = [], set()
    for a in page.locator("a[href^='/fut-gallery/']").all():
        href = (a.get_attribute("href") or "").split("?")[0]
        if href in vistos or not REGEX_LINK_SET.match(href):
            continue
        vistos.add(href)
        texto = a.inner_text().replace("\n", " ").strip()
        if TEXTO_SET_VACIO in texto.lower():
            log(f"Salteo set vacío: {href}")
            continue
        sets.append(urljoin(URL_GALERIA, href))
    log(f"Sets detectados en pantalla: {len(sets)}")
    return sets[:max_sets] if max_sets else sets


def leer_set(page, url):
    page.goto(url, wait_until="domcontentloaded")
    page.wait_for_load_state("networkidle", timeout=30000)
    cerrar_popups(page)
    # Scroll para que carguen todas las cartas (carga perezosa)
    for _ in range(6):
        page.mouse.wheel(0, 2500)
        page.wait_for_timeout(500)
    # Nombre del equipo: título H1; respaldo: slug del link
    try:
        equipo = page.locator("h1").first.inner_text(timeout=3000).strip()
    except Exception:
        equipo = ""
    if not equipo:
        equipo = url.rstrip("/").split("/")[-1].replace("-", " ").title()
    cartas = page.evaluate(JS_EXTRAER_CARTAS, SELECTOR_LINK_JUGADOR)
    filas = []
    for c in cartas:
        nombre, precio, rating = interpretar_carta(c)
        if nombre:
            filas.append((nombre, precio, rating, equipo))
    log(f"  {equipo}: {len(filas)} cartas leídas")
    return filas


def main():
    cfg = cargar_config()
    asegurar_chromium()
    todas, claves = [], set()
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=bool(cfg.get("bot1_headless", False)))
        page = browser.new_context(viewport={"width": 1440, "height": 900}, locale="en-US").new_page()
        try:
            sets = listar_sets(page, int(cfg.get("max_sets", 0)))
            for i, url in enumerate(sets, 1):
                log(f"[{i}/{len(sets)}] {url}")
                try:
                    for fila in leer_set(page, url):
                        clave = (fila[0].lower(), fila[2], fila[3].lower())
                        if clave not in claves:
                            claves.add(clave)
                            todas.append(fila)
                except Exception as e:
                    log(f"  ERROR en {url}: {e}")
                espera(1, 3)
        finally:
            browser.close()

    wb = Workbook()
    ws = wb.active
    ws.title = "Jugadores"
    ws.append(["Nombre", "Precio", "Rating", "Equipo"])
    for fila in todas:
        ws.append(list(fila))
    salida = BASE / cfg["excel_entrada"]
    wb.save(salida)  # sobrescribe si existe
    log(f"Listo: {len(todas)} jugadores guardados en {salida}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(1)
    input("\nEnter para cerrar...") if getattr(sys, "frozen", False) else None
