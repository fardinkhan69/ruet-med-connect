
import { useState, useEffect } from "react";
import DoctorCard from "@/components/doctors/DoctorCard";
import SearchFilters from "@/components/home/SearchFilters";
import { Doctor, mockDoctors } from "@/lib/types";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>(mockDoctors);
  const [searchQuery, setSearchQuery] = useState("");
  const [specialization, setSpecialization] = useState("all");
  
  useEffect(() => {
    // Filter doctors based on search query and specialization
    let filtered = doctors;
    
    if (searchQuery) {
      filtered = filtered.filter(doctor => 
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (specialization !== "all") {
      filtered = filtered.filter(doctor => 
        doctor.specialization.toLowerCase() === specialization
      );
    }
    
    setFilteredDoctors(filtered);
  }, [doctors, searchQuery, specialization]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleFilterChange = (filter: string) => {
    setSpecialization(filter);
  };
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Our Specialized Doctors</h2>
          <p className="mt-2 text-lg text-gray-600">
            Book appointments with the best doctors for your health needs
          </p>
        </div>
        
        <SearchFilters 
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />
        
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-500">No doctors found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map(doctor => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DoctorsList;
