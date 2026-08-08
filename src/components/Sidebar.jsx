import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getProfile } from "../api";
import { Logo } from "./ui";

const Icon = ({ d }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0"
  >
    {d}
  </svg>
);

const icons = {
  overview: <Icon d={<> <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>} />,
  profile: <Icon d={<> <circle cx="12" cy="8" r="4" /><path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" /></>} />,
  weather: <Icon d={<> <path d="M17.5 18a4.5 4.5 0 1 0-1.1-8.86A6 6 0 1 0 6 16.7" /><path d="M8 14h8" /></>} />,
  courses: <Icon d={<> <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>} />,
  pricing: <Icon d={<> <rect x="2" y="5" width="20" height="14" rx="3" /><path d="M2 10h20" /></>} />,
  services: <Icon d={<> <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></>} />,
  projects: <Icon d={<> <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></>} />,
  lock: <Icon d={<> <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>} />,
  logout: <Icon d={<> <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></>} />,
  close: <Icon d={<> <path d="M18 6L6 18M6 6l12 12" /></>} />,
};

const navItems = [
  { path: "/dashboard", label: "Overview", icon: icons.overview },
  { path: "/profile", label: "Profile", icon: icons.profile },
  { path: "/weather", label: "Weather", icon: icons.weather },
  { path: "/courses", label: "Courses", icon: icons.courses, pro: true },
  { path: "/pricing", label: "Pricing", icon: icons.pricing },
  { path: "/services", label: "Services", icon: icons.services },
  { path: "/projects", label: "Projects", icon: icons.projects },
];

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const token = localStorage.getItem("token");
  const [photo, setPhoto] = useState(() => localStorage.getItem("profile_photo"));

  useEffect(() => {
    if (!token) return;

    getProfile()
      .then((res) => {
        setUser(res.data);
        setHasPurchased(Boolean(res.data?.is_pro || res.data?.isPro || res.data?.has_purchased || res.data?.hasPurchased));
      })
      .catch((err) => console.error("Profile load karne mein error aaya:", err));

    const handleStorage = () => {
      setPhoto(localStorage.getItem("profile_photo"));
    };
    window.addEventListener("profile_photo_updated", handleStorage);
    return () => window.removeEventListener("profile_photo_updated", handleStorage);
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile_photo");
    navigate("/");
  };

  const go = (path) => {
    onClose?.();
    navigate(path);
  };

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-[60] flex w-[264px] -translate-x-full flex-col overflow-y-auto border-r border-line bg-surface p-3.5 transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : ""}`}
      >
        <div className="flex items-center justify-between px-1.5 pb-5">
          <Logo />
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-surface text-text-2 hover:bg-surface-2 lg:hidden"
            aria-label="Close menu"
          >
            {icons.close}
          </button>
        </div>

        <div className="mb-6 flex items-center gap-3 rounded-md border border-line bg-surface-2/60 p-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-black shadow-sm">
            {photo ? (
              <img src={photo} alt="avatar" className="h-10 w-10 rounded-full object-cover" />
            ) : (
              (user?.name ? user.name.charAt(0).toUpperCase() : "U")
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="m-0 truncate text-[13.5px] font-bold text-text">{user?.name || "User"}</p>
            <p className="m-0 mt-0.5 truncate text-[11px] text-text-3">{user?.email || ""}</p>
          </div>
          {!hasPurchased && (
            <span className="flex-shrink-0 rounded-full bg-surface-3/60 px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-text-2">
              FREE
            </span>
          )}
        </div>

        <p className="m-0 px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-text-3">Menu</p>

        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const isLocked = item.pro && !hasPurchased;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={(e) => {
                  if (isLocked) {
                    e.preventDefault();
                    go("/pricing");
                    return;
                  }
                  onClose?.();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors duration-150 hover:text-text ${
                    isActive && !isLocked
                      ? "bg-primary-soft font-semibold text-primary"
                      : "text-text-2"
                  } ${isLocked ? "opacity-50" : ""}`
                }
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {isLocked && (
                  <span className="flex items-center gap-1.5 text-text-3">
                    {icons.lock}
                    <span className="rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider text-black">
                      PRO
                    </span>
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="pt-2">
          <div className="mb-3 h-px bg-line" />
          <button
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-3 rounded-sm border border-danger/20 bg-danger/5 px-3 py-2.5 text-sm font-semibold text-danger transition-colors duration-150 hover:bg-danger/10"
          >
            {icons.logout}
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <div
        className={`fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
    </>
  );
};

export default Sidebar;
