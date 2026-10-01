/*
 * MACLAR — listado de repuestos y precios.
 * Datos importados desde la planilla de precios provista por el cliente
 * (REPUESTOS, 4 categorías, 127 ítems). Los precios están en dólares
 * estadounidenses (U$S), tal como figuran en la planilla original.
 *
 * Actualización de precios: ver README_REPUESTOS.md en la raíz del
 * repositorio para el procedimiento de sincronización.
 *
 * "image" queda en null hasta contar con fotografías propias de cada
 * repuesto; mientras tanto se muestra un ícono genérico por categoría.
 */

// Link de Google Sheets publicada como CSV (Archivo → Compartir → Publicar
// en la web → CSV) con columnas "nombre" y "precio". Mientras esté vacío,
// la página usa únicamente los precios importados más abajo.
const MACLAR_REPUESTOS_CSV_URL = "";

const MACLAR_REPUESTOS_CATEGORIES = [
  {
    "slug": "botoneras",
    "name": "Botoneras"
  },
  {
    "slug": "resistencias",
    "name": "Resistencias"
  },
  {
    "slug": "transformadores",
    "name": "Transformadores"
  },
  {
    "slug": "varios",
    "name": "Varios (electrónica general)"
  }
];

const MACLAR_REPUESTOS = [
  {
    "id": "boton-m-m-braille-completo",
    "cat": "botoneras",
    "catLabel": "Botoneras",
    "name": "BOTON M.M BRAILLE COMPLETO",
    "price": 11
  },
  {
    "id": "boton-m-m-de-bronce-completo",
    "cat": "botoneras",
    "catLabel": "Botoneras",
    "name": "BOTON M.M. DE BRONCE COMPLETO",
    "price": 15
  },
  {
    "id": "boton-redondo-de-acero-braille",
    "cat": "botoneras",
    "catLabel": "Botoneras",
    "name": "BOTON REDONDO DE ACERO BRAILLE",
    "price": 11
  },
  {
    "id": "caja-de-boton-exterior-simple",
    "cat": "botoneras",
    "catLabel": "Botoneras",
    "name": "CAJA DE BOTON EXTERIOR SIMPLE",
    "price": 4
  },
  {
    "id": "caja-de-indicador-doble-con-boton",
    "cat": "botoneras",
    "catLabel": "Botoneras",
    "name": "CAJA DE INDICADOR DOBLE CON BOTON",
    "price": 10
  },
  {
    "id": "chapa-de-boton-m-m-laqueada-y-grabada-acero",
    "cat": "botoneras",
    "catLabel": "Botoneras",
    "name": "CHAPA DE BOTON M.M. LAQUEADA Y GRABADA ACERO",
    "price": 2.5
  },
  {
    "id": "chapa-de-boton-m-m-laqueada-y-grabada-bronce",
    "cat": "botoneras",
    "catLabel": "Botoneras",
    "name": "CHAPA DE BOTON M.M. LAQUEADA Y GRABADA BRONCE",
    "price": 4.5
  },
  {
    "id": "chapita-cuadrada-de-pulsador",
    "cat": "botoneras",
    "catLabel": "Botoneras",
    "name": "CHAPITA CUADRADA DE PULSADOR",
    "price": 0.7
  },
  {
    "id": "chapita-cuadrada-de-pulsador-bronce",
    "cat": "botoneras",
    "catLabel": "Botoneras",
    "name": "CHAPITA CUADRADA DE PULSADOR BRONCE",
    "price": 1.5
  },
  {
    "id": "chapita-cuadrada-de-pulsador-con-braille",
    "cat": "botoneras",
    "catLabel": "Botoneras",
    "name": "CHAPITA CUADRADA DE PULSADOR CON BRAILLE",
    "price": 2
  },
  {
    "id": "chapita-cuadrada-de-pulsador-con-braille-bronce",
    "cat": "botoneras",
    "catLabel": "Botoneras",
    "name": "CHAPITA CUADRADA DE PULSADOR CON BRAILLE BRONCE",
    "price": 3
  },
  {
    "id": "chapita-cuadrada-de-pulsador-con-braille-con-plastico",
    "cat": "botoneras",
    "catLabel": "Botoneras",
    "name": "CHAPITA CUADRADA DE PULSADOR CON BRAILLE CON PLASTICO",
    "price": 3
  },
  {
    "id": "interruptor-de-parar-sin-modulo",
    "cat": "botoneras",
    "catLabel": "Botoneras",
    "name": "INTERRUPTOR DE PARAR SIN MODULO",
    "price": 1.5
  },
  {
    "id": "led-doble",
    "cat": "botoneras",
    "catLabel": "Botoneras",
    "name": "LED DOBLE",
    "price": 1
  },
  {
    "id": "llave-de-luz-extractor",
    "cat": "botoneras",
    "catLabel": "Botoneras",
    "name": "LLAVE DE LUZ / EXTRACTOR",
    "price": 1.5
  },
  {
    "id": "llave-yale-con-interruptor-aea-con-modulo",
    "cat": "botoneras",
    "catLabel": "Botoneras",
    "name": "LLAVE YALE CON INTERRUPTOR AEA CON MODULO",
    "price": 40
  },
  {
    "id": "llave-yale-con-interruptor-aea-sin-modulo",
    "cat": "botoneras",
    "catLabel": "Botoneras",
    "name": "LLAVE YALE CON INTERRUPTOR AEA SIN MODULO",
    "price": 35
  },
  {
    "id": "llave-yale-con-interruptor-gb-con-modulo",
    "cat": "botoneras",
    "catLabel": "Botoneras",
    "name": "LLAVE YALE CON INTERRUPTOR GB CON MODULO",
    "price": 20
  },
  {
    "id": "llave-yale-con-interruptor-gb-sin-modulo",
    "cat": "botoneras",
    "catLabel": "Botoneras",
    "name": "LLAVE YALE CON INTERRUPTOR GB SIN MODULO",
    "price": 15
  },
  {
    "id": "modulo-con-llave-de-luz-parar-extractor",
    "cat": "botoneras",
    "catLabel": "Botoneras",
    "name": "MODULO CON LLAVE DE LUZ / PARAR / EXTRACTOR",
    "price": 15
  },
  {
    "id": "modulo-de-boton-con-orejas-sin-chapita",
    "cat": "botoneras",
    "catLabel": "Botoneras",
    "name": "MODULO DE BOTON CON OREJAS SIN CHAPITA",
    "price": 2.5
  },
  {
    "id": "modulo-de-boton-m-m-sin-tarjeta",
    "cat": "botoneras",
    "catLabel": "Botoneras",
    "name": "MODULO DE BOTON M.M. SIN TARJETA",
    "price": 5.5
  },
  {
    "id": "modulo-no-fumar",
    "cat": "botoneras",
    "catLabel": "Botoneras",
    "name": "MODULO NO FUMAR",
    "price": 5.5
  },
  {
    "id": "porta-lamparas",
    "cat": "botoneras",
    "catLabel": "Botoneras",
    "name": "PORTA LAMPARAS",
    "price": 13
  },
  {
    "id": "tarjeta-de-leds",
    "cat": "botoneras",
    "catLabel": "Botoneras",
    "name": "TARJETA DE LEDS",
    "price": 20
  },
  {
    "id": "tarjeta-gong-musical",
    "cat": "botoneras",
    "catLabel": "Botoneras",
    "name": "TARJETA GONG MUSICAL",
    "price": 44
  },
  {
    "id": "tarjeta-impresa-boton-digital",
    "cat": "botoneras",
    "catLabel": "Botoneras",
    "name": "TARJETA IMPRESA BOTON DIGITAL",
    "price": 25
  },
  {
    "id": "tarjeta-impresa-boton-m-m",
    "cat": "botoneras",
    "catLabel": "Botoneras",
    "name": "TARJETA IMPRESA BOTON M.M.",
    "price": 7
  },
  {
    "id": "tarjeta-impresa-boton-redondo",
    "cat": "botoneras",
    "catLabel": "Botoneras",
    "name": "TARJETA IMPRESA BOTON REDONDO",
    "price": 7
  },
  {
    "id": "resistencia-de-500-ohms-5-watts",
    "cat": "resistencias",
    "catLabel": "Resistencias",
    "name": "RESISTENCIA DE 500 OHMS 5 WATTS",
    "price": 3
  },
  {
    "id": "resistencia-de-1000-ohms-5-watts",
    "cat": "resistencias",
    "catLabel": "Resistencias",
    "name": "RESISTENCIA DE 1000 OHMS 5 WATTS",
    "price": 3
  },
  {
    "id": "resistencia-de-15-ohms-50-watts",
    "cat": "resistencias",
    "catLabel": "Resistencias",
    "name": "RESISTENCIA DE 15 OHMS 50 WATTS",
    "price": 11
  },
  {
    "id": "resistencia-de-100-ohms-50-watts",
    "cat": "resistencias",
    "catLabel": "Resistencias",
    "name": "RESISTENCIA DE 100 OHMS 50 WATTS",
    "price": 8
  },
  {
    "id": "resistencia-de-300-ohms-30-watts",
    "cat": "resistencias",
    "catLabel": "Resistencias",
    "name": "RESISTENCIA DE 300 OHMS 30 WATTS",
    "price": 8
  },
  {
    "id": "resistencia-de-arranque-espiral-hasta-6-hp",
    "cat": "resistencias",
    "catLabel": "Resistencias",
    "name": "RESISTENCIA DE ARRANQUE ESPIRAL HASTA 6 HP",
    "price": 15
  },
  {
    "id": "resistencia-de-arranque-baja-velocidad-ceramica",
    "cat": "resistencias",
    "catLabel": "Resistencias",
    "name": "RESISTENCIA DE ARRANQUE BAJA VELOCIDAD CERAMICA",
    "price": 35
  },
  {
    "id": "resistencia-de-arranque-alta-velocidad-ceramica",
    "cat": "resistencias",
    "catLabel": "Resistencias",
    "name": "RESISTENCIA DE ARRANQUE ALTA VELOCIDAD CERAMICA",
    "price": 28
  },
  {
    "id": "resistencia-de-1-k",
    "cat": "resistencias",
    "catLabel": "Resistencias",
    "name": "RESISTENCIA DE 1 K",
    "price": 3
  },
  {
    "id": "transformador-de-12v-7w-p-fuente-alfa-9-9",
    "cat": "transformadores",
    "catLabel": "Transformadores",
    "name": "TRANSFORMADOR DE 12V / 7W (P/FUENTE ALFA 9+9)",
    "price": 30
  },
  {
    "id": "transformador-de-24v-15w-p-fuente-alfa-9-9-y-control-22-22-1",
    "cat": "transformadores",
    "catLabel": "Transformadores",
    "name": "TRANSFORMADOR DE 24V / 15W (P/FUENTE ALFA 9+9 Y CONTROL 22+22) 15 VA 380",
    "price": 35
  },
  {
    "id": "transformador-de-300-watts-hidraulico",
    "cat": "transformadores",
    "catLabel": "Transformadores",
    "name": "TRANSFORMADOR DE 300 WATTS HIDRAULICO",
    "price": 130
  },
  {
    "id": "transformador-de-500-watts",
    "cat": "transformadores",
    "catLabel": "Transformadores",
    "name": "TRANSFORMADOR DE 500 WATTS",
    "price": 150
  },
  {
    "id": "transformador-de-600-watts",
    "cat": "transformadores",
    "catLabel": "Transformadores",
    "name": "TRANSFORMADOR DE 600 WATTS",
    "price": 200
  },
  {
    "id": "transformador-de-1000-watts",
    "cat": "transformadores",
    "catLabel": "Transformadores",
    "name": "TRANSFORMADOR DE 1000 WATTS",
    "price": 230
  },
  {
    "id": "accesorios-de-montaje-sensor-magnetico",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "ACCESORIOS DE MONTAJE SENSOR MAGNETICO",
    "price": 17
  },
  {
    "id": "bateria-12v-1-2-a",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "BATERIA 12V 1,2 A",
    "price": 32
  },
  {
    "id": "bornera-de-fuerza-motriz",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "BORNERA DE FUERZA MOTRIZ",
    "price": 4.5
  },
  {
    "id": "bornera-de-seguridad",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "BORNERA DE SEGURIDAD",
    "price": 3.5
  },
  {
    "id": "cabezal-y-placa-reniveladora-para-hidraulico",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "CABEZAL Y PLACA RENIVELADORA PARA HIDRAULICO",
    "price": 160
  },
  {
    "id": "cable-mallado-para-encoder",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "CABLE MALLADO PARA ENCODER",
    "price": 5
  },
  {
    "id": "cable-para-pc-p-51fa-cpttl-pc-c",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "CABLE PARA PC p/51FA  CPTTL/PC-C",
    "price": 8
  },
  {
    "id": "cable-plano-para-duplex-x-metro-sumarle-los-conectores",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "CABLE PLANO PARA DUPLEX X METRO sumarle los conectores",
    "price": 4
  },
  {
    "id": "capacitor-1000-mf-50v",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "CAPACITOR 1000 MF 50V",
    "price": 3
  },
  {
    "id": "capacitor-220-mf-x-160v",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "CAPACITOR 220 MF x 160V",
    "price": 4
  },
  {
    "id": "capacitor-2200-mf-50v",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "CAPACITOR 2200 MF 50V",
    "price": 4
  },
  {
    "id": "cargador-de-bateria-de-12v-1amp",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "CARGADOR DE BATERIA DE 12V - 1AMP",
    "price": 43
  },
  {
    "id": "cinta-mts",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "CINTA/MTS",
    "price": 3
  },
  {
    "id": "conector-de-cable-plano-para-duplex-el-par",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "CONECTOR DE CABLE PLANO PARA DUPLEX el par",
    "price": 4.5
  },
  {
    "id": "conector-de-fibra-optica-emisor-y-receptor",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "CONECTOR DE FIBRA OPTICA (emisor y receptor)",
    "price": 52
  },
  {
    "id": "diodo-3-amp",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "DIODO 3 AMP,",
    "price": 0.5
  },
  {
    "id": "diodo-6-amp-6-a-10",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "DIODO 6 AMP. 6 A 10",
    "price": 1.3
  },
  {
    "id": "disipador",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "DISIPADOR",
    "price": 3
  },
  {
    "id": "display-0-8-pulgada",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "DISPLAY 0,8 Pulgada",
    "price": 4.5
  },
  {
    "id": "display-1-pulgada",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "DISPLAY 1 Pulgada",
    "price": 8.5
  },
  {
    "id": "display-1-8-pulgada-2",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "DISPLAY 1,8 Pulgada (2\")",
    "price": 11
  },
  {
    "id": "display-1-2-pulgada",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "DISPLAY 1/2 Pulgada",
    "price": 4
  },
  {
    "id": "fibra-optica-metro",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "FIBRA OPTICA / METRO",
    "price": 6.5
  },
  {
    "id": "filtro-para-motor-de-puerta",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "FILTRO PARA MOTOR DE PUERTA",
    "price": 13
  },
  {
    "id": "fuente-bc-12-v-2-amp-25-m",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "FUENTE BC 12 V 2 AMP 25 M",
    "price": 35
  },
  {
    "id": "fuente-de-24v-para-botonera-f24bot-incluye-trafo-15va",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "FUENTE DE 24V PARA BOTONERA F24BOT (incluye trafo 15VA)",
    "price": 33
  },
  {
    "id": "fuente-de-24v-regulada-1a-control-electronico-f24r-disipador",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "FUENTE DE 24V REGULADA 1A CONTROL ELECTRONICO F24R + Disipador",
    "price": 40
  },
  {
    "id": "fuente-de-gong-f5vcc",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "FUENTE DE GONG F5Vcc",
    "price": 30
  },
  {
    "id": "fuente-optoacoplada-lleva-2-optos-f24vpm",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "FUENTE OPTOACOPLADA (Lleva 2 optos) F24VPM",
    "price": 35
  },
  {
    "id": "fuente-optoacoplada-lleva-3-optos-f24v4o",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "FUENTE OPTOACOPLADA (Lleva 3 optos) F24V4O",
    "price": 40
  },
  {
    "id": "fuente-para-alfanumerico-findi2da-incluye-trafo-7va-soporta-",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "FUENTE PARA ALFANUMERICO FINDI2DA (Incluye trafo 7VA) (Soporta 3 alfanum.)",
    "price": 29
  },
  {
    "id": "fuente-regulada-3a-p-control-o-alfa-todos-los-pisos-f24r-3",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "FUENTE REGULADA 3A  (P/ Control o Alfa todos los pisos) F24R_3",
    "price": 37
  },
  {
    "id": "fusibles-de-1-2-4-y-6-amp-de-vidrio-30-mm",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "FUSIBLES DE 1, 2, 4 Y 6 AMP. DE VIDRIO 30 mm",
    "price": 0.65
  },
  {
    "id": "tira-de-iman-1-20-mts",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "TIRA DE IMAN 1,20 MTS",
    "price": 12
  },
  {
    "id": "iman-de-15",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "IMAN DE 15",
    "price": 2.5
  },
  {
    "id": "iman-de-20",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "IMAN DE 20",
    "price": 3
  },
  {
    "id": "inductor-infrarrojo-12-24v",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "INDUCTOR INFRARROJO 12/24V",
    "price": 35
  },
  {
    "id": "interfaz-inversora-para-cea-31-inv31",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "INTERFAZ inversora PARA CEA 31 INV31",
    "price": 22
  },
  {
    "id": "interfaz-para-alfanumerico-ia51fa",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "INTERFAZ PARA ALFANUMERICO IA51FA",
    "price": 14
  },
  {
    "id": "lapiz-inductor-efecto-hall-c-u",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "LAPIZ INDUCTOR EFECTO HALL c/u",
    "price": 35
  },
  {
    "id": "juego-de-dos-lapices-con-soporte",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "JUEGO DE DOS LAPICES CON SOPORTE",
    "price": 80
  },
  {
    "id": "led-hiper-rojo-3-mm",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "LED HIPER ROJO 3 mm",
    "price": 0.3
  },
  {
    "id": "led-hiper-rojo-5-mm",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "LED HIPER ROJO 5 mm",
    "price": 0.4
  },
  {
    "id": "limite-honeywell-con-soporte",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "LIMITE HONEYWELL CON SOPORTE",
    "price": 26
  },
  {
    "id": "soporte-limite",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "SOPORTE LIMITE",
    "price": 3.5
  },
  {
    "id": "memoria-e2-programada",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "MEMORIA E2 PROGRAMADA",
    "price": 17
  },
  {
    "id": "memoria-rom-programada",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "MEMORIA ROM PROGRAMADA",
    "price": 27
  },
  {
    "id": "optoacoplador-circ-integrado-4n35",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "OPTOACOPLADOR (Circ. Integrado 4N35)",
    "price": 1.3
  },
  {
    "id": "pantalla-pvc-10-cm",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "PANTALLA PVC 10 CM",
    "price": 1.3
  },
  {
    "id": "pantalla-pvc-30-cm",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "PANTALLA PVC 30 CM",
    "price": 2
  },
  {
    "id": "pantalla-pvc-80-cm",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "PANTALLA PVC 80 CM",
    "price": 3
  },
  {
    "id": "patin-para-pre-apertura",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "PATIN PARA PRE APERTURA",
    "price": 10
  },
  {
    "id": "placa-de-relay-auxiliar-a3r",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "PLACA DE RELAY AUXILIAR A3R",
    "price": 17
  },
  {
    "id": "placa-de-renivelacion-para-hidraulico",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "PLACA DE RENIVELACION PARA HIDRAULICO",
    "price": 18
  },
  {
    "id": "placa-linternas-y-gong-adic-x-parada",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "PLACA LINTERNAS Y GONG ADIC. X PARADA",
    "price": 6.5
  },
  {
    "id": "placa-linternas-y-gong-basico",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "PLACA LINTERNAS Y GONG BASICO",
    "price": 43
  },
  {
    "id": "placa-para-multiplexado-cea-31-mul31",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "PLACA PARA MULTIPLEXADO CEA 31 MUL31",
    "price": 14
  },
  {
    "id": "plaqueta-auxiliar-apas-apad-eav51fa",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "PLAQUETA AUXILIAR APAS APAD EAV51FA",
    "price": 18
  },
  {
    "id": "plaqueta-de-inductor",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "PLAQUETA DE INDUCTOR",
    "price": 27
  },
  {
    "id": "porta-fusible-yeiki-x4",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "PORTA FUSIBLE YEIKI X4",
    "price": 10
  },
  {
    "id": "porta-fusible-yeiki-x6",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "PORTA FUSIBLE YEIKI X6",
    "price": 12
  },
  {
    "id": "rectificador-6-amp-4-diodos-6a10-c-baquelita-p-electromecani",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "RECTIFICADOR 6 AMP. (4 Diodos 6A10 c/baquelita p/electromecanico)",
    "price": 8
  },
  {
    "id": "rectificador-en-pastilla-mb1510-15a-1000v",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "RECTIFICADOR EN PASTILLA MB1510 (15A-1000V)",
    "price": 6.5
  },
  {
    "id": "regulador-de-tension-7824-1-amp",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "REGULADOR DE TENSION 7824 (1 AMP)",
    "price": 2.5
  },
  {
    "id": "regulador-de-tension-lm-350-3a",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "REGULADOR DE TENSION LM 350 (3A)",
    "price": 12
  },
  {
    "id": "relay-110vca-4i-2i-c-zocalo-sin-zocalo-u-s-5",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "RELAY 110VCA 4i, 2i c/zocalo   sin zocalo u$s 5",
    "price": 25
  },
  {
    "id": "relay-24v-4i-c-zocalo-sin-zocalo-u-s-5",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "RELAY 24V 4i c/zocalo    sin zocalo u$s 5",
    "price": 25
  },
  {
    "id": "relay-24v-para-placa-mac-07",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "RELAY 24V PARA PLACA MAC 07",
    "price": 1.65
  },
  {
    "id": "relay-con-zocalo-110v-sin-zocalo-u-s-10-c-u",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "RELAY CON ZOCALO 110V (SIN ZOCALO U$S 10 C/U)",
    "price": 18
  },
  {
    "id": "relay-encap-trp-3124-2-contactos-10amp",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "RELAY ENCAP. TRP 3124 (2 CONTACTOS 10AMP)",
    "price": 17
  },
  {
    "id": "relay-encap-trp-3144-4-contactos-5amp",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "RELAY ENCAP. TRP 3144 (4 CONTACTOS 5AMP)",
    "price": 15
  },
  {
    "id": "relay-tyco-24v-cea-51-fa",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "RELAY TYCO 24V (CEA 51 FA)",
    "price": 8
  },
  {
    "id": "sensor-magnetico-efecto-hall",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "SENSOR MAGNETICO EFECTO HALL",
    "price": 36
  },
  {
    "id": "sintetizador-de-voz-sin-colocacion",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "SINTETIZADOR DE VOZ (SIN COLOCACION)",
    "price": 210
  },
  {
    "id": "soporte-para-limite",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "SOPORTE PARA LIMITE",
    "price": 13
  },
  {
    "id": "switch-zippy",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "SWITCH ZIPPY",
    "price": 1.5
  },
  {
    "id": "tarjeta-de-gong",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "TARJETA DE GONG",
    "price": 17
  },
  {
    "id": "tensor-extremo",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "TENSOR EXTREMO",
    "price": 18
  },
  {
    "id": "tensor-intermedio",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "TENSOR INTERMEDIO",
    "price": 26
  },
  {
    "id": "tymer-no-incluye-bakelita",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "TYMER (no incluye bakelita)",
    "price": 10
  },
  {
    "id": "uln-2803",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "ULN 2803",
    "price": 2.5
  },
  {
    "id": "varilla-roscada-corta",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "VARILLA ROSCADA CORTA",
    "price": 1
  },
  {
    "id": "zener-33v-1w",
    "cat": "varios",
    "catLabel": "Varios (electrónica general)",
    "name": "ZENER 33V 1W",
    "price": 1.5
  }
].map((it) => ({ ...it, image: null }));

function maclarRepuestoImagePath(item) {
  return item.image ? `${maclarRoot()}assets/img/repuestos/${item.image}` : null;
}

function maclarFormatUsd(n) {
  return "U$S " + n.toLocaleString("es-AR", { minimumFractionDigits: n % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 });
}
