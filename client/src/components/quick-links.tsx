"use client";

import { Link } from "wouter";
import { BookOpen, Calendar, Heart, ListChecks } from "lucide-react";

interface QuickLinksProps {
    onChatTrigger: () => void;
}

export default function QuickLinks({ onChatTrigger }: QuickLinksProps) {
    return (
        <section className="py-14 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2
                    className="text-3xl lg:text-4xl font-bold text-foreground mb-12"
                    data-testid="quick-links-title"
                >
                    Quicks Link
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {/* Psychoeducational Hub */}
    <div className="bg-gradient-to-r from-blue-400 to-cyan-200 text-white p-6 rounded-xl shadow-sm border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
        <Link href="/psychoeducational-hub">
            <div className="flex items-start gap-3 mb-3">
                {/* Icon left side */}
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                    <BookOpen
                        className="text-primary text-xl group-hover:scale-110 transition-transform"
                        size={24}
                    />
                </div>
                {/* Title same line pe */}
                <h3 className="text-xl font-semibold text-foreground leading-tight my-auto group-hover:text-primary transition-colors flex-1">
                    Psychoeducational Hub
                </h3>
            </div>
            {/* Description neeche */}
            <p className="text-sm text-white/90 leading-relaxed hidden md:block">
                Explore articles, videos & audio for a healthier mind
            </p>
        </Link>
    </div>

    {/* Baaki 3 cards same structure use karo */}



                    {/* Book a Session */}
<div
    className="bg-gradient-to-r from-blue-400 to-cyan-200 text-white p-6 rounded-xl shadow-sm border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
    data-testid="card-book-session"
>
    <Link href="/book-appointment">
        <div className="flex items-start gap-3 mb-3">
            {/* Icon */}
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                <Calendar
                    className="text-primary text-xl group-hover:scale-110 transition-transform"
                    size={24}
                />
            </div>
            {/* Title same line */}
            <h3 className="text-xl font-semibold text-foreground leading-tight my-auto group-hover:text-primary transition-colors flex-1">
                Book a Session
            </h3>
        </div>
        <p className="text-sm text-white/90 leading-relaxed hidden md:block">
            Connect with a campus counselor
        </p>
    </Link>
</div>

{/* Peer Support */}
<div
    className="bg-gradient-to-r from-blue-400 to-cyan-200 text-white p-6 rounded-xl shadow-sm border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
    data-testid="card-peer-support"
>
    <Link href="/community">
        <div className="flex items-start gap-3 mb-3">
            {/* Icon */}
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                <Heart
                    className="text-primary text-xl group-hover:scale-110 transition-transform"
                    size={24}
                />
            </div>
            {/* Title same line */}
            <h3 className="text-xl font-semibold text-foreground leading-tight my-auto group-hover:text-primary transition-colors flex-1">
                Peer Support
            </h3>
        </div>
        <p className="text-sm text-white/90 leading-relaxed hidden md:block">
            Share & connect with fellow students
        </p>
    </Link>
</div>

{/* Self-Assessment Tests */}
<Link href="/self-assessment-tests">
    <div
        className="bg-gradient-to-r from-blue-400 to-cyan-200 text-white p-6 rounded-xl shadow-sm border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
        data-testid="card-self-assessment"
    >
        <div className="flex items-start gap-3 mb-3">
            {/* Icon */}
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                <ListChecks
                    className="text-primary text-xl group-hover:scale-110 transition-transform"
                    size={24}
                />
            </div>
            {/* Title same line */}
            <h3 className="text-xl font-semibold text-foreground leading-tight my-auto group-hover:text-primary transition-colors flex-1">
                Self-Assessment Tests
            </h3>
        </div>
        <p className="text-sm text-white/90 leading-relaxed hidden md:block">
            Take a quick mental health screening test
        </p>
    </div>

</Link>
                </div>

            </div>
        </section>
    );
}
