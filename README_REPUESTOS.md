# Repuestos — cómo actualizar precios

La página `repuestos.html` muestra el listado de repuestos importado desde
la planilla de precios (`js/repuestos.js`, 127 ítems en 4 categorías).

## Opción 1 — Reenviar el Excel (sin configuración)

Cuando cambien los precios, mandá el Excel actualizado por el chat. Se
regenera `js/repuestos.js` y se publica de nuevo. No requiere que hagas
nada de tu lado más allá de mandar el archivo.

## Opción 2 — Actualización automática con Google Sheets

Para que el sitio refleje los cambios de precio apenas edites una celda,
sin que nadie tenga que tocar el código:

1. Abrí el Excel en Google Sheets (subilo a Drive y elegí "Abrir con
   Google Sheets", o pegá los datos en una hoja nueva). Mantené dos
   columnas: una con el nombre del repuesto (tal como figura en el sitio)
   y otra con el precio.
2. En Sheets: **Archivo → Compartir → Publicar en la web**.
3. Elegí la hoja correspondiente y el formato **CSV**, luego **Publicar**.
4. Copiá el link que te da Google (termina en `output=csv`).
5. Pasame ese link. Lo cargo en `MACLAR_REPUESTOS_CSV_URL`
   (`js/repuestos.js`, línea ~4) y a partir de ahí la página intenta leer
   los precios actualizados cada vez que alguien la visita, comparando por
   nombre de repuesto. Si no encuentra una fila con el link configurado
   (por ejemplo sin conexión), sigue mostrando los precios ya importados
   sin romper nada.

Importante: para que el cruce por nombre funcione, el texto de la columna
"nombre" en Sheets tiene que coincidir con el nombre del repuesto tal como
está cargado en el sitio (no hace falta que sea idéntico en mayúsculas,
pero sí en el texto). Si cambiás el nombre de un repuesto en la planilla,
avisame para actualizarlo también en `js/repuestos.js`.

## Imágenes

Los repuestos todavía no tienen fotos propias — se muestra un ícono
genérico. Cuando tengas las imágenes, mandámelas (lo ideal: nombradas
igual que el repuesto, o decime qué imagen corresponde a cuál) y las
agrego en `assets/img/repuestos/`, actualizando el campo `image` de cada
ítem en `js/repuestos.js`.
