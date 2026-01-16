"use client";

import { useEffect, useState } from "react";
import { Plus, Calendar, MapPin, Users, Clock, X, CheckCircle, XCircle, HelpCircle } from "lucide-react";

interface Event {
    id: number;
    title: string;
    description: string | null;
    location: string;
    eventDate: string;
    createdAt: string;
    creator: { name: string };
    _count: { rsvps: number };
}

interface RSVP {
    id: number;
    status: string;
    user: { name: string; email: string };
}

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
    const [rsvps, setRsvps] = useState<RSVP[]>([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        eventDate: "",
    });

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

    const fetchRSVPs = async (eventId: number) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/events/${eventId}`, {
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
            const data = await res.json();
            setRsvps(data.rsvps);
            setSelectedEvent(eventId);
        }
    };

    const createEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const res = await fetch("/api/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: "include",
            body: JSON.stringify(formData),
        });
        if (res.ok) {
            setShowModal(false);
            setFormData({ title: "", description: "", location: "", eventDate: "" });
            fetchEvents();
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
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
        <div className="space-y-6 animate-fade-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Events</h2>
                    <p className="text-slate-500">Organize and manage community events</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-100 hover:shadow-cyan-200 hover:scale-105 transition-all whitespace-nowrap"
                >
                    <Plus className="w-5 h-5" />
                    Create Event
                </button>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {events.map((event) => (
                    <div
                        key={event.id}
                        className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all card-hover"
                    >
                        {/* Date Badge */}
                        <div className={`p-4 text-center ${isUpcoming(event.eventDate) ? "bg-gradient-to-r from-cyan-500 to-blue-600" : "bg-slate-200"}`}>
                            <p className={`text-3xl font-bold ${isUpcoming(event.eventDate) ? "text-white" : "text-slate-600"}`}>
                                {new Date(event.eventDate).getDate()}
                            </p>
                            <p className={`text-sm ${isUpcoming(event.eventDate) ? "text-cyan-100" : "text-slate-500"}`}>
                                {new Date(event.eventDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                            </p>
                        </div>

                        <div className="p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <span
                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${isUpcoming(event.eventDate)
                                            ? "bg-green-50 text-green-600 border border-green-200"
                                            : "bg-slate-100 text-slate-500"
                                        }`}
                                >
                                    {isUpcoming(event.eventDate) ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                    {isUpcoming(event.eventDate) ? "Upcoming" : "Past"}
                                </span>
                            </div>

                            <h3 className="text-lg font-semibold text-slate-800 mb-2">{event.title}</h3>
                            <p className="text-sm text-slate-500 mb-4 line-clamp-2">{event.description}</p>

                            <div className="space-y-2 text-sm text-slate-500 mb-4">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {event.location}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {formatDate(event.eventDate)}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <span className="flex items-center gap-1.5 text-sm text-slate-500">
                                    <Users className="w-4 h-4" />
                                    {event._count.rsvps} RSVPs
                                </span>
                                <button
                                    onClick={() => fetchRSVPs(event.id)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
                                >
                                    View RSVPs
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {events.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                    <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No events yet. Create your first event!</p>
                </div>
            )}

            {/* RSVP Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-800">Event RSVPs</h3>
                            <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {rsvps.map((rsvp) => (
                                <div key={rsvp.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div>
                                        <p className="text-slate-800 font-medium">{rsvp.user.name}</p>
                                        <p className="text-xs text-slate-500">{rsvp.user.email}</p>
                                    </div>
                                    <span
                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${rsvp.status === "attending"
                                                ? "bg-green-50 text-green-600 border border-green-200"
                                                : rsvp.status === "maybe"
                                                    ? "bg-yellow-50 text-yellow-600 border border-yellow-200"
                                                    : "bg-red-50 text-red-600 border border-red-200"
                                            }`}
                                    >
                                        {rsvp.status === "attending" ? <CheckCircle className="w-3 h-3" /> : rsvp.status === "maybe" ? <HelpCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                        {rsvp.status}
                                    </span>
                                </div>
                            ))}
                            {rsvps.length === 0 && (
                                <p className="text-center text-slate-400 py-4">No RSVPs yet</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-800">Create New Event</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={createEvent} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Event Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-cyan-100 focus:border-cyan-400 transition-all"
                                    placeholder="Town Hall Meeting"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-cyan-100 focus:border-cyan-400 transition-all"
                                    rows={3}
                                    placeholder="Describe the event..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-cyan-100 focus:border-cyan-400 transition-all"
                                    placeholder="Community Center"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={formData.eventDate}
                                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-cyan-100 focus:border-cyan-400 transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-100 hover:shadow-cyan-200 transition-all"
                            >
                                Create Event
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
