import { useEffect, useState, useRef } from "react";
import { getProfile, updateProfile } from "../api";
import { PageHeader, Card, Input, Field, Button, ErrorBox, SuccessBox, Skeleton } from "../components/ui";

const Profile = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", website: "", profession: "" });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [photo, setPhoto] = useState(() => {
    const token = localStorage.getItem("token");
    const savedPhoto = localStorage.getItem("profile_photo");
    const savedToken = localStorage.getItem("photo_token");
    if (savedPhoto && savedToken === token) return savedPhoto;
    localStorage.removeItem("profile_photo");
    return null;
  });
  const [editMode, setEditMode] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    getProfile()
      .then((res) => {
        setProfile(res.data);
        setForm({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          website: res.data.website || "",
          profession: res.data.profession || "",
        });
      })
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  const isPro = !!(profile?.is_pro || profile?.has_purchased);
  const planLabel = (profile?.plan || (isPro ? "Pro" : "Free")).toUpperCase();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess("");
    setError("");
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhoto(ev.target.result);
      localStorage.setItem("profile_photo", ev.target.result);
      localStorage.setItem("photo_token", localStorage.getItem("token"));
      window.dispatchEvent(new CustomEvent("profile_photo_updated"));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setError("Name and email are required.");
      return;
    }
    try {
      setSaving(true);
      await updateProfile(form);
      setSuccess("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="My Profile" sub="Manage your account information" />

      <Card className="max-w-[760px] p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center gap-5">
          <div className="relative h-24 w-24 shrink-0 cursor-pointer" onClick={() => fileRef.current.click()}>
            {photo ? (
              <img src={photo} alt="Profile" className="h-24 w-24 rounded-full object-cover" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-[38px] font-extrabold text-black shadow-sm">
                {form.name ? form.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <div className="absolute bottom-0.5 right-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-canvas bg-surface-2 text-text-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="m-0 font-display text-[22px] font-extrabold text-text">{form.name || "User"}</h2>
            <p className="mt-1 mb-2.5 text-sm text-text-2">{form.email || ""}</p>
            <span className="inline-block rounded-full border border-line bg-surface-3/60 px-3.5 py-1 text-[11px] font-bold text-text-2">
              {planLabel} PLAN
            </span>
          </div>

          {!editMode && (
            <Button variant="outline" className="sm:ml-auto" onClick={() => setEditMode(true)}>Edit Profile</Button>
          )}
        </div>

        <div className="mb-6 h-px bg-line" />

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton width={80} height={11} />
                <Skeleton height={44} />
              </div>
            ))}
          </div>
        ) : editMode ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && <ErrorBox>{error}</ErrorBox>}
            {success && <SuccessBox>{success}</SuccessBox>}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name">
                <Input name="name" value={form.name} onChange={handleChange} required />
              </Field>
              <Field label="Email">
                <Input name="email" type="email" value={form.email} onChange={handleChange} required />
              </Field>
              <Field label="Phone">
                <Input name="phone" value={form.phone} onChange={handleChange} placeholder="—" />
              </Field>
              <Field label="Website">
                <Input name="website" value={form.website} onChange={handleChange} placeholder="—" />
              </Field>
              <Field label="Profession">
                <Input name="profession" value={form.profession} onChange={handleChange} placeholder="—" />
              </Field>
            </div>

            <div className="flex gap-2.5">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="ghost" type="button" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="m-0 mb-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-text-3">Full Name</p>
              <p className="m-0 text-[15px] font-medium text-text">{form.name || "—"}</p>
            </div>
            <div>
              <p className="m-0 mb-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-text-3">Email</p>
              <p className="m-0 text-[15px] font-medium text-text">{form.email || "—"}</p>
            </div>
            <div>
              <p className="m-0 mb-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-text-3">Phone</p>
              <p className="m-0 text-[15px] font-medium text-text">{form.phone || "—"}</p>
            </div>
            <div>
              <p className="m-0 mb-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-text-3">Website</p>
              <p className="m-0 text-[15px] font-medium text-text">{form.website || "—"}</p>
            </div>
            <div>
              <p className="m-0 mb-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-text-3">Profession</p>
              <p className="m-0 text-[15px] font-medium text-text">{form.profession || "—"}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Profile;
