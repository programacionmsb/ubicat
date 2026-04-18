# UbicaT - Instrucciones para Claude Code

## Descripción del proyecto

UbicaT es una app multiplataforma (iOS, Android, Web) que ayuda a usuarios a ubicarse dentro de instituciones como universidades, hospitales y centros comerciales. Mediante mapas visuales 2D gestionados por el propio administrador de la institución, los usuarios pueden buscar salones, oficinas o puntos de interés y ver su ubicación en el plano.

## Stack técnico

- **Framework**: React Native + Expo (SDK más reciente)
- **Lenguaje**: TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Mapas exteriores**: react-native-maps (Google Maps)
- **Mapas interiores**: Leaflet o Mapbox (por decidir)
- **Hosting web**: Vercel
- **Compilación móvil**: EAS Build (Expo)

## Tipos de usuario

1. **Administrador institucional**: carga planos del campus, marca puntos de interés, gestiona contenido de su institución.
2. **Usuario final** (estudiante/visitante): busca lugares, ve mapas, guarda favoritos.

## Modelo de negocio

SaaS B2B. Gratis para usuarios finales. Las instituciones pagan suscripción mensual.

## Principios de código

- Código en TypeScript con tipado estricto.
- Componentes funcionales con Hooks (nada de clases).
- Usar async/await en vez de .then().
- Nombres de variables y funciones en inglés (código), comentarios en español.
- Seguir convenciones estándar de React Native y Expo.
- Explicar conceptos nuevos cuando el usuario no los conozca (es nivel intermedio en JS/TS).

## Estructura de carpetas (objetivo)

src/
├── screens/ # Pantallas de la app
├── components/ # Componentes reutilizables
├── services/ # Lógica con Supabase y APIs
├── hooks/ # Custom hooks
├── utils/ # Funciones auxiliares
├── types/ # Tipos TypeScript
└── navigation/ # Configuración de rutas

## Cómo trabajar conmigo (el desarrollador)

- Tengo nivel intermedio de programación pero estoy aprendiendo JavaScript/TypeScript.
- Explícame los conceptos nuevos cuando los uses, de forma breve.
- Ve paso a paso, no me lances todo de golpe.
- Cuando propongas código, primero describe QUÉ vas a hacer y por qué, luego muestra el código.
- Si hay decisiones arquitectónicas importantes, pregúntame antes de asumirlas.
- Después de cada cambio importante, recuérdame hacer commit a Git.
