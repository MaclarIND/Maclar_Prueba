"""Utilidades compartidas por los dos bots: rutas, config, log, Chromium."""
import json
import os
import random
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path

# Carpeta "base": al lado del .exe (cuando está compilado) o del .py (en desarrollo).
BASE = Path(sys.executable).parent if getattr(sys, "frozen", False) else Path(__file__).resolve().parent

CONFIG_DEFECTO = {
    "excel_entrada": "jugadores.xlsx",
    "max_sets": 12,
    "bot1_headless": False,
    "margen_max": 0.20,
    "precio_max_absoluto": 5000,
    "presupuesto_total": 30000,
    "espera_min_seg": 3,
    "espera_max_seg": 7,
    "max_busquedas_sesion": 150,
    "pausa_larga_cada": 25,
    "pausa_larga_seg": 60,
    "delay_tecla_ms": 90,
    "modo_prueba": True,
}


def log(msg):
    print(f"[{datetime.now():%H:%M:%S}] {msg}", flush=True)


def cargar_config():
    """Lee config.json (al lado del exe). Si falta, lo crea con los valores por defecto."""
    ruta = BASE / "config.json"
    cfg = dict(CONFIG_DEFECTO)
    if ruta.exists():
        with open(ruta, encoding="utf-8") as f:
            cfg.update(json.load(f))
    else:
        with open(ruta, "w", encoding="utf-8") as f:
            json.dump(CONFIG_DEFECTO, f, indent=2, ensure_ascii=False)
        log(f"No había config.json; creé uno con valores por defecto en {ruta}")
    return cfg


class Parar(Exception):
    """Se lanza cuando hay que frenar todo (STOP.txt, captcha, sin monedas...)."""


def hay_stop():
    return (BASE / "STOP.txt").exists()


def chequear_stop():
    if hay_stop():
        raise Parar("STOP.txt detectado: parada de emergencia")


def espera(seg_min, seg_max=None):
    """Espera aleatoria; revisa STOP.txt cada medio segundo."""
    seg = random.uniform(seg_min, seg_max if seg_max is not None else seg_min)
    fin = time.time() + seg
    while time.time() < fin:
        chequear_stop()
        time.sleep(min(0.5, max(0.0, fin - time.time())))


def asegurar_chromium():
    """Chromium se guarda en ./navegadores (al lado del exe). Si no está, se descarga (solo la 1ª vez)."""
    carpeta = BASE / "navegadores"
    os.environ["PLAYWRIGHT_BROWSERS_PATH"] = str(carpeta)
    if carpeta.exists() and any(carpeta.glob("chromium-*")):
        return
    log("Primera ejecución: descargando Chromium (~150 MB). Puede tardar unos minutos...")
    from playwright._impl._driver import compute_driver_executable
    exe = compute_driver_executable()
    cmd = list(exe) if isinstance(exe, (tuple, list)) else [str(exe)]
    r = subprocess.run(cmd + ["install", "chromium"], env=os.environ.copy())
    if r.returncode != 0:
        raise SystemExit("No se pudo descargar Chromium. Revisá tu conexión y reintentá.")
    log("Chromium instalado.")
