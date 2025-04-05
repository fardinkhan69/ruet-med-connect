
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Specialization } from "@/lib/types";
import { Search } from "lucide-react";

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (specialization: string) => void;
}

const specializations: Specialization[] = [
  "Cardiologist",
  "Dermatologist",
  "Gastrologist",
  "Neurologist",
  "Orthopedic",
  "Pediatrician",
  "Psychiatrist",
  "Ophthalmologist",
  "General Medicine"
];

const SearchFilters = ({ onSearch, onFilterChange }: SearchFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearch = () => {
    onSearch(searchQuery);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Find a Doctor</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="relative">
          <Input
            placeholder="Search by doctor name"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyPress}
            className="pl-10 w-full"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        </div>
        
        <div>
          <Select onValueChange={onFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Specialization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specializations</SelectItem>
              {specializations.map((spec) => (
                <SelectItem key={spec} value={spec.toLowerCase()}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          className="bg-primary hover:bg-primary/90" 
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchFilters;
