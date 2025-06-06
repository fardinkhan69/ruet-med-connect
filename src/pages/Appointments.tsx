
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import AppointmentCard from "@/components/appointments/AppointmentCard";
import EmptyState from "@/components/appointments/EmptyState";
import { useAppointments } from "@/hooks/useAppointments";
import { testSupabaseConnection } from "@/integrations/supabase/client";

const Appointments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<{ success: boolean, message: string } | null>(null);
  
  useEffect(() => {
    // Test Supabase connection on page load with improved logging
    const testConnection = async () => {
      try {
        console.log("Testing Supabase connection on Appointments page...");
        const result = await testSupabaseConnection();
        console.log("Connection test on Appointments page:", result);
        
        if (result.success) {
          setConnectionStatus({
            success: true,
            message: "Connected to Supabase successfully"
          });
        } else {
          setConnectionStatus({
            success: false,
            message: "Failed to connect to Supabase: " + (result.error?.message || "Unknown error")
          });
        }
      } catch (err: any) {
        console.error("Connection test error:", err);
        setConnectionStatus({
          success: false,
          message: "Error testing connection: " + (err?.message || "Unknown error")
        });
      }
    };
    
    testConnection();
  }, []);
  
  const {
    upcomingAppointments,
    pastAppointments,
    loading,
    error,
    cancelAppointment,
    refetch
  } = useAppointments(user?.id);
  
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/appointments" } });
    } else {
      // Force a refetch when the component mounts and we have a user
      console.log("Forcing appointments refetch for user:", user.id);
      refetch();
    }
  }, [user, navigate, refetch]);
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
          <p className="text-gray-600 mb-2">Manage and track your medical appointments</p>
          
          {connectionStatus && (
            <div className={`mb-4 p-3 rounded-md text-sm ${
              connectionStatus.success 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {connectionStatus.success 
                ? '✓ ' 
                : '✕ '
              }
              {connectionStatus.message}
            </div>
          )}
          
          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center mb-4">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          ) : loading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-1/3" />
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-[200px] w-full" />
            </div>
          ) : (upcomingAppointments.length === 0 && pastAppointments.length === 0) ? (
            <EmptyState />
          ) : (
            <Tabs defaultValue="upcoming">
              <TabsList className="mb-4">
                <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
                <TabsTrigger value="past">Past ({pastAppointments.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                <div className="space-y-4">
                  {upcomingAppointments.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6 pb-6 text-center">
                        <p className="text-gray-500">You don't have any upcoming appointments</p>
                      </CardContent>
                    </Card>
                  ) : (
                    upcomingAppointments.map(appointment => (
                      <AppointmentCard
                        key={appointment.id}
                        id={appointment.id}
                        doctor={appointment.doctor}
                        time_slot={appointment.time_slot}
                        start_time={appointment.start_time}
                        end_time={appointment.end_time}
                        status={appointment.status}
                        reason={appointment.reason}
                        notes={appointment.notes}
                        onCancel={cancelAppointment}
                      />
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="past">
                <div className="space-y-4">
                  {pastAppointments.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6 pb-6 text-center">
                        <p className="text-gray-500">You don't have any past appointments</p>
                      </CardContent>
                    </Card>
                  ) : (
                    pastAppointments.map(appointment => (
                      <AppointmentCard
                        key={appointment.id}
                        id={appointment.id}
                        doctor={appointment.doctor}
                        time_slot={appointment.time_slot}
                        start_time={appointment.start_time}
                        end_time={appointment.end_time}
                        status={appointment.status}
                        reason={appointment.reason}
                        notes={appointment.notes}
                      />
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Appointments;
