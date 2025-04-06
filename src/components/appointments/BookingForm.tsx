
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface BookingFormProps {
  doctorId: string;
  selectedSlot: string | null;
  reason: string;
  setReason: (reason: string) => void;
  userId: string | undefined;
  onSuccess: () => void;
}

const BookingForm = ({
  doctorId,
  selectedSlot,
  reason,
  setReason,
  userId,
  onSuccess,
}: BookingFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookingInProgress, setBookingInProgress] = useState(false);

  const handleBookAppointment = async () => {
    if (!userId) {
      toast({
        title: "Login Required",
        description: "Please login to book an appointment",
        variant: "destructive",
      });
      navigate("/login", { state: { from: `/doctors/${doctorId}` } });
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
      if (/^\d+$/.test(doctorId)) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast({
          title: "Success!",
          description: "Your appointment has been booked successfully (demo mode)",
        });
        
        setBookingInProgress(false);
        onSuccess();
        navigate("/appointments");
        return;
      }
      
      // Prepare appointment data
      const appointmentData = {
        patient_id: userId,
        doctor_id: doctorId,
        time_slot_id: selectedSlot,
        reason: reason,
        status: "scheduled",
        follow_up: false
      };
      
      console.log("Booking appointment with data:", appointmentData);
      
      // First update the time slot
      const { error: timeSlotError } = await supabase
        .from("time_slots")
        .update({ is_booked: true })
        .eq("id", selectedSlot);

      if (timeSlotError) {
        console.error("Time slot update error:", timeSlotError);
        throw timeSlotError;
      }

      // Then insert the appointment
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

      setBookingInProgress(false);
      onSuccess();
      navigate("/appointments");

    } catch (error: any) {
      console.error("Error booking appointment:", error);
      toast({
        title: "Booking Failed",
        description: error?.message || "There was an error booking your appointment. Please try again.",
        variant: "destructive",
      });
      setBookingInProgress(false);
    }
  };

  return (
    <>
      <h3 className="font-medium text-gray-700 mb-2">Reason for Visit</h3>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Briefly describe your symptoms or reason for the appointment"
        className="w-full border rounded-md p-2 h-24 text-sm"
      />
      
      <Button
        onClick={handleBookAppointment}
        disabled={!selectedSlot || !reason.trim() || bookingInProgress}
        className="w-full mt-4"
      >
        {bookingInProgress ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Booking...
          </>
        ) : (
          "Book Appointment"
        )}
      </Button>
    </>
  );
};

export default BookingForm;
