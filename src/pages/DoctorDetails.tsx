import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase, logSupabaseOperation } from "@/integrations/supabase/client";
import { Doctor } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AlertCircle } from "lucide-react";
import { mockDoctors } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import DoctorProfile from "@/components/doctors/DoctorProfile";
import BookingCalendar from "@/components/appointments/BookingCalendar";
import BookingForm from "@/components/appointments/BookingForm";

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
        const formattedDate = selectedDate.toISOString().split('T')[0];
        
        if (/^\d+$/.test(id)) {
          const { data: existingSlots, error: checkError } = await supabase
            .from("time_slots")
            .select("*")
            .eq("doctor_id", id)
            .eq("date", formattedDate);
            
          if (checkError) {
            throw checkError;
          }
          
          if (existingSlots && existingSlots.length > 0) {
            setTimeSlots(existingSlots);
            setSlotsLoading(false);
            return;
          }
          
          const mockSlots = Array(8).fill(0).map((_, index) => {
            const hour = Math.floor(index / 2) + 9;
            const minute = (index % 2) === 0 ? '00' : '30';
            const time = `${hour}:${minute}`;
            
            return {
              date: formattedDate,
              time,
              doctor_id: id,
              is_booked: false
            };
          });
          
          const { data: insertedSlots, error: insertError } = await supabase
            .from("time_slots")
            .insert(mockSlots)
            .select();
            
          if (insertError) {
            throw insertError;
          }
          
          setTimeSlots(insertedSlots || []);
        } else {
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
        }
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

  const handleBookingSuccess = () => {
    const updatedTimeSlots = timeSlots.map(slot => 
      slot.id === selectedSlot ? { ...slot, is_booked: true } : slot
    );
    setTimeSlots(updatedTimeSlots);
    setSelectedSlot(null);
    setReason("");
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
          <DoctorProfile doctor={doctor} />
          
          <div className="mt-8 bg-white rounded-lg border p-6">
            <h2 className="text-xl font-bold mb-4">Book an Appointment</h2>
            
            <BookingCalendar 
              selectedDate={selectedDate}
              timeSlots={timeSlots}
              slotsLoading={slotsLoading}
              selectedSlot={selectedSlot}
              onDateChange={handleDateChange}
              onSlotSelect={handleSlotSelection}
            />
            
            <div className="mt-4">
              <BookingForm 
                doctorId={id || ''}
                selectedSlot={selectedSlot}
                reason={reason}
                setReason={setReason}
                userId={user?.id}
                onSuccess={handleBookingSuccess}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DoctorDetails;
