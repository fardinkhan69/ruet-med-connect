
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Doctor, TimeSlot } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  CalendarIcon,
  Clock,
  Star,
  Award,
  User,
  Calendar as CalendarOutline,
  AlertCircle
} from "lucide-react";
import { mockDoctors } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";

interface DbTimeSlot {
  id: string;
  time: string;
  date: string;
  is_booked: boolean;
  doctor_id: string;
}

const DoctorDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [timeSlots, setTimeSlots] = useState<DbTimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [bookingInProgress, setBookingInProgress] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        if (!id) return;
        
        if (/^\d+$/.test(id)) {
          const mockDoctorIndex = parseInt(id) - 1;
          if (mockDoctorIndex >= 0 && mockDoctorIndex < mockDoctors.length) {
            setDoctor(mockDoctors[mockDoctorIndex]);
            setLoading(false);
            return;
          }
        }
        
        const { data, error } = await supabase
          .from("doctors")
          .select("*")
          .eq("id", id)
          .single();
          
        if (error) {
          throw error;
        }
        
        const doctorData: Doctor = {
          id: data.id,
          name: data.name,
          specialization: data.specialization,
          imageurl: data.imageurl,
          experience: data.experience,
          rating: data.rating,
          education: data.education,
          about: data.about
        };
        
        setDoctor(doctorData);
      } catch (error) {
        console.error("Error fetching doctor:", error);
        toast({
          title: "Error",
          description: "Failed to load doctor details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id, toast]);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!selectedDate || !id) return;
      
      setSlotsLoading(true);
      
      try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        
        if (/^\d+$/.test(id)) {
          const mockSlots = Array(8).fill(0).map((_, index) => {
            const hour = Math.floor(index / 2) + 9;
            const minute = (index % 2) === 0 ? '00' : '30';
            const time = `${hour}:${minute}`;
            
            return {
              id: `slot-${index + 1}`,
              time,
              date: formattedDate,
              is_booked: Math.random() > 0.7,
              doctor_id: id
            };
          });
          
          setTimeSlots(mockSlots);
          setSlotsLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from("time_slots")
          .select("*")
          .eq("doctor_id", id)
          .eq("date", formattedDate)
          .order("time", { ascending: true });
          
        if (error) {
          throw error;
        }
        
        setTimeSlots(data || []);
      } catch (error) {
        console.error("Error fetching time slots:", error);
        toast({
          title: "Error",
          description: "Failed to load available time slots",
          variant: "destructive",
        });
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchTimeSlots();
  }, [selectedDate, id, toast]);

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelection = (slotId: string) => {
    setSelectedSlot(selectedSlot === slotId ? null : slotId);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const handleBookAppointment = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to book an appointment",
        variant: "destructive",
      });
      navigate("/login", { state: { from: `/doctors/${id}` } });
      return;
    }

    if (!selectedSlot) {
      toast({
        title: "Time Required",
        description: "Please select a time slot",
        variant: "destructive",
      });
      return;
    }

    if (!reason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for the appointment",
        variant: "destructive",
      });
      return;
    }

    setBookingInProgress(true);

    try {
      // If using mock doctor data
      if (/^\d+$/.test(id)) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast({
          title: "Success!",
          description: "Your appointment has been booked successfully (demo mode)",
        });
        
        const updatedTimeSlots = timeSlots.map(slot => 
          slot.id === selectedSlot ? { ...slot, is_booked: true } : slot
        );
        setTimeSlots(updatedTimeSlots);
        setSelectedSlot(null);
        setReason("");
        
        navigate("/appointments");
        return;
      }
      
      console.log("Booking appointment with real data:", {
        doctor_id: id,
        time_slot_id: selectedSlot,
        patient_id: user.id,
        reason: reason,
        status: "scheduled",
        follow_up: false
      });
      
      // First update the time slot
      const { error: timeSlotError } = await supabase
        .from("time_slots")
        .update({ is_booked: true })
        .eq("id", selectedSlot);

      if (timeSlotError) {
        console.error("Time slot update error:", timeSlotError);
        throw timeSlotError;
      }

      // Then create the appointment
      const appointmentData = {
        patient_id: user.id,
        doctor_id: id,
        time_slot_id: selectedSlot,
        reason: reason,
        status: "scheduled",
        follow_up: false
      };
      
      console.log("Inserting appointment data:", appointmentData);
      
      const { data: appointmentResult, error: appointmentError } = await supabase
        .from("appointments")
        .insert(appointmentData)
        .select();

      if (appointmentError) {
        console.error("Appointment creation error:", appointmentError);
        throw appointmentError;
      }
      
      console.log("Appointment created successfully:", appointmentResult);

      toast({
        title: "Success!",
        description: "Your appointment has been booked successfully",
      });

      const updatedTimeSlots = timeSlots.map(slot => 
        slot.id === selectedSlot ? { ...slot, is_booked: true } : slot
      );
      setTimeSlots(updatedTimeSlots);
      setSelectedSlot(null);
      setReason("");

      navigate("/appointments");
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error booking your appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setBookingInProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3">
                <Skeleton className="h-64 w-full rounded-lg" />
              </div>
              <div className="w-full md:w-2/3 space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <AlertCircle className="h-16 w-16 mx-auto text-destructive" />
            <h1 className="text-2xl font-bold mt-4">Doctor Not Found</h1>
            <p className="mt-2 text-gray-600">
              We couldn't find the doctor you're looking for
            </p>
            <Button
              onClick={() => navigate("/")}
              className="mt-6"
            >
              Return to Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <div className="rounded-lg overflow-hidden bg-white shadow-md">
                <img 
                  src={doctor.imageurl}
                  alt={doctor.name}
                  className="w-full h-64 object-cover object-center" 
                />
                <div className="p-4 space-y-3">
                  <div className="flex items-center text-amber-500">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="ml-1 font-medium">{doctor.rating} Rating</span>
                  </div>
                  <div className="flex items-center text-blue-600">
                    <Award className="h-5 w-5" />
                    <span className="ml-1">{doctor.experience} Years Experience</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <User className="h-5 w-5" />
                    <span className="ml-1">100+ Patients</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-2/3">
              <h1 className="text-3xl font-bold text-gray-900">{doctor.name}</h1>
              <p className="text-primary font-medium mt-1">{doctor.specialization}</p>
              
              <div className="mt-4">
                <h2 className="text-lg font-semibold">Education</h2>
                <p className="text-gray-600 mt-1">{doctor.education}</p>
              </div>
              
              <div className="mt-4">
                <h2 className="text-lg font-semibold">About</h2>
                <p className="text-gray-600 mt-1">{doctor.about}</p>
              </div>
              
              <div className="mt-8 bg-white rounded-lg border p-6">
                <h2 className="text-xl font-bold mb-4">Book an Appointment</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                      <CalendarOutline className="h-4 w-4 mr-1" />
                      Select Date
                    </h3>
                    <div className="border rounded-md p-2">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateChange}
                        disabled={(date) => 
                          date < new Date() || 
                          date > new Date(new Date().setDate(new Date().getDate() + 30))
                        }
                        className="rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Available Time Slots
                    </h3>
                    
                    {slotsLoading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ) : timeSlots.length === 0 ? (
                      <div className="text-center py-6 bg-gray-50 rounded-md">
                        <p className="text-gray-500">No available slots for this date</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto p-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot.id}
                            disabled={slot.is_booked}
                            onClick={() => handleSlotSelection(slot.id)}
                            className={`p-2 text-center rounded-md text-sm transition-colors
                              ${slot.is_booked 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : selectedSlot === slot.id 
                                  ? 'bg-primary text-white border-primary'
                                  : 'bg-white border hover:bg-primary/5'
                              }`}
                          >
                            {formatTime(slot.time)}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <h3 className="font-medium text-gray-700 mb-2">Reason for Visit</h3>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Briefly describe your symptoms or reason for the appointment"
                        className="w-full border rounded-md p-2 h-24 text-sm"
                      />
                    </div>
                    
                    <Button
                      onClick={handleBookAppointment}
                      disabled={!selectedSlot || !reason.trim() || bookingInProgress}
                      className="w-full mt-4"
                    >
                      {bookingInProgress ? "Booking..." : "Book Appointment"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DoctorDetails;
