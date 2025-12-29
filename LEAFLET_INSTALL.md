# Instalación de Leaflet para mostrar mapas

Para mostrar los mapas en la vista de detalle del historial de sesiones, necesitas instalar las siguientes dependencias:

```bash
npm install leaflet react-leaflet
npm install -D @types/leaflet
```

## Por qué usar Leaflet?

Leaflet es una excelente opción para mostrar mapas en tu aplicación por las siguientes razones:

1. **Gratuito y Open Source**: No requiere API key ni tiene costos de uso
2. **Ligero**: El tamaño del bundle es pequeño en comparación con otras soluciones
3. **Fácil de usar**: API simple y bien documentada
4. **Flexible**: Permite personalización avanzada si es necesario
5. **Mapas OpenStreetMap**: Usa mapas gratuitos de alta calidad
6. **React Integration**: react-leaflet proporciona componentes React optimizados

## Alternativas Consideradas

### Google Maps
- **Ventajas**: Mapas muy detallados, amplia cobertura
- **Desventajas**: Requiere API key, tiene límites de uso, puede ser costoso

### Mapbox
- **Ventajas**: Mapas personalizados, API moderna
- **Desventajas**: Requiere API key, tiene límites de uso gratuitos

### Leaflet (Elección recomendada)
- **Ventajas**: Gratuito, sin API key, ligero, flexible
- **Desventajas**: Mapas menos detallados que Google Maps en algunas regiones

## Uso en la Aplicación

El componente de detalle del historial de sesiones ya incluye:

1. Mapa interactivo con marcador en la ubicación exacta
2. Popup con información de la sesión
3. Coordenadas de latitud y longitud
4. Diseño responsive que funciona en todos los dispositivos

## Notas Importantes

- Los mapas solo se muestran si hay coordenadas registradas
- Los usuarios deben dar permiso de ubicación para registrar las coordenadas
- Si no hay ubicación, se muestra un mensaje informativo
