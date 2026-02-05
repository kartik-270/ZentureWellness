import React, { useState } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
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


const ForgotUsername = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!email) {
            setError("Please enter your email address.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${apiConfig.baseUrl}/forgot-username`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || "Failed to process request.");
            }

            setSuccessMessage(data.msg);

        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
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
                            <span className="text-4xl">🔑</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Forgot Username?</h2>
                        <p className="text-sm text-gray-600 mt-2">Enter your email to retrieve your username.</p>
                    </div>

                    {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>}
                    {successMessage && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">{successMessage}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Your AKGEC email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={isLoading || !email}>
                            {isLoading ? "Sending..." : "Retrieve Username"}
                        </Button>
                    </form>
                    <div className="mt-8 text-center space-y-2">
                        <p className="text-sm text-gray-600">
                            Remember your username?{" "}
                            <Link href="/login" className="text-blue-600 hover:underline font-medium">
                                Back to login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ForgotUsername;