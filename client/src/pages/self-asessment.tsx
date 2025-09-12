import React from 'react';
import { Link } from 'wouter';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { BookOpen, Scale, Heart } from 'lucide-react'; // Using relevant icons for tests

export default function SelfAssessmentTests() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">Self-Assessment Tests</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take a quick, confidential screening test to better understand your mental health. Your results will not be shared.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/PHQ-9">
            <div className="bg-card p-6 rounded-xl shadow-lg border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <BookOpen className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-blue-600 transition-colors">
                PHQ-9
              </h3>
              <p className="text-muted-foreground">
                Patient Health Questionnaire, to screen for depression.
              </p>
            </div>
          </Link>

          <Link href="/GAD-7">
            <div className="bg-card p-6 rounded-xl shadow-lg border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <Scale className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-green-600 transition-colors">
                GAD-7
              </h3>
              <p className="text-muted-foreground">
                Generalized Anxiety Disorder, to screen for anxiety.
              </p>
            </div>
          </Link>
          
          <Link href="/GHQ-12">
            <div className="bg-card p-6 rounded-xl shadow-lg border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <Heart className="text-purple-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-purple-600 transition-colors">
                GHQ-12
              </h3>
              <p className="text-muted-foreground">
                General Health Questionnaire, to screen for psychiatric distress.
              </p>
            </div>
          </Link>
          
        </div>
      </main>
      <Footer />
    </div>
  );
}
