"use client";

import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
} from "recharts";
import { Users, Vote, Calendar, Megaphone, AlertCircle, TrendingUp } from "lucide-react";

interface DashboardData {
    counts: {
        users: number;
        polls: number;
        events: number;
        announcements: number;
    };
    issuesByStatus: Array<{ status: string; _count: number }>;
    recentActivity: Array<{
        id: number;
        title: string;
        status: string;
        createdAt: string;
        reporter: { name: string };
    }>;
}

interface UserStats {
    total: number;
    byRole: Array<{ role: string; _count: number }>;
    byLocation: Array<{ location: string; _count: number }>;
    ageGroups: Record<string, number>;
}

const COLORS = ["#4f46e5", "#7c3aed", "#c026d3", "#db2777", "#f97316"];

export default function AdminDashboard() {
    const [dashboard, setDashboard] = useState<DashboardData | null>(null);
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

                const [dashRes, statsRes] = await Promise.all([
                    fetch("/api/analytics/dashboard", { credentials: "include", headers }),
                    fetch("/api/users/stats", { credentials: "include", headers }),
                ]);

                if (dashRes.ok) setDashboard(await dashRes.json());
                if (statsRes.ok) setUserStats(await statsRes.json());
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    const statCards = [
        { label: "Total Users", value: dashboard?.counts.users || 0, icon: Users, color: "from-indigo-500 to-indigo-600", shadow: "shadow-indigo-100" },
        { label: "Active Polls", value: dashboard?.counts.polls || 0, icon: Vote, color: "from-purple-500 to-purple-600", shadow: "shadow-purple-100" },
        { label: "Upcoming Events", value: dashboard?.counts.events || 0, icon: Calendar, color: "from-cyan-500 to-cyan-600", shadow: "shadow-cyan-100" },
        { label: "Announcements", value: dashboard?.counts.announcements || 0, icon: Megaphone, color: "from-orange-500 to-orange-600", shadow: "shadow-orange-100" },
    ];

    const issueData = dashboard?.issuesByStatus.map((item) => ({
        name: item.status.replace("_", " "),
        value: item._count,
    })) || [];

    const ageData = userStats
        ? Object.entries(userStats.ageGroups).map(([name, value]) => ({ name, value }))
        : [];

    const locationData = userStats?.byLocation.map((item) => ({
        name: item.location || "Unknown",
        count: item._count,
    })) || [];

    return (
        <div className="space-y-6 animate-fade-up">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {statCards.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={i}
                            className={`relative overflow-hidden rounded-2xl bg-white border border-slate-100 p-6 shadow-lg ${stat.shadow} card-hover`}
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2`}></div>
                            <div className="relative">
                                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg mb-4`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</p>
                                <p className="text-sm text-slate-500">{stat.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Issue Status Chart */}
                <div className="bg-white border border-slate-100 rounded-2xl p-4 md:p-6 shadow-lg shadow-slate-100">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="w-5 h-5 text-slate-400" />
                        <h3 className="text-lg font-semibold text-slate-800">Issues by Status</h3>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={issueData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, value }) => `${name}: ${value}`}
                                >
                                    {issueData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Age Distribution */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-lg shadow-slate-100">
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-slate-400" />
                        <h3 className="text-lg font-semibold text-slate-800">Age Distribution</h3>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ageData}>
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                                />
                                <Bar dataKey="value" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                                <defs>
                                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#4f46e5" />
                                        <stop offset="100%" stopColor="#7c3aed" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Location Distribution */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-lg shadow-slate-100">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-slate-400" />
                    <h3 className="text-lg font-semibold text-slate-800">Users by Location</h3>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={locationData}>
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                            />
                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke="#4f46e5"
                                fill="url(#areaGradient)"
                                strokeWidth={2}
                            />
                            <defs>
                                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-lg shadow-slate-100">
                <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-slate-400" />
                    <h3 className="text-lg font-semibold text-slate-800">Recent Issues</h3>
                </div>
                <div className="space-y-3">
                    {dashboard?.recentActivity.map((issue) => (
                        <div
                            key={issue.id}
                            className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100"
                        >
                            <div>
                                <p className="text-slate-800 font-medium">{issue.title}</p>
                                <p className="text-sm text-slate-500">Reported by {issue.reporter.name}</p>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${issue.status === "OPEN"
                                        ? "bg-red-100 text-red-600"
                                        : issue.status === "IN_PROGRESS"
                                            ? "bg-yellow-100 text-yellow-600"
                                            : "bg-green-100 text-green-600"
                                    }`}
                            >
                                {issue.status.replace("_", " ")}
                            </span>
                        </div>
                    ))}
                    {(!dashboard?.recentActivity || dashboard.recentActivity.length === 0) && (
                        <p className="text-slate-400 text-center py-4">No recent issues</p>
                    )}
                </div>
            </div>
        </div>
    );
}
