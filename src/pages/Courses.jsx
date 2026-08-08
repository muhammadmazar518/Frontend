import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { PageHeader, Card, Button, ErrorBox, Skeleton, EmptyState } from "../components/ui";

const getLevelColor = (level) => {
  switch (level?.toLowerCase()) {
    case "beginner":
      return { bg: "rgba(52,211,153,0.14)", text: "#34d399", border: "rgba(52,211,153,0.3)" };
    case "intermediate":
      return { bg: "rgba(96,165,250,0.14)", text: "#60a5fa", border: "rgba(96,165,250,0.3)" };
    case "advanced":
      return { bg: "rgba(248,113,113,0.14)", text: "#f87171", border: "rgba(248,113,113,0.3)" };
    default:
      return { bg: "rgba(161,161,170,0.14)", text: "#a1a1aa", border: "rgba(161,161,170,0.3)" };
  }
};

export default function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [levelFilter, setLevelFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoursesFromDB = async () => {
      try {
        setLoading(true);
        const response = await api.get("/courses");
        setCourses(response.data);
        setError(null);
      } catch (err) {
        console.error("Database connection error:", err);
        setError("Cannot connect to the database. Please check the backend server and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesFromDB();
  }, []);

  const filtered = levelFilter === "All"
    ? courses
    : courses.filter((c) => c.level?.toLowerCase() === levelFilter.toLowerCase());

  if (loading) {
    return (
      <div className="py-2">
        <Skeleton height={34} width="42%" className="mb-6" />
        <div className="flex flex-col gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4.5">
              <Skeleton width={52} height={52} radius={14} />
              <div className="flex-1">
                <Skeleton width="55%" height={16} />
                <Skeleton width="35%" height={12} className="mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorBox className="mx-auto max-w-[640px]">⚠️ {error}</ErrorBox>;
  }

  return (
    <div>
      <PageHeader
        title="Courses"
        sub="Browse structured tracks and unlock Pro content"
        actions={
          <div className="flex flex-wrap gap-1.5 rounded-full border border-line bg-surface p-1">
            {["All", "Beginner", "Intermediate", "Advanced"].map((l) => (
              <button
                key={l}
                onClick={() => setLevelFilter(l)}
                className={`cursor-pointer rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition-colors duration-150 ${
                  levelFilter === l ? "bg-primary text-black shadow-sm" : "text-text-2 hover:text-text"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        }
      />

      <div className={`grid items-start gap-6 ${activeCourse ? "lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,1fr)]" : ""}`}>
        <div className="min-w-0">
          <div className="flex flex-col gap-3">
            {filtered.length === 0 ? (
              <EmptyState
                icon="🎓"
                title="Nothing in this category"
                sub="No courses match this level yet. Try a different filter."
              />
            ) : (
              filtered.map((c) => {
                const lc = getLevelColor(c.level);
                const active = activeCourse?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setActiveCourse(active ? null : c)}
                    className={`flex cursor-pointer items-center gap-4 rounded-md border p-[18px] transition-colors duration-200 ${
                      active ? "border-primary/50 bg-primary-soft/70" : "border-line bg-surface hover:border-line-strong"
                    }`}
                  >
                    <span className="flex-shrink-0 rounded-md border border-line bg-surface-2 p-2.5 text-[28px] leading-none">
                      {c.icon || "🎓"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="m-0 mb-2 truncate font-display text-[15.5px] font-bold text-text">{c.title}</p>
                      <div className="flex flex-wrap gap-2.5 text-[11.5px] font-semibold">
                        <span
                          className="rounded-full px-2.5 py-0.5"
                          style={{ background: lc.bg, color: lc.text, border: `1px solid ${lc.border}` }}
                        >
                          {c.level}
                        </span>
                        <span className="text-text-3">⏱ {c.duration}</span>
                        <span className="text-warning">★ {c.rating}</span>
                      </div>
                    </div>
                    <span className={`text-xs ${active ? "text-primary" : "text-text-3"}`}>
                      {active ? "✕" : "→"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {activeCourse && (
          <Card className="sticky top-6 animate-fade-up p-6 shadow-lg sm:p-8">
            <div className="mb-4 text-[52px] leading-none">{activeCourse.icon || "🎓"}</div>
            <span
              className="mb-4 inline-block rounded-full px-3 py-1 text-[11px] font-bold"
              style={{
                background: getLevelColor(activeCourse.level).bg,
                color: getLevelColor(activeCourse.level).text,
                border: `1px solid ${getLevelColor(activeCourse.level).border}`,
              }}
            >
              {activeCourse.level}
            </span>
            <h2 className="m-0 mb-3 font-display text-2xl font-extrabold leading-snug text-text">
              {activeCourse.title}
            </h2>
            <p className="mb-5 text-sm leading-relaxed text-text-2">
              {activeCourse.description || activeCourse.desc}
            </p>

            <div className="mb-6 flex flex-wrap gap-6 border-y border-line py-3.5 text-[13px] text-text-3">
              <span>⏱ <strong className="font-semibold text-text-2">{activeCourse.duration}</strong></span>
              <span>📹 <strong className="font-semibold text-text-2">{activeCourse.lessons || 0} lessons</strong></span>
              <span className="text-warning">★ <strong className="font-semibold">{activeCourse.rating}</strong></span>
            </div>

            <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-primary">
              What you will learn
            </p>
            <ul className="mb-6 flex flex-col gap-1.5 pl-5">
              {Array.isArray(activeCourse.topics) ? (
                activeCourse.topics.map((t, i) => <li key={i} className="text-[13px] text-text-2">{t}</li>)
              ) : (
                <li className="text-[13px] text-text-2">Full course curriculum included.</li>
              )}
            </ul>

            <Button
              size="lg"
              onClick={() => navigate("/pricing")}
            >
              Buy Course — Unlock Pro Features
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
