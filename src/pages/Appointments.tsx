
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, User, FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Simulated appointment data
const upcomingAppointments = [
  {
    id: "1",
    doctorName: "Dr. Sarah Khan",
    specialization: "Cardiologist",
    date: "2025-04-10",
    time: "10:30 AM",
    location: "RUET Medical Center, Room 203",
    status: "scheduled"
  },
  {
    id: "2",
    doctorName: "Dr. Rahul Patel",
    specialization: "Gastrologist",
    date: "2025-04-15",
    time: "2:00 PM",
    location: "RUET Medical Center, Room 105",
    status: "scheduled"
  }
];

const pastAppointments = [
  {
    id: "3",
    doctorName: "Dr. Aisha Rahman",
    specialization: "Neurologist",
    date: "2025-03-27",
    time: "11:00 AM",
    location: "RUET Medical Center, Room 302",
    status: "completed"
  },
  {
    id: "4",
    doctorName: "Dr. Mohammad Hossain",
    specialization: "General Medicine",
    date: "2025-03-20",
    time: "9:30 AM",
    location: "RUET Medical Center, Room 101",
    status: "cancelled"
  }
];

const Appointments = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full text-xs font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>Scheduled</span>
          </div>
        );
      case "completed":
        return (
          <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Completed</span>
          </div>
        );
      case "cancelled":
        return (
          <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2.5 py-1 rounded-full text-xs font-medium">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full text-xs font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Unknown</span>
          </div>
        );
    }
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
              <p className="text-gray-600 mt-1">Manage your upcoming and past medical appointments</p>
            </div>
            <Button className="mt-4 md:mt-0 bg-primary hover:bg-primary/90">
              Book New Appointment
            </Button>
          </div>
          
          <Tabs 
            defaultValue="upcoming" 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="mt-6">
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No upcoming appointments</h3>
                  <p className="mt-1 text-sm text-gray-500">Book a new appointment with one of our doctors.</p>
                  <Button className="mt-6 bg-primary hover:bg-primary/90">Book Appointment</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.map(appointment => (
                    <div key={appointment.id} className="medical-card">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-lg">{appointment.doctorName}</h3>
                            <p className="text-gray-500">{appointment.specialization}</p>
                          </div>
                        </div>
                        {renderStatusBadge(appointment.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{formatDate(appointment.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{appointment.location}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 mt-6">
                        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                          Reschedule
                        </Button>
                        <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past" className="mt-6">
              {pastAppointments.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No past appointments</h3>
                  <p className="mt-1 text-sm text-gray-500">Your appointment history will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastAppointments.map(appointment => (
                    <div key={appointment.id} className="medical-card">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-lg">{appointment.doctorName}</h3>
                            <p className="text-gray-500">{appointment.specialization}</p>
                          </div>
                        </div>
                        {renderStatusBadge(appointment.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{formatDate(appointment.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{appointment.location}</span>
                        </div>
                      </div>
                      
                      {appointment.status === "completed" && (
                        <div className="flex flex-wrap gap-3 mt-6">
                          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                            Book Follow-up
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Appointments;
