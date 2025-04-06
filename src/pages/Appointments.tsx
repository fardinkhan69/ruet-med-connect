import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calendar,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  CalendarDays
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  imageurl: string;
}

interface TimeSlot {
  id: string;
  date: string;
  time: string;
}

interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  time_slot_id: string;
  status: string;
  reason: string;
  notes?: string;
  follow_up: boolean;
  created_at: string;
  doctor?: Doctor;
  time_slot?: TimeSlot;
}

const Appointments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/appointments" } });
      return;
    }
    
    const fetchAppointments = async () => {
      try {
        console.log("Fetching appointments for user:", user.id);
        
        const { data, error } = await supabase
          .from("appointments")
          .select(`
            *,
            doctor:doctor_id (id, name, specialization, imageurl),
            time_slot:time_slot_id (id, date, time)
          `)
          .eq("patient_id", user.id);
        
        if (error) {
          console.error("Error details:", error);
          throw error;
        }
        
        console.log("Appointments fetched:", data);
        setAppointments(data || []);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to load appointments. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, [user, navigate]);
  
  const cancelAppointment = async (appointment: Appointment) => {
    try {
      const { error: appointmentError } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", appointment.id);
      
      if (appointmentError) {
        throw appointmentError;
      }
      
      const { error: timeSlotError } = await supabase
        .from("time_slots")
        .update({ is_booked: false })
        .eq("id", appointment.time_slot_id);
      
      if (timeSlotError) {
        throw timeSlotError;
      }
      
      setAppointments(appointments.map(app => 
        app.id === appointment.id 
          ? { ...app, status: "cancelled" } 
          : app
      ));
      
      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been cancelled successfully."
      });
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { 
      weekday: "short", 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    });
  };
  
  const upcomingAppointments = appointments.filter(
    app => app.status === "scheduled" && 
    new Date(app.time_slot?.date + " " + app.time_slot?.time) > new Date()
  );
  
  const pastAppointments = appointments.filter(
    app => app.status === "completed" || 
    app.status === "cancelled" || 
    new Date(app.time_slot?.date + " " + app.time_slot?.time) <= new Date()
  );
  
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Scheduled
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
          <p className="text-gray-600 mb-8">Manage and track your medical appointments</p>
          
          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          ) : loading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-1/3" />
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-[200px] w-full" />
            </div>
          ) : appointments.length === 0 ? (
            <Card>
              <CardContent className="pt-10 pb-10 flex flex-col items-center justify-center">
                <CalendarDays className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-1">No Appointments Yet</h3>
                <p className="text-gray-500 text-center max-w-md mb-6">
                  You haven't scheduled any appointments yet. Browse our doctors and schedule your first appointment.
                </p>
                <Button onClick={() => navigate("/")}>Find Doctors</Button>
              </CardContent>
            </Card>
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
                      <Card key={appointment.id}>
                        <CardContent className="pt-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex items-start space-x-4">
                              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                <img 
                                  src={appointment.doctor?.imageurl || "/placeholder.svg"} 
                                  alt={appointment.doctor?.name || "Doctor"} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{appointment.doctor?.name}</h3>
                                <p className="text-sm text-primary">{appointment.doctor?.specialization}</p>
                                
                                <div className="mt-2 space-y-1">
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    <span>
                                      {appointment.time_slot?.date && formatDate(appointment.time_slot.date)}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Clock className="w-4 h-4 mr-1" />
                                    <span>
                                      {appointment.time_slot?.time && 
                                        new Date(`2000-01-01T${appointment.time_slot.time}`).toLocaleTimeString([], {
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })
                                      }
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4 md:mt-0 flex flex-col items-end">
                              {renderStatusBadge(appointment.status)}
                              
                              <div className="mt-3 flex space-x-2">
                                {appointment.status === "scheduled" && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => cancelAppointment(appointment)}
                                  >
                                    Cancel
                                  </Button>
                                )}
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => navigate(`/doctors/${appointment.doctor_id}`)}
                                >
                                  Reschedule
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex items-start">
                              <FileText className="w-4 h-4 mt-0.5 text-gray-500 mr-2" />
                              <div>
                                <div className="text-sm font-medium text-gray-700">Reason for Visit</div>
                                <p className="text-gray-600 mt-1">
                                  {appointment.reason}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
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
                      <Card key={appointment.id}>
                        <CardContent className="pt-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex items-start space-x-4">
                              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                <img 
                                  src={appointment.doctor?.imageurl || "/placeholder.svg"} 
                                  alt={appointment.doctor?.name || "Doctor"} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{appointment.doctor?.name}</h3>
                                <p className="text-sm text-primary">{appointment.doctor?.specialization}</p>
                                
                                <div className="mt-2 space-y-1">
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    <span>
                                      {appointment.time_slot?.date && formatDate(appointment.time_slot.date)}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Clock className="w-4 h-4 mr-1" />
                                    <span>
                                      {appointment.time_slot?.time && 
                                        new Date(`2000-01-01T${appointment.time_slot.time}`).toLocaleTimeString([], {
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })
                                      }
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4 md:mt-0 flex flex-col items-end">
                              {renderStatusBadge(appointment.status)}
                              
                              <div className="mt-3">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => navigate(`/doctors/${appointment.doctor_id}`)}
                                >
                                  Book Again
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex items-start">
                              <FileText className="w-4 h-4 mt-0.5 text-gray-500 mr-2" />
                              <div>
                                <div className="text-sm font-medium text-gray-700">Reason for Visit</div>
                                <p className="text-gray-600 mt-1">
                                  {appointment.reason}
                                </p>
                              </div>
                            </div>
                            
                            {appointment.notes && (
                              <div className="flex items-start mt-3">
                                <FileText className="w-4 h-4 mt-0.5 text-gray-500 mr-2" />
                                <div>
                                  <div className="text-sm font-medium text-gray-700">Doctor's Notes</div>
                                  <p className="text-gray-600 mt-1">
                                    {appointment.notes}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
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
