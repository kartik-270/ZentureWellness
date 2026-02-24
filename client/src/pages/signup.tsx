import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Eye, EyeOff } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { apiConfig } from "@/lib/config";
// --- UI Components ---
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
interface TokenPayload {
    sub: string;
    role: string;
}

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

const ArrowLeft = (props: React.ComponentProps<'svg'>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
    </svg>
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

// --- Signup Page Component ---
export default function Signup() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: "",
        otp: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        parentName: "",
        parentPhoneNumber: "",
        consent: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [apiMessage, setApiMessage] = useState<string | null>(null);
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);

    const tokenRef = useRef<string | null>(null);
    const [, setLocation] = useLocation();

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleApiResponse = async (response: Response) => {
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const responseText = await response.text();
            console.error("Server response was not JSON:", responseText);
            throw new Error("Invalid server response. Please ensure the API is running and returning JSON.");
        }
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || `Request failed with status ${response.status}`);
        }
        return data;
    };

    // --- Step 1 ---
    const handleStep1Submit = async () => {
        setError(null);
        setApiMessage(null);
        // if (!formData.email || !/\S+@akgec\.ac\.in/.test(formData.email)) {
        //     setError("Please enter a valid AKGEC email address.");
        //     return;
        // }

        setIsLoading(true);
        try {
            const response = await fetch(`${apiConfig.baseUrl}/register/start`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email }),
            });
            const data = await handleApiResponse(response);
            setApiMessage(data.msg);
            setStep(2);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- Step 2 ---
    const handleStep2Submit = async () => {
        setError(null);
        if (!formData.otp || !formData.password || !formData.confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        try {
            const createResponse = await fetch(`${apiConfig.baseUrl}/register/verify-and-create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email, otp: formData.otp, password: formData.password }),
            });
            const createData = await handleApiResponse(createResponse);

            // Immediately log the new user in
            const loginResponse = await fetch(`${apiConfig.baseUrl}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: createData.username, password: formData.password }),
            });
            const loginData = await handleApiResponse(loginResponse);

            setAuthToken(loginData.access_token);
            tokenRef.current = loginData.access_token;

            localStorage.setItem("authToken", loginData.access_token);
            localStorage.setItem("username", createData.username);

            setUsername(createData.username);

            // --- MODIFICATION START ---
            const decodedToken = jwtDecode<TokenPayload>(loginData.access_token);
            const userRole = decodedToken.role;

            // If user is an admin, redirect to admin dashboard and skip step 3
            if (userRole === 'admin') {
                setApiMessage("Admin account verified! Redirecting to dashboard...");
                window.dispatchEvent(new Event("storage")); // Notify navbar
                setTimeout(() => {
                    setLocation("/admin/dashboard");
                }, 2000);
            } else {
                // Otherwise, proceed to the profile completion step for students
                setApiMessage("Account created! Just one more step to complete your profile.");
                setStep(3);
            }
            // --- MODIFICATION END ---

        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred during account creation.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStep3Submit = async () => {
        setError(null);
        const { firstName, lastName, phoneNumber, parentName, parentPhoneNumber, consent } = formData;

        if (!firstName || !lastName || !phoneNumber || !parentName || !parentPhoneNumber) {
            setError("Please fill out all personal detail fields.");
            return;
        }
        if (!consent) {
            setError("You must provide consent to continue.");
            return;
        }

        if (!tokenRef.current) {
            setError("Authorization token is missing. Please complete Step 2 first.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${apiConfig.baseUrl}/register/complete-profile`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenRef.current}`,
                },
                body: JSON.stringify({
                    name: `${firstName} ${lastName}`,
                    phone_number: phoneNumber,
                    parent_name: parentName,
                    parent_phone_number: parentPhoneNumber,
                    consent: consent,
                }),
            });
            await handleApiResponse(response);

            setApiMessage("Signup complete! Redirecting you now...");

            // Notify the Navbar of the login status change before redirecting
            window.dispatchEvent(new Event("storage"));

            setTimeout(() => setLocation("/"), 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred while saving your profile.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        setStep(s => s - 1);
        setError(null);
        setApiMessage(null);
    };

    // --- Pager Component ---
    const Pager = ({ currentStep }: { currentStep: number }) => (
        <div className="flex justify-center mb-8">
            <div className="flex items-center w-full max-w-xs">
                {[1, 2, 3].map((stepNumber, index) => (
                    <React.Fragment key={stepNumber}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-colors ${currentStep >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'}`}>{stepNumber}</div>
                        {index < 2 && <div className={`flex-1 h-1 mx-2 transition-colors ${currentStep > stepNumber ? 'bg-blue-600' : 'bg-gray-300'}`}></div>}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );

    return (<>
        <Navbar />
        <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-8">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-4xl">🧠</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Join Zenture</h2>
                    <p className="text-gray-600 mt-2">Create your account in 3 simple steps.</p>
                </div>

                <Pager currentStep={step} />

                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>}
                {apiMessage && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">{apiMessage}</div>}
                {username && step === 3 && (
                    <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg text-center">
                        Your username is: <strong className="font-bold">{username}</strong>. Please save it.
                    </div>
                )}

                {/* --- Step 1 --- */}
                {step === 1 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-center text-gray-800">Step 1: Verify Your Email</h3>
                        <div>
                            <Input id="email" type="email" placeholder="your.email@akgec.ac.in" value={formData.email} onChange={e => handleInputChange("email", e.target.value)} />
                        </div>
                        <Button onClick={handleStep1Submit} disabled={isLoading || !formData.email}>{isLoading ? "Sending..." : "Send Verification Code"}</Button>
                    </div>
                )}

                {/* --- Step 2 --- */}
                {step === 2 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-center text-gray-800">Step 2: Create Your Account</h3>
                        <button onClick={handleBack} className="flex items-center text-sm text-gray-600 hover:text-gray-800"><ArrowLeft width={16} height={16} className="mr-1" /> Back</button>
                        <div>
                            <Label htmlFor="otp">Verification Code</Label>
                            <Input id="otp" type="text" placeholder="Enter 6-digit code" value={formData.otp} onChange={e => handleInputChange("otp", e.target.value)} />
                        </div>
                        <div className="relative">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a strong password"
                                value={formData.password}
                                onChange={e => handleInputChange("password", e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <div className="relative">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={e => handleInputChange("confirmPassword", e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <Button onClick={handleStep2Submit} disabled={isLoading || !formData.otp || !formData.password}>{isLoading ? "Verifying..." : "Create Account"}</Button>
                    </div>
                )}

                {/* --- Step 3 --- */}
                {step === 3 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-center text-gray-800">Step 3: Complete Your Profile</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" placeholder="Your first name" value={formData.firstName} onChange={e => handleInputChange('firstName', e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" placeholder="Your last name" value={formData.lastName} onChange={e => handleInputChange('lastName', e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input id="phoneNumber" placeholder="Your phone number" value={formData.phoneNumber} onChange={e => handleInputChange('phoneNumber', e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="parentName">Parent's Name</Label>
                            <Input id="parentName" placeholder="Your parent's name" value={formData.parentName} onChange={e => handleInputChange('parentName', e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="parentPhoneNumber">Parent's Phone Number</Label>
                            <Input id="parentPhoneNumber" placeholder="Your parent's phone number" value={formData.parentPhoneNumber} onChange={e => handleInputChange('parentPhoneNumber', e.target.value)} />
                        </div>
                        <div className="flex items-start space-x-3 pt-2">
                            <input id="consent" type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={formData.consent} onChange={e => handleInputChange('consent', e.target.checked)} />
                            <Label htmlFor="consent" className="text-xs text-gray-600 -mb-2">By checking this box, you consent to the secure storage of your personal information as per our privacy policy.</Label>
                        </div>
                        <Button onClick={handleStep3Submit} disabled={isLoading || !tokenRef.current}>{isLoading ? "Saving..." : "Finish Signup"}</Button>
                    </div>
                )}

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
        <Footer />

    </>
    );
}