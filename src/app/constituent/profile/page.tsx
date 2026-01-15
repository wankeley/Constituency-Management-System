"use client";

import { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, CreditCard, Calendar, Vote, AlertCircle } from "lucide-react";

interface UserData {
    id: number;
    name: string;
    email: string;
    voterId: string | null;
    age: number | null;
    location: string | null;
    phone: string | null;
    createdAt: string;
}

export default function ConstituentProfile() {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/auth/me", {
                credentials: "include",
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="animate-fade-up max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">My Profile</h1>
                <p className="text-slate-500">Your account information</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                            <p className="text-white/80">{user.email}</p>
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                <CreditCard className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Voter ID</label>
                                <p className="text-slate-800 font-medium">{user.voterId || "Not provided"}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Age</label>
                                <p className="text-slate-800 font-medium">{user.age ? `${user.age} years` : "Not provided"}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-5 h-5 text-cyan-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Location</label>
                                <p className="text-slate-800 font-medium">{user.location || "Not provided"}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                                <Phone className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Phone</label>
                                <p className="text-slate-800 font-medium">{user.phone || "Not provided"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Member Since</label>
                            <p className="text-slate-800 font-medium">{formatDate(user.createdAt)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                    { label: "Polls Voted", value: "—", icon: Vote, color: "from-indigo-500 to-purple-600", shadow: "shadow-indigo-100" },
                    { label: "Events Attended", value: "—", icon: Calendar, color: "from-cyan-500 to-blue-600", shadow: "shadow-cyan-100" },
                    { label: "Issues Reported", value: "—", icon: AlertCircle, color: "from-orange-500 to-red-500", shadow: "shadow-orange-100" },
                ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="bg-white border border-slate-100 rounded-xl p-4 text-center shadow-sm">
                            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} ${stat.shadow} mb-2 shadow-lg`}>
                                <Icon className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                            <p className="text-xs text-slate-500">{stat.label}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
