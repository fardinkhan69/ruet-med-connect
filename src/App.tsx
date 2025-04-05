
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Appointments from "./pages/Appointments";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorDetails from "./pages/DoctorDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthContextProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/doctors/:id" element={<DoctorDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
