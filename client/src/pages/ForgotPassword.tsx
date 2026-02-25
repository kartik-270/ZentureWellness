import React, { useState } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Eye, EyeOff } from "lucide-react";
import { apiConfig } from "@/lib/config";

type ButtonProps = { children: React.ReactNode } & React.ComponentProps<'button'>;
const Button = ({ children, ...props }: ButtonProps) => (
    <button
        {...props}
        className={`w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-lg font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${props.disabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
    >
        {children}
    </button>
);

const Input = (props: React.ComponentProps<'input'>) => (
    <input
        {...props}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
);

type LabelProps = { children: React.ReactNode } & React.ComponentProps<'label'>;
const Label = ({ children, ...props }: LabelProps) => (
    <label {...props} className="text-sm font-medium text-gray-700 block mb-2">
        {children}
    </label>
);

type LinkProps = { href: string; children: React.ReactNode } & React.ComponentProps<'a'>;
const Link = ({ href, children, ...props }: LinkProps) => {
    const [, setLocation] = useLocation();
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setLocation(href);
    };
    return <a href={href} onClick={handleClick} {...props}>{children}</a>;
};

export default function ForgotPassword() {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [, setLocation] = useLocation();

    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!email) {
            setError("Please enter your email.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${apiConfig.baseUrl}/forgot-password/request`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.msg || "Failed to send OTP.");

            setSuccessMessage(data.msg);
            setStep(2);
        } catch (err: any) {
            setError(err.message || "An error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!otp) {
            setError("Please enter the OTP.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${apiConfig.baseUrl}/forgot-password/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.msg || "Invalid OTP.");

            setSuccessMessage(data.msg);
            setStep(3);
        } catch (err: any) {
            setError(err.message || "Verification failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!newPassword || !confirmPassword) {
            setError("Please enter and confirm your new password.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${apiConfig.baseUrl}/forgot-password/reset`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, new_password: newPassword }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.msg || "Failed to reset password.");

            setSuccessMessage("Password reset successful! Redirecting to login...");
            setTimeout(() => {
                setLocation("/login");
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Reset failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-4xl">🔐</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
                    </div>

                    {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>}
                    {successMessage && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">{successMessage}</div>}

                    {step === 1 && (
                        <form onSubmit={handleRequestOTP} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your registered email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Sending OTP..." : "Send OTP"}
                            </Button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="otp">Enter OTP</Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="Enter the 6-digit code"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                            <div className="text-sm text-center">
                                <button type="button" onClick={() => setStep(1)} className="text-blue-600 hover:underline">
                                    Resend OTP?
                                </button>
                            </div>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Verifying..." : "Verify OTP"}
                            </Button>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className="space-y-2 relative">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input
                                    id="newPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <div className="space-y-2 relative">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Resetting..." : "Reset Password"}
                            </Button>
                        </form>
                    )}

                    <div className="mt-8 text-center space-y-2">
                        <Link href="/login" className="text-blue-600 hover:underline font-medium block">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
