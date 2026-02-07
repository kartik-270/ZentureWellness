import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiConfig } from "@/lib/config";

interface Counselor {
  id: number;
  user_id: number;
  name: string;
  specialization: string;
  availability: Record<string, string>;
}

export default function BookingStep1() {
  const navigate = useNavigate();
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedCounselor, setSelectedCounselor] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${apiConfig.baseUrl.replace('/api', '')}/counselors`) // 🔗 backend route
      .then((res) => res.json())
      .then((data) => setCounselors(data));
  }, []);

  const handleNext = async () => {
    if (!selectedDate || !selectedCounselor) {
      alert("Please select a date and counselor.");
      return;
    }

    const res = await fetch(`${apiConfig.baseUrl.replace('/api', '')}/book/step1`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: selectedDate, counselor_id: selectedCounselor }),
    });

    const data = await res.json();
    localStorage.setItem("bookingStep1", JSON.stringify(data));
    navigate("/step2");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Book a Session with a Counselor</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Select Date */}
        <div className="bg-blue-50 p-4 rounded-xl">
          <h3 className="font-semibold mb-2">1. Select Date</h3>
          <input
            type="date"
            className="w-full p-3 border rounded-md"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {/* Choose Counselor */}
        <div className="bg-blue-50 p-4 rounded-xl">
          <h3 className="font-semibold mb-2">2. Choose Counselor</h3>
          <ul className="space-y-2">
            {counselors.map((counselor) => (
              <li
                key={counselor.id}
                className={`p-3 bg-white rounded shadow hover:bg-blue-100 cursor-pointer ${selectedCounselor === counselor.user_id ? "border-2 border-blue-500" : ""
                  }`}
                onClick={() => setSelectedCounselor(counselor.user_id)}
              >
                {counselor.name} ({counselor.specialization})
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={handleNext}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded"
      >
        Next
      </button>
    </div>
  );
}
