
import Hero from "@/components/home/Hero";
import DoctorsList from "@/components/home/DoctorsList";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Stethoscope } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      
      <section className="bg-primary/5 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Medical Network</h2>
          <div className="flex flex-col md:flex-row justify-center gap-6 max-w-2xl mx-auto">
            <Link to="/register" className="flex-1">
              <Button className="w-full h-32 flex flex-col items-center justify-center gap-2 bg-white border border-primary text-primary hover:bg-primary/10">
                <User size={32} />
                <span>Register as Patient</span>
              </Button>
            </Link>
            <Link to="/doctor-register" className="flex-1">
              <Button className="w-full h-32 flex flex-col items-center justify-center gap-2 bg-primary border border-primary text-white hover:bg-primary/90">
                <Stethoscope size={32} />
                <span>Register as Doctor</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <DoctorsList />
      <Footer />
    </div>
  );
};

export default Index;
