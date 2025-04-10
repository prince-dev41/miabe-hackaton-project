import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "./contexts/auth-context";
import MainLayout from "./components/layout/main-layout";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Appointments from "@/pages/appointments";
import Records from "@/pages/records";
import Patients from "@/pages/patients";
import Doctors from "@/pages/doctors";
import Feedback from "@/pages/feedback";
import Reminders from "@/pages/reminders";
import Settings from "@/pages/settings";
import Login from "@/pages/login";
import Register from "@/pages/register";

// Composant protégé qui vérifie l'authentification
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }
  
  return <>{children}</>;
};

// Redirection automatique si déjà connecté
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  
  if (isAuthenticated) {
    navigate("/");
    return null;
  }
  
  return <>{children}</>;
};

function Router() {
  return (
    <Switch>
      <Route path="/login">
        <PublicOnlyRoute>
          <Login />
        </PublicOnlyRoute>
      </Route>
      
      <Route path="/register">
        <PublicOnlyRoute>
          <Register />
        </PublicOnlyRoute>
      </Route>
      
      <Route path="/appointments">
        <ProtectedRoute>
          <MainLayout>
            <Appointments />
          </MainLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/records">
        <ProtectedRoute>
          <MainLayout>
            <Records />
          </MainLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/patients">
        <ProtectedRoute>
          <MainLayout>
            <Patients />
          </MainLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/doctors">
        <ProtectedRoute>
          <MainLayout>
            <Doctors />
          </MainLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/feedback">
        <ProtectedRoute>
          <MainLayout>
            <Feedback />
          </MainLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/reminders">
        <ProtectedRoute>
          <MainLayout>
            <Reminders />
          </MainLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/settings">
        <ProtectedRoute>
          <MainLayout>
            <Settings />
          </MainLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/">
        <ProtectedRoute>
          <MainLayout>
            <Dashboard />
          </MainLayout>
        </ProtectedRoute>
      </Route>
      
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
