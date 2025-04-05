
import { Link } from "react-router-dom";
import { Doctor } from "@/lib/types";
import { Star, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  return (
    <div className="medical-card flex flex-col h-full">
      <div className="mb-4 overflow-hidden rounded-md">
        <img
          src={doctor.imageUrl}
          alt={doctor.name}
          className="w-full h-48 object-cover transition-transform hover:scale-105"
        />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
      <p className="text-primary">{doctor.specialization}</p>
      
      <div className="flex items-center mt-2 space-x-4">
        <div className="flex items-center text-amber-500">
          <Star className="h-4 w-4 fill-current" />
          <span className="ml-1 text-sm">{doctor.rating}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Award className="h-4 w-4" />
          <span className="ml-1 text-sm">{doctor.experience} Yrs</span>
        </div>
      </div>
      
      <p className="mt-3 text-sm text-gray-600 line-clamp-2 flex-grow">
        {doctor.about}
      </p>
      
      <div className="mt-4 pt-3 border-t">
        <Link to={`/doctors/${doctor.id}`}>
          <Button variant="default" size="sm" className="w-full">
            Book Appointment
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;
