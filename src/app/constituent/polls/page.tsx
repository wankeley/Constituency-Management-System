"use client";

import { useEffect, useState } from "react";
import { Vote, CheckCircle, Clock, X } from "lucide-react";

interface Poll {
    id: number;
    title: string;
    description: string | null;
    options: string;
    isActive: boolean;
    _count: { responses: number };
}

interface PollDetail {
    id: number;
    title: string;
    description: string | null;
    options: string;
    userVote?: number;
}

export default function ConstituentPolls() {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPoll, setSelectedPoll] = useState<PollDetail | null>(null);
    const [voting, setVoting] = useState(false);

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

    const openPoll = async (pollId: number) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/polls/${pollId}`, {
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) setSelectedPoll(await res.json());
    };

    const vote = async (optionIndex: number) => {
        if (!selectedPoll || voting) return;
        setVoting(true);

        const token = localStorage.getItem("token");
        const res = await fetch(`/api/polls/${selectedPoll.id}/vote`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: "include",
            body: JSON.stringify({ selectedOption: optionIndex }),
        });

        if (res.ok) {
            setSelectedPoll({ ...selectedPoll, userVote: optionIndex });
            fetchPolls();
        }
        setVoting(false);
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
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Community Polls</h1>
                <p className="text-slate-500">Make your voice heard! Vote in active polls.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {polls.map((poll) => {
                    const options = JSON.parse(poll.options);
                    return (
                        <div
                            key={poll.id}
                            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all card-hover"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <span
                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${poll.isActive
                                            ? "bg-green-50 text-green-600 border border-green-200"
                                            : "bg-slate-100 text-slate-500"
                                        }`}
                                >
                                    {poll.isActive ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                    {poll.isActive ? "Active" : "Closed"}
                                </span>
                                <span className="text-xs text-slate-400">
                                    {poll._count.responses} votes
                                </span>
                            </div>

                            <h3 className="text-lg font-semibold text-slate-800 mb-2">{poll.title}</h3>
                            <p className="text-sm text-slate-500 mb-4 line-clamp-2">{poll.description}</p>

                            <div className="text-xs text-slate-400 mb-4">
                                {options.length} options
                            </div>

                            <button
                                onClick={() => openPoll(poll.id)}
                                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 hover:scale-[1.02] transition-all"
                            >
                                {poll.isActive ? "Vote Now" : "View Results"}
                            </button>
                        </div>
                    );
                })}
            </div>

            {polls.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                    <Vote className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No polls available at the moment.</p>
                </div>
            )}

            {/* Voting Modal */}
            {selectedPoll && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-800">{selectedPoll.title}</h3>
                            <button onClick={() => setSelectedPoll(null)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {selectedPoll.description && (
                            <p className="text-slate-500 text-sm mb-6">{selectedPoll.description}</p>
                        )}

                        <div className="space-y-3">
                            {JSON.parse(selectedPoll.options).map((option: string, index: number) => {
                                const isSelected = selectedPoll.userVote === index;
                                const hasVoted = selectedPoll.userVote !== undefined;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => !hasVoted && vote(index)}
                                        disabled={hasVoted || voting}
                                        className={`w-full p-4 rounded-xl text-left transition-all border ${isSelected
                                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-lg"
                                                : hasVoted
                                                    ? "bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200"
                                                    : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200 hover:border-indigo-300"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">{option}</span>
                                            {isSelected && <CheckCircle className="w-5 h-5" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {selectedPoll.userVote !== undefined && (
                            <p className="text-center text-green-600 text-sm mt-4 font-medium flex items-center justify-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                You have voted in this poll
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
