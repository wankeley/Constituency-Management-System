"use client";

import { useEffect, useState } from "react";
import { Plus, Megaphone, Trash2, X, Calendar, User } from "lucide-react";

interface Announcement {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    creator: { name: string };
}

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ title: "", content: "" });
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        fetchAnnouncements();
        // Get user role from localStorage
        const user = localStorage.getItem("user");
        if (user) {
            setUserRole(JSON.parse(user).role);
        }
    }, []);

    const fetchAnnouncements = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/announcements", {
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) setAnnouncements(await res.json());
        setLoading(false);
    };

    const createAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const res = await fetch("/api/announcements", {
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
            setFormData({ title: "", content: "" });
            fetchAnnouncements();
        }
    };

    const deleteAnnouncement = async (id: number) => {
        if (!confirm("Are you sure you want to delete this announcement?")) return;
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/announcements/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) fetchAnnouncements();
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
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
        <div className="space-y-6 animate-fade-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Announcements</h2>
                    <p className="text-slate-500">Broadcast updates to constituents</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl shadow-lg shadow-orange-100 hover:shadow-orange-200 hover:scale-105 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    New Announcement
                </button>
            </div>

            {/* Announcements List */}
            <div className="space-y-4">
                {announcements.map((announcement, index) => (
                    <div
                        key={announcement.id}
                        className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all card-hover"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex gap-4 flex-1">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-100">
                                    <Megaphone className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-2">{announcement.title}</h3>
                                    <p className="text-slate-600 whitespace-pre-wrap mb-4">{announcement.content}</p>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4" />
                                            {formatDate(announcement.createdAt)}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <User className="w-4 h-4" />
                                            {announcement.creator.name}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {userRole === "ADMIN" && (
                                <button
                                    onClick={() => deleteAnnouncement(announcement.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                    title="Delete"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {announcements.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                    <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 mb-4">No announcements yet.</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="text-orange-600 hover:text-orange-700 font-medium"
                    >
                        Create your first announcement →
                    </button>
                </div>
            )}

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-800">New Announcement</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={createAnnouncement} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all"
                                    placeholder="Announcement title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
                                <textarea
                                    required
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all"
                                    rows={6}
                                    placeholder="Write your announcement..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl shadow-lg shadow-orange-100 hover:shadow-orange-200 transition-all"
                            >
                                Publish Announcement
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
