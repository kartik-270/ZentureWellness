import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Login() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    console.log("Login submitted:", formData);
    // Handle login logic here
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header with Brain Icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <img 
              src="@assets/hero_1757353625355.png" 
              alt="Zenture Brain" 
              className="w-12 h-12 object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-gray-300'}`}></div>
            <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-gray-300'}`}></div>
          </div>
        </div>

        {/* Step 1: Email */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Enter email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@domain.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                data-testid="input-email"
              />
            </div>
            <Button 
              onClick={handleNext}
              disabled={!formData.email}
              className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium"
              data-testid="button-next"
            >
              Next
            </Button>
          </div>
        )}

        {/* Step 2: Password */}
        {step === 2 && (
          <div className="space-y-6">
            <button 
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
              data-testid="button-back"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </button>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Enter your password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                data-testid="input-password"
              />
            </div>
            <Button 
              onClick={handleSubmit}
              disabled={!formData.password}
              className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium"
              data-testid="button-submit"
            >
              Sign In
            </Button>
          </div>
        )}

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}