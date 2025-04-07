
import { format, parseISO } from "date-fns";
import { Calendar, Clock, FileText, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

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

interface AppointmentProps {
  id: string;
  doctor?: Doctor;
  time_slot?: TimeSlot;
  start_time?: string;
  end_time?: string;
  status: string;
  reason: string;
  notes?: string;
  onCancel?: (appointmentId: string) => void;
}

const AppointmentCard = ({
  id,
  doctor,
  time_slot,
  start_time,
  end_time,
  status,
  reason,
  notes,
  onCancel
}: AppointmentProps) => {
  const navigate = useNavigate();
  
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", { 
        weekday: "short", 
        year: "numeric", 
        month: "short", 
        day: "numeric" 
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };
  
  const formatTime = (timeStr: string) => {
    try {
      if (timeStr.includes('T')) {
        // Handle ISO format from start_time/end_time
        return new Date(timeStr).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });
      } else {
        // Handle time-only format from time_slot
        return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (error) {
      console.error("Time formatting error:", error);
      return "Invalid time";
    }
  };
  
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
  
  // Determine if appointment is in the past
  const isPast = () => {
    const now = new Date();
    
    if (start_time) {
      // Use start_time when available
      return new Date(start_time) <= now;
    } else if (time_slot) {
      // Fall back to time_slot
      return new Date(time_slot.date + " " + time_slot.time) <= now;
    }
    
    return false;
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              <img 
                src={doctor?.imageurl || "/placeholder.svg"} 
                alt={doctor?.name || "Doctor"} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{doctor?.name}</h3>
              <p className="text-sm text-primary">{doctor?.specialization}</p>
              
              <div className="mt-2 space-y-1">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>
                    {start_time ? formatDate(start_time) : 
                     (time_slot?.date ? formatDate(time_slot.date) : "N/A")}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>
                    {start_time ? formatTime(start_time) : 
                     (time_slot?.time ? formatTime(time_slot.time) : "N/A")}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col items-end">
            {renderStatusBadge(status)}
            
            <div className="mt-3 flex space-x-2">
              {!isPast() && status === "scheduled" && onCancel && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onCancel(id)}
                >
                  Cancel
                </Button>
              )}
              {isPast() ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(`/doctors/${doctor?.id}`)}
                >
                  Book Again
                </Button>
              ) : status === "scheduled" && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(`/doctors/${doctor?.id}`)}
                >
                  Reschedule
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-start">
            <FileText className="w-4 h-4 mt-0.5 text-gray-500 mr-2" />
            <div>
              <div className="text-sm font-medium text-gray-700">Reason for Visit</div>
              <p className="text-gray-600 mt-1">
                {reason}
              </p>
            </div>
          </div>
          
          {notes && (
            <div className="flex items-start mt-3">
              <FileText className="w-4 h-4 mt-0.5 text-gray-500 mr-2" />
              <div>
                <div className="text-sm font-medium text-gray-700">Doctor's Notes</div>
                <p className="text-gray-600 mt-1">
                  {notes}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
