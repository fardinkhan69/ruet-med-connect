
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
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
      
      // Test the Supabase connection first
      const connectionTest = await testSupabaseConnection();
      console.log("Supabase connection test:", connectionTest);
      
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          doctor:doctor_id (*),
          time_slot:time_slot_id (*)
        `)
        .eq("patient_id", userId)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching appointments:", error);
        throw error;
      }
      
      console.log("Appointments fetched:", data);
      setAppointments(data || []);
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
      
      const { error: appointmentError } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", appointmentId);
      
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
  
  const upcomingAppointments = appointments.filter(
    app => app.status === "scheduled" && 
    app.time_slot && new Date(app.time_slot.date + " " + app.time_slot.time) > new Date()
  );
  
  const pastAppointments = appointments.filter(
    app => app.status === "completed" || 
    app.status === "cancelled" || 
    (app.time_slot && new Date(app.time_slot.date + " " + app.time_slot.time) <= new Date())
  );
  
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

// Helper function to test Supabase connection
const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('doctors').select('*').limit(1);
    if (error) {
      console.error('Supabase connection test failed:', error);
      return { success: false, error };
    }
    console.log('Supabase connection test succeeded:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error testing Supabase connection:', err);
    return { success: false, error: err };
  }
};
