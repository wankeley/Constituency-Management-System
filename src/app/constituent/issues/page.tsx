"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Clock, CheckCircle, Plus, X, Send } from "lucide-react";

interface Issue {
    id: number;
    title: string;
    description: string;
    status: string;
    createdAt: string;
}

export default function ConstituentIssues() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({ title: "", description: "" });
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchIssues();
    }, []);

    const fetchIssues = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/issues", {
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) setIssues(await res.json());
        setLoading(false);
    };

    const submitIssue = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const token = localStorage.getItem("token");
        const res = await fetch("/api/issues", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: "include",
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            setFormData({ title: "", description: "" });
            setShowForm(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            fetchIssues();
        }
        setSubmitting(false);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const statusConfig: Record<string, { bg: string; text: string; border: string; icon: typeof AlertCircle }> = {
        OPEN: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", icon: AlertCircle },
        IN_PROGRESS: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200", icon: Clock },
        RESOLVED: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200", icon: CheckCircle },
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-up">
            {/* Success Toast */}
            {success && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-slide-in">
                    <CheckCircle className="w-5 h-5" />
                    Issue reported successfully!
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Report an Issue</h1>
                    <p className="text-slate-500">Help improve your community by reporting issues.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl shadow-lg shadow-orange-100 hover:shadow-orange-200 hover:scale-105 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Report Issue
                </button>
            </div>

            {/* Report Form */}
            {showForm && (
                <div className="bg-white border border-slate-100 rounded-2xl p-6 mb-6 shadow-sm animate-fade-up">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-800">New Issue Report</h2>
                        <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <form onSubmit={submitIssue} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Issue Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all"
                                placeholder="Brief description of the issue"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Details</label>
                            <textarea
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all"
                                rows={4}
                                placeholder="Provide more details about the issue, including location if applicable..."
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl shadow-lg shadow-orange-100 hover:shadow-orange-200 transition-all disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                                {submitting ? "Submitting..." : "Submit Report"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* My Issues */}
            <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-4">My Reported Issues</h2>
                <div className="space-y-4">
                    {issues.map((issue) => {
                        const config = statusConfig[issue.status];
                        const Icon = config.icon;
                        return (
                            <div
                                key={issue.id}
                                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span
                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}
                                            >
                                                <Icon className="w-3 h-3" />
                                                {issue.status.replace("_", " ")}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {formatDate(issue.createdAt)}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-800 mb-2">{issue.title}</h3>
                                        <p className="text-slate-500 text-sm">{issue.description}</p>
                                    </div>

                                    <div className="flex-shrink-0">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bg} border ${config.border}`}>
                                            <Icon className={`w-5 h-5 ${config.text}`} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {issues.length === 0 && !showForm && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 mb-4">You haven&apos;t reported any issues yet.</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="text-orange-600 hover:text-orange-700 font-medium"
                        >
                            Report your first issue →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
