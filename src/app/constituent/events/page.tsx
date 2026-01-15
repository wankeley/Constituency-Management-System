"use client";

import { useEffect, useState } from "react";
import { Calendar, MapPin, Users, Clock, X, CheckCircle, HelpCircle, XCircle } from "lucide-react";

interface Event {
    id: number;
    title: string;
    description: string | null;
    location: string;
    eventDate: string;
    _count: { rsvps: number };
}

interface EventDetail extends Event {
    userRsvp?: string;
}

export default function ConstituentEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<EventDetail | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/events", {
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) setEvents(await res.json());
        setLoading(false);
    };

    const openEvent = async (eventId: number) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/events/${eventId}`, {
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) setSelectedEvent(await res.json());
    };

    const rsvp = async (status: string) => {
        if (!selectedEvent || submitting) return;
        setSubmitting(true);

        const token = localStorage.getItem("token");
        const res = await fetch(`/api/events/${selectedEvent.id}/rsvp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: "include",
            body: JSON.stringify({ status }),
        });

        if (res.ok) {
            setSelectedEvent({ ...selectedEvent, userRsvp: status });
            fetchEvents();
        }
        setSubmitting(false);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const isUpcoming = (date: string) => new Date(date) > new Date();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-up">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Community Events</h1>
                <p className="text-slate-500">Attend events and connect with your community.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {events.map((event) => (
                    <div
                        key={event.id}
                        className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all card-hover"
                    >
                        {/* Date Header */}
                        <div className={`p-4 text-center ${isUpcoming(event.eventDate) ? "bg-gradient-to-r from-cyan-500 to-blue-600" : "bg-slate-200"}`}>
                            <p className={`text-3xl font-bold ${isUpcoming(event.eventDate) ? "text-white" : "text-slate-600"}`}>
                                {new Date(event.eventDate).getDate()}
                            </p>
                            <p className={`text-sm ${isUpcoming(event.eventDate) ? "text-cyan-100" : "text-slate-500"}`}>
                                {new Date(event.eventDate).toLocaleDateString("en-US", { month: "short" })}
                            </p>
                        </div>

                        <div className="p-5">
                            <span
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium mb-3 ${isUpcoming(event.eventDate)
                                        ? "bg-green-50 text-green-600 border border-green-200"
                                        : "bg-slate-100 text-slate-500"
                                    }`}
                            >
                                {isUpcoming(event.eventDate) ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                {isUpcoming(event.eventDate) ? "Upcoming" : "Past"}
                            </span>

                            <h3 className="text-lg font-semibold text-slate-800 mb-2">{event.title}</h3>

                            <div className="space-y-2 text-sm text-slate-500 mb-4">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {event.location}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    {event._count.rsvps} attending
                                </div>
                            </div>

                            <button
                                onClick={() => openEvent(event.id)}
                                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-100 hover:shadow-cyan-200 hover:scale-[1.02] transition-all"
                            >
                                View Details & RSVP
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {events.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                    <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No events scheduled at the moment.</p>
                </div>
            )}

            {/* Event Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-slate-800">{selectedEvent.title}</h3>
                            <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {selectedEvent.description && (
                            <p className="text-slate-500 text-sm mb-4">{selectedEvent.description}</p>
                        )}

                        <div className="space-y-3 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3 text-slate-600">
                                <Calendar className="w-5 h-5 text-slate-400" />
                                <span className="text-sm">{formatDate(selectedEvent.eventDate)}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <MapPin className="w-5 h-5 text-slate-400" />
                                <span className="text-sm">{selectedEvent.location}</span>
                            </div>
                        </div>

                        <p className="text-sm text-slate-600 mb-4 text-center font-medium">Will you be attending?</p>

                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { status: "attending", label: "Attending", icon: CheckCircle, color: "from-green-500 to-emerald-600" },
                                { status: "maybe", label: "Maybe", icon: HelpCircle, color: "from-yellow-500 to-orange-500" },
                                { status: "declined", label: "Can't Go", icon: XCircle, color: "from-red-500 to-pink-500" },
                            ].map((option) => {
                                const Icon = option.icon;
                                return (
                                    <button
                                        key={option.status}
                                        onClick={() => rsvp(option.status)}
                                        disabled={submitting}
                                        className={`py-3 rounded-xl font-medium transition-all flex flex-col items-center gap-1 ${selectedEvent.userRsvp === option.status
                                                ? `bg-gradient-to-r ${option.color} text-white shadow-lg`
                                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="text-xs">{option.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {selectedEvent.userRsvp && (
                            <p className="text-center text-green-600 text-sm mt-4 font-medium flex items-center justify-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Your RSVP has been recorded
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
