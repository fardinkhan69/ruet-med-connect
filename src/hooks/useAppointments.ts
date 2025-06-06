
import { useState, useEffect, useCallback } from "react";
import { supabase, logSupabaseOperation } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  start_time?: string;
  end_time?: string;
  doctor?: Doctor;
  time_slot?: TimeSlot;
}

export const useAppointments = (userId: string | undefined) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast();
  
  const fetchAppointments = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    try {
      console.log("Fetching appointments for user:", userId);
      setLoading(true);
      setError("");
      
      // Test the Supabase connection first
      const connectionTest = await logSupabaseOperation<any>(
        "connection test", 
        supabase.from('doctors').select('*').limit(1)
      );
      
      if (connectionTest.error) {
        console.error("Supabase connection test failed:", connectionTest.error);
      } else {
        console.log("Supabase connection test successful!");
      }
      
      // Detailed logging for appointment fetch
      console.log("Starting appointment fetch for user:", userId);
      
      const appointmentResult = await logSupabaseOperation<any>(
        "appointments fetch",
        supabase
          .from("appointments")
          .select(`
            *,
            doctor:doctor_id (*),
            time_slot:time_slot_id (*)
          `)
          .eq("patient_id", userId)
          .order("start_time", { ascending: false })
      );
      
      if (appointmentResult.error) {
        console.error("Error fetching appointments:", appointmentResult.error);
        throw appointmentResult.error;
      }
      
      console.log("Appointments fetched:", appointmentResult.data);
      setAppointments(appointmentResult.data || []);
    } catch (err: any) {
      console.error("Error fetching appointments:", err);
      setError(err?.message || "Failed to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userId]);
  
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);
  
  const cancelAppointment = async (appointmentId: string) => {
    try {
      const appointment = appointments.find(app => app.id === appointmentId);
      
      if (!appointment) {
        throw new Error("Appointment not found");
      }
      
      const appointmentUpdate = await logSupabaseOperation<any>(
        "appointment status update",
        supabase
          .from("appointments")
          .update({ status: "cancelled" })
          .eq("id", appointmentId)
      );
      
      if (appointmentUpdate.error) {
        throw appointmentUpdate.error;
      }
      
      const timeSlotUpdate = await logSupabaseOperation<any>(
        "time slot update for cancellation",
        supabase
          .from("time_slots")
          .update({ is_booked: false })
          .eq("id", appointment.time_slot_id)
      );
      
      if (timeSlotUpdate.error) {
        throw timeSlotUpdate.error;
      }
      
      setAppointments(appointments.map(app => 
        app.id === appointmentId 
          ? { ...app, status: "cancelled" } 
          : app
      ));
      
      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been cancelled successfully."
      });
      
      return true;
    } catch (err: any) {
      console.error("Error cancelling appointment:", err);
      toast({
        title: "Error",
        description: err?.message || "Failed to cancel appointment. Please try again.",
        variant: "destructive"
      });
      
      return false;
    }
  };
  
  // Updated to use start_time when available, otherwise fall back to time_slot
  const upcomingAppointments = appointments.filter(app => {
    if (app.status !== "scheduled") return false;
    
    const now = new Date();
    
    // Use start_time if available
    if (app.start_time) {
      return new Date(app.start_time) > now;
    }
    
    // Fall back to time_slot if start_time is not available
    return app.time_slot && new Date(app.time_slot.date + " " + app.time_slot.time) > now;
  });
  
  // Updated to use start_time when available, otherwise fall back to time_slot
  const pastAppointments = appointments.filter(app => {
    if (app.status === "cancelled") return true;
    if (app.status === "completed") return true;
    
    const now = new Date();
    
    // Use start_time if available
    if (app.start_time) {
      return new Date(app.start_time) <= now;
    }
    
    // Fall back to time_slot if start_time is not available
    return app.time_slot && new Date(app.time_slot.date + " " + app.time_slot.time) <= now;
  });
  
  return {
    appointments,
    upcomingAppointments,
    pastAppointments,
    loading,
    error,
    cancelAppointment,
    refetch: fetchAppointments
  };
};
