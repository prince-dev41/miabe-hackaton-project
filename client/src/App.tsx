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
import Login from "@/pages/login";
import Register from "@/pages/register";

// Protection de route pour les pages authentifiées
function PrivateRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  return <Component {...rest} />;
}

// Redirection vers le dashboard si déjà connecté pour les pages non-auth
function PublicRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated && (rest.path === "/login" || rest.path === "/register")) {
    return <Redirect to="/" />;
  }
  
  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login">
        <PublicRoute component={Login} path="/login" />
      </Route>
      <Route path="/register">
        <PublicRoute component={Register} path="/register" />
      </Route>
      
      {/* Routes protégées dans le layout principal */}
      <Route path="/">
        <MainLayout>
          <Switch>
            <Route path="/" component={() => <PrivateRoute component={Dashboard} />} />
            <Route path="/appointments" component={() => <PrivateRoute component={Appointments} />} />
            <Route path="/records" component={() => <PrivateRoute component={Records} />} />
            <Route path="/patients" component={() => <PrivateRoute component={Patients} />} />
            <Route path="/doctors" component={() => <PrivateRoute component={Doctors} />} />
            <Route path="/feedback" component={() => <PrivateRoute component={Feedback} />} />
            <Route path="/reminders" component={() => <PrivateRoute component={Reminders} />} />
            <Route component={NotFound} />
          </Switch>
        </MainLayout>
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
