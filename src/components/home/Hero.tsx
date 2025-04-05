
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, ChevronRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
            <span className="font-medium">RUET Medical Center</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Your Health Is Our 
            <span className="text-primary"> Priority</span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-lg">
            Book appointments with qualified doctors, get medical consultations, and manage 
            your health with our easy-to-use platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link to="/doctors">
              <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
                Find Doctors <ChevronRight size={16} />
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white gap-2">
                Create Account <Calendar size={16} />
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-6 pt-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-9 h-9 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium">
                  {i}
                </div>
              ))}
            </div>
            <div>
              <span className="text-primary font-semibold">4.8/5</span>
              <p className="text-sm text-gray-500">from 200+ reviews</p>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-primary/5 rounded-2xl transform -rotate-3"></div>
          <div className="bg-white shadow-lg rounded-2xl p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Quick Appointment</h3>
              <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">Available Now</span>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 border rounded-lg flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Calendar className="text-primary w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Select a Specialist</p>
                  <p className="text-sm text-gray-500">Find the right doctor for you</p>
                </div>
              </div>
              
              <div className="p-3 border rounded-lg flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Calendar className="text-primary w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Book an Appointment</p>
                  <p className="text-sm text-gray-500">Choose convenient time slots</p>
                </div>
              </div>
              
              <div className="p-3 border rounded-lg flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Calendar className="text-primary w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Visit the Doctor</p>
                  <p className="text-sm text-gray-500">Get medical consultation</p>
                </div>
              </div>
              
              <div className="pt-2">
                <Link to="/doctors">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Find Doctor Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
