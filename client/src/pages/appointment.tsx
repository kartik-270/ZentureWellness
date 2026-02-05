import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { MessageCircle, Video, PhoneCall, User } from "lucide-react";
import { apiConfig } from "@/lib/config";

const customCalendarStyles = `
.react-calendar {
  border: none;
  font-family: inherit;
  width: 100%;
  border-radius: 0.5rem;
  background: #f9fafb;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
.react-calendar__tile {
  border-radius: 0.5rem;
  padding: 0.75rem 0.5rem;
}
.react-calendar__tile--active {
  background: #2563eb;
  color: white;
  font-weight: bold;
}
.react-calendar__tile:enabled:hover {
  background: #dbeafe;
}
.react-calendar__navigation button {
  color: #2563eb;
  font-weight: bold;
}
`;

interface Counselor {
  id: number;       // CounselorProfile.id
  user_id: number;  // User.id (use this for booking)
  name: string;
  specialty: string;
  reviews: number;
  image: string;
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
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [selectedCounselorProfileId, setSelectedCounselorProfileId] = useState<number | null>(null);
  const [selectedCounselorUserId, setSelectedCounselorUserId] = useState<number | null>(null);
  const [selectedCounselorDetails, setSelectedCounselorDetails] = useState<Counselor | null>(null);
  const [mode, setMode] = useState("");
  const [notes, setNotes] = useState("");
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<{ time: string, available: boolean }[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoggedIn(false);
      return;
    }
    setLoggedIn(true);

    const fetchCounselors = async () => {
      try {
        const res = await fetch(`${apiConfig.baseUrl}/counselors`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch counselors");
        const data = await res.json();
        setCounselors(data || []);
      } catch (err) {
        console.error("Failed to fetch counselors:", err);
      }
    };
    fetchCounselors();
  }, []);

  useEffect(() => {
    const fetchSlots = async () => {
      if (selectedDate && selectedCounselorProfileId) {
        setIsLoading(true);
        const token = localStorage.getItem("authToken");
        // Fix: Use local date for slots fetching too
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        try {
          const res = await fetch(
            `${apiConfig.baseUrl}/counselor/profile/${selectedCounselorProfileId}?date=${formattedDate}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (!res.ok) {
            throw new Error(`Failed to fetch slots: ${res.statusText}`);
          }

          const data = await res.json();
          setAvailableSlots(data.available_slots || []);
        } catch (err) {
          console.error("Failed to fetch slots:", err);
          setAvailableSlots([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setAvailableSlots([]);
      }
    };

    fetchSlots();
  }, [selectedDate, selectedCounselorProfileId]);

  const handleStep1Next = () => {
    if (!selectedDate || !selectedCounselorProfileId || !selectedCounselorUserId || !selectedTime) {
      alert("Please select a counselor, date, and a time slot.");
      return;
    }
    const counselor = counselors.find(c => c.id === selectedCounselorProfileId);
    if (!counselor) {
      alert("Selected counselor not found.");
      return;
    }
    setSelectedCounselorDetails(counselor);
    setStep(2);
  };

  const handleStep2Next = async () => {
    if (!mode || !selectedCounselorDetails || !selectedTime || !selectedDate) {
      alert("Please select a mode of communication.");
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
      Message: "message",
      "Video Call": "video_call",
      "Personal Meeting": "in_person",
      "Phone Call": "voice_call",
    };

    // Fix: Use local date components to avoid UTC offset issues
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    try {
      const res = await fetch(`${apiConfig.baseUrl}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          counselor_id: selectedCounselorUserId, // Use user_id for booking
          appointment_date: formattedDate,
          appointment_time: selectedTime,
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
        alert(data.error || "Booking failed. " + (data.msg || "Please try another slot."));
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getModeIcon = (modeName: string) => {
    const base = "w-12 h-12 text-blue-600";
    switch (modeName) {
      case "Message": return <MessageCircle className={base} />;
      case "Video Call": return <Video className={base} />;
      case "Personal Meeting": return <User className={base} />;
      case "Phone Call": return <PhoneCall className={base} />;
      default: return <MessageCircle className={base} />;
    }
  };

  const handleAddToCalendar = () => {
    if (!appointment) return;
    const startDateTime = new Date(`${appointment.date}T${appointment.time}`);
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60000);
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=Counseling+Session+with+${appointment.counselor}&dates=${startDateTime.toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${endDateTime.toISOString().replace(/[-:]/g, "").split(".")[0]}Z&details=${appointment.description}&location=Online&sf=true&output=xml`;
    window.open(url, "_blank");
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto min-h-[74vh]">
        <style>{customCalendarStyles}</style>
        <h2 className="text-2xl font-bold mb-6 text-center">Book a Session with a Counselor</h2>

        {!loggedIn ? (
          <div className="flex flex-col items-center justify-center text-center p-10 border rounded-xl bg-gray-50">
            <p className="text-lg font-medium mb-4">To schedule an appointment, you have to log in.</p>
            <button
              onClick={() => setLocation("/login")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <>
            {step === 1 && (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Choose Counselor</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {counselors.map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSelectedCounselorProfileId(c.id);
                          setSelectedCounselorUserId(c.user_id);
                        }}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedCounselorProfileId === c.id
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-300 hover:border-gray-400"
                          }`}
                      >
                        <img src={c.image} alt={c.name} className="w-12 h-12 rounded-full" />
                        <div>
                          <p className="font-semibold">{c.name}</p>
                          <p className="text-sm text-gray-600">Specialty: {c.specialty}</p>
                          <p className="text-sm text-yellow-600">⭐ {c.reviews} Reviews</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Select Date</h3>
                  <Calendar
                    onChange={(v) => {
                      if (v instanceof Date) {
                        setSelectedDate(v);
                        setSelectedTime(null);
                      }
                    }}
                    value={selectedDate}
                    className="w-full"
                    minDate={new Date()}
                  />
                  {selectedDate && selectedCounselorProfileId && (
                    <div className="mt-4">
                      <h3 className="font-semibold text-lg mb-2">Select Time Slot</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {isLoading ? (
                          <p>Loading slots...</p>
                        ) : availableSlots.length > 0 ? (
                          availableSlots.map((slot: any, i) => (
                            <button
                              key={i}
                              disabled={!slot.available}
                              onClick={() => setSelectedTime(slot.time)}
                              className={`py-2 px-4 rounded-lg border text-sm transition-all
                                ${!slot.available
                                  ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-200"
                                  : selectedTime === slot.time
                                    ? "bg-blue-600 text-white border-blue-600 shadow-md transform scale-105"
                                    : "bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50"
                                }`}
                            >
                              {slot.time}
                            </button>
                          ))
                        ) : (
                          <p className="col-span-3 text-gray-500">No slots available</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleStep1Next}
                  className="col-span-2 bg-blue-600 text-white py-2 rounded-lg mt-4 hover:bg-blue-700 disabled:bg-gray-400"
                  disabled={!selectedCounselorProfileId || !selectedDate || !selectedTime}
                >
                  Next
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="font-semibold text-lg mb-4">Select Mode of Communication</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["Message", "Video Call", "Personal Meeting", "Phone Call"].map(m => (
                    <div
                      key={m}
                      onClick={() => setMode(m)}
                      className={`flex flex-col items-center p-4 rounded-lg border cursor-pointer transition ${mode === m ? "border-blue-500 bg-blue-50 shadow" : "border-gray-300 hover:border-gray-400"
                        }`}
                    >
                      {getModeIcon(m)}
                      <p className="mt-2 font-medium">{m}</p>
                    </div>
                  ))}
                </div>

                <textarea
                  placeholder="Additional notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border rounded-lg p-3 mt-4"
                />

                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleStep2Next}
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {isLoading ? "Booking..." : "Confirm"}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && appointment && (
              <div className="text-center">
                <h3 className="text-xl font-bold text-green-600 mb-4">Appointment Confirmed!</h3>
                <p className="mb-2">Counselor: {appointment.counselor}</p>
                <p className="mb-2">Date: {appointment.date}</p>
                <p className="mb-2">Time: {appointment.time}</p>
                <p className="mb-2">Mode: {appointment.mode}</p>
                <p className="mb-6">Status: {appointment.status}</p>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleAddToCalendar}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                  >
                    Add to Calendar
                  </button>
                  <button
                    onClick={() => setLocation("/dashboard")}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default BookingPage;