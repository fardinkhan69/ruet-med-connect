
export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  imageUrl: string;
  experience: number;
  rating: number;
  education: string;
  about: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
}

export interface TimeSlot {
  id: string;
  time: string;
  isBooked: boolean;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  timeSlot: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  followUp?: boolean;
  notes?: string;
}

export type Specialization = 
  | 'Cardiologist' 
  | 'Dermatologist'
  | 'Gastrologist' 
  | 'Neurologist'
  | 'Orthopedic'
  | 'Pediatrician'
  | 'Psychiatrist'
  | 'Ophthalmologist'
  | 'General Medicine';

export const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Khan",
    specialization: "Cardiologist",
    imageUrl: "/placeholder.svg",
    experience: 8,
    rating: 4.8,
    education: "MBBS, MD - Cardiology",
    about: "Dr. Sarah Khan is a renowned cardiologist with expertise in preventive cardiology and heart disease management."
  },
  {
    id: "2",
    name: "Dr. Rahul Patel",
    specialization: "Gastrologist",
    imageUrl: "/placeholder.svg",
    experience: 10,
    rating: 4.9,
    education: "MBBS, MD - Gastroenterology",
    about: "Dr. Rahul Patel specializes in digestive disorders and has performed numerous complex gastroenterological procedures."
  },
  {
    id: "3",
    name: "Dr. Aisha Rahman",
    specialization: "Neurologist",
    imageUrl: "/placeholder.svg",
    experience: 12,
    rating: 4.7,
    education: "MBBS, MD - Neurology",
    about: "Dr. Aisha Rahman is an expert in neurological disorders with special focus on stroke treatment and prevention."
  },
  {
    id: "4",
    name: "Dr. Mahfuz Ahmed",
    specialization: "Orthopedic",
    imageUrl: "/placeholder.svg",
    experience: 15,
    rating: 4.9,
    education: "MBBS, MS - Orthopedics",
    about: "Dr. Mahfuz Ahmed specializes in joint replacements and sports injuries with minimal invasive techniques."
  },
  {
    id: "5",
    name: "Dr. Fatima Begum",
    specialization: "Pediatrician",
    imageUrl: "/placeholder.svg",
    experience: 7,
    rating: 4.8,
    education: "MBBS, MD - Pediatrics",
    about: "Dr. Fatima Begum is a compassionate pediatrician dedicated to comprehensive child healthcare from infancy through adolescence."
  },
  {
    id: "6",
    name: "Dr. Mohammad Hossain",
    specialization: "General Medicine",
    imageUrl: "/placeholder.svg",
    experience: 9,
    rating: 4.6,
    education: "MBBS, MD - Internal Medicine",
    about: "Dr. Mohammad Hossain provides primary care services with special interest in managing chronic diseases and preventive healthcare."
  }
];

export const mockTimeSlots: TimeSlot[] = Array(20).fill(0).map((_, index) => {
  const hour = Math.floor(index / 2) + 9; // Starts from 9 AM
  const minute = (index % 2) === 0 ? '00' : '30';
  const time = `${hour}:${minute}`;
  
  return {
    id: `slot-${index + 1}`,
    time,
    isBooked: Math.random() > 0.7 // Randomly set some slots as booked
  };
});
