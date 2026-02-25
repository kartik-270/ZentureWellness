import React, { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { jwtDecode } from "jwt-decode";
import { apiConfig } from "@/lib/config";

interface TokenPayload {
    sub?: string;
    role?: string;
}

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

export default function Login() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [showPassword, setShowPassword] = useState(false);
    const [, setLocation] = useLocation();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!formData.username || !formData.password) {
            setError("Please enter both username and password.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${apiConfig.baseUrl}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            // Defensive: check content-type before parsing JSON
            const contentType = response.headers.get("content-type") || "";
            if (!contentType.includes("application/json")) {
                // read text to give useful debug info (first 300 chars)
                const text = await response.text();
                throw new Error(`Server returned non-JSON response (status ${response.status}): ${text.slice(0, 300)}`);
            }

            const data = await response.json();

            if (!response.ok) {
                // server returned a JSON error message
                throw new Error(data.msg || `Login failed with status ${response.status}`);
            }

            // Save token + username (keys match backend)
            localStorage.setItem("authToken", data.access_token);
            localStorage.setItem("username", data.username);

            // notify other tabs/components
            window.dispatchEvent(new Event("storage"));

            setSuccessMessage("Login successful! Redirecting...");

            // decode token safely to read role
            let userRole = "";
            try {
                const decoded = jwtDecode<TokenPayload>(data.access_token);
                userRole = decoded?.role || "";
                if (userRole) {
                    localStorage.setItem("userRole", userRole);
                }
            } catch (err) {
                console.warn("Could not decode token:", err);
            }

            // short delay so user can see success message (optional)
            setTimeout(() => {
                setLocation("/");
            }, 900);

        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred during login.");
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
                            <span className="text-4xl">🧠</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                    </div>

                    {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>}
                    {successMessage && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">{successMessage}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Your unique username"
                                value={formData.username}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Your password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                        <Button type="submit" disabled={isLoading || !formData.username || !formData.password}>
                            {isLoading ? "Signing In..." : "Sign In"}
                        </Button>
                    </form>
                    <div className="mt-8 text-center space-y-2">
                        <Link href="/forgot-username" className="text-blue-600 hover:underline font-medium block">
                            Forgot Username?
                        </Link>
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link href="/signup" className="text-blue-600 hover:underline font-medium">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}