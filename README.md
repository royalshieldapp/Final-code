# Final-code

Royal Shield ahora incluye una versión web ligera para probar las funciones clave del panel de seguridad sin necesidad de compilar la app Android.

## Estructura
- `firebase-encoders-proto.zip`: contiene el proyecto Android original (Royal Shield) tal como venía en el repositorio.
- `web-app/`: panel web estático con las mismas acciones principales que la app móvil.

## Cómo probar la versión web
1. Abre el archivo `web-app/index.html` directamente en tu navegador, o levanta un servidor estático:
   ```bash
   cd web-app
   python -m http.server 8000
   ```
2. Visita `http://localhost:8000` para usar el panel: activa/desactiva la alarma, solicita acompañamientos, bloquea URLs y completa el formulario de registro.

La interfaz refleja el estilo dorado/negro de Royal Shield y mantiene la bitácora de acciones en vivo.

## Cómo ejecutar pruebas
Las pruebas unitarias usan el ejecutor nativo de Node. Desde la raíz del repositorio:

```bash
npm test
```
