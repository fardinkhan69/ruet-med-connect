
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Lock, User, AlertCircle, Calendar, Phone } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!name || !email || !password) {
      setError("Please fill out all required fields.");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    
    setLoading(true);
    
    try {
      const userData = {
        name,
        phone,
        date_of_birth: dateOfBirth,
        gender,
      };
      
      const { error } = await signUp(email, password, userData);
      
      if (error) {
        setError(error.message);
        return;
      }
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created. You can now sign in.",
      });
      
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Create a new account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                sign in to your existing account
              </Link>
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative flex items-center" role="alert">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User className="h-5 w-5" />
                  </div>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email address <span className="text-red-500">*</span></Label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dob">Date of Birth</Label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <Input
                      id="dob"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={gender}
                    onValueChange={(value) => setGender(value)}
                  >
                    <SelectTrigger id="gender" className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="•••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="•••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
