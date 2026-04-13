# TechCup - Frontend

Sistema web para la gestión del torneo relámpago de fútbol de la Decanatura de Ingeniería de Sistemas de la Escuela Colombiana de Ingeniería Julio Garavito.

## Tabla de Contenidos

- [Integrantes](#integrantes)
- [Contexto del Proyecto](#contexto-del-proyecto)
- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Scripts Disponibles](#scripts-disponibles)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Arquitectura Frontend](#arquitectura-frontend)
- [Pantallas Implementadas](#pantallas-implementadas)
- [Estado Actual del Desarrollo](#estado-actual-del-desarrollo)
- [Identidad Visual](#identidad-visual)
- [Flujo de Trabajo](#flujo-de-trabajo)
- [Documentación Adicional](#documentación-adicional)

---

## Integrantes

**Squad DOSW - Testigos de Jehová**

- Cristian Adrian Ducuara Quiñonez
- Cristian Ronaldo Guerrero Buitrago
- Javier Mauricio Romero Deaquiz
- Juan Esteban Tellez Valencia
- Juan Sebastian Gonzalez Aranguren

---

## Contexto del Proyecto

Esta aplicación surge para solucionar los problemas de organización del torneo relámpago de fútbol organizado por la Decanatura de Ingeniería de Sistemas de la Escuela Colombiana de Ingeniería.

### Problemática Actual

Actualmente, la gestión del torneo se realiza de manera manual mediante:
- Mensajes en WhatsApp
- Formularios aislados
- Hojas de cálculo desorganizadas

Esto genera:
- Desorden en la información
- Dificultad de acceso a datos importantes
- Falta de claridad para los participantes

### Solución Propuesta

La plataforma TechCup centraliza toda la información del torneo en un sistema unificado, permitiendo gestionar de manera organizada:
- Inscripción de jugadores
- Creación y gestión de equipos
- Registro de partidos
- Tabla de posiciones en tiempo real
- Llaves eliminatorias
- Calendario de encuentros

---

## Descripción

TechCup es una aplicación web moderna construida con React, TypeScript y Vite que proporciona una interfaz intuitiva y responsive para la gestión completa del torneo universitario de fútbol.

---

## Tecnologías

### Core
- **React** 18.3.1 - Librería para interfaces de usuario
- **TypeScript** 5.6.2 - Tipado estático
- **Vite** 6.0.1 - Build tool de nueva generación

### Routing y Navegación
- **React Router DOM** 7.1.1 - Enrutamiento declarativo

### Estilos
- **CSS Modules** - Estilos con alcance modular
- **Variables CSS** - Sistema de diseño consistente

### Calidad de Código
- **ESLint** - Análisis estático
- **Prettier** - Formateo automático

### HTTP Client (Preparado para integración)
- **Axios** - Cliente HTTP para consumo de APIs REST

---

## Requisitos Previos

- Node.js v20.x o superior
- npm v10.x o superior
- Git

Verificar versiones instaladas:

```bash
node --version
npm --version
git --version
```

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Cove1946/TechCup-FRONTEND.git
cd TechCup-FRONTEND
```

### 2. Cambiar a la rama de desarrollo

```bash
git checkout develop
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Ejecutar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

---

## Configuración

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# URL del Backend (cuando esté disponible)
VITE_API_URL=http://localhost:8080/api

# Ambiente actual
VITE_ENV=development
```

**Nota:** El archivo `.env` no debe ser commiteado al repositorio (está en `.gitignore`).

---

## Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo con hot-reload

# Build
npm run build        # Compila el proyecto para producción
npm run preview      # Previsualiza el build de producción

# Calidad de Código
npm run lint         # Ejecuta ESLint
npm run format       # Formatea código con Prettier
```

---

## Estructura del Proyecto

```bash
El proyecto sigue una **arquitectura domain-driven** para facilitar el mantenimiento y escalabilidad:
src/
├── assets/              # Recursos estáticos
│   ├── images/          # Imágenes y logos
│   ├── icons/           # Iconos
│   └── fonts/           # Tipografías
│
├── components/          # Componentes reutilizables
│   ├── ui/              # Componentes de interfaz base
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Card/
│   │   ├── Badge/
│   │   └── Pagination/
│   ├── layout/          # Componentes de estructura
│   │   ├── Navbar/
│   │   └── MainLayout/
│   └── common/          # Componentes compartidos
│       └── Logo/
│
├── features/            # Módulos por funcionalidad (domain-driven)
│   ├── auth/            # Autenticación y registro
│   │   ├── components/  # LoginForm, RegisterForm
│   │   ├── hooks/       # useAuth
│   │   ├── services/    # authService (preparado para API)
│   │   ├── types/       # Interfaces y DTOs
│   │   └── index.ts     # Exports públicos
│   ├── teams/           # Gestión de equipos
│   ├── tournaments/     # Gestión de torneos
│   └── players/         # Gestión de jugadores
│
├── pages/               # Vistas principales (orquestadores)
│   ├── WelcomePage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   ├── ProfilePage.tsx
│   ├── TeamsPage.tsx
│   ├── CalendarPage.tsx
│   └── TournamentDetailPage.tsx
│
├── hooks/               # Custom hooks globales
│   ├── useLocalStorage.ts
│   └── useDebounce.ts
│
├── services/            # Configuración de servicios externos
│   ├── api.ts           # Cliente Axios configurado
│   └── httpClient.ts    # Interceptores y manejo de errores
│
├── store/               # Estado global (Context API / Zustand)
│   └── index.ts
│
├── types/               # Tipos TypeScript globales
│   ├── common.types.ts
│   └── api.types.ts
│
├── utils/               # Funciones helper
│   ├── formatters.ts
│   └── validators.ts
│
├── routes/              # Configuración de rutas
│   └── AppRoutes.tsx
│
└── styles/              # Estilos globales
├── globals.css
└── variables.css    # Variables de diseño
```

### Principios de Organización

1. **Domain-Driven Design (DDD)**
    - Cada feature es un módulo independiente con toda su lógica
    - Facilita la colaboración en equipo
    - Permite escalar el proyecto sin conflictos

2. **Separación de Responsabilidades**
    - **Pages:** Orquestan features y layout
    - **Components:** Solo presentación (UI pura)
    - **Hooks:** Lógica de negocio reutilizable
    - **Services:** Comunicación con APIs

3. **Reutilización**
    - Componentes UI genéricos en `components/ui/`
    - Hooks compartidos en `hooks/`
    - Utilidades en `utils/`

4. **Type Safety**
    - TypeScript en el 100% del código
    - Interfaces y DTOs bien definidos
    - Prevención de errores en tiempo de desarrollo

---

## Arquitectura Frontend

### Patrón de Arquitectura: Feature-Based (Domain-Driven)

Cada funcionalidad del negocio está completamente encapsulada en su propio módulo:
features/auth/

```bash
├── components/          # Componentes específicos del dominio
│   ├── LoginForm.tsx
│   ├── LoginForm.module.css
│   └── RegisterForm.tsx
├── hooks/               # Lógica de negocio del dominio
│   ├── useAuth.ts
│   └── index.ts
├── services/            # Llamadas a la API
│   ├── authService.ts
│   └── index.ts
├── types/               # Tipos específicos del dominio
│   ├── auth.types.ts
│   └── index.ts
└── index.ts             # Punto de entrada público
```


### Flujo de Datos
Usuario interactúa con
↓
Page (Ej: LoginPage)
↓
Feature Component (LoginForm)
↓
Custom Hook (useAuth)
↓
Service (authService) ← Preparado para conectar con Backend
↓
API REST (Pendiente de integración)

### Ventajas de esta Arquitectura

- **Modularidad:** Cada feature puede desarrollarse independientemente
- **Testabilidad:** Fácil de probar cada módulo por separado
- **Escalabilidad:** Agregar nuevas funcionalidades no afecta las existentes
- **Mantenibilidad:** El código está organizado por dominio de negocio
- **Colaboración:** Varios desarrolladores pueden trabajar en paralelo

### Ejemplo de Implementación

**Hook personalizado (useAuth):**
```typescript
export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulación temporal - se reemplazará con llamada real a API
      const mockResponse = {
        user: { id: '1', email: credentials.email, name: 'Usuario Demo' },
        token: 'mock-token-123'
      };

      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
      
      navigate('/dashboard');
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
```

**Servicio preparado para integración:**
```typescript
// src/features/auth/services/authService.ts
import apiClient from '@services/api';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Cuando el backend esté disponible, descomentar:
    // const { data } = await apiClient.post('/auth/login', credentials);
    // return data;
    
    // Actualmente retorna mock data
    return {
      user: { id: '1', email: credentials.email, name: 'Usuario' },
      token: 'temp-token'
    };
  }
};
```

---

## Pantallas Implementadas

### Pantallas Públicas (Sin autenticación requerida)

| Ruta | Pantalla | Descripción |
|------|----------|-------------|
| `/` | Welcome | Landing page con información del torneo y acceso al sistema |
| `/login` | Login | Autenticación de usuarios registrados |
| `/register` | Register | Registro de nuevos usuarios y jugadores |

### Pantallas Privadas (Requieren autenticación)

| Ruta | Pantalla | Descripción |
|------|----------|-------------|
| `/dashboard` | Dashboard | Vista principal con estadísticas del torneo y próximos partidos |
| `/profile` | Profile | Perfil de usuario editable (datos personales, foto, posición) |
| `/teams` | Teams | Listado de equipos participantes con estadísticas |
| `/teams/:id` | Team Detail | Información detallada de un equipo específico |
| `/calendar` | Calendar | Calendario de partidos (próximos y pasados) |
| `/tournament/:id` | Tournament Detail | Tabla de posiciones y estadísticas del torneo |

### Características de las Pantallas

- **Diseño Responsive:** Adaptadas para mobile, tablet y desktop
- **Estados Visuales:**
    - Loading states con spinners
    - Error states con mensajes claros
    - Empty states cuando no hay datos
- **Validación de Formularios:**
    - Validación en tiempo real
    - Mensajes de error específicos
    - Feedback visual inmediato
- **Navegación Intuitiva:**
    - Navbar persistente
    - Rutas protegidas con redirección
    - Breadcrumbs en páginas anidadas
- **UX/UI Consistente:**
    - Paleta de colores del manual de identidad
    - Tipografía Inter
    - Componentes reutilizables

---

## Estado Actual del Desarrollo

### Completado (Sprint #4)

- **Estructura del Proyecto**
    - Scaffolding completo según arquitectura domain-driven
    - Configuración de ESLint y Prettier
    - Sistema de rutas con React Router

- **Componentes UI Base**
    - Button (4 variantes)
    - Input con validación
    - Card con estados hover
    - Badge para estados
    - Pagination

- **Layouts y Navegación**
    - Navbar responsive
    - MainLayout con sidebar
    - Logo corporativo

- **Features Implementadas**
    - Autenticación (login/register) con validación
    - Gestión de perfil de usuario
    - Visualización de equipos
    - Calendario de partidos
    - Tabla de posiciones

- **Pantallas Completas**
    - 8 pantallas principales implementadas
    - Flujos de navegación funcionales
    - Estados loading/error/empty en todas las vistas

### Pendiente (Próximos Sprints)

- **Integración con Backend**
    - Conectar servicios con API REST real
    - Implementar autenticación JWT
    - Manejo de tokens y refresh tokens
    - Integración completa de endpoints

- **Despliegue**
    - Pipeline CI/CD con GitHub Actions
    - Deploy en Azure App Services (QA)
    - Deploy en Azure App Services (Producción)
    - Configuración de dominios

- **Funcionalidades Adicionales**
    - Sistema de notificaciones en tiempo real
    - Chat entre jugadores del mismo equipo
    - Subida de imágenes de perfil
    - Exportación de estadísticas a PDF

### Preparación para Integración

La capa de servicios está lista para conectar con el backend:

```typescript
// Actualmente con mock data
const mockData = { /* ... */ };

// Preparado para integración real
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' }
});
```

Cuando el backend esté disponible, solo se necesita:
1. Actualizar `VITE_API_URL` en `.env`
2. Descomentar las llamadas reales en los servicios
3. Ajustar interfaces de tipos según contratos de API

---

## Identidad Visual

### Logotipo

![Logo TechCup](src/assets/Logo.png)

### Manual de Identidad

El manual completo de identidad visual incluye:
- Versiones del logotipo
- Paleta de colores corporativa
- Tipografía oficial
- Usos correctos e incorrectos
- Aplicaciones en diferentes medios

**Documento:** [Manual_Identidad_TechCupV2.pptx](public/Manual_Identidad_TechCupV2.pptx)

### Mockups

Todos los diseños y flujos de usuario están documentados en Figma:

**Link:** [Ver Mockups en Figma](https://www.figma.com/design/vnZ5KN4CDMi8ohz692xph6/TechCup?node-id=0-1&t=7Wmyw3SoKcW07qkJ-1)

---

## Flujo de Trabajo

### Git Flow

Utilizamos un flujo basado en ramas para desarrollo organizado:
main (producción)
↑
merge con PR y aprobación
↑
develop (staging)
↑
merge cuando feature está completo
↑
feature/nombre-funcionalidad
### Crear una Nueva Feature

1. Asegurarse de estar en `develop` actualizado:

```bash
git checkout develop
git pull origin develop
```

2. Crear rama de feature:

```bash
git checkout -b feature/nombre-descriptivo
```

3. Desarrollar y hacer commits:

```bash
git add .
git commit -m "feat: descripción del cambio"
```

4. Subir rama y crear Pull Request:

```bash
git push origin feature/nombre-descriptivo
```

5. Solicitar revisión de código al equipo

### Convenciones de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Formateo, espacios, etc.
- `refactor:` Refactorización sin cambiar funcionalidad
- `test:` Agregar o modificar tests
- `chore:` Tareas de mantenimiento

**Ejemplos:**
```bash
git commit -m "feat: implementar formulario de registro de equipos"
git commit -m "fix: corregir validación de email en LoginForm"
git commit -m "docs: actualizar README con instrucciones de despliegue"
```

---

## Documentación Adicional

### Documentos del Proyecto

- [Manual de Identidad Visual](./public/Manual_Identidad_TechCupV2.pptx)
- [Mockups en Figma](https://www.figma.com/design/vnZ5KN4CDMi8ohz692xph6/TechCup)

### Repositorios Relacionados

- **Backend:** [TechCup-Backend](https://github.com/JuanTellez125/TECHCUP-BackEnd.git) 
### Enlaces Útiles

- [Gestión de Proyecto en JIRA](https://team-dosw-cristian.atlassian.net/jira/software/projects/TDJ/summary)

---

## Licencia

Este proyecto es parte de un ejercicio académico de la **Escuela Colombiana de Ingeniería Julio Garavito** para la asignatura de Procesos de Desarrollo de Software. No tiene fines comerciales.

---

## Contacto

Para consultas sobre el proyecto, contactar a cualquier miembro del equipo a través del canal de Microsoft Teams del curso o por correo institucional.

---

**Desarrollado por Squad DOSW - Testigos de Jehová | 2026**