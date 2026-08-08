import { useNavigate } from "react-router-dom";
import { Logo, Button, WaveDivider } from "../components/ui";

const features = [
  { icon: "📚", title: "Structured Courses", desc: "Beginner to advanced tracks in web development, AI and machine learning." },
  { icon: "🤖", title: "AI-Powered Learning", desc: "Hands-on projects with real AI models so you learn by building." },
  { icon: "🌤", title: "Live Tools Built In", desc: "Weather, projects and services dashboards shipped right out of the box." },
  { icon: "⚡", title: "Learn at Your Pace", desc: "Self-paced lessons with progress tracking and flexible schedules." },
  { icon: "🔒", title: "Pro Unlocks", desc: "Upgrade once to unlock premium courses and priority support." },
  { icon: "🚀", title: "Career Ready", desc: "Portfolio-ready projects that get you hired faster." },
];

const stats = [
  { value: "12+", label: "Courses" },
  { value: "4k+", label: "Learners" },
  { value: "98%", label: "Satisfaction" },
  { value: "24/7", label: "Support" },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="app-bg min-h-screen overflow-x-hidden font-sans">
      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-line bg-canvas/85 px-5 py-4 backdrop-blur-xl sm:px-10 lg:px-16">
        <Logo />
        <div className="hidden gap-8 md:flex">
          <span className="cursor-pointer text-sm font-medium text-text-2 transition-colors hover:text-primary">Courses</span>
          <span className="cursor-pointer text-sm font-medium text-text-2 transition-colors hover:text-primary">Pricing</span>
          <span className="cursor-pointer text-sm font-medium text-text-2 transition-colors hover:text-primary" onClick={() => navigate("/contact")}>Contact</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="ghost" onClick={() => navigate("/login")}>Sign In</Button>
          <Button onClick={() => navigate("/signup")}>Get Started</Button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center px-6 pb-10 pt-20 text-center sm:pt-28 lg:pt-32">
        <div className="hero-grid" />
        <div className="hero-glow" />

        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-[13px] font-medium text-text-2 shadow-sm">
          ✦ Now enrolling — Spring 2026 cohort
        </div>

        <h1 className="m-0 max-w-4xl font-display text-5xl font-extrabold leading-[1.06] tracking-tight text-text sm:text-6xl lg:text-[72px]">
          Build your future
          <br />
          <span className="gradient-text">one skill at a time</span>
        </h1>

        <p className="mt-6 max-w-[560px] text-[15px] leading-relaxed text-text-2 sm:text-lg">
          Learn modern web development, AI and machine learning through structured,
          hands-on courses. Join thousands already building with SaaS Panel.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <Button size="lg" onClick={() => navigate("/signup")}>Start Learning Free</Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/login")}>Sign In</Button>
        </div>

        <p className="mt-5 text-[13px] text-text-3">Free & Pro courses available · No credit card required</p>

        {/* Floating preview cards */}
        <div className="relative mt-12 h-[120px] w-full max-w-[900px]">
          <div className="absolute left-0 top-5 hidden items-center gap-3 rounded-md border border-line bg-surface/95 p-3.5 shadow-lg backdrop-blur md:flex">
            <span className="text-[26px]">📈</span>
            <div>
              <p className="m-0 text-[11px] font-semibold uppercase tracking-wider text-text-3">Progress</p>
              <p className="m-0 text-base font-bold text-text">68%</p>
            </div>
          </div>
          <div className="absolute bottom-5 right-0 hidden items-center gap-3 rounded-md border border-line bg-surface/95 p-3.5 shadow-lg backdrop-blur md:flex">
            <span className="text-[26px]">🏆</span>
            <div>
              <p className="m-0 text-[11px] font-semibold uppercase tracking-wider text-text-3">Course unlocked</p>
              <p className="m-0 text-base font-bold text-text">AI Mastery</p>
            </div>
          </div>
        </div>

        <WaveDivider fill="#050505" className="-mb-10" />
      </section>

      {/* ── STATS ── */}
      <section className="mx-auto w-full max-w-[1000px] px-6">
        <div className="flex flex-wrap items-center justify-around gap-6 rounded-xl border border-line bg-surface px-6 py-7 shadow-sm">
          {stats.map((s) => (
            <div key={s.label} className="min-w-[110px] text-center">
              <p className="m-0 font-display text-3xl font-extrabold tracking-tight text-primary">{s.value}</p>
              <p className="mt-1 text-[13px] text-text-3">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="mx-auto max-w-[1100px] px-6 py-16 text-center sm:py-20">
        <h2 className="m-0 font-display text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
          Everything you need to <span className="gradient-text">level up</span>
        </h2>
        <p className="mx-auto mt-4 mb-12 max-w-[480px] text-base text-text-2">
          A complete platform for learning, building and growing your career.
        </p>

        <div className="grid gap-5 text-left sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-lg border border-line bg-surface p-6 transition-shadow duration-200 hover:shadow-md">
              <div className="mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-md bg-primary-soft text-2xl">
                {f.icon}
              </div>
              <h3 className="m-0 text-[17px] font-bold text-text">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto mb-16 max-w-[1000px] px-6">
        <div className="rounded-xl border border-line bg-surface px-6 py-12 text-center shadow-sm sm:py-16">
          <h2 className="m-0 font-display text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
            Ready to start building?
          </h2>
          <p className="mx-auto mt-3 mb-8 max-w-[420px] text-base text-text-2">
            Create your free account in under a minute. No credit card needed.
          </p>
          <Button size="lg" onClick={() => navigate("/signup")}>Create Free Account</Button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-line bg-canvas px-5 py-6 sm:px-10 lg:px-16">
        <Logo />
        <p className="m-0 text-[13px] text-text-3">© 2026 SaaS Panel. All rights reserved.</p>
        <div className="flex gap-7">
          <button onClick={() => navigate("/contact")} className="cursor-pointer border-none bg-transparent text-[13px] text-text-2 transition-colors hover:text-text">Contact</button>
          <button className="cursor-pointer border-none bg-transparent text-[13px] text-text-2 transition-colors hover:text-text">Privacy</button>
          <button className="cursor-pointer border-none bg-transparent text-[13px] text-text-2 transition-colors hover:text-text">GitHub</button>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
