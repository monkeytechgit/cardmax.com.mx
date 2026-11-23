/* ==========================================================================
   Calificaciones por producto — CardMax
   --------------------------------------------------------------------------
   Datos comerciales reportados por CardMax para mostrarse en el catálogo.
   Para actualizarlos, cambia "promedio" (0 a 5) y "calificaciones" (total).

   IMPORTANTE
   - Estos valores solo se muestran en la interfaz (estrellas, promedio y
     total en cada producto). NO se publican en los datos estructurados de
     Google (JSON-LD) mientras "procedenciaConfirmada" sea false.
   - Antes de cambiarlo a true, conserva el respaldo de origen (exportación
     del formulario o sistema de calificaciones) por si Google o Profeco
     lo solicitan.
   - Este archivo no contiene comentarios, nombres ni reseñas individuales.
     Las reseñas escritas se publican aparte, en cada página de producto.
   ========================================================================== */
window.CARDMAX_CALIFICACIONES = {
  procedenciaConfirmada: false,
  fuente: "Reportado por CardMax al equipo de desarrollo (noviembre 2026). Pendiente de confirmar procedencia.",

  // La clave es el archivo de la página del producto
  productos: {
    "credenciales-empresariales.html": { promedio: 4.9, calificaciones: 1060 },
    "pvc.html": { promedio: 4.9, calificaciones: 940 },
    "credenciales-escolares.html": { promedio: 5.0, calificaciones: 1100 },
    "tarjeta-pvc-personalizada.html": { promedio: 4.9, calificaciones: 1080 },
    "tarjetas-pvc-color.html": { promedio: 4.9, calificaciones: 1043 },
    "tarjeta-presentacion-digital-nfc.html": {
      promedio: 4.5,
      calificaciones: 1021,
      nota: "Promedio recibido como \"45\" / \"4.5*\": pendiente de confirmar con CardMax.",
    },
    "tarjeta-social-nfc.html": { promedio: 5.0, calificaciones: 1061 },
    "tarjeta-nfc-metalica.html": { promedio: 5.0, calificaciones: 1080 },

    // TapLoop: se recibió una sola cifra para "TapLoop PVC y metálica".
    // Se muestra en ambas páginas como cifra de la línea TapLoop.
    "tarjeta-presentacion-digital-taploop-pvc.html": {
      promedio: 5.0,
      calificaciones: 1070,
      etiqueta: "calificaciones de TapLoop",
    },
    "tarjeta-presentacion-digital-taploop-metalica.html": {
      promedio: 5.0,
      calificaciones: 1070,
      etiqueta: "calificaciones de TapLoop",
    },
  },
};
