import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { api } from "../../services/api";
import { toast } from "sonner";
import { User, Mail, Phone, MapPin, Award, Star, Trophy, Gift, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            // In a real app, we'd fetch from /api/users/profile
            // For now, let's use local storage or mock if API is not ready
            // But since we just added the endpoint, let's try to use it
            const userData = JSON.parse(localStorage.getItem("user") || "{}");
            if (userData.token) {
                // We might want to fetch fresh data
                // const profile = await api.get('/users/profile');
                // setUser(profile);
                // setFormData({ ... });

                // Fallback to local data for immediate render if API fails or for demo
                setUser(userData);
                setFormData({
                    name: userData.name || "",
                    email: userData.email || "",
                    phone: userData.phone || "",
                });
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load profile");
            setLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // API call to update profile
            // await api.put('/users/profile', formData);

            // Update local storage for demo
            const updatedUser = { ...user, ...formData };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
            setEditing(false);
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!user) return <div className="min-h-screen flex items-center justify-center">Please login first</div>;

    const isHelper = user.role === "helper";

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <Link to={isHelper ? "/helper-dashboard" : "/"} className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Profile Card */}
                        <div className="md:col-span-1">
                            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                        <User className="w-10 h-10 text-primary" />
                                    </div>
                                    <h2 className="text-xl font-bold">{user.name}</h2>
                                    <p className="text-muted-foreground capitalize">{user.role}</p>

                                    {isHelper && (
                                        <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-yellow-600 rounded-full text-sm font-medium">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span>{user.rating || "5.0"} Rating</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 space-y-4">
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <Mail className="w-4 h-4" />
                                        <span className="text-sm">{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <Phone className="w-4 h-4" />
                                        <span className="text-sm">{user.phone || "No phone added"}</span>
                                    </div>
                                    {isHelper && (
                                        <div className="flex items-center gap-3 text-muted-foreground">
                                            <MapPin className="w-4 h-4" />
                                            <span className="text-sm">Bangalore, India</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="md:col-span-2 space-y-8">
                            {/* Rewards & Gamification Section */}
                            <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        {isHelper ? <Trophy className="w-5 h-5 text-yellow-500" /> : <Award className="w-5 h-5 text-primary" />}
                                        {isHelper ? "Your Achievements" : "Loyalty Rewards"}
                                    </h3>
                                    {isHelper && <span className="text-sm font-medium text-primary">Level: {user.level || "Bronze"}</span>}
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {isHelper ? (
                                        <>
                                            <div className="bg-background/50 p-4 rounded-xl text-center">
                                                <div className="text-2xl font-bold text-primary">{user.points || 0}</div>
                                                <div className="text-xs text-muted-foreground mt-1">Total Points</div>
                                            </div>
                                            <div className="bg-background/50 p-4 rounded-xl text-center">
                                                <div className="text-2xl font-bold text-green-600">{user.completedJobs || 0}</div>
                                                <div className="text-xs text-muted-foreground mt-1">Jobs Done</div>
                                            </div>
                                            <div className="bg-background/50 p-4 rounded-xl text-center border border-yellow-500/20">
                                                <div className="text-2xl font-bold text-yellow-600">Gold</div>
                                                <div className="text-xs text-muted-foreground mt-1">Next Tier</div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {user.badges?.map((badge: string, i: number) => (
                                                <div key={i} className="bg-background/50 p-3 rounded-xl flex flex-col items-center gap-2 text-center">
                                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                                        <Award className="w-4 h-4 text-primary" />
                                                    </div>
                                                    <span className="text-sm font-medium">{badge}</span>
                                                </div>
                                            )) || (
                                                    <div className="bg-background/50 p-3 rounded-xl flex flex-col items-center gap-2 text-center text-muted-foreground">
                                                        <span>Newbie Badge</span>
                                                    </div>
                                                )}
                                        </>
                                    )}
                                </div>

                                {!isHelper && (
                                    <div className="mt-6 pt-6 border-t border-border border-dashed">
                                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                            <Gift className="w-4 h-4 text-pink-500" />
                                            Available Coupons
                                        </h4>
                                        <div className="space-y-2">
                                            {user.coupons?.length > 0 ? user.coupons.map((coupon: any, i: number) => (
                                                <div key={i} className="bg-background p-3 rounded-lg border border-dashed border-primary/30 flex justify-between items-center">
                                                    <div>
                                                        <p className="font-mono font-bold text-primary">{coupon.code}</p>
                                                        <p className="text-xs text-muted-foreground">Expires: {new Date(coupon.validUntil).toLocaleDateString()}</p>
                                                    </div>
                                                    <span className="font-bold text-green-600">{coupon.discount}% OFF</span>
                                                </div>
                                            )) : (
                                                <div className="text-sm text-muted-foreground italic">No active coupons available. Book more services to earn rewards!</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Edit Profile Form */}
                            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold">Personal Details</h3>
                                    <button
                                        onClick={() => setEditing(!editing)}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        {editing ? "Cancel" : "Edit Details"}
                                    </button>
                                </div>

                                <form onSubmit={handleUpdate} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
                                            <input
                                                disabled={!editing}
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-2 bg-secondary rounded-lg border border-border focus:border-primary disabled:opacity-60 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                                            <input
                                                disabled={!editing}
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-4 py-2 bg-secondary rounded-lg border border-border focus:border-primary disabled:opacity-60 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-muted-foreground mb-1">Phone</label>
                                            <input
                                                disabled={!editing}
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-4 py-2 bg-secondary rounded-lg border border-border focus:border-primary disabled:opacity-60 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {editing && (
                                        <motion.button
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            type="submit"
                                            className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                                        >
                                            Save Changes
                                        </motion.button>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
