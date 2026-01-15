"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, Vote, Megaphone, Wrench, ArrowRight, Users, Calendar, BarChart3 } from "lucide-react";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth/me", { credentials: "include" });
                if (res.ok) {
                    const data = await res.json();
                    if (data.user.role === "CONSTITUENT") {
                        router.push("/constituent");
                    } else {
                        router.push("/admin");
                    }
                }
            } catch {
                // Not logged in, stay on landing
            }
        };
        checkAuth();
    }, [router]);

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-60"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-60"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-32">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Logo */}
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-200 mb-8 animate-fade-up">
                            <Building2 className="w-10 h-10 text-white" />
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6 animate-fade-up">
                            Constituency
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Portal</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 animate-fade-up stagger-1">
                            Connect with your representatives, participate in polls, report issues, and stay informed about your community.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up stagger-2">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-105 transition-all duration-300"
                            >
                                Sign In
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 hover:scale-105 transition-all duration-300"
                            >
                                Register as Constituent
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-slate-800 mb-4">What You Can Do</h2>
                    <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
                        Our platform empowers you to actively participate in your constituency&apos;s development.
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Vote, title: "Participate in Polls", desc: "Vote on important community decisions and make your voice heard", color: "from-indigo-500 to-indigo-600", shadow: "shadow-indigo-100" },
                            { icon: Megaphone, title: "Stay Informed", desc: "Get real-time updates and announcements from your MP", color: "from-purple-500 to-purple-600", shadow: "shadow-purple-100" },
                            { icon: Wrench, title: "Report Issues", desc: "Submit community issues and track their resolution", color: "from-orange-500 to-red-500", shadow: "shadow-orange-100" },
                            { icon: Calendar, title: "Attend Events", desc: "RSVP to community events and town halls", color: "from-cyan-500 to-blue-500", shadow: "shadow-cyan-100" },
                        ].map((feature, i) => (
                            <div key={i} className={`p-6 rounded-2xl bg-white border border-slate-100 shadow-lg ${feature.shadow} hover:scale-105 transition-all duration-300 card-hover`}>
                                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg mb-4`}>
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
                                <p className="text-slate-500 text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { icon: Users, value: "10K+", label: "Constituents" },
                            { icon: Vote, value: "500+", label: "Polls Conducted" },
                            { icon: Calendar, value: "200+", label: "Events Held" },
                            { icon: BarChart3, value: "95%", label: "Issues Resolved" },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <stat.icon className="w-8 h-8 text-white/80 mx-auto mb-2" />
                                <p className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</p>
                                <p className="text-white/80 text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-8 bg-slate-50 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-slate-500 text-sm">
                        © 2024 Constituency Management System. All rights reserved.
                    </p>
                </div>
            </footer>
        </main>
    );
}
