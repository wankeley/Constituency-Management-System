"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Vote, Calendar, AlertCircle, User, Megaphone, ArrowRight, Bell } from "lucide-react";

interface Announcement {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    creator: { name: string };
}

interface Poll {
    id: number;
    title: string;
    _count: { responses: number };
}

interface Event {
    id: number;
    title: string;
    eventDate: string;
    location: string;
}

export default function ConstituentHome() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [polls, setPolls] = useState<Poll[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

        const [annRes, pollsRes, eventsRes] = await Promise.all([
            fetch("/api/announcements", { credentials: "include", headers }),
            fetch("/api/polls", { credentials: "include", headers }),
            fetch("/api/events", { credentials: "include", headers }),
        ]);

        if (annRes.ok) setAnnouncements(await annRes.json());
        if (pollsRes.ok) setPolls((await pollsRes.json()).slice(0, 3));
        if (eventsRes.ok) setEvents((await eventsRes.json()).slice(0, 3));
        setLoading(false);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
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

    return (
        <div className="space-y-8 animate-fade-up">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-6 md:p-8 shadow-xl">
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>
                <div className="relative">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Welcome to Your Constituency</h1>
                    <p className="text-white/80 max-w-2xl text-sm md:text-base">
                        Stay connected with your community. Participate in polls, attend events, and help improve your neighborhood.
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {[
                    { href: "/constituent/polls", label: "Vote in Polls", icon: Vote, color: "from-indigo-500 to-purple-600", shadow: "shadow-indigo-100" },
                    { href: "/constituent/events", label: "View Events", icon: Calendar, color: "from-cyan-500 to-blue-600", shadow: "shadow-cyan-100" },
                    { href: "/constituent/issues", label: "Report Issue", icon: AlertCircle, color: "from-orange-500 to-red-500", shadow: "shadow-orange-100" },
                    { href: "/constituent/profile", label: "My Profile", icon: User, color: "from-green-500 to-emerald-600", shadow: "shadow-green-100" },
                ].map((action) => {
                    const Icon = action.icon;
                    return (
                        <Link
                            key={action.href}
                            href={action.href}
                            className="p-4 md:p-6 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group card-hover"
                        >
                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${action.color} ${action.shadow} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                                <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                            <p className="text-slate-800 font-medium text-sm md:text-base">{action.label}</p>
                        </Link>
                    );
                })}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Announcements */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-slate-400" />
                        <h2 className="text-lg font-semibold text-slate-800">Latest Announcements</h2>
                    </div>

                    {announcements.length === 0 ? (
                        <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center shadow-sm">
                            <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500">No announcements yet</p>
                        </div>
                    ) : (
                        announcements.map((ann) => (
                            <div
                                key={ann.id}
                                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-100">
                                        <Megaphone className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-semibold text-slate-800 mb-1">{ann.title}</h3>
                                        <p className="text-slate-500 text-sm mb-2 line-clamp-2">{ann.content}</p>
                                        <p className="text-xs text-slate-400">
                                            {formatDate(ann.createdAt)} • {ann.creator.name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Active Polls */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Vote className="w-4 h-4 text-slate-400" />
                                <h3 className="font-semibold text-slate-800">Active Polls</h3>
                            </div>
                            <Link href="/constituent/polls" className="text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center gap-1">
                                View all <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="space-y-2">
                            {polls.map((poll) => (
                                <Link
                                    key={poll.id}
                                    href="/constituent/polls"
                                    className="block p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors"
                                >
                                    <p className="text-slate-800 text-sm font-medium">{poll.title}</p>
                                    <p className="text-xs text-slate-500">{poll._count.responses} votes</p>
                                </Link>
                            ))}
                            {polls.length === 0 && (
                                <p className="text-slate-400 text-sm text-center py-2">No active polls</p>
                            )}
                        </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <h3 className="font-semibold text-slate-800">Upcoming Events</h3>
                            </div>
                            <Link href="/constituent/events" className="text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center gap-1">
                                View all <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="space-y-2">
                            {events.map((event) => (
                                <Link
                                    key={event.id}
                                    href="/constituent/events"
                                    className="block p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors"
                                >
                                    <p className="text-slate-800 text-sm font-medium">{event.title}</p>
                                    <p className="text-xs text-slate-500">
                                        {formatDate(event.eventDate)} • {event.location}
                                    </p>
                                </Link>
                            ))}
                            {events.length === 0 && (
                                <p className="text-slate-400 text-sm text-center py-2">No upcoming events</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
