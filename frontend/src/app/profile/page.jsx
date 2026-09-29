"use client";

import { useEffect, useState, useRef } from "react";
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaVenusMars,
    FaBirthdayCake,
    FaPen,
    FaSave,
    FaTimes,
} from "react-icons/fa";
import {
    getProfile,
    uploadProfileImage,
    updateProfile,
} from "../../services/profileApi";
import AppShell from "../../components/AppShell.jsx";

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        phone: "",
        gender: "",
        date_of_birth: "",
        bio: "",
    });
    const fileInputRef = useRef(null);

    const getToken = () => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem("token");
    };

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");
            const token = getToken();
            if (!token) {
                setError("Please login first.");
                return;
            }
            const data = await getProfile(token);
            console.log("PROFILE DATA:", data.profile);
            setProfile(data.profile);
            setFormData({
                phone: data.profile?.phone || "",
                gender: data.profile?.gender || "",
                date_of_birth: data.profile?.date_of_birth
                    ? new Date(data.profile.date_of_birth).toISOString().split("T")[0]
                    : "",
                bio: data.profile?.bio || "",
            });
        } catch (error) {
            console.error("Failed to load profile:", error);
            if (error.response?.status === 404) {
                setError("Profile not created yet.");
            } else if (error.response?.status === 401) {
                setError("Session expired. Please login again.");
            } else {
                setError("Failed to load profile.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleImageSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            alert("Only JPG, JPEG, PNG and WEBP images are allowed.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("Image size must be less than 5 MB.");
            return;
        }
        try {
            setUploadingImage(true);
            const token = getToken();
            if (!token) {
                alert("Please login again.");
                return;
            }
            await uploadProfileImage(token, file);
            await loadProfile();
            alert("Profile image uploaded successfully!");
        } catch (error) {
            console.error("Profile image upload error:", error);
            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert("Failed to upload profile image.");
            }
        } finally {
            setUploadingImage(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleEditClick = () => {
        if (!profile) return;
        setFormData({
            phone: profile.phone || "",
            gender: profile.gender || "",
            date_of_birth: profile.date_of_birth
                ? new Date(profile.date_of_birth).toISOString().split("T")[0]
                : "",
            bio: profile.bio || "",
        });
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const phone = formData.phone.trim();
        const gender = formData.gender;
        const dateOfBirth = formData.date_of_birth;
        const bio = formData.bio.trim();
        if (!phone) return "Phone number is required.";
        if (!/^[0-9]{10}$/.test(phone)) return "Phone number must contain exactly 10 digits.";
        if (!gender) return "Please select your gender.";
        if (!dateOfBirth) return "Date of birth is required.";
        const selectedDate = new Date(dateOfBirth);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate > today) return "Date of birth cannot be a future date.";
        if (!bio) return "Bio is required.";
        if (bio.length < 3) return "Bio must contain at least 3 characters.";
        if (bio.length > 500) return "Bio cannot exceed 500 characters.";
        return null;
    };

    const handleSave = async () => {
        const validationError = validateForm();
        if (validationError) {
            alert(validationError);
            return;
        }
        try {
            const token = getToken();
            if (!token) {
                alert("Please login again.");
                return;
            }
            setSaving(true);
            const cleanedData = {
                phone: formData.phone.trim(),
                gender: formData.gender,
                date_of_birth: formData.date_of_birth,
                bio: formData.bio.trim(),
            };
            await updateProfile(token, cleanedData);
            await loadProfile();
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Failed to update profile:", error);
            console.error("Backend response:", error.response?.data);
            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert("Failed to update profile.");
            }
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (profile) {
            setFormData({
                phone: profile.phone || "",
                gender: profile.gender || "",
                date_of_birth: profile.date_of_birth
                    ? new Date(profile.date_of_birth).toISOString().split("T")[0]
                    : "",
                bio: profile.bio || "",
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen grid place-items-center" style={{ background: "var(--bh-bg)" }}>
                <div className="text-center">
                    <div className="w-10 h-10 border-4 rounded-full animate-spin mx-auto" style={{ borderColor: "var(--bh-line)", borderTopColor: "var(--bh-accent)" }} />
                    <p className="mt-4 text-sm font-medium" style={{ color: "var(--bh-muted)" }}>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <AppShell title="Profile">
                <div className="bh-card p-8 text-center max-w-md mx-auto">
                    <div className="w-16 h-16 mx-auto rounded-full grid place-items-center" style={{ background: "color-mix(in srgb, var(--bh-accent) 14%, #fff)", color: "var(--bh-accent)" }}>
                        <FaUser className="text-2xl" />
                    </div>
                    <h2 className="mt-5 text-xl font-bold">Profile</h2>
                    <p className="mt-2 text-sm" style={{ color: "var(--bh-muted)" }}>{error}</p>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell title="My Profile">
            <p className="text-sm mb-5" style={{ color: "var(--bh-muted)" }}>Manage your personal information</p>
            <div className="bh-card overflow-hidden max-w-3xl">
                <div className="px-6 py-8" style={{ background: "var(--bh-ink)", color: "#fff" }}>
                    <div className="flex flex-col sm:flex-row items-center gap-5">
                        <div className="relative">
                            <div className="w-28 h-28 rounded-full border-4 overflow-hidden grid place-items-center" style={{ borderColor: "var(--bh-gold)", background: "#2a3140" }}>
                                {profile?.profile_image ? (
                                    <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${profile.profile_image}`} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <FaUser className="text-4xl" />
                                )}
                            </div>
                            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage} className="absolute bottom-0 right-0 w-9 h-9 rounded-full grid place-items-center" style={{ background: "#fff", color: "var(--bh-accent)" }} title="Change profile picture">
                                {uploadingImage ? <div className="w-4 h-4 border-2 rounded-full animate-spin" /> : <span className="text-sm">📷</span>}
                            </button>
                            <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleImageSelect} className="hidden" />
                        </div>
                        <div className="text-center sm:text-left">
                            <h2 className="text-2xl font-bold">{profile?.full_name || "User"}</h2>
                            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 opacity-80">
                                <FaEnvelope className="text-xs" />
                                <span className="text-sm">{profile?.email || "No email"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-bold">Personal Information</h3>
                        {!isEditing ? (
                            <button type="button" onClick={handleEditClick} className="bh-btn-ghost">
                                <FaPen className="text-xs" /> Edit
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button type="button" onClick={handleCancel} disabled={saving} className="bh-btn-ghost">
                                    <FaTimes className="text-xs" /> Cancel
                                </button>
                                <button type="button" onClick={handleSave} disabled={saving} className="bh-btn">
                                    {saving ? <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <FaSave className="text-xs" />}
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        )}
                    </div>

                    {!isEditing ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InfoCard icon={<FaPhone />} label="Phone" value={profile?.phone || "Not added"} />
                                <InfoCard icon={<FaVenusMars />} label="Gender" value={profile?.gender || "Not added"} />
                                <InfoCard icon={<FaBirthdayCake />} label="Date of Birth" value={profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString("en-IN") : "Not added"} />
                                <InfoCard icon={<FaEnvelope />} label="Email" value={profile?.email || "Not added"} />
                            </div>
                            <div className="mt-4 rounded-2xl p-5 border" style={{ borderColor: "var(--bh-line)", background: "var(--bh-bg)" }}>
                                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--bh-muted)" }}>Bio</p>
                                <p className="mt-2 text-sm leading-6">{profile?.bio || "No bio added yet."}</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold mb-2" style={{ color: "var(--bh-muted)" }}>Phone</label>
                                    <div className="relative">
                                        <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--bh-accent)" }} />
                                        <input type="tel" name="phone" value={formData.phone} onChange={(e) => { const value = e.target.value; if (/^\d*$/.test(value) && value.length <= 10) handleChange(e); }} maxLength={10} placeholder="Enter 10 digit phone number" className="bh-input pl-10" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold mb-2" style={{ color: "var(--bh-muted)" }}>Gender</label>
                                    <div className="relative">
                                        <FaVenusMars className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--bh-accent)" }} />
                                        <select name="gender" value={formData.gender} onChange={handleChange} className="bh-input pl-10 appearance-none">
                                            <option value="">Select gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold mb-2" style={{ color: "var(--bh-muted)" }}>Date of Birth</label>
                                    <div className="relative">
                                        <FaBirthdayCake className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--bh-accent)" }} />
                                        <input type="date" name="date_of_birth" value={formData.date_of_birth} max={new Date().toISOString().split("T")[0]} onChange={handleChange} className="bh-input pl-10" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold mb-2" style={{ color: "var(--bh-muted)" }}>Email</label>
                                    <div className="relative">
                                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--bh-accent)" }} />
                                        <input type="email" value={profile?.email || ""} disabled className="bh-input pl-10 opacity-70" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-xs font-semibold mb-2" style={{ color: "var(--bh-muted)" }}>Bio</label>
                                <textarea name="bio" value={formData.bio} onChange={handleChange} maxLength={500} placeholder="Write something about yourself..." rows={4} className="bh-input h-auto py-3 resize-none" />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AppShell>
    );
}

function InfoCard({ icon, label, value }) {
    return (
        <div className="rounded-2xl border p-4" style={{ borderColor: "var(--bh-line)", background: "var(--bh-bg)" }}>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl grid place-items-center" style={{ background: "color-mix(in srgb, var(--bh-accent) 14%, #fff)", color: "var(--bh-accent)" }}>{icon}</div>
                <div className="min-w-0">
                    <p className="text-xs font-semibold" style={{ color: "var(--bh-muted)" }}>{label}</p>
                    <p className="text-sm font-medium mt-1 truncate">{value}</p>
                </div>
            </div>
        </div>
    );
}
