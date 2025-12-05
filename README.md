# TomyJobs Web

Plataforma web para encontrar y publicar trabajos.

## Inicio Rápido

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Configurar Traducciones

### ¿Dónde están los textos traducidos?

Todos los textos que ves en el sitio web están guardados en archivos JSON dentro de la carpeta:

```
src/shared/i18n/messages/
```

Hay un archivo por cada idioma:

- `es.json` - Textos en español
- `en.json` - Textos en inglés

hay que crear los faltantes

### ¿Cómo editar o traducir un texto?

1. **Abre el archivo del idioma** que quieres editar (por ejemplo: `es.json`)

2. **Busca el texto** que quieres cambiar. Los textos están organizados por secciones:

   ```json
   {
     "common": {
       "welcome": "Bienvenido",
       "loading": "Cargando..."
     },
     "home": {
       "title": "Encuentra tu trabajo ideal"
     }
   }
   ```

3. **Cambia solo el valor** (lo que está después de los dos puntos `:`):

   - Correcto: `"welcome": "Bienvenido a TomyJobs"`
   - Incorrecto: Cambiar `"welcome"` por otro nombre

4. **Guarda el archivo** y los cambios se verán automáticamente

### Agregar un nuevo idioma (ejemplo: francés)

1. **Copia el archivo** `es.json` y renómbralo a `fr.json`

2. **Traduce todos los textos** en el archivo `fr.json`:

   ```json
   {
     "common": {
       "welcome": "Bienvenue",  ← Cambia esto
       "loading": "Chargement..." ← Y esto
     }
   }
   ```

3. **Abre el archivo** `src/shared/i18n/config.ts` y agrega `'fr'` a la lista:

   ```typescript
   export const locales = ["es", "en", "fr"] as const;
   ```

4. **Reinicia el servidor** para ver los cambios

### Reglas importantes

- **SÍ puedes cambiar**: Los textos después de los dos puntos (`"welcome": "Tu texto aquí"`)
- **NO cambies**: Los nombres de las claves (`"welcome"`, `"loading"`, etc.)
- **Mantén la misma estructura**: Todos los archivos de idioma deben tener las mismas claves
- **Usa comillas dobles**: En JSON siempre usa `"texto"` no `'texto'`
