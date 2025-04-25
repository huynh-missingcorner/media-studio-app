# 🛠️ Technical Specification Document

## Project: Vertex AI Media Studio Wrapper – Frontend App

---

## 1. Architecture Overview

### 1.1 High-Level Architecture

The application follows a client-side architecture with the following key architectural patterns:

- **Component-Based Architecture**: Using React's component model with functional components
- **State Management**: Centralized state management using Zustand stores
- **API Communication**: REST API calls using Axios + real-time updates via WebSockets
- **Routing**: Client-side routing with React Router v6
- **Theming**: Theme context for light/dark mode support
- **Authentication**: JWT-based authentication with secure token handling

### 1.2 Folder Structure

```
/src
  /assets
    /fonts           # Custom fonts
    /images          # Static images
  /components
    /custom          # Project-specific components
      /auth          # Authentication-related components
      /layout        # Layout components (Navbar, Sidebar, etc.)
      /media         # Media generation components
      /projects      # Project management components
      /profile       # User profile components
    /ui              # Shadcn UI components
  /contexts          # React contexts (Theme, Auth, etc.)
  /hooks             # Custom React hooks
  /interfaces        # TypeScript interfaces
  /lib               # Utility libraries and configurations
    /utils           # Helper functions
    /constants       # Application constants
    /validations     # Form validation schemas
  /pages             # Page components organized by route
    /auth            # Authentication pages
    /app             # Main application pages
    /admin           # Admin-only pages
  /services          # API service modules
  /stores            # Zustand state stores
  /types             # TypeScript type definitions
  App.tsx            # Main App component
  main.tsx           # Entry point
  index.css          # Global CSS
```

### 1.3 Key Dependencies

- **Core**: React (18.3.x), TypeScript (5.6.x), Vite (5.4.x)
- **UI**: TailwindCSS (3.4.x), Shadcn UI (with Radix UI primitives)
- **State Management**: Zustand (5.0.x)
- **Routing**: React Router (6.28.x)
- **API Communication**: Axios (1.8.x), Socket.IO Client (4.8.x)
- **Animation**: Framer Motion (11.11.x)
- **Utilities**: class-variance-authority, tailwind-merge, clsx

---

## 2. Core Functionalities

### 2.1 Authentication System

#### Implementation Details

- **Authentication Flow**:

  - User enters credentials (email/password)
  - Frontend sends credentials to backend API
  - Backend validates and returns JWT (access & refresh tokens)
  - Frontend stores tokens (localStorage or httpOnly cookies)
  - Access token attached to subsequent API requests
  - Refresh token used to obtain new access token when expired

- **Token Management**:

  - Access token expiry: 1 hour
  - Refresh token expiry: 7 days
  - Auto-refresh mechanism when access token expires

- **Protected Routes**:
  - Higher-order component wrapping routes requiring authentication
  - Role-based access control (Admin vs Regular users)

#### Key Components

- `AuthProvider.tsx`: Context provider for auth state
- `authStore.ts`: Zustand store for auth state
- `authService.ts`: API methods for auth operations
- `ProtectedRoute.tsx`: HOC for route protection
- `LoginForm.tsx`: Login form component
- `SignupForm.tsx`: Registration form component
- `PasswordResetForm.tsx`: Password reset form

#### State Structure

```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  refreshAccessToken: () => Promise<void>;
}
```

### 2.2 Media Generation

#### Implementation Details

- **Media Types**:

  - Image Generation
  - Audio Generation
  - Music Generation
  - Video Generation

- **Generation Flow**:

  1. User selects media type
  2. User enters prompt and customizes parameters
  3. Frontend sends request to backend API
  4. Backend initiates generation via Vertex AI Media Studio
  5. WebSocket connection provides real-time status updates
  6. Frontend displays generation status and result preview
  7. User can download generated media

- **Parameters by Media Type**:
  - **Image**: Width, height, style, negative prompt, etc.
  - **Audio**: Duration, voice type, speed, etc.
  - **Music**: Duration, genre, mood, tempo, etc.
  - **Video**: Duration, style, resolution, fps, etc.

#### Key Components

- `MediaTypeTabs.tsx`: Tab navigation for media types
- `PromptInput.tsx`: Prompt input field with validation
- `SettingsPanel.tsx`: Dynamic parameters based on media type
- `MediaPreview.tsx`: Preview of generated media
- `MediaHistory.tsx`: History of generated media
- `mediaStore.ts`: Zustand store for media state
- `mediaService.ts`: API methods for media operations
- `useSocket.ts`: Hook for WebSocket connection

#### State Structure

```typescript
interface MediaState {
  mediaType: MediaType; // 'IMAGE' | 'AUDIO' | 'MUSIC' | 'VIDEO'
  prompt: string;
  parameters: Record<string, any>; // Dynamic based on media type
  isGenerating: boolean;
  generationProgress: number;
  generationStatus: string;
  generatedMedia: Media | null;
  history: Media[];
  error: string | null;
  setMediaType: (type: MediaType) => void;
  setPrompt: (prompt: string) => void;
  setParameter: (key: string, value: any) => void;
  generateMedia: () => Promise<void>;
  updateGenerationStatus: (status: GenerationStatus) => void;
  fetchHistory: () => Promise<void>;
}
```

### 2.3 Project Management

#### Implementation Details

- **Projects**:

  - Each user belongs to one or more projects
  - Projects have different settings and API limits
  - Admin can create/edit/delete projects and assign users

- **Project Flow**:
  1. User selects active project from dropdown
  2. Selected project context affects API calls
  3. Admins can access project management UI
  4. Project settings determine available media types and parameters

#### Key Components

- `ProjectSelector.tsx`: Dropdown for project selection
- `ProjectForm.tsx`: Form for creating/editing projects
- `ProjectList.tsx`: Admin view of all projects
- `projectStore.ts`: Zustand store for project state
- `projectService.ts`: API methods for project operations

#### State Structure

```typescript
interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  setCurrentProject: (id: string) => void;
  createProject: (data: ProjectData) => Promise<void>;
  updateProject: (id: string, data: ProjectData) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}
```

### 2.4 User Interface

#### Implementation Details

- **Theme System**:

  - Light/dark mode toggle
  - System preference detection
  - Theme persistence in localStorage

- **Responsive Design**:

  - Mobile-first approach
  - Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
  - Collapsible sidebar on smaller screens
  - Adaptive layouts for different screen sizes

- **UI Components**:
  - Shadcn UI components for consistent design
  - Custom components for specific project needs
  - Toast notifications for feedback
  - Modals for forms and confirmations
  - Skeleton loaders for loading states

#### Key Components

- `ThemeProvider.tsx`: Context provider for theme state
- `Layout.tsx`: Main application layout
- `Navbar.tsx`: Top navigation bar
- `Sidebar.tsx`: Side navigation with media type tabs
- `Toast.tsx`: Toast notification component
- `Modal.tsx`: Modal dialog component

---

## 3. API Integration

### 3.1 Backend API

#### Endpoints

- **Authentication**:

  - `POST /api/auth/login`: User login
  - `POST /api/auth/signup`: User registration
  - `POST /api/auth/refresh`: Refresh access token
  - `POST /api/auth/reset-password`: Password reset request
  - `POST /api/auth/set-password`: Set new password

- **Media**:

  - `POST /api/media/generate`: Generate media
  - `GET /api/media`: Get user's media history
  - `GET /api/media/:id`: Get specific media details
  - `DELETE /api/media/:id`: Delete media

- **Projects**:

  - `GET /api/projects`: Get user's projects
  - `POST /api/projects`: Create new project
  - `GET /api/projects/:id`: Get project details
  - `PUT /api/projects/:id`: Update project
  - `DELETE /api/projects/:id`: Delete project
  - `POST /api/projects/:id/users`: Add user to project
  - `DELETE /api/projects/:id/users/:userId`: Remove user from project

- **User**:
  - `GET /api/user/profile`: Get user profile
  - `PUT /api/user/profile`: Update user profile
  - `GET /api/user/api-keys`: Get user API keys
  - `POST /api/user/api-keys`: Create new API key
  - `DELETE /api/user/api-keys/:id`: Delete API key

### 3.2 WebSocket

#### Events

- **Connection**:

  - `connect`: Connection established
  - `disconnect`: Connection closed
  - `error`: Connection error

- **Media Generation**:
  - `media:start`: Generation started
  - `media:progress`: Generation progress update
  - `media:complete`: Generation completed
  - `media:error`: Generation error

#### Implementation

```typescript
// hooks/useSocket.ts
import { useEffect, useState } from "react";
import { socket } from "../lib/socket";
import { useAuthStore } from "../stores/authStore";
import { useMediaStore } from "../stores/mediaStore";

export function useSocket() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const { accessToken } = useAuthStore();
  const { updateGenerationStatus } = useMediaStore();

  useEffect(() => {
    if (!accessToken) return;

    // Connect and authenticate
    socket.auth = { token: accessToken };
    socket.connect();

    // Event handlers
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    const onMediaStart = (data) =>
      updateGenerationStatus({ status: "started", ...data });
    const onMediaProgress = (data) =>
      updateGenerationStatus({ status: "progress", ...data });
    const onMediaComplete = (data) =>
      updateGenerationStatus({ status: "completed", ...data });
    const onMediaError = (data) =>
      updateGenerationStatus({ status: "error", ...data });

    // Register events
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("media:start", onMediaStart);
    socket.on("media:progress", onMediaProgress);
    socket.on("media:complete", onMediaComplete);
    socket.on("media:error", onMediaError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("media:start", onMediaStart);
      socket.off("media:progress", onMediaProgress);
      socket.off("media:complete", onMediaComplete);
      socket.off("media:error", onMediaError);
      socket.disconnect();
    };
  }, [accessToken, updateGenerationStatus]);

  return { isConnected };
}
```

---

## 4. State Management

### 4.1 Zustand Stores

#### Auth Store

```typescript
// stores/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../services/authService";
import { User } from "../interfaces/user";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { user, accessToken, refreshToken } = await authService.login(
            email,
            password
          );
          set({ user, accessToken, refreshToken, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      signup: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const { user, accessToken, refreshToken } = await authService.signup(
            userData
          );
          set({ user, accessToken, refreshToken, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      logout: () => {
        authService.logout();
        set({ user: null, accessToken: null, refreshToken: null });
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return;

        try {
          const { accessToken } = await authService.refreshToken(refreshToken);
          set({ accessToken });
        } catch (error) {
          set({ user: null, accessToken: null, refreshToken: null });
        }
      },

      resetPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          await authService.resetPassword(email);
          set({ isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
```

#### Media Store

```typescript
// stores/mediaStore.ts
import { create } from "zustand";
import { mediaService } from "../services/mediaService";
import { MediaType, Media, GenerationStatus } from "../interfaces/media";

interface MediaState {
  mediaType: MediaType;
  prompt: string;
  parameters: Record<string, any>;
  isGenerating: boolean;
  generationProgress: number;
  generationStatus: string;
  generatedMedia: Media | null;
  history: Media[];
  error: string | null;

  setMediaType: (type: MediaType) => void;
  setPrompt: (prompt: string) => void;
  setParameter: (key: string, value: any) => void;
  generateMedia: () => Promise<void>;
  updateGenerationStatus: (status: GenerationStatus) => void;
  fetchHistory: () => Promise<void>;
}

export const useMediaStore = create<MediaState>((set, get) => ({
  mediaType: "IMAGE",
  prompt: "",
  parameters: {},
  isGenerating: false,
  generationProgress: 0,
  generationStatus: "",
  generatedMedia: null,
  history: [],
  error: null,

  setMediaType: (type) => {
    // Reset parameters based on media type
    const defaultParams = getDefaultParams(type);
    set({ mediaType: type, parameters: defaultParams });
  },

  setPrompt: (prompt) => set({ prompt }),

  setParameter: (key, value) =>
    set((state) => ({
      parameters: { ...state.parameters, [key]: value },
    })),

  generateMedia: async () => {
    const { mediaType, prompt, parameters } = get();

    if (!prompt.trim()) {
      set({ error: "Prompt is required" });
      return;
    }

    set({
      isGenerating: true,
      error: null,
      generationProgress: 0,
      generationStatus: "Starting...",
    });

    try {
      const result = await mediaService.generateMedia({
        type: mediaType,
        prompt,
        parameters,
      });

      set({
        generatedMedia: result,
        isGenerating: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isGenerating: false,
        generationStatus: "Error",
      });
    }
  },

  updateGenerationStatus: (status) => {
    switch (status.status) {
      case "started":
        set({ generationStatus: "Generation started", generationProgress: 0 });
        break;
      case "progress":
        set({
          generationStatus: status.message || "Generating...",
          generationProgress: status.progress || 0,
        });
        break;
      case "completed":
        set({
          generationStatus: "Completed",
          generationProgress: 100,
          generatedMedia: status.media,
          isGenerating: false,
        });
        break;
      case "error":
        set({
          generationStatus: "Error",
          error: status.message || "Generation failed",
          isGenerating: false,
        });
        break;
    }
  },

  fetchHistory: async () => {
    try {
      const history = await mediaService.getMediaHistory();
      set({ history });
    } catch (error) {
      set({ error: error.message });
    }
  },
}));

function getDefaultParams(mediaType: MediaType): Record<string, any> {
  switch (mediaType) {
    case "IMAGE":
      return { width: 512, height: 512, guidance: 7.5 };
    case "AUDIO":
      return { duration: 10, voice: "neutral" };
    case "MUSIC":
      return { duration: 30, tempo: 120, genre: "pop" };
    case "VIDEO":
      return { duration: 10, fps: 24, resolution: "720p" };
    default:
      return {};
  }
}
```

#### Project Store

```typescript
// stores/projectStore.ts
import { create } from "zustand";
import { projectService } from "../services/projectService";
import { Project, ProjectData } from "../interfaces/project";

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;

  fetchProjects: () => Promise<void>;
  setCurrentProject: (id: string) => void;
  createProject: (data: ProjectData) => Promise<void>;
  updateProject: (id: string, data: ProjectData) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const projects = await projectService.getProjects();
      set({
        projects,
        currentProject: projects.length > 0 ? projects[0] : null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  setCurrentProject: (id) => {
    const { projects } = get();
    const project = projects.find((p) => p.id === id);
    if (project) {
      set({ currentProject: project });
      localStorage.setItem("currentProjectId", id);
    }
  },

  createProject: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newProject = await projectService.createProject(data);
      set((state) => ({
        projects: [...state.projects, newProject],
        currentProject: newProject,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateProject: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProject = await projectService.updateProject(id, data);
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? updatedProject : p)),
        currentProject:
          state.currentProject?.id === id
            ? updatedProject
            : state.currentProject,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  deleteProject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await projectService.deleteProject(id);
      set((state) => {
        const filteredProjects = state.projects.filter((p) => p.id !== id);
        return {
          projects: filteredProjects,
          currentProject:
            state.currentProject?.id === id
              ? filteredProjects.length > 0
                ? filteredProjects[0]
                : null
              : state.currentProject,
          isLoading: false,
        };
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
```

---

## 5. UI Components & Pages

### 5.1 Page Structure

- **Auth Pages**:

  - `LoginPage`: Email/password login form
  - `SignupPage`: Registration form
  - `ForgotPasswordPage`: Password reset request
  - `ResetPasswordPage`: Set new password

- **Dashboard Pages**:

  - `DashboardLayout`: Common layout for authenticated pages
  - `MediaGenerationPage`: Main media generation interface
  - `HistoryPage`: View generated media history

- **Admin Pages**:

  - `ProjectsPage`: List and manage projects
  - `ProjectDetailPage`: Edit project details
  - `UsersPage`: Manage users

- **Profile Pages**:
  - `ProfilePage`: Edit user profile
  - `ApiKeysPage`: Manage API keys

### 5.2 Key Components

- **Layout Components**:

  - `Navbar`: Navigation bar with project selector and user menu
  - `Sidebar`: Navigation sidebar with media type tabs
  - `Footer`: Application footer

- **Media Components**:

  - `PromptInput`: Text area for entering generation prompts
  - `MediaTypeTabs`: Tabs for selecting media type
  - `ParametersForm`: Dynamic form for media parameters
  - `MediaPreview`: Preview of generated media
  - `MediaCard`: Card component for media history

- **Project Components**:
  - `ProjectSelector`: Dropdown for selecting current project
  - `ProjectForm`: Form for creating/editing projects
  - `ProjectList`: List of projects with actions

---

## 6. Implementation Plan

### 6.1 Phase 1: Foundation (2 weeks)

- Project setup and configuration
- Basic routing and navigation
- Authentication system implementation
- UI components creation
- Theme system implementation

### 6.2 Phase 2: Core Features (3 weeks)

- Media generation interface
- WebSocket integration
- Project management (basic)
- API integration

### 6.3 Phase 3: Advanced Features (2 weeks)

- Media history and previews
- Admin interfaces
- User profile management
- Advanced project management

### 6.4 Phase A4: Polish & Optimization (1 week)

- Responsive design refinement
- Accessibility improvements
- Performance optimization
- Testing and bug fixes

---

## 7. Performance Considerations

### 7.1 Optimizations

- **Code Splitting**: Use React.lazy and Suspense for route-based code splitting
- **Memoization**: Use React.memo, useMemo, and useCallback to prevent unnecessary re-renders
- **Virtualization**: Use virtualized lists for large data sets (history)
- **Image Optimization**: Responsive images with proper dimensions and formats
- **Bundle Size**: Regular analysis and optimization of bundle size

### 7.2 Caching Strategy

- **API Responses**: Cache responses from the API for frequently accessed data
- **Media Assets**: Cache generated media assets locally
- **Static Assets**: Proper cache headers for static assets

---

## 8. Security Considerations

### 8.1 Authentication

- **Token Storage**: Secure storage of authentication tokens
- **Token Rotation**: Regular rotation of refresh tokens
- **CSRF Protection**: Implement CSRF protection for API requests

### 8.2 Data Security

- **Sensitive Data**: No sensitive data stored in local storage
- **Input Validation**: Validate all user inputs on the client side
- **API Permissions**: Enforce role-based access control

---

## 9. Testing Strategy

### 9.1 Unit Testing

- **Component Testing**: Test individual components in isolation
- **Store Testing**: Test Zustand stores and reducers
- **Utility Testing**: Test utility functions

### 9.2 Integration Testing

- **Form Submissions**: Test form validation and submission
- **API Integration**: Test API integration with mock services
- **Authentication Flow**: Test complete authentication flow

### 9.3 E2E Testing

- **User Journeys**: Test complete user journeys
- **Media Generation**: Test media generation flow
- **Project Management**: Test project management workflows

---

## 10. Accessibility Considerations

- **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
- **Screen Reader Support**: Proper ARIA attributes and semantic HTML
- **Color Contrast**: Meet WCAG AA standards for color contrast
- **Focus Management**: Proper focus management for modals and dialogs

---

## 11. Deployment & CI/CD

### 11.1 Development Workflow

1. Local development with hot reload
2. Pull request with automated testing
3. Code review and approval
4. Merge to main branch
5. Automated deployment to staging
6. Manual testing on staging
7. Promotion to production

### 11.2 Environments

- **Development**: Local development environment
- **Staging**: Pre-production environment for testing
- **Production**: Live environment

### 11.3 CI/CD Pipeline

- **Build**: Automated build on push to main branch
- **Test**: Run automated tests
- **Deploy**: Deploy to staging/production based on branch

---

## 12. Documentation

### 12.1 Code Documentation

- **Comments**: Detailed comments for complex logic
- **JSDoc**: JSDoc comments for functions and components
- **README**: Comprehensive README with setup instructions

### 12.2 User Documentation

- **User Guide**: Guide for using the application
- **Admin Guide**: Guide for administration tasks

---

## 13. Future Considerations

- **Localization**: Support for multiple languages
- **Offline Support**: PWA features for offline access
- **Mobile App**: Native mobile app using React Native
- **Advanced Analytics**: Detailed usage analytics
- **AI-Enhanced Prompts**: AI assistance for prompt creation
