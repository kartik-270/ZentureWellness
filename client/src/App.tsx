import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import NotFound from "@/pages/not-found";
import PsychoeducationalHub from "@/pages/psychoeducationalhub";
import BookingPage from "./pages/appointment";
import About from "./pages/About";
import PHQ9Test from "./pages/test1";
import GAD7Test from "./pages/test2";
import GHQ12Test from "./pages/test3";
import SelfAssessmentTests from "./pages/self-asessment";
import FAQ from "./pages/FAQ";
import Community from "./pages/Community";
import ConfidentialPage from "./pages/Confidential";
import DashBoardpage from "./pages/DashBoardpage";
import AdminDashboard from "./pages/admin/dashboard";
import CrisisEscalation from "./pages/admin/CrisisiEscalation";
import CounselorAvailability from "./pages/admin/CounselorAvailability";
import SettingsPage from "./pages/admin/Setting";
import AdminRegister from "./pages/adminRegister";
function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/psychoeducational-hub" component={PsychoeducationalHub} />
      <Route path="/book-appointment" component={BookingPage} />
      <Route path="/about" component={About} />
      <Route path="/PHQ-9" component={PHQ9Test} />
      <Route path="/GAD-7" component={GAD7Test} />
      <Route path="/GHQ-12" component={GHQ12Test} />
      <Route path="/self-assessment-tests" component={SelfAssessmentTests} />\
      <Route path="/faq" component={FAQ} />
      <Route path="/community" component={Community} />
      <Route path="/confidential" component={ConfidentialPage} />
      <Route path="/dashboard" component={DashBoardpage} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/crisis-escalation" component={CrisisEscalation} />
      <Route path="/admin/counselor-availability" component={CounselorAvailability} />
      <Route path="/admin/settings" component={SettingsPage} />
      <Route path="/admin/register" component={AdminRegister} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
