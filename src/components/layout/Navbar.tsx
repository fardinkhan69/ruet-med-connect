import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X, User, Calendar, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "You have been signed out successfully.",
      });
      navigate("/");
    }
  };

  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="bg-primary text-white p-1 rounded">
            <Calendar size={20} />
          </span>
          <span className="font-bold text-xl text-primary">RUET Med Connect</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={cn(
              "text-secondary-foreground hover:text-primary transition-colors", 
              isActive("/") && "text-primary font-medium"
            )}
          >
            Home
          </Link>
          <Link 
            to="/doctors" 
            className={cn(
              "text-secondary-foreground hover:text-primary transition-colors", 
              isActive("/doctors") && "text-primary font-medium"
            )}
          >
            Doctors
          </Link>
          <Link 
            to="/appointments" 
            className={cn(
              "text-secondary-foreground hover:text-primary transition-colors", 
              isActive("/appointments") && "text-primary font-medium"
            )}
          >
            Appointments
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium">
                {user.email}
              </div>
              <Button 
                variant="outline" 
                className="flex items-center space-x-1"
                onClick={handleSignOut}
              >
                <LogOut size={16} />
                <span>Sign out</span>
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Login
                </Button>
              </Link>
              <div className="flex space-x-2">
                <Link to="/register">
                  <Button className="bg-primary text-white hover:bg-primary/90">
                    Register
                  </Button>
                </Link>
                <Link to="/doctor-register">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                    Register as Doctor
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMenu}
          className="md:hidden text-secondary p-1"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white pt-16">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className={cn(
                "py-3 px-4 rounded-md text-lg", 
                isActive("/") ? "bg-primary/10 text-primary font-medium" : "text-secondary-foreground"
              )}
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              to="/doctors" 
              className={cn(
                "py-3 px-4 rounded-md text-lg", 
                isActive("/doctors") ? "bg-primary/10 text-primary font-medium" : "text-secondary-foreground"
              )}
              onClick={toggleMenu}
            >
              Doctors
            </Link>
            <Link 
              to="/appointments" 
              className={cn(
                "py-3 px-4 rounded-md text-lg", 
                isActive("/appointments") ? "bg-primary/10 text-primary font-medium" : "text-secondary-foreground"
              )}
              onClick={toggleMenu}
            >
              Appointments
            </Link>
            
            <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3">
              {user ? (
                <>
                  <div className="px-4 py-2 text-sm font-medium">
                    {user.email}
                  </div>
                  <Button 
                    onClick={() => {
                      handleSignOut();
                      toggleMenu();
                    }}
                    className="flex items-center justify-center space-x-2"
                  >
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={toggleMenu}>
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={toggleMenu}>
                    <Button className="bg-primary text-white hover:bg-primary/90 w-full">
                      Register
                    </Button>
                  </Link>
                  <Link to="/doctor-register" onClick={toggleMenu}>
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white w-full">
                      Register as Doctor
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
