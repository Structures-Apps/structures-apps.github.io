# structures-apps.github.io

Web pública de la suite **Structures Hub**: <https://structures-apps.github.io>. La publica GitHub Pages desde
`main` (carpeta raíz) en un par de minutos tras cada `git push`.

Se trabaja desde `structures-hub`, donde este repo se clona en `web/`. Diseño: dirección B «Editorial claro»,
solo tema claro (ver `docs/DECISIONES.md` en `structures-hub`).

| Archivo | Qué es |
| --- | --- |
| `index.html` | La página (textos en español; el inglés está en `app.js`, clave por clave en `data-t`) |
| `estilos.css` | Estilos y animaciones (respeta `prefers-reduced-motion`) |
| `app.js` | Idioma, tarjetas, versiones en vivo (`catalogo()`), descarga (`enlace-descarga`) y la demo del lanzador |
| `herramientas.json` | Tarjetas de las herramientas. **Al añadir una herramienta a la suite, añádela aquí** (ver `docs/NUEVA_HERRAMIENTA.md`) |
| `monogramas/` | Monogramas `<id>_128.png`, copiados de `suite_estilo/monogramas` |

**Al cambiar `estilos.css` o `app.js`, sube el `?v=` de sus enlaces en `index.html`**: GitHub Pages deja que el
navegador guarde cada archivo 10 minutos y, sin eso, una página nueva puede cargarse con los estilos viejos
(pasó el 2026-11-11).

Sin compilación ni dependencias. Para probar en local: `python -m http.server` en esta carpeta y abrir
<http://localhost:8000>. La clave del servicio que lleva `app.js` es la *publishable*, pública por diseño.
