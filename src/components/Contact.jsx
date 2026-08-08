import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendContactMessage } from "../api";
import { Logo, Input, Textarea, Field, Button, ErrorBox, SuccessBox, WaveDivider } from "../components/ui";

const infoItems = [
  { icon: "📧", label: "Email", title: "hello@corestack.dev", sub: "We reply within 24 hours" },
  { icon: "💬", label: "Live Chat", title: "Available on dashboard", sub: "Mon-Fri, 9am-6pm" },
  { icon: "📍", label: "Location", title: "Remote First", sub: "Serving clients worldwide" },
  { icon: "🚀", label: "Response Time", title: "Within 24 Hours", sub: "We read every message" },
];

const Contact = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all required fields.");
      return;
    }
    try {
      setLoading(true);
      await sendContactMessage({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      });
      setSuccess("Successfully sent your message.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setError("Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-bg min-h-screen font-sans">
      <nav className="sticky top-0 z-[100] flex items-center justify-between border-b border-line bg-canvas/85 px-5 py-4 backdrop-blur-xl sm:px-10 lg:px-14">
        <Logo />
        <div className="hidden gap-8 md:flex">
          <button onClick={() => navigate("/")} className="cursor-pointer border-none bg-transparent text-sm font-medium text-text-2 transition-colors hover:text-primary">Home</button>
          <button onClick={() => navigate("/dashboard")} className="cursor-pointer border-none bg-transparent text-sm font-medium text-text-2 transition-colors hover:text-primary">Dashboard</button>
          <button className="cursor-pointer border-none bg-transparent text-sm font-medium text-primary">Contact</button>
        </div>
      </nav>

      <div className="relative overflow-hidden px-6 pb-10 pt-16 text-center sm:pt-20">
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-[13px] font-medium text-text-2 shadow-sm">
          💬 Get in Touch
        </div>
        <h1 className="m-0 font-display text-5xl font-extrabold tracking-tight text-text sm:text-6xl lg:text-7xl">
          Let's <span className="gradient-text">Talk</span>
        </h1>
        <p className="mx-auto mt-4 max-w-[480px] text-base leading-relaxed text-text-2">
          Have a question, idea, or just want to say hello? We'd love to hear from you.
        </p>

        <WaveDivider fill="#050505" opacity={0.9} className="-mb-10" />
      </div>

      <div className="mx-auto grid max-w-[1200px] gap-8 px-5 py-10 sm:px-10 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
        <div>
          <h2 className="m-0 mb-2.5 font-display text-2xl font-extrabold tracking-tight text-text sm:text-[26px]">
            Contact Information
          </h2>
          <p className="mb-6 max-w-[380px] text-sm leading-relaxed text-text-2">
            Fill out the form or reach us through any of the channels below. We typically respond within 24 hours.
          </p>
          <div className="flex flex-col gap-3.5">
            {infoItems.map((item) => (
              <div key={item.label} className="flex items-start gap-4 rounded-md border border-line bg-surface p-4 px-5">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-sm border border-line bg-surface-2">
                  <span className="text-xl">{item.icon}</span>
                </div>
                <div>
                  <p className="m-0 text-[10px] font-bold uppercase tracking-[0.12em] text-text-3">{item.label}</p>
                  <p className="m-0 text-[14.5px] font-semibold text-text">{item.title}</p>
                  <p className="m-0 text-xs text-text-3">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-line bg-surface p-6 shadow-sm sm:p-9">
          <h2 className="m-0 mb-1.5 font-display text-2xl font-extrabold tracking-tight text-text">
            Send us a Message
          </h2>
          <p className="mb-6 text-sm text-text-2">We read every message carefully.</p>

          {error && <ErrorBox>{error}</ErrorBox>}
          {success && <SuccessBox>{success}</SuccessBox>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name">
                <Input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required />
              </Field>
              <Field label="Email Address">
                <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@email.com" required />
              </Field>
            </div>

            <Field label="Subject">
              <Input name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help you?" />
            </Field>

            <Field label="Message">
              <Textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us more about your project, idea, or question..."
                rows={6}
                required
              />
            </Field>

            <Button type="submit" size="lg" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </Button>
            <p className="mt-1 text-center text-[13px] text-text-3">
              By submitting, you agree to our <span className="cursor-pointer text-primary">Privacy Policy</span>
            </p>
          </form>
        </div>
      </div>

      <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line bg-canvas px-5 py-6 sm:px-10 lg:px-14">
        <Logo />
        <p className="m-0 text-[13px] text-text-3">© 2026 SaaS Panel. All rights reserved.</p>
        <div className="flex gap-7">
          <button onClick={() => navigate("/")} className="cursor-pointer border-none bg-transparent text-[13px] text-text-2 transition-colors hover:text-text">Home</button>
          <button onClick={() => navigate("/dashboard")} className="cursor-pointer border-none bg-transparent text-[13px] text-text-2 transition-colors hover:text-text">Dashboard</button>
          <button className="cursor-pointer border-none bg-transparent text-[13px] text-text-2 transition-colors hover:text-text">Contact</button>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
