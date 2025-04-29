import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoginPage } from "@/pages/auth/login-page";
import { SignupPage } from "@/pages/auth/signup-page";
import { ProtectedRoute } from "@/pages/ProtectedRoute";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { DashboardPage } from "@/pages/app/dashboard-page";
import { Toaster } from "@/components/ui/toaster";
import { MediaGenerationPage } from "./pages/app/media-generation-page";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <div className="w-full min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<SignupPage />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/generate"
                element={
                  <ProtectedRoute>
                    <MediaGenerationPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            <Toaster />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
