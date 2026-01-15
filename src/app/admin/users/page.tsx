"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Shield, UserCog, Users as UsersIcon, Mail, Phone, MapPin } from "lucide-react";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    voterId: string | null;
    age: number | null;
    location: string | null;
    phone: string | null;
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/users", {
                credentials: "include",
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (res.ok) setUsers(await res.json());
        } finally {
            setLoading(false);
        }
    };

    const updateRole = async (userId: number, newRole: string) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/users/${userId}/role`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: "include",
            body: JSON.stringify({ role: newRole }),
        });
        if (res.ok) {
            setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(filter.toLowerCase()) ||
            user.email.toLowerCase().includes(filter.toLowerCase());
        const matchesRole = !roleFilter || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const roleColors: Record<string, { bg: string; text: string; border: string; icon: typeof Shield }> = {
        ADMIN: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", icon: Shield },
        STAFF: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", icon: UserCog },
        CONSTITUENT: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200", icon: UsersIcon },
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
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
                    <p className="text-slate-500">Manage platform users and their roles</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full sm:w-64 pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="w-full sm:w-auto pl-11 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all appearance-none"
                        >
                            <option value="">All Roles</option>
                            <option value="ADMIN">Admin</option>
                            <option value="STAFF">Staff</option>
                            <option value="CONSTITUENT">Constituent</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {["ADMIN", "STAFF", "CONSTITUENT"].map((role) => {
                    const count = users.filter(u => u.role === role).length;
                    const roleInfo = roleColors[role];
                    const Icon = roleInfo.icon;
                    return (
                        <div key={role} className={`p-4 rounded-xl ${roleInfo.bg} border ${roleInfo.border}`}>
                            <div className="flex items-center gap-3">
                                <Icon className={`w-5 h-5 ${roleInfo.text}`} />
                                <div>
                                    <p className={`text-2xl font-bold ${roleInfo.text}`}>{count}</p>
                                    <p className="text-sm text-slate-600">{role.charAt(0) + role.slice(1).toLowerCase()}s</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Users Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredUsers.map((user) => {
                    const roleInfo = roleColors[user.role];
                    const Icon = roleInfo.icon;
                    return (
                        <div
                            key={user.id}
                            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800">{user.name}</h3>
                                        <p className="text-xs text-slate-400">{user.voterId || "No Voter ID"}</p>
                                    </div>
                                </div>
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${roleInfo.bg} ${roleInfo.text} border ${roleInfo.border}`}>
                                    <Icon className="w-3 h-3" />
                                    {user.role}
                                </span>
                            </div>

                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    <span className="truncate">{user.email}</span>
                                </div>
                                {user.phone && (
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Phone className="w-4 h-4 text-slate-400" />
                                        {user.phone}
                                    </div>
                                )}
                                {user.location && (
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        {user.location}
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <label className="block text-xs font-medium text-slate-500 mb-1.5">Change Role</label>
                                <select
                                    value={user.role}
                                    onChange={(e) => updateRole(user.id, e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-indigo-100 transition-all"
                                >
                                    <option value="ADMIN">Admin (Full Access)</option>
                                    <option value="STAFF">Staff (Limited)</option>
                                    <option value="CONSTITUENT">Constituent</option>
                                </select>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                    <UsersIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No users found</p>
                </div>
            )}
        </div>
    );
}
