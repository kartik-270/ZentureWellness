export default function BookingStep3() {
  const appointmentData = localStorage.getItem("bookingConfirmed");
  const appointment = appointmentData ? JSON.parse(appointmentData) : null;

  if (!appointment) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">No booking found</h2>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <div className="bg-blue-50 p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Booking Confirmed!</h2>
        <p className="mb-4">
          You are set with <strong>{appointment.counselor_name}</strong>
        </p>

        <p>Date: {appointment.date}</p>
        <p>Time: {appointment.time}</p>
        <p>Method: {appointment.mode}</p>

        <div className="flex justify-center gap-4 mt-6">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Add to Calendar
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            View Session Details
          </button>
        </div>
      </div>
    </div>
  );
}
