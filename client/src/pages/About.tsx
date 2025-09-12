// src/pages/About.tsx
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen gradient-bg text-gray-800">
      {/* Navbar */}
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto px-6 py-12 space-y-12 ">
        {/* Title Section */}
        <section className="text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            About Zenture
          </h1>
          <p className="text-lg text-gray-600">
            Our solution for{" "}
            <span className="font-semibold">
              Smart India Hackathon 2025
            </span>
          </p>
        </section>

        {/* Problem Statement */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">
            Problem Statement
          </h2>
          <div className="bg-white shadow-md rounded-xl p-6 space-y-2">
            <p>
              <span className="font-bold">ID:</span> 25092
            </p>
            <p>
              <span className="font-bold">Title:</span> Development of a Digital
              Mental Health and Psychological Support System for Students in
              Higher Education
            </p>
            <p>
              <span className="font-bold">Theme:</span> MedTech / BioTech /
              HealthTech
            </p>
            <p>
              <span className="font-bold">Category:</span> Software
            </p>
            <p>
              <span className="font-bold">Team:</span> Zenture (ID: T128)
            </p>
          </div>
        </section>

        {/* Challenges */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">
            Key Challenges
          </h2>
          <ul className="list-disc list-inside space-y-2 bg-white shadow-md rounded-xl p-6">
            <li>Under utilisation of counsellors</li>
            <li>Self stigma</li>
            <li>Neglecting mental wellness</li>
            <li>Personal and emotional barriers</li>
            <li>Data privacy and security</li>
            <li>Lack of accessibility</li>
            <li>Lack of early detection</li>
            <li>Financial constraints</li>
          </ul>
        </section>

        {/* Technical Approach */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">
            Our Technical Approach
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "AI-guided First Aid Chatbot",
                desc: "Provides instant, stigma-free mental health support with coping strategies and referral guidance.",
              },
              {
                title: "Confidential Booking",
                desc: "Enables private and secure appointments with counsellors or helpline.",
              },
              {
                title: "Psychoeducation Hub",
                desc: "Offers culturally relevant resources like videos, audios, and guides in regional languages.",
              },
              {
                title: "Peer Support",
                desc: "Facilitates safe, moderated student-to-student discussions for shared experiences.",
              },
              {
                title: "Self-Assessments",
                desc: "Allows students to evaluate their mental well-being using standard screening tools.",
              },
              {
                title: "Admin Dashboard",
                desc: "Provides anonymized analytics for authorities to monitor trends and design interventions.",
              },
              {
                title: "Counsellor Console",
                desc: "Gives counsellors access to case history, notes, and progress tracking tools.",
              },
              {
                title: "Progress Tracking",
                desc: "Helps students and counsellors monitor improvements over time with measurable indicators.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}