# TomyJobs Web

Plataforma web para encontrar y publicar trabajos.

## Inicio Rápido

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Traducciones

El proyecto soporta múltiples idiomas usando `next-intl`. Actualmente disponible en español (es) e inglés (en).

### Agregar un Nuevo Idioma

1. **Agregar el código del idioma** en `src/shared/i18n/config.ts`:
   ```typescript
   export const locales = ['es', 'en', 'fr'] as const; // Agregar 'fr' para francés
   ```

2. **Crear archivo de traducciones** en `src/shared/i18n/messages/`:
   ```bash
   src/shared/i18n/messages/fr.json
   ```

3. **Copiar estructura** de `es.json` o `en.json` y traducir todos los valores:
   ```json
   {
     "common": {
       "welcome": "Bienvenue",
       "loading": "Chargement..."
     }
   }
   ```

4. **Reiniciar el servidor**:
   ```bash
   pnpm dev
   ```

### Usar Traducciones en Componentes

**Componente Cliente:**
```tsx
'use client';
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('common');
  return <button>{t('save')}</button>;
}
```

**Componente Servidor:**
```tsx
import { useTranslations } from 'next-intl';

export default async function MyComponent() {
  const t = await useTranslations('common');
  return <button>{t('save')}</button>;
}
```

### Estructura de Archivos

```
src/
├── shared/
│   └── i18n/
│       ├── config.ts          # Idiomas disponibles
│       ├── request.ts          # Configuración next-intl
│       └── messages/
│           ├── es.json        # Español
│           └── en.json        # Inglés
└── middleware.ts               # Detecta idioma automáticamente
```

**Importante:** Mantén la misma estructura de claves en todos los archivos JSON. Solo cambia los valores traducidos.
