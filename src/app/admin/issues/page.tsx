"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Clock, CheckCircle, Users, Filter } from "lucide-react";

interface Issue {
    id: number;
    title: string;
    description: string;
    status: string;
    createdAt: string;
    reporter: { name: string };
    assignee: { name: string } | null;
}

interface Staff {
    id: number;
    name: string;
}

export default function IssuesPage() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

        const [issuesRes, usersRes] = await Promise.all([
            fetch("/api/issues", { credentials: "include", headers }),
            fetch("/api/users", { credentials: "include", headers }),
        ]);

        if (issuesRes.ok) setIssues(await issuesRes.json());
        if (usersRes.ok) {
            const users = await usersRes.json();
            setStaffList(users.filter((u: { role: string }) => u.role !== "CONSTITUENT"));
        }
        setLoading(false);
    };

    const updateIssue = async (issueId: number, data: { status?: string; assignedTo?: number }) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/issues/${issueId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: "include",
            body: JSON.stringify(data),
        });
        if (res.ok) fetchData();
    };

    const filteredIssues = issues.filter((issue) => {
        if (!filter) return true;
        return issue.status === filter;
    });

    const statusConfig: Record<string, { bg: string; text: string; border: string; icon: typeof AlertCircle }> = {
        OPEN: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", icon: AlertCircle },
        IN_PROGRESS: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200", icon: Clock },
        RESOLVED: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200", icon: CheckCircle },
    };

    const stats = {
        total: issues.length,
        open: issues.filter((i) => i.status === "OPEN").length,
        inProgress: issues.filter((i) => i.status === "IN_PROGRESS").length,
        resolved: issues.filter((i) => i.status === "RESOLVED").length,
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
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Issue Management</h2>
                <p className="text-slate-500">Track and resolve community issues</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                {[
                    { label: "Total", value: stats.total, key: "", color: "from-slate-500 to-slate-600", shadow: "shadow-slate-100" },
                    { label: "Open", value: stats.open, key: "OPEN", color: "from-red-500 to-red-600", shadow: "shadow-red-100" },
                    { label: "In Progress", value: stats.inProgress, key: "IN_PROGRESS", color: "from-yellow-500 to-yellow-600", shadow: "shadow-yellow-100" },
                    { label: "Resolved", value: stats.resolved, key: "RESOLVED", color: "from-green-500 to-green-600", shadow: "shadow-green-100" },
                ].map((stat, i) => (
                    <button
                        key={i}
                        onClick={() => setFilter(stat.key)}
                        className={`p-3 sm:p-4 rounded-xl bg-white border text-left transition-all hover:scale-105 ${filter === stat.key
                                ? "ring-2 ring-indigo-500 border-indigo-200"
                                : "border-slate-100 shadow-sm"
                            }`}
                    >
                        <div className={`inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${stat.color} ${stat.shadow} mb-2`}>
                            <span className="text-white font-bold text-sm">{stat.value}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium">{stat.label}</p>
                    </button>
                ))}
            </div>

            {/* Filter indicator */}
            {filter && (
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">Filtering by: <strong>{filter.replace("_", " ")}</strong></span>
                    <button onClick={() => setFilter("")} className="text-indigo-600 text-sm font-medium hover:underline">Clear</button>
                </div>
            )}

            {/* Issues List */}
            <div className="space-y-4">
                {filteredIssues.map((issue) => {
                    const config = statusConfig[issue.status];
                    const Icon = config.icon;
                    return (
                        <div
                            key={issue.id}
                            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <span
                                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}
                                        >
                                            <Icon className="w-3 h-3" />
                                            {issue.status.replace("_", " ")}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            {new Date(issue.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-800 mb-2">{issue.title}</h3>
                                    <p className="text-slate-500 text-sm mb-3">{issue.description}</p>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Users className="w-4 h-4" />
                                        Reported by: {issue.reporter.name}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 lg:min-w-[220px]">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                                        <select
                                            value={issue.status}
                                            onChange={(e) => updateIssue(issue.id, { status: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                                        >
                                            <option value="OPEN">Open</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="RESOLVED">Resolved</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Assign To</label>
                                        <select
                                            value={issue.assignee?.name || ""}
                                            onChange={(e) => {
                                                const staff = staffList.find((s) => s.name === e.target.value);
                                                if (staff) updateIssue(issue.id, { assignedTo: staff.id });
                                            }}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                                        >
                                            <option value="">Unassigned</option>
                                            {staffList.map((staff) => (
                                                <option key={staff.id} value={staff.name}>
                                                    {staff.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredIssues.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                    <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No issues found</p>
                </div>
            )}
        </div>
    );
}
