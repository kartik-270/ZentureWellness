import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css'; // Default styles
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { MessageCircle, Video, PhoneCall, User } from "lucide-react"; // Add at the top

// You can add your own custom CSS to override styles
const customCalendarStyles = `
  .react-calendar {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-family: Arial, sans-serif;
    padding: 10px;
    background-color: #fff;
  }

  .react-calendar__tile {
    padding: 10px 6px;
    border-radius: 4px;
  }
  
  .react-calendar__tile--now {
    background: #e6f3ff;
  }

  .react-calendar__tile--active {
    background: #2563eb;
    color: white;
  }

  .react-calendar__month-view__weekdays__weekday abbr {
    text-decoration: none;
    font-weight: bold;
    color: #333;
  }

  .react-calendar__month-view__days__day--weekend {
    color: #d11c1c;
  }
`;

interface Counselor {
  id: number;
  name: string;
  specialization: string;
  reviews: number;
  image: string;
  counselor_profile_id: number;
}

interface Appointment {
  counselor: string;
  date: string;
  time: string;
  mode: string;
  description: string;
  status: string;
}

const BookingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Use Date object for Calendar
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [selectedCounselorId, setSelectedCounselorId] = useState<number | null>(null);
  const [selectedCounselorDetails, setSelectedCounselorDetails] = useState<Counselor | null>(null);
  const [mode, setMode] = useState("");
  const [notes, setNotes] = useState("");
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCounselors = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No auth token found.");
        return;
      }
      try {
        const res = await fetch("http://localhost:5000/api/counselors", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch counselors.");
        }
        const data = await res.json();
        setCounselors(data || []);
      } catch (err) {
        console.error("Failed to fetch counselors:", err);
      }
    };
    fetchCounselors();
  }, []);

  const handleStep1Next = () => {
    if (!selectedDate || !selectedCounselorId) {
      alert("Please select a date and counselor.");
      return;
    }
    const counselor = counselors.find(c => c.user_id === selectedCounselorId);
    if (!counselor) {
      alert("Selected counselor not found.");
      return;
    }
    setSelectedCounselorDetails(counselor);
    setStep(2);
  };

  const handleStep2Next = async () => {
    if (!mode) {
      alert("Please select a mode of communication.");
      return;
    }
    if (!selectedCounselorDetails) {
        alert("Counselor details are missing.");
        return;
    }

    setIsLoading(true);
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You are not authenticated. Please log in.");
      setIsLoading(false);
      return;
    }

    const modeMap: Record<string, string> = {
      "Message": "message",
      "Video Call": "video_call",
      "Personal Meeting": "in_person",
      "Phone Call": "voice_call",
    };
    
    // Format the date for the backend
    const formattedDate = selectedDate?.toISOString().split('T')[0];
    if (!formattedDate) {
        alert("Invalid date selected.");
        setIsLoading(false);
        return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          counselor_id: selectedCounselorId,
          appointment_date: formattedDate,
          mode: modeMap[mode],
          description: notes,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setAppointment({
          counselor: selectedCounselorDetails.name,
          date: formattedDate,
          time: data.appointment.time,
          mode: mode,
          description: notes,
          status: data.appointment.status,
        });
        setStep(3);
      } else {
        alert(data.error || "Booking failed. " + data.msg);
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar/>
      <div className="p-6 max-w-5xl mx-auto min-h-[74vh]">
        <style>{customCalendarStyles}</style>
        <h2 className="text-2xl font-bold mb-6 text-center">Book a Session with a Counselor</h2>
        
        {step === 1 && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold bg-blue-600 text-white">1</div>
                  <h3 className="font-semibold">Select Date</h3>
              </div>
              <Calendar 
                  onChange={(value) => {
                      if (value instanceof Date) {
                        setSelectedDate(value);
                      }
                  }} 
                  value={selectedDate} 
                  className="w-full"
                  minDate={new Date()}
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold bg-gray-300 text-gray-500">2</div>
                  <h3 className="font-semibold">Choose Counselor</h3>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {counselors.map((c) => (
                  <div
                    key={c.user_id}
                    onClick={() => setSelectedCounselorId(c.user_id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                      selectedCounselorId === c.user_id ? "border-blue-500 bg-blue-50" : "border-gray-300"
                    }`}
                  >
                    <img src={c.image} alt={c.name} className="w-12 h-12 rounded-full" />
                    <div>
                      <p className="font-semibold">{c.name}</p>
                      <p className="text-sm text-gray-600">Specialty: {c.specialization}</p>
                      <p className="text-sm text-yellow-600">⭐ {c.reviews} Reviews</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={handleStep1Next}
              className="col-span-2 bg-blue-600 text-white py-2 rounded-lg mt-4"
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-xl font-bold mb-4 text-center">Connect with Your Counselor</h3>
            
            <div className="flex items-center gap-4 mb-8 p-4 border rounded-lg bg-gray-100">
               <img src={selectedCounselorDetails?.image} alt={selectedCounselorDetails?.name} className="w-16 h-16 rounded-full" />
               <div>
                  <p className="font-semibold text-lg">{selectedCounselorDetails?.name}</p>
                  <p className="text-sm text-gray-600">Specialty: {selectedCounselorDetails?.specialization}</p>
                  <p className="text-sm text-yellow-600">⭐ {selectedCounselorDetails?.reviews} Reviews</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-1">
                  <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold bg-blue-600 text-white">3</div>
                      <h3 className="font-semibold">Select Mode</h3>
                  </div>
                  
<div className="grid grid-cols-2 gap-4">
  {["Message", "Video Call", "Personal Meeting", "Phone Call"].map((m) => {
    let Icon;
    switch (m) {
      case "Message":
        Icon = MessageCircle;
        break;
      case "Video Call":
        Icon = Video;
        break;
      case "Personal Meeting":
        Icon = User; // Represents in-person
        break;
      case "Phone Call":
        Icon = PhoneCall;
        break;
      default:
        Icon = MessageCircle;
    }

    return (
      <div
        key={m}
        onClick={() => setMode(m)}
        className={`flex flex-col items-center p-4 rounded-lg border cursor-pointer transition-colors ${
          mode === m ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <Icon className="w-12 h-12 mb-2 text-blue-600" />
        <p className="text-sm font-medium">{m}</p>
      </div>
    );
  })}
</div>
              </div>
              <div className="col-span-1">
                  <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold bg-gray-300 text-gray-500">4</div>
                      <h3 className="font-semibold">You Want to share anything</h3>
                  </div>
                  <textarea
                      className="border p-4 rounded-lg w-full h-48 focus:ring-2 focus:ring-blue-500"
                      placeholder="Type here!"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                  />
                  <button
                      onClick={handleStep2Next}
                      className="bg-blue-600 text-white py-2 rounded-lg mt-4 w-full"
                      disabled={isLoading}
                  >
                      {isLoading ? "Booking..." : "Next"}
                  </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && appointment && (
          <div className="flex flex-col items-center justify-center text-center p-6">
            <div className="w-24 h-24 rounded-full flex items-center justify-center bg-blue-100 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-8.83"/><path d="M22 4L12 14.01l-3-3"/></svg>
            </div>
            <h3 className="text-3xl font-bold mb-2">Booking Confirmed!</h3>
            <p className="text-lg text-gray-600 mb-6">You are set</p>
            <div className="text-left w-full max-w-sm border p-6 rounded-lg bg-gray-50">
              <p className="mb-2"><strong>Counselor :</strong> {appointment.counselor}</p>
              <p className="mb-2"><strong>Date :</strong> {appointment.date}</p>
              <p className="mb-2"><strong>Time :</strong> {appointment.time}</p>
              <p><strong>Method :</strong> {appointment.mode}</p>
            </div>
            <div className="mt-8 flex gap-4">
                <button className="bg-blue-600 text-white py-2 px-4 rounded-lg">Add to Calendar</button>
                <button className="border border-blue-600 text-blue-600 py-2 px-4 rounded-lg">View Session Details</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default BookingPage;