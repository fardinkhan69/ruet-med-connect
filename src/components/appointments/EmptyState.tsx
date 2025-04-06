
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const EmptyState = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default EmptyState;
