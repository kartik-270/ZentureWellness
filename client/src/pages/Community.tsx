// app/community/page.tsx  (if using Next.js App Router)
// or src/pages/community.tsx (if using Pages Router)

import React from "react";
import Navbar from "@/components/navbar";   
import Footer from "@/components/footer";

export default function Community() {
  return (
    <div className="bg-gradient-to-b from-sky-100 to-sky-200 min-h-screen flex flex-col">
      {/* Import Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-6 py-16">
        {/* Title */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl font-bold text-sky-700">Community</h2>
            <p className="text-gray-700 mt-2 max-w-2xl">
              Join our forum for stigma-free mental health and psychological support
            </p>
          </div>
          <button className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-full shadow-md transition">
            + New Post
          </button>
        </div>

        {/* Grid of posts */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Post 1 */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">📋</span>
              <h3 className="text-lg font-semibold">Managing Academic Stress</h3>
            </div>
            <p className="text-gray-700 mb-4">
              What are some effective ways to cope with academic pressure and workload?
            </p>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>JaneDoe • 2 hours ago • Coping Strategies</span>
              <div className="flex gap-4">
                <span>💬 3</span>
                <span>❤ 8</span>
              </div>
            </div>
          </div>

          {/* Post 2 */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">😟</span>
              <h3 className="text-lg font-semibold">Help with Anxiety Symptoms</h3>
            </div>
            <p className="text-gray-700 mb-4">
              I've been feeling overwhelmed lately. Does anyone have advice for managing anxiety?
            </p>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Student123 • 5 hours ago • Anxiety</span>
              <div className="flex gap-4">
                <span>💬 5</span>
                <span>❤ 12</span>
              </div>
            </div>
          </div>

          {/* Post 3 */}
          <div className="bg-white shadow-md rounded-xl p-6 col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">💡</span>
              <h3 className="text-lg font-semibold">Development of Mental Health System</h3>
            </div>
            <p className="text-gray-700 mb-4">
              How can we design an effective digital support system for colleges?
            </p>
            <p className="text-sm text-gray-500">Date: 20, 2025</p>
            <button className="mt-4 px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition">
              View More
            </button>
          </div>
        </div>
      </main>

      {/* Import Footer */}
      <Footer />
    </div>
  );
};

