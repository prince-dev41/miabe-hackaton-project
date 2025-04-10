import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import MainLayout from "./components/layout/main-layout";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Appointments from "@/pages/appointments";
import Records from "@/pages/records";
import Patients from "@/pages/patients";
import Doctors from "@/pages/doctors";
import Feedback from "@/pages/feedback";
import Reminders from "@/pages/reminders";

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/appointments" component={Appointments} />
        <Route path="/records" component={Records} />
        <Route path="/patients" component={Patients} />
        <Route path="/doctors" component={Doctors} />
        <Route path="/feedback" component={Feedback} />
        <Route path="/reminders" component={Reminders} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
