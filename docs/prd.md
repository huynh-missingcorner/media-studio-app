# 📝 Updated Product Requirements Document (Frontend)

## Project Name

**Vertex AI Media Studio Wrapper – Frontend App**

---

## Objective

Build a responsive, user-friendly frontend that allows authenticated users to interact with the backend API and Google Vertex AI Media Studio for generating media assets (image, audio, music, video) via prompts. The frontend must support parameter customization, media previews, downloads, WebSocket updates, and role-based UI.

---

## Tech Stack

- **ReactJS** (with **Vite**)
- **shadcn/ui** for components (using Radix UI primitives)
- **TailwindCSS** for styling
- **Framer Motion** for animation
- **Zustand** for state management
- **React Router v6+** for routing
- **Socket.IO Client** for real-time updates
- **Axios** for HTTP requests
- **TypeScript** for type safety

---

## Key Pages

### 1. **Auth Pages**

- `/login` and `/signup`
- Controlled form inputs with validations
- JWT-based login flow and redirection
- Token storage (httpOnly cookie or localStorage with refresh handling)
- Password reset functionality

### 2. **Dashboard `/app`**

**Main layout for authenticated users**, includes:

- **Navbar**: Project selector, user avatar with dropdown menu, theme toggle
- **Sidebar** (Framer Motion): Media type tabs (Image, Audio, Music, Video)
- **Prompt Form**: Input box, validation, optional "enhance prompt"
- **Settings Panel**: Dynamic form inputs for parameters based on selected media type
- **Media Preview Section**: Show generated asset or status
- **History Section**: View previously generated assets
- **Notification/Alert System**: Toast messages for success/error feedback

### 3. **Admin Project Management**

- Admin-only route: `/admin/projects`
- CRUD UI for projects using modals/forms
- User management interface
- Usage statistics and monitoring

### 4. **Profile Page**

- User profile management
- API key management
- Usage statistics

---

## Component Breakdown

### ✅ Global

- `App.tsx`, `Router.tsx`, `ProtectedRoute.tsx`
- `Navbar.tsx`, `Sidebar.tsx`, `Toast.tsx`, `Modal.tsx`
- `ThemeProvider.tsx`, `AuthProvider.tsx`

### ✅ Auth

- `LoginForm.tsx`, `SignupForm.tsx`, `PasswordResetForm.tsx`
- `authStore.ts` (zustand)
- AuthService for login/signup and token handling

### ✅ Media

- `PromptInput.tsx`
- `SettingsPanel.tsx`
- `MediaPreview.tsx`
- `MediaTypeTabs.tsx`
- `MediaHistory.tsx`
- Zustand store: `mediaStore.ts`
- `mediaService.ts` (handles POST and GET to API)

### ✅ Projects

- `ProjectSelector.tsx`
- `ProjectForm.tsx`
- `ProjectList.tsx`
- Zustand store: `projectStore.ts`
- API: `projectService.ts`

### ✅ WebSocket

- `socket.ts`: Singleton socket client
- `useSocket.ts`: Custom hook to subscribe to media generation updates

### ✅ User Profile

- `ProfileForm.tsx`
- `ApiKeyManager.tsx`
- `UsageStats.tsx`

---

## Frontend Functional Requirements

| ID     | Requirement                                           | Priority |
| ------ | ----------------------------------------------------- | -------- |
| FE-001 | Users can sign up and login with JWT                  | High     |
| FE-002 | Display role-based navigation (admin/user)            | High     |
| FE-003 | Allow media type selection and input prompt           | High     |
| FE-004 | Render dynamic settings panel for selected media type | High     |
| FE-005 | Submit media generation request via API               | High     |
| FE-006 | Show loading, success, or error states                | High     |
| FE-007 | Show result previews with download option             | High     |
| FE-008 | Project selection dropdown and fetching               | High     |
| FE-009 | Receive and handle WebSocket updates                  | High     |
| FE-010 | Admin UI to manage projects                           | Medium   |
| FE-011 | Theme switching (light/dark mode)                     | Medium   |
| FE-012 | Responsive design for mobile/tablet/desktop           | High     |
| FE-013 | User profile management                               | Medium   |
| FE-014 | Password reset functionality                          | Medium   |
| FE-015 | Media generation history view                         | Medium   |
| FE-016 | API key management for users                          | Low      |
| FE-017 | Usage statistics dashboard                            | Low      |
| FE-018 | Accessibility compliance                              | Medium   |

---

## Non-Functional Requirements

| ID     | Requirement                                         | Priority |
| ------ | --------------------------------------------------- | -------- |
| NFR-01 | Page load time < 2 seconds                          | High     |
| NFR-02 | Responsive to all devices (mobile, tablet, desktop) | High     |
| NFR-03 | WCAG 2.1 AA accessibility compliance                | Medium   |
| NFR-04 | Support for latest browsers                         | High     |
| NFR-05 | Secure authentication handling                      | High     |
| NFR-06 | Error handling with user-friendly messages          | High     |
| NFR-07 | Real-time updates for media generation status       | High     |
| NFR-08 | Scalable UI for growing feature set                 | Medium   |
