import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BookingStep2() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const handleNext = async () => {
    const step1Data = localStorage.getItem("bookingStep1");
    if (!step1Data) return;

    const { date, counselor_id } = JSON.parse(step1Data);

    const res = await fetch("http://localhost:5000/book/step2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date,
        counselor_id,
        mode,
        notes,
        student_id: 1, // 🔹 replace with logged-in student ID
      }),
    });

    const appointment = await res.json();
    localStorage.setItem("bookingConfirmed", JSON.stringify(appointment));
    navigate("/step3");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Connect with Your Counselor</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-4 rounded-xl">
          <h3 className="font-semibold mb-2">3. Select Mode</h3>
          <div className="grid grid-cols-2 gap-4">
            {["Message", "Video Call", "Personal Meeting", "Phone Call"].map((m) => (
              <button
                key={m}
                className={`p-4 rounded shadow ${
                  mode === m ? "bg-blue-200" : "bg-white"
                }`}
                onClick={() => setMode(m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl">
          <h3 className="font-semibold mb-2">4. Share Anything</h3>
          <textarea
            className="w-full p-3 border rounded-md"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
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
