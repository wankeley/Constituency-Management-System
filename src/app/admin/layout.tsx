"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    BarChart3,
    Calendar,
    AlertCircle,
    Megaphone,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Building2,
    Shield,
    UserCog
} from "lucide-react";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

const getNavItems = (role: string) => {
    const baseItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/polls", label: "Polls", icon: BarChart3 },
        { href: "/admin/events", label: "Events", icon: Calendar },
        { href: "/admin/issues", label: "Issues", icon: AlertCircle },
        { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
    ];

    // Admin-only features
    if (role === "ADMIN") {
        return [
            ...baseItems.slice(0, 1),
            { href: "/admin/users", label: "Users", icon: Users },
            ...baseItems.slice(1),
        ];
    }

    return baseItems;
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("/api/auth/me", {
                    credentials: "include",
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });

                if (!res.ok) {
                    router.push("/login");
                    return;
                }

                const data = await res.json();
                if (data.user.role === "CONSTITUENT") {
                    router.push("/constituent");
                    return;
                }
                setUser(data.user);
            } catch {
                router.push("/login");
            }
        };
        checkAuth();
    }, [router]);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    const navItems = getNavItems(user.role);

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 shadow-sm`}>
                {/* Logo */}
                <div className="p-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-100">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        {sidebarOpen && <span className="text-slate-800 font-bold">CMS Admin</span>}
                    </div>
                </div>

                {/* Role Badge */}
                {sidebarOpen && (
                    <div className="px-4 py-3 border-b border-slate-100">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${user.role === "ADMIN"
                                ? "bg-red-50 text-red-600 border border-red-100"
                                : "bg-blue-50 text-blue-600 border border-blue-100"
                            }`}>
                            {user.role === "ADMIN" ? <Shield className="w-3.5 h-3.5" /> : <UserCog className="w-3.5 h-3.5" />}
                            {user.role}
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-100"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                    }`}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                {sidebarOpen && <span className="font-medium">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Toggle button */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-4 border-t border-slate-200 text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center"
                >
                    {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-semibold text-slate-800">
                                {navItems.find((item) => item.href === pathname)?.label || "Dashboard"}
                            </h1>
                            <p className="text-sm text-slate-500">
                                {user.role === "ADMIN" ? "Full administrative access" : "Staff member access"}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-slate-800">{user.name}</p>
                                <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
