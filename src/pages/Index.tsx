
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import DoctorsList from "@/components/home/DoctorsList";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <DoctorsList />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
