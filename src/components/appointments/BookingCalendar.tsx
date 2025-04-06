
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";

interface TimeSlot {
  id: string;
  time: string;
  date: string;
  is_booked: boolean;
  doctor_id: string;
}

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  timeSlots: TimeSlot[];
  slotsLoading: boolean;
  selectedSlot: string | null;
  onDateChange: (date: Date | undefined) => void;
  onSlotSelect: (slotId: string) => void;
}

const BookingCalendar = ({
  selectedDate,
  timeSlots,
  slotsLoading,
  selectedSlot,
  onDateChange,
  onSlotSelect,
}: BookingCalendarProps) => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="font-medium text-gray-700 mb-2 flex items-center">
          <CalendarIcon className="h-4 w-4 mr-1" />
          Select Date
        </h3>
        <div className="border rounded-md p-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            disabled={(date) => 
              date < new Date() || 
              date > new Date(new Date().setDate(new Date().getDate() + 30))
            }
            className="rounded-md w-full"
            showOutsideDays={false}
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
                onClick={() => onSlotSelect(slot.id)}
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
      </div>
    </div>
  );
};

export default BookingCalendar;
