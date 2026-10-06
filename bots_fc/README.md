# Bots FUT.GG → EA FC Web App

Dos programas independientes para Windows:

| Programa | Qué hace |
|---|---|
| `bot1_futgg.exe` | Lee los sets de FUT Gallery en fut.gg y genera `jugadores.xlsx` (Nombre, Precio, Rating, Equipo). |
| `bot2_compras.exe` | Lee `jugadores.xlsx` y compra en el mercado de transferencias de la Web App de EA. |

> ⚠️ Automatizar la Web App de EA va contra sus términos de uso y puede traer sanciones a tu cuenta. Usalo bajo tu responsabilidad, empezá siempre con `"modo_prueba": true`.
> ⚠️ El código se escribió **sin poder abrir fut.gg ni la Web App** (entorno sin acceso), así que los selectores son heurísticos y **hay que probarlos y ajustarlos** (ver más abajo).

## Instalación

**Opción A – obtener los .exe con GitHub Actions** (no necesitás Python):
repo → pestaña *Actions* → *Build bots (.exe Windows)* → *Run workflow* → bajá el artefacto `bots-windows`.

**Opción B – compilar vos en Windows:**
1. Instalá Python 3.10+ (marcá "Add to PATH").
2. En la carpeta `bots_fc` ejecutá `build.bat`.
3. Los `.exe` y `config.json` quedan en `dist\`.

**Chromium:** no va dentro del .exe. La primera vez que corras cualquiera de los bots se descarga solo (~150 MB) a la carpeta `navegadores\` al lado del .exe. Necesitás internet esa vez. No hace falta hacer nada más.

## Uso

Poné los `.exe` y `config.json` en la misma carpeta.

1. **Bot 1:** doble click a `bot1_futgg.exe`. Genera `jugadores.xlsx` (lo sobrescribe).
2. **Bot 2:** doble click a `bot2_compras.exe`. Se abre Chromium con el perfil `perfil_chrome\` (guarda la sesión). **Iniciá sesión vos a mano**, incluido el código de verificación; el bot espera a ver la Home y recién ahí arranca. Nunca guarda ni escribe contraseñas.
3. Al final queda `compras_resultado.xlsx` (Nombre | Precio Excel | Precio pagado | Estado | Hora).

**Parada de emergencia:** creá un archivo `STOP.txt` en la carpeta del exe y el bot frena. Borralo antes de volver a correr.

**Alertas:** si EA muestra captcha, "too many actions" u otro error, el bot se pausa y te avisa en consola; lo resolvés vos en el navegador y apretás Enter. No intenta saltear captchas.

## config.json

| Clave | Significado |
|---|---|
| `excel_entrada` | Archivo que escribe el Bot 1 y lee el Bot 2. |
| `max_sets` | Máximo de sets que procesa el Bot 1 (0 = todos los visibles). |
| `bot1_headless` | `true` = Bot 1 sin ventana. |
| `margen_max` | Tope relativo: no se paga más de `precio_excel × (1 + margen_max)`. |
| `precio_max_absoluto` | Tope absoluto por jugador. Se usa el menor de los dos topes. |
| `presupuesto_total` | Gasto máximo de toda la corrida. |
| `espera_min_seg` / `espera_max_seg` | Espera aleatoria entre búsquedas. |
| `max_busquedas_sesion` | Límite de búsquedas; al llegar, el bot termina. |
| `pausa_larga_cada` / `pausa_larga_seg` | Pausa larga cada N búsquedas. |
| `delay_tecla_ms` | Demora entre teclas al escribir el nombre. |
| `modo_prueba` | `true` = hace todo salvo apretar Buy Now (loguea lo que compraría; estado "Simulado (prueba)"). |

## Si las páginas cambian: ajustar selectores

Todo lo frágil está arriba de cada archivo, bajo el cartel `AJUSTES SI LA WEB ... CAMBIA`:

- **`bot1_futgg.py`**: `REGEX_LINK_SET` (links de sets), `TEXTO_SET_VACIO`, `SELECTOR_LINK_JUGADOR` y `JS_EXTRAER_CARTAS` (cómo se arma cada carta: rating = número de 2 dígitos, precio = último texto tipo `1.1K`, nombre = texto con letras que no sea posición). Si algo sale vacío, abrí F12 en fut.gg y adaptá eso.
- **`bot2_compras.py`**: diccionario `SEL` (monedas, sugerencias, filas de resultados, botón atrás), `TEXTO_MENU`, `REGEX_ALERTAS` y `JS_MARCAR_BUYNOW_MAX` (encuentra el input Max de "Buy Now Price:" por el texto de la etiqueta, y su botón "+").

Para probar sin compilar: `pip install -r requirements.txt`, `playwright install chromium` y `python bot1_futgg.py` / `python bot2_compras.py`.
Después de editar el código hay que volver a compilar con `build.bat`.
