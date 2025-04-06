
import { Doctor } from "@/lib/types";
import { Star, Award, User } from "lucide-react";

interface DoctorProfileProps {
  doctor: Doctor;
}

const DoctorProfile = ({ doctor }: DoctorProfileProps) => {
  return (
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
      </div>
    </div>
  );
};

export default DoctorProfile;
