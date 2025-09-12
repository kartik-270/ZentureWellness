"use client";

import { Link } from "wouter";
import { BookOpen, Calendar, Heart, ListChecks } from "lucide-react";

interface QuickLinksProps {
    onChatTrigger: () => void;
}

export default function QuickLinks({ onChatTrigger }: QuickLinksProps) {
    return (
        <section className="py-4 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2
                    className="text-3xl lg:text-4xl font-bold text-foreground mb-12"
                    data-testid="quick-links-title"
                >
                    Quick Links
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/*Psychoeducational Hub*/}
                    <div className="gradient-bg bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                        <Link href="/psychoeducational-hub">
                            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                                <BookOpen
                                    className="text-primary text-xl group-hover:scale-110 transition-transform"
                                    size={24}
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                Psychoeducational Hub
                            </h3>
                            <p className="text-muted-foreground">
                                Explore articles, videos & audio for a healthier mind
                            </p>
                        </Link>
                    </div>

                    {/* Book a Session */}
                    <div
                        className="gradient-bg bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                        data-testid="card-book-session"
                    >
                        <Link href="/book-appointment">
                            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                                <Calendar
                                    className="text-primary text-xl group-hover:scale-110 transition-transform"
                                    size={24}
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                Book a Session
                            </h3>
                            <p className="text-muted-foreground">
                                Connect with a campus counselor
                            </p>
                        </Link>
                    </div>

                    {/* Peer Support */}
                    <div
                        className="gradient-bg bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                        data-testid="card-peer-support"
                    >
                        <Link href="/peer-support">
                            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                                <Heart
                                    className="text-primary text-xl group-hover:scale-110 transition-transform"
                                    size={24}
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                Peer Support
                            </h3>
                            <p className="text-muted-foreground">
                                Share & connect with fellow students
                            </p>
                        </Link>
                    </div>

                    {/*Self-Assessment Tests*/}
                    <Link href="/self-assessment-tests">
                        <div
                            className="gradient-bg bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                            data-testid="card-self-assessment"
                        >
                            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                                <ListChecks
                                    className="text-primary text-xl group-hover:scale-110 transition-transform"
                                    size={24}
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                Self-Assessment Tests
                            </h3>
                            <p className="text-muted-foreground">
                                Take a quick mental health screening test
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
