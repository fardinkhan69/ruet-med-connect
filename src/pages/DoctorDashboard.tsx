
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User, 
  FileText, 
  Plus,
  ChevronDown,
  ChevronUp,
  CalendarClock 
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Simulated appointment data for doctor
const todayAppointments = [
  {
    id: "1",
    patientName: "Ahmed Khan",
    age: 45,
    time: "10:30 AM",
    reason: "Chest pain and shortness of breath",
    status: "scheduled"
  },
  {
    id: "2",
    patientName: "Fatima Rahman",
    age: 32,
    time: "11:00 AM",
    reason: "Regular checkup",
    status: "scheduled"
  },
  {
    id: "3",
    patientName: "Mohammad Ali",
    age: 28,
    time: "12:00 PM",
    reason: "Persistent headaches",
    status: "completed"
  },
  {
    id: "4",
    patientName: "Ayesha Begum",
    age: 50,
    time: "2:00 PM",
    reason: "Follow-up after medication",
    status: "scheduled"
  }
];

const upcomingAppointments = [
  {
    id: "5",
    patientName: "Rahul Ahmed",
    age: 35,
    date: "2025-04-06",
    time: "9:30 AM",
    reason: "Annual physical",
    status: "scheduled"
  },
  {
    id: "6",
    patientName: "Nazia Khan",
    age: 42,
    date: "2025-04-06",
    time: "11:30 AM",
    reason: "Medication review",
    status: "scheduled"
  },
  {
    id: "7",
    patientName: "Imran Rahman",
    age: 29,
    date: "2025-04-07",
    time: "10:00 AM",
    reason: "Follow-up consultation",
    status: "scheduled"
  }
];

const pastPatients = [
  {
    id: "8",
    patientName: "Farida Akter",
    age: 55,
    lastVisit: "2025-04-01",
    diagnosis: "Hypertension",
    nextAppointment: "2025-05-01"
  },
  {
    id: "9",
    patientName: "Karim Miah",
    age: 48,
    lastVisit: "2025-03-25",
    diagnosis: "Type 2 Diabetes",
    nextAppointment: "2025-04-25"
  },
  {
    id: "10",
    patientName: "Sultana Begum",
    age: 36,
    lastVisit: "2025-03-20",
    diagnosis: "Migraine",
    nextAppointment: null
  }
];

const DoctorDashboard = () => {
  const [expandedAppointment, setExpandedAppointment] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const toggleAppointmentDetails = (id: string) => {
    setExpandedAppointment(expandedAppointment === id ? null : id);
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
            Scheduled
          </span>
        );
      case "completed":
        return (
          <span className="bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-red-50 text-red-700 text-xs font-medium px-2.5 py-1 rounded-full">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your appointments and patient records</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-4">
              <div className="text-sm text-gray-500">
                <span>Today: </span>
                <span className="font-medium text-gray-900">{new Date().toLocaleDateString()}</span>
              </div>
              <Select defaultValue="available">
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="break">On Break</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content area */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="today" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="today">Today's Schedule</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
                </TabsList>
                
                <TabsContent value="today">
                  <Card className="border-none shadow-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl">Today's Appointments</CardTitle>
                      <CardDescription>
                        You have {todayAppointments.filter(a => a.status === "scheduled").length} upcoming consultations today
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {todayAppointments.map((appointment) => (
                          <div 
                            key={appointment.id} 
                            className="border rounded-lg p-4 bg-white"
                          >
                            <div 
                              className="flex justify-between items-start cursor-pointer"
                              onClick={() => toggleAppointmentDetails(appointment.id)}
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                  <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-medium">{appointment.patientName}</h3>
                                    <span className="text-sm text-gray-500">{appointment.age} y/o</span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">{appointment.time}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {renderStatusBadge(appointment.status)}
                                {expandedAppointment === appointment.id ? (
                                  <ChevronUp size={18} className="text-gray-400" />
                                ) : (
                                  <ChevronDown size={18} className="text-gray-400" />
                                )}
                              </div>
                            </div>
                            
                            {expandedAppointment === appointment.id && (
                              <div className="mt-4 pt-4 border-t">
                                <div className="space-y-3">
                                  <div>
                                    <p className="text-sm font-medium text-gray-700">Reason for Visit</p>
                                    <p className="text-sm text-gray-600 mt-1">{appointment.reason}</p>
                                  </div>
                                  
                                  {appointment.status === "scheduled" ? (
                                    <div className="flex flex-wrap gap-3 mt-4">
                                      <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="border-success text-success hover:bg-success hover:text-white"
                                      >
                                        <CheckCircle className="mr-1 h-4 w-4" />
                                        Mark as Complete
                                      </Button>
                                      <Button 
                                        size="sm"
                                        variant="outline" 
                                        className="border-primary text-primary hover:bg-primary hover:text-white"
                                      >
                                        <FileText className="mr-1 h-4 w-4" />
                                        Add Notes
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="flex flex-wrap gap-3 mt-4">
                                      <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="border-primary text-primary hover:bg-primary hover:text-white"
                                      >
                                        <FileText className="mr-1 h-4 w-4" />
                                        View Notes
                                      </Button>
                                      <Button 
                                        size="sm"
                                        variant="outline" 
                                        className="border-primary text-primary hover:bg-primary hover:text-white"
                                      >
                                        <Plus className="mr-1 h-4 w-4" />
                                        Schedule Follow-up
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="upcoming">
                  <Card className="border-none shadow-sm">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl">Upcoming Appointments</CardTitle>
                          <CardDescription>
                            View and manage your upcoming schedule
                          </CardDescription>
                        </div>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="border rounded-md px-3 py-2 text-sm"
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {upcomingAppointments.map((appointment) => (
                          <div 
                            key={appointment.id} 
                            className="border rounded-lg p-4 bg-white"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                  <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-medium">{appointment.patientName}</h3>
                                    <span className="text-sm text-gray-500">{appointment.age} y/o</span>
                                  </div>
                                  <div className="flex items-center gap-4 mt-1">
                                    <div className="flex items-center gap-1 text-sm">
                                      <Calendar className="h-3.5 w-3.5 text-gray-500" />
                                      <span>{formatDate(appointment.date)}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm">
                                      <Clock className="h-3.5 w-3.5 text-gray-500" />
                                      <span>{appointment.time}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                {renderStatusBadge(appointment.status)}
                              </div>
                            </div>
                            <div className="mt-2">
                              <p className="text-sm text-gray-600 mt-1">{appointment.reason}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Sidebar */}
            <div>
              <Card className="border-none shadow-sm mb-6">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">At a Glance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-primary/5 rounded-lg text-center">
                      <p className="text-2xl font-semibold text-primary">4</p>
                      <p className="text-sm text-gray-600 mt-1">Today's Appointments</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg text-center">
                      <p className="text-2xl font-semibold text-blue-700">3</p>
                      <p className="text-sm text-gray-600 mt-1">Upcoming</p>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-700">Completed Today</p>
                      <p className="text-lg font-semibold text-green-700">1</p>
                    </div>
                    <CheckCircle className="text-green-600 h-8 w-8" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Recent Patients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pastPatients.map((patient) => (
                      <div key={patient.id} className="flex items-start gap-3 pb-3 border-b last:border-b-0 last:pb-0">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium">{patient.patientName}</h3>
                            <span className="text-xs text-gray-500">{patient.age} y/o</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5">{patient.diagnosis}</p>
                          <div className="flex items-center gap-1 mt-1.5">
                            <Calendar className="h-3 w-3 text-gray-500" />
                            <p className="text-xs text-gray-500">Last visit: {formatDate(patient.lastVisit)}</p>
                          </div>
                          {patient.nextAppointment && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <CalendarClock className="h-3 w-3 text-primary" />
                              <p className="text-xs text-primary">Next: {formatDate(patient.nextAppointment)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DoctorDashboard;
