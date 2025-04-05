
import { Star, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Doctor } from "@/lib/types";

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  return (
    <div className="medical-card flex flex-col h-full">
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
        <img 
          src={doctor.imageUrl} 
          alt={doctor.name} 
          className="w-24 h-24 rounded-full bg-gray-100 object-cover"
        />
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-semibold">{doctor.name}</h3>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mt-1">
            {doctor.specialization}
          </Badge>
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />
              <span className="ml-1 text-sm font-medium">{doctor.rating}</span>
            </div>
            <span className="text-gray-500 text-sm">•</span>
            <span className="text-sm text-gray-500">{doctor.experience} years exp.</span>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-500 mb-4">
        <p><span className="text-gray-700 font-medium">Education:</span> {doctor.education}</p>
        <p className="line-clamp-2 mt-1">{doctor.about}</p>
      </div>
      
      <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-100">
        <span className="text-sm text-gray-500">
          Available Today
        </span>
        <Link to={`/doctors/${doctor.id}`}>
          <Button 
            variant="outline" 
            className="text-primary border-primary hover:bg-primary hover:text-white"
          >
            Book Appointment <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;
