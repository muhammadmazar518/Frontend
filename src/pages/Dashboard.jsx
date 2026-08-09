import { useEffect, useState } from "react";
import { getDashboardStats, getProfile } from "../api";
import { useNavigate } from "react-router-dom";
import {
  PageHeader,
  Card,
  Button,
  ProgressRing,
  Skeleton,
} from "../components/ui";

const StatCard = ({ label, value, icon, badge, loading }) => (
  <Card className="relative overflow-hidden p-5">
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-3">
            {badge}
          </span>
        </div>

        <p className="m-0 text-[13px] font-semibold text-text-2">
          {label}
        </p>

        <div className="mt-2">
          {loading ? (
            <Skeleton className="h-7 w-20" />
          ) : (
            <p className="m-0 font-display text-2xl font-extrabold text-text">
              {value}
            </p>
          )}
        </div>
      </div>

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-line bg-surface-2 text-xl">
        {icon}
      </div>
    </div>
  </Card>
);

const STEPS = [
  {
    key: "profile",
    label: "Complete your profile",
    to: "/profile",
    icon: "👤",
  },
  {
    key: "weather",
    label: "Check the weather",
    to: "/weather",
    icon: "🌤",
  },
  {
    key: "courses",
    label: "Explore the course library",
    to: "/courses",
    icon: "📚",
  },
  {
    key: "plan",
    label: "Pick your plan",
    to: "/pricing",
    icon: "💳",
  },
];

const STEPS_KEY = "saaspanel_onboarding";

const formatMemberSince = (date) => {
  if (!date) return "—";

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) return "—";

  return d.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);

  const [done, setDone] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STEPS_KEY)) || {};
    } catch {
      return {};
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch(() => {});

    getProfile()
      .then((res) => setProfile(res.data))
      .catch(() => {});
  }, []);

  const toggleStep = (key) => {
    const next = { ...done, [key]: !done[key] };

    setDone(next);
    localStorage.setItem(STEPS_KEY, JSON.stringify(next));
  };

  const doneCount = STEPS.filter((s) => done[s.key]).length;
  const pct = Math.round((doneCount / STEPS.length) * 100);

  const name = profile?.name || profile?.full_name || "";
  const firstName = name.split(" ")[0] || "there";

  const isPro = !!(profile?.is_pro || profile?.has_purchased);
  const planName = profile?.plan || (isPro ? "Pro" : "Free");

  const memberSince = formatMemberSince(profile?.created_at);

  const accessibleCourses =
    stats?.accessibleCourses ??
    stats?.totalCourses ??
    stats?.courses ??
    null;

  const courseCount =
    accessibleCourses !== null ? Number(accessibleCourses) : 0;

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 18
      ? "Good afternoon"
      : "Good evening";

  const quickActions = [
    {
      label: "Edit Profile",
      icon: "👤",
      to: "/profile",
    },
    {
      label: "Check Weather",
      icon: "🌤",
      to: "/weather",
    },
    {
      label: "Update Plan",
      icon: "💳",
      to: "/pricing",
    },
  ];

  return (
    <div>
      <PageHeader
        title={`${greeting}, ${firstName}`}
        sub={
          doneCount === STEPS.length
            ? "You're all set — enjoy your workspace 🚀"
            : "Here's what's happening in your workspace."
        }
        actions={
          <Button
            variant="outline"
            onClick={() => navigate("/profile")}
          >
            Edit Profile
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Current Plan"
          value={planName}
          icon="💎"
          badge="Plan"
          loading={!profile}
        />

        <StatCard
          label="Account Status"
          value="Active"
          icon="🟢"
          badge="Status"
        />

        <StatCard
          label="Member Since"
          value={memberSince}
          icon="📅"
          badge="Member Since"
          loading={!profile}
        />

        <StatCard
          label="Courses"
          value={courseCount}
          icon="📚"
          badge="Courses"
          loading={!stats}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,1fr)]">
        <Card className="p-6">
          <div className="mb-4.5 flex items-center justify-between gap-4">
            <div>
              <h2 className="m-0 text-base font-bold text-text">
                Get started
              </h2>

              <p className="mt-1 text-[13px] text-text-2">
                Complete these steps to unlock the full experience.
              </p>
            </div>

            <div className="shrink-0">
              <ProgressRing
                pct={pct}
                size={72}
                stroke={7}
                color="#d4af37"
              >
                <span className="font-display text-[15px] font-extrabold text-text">
                  {pct}%
                </span>
              </ProgressRing>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {STEPS.map((s) => {
              const isDone = !!done[s.key];

              return (
                <div
                  key={s.key}
                  className={`flex cursor-pointer items-center gap-3.5 rounded-md border p-3 transition-colors duration-200 ${
                    isDone
                      ? "border-success/25 bg-success/5"
                      : "border-line bg-surface-2/60"
                  }`}
                  onClick={() => toggleStep(s.key)}
                >
                  <span
                    className={`flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                      isDone
                        ? "border border-success bg-success/15 text-success"
                        : "border border-line-strong bg-surface-3 text-text-3"
                    }`}
                  >
                    {isDone ? "✓" : s.icon}
                  </span>

                  <span
                    className={`flex-1 text-[13.5px] font-semibold ${
                      isDone
                        ? "text-text-2 line-through"
                        : "text-text"
                    }`}
                  >
                    {s.label}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(s.to);
                    }}
                    className="cursor-pointer rounded-sm border border-line-strong px-3 py-1.5 text-xs font-semibold text-text-2 transition-colors duration-200 hover:bg-surface-2"
                  >
                    Open
                  </button>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="m-0 text-base font-bold text-text">
            Quick Actions
          </h2>

          <p className="mt-1 text-[13px] text-text-2">
            Jump straight to the tools you use most.
          </p>

          <div className="mt-4.5 flex flex-col gap-3">
            {quickActions.map((a) => (
              <button
                key={a.label}
                onClick={() => navigate(a.to)}
                className="flex cursor-pointer items-center gap-2.5 rounded-sm border border-line-strong bg-surface-2/60 px-4 py-3 text-[13.5px] font-semibold text-text-2 transition-colors duration-200 hover:bg-surface-2"
              >
                <span className="text-lg">{a.icon}</span>
                <span className="text-text">{a.label}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;