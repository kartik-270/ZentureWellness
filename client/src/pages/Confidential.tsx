import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  Shield,
  Lock,
  Users,
  EyeOff,
} from "lucide-react"; 

export default function ConfidentialPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#d9e6e9]">
      {/* Header */}
      <Navbar />

      {/* Main Section */}
      <main className="flex-1 flex justify-center items-start px-4 py-12">
        <div className="bg-white/70 rounded-lg shadow-lg p-8 max-w-5xl w-full">
          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800">
            Your Privacy, Our Priority
          </h1>
          <p className="mt-4 text-center text-gray-600 max-w-3xl mx-auto">
            The Zenture ensures users can interact confidently. Our trained
            moderators, secure booking system, and strong encryption provide a
            safe environment for mental health support.
          </p>

          {/* Cards Section */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <EyeOff className="mx-auto mb-4 w-12 h-12 text-blue-600" />
              <h3 className="font-semibold text-lg text-gray-800">
                Strict Anonymity
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Trained & trustworthy moderators keep sessions safe.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <Lock className="mx-auto mb-4 w-12 h-12 text-blue-600" />
              <h3 className="font-semibold text-lg text-gray-800">
                Data Encryption & Security
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                All conversations are encrypted end-to-end.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <Shield className="mx-auto mb-4 w-12 h-12 text-blue-600" />
              <h3 className="font-semibold text-lg text-gray-800">
                Confidential Booking
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Private sessions with trained moderators.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <Users className="mx-auto mb-4 w-12 h-12 text-blue-600" />
              <h3 className="font-semibold text-lg text-gray-800">
                Peer Support Privacy
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Anonymous participation & admin analytics.
              </p>
            </div>
          </div>

          {/* Button */}
          <div className="mt-10 text-center">
            <a
              href="#"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Learn More About Our Policies
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}