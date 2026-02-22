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
import Students from "./pages/admin/Students";
import Reports from "./pages/admin/Reports";
import Resources from "./pages/admin/ResourceManagement";
import AdminCommunities from "./pages/admin/Communities";
import AdminRegister from "./pages/adminRegister";
import ForgotUsername from "./pages/ForgotUsename";
import CounsellorRegister from "./pages/CounsellorRegister";
import CounsellorDashboard from "./pages/counsellor/counsellorDashboard";
import Schedule from "./pages/counsellor/Schedule";
import Clients from "./pages/counsellor/Clients";
import Messages from "./pages/counsellor/Messages";
import CounselorResources from "./pages/counsellor/Resources";
import Settings from "./pages/counsellor/Settings";
import Chatbot from "./pages/Chatbot";
import SessionPage from "./pages/SessionPage";
import StudentMessages from "./pages/StudentMessages";

import ForgotPassword from "@/pages/ForgotPassword";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/signup" component={Signup} />
      <Route path="/counsellor/register" component={CounsellorRegister} />
      <Route path="/admin/register" component={AdminRegister} />
      <Route path="/forgot-username" component={ForgotUsername} />

      {/* Student Routes */}
      <Route path="/dashboard" component={DashBoardpage} />
      <Route path="/psychoeducational-hub" component={PsychoeducationalHub} />
      <Route path="/messages" component={StudentMessages} />
      <Route path="/book-appointment" component={BookingPage} />
      <Route path="/about" component={About} />
      <Route path="/PHQ-9" component={PHQ9Test} />
      <Route path="/GAD-7" component={GAD7Test} />
      <Route path="/GHQ-12" component={GHQ12Test} />
      <Route path="/self-assessment-tests" component={SelfAssessmentTests} />
      <Route path="/faq" component={FAQ} />
      <Route path="/community" component={Community} />
      <Route path="/confidential" component={ConfidentialPage} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/students" component={Students} />
      <Route path="/admin/communities" component={AdminCommunities} />
      <Route path="/admin/crisis-escalation" component={CrisisEscalation} />
      <Route path="/admin/counselor-availability" component={CounselorAvailability} />
      <Route path="/admin/resources" component={Resources} />
      <Route path="/admin/reports" component={Reports} />
      <Route path="/admin/settings" component={SettingsPage} />

      {/* Counsellor Routes */}
      <Route path="/counsellor/dashboard" component={CounsellorDashboard} />
      <Route path="/counsellor/schedule" component={Schedule} />
      <Route path="/counsellor/clients" component={Clients} />
      <Route path="/counsellor/messages" component={Messages} />
      <Route path="/counsellor/resources" component={CounselorResources} />
      <Route path="/counsellor/settings" component={Settings} />

      <Route path="/chatbot" component={Chatbot} />
      <Route path="/session/:sessionId" component={SessionPage} />
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
