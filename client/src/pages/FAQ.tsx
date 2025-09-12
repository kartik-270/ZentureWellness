import React from "react";
import Navbar from "@/components/navbar";   
import Footer from "@/components/footer";
export default function FAQ() {
  return (
    <div className="bg-gradient-to-b from-sky-100 to-sky-200 min-h-screen text-gray-800 flex flex-col">
      
        <Navbar />
      {/* FAQ Section */}
      <main className="flex-grow max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center text-sky-700 mb-12">FAQ</h2>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Left Column */}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold">Is my data confidential?</h3>
              <p className="text-gray-700">
                Yes, we prioritize your privacy and ensure that all data is
                securely encrypted.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">How do I book a session?</h3>
              <p className="text-gray-700">
                You can book an appointment with a counsellor through our
                confidential online booking system.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                Can I talk to someone anonymously?
              </h3>
              <p className="text-gray-700">
                Yes, you can access support groups and chat with volunteers
                without revealing your identity.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                What if I'm not sure what I'm feeling?
              </h3>
              <p className="text-gray-700">
                Our self-assessment tools can help you understand and identify
                your emotions.
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold">
                How do I join the peer support group?
              </h3>
              <p className="text-gray-700">
                You can sign up through the Community tab. Once verified, you’ll
                be matched with trained student volunteers and can join
                moderated forums.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                Are the resources culturally sensitive?
              </h3>
              <p className="text-gray-700">
                Yes, we provide content that respects and reflects diverse
                cultural backgrounds and languages.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                Can I access support in my regional language?
              </h3>
              <p className="text-gray-700">
                Yes, you can access support in regional languages like Hindi,
                Tamil, and others based on institutional and user preferences.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

