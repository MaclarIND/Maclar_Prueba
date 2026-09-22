/*
 * MACLAR — datos de catálogo.
 * Contenido redactado a partir de información institucional pública de
 * maclar.com.ar (empresa, categorías, controladores documentados) y de la
 * observación directa de las fotografías provistas para cada producto.
 * No se afirman certificaciones, disponibilidad actual ni compatibilidades
 * que no estén documentadas.
 */

const MACLAR_CATEGORIES = [
  {
    slug: "maniobras-electronicas",
    name: "Maniobras electrónicas",
    tagline: "Control por microprocesador para ascensores y montacargas.",
    description:
      "Desde comienzos de la década de 1990 MACLAR incorporó tecnología electrónica de microprocesador a sus sistemas de maniobra, en un desarrollo conjunto con Controles S.A. de Montevideo. La información institucional de MACLAR documenta controladores como el CEA51FA y el CEA31, junto con el coordinador COO51FA para la gestión de varias cabinas. Estas referencias corresponden a la documentación histórica del fabricante: no las asignamos a las fotografías del catálogo salvo que estén confirmadas para esa unidad puntual.",
    hasPhotographedProduct: true
  },
  {
    slug: "maniobras-electromecanicas",
    name: "Maniobras electromecánicas",
    tagline: "Tableros de contactores para operación simple o colectiva.",
    description:
      "Durante sus primeros quince años de actividad, desde 1975, MACLAR fabricó equipos de tecnología electromecánica con herramental propio, y hoy continúa proveyendo repuestos para esos controles y selectores. La línea electromecánica documentada por el fabricante incluye tableros para uso hidráulico, operación simple sin acumulación de llamadas, operación colectiva con acumulación y montacargas, asociados a un selector de piso o a una serie de llaves mecánicas de pasillo.",
    hasPhotographedProduct: true
  },
  {
    slug: "duplex-baterias",
    name: "Sistemas dúplex y baterías múltiples",
    tagline: "Coordinación de varias cabinas en un mismo edificio.",
    description:
      "La documentación institucional de MACLAR menciona coordinadores para la gestión conjunta de varios ascensores, como el COO51FA. No contamos con fotografías propias verificadas de un tablero dúplex o de baterías múltiples, por lo que esta categoría se presenta como acceso informativo: para especificaciones de un caso concreto, te recomendamos realizar una consulta directa.",
    hasPhotographedProduct: false
  },
  {
    slug: "botoneras-indicadores",
    name: "Botoneras e indicadores",
    tagline: "Accesorios de cabina y de pasillo con diseño y herramental propio.",
    description:
      "MACLAR fabrica una línea de accesorios —tableros de comando, botoneras e indicadores— con diseño y herramental propio, comercializados junto con sus sistemas de maniobra o de forma independiente. El sitio del fabricante documenta además botoneras de micromovimiento. Las dos botoneras fotografiadas para este catálogo se presentan con nombres descriptivos provisorios, hasta confirmar su denominación comercial exacta.",
    hasPhotographedProduct: true
  }
];

const MACLAR_PRODUCTS = [
  {
    id: "tablero-electromecanico",
    slug: "tablero-electromecanico",
    category: "maniobras-electromecanicas",
    name: "Tablero de maniobra electromecánica",
    shortName: "Maniobra electromecánica",
    tagline: "Gabinete de contactores con controladora electrónica auxiliar",
    description:
      "Gabinete metálico de maniobra con puerta, organizado en niveles: controladora electrónica en la parte superior, un grupo de placas auxiliares de maniobra, un bloque de contactores de potencia y protecciones termomagnéticas, y un transformador de control en la base. La bornera lateral concentra las conexiones hacia cabina, pasillo y selector.",
    applications:
      "Corresponde a la familia de tableros de maniobra que MACLAR describe para operación de ascensores con acumulación o sin acumulación de llamadas, asociados a un selector de piso o a llaves mecánicas de pasillo. La aplicación específica de la unidad fotografiada (modelo de maniobra, cantidad de paradas, tipo de operación) no está documentada y debe confirmarse por consulta directa.",
    specsVerified: [
      { label: "Gabinete", value: "Metálico, con puerta abisagrada y cerradura" },
      { label: "Controlador", value: "Placa electrónica con relés de salida y visualizador de 2 dígitos" },
      { label: "Potencia", value: "3 contactores de línea sobre riel DIN" },
      { label: "Protecciones", value: "Interruptores termomagnéticos sobre riel DIN" },
      { label: "Alimentación auxiliar", value: "Transformador de control multi-tap" },
      { label: "Conexionado", value: "Bornera lateral identificada por función" }
    ],
    specsNote:
      "Características observadas directamente sobre las fotografías del equipo. No se listan corrientes, tensiones ni modelos exactos por no estar confirmados.",
    images: [
      { file: "frontal.jpg", alt: "Tablero de maniobra electromecánica MACLAR, vista frontal con la puerta abierta", caption: "Vista frontal" },
      { file: "3-4-izquierda.jpg", alt: "Tablero de maniobra electromecánica MACLAR, perspectiva de tres cuartos izquierda", caption: "Perspectiva tres cuartos izquierda" },
      { file: "ambiente.jpg", alt: "Tablero de maniobra electromecánica MACLAR, toma general", caption: "Vista general" },
      { file: "detalle-controlador.jpg", alt: "Detalle de la placa controladora electrónica", caption: "Detalle: controladora" },
      { file: "detalle-contactores.jpg", alt: "Detalle de los contactores de potencia y protecciones", caption: "Detalle: contactores y protecciones" },
      { file: "detalle-bornera.jpg", alt: "Detalle de la bornera de conexión lateral", caption: "Detalle: bornera" },
      { file: "detalle-transformador.jpg", alt: "Detalle del transformador de control", caption: "Detalle: transformador" },
      { file: "detalle-acabado.jpg", alt: "Detalle del acabado y la esquina del gabinete", caption: "Detalle: acabado del gabinete" }
    ],
    anatomy: [
      { x: 64, y: 22, title: "Controladora electrónica", text: "Placa con relés de salida, borneras de campo y visualizador de dos dígitos." },
      { x: 43, y: 48, title: "Módulos auxiliares", text: "Placas secundarias asociadas a funciones de maniobra." },
      { x: 35, y: 64, title: "Contactores de potencia", text: "Tres contactores montados sobre riel DIN." },
      { x: 61, y: 64, title: "Protecciones", text: "Interruptores termomagnéticos de línea." },
      { x: 77, y: 53, title: "Bornera de conexión", text: "Bloque de bornes identificados por función, sobre el lateral derecho." },
      { x: 70, y: 87, title: "Transformador de control", text: "Provee las tensiones auxiliares del tablero." }
    ],
    docs: []
  },
  {
    id: "tablero-electronico",
    slug: "tablero-electronico",
    category: "maniobras-electronicas",
    name: "Tablero de maniobra electrónica",
    shortName: "Maniobra electrónica",
    tagline: "Controladora de microprocesador con variador de frecuencia",
    description:
      "Gabinete de maniobra con panel interior identificado en color naranja, que incorpora —además de la controladora electrónica, los contactores y el transformador de control propios de la línea de MACLAR— un variador de frecuencia para el control del motor de tracción. Representa la evolución electrónica de las maniobras del fabricante, incorporada desde comienzos de la década de 1990 en desarrollo conjunto con Controles S.A. de Montevideo.",
    applications:
      "La documentación institucional de MACLAR ubica en esta familia a controladores como el CEA51FA y el CEA31. No confirmamos que la unidad fotografiada corresponda a un modelo particular: el variador de frecuencia visible en el equipo es de marca Yaskawa, serie GA500, según su propio rótulo.",
    specsVerified: [
      { label: "Gabinete", value: "Metálico, panel interior naranja, con puerta" },
      { label: "Variador de frecuencia", value: "Yaskawa GA500 (según rótulo del equipo fotografiado)" },
      { label: "Controlador", value: "Placa electrónica con relés de salida y visualizador de 2 dígitos" },
      { label: "Potencia", value: "Contactores y protecciones sobre riel DIN" },
      { label: "Alimentación auxiliar", value: "Transformador de control multi-tap" },
      { label: "Conexionado", value: "Bornera lateral identificada por función" }
    ],
    specsNote:
      "Características observadas directamente sobre las fotografías del equipo. La marca y el modelo del variador provienen de su propio rótulo, visible en la imagen.",
    images: [
      { file: "frontal.jpg", alt: "Tablero de maniobra electrónica MACLAR con variador de frecuencia, vista frontal", caption: "Vista frontal" },
      { file: "3-4-izquierda.jpg", alt: "Tablero de maniobra electrónica MACLAR, perspectiva de tres cuartos izquierda", caption: "Perspectiva tres cuartos izquierda" },
      { file: "3-4-derecha.jpg", alt: "Tablero de maniobra electrónica MACLAR, perspectiva de tres cuartos derecha", caption: "Perspectiva tres cuartos derecha" },
      { file: "detalle-variador.jpg", alt: "Detalle del variador de frecuencia Yaskawa GA500", caption: "Detalle: variador de frecuencia" },
      { file: "detalle-controlador.jpg", alt: "Detalle de la placa controladora electrónica", caption: "Detalle: controladora" },
      { file: "detalle-contactores.jpg", alt: "Detalle de contactores y protecciones", caption: "Detalle: contactores y protecciones" },
      { file: "detalle-transformador.jpg", alt: "Detalle del transformador de control", caption: "Detalle: transformador" },
      { file: "detalle-acabado.jpg", alt: "Detalle del acabado y la esquina del gabinete", caption: "Detalle: acabado del gabinete" }
    ],
    anatomy: [
      { x: 32, y: 24, title: "Variador de frecuencia", text: "Yaskawa GA500, controla arranque y velocidad del motor de tracción." },
      { x: 65, y: 23, title: "Controladora electrónica", text: "Placa con relés de salida, borneras de campo y visualizador." },
      { x: 37, y: 69, title: "Contactores y protecciones", text: "Sobre riel DIN, en la sección inferior del gabinete." },
      { x: 77, y: 56, title: "Bornera de conexión", text: "Bloque de bornes identificados por función." },
      { x: 23, y: 53, title: "Transformador de control", text: "Provee las tensiones auxiliares del tablero." }
    ],
    docs: []
  },
  {
    id: "botonera-ventana",
    slug: "botonera-ventana",
    category: "botoneras-indicadores",
    name: "Botonera con ventana superior",
    shortName: "Botonera con ventana",
    tagline: "Placa de acero cepillado con visor y pulsador de micromovimiento",
    description:
      "Placa metálica rectangular y alargada, de terminación cepillada, con una ventana negra rectangular en la parte superior y un conjunto de pulsador con doble testigo luminoso en la zona inferior. Fijación mediante tornillos visibles en los extremos superior e inferior. Nombre descriptivo provisorio hasta confirmar la denominación comercial exacta del fabricante.",
    applications:
      "Corresponde a la línea de botoneras e indicadores que MACLAR fabrica con diseño y herramental propio, comercializada junto con los sistemas de maniobra o de forma independiente. No se documenta el contenido que muestra la ventana superior en funcionamiento; no incorporamos números, flechas ni iluminación no verificados.",
    specsVerified: [
      { label: "Placa", value: "Acero inoxidable de terminación cepillada" },
      { label: "Formato", value: "Rectangular alargado" },
      { label: "Ventana", value: "Abertura rectangular en el tercio superior" },
      { label: "Pulsador", value: "Conjunto con testigo luminoso doble (rojo)" },
      { label: "Fijación", value: "Tornillos visibles, superior e inferior" }
    ],
    specsNote:
      "Características observadas directamente sobre la fotografía provista del producto.",
    images: [
      { file: "frontal.jpg", alt: "Botonera con ventana superior MACLAR, vista frontal", caption: "Vista frontal" },
      { file: "3-4-izquierda.jpg", alt: "Botonera con ventana superior MACLAR, perspectiva de tres cuartos izquierda", caption: "Perspectiva tres cuartos izquierda" },
      { file: "3-4-derecha.jpg", alt: "Botonera con ventana superior MACLAR, perspectiva de tres cuartos derecha", caption: "Perspectiva tres cuartos derecha" },
      { file: "detalle-pulsador.jpg", alt: "Detalle del conjunto de pulsador y testigos luminosos", caption: "Detalle: pulsador y testigos" },
      { file: "detalle-acabado.jpg", alt: "Detalle del acabado cepillado y la fijación superior", caption: "Detalle: acabado y fijación" }
    ],
    anatomy: [
      { x: 59, y: 9, title: "Tornillo de fijación superior", text: "Fijación visible de la placa al vano." },
      { x: 60, y: 29, title: "Ventana", text: "Abertura rectangular en el tercio superior de la placa." },
      { x: 54, y: 73, title: "Pulsador", text: "Conjunto de pulsador de micromovimiento." },
      { x: 67, y: 73, title: "Testigos luminosos", text: "Doble indicador rojo junto al pulsador." },
      { x: 59, y: 90, title: "Tornillo de fijación inferior", text: "Segunda fijación visible de la placa." }
    ],
    docs: []
  },
  {
    id: "botonera-pulsador",
    slug: "botonera-pulsador",
    category: "botoneras-indicadores",
    name: "Botonera de un pulsador sin ventana superior",
    shortName: "Botonera de un pulsador",
    tagline: "Placa de acero cepillado con pulsador centrado",
    description:
      "Placa metálica rectangular, más corta que la botonera con ventana, de terminación cepillada, con un conjunto de pulsador de micromovimiento y doble testigo luminoso ubicado en la zona central. Fijación mediante tornillos visibles en los extremos superior e inferior. Nombre descriptivo provisorio hasta confirmar la denominación comercial exacta del fabricante.",
    applications:
      "Corresponde a la misma línea de botoneras e indicadores de fabricación propia de MACLAR. Es un modelo independiente del anterior: difiere en proporciones, no incorpora ventana y ubica el pulsador en el centro de la placa.",
    specsVerified: [
      { label: "Placa", value: "Acero inoxidable de terminación cepillada" },
      { label: "Formato", value: "Rectangular, de proporción más corta" },
      { label: "Pulsador", value: "Conjunto centrado, con testigo luminoso doble (rojo)" },
      { label: "Fijación", value: "Tornillos visibles, superior e inferior" }
    ],
    specsNote:
      "Características observadas directamente sobre la fotografía provista del producto.",
    images: [
      { file: "frontal.jpg", alt: "Botonera de un pulsador sin ventana superior MACLAR, vista frontal", caption: "Vista frontal" },
      { file: "3-4-izquierda.jpg", alt: "Botonera de un pulsador sin ventana superior MACLAR, perspectiva de tres cuartos", caption: "Perspectiva tres cuartos" },
      { file: "detalle-pulsador.jpg", alt: "Detalle del conjunto de pulsador y testigos luminosos", caption: "Detalle: pulsador y testigos" },
      { file: "detalle-acabado.jpg", alt: "Detalle del acabado cepillado y la fijación inferior", caption: "Detalle: acabado y fijación" }
    ],
    anatomy: [
      { x: 44, y: 12, title: "Tornillo de fijación superior", text: "Fijación visible de la placa al vano." },
      { x: 54, y: 44, title: "Pulsador", text: "Conjunto de pulsador de micromovimiento, ubicado en el centro." },
      { x: 30, y: 50, title: "Testigos luminosos", text: "Doble indicador rojo junto al pulsador." },
      { x: 43, y: 77, title: "Tornillo de fijación inferior", text: "Segunda fijación visible de la placa." }
    ],
    docs: []
  }
];

function maclarGetProduct(slug) {
  return MACLAR_PRODUCTS.find((p) => p.slug === slug);
}
function maclarGetCategory(slug) {
  return MACLAR_CATEGORIES.find((c) => c.slug === slug);
}
function maclarProductsByCategory(slug) {
  return MACLAR_PRODUCTS.filter((p) => p.category === slug);
}
function maclarRoot() {
  return typeof window !== "undefined" && window.MACLAR_ROOT ? window.MACLAR_ROOT : "";
}
function maclarImagePath(product, file) {
  return `${maclarRoot()}assets/img/products/${product.id}/${file}`;
}
function maclarHeroImagePath(product) {
  return `${maclarRoot()}assets/img/hero/${product.id}.png`;
}
function maclarCardImagePath(product) {
  return `${maclarRoot()}assets/img/products/${product.id}/card.jpg`;
}
function maclarProductUrl(product) {
  return `${maclarRoot()}productos/${product.slug}.html`;
}
