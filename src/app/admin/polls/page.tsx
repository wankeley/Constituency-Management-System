"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Plus, Vote, Users, Clock, X, CheckCircle } from "lucide-react";

interface Poll {
    id: number;
    title: string;
    description: string | null;
    options: string;
    isActive: boolean;
    createdAt: string;
    endDate: string | null;
    creator: { name: string };
    _count: { responses: number };
}

interface PollResult {
    option: string;
    votes: number;
}

const COLORS = ["#4f46e5", "#7c3aed", "#c026d3", "#db2777", "#f97316", "#10b981"];

export default function PollsPage() {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedPoll, setSelectedPoll] = useState<number | null>(null);
    const [results, setResults] = useState<PollResult[]>([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        options: ["", ""],
        endDate: "",
    });

    useEffect(() => {
        fetchPolls();
    }, []);

    const fetchPolls = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/polls", {
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) setPolls(await res.json());
        setLoading(false);
    };

    const fetchResults = async (pollId: number) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/polls/${pollId}/results`, {
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
            const data = await res.json();
            setResults(data.results);
            setSelectedPoll(pollId);
        }
    };

    const createPoll = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const res = await fetch("/api/polls", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: "include",
            body: JSON.stringify({
                ...formData,
                options: formData.options.filter((o) => o.trim()),
            }),
        });
        if (res.ok) {
            setShowModal(false);
            setFormData({ title: "", description: "", options: ["", ""], endDate: "" });
            fetchPolls();
        }
    };

    const addOption = () => setFormData({ ...formData, options: [...formData.options, ""] });

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
                    <h2 className="text-2xl font-bold text-slate-800">Polls & Surveys</h2>
                    <p className="text-slate-500">Create and manage community polls</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 hover:scale-105 transition-all whitespace-nowrap"
                >
                    <Plus className="w-5 h-5" />
                    Create Poll
                </button>
            </div>

            {/* Polls Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {polls.map((poll) => (
                    <div
                        key={poll.id}
                        className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all card-hover"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span
                                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${poll.isActive
                                                ? "bg-green-50 text-green-600 border border-green-200"
                                                : "bg-slate-100 text-slate-500"
                                            }`}
                                    >
                                        {poll.isActive ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                        {poll.isActive ? "Active" : "Closed"}
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800 mb-1">{poll.title}</h3>
                                <p className="text-sm text-slate-500 line-clamp-2">{poll.description}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-4 pt-4 border-t border-slate-100">
                            <span className="flex items-center gap-1.5">
                                <Vote className="w-4 h-4" />
                                {poll._count.responses} votes
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Users className="w-4 h-4" />
                                {poll.creator.name}
                            </span>
                        </div>

                        <button
                            onClick={() => fetchResults(poll.id)}
                            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
                        >
                            View Results
                        </button>
                    </div>
                ))}
            </div>

            {polls.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                    <Vote className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No polls yet. Create your first poll!</p>
                </div>
            )}

            {/* Results Modal */}
            {selectedPoll && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-800">Poll Results</h3>
                            <button onClick={() => setSelectedPoll(null)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="h-64 mb-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={results}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        dataKey="votes"
                                        nameKey="option"
                                        label={({ option, votes }) => `${option}: ${votes}`}
                                    >
                                        {results.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="space-y-2">
                            {results.map((r, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-slate-700">{r.option}</span>
                                    <span className="text-indigo-600 font-semibold">{r.votes} votes</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-800">Create New Poll</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={createPoll} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                                    placeholder="What is your poll about?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                                    rows={2}
                                    placeholder="Add more context..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Options</label>
                                {formData.options.map((opt, i) => (
                                    <input
                                        key={i}
                                        type="text"
                                        value={opt}
                                        onChange={(e) => {
                                            const newOptions = [...formData.options];
                                            newOptions[i] = e.target.value;
                                            setFormData({ ...formData, options: newOptions });
                                        }}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 mb-2 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                                        placeholder={`Option ${i + 1}`}
                                    />
                                ))}
                                <button
                                    type="button"
                                    onClick={addOption}
                                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                                >
                                    + Add option
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">End Date (optional)</label>
                                <input
                                    type="datetime-local"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all"
                            >
                                Create Poll
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
