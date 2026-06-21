import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendContactMessage } from "../api";


const infoItems = [
    { icon: "📧", label: "EMAIL", title: "hello@corestack.dev", sub: "We reply within 24 hours" },
    { icon: "💬", label: "LIVE CHAT", title: "Available on dashboard", sub: "Mon-Fri, 9am-6pm" },
    { icon: "📍", label: "LOCATION", title: "Remote First", sub: "Serving clients worldwide" },
    { icon: "🚀", label: "RESPONSE TIME", title: "Within 24 Hours", sub: "We read every message" },
];

const Contact = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setSuccess(""); setError("");
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
            setSuccess("✅ Message sent! We'll reply within 24 hours.");
            setForm({ from_name: "", from_email: "", subject: "", message: "" });
        } catch {
            setError("Failed to send. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <nav style={styles.nav}>
                <div style={styles.navLogo}>
                    <div style={styles.navLogoIcon}>S</div>
                    <span style={styles.navLogoText}>SaaSPanel</span>
                </div>
                <div style={styles.navLinks}>
                    <button onClick={() => navigate("/")} style={styles.navLink}>Home</button>
                    <button onClick={() => navigate("/dashboard")} style={styles.navLink}>Dashboard</button>
                    <button style={{ ...styles.navLink, color: "#818cf8" }}>Contact</button>
                </div>
            </nav>

            <div style={styles.hero}>
                <div style={styles.glow} />

                <div style={styles.badge}>
                    <span style={{ fontSize: "14px" }}>💬</span>
                    <span>Get in Touch</span>
                </div>

                <h1 style={styles.heroTitle}>
                    Let's <span style={styles.heroAccent}>Talk</span>
                </h1>

                <p style={styles.heroSub}>
                    Have a question, idea, or just want to say hello? We'd love to hear from you.
                </p>
            </div>


            <div style={styles.main}>


                <div style={styles.left}>
                    <h2 style={styles.leftTitle}>Contact Information</h2>
                    <p style={styles.leftSub}>
                        Fill out the form or reach us through any of the channels below.
                        We typically respond within 24 hours.
                    </p>
                    <div style={styles.infoList}>
                        {infoItems.map((item) => (
                            <div key={item.label} style={styles.infoCard}>
                                <div style={styles.infoIconWrap}>
                                    <span style={{ fontSize: "20px" }}>{item.icon}</span>
                                </div>
                                <div>
                                    <p style={styles.infoLabel}>{item.label}</p>
                                    <p style={styles.infoTitle}>{item.title}</p>
                                    <p style={styles.infoSub}>{item.sub}</p>

                                </div>

                            </div>
                        ))}
                    </div>


                </div>

                <div style={styles.right}>
                    <h2 style={styles.formTitle}>Send us a Message</h2>
                    <p style={styles.formSub}>We read every message carefully.</p>

                    {error && <div style={styles.errorBox}>{error}</div>}
                    {success && <div style={styles.successBox}>{success}</div>}

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formRow}>
                            <div style={styles.field}>
                                <label style={styles.label}>FULL NAME</label>
                                <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" style={styles.input} required/>
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>EMAIL ADDRESS</label>
                                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@email.com" style={styles.input} required/>
                                </div>
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}>SUBJECT</label>
                            <input name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help you?" style={styles.input} />
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}>MESSAGE</label>
                            <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us more about your project, idea, or question..." style={styles.textarea} rows={6} required />
                        </div>

                        <button type="submit" style={styles.submitBtn} disabled={loading}>
                            {loading ? "Sending..." : "Send Message"}
                        </button>
                        <p style={styles.privacyText}>
                            By submitting, you agree to our{" "}
                            <span style={styles.privacyLink}>
                                Privacy Policy
                            </span>
                        </p>
                    </form>
                </div>
            </div>

            <footer style={styles.footer}>
                <div style={styles.footerLogo}>
                    <div style={styles.footerIcon}>S</div>
                    <span style={styles.footerText}>SaaSPanel</span>
                </div>

                <p style={styles.footerCopyright}>
                    ⓢ 2026 SaaSPanel. All rights reserved.
                </p>

                <div style={styles.footerLinks}>
                    <button onClick={() => navigate("/")} style={styles.footerLink}>
                        Home
                    </button>

                    <button
                        onClick={() => navigate("/dashboard")}
                        style={styles.footerLink}
                    >
                        Dashboard
                    </button>

                    <button style={styles.footerLink}>
                        Contact
                    </button>
                </div>
            </footer>


        </div>
    );
};

const styles = {


    page: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0057ff 0%, #0d7dff 50%, #35a8ff 100%)",
        fontFamily: "'Segoe UI', sans-serif"
    },

    nav: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 60px",
        borderBottom: "1px solid #1e2130",
        position: "sticky",
        top: 0,
        background: "rgba(8,9,18,0.9)",
        backdropFilter: "blur(10px)",
        zIndex: 100
    },

    navLogo: {
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },

    navLogoIcon: {
        width: "36px",
        height: "36px",
        background: "#7c3aed",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: "800",
        fontSize: "16px"
    },

    navLogoText: {
        color: "#fff",
        fontWeight: "800",
        fontSize: "17px"
    },

    navLinks: {
        display: "flex",
        gap: "32px"
    },

    navLink: {
        background: "none",
        border: "none",
        color: "#9ca3af",
        fontSize: "15px",
        fontWeight: "500",
        cursor: "pointer"
    },

    hero: {
        position: "relative",
        textAlign: "center",
        padding: "80px 60px 60px",
        overflow: "hidden"
    },

    glow: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "600px",
        height: "300px",
        background: "radial-gradient(ellipse, rgba(124,58,237,0.25) 0%, transparent 70%)",
        pointerEvents: "none"
    },

    badge: {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        background: "#1e2130",
        border: "1px solid #2d3348",
        color: "#d1d5db",
        fontSize: "14px",
        fontWeight: "500",
        padding: "8px 18px",
        borderRadius: "30px",
        marginBottom: "28px"
    },

    heroTitle: {
        fontSize: "80px",
        fontWeight: "900",
        color: "#fff",
        margin: "0 0 20px",
        letterSpacing: "-2px",
        lineHeight: 1.1
    },

    heroAccent: {
        color: "#000"
    },

    heroSub: {
        color: "#000",
        fontSize: "16px",
        lineHeight: "1.7",
        maxWidth: "480px",
        margin: "0 auto"
    },

    main: {
        display: "grid",
        gridTemplateColumns: "1fr 1.4fr",
        gap: "48px",
        padding: "60px",
        maxWidth: "1200px",
        margin: "0 auto"
    },

    left: {},

    leftTitle: {
        color: "#fff",
        fontSize: "28px",
        fontWeight: "800",
        margin: "0 0 12px",
        letterSpacing: "-0.5px"
    },

    leftSub: {
        color: "#000",
        fontSize: "14px",
        lineHeight: "1.7",
        margin: "0 0 28px",
        maxWidth: "360px"
    },

    infoList: {
        display: "flex",
        flexDirection: "column",
        gap: "14px"
    },

    infoCard: {
        display: "flex",
        alignItems: "flex-start",
        gap: "16px",
        background: "#161824",
        border: "1px solid #1e2130",
        borderRadius: "14px",
        padding: "18px 20px"
    },

    infoIconWrap: {
        width: "42px",
        height: "42px",
        background: "#1e2130",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0
    },

    infoLabel: {
        color: "#4b5563",
        fontSize: "10px",
        fontWeight: "700",
        letterSpacing: "1.5px",
        margin: "0 0 4px"
    },

    infoTitle: {
        color: "#fff",
        fontSize: "15px",
        fontWeight: "700",
        margin: "0 0 2px"
    },

    infoSub: {
        color: "#6b7280",
        fontSize: "12px",
        margin: 0
    },

    right: {
        background: "#161824",
        border: "1px solid #1e2130",
        borderRadius: "20px",
        padding: "36px"
    },

    formTitle: {
        color: "#fff",
        fontSize: "26px",
        fontWeight: "800",
        margin: "0 0 6px",
        letterSpacing: "-0.5px"
    },

    formSub: {
        color: "#6b7280",
        fontSize: "14px",
        margin: "0 0 24px"
    },

    errorBox: {
        background: "#1f0a0a",
        border: "1px solid #7f1d1d",
        color: "#fca5a5",
        padding: "12px 16px",
        borderRadius: "10px",
        fontSize: "13px",
        marginBottom: "18px"
    },

    successBox: {
        background: "#052e16",
        border: "1px solid #166534",
        color: "#86efac",
        padding: "12px 16px",
        borderRadius: "10px",
        fontSize: "13px",
        marginBottom: "18px"
    },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: "18px"
    },

    formRow: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px"
    },

    field: {
        display: "flex",
        flexDirection: "column",
        gap: "8px"
    },

    label: {
        color: "#4b5563",
        fontSize: "11px",
        fontWeight: "700",
        letterSpacing: "1.2px"
    },

    input: {
        background: "#0d0f14",
        border: "1px solid #1e2130",
        borderRadius: "10px",
        padding: "12px 16px",
        color: "#fff",
        fontSize: "14px",
        outline: "none"
    },

    textarea: {
        background: "#0d0f14",
        border: "1px solid #1e2130",
        borderRadius: "10px",
        padding: "12px 16px",
        color: "#fff",
        fontSize: "14px",
        outline: "none",
        resize: "vertical",
        fontFamily: "inherit"
    },

    submitBtn: {
        background: "#7c3aed",
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        padding: "14px",
        fontSize: "15px",
        fontWeight: "700",
        cursor: "pointer"
    },

    privacyText: {
        textAlign: "center",
        color: "#6b7280",
        fontSize: "14px",
        marginTop: "5px",
    },

    privacyLink: {
        color: "#818cf8",
        cursor: "pointer",
    },


    footer: {
        borderTop: "1px solid rgba(255,255,255,0.08)",
        marginTop: "80px",
        padding: "28px 60px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#050816",
    },

    footerLogo: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },

    footerIcon: {
        width: "36px",
        height: "36px",
        borderRadius: "12px",
        background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        fontWeight: "700",
    },

    footerText: {
        color: "#fff",
        fontSize: "16px",
        fontWeight: "700",
    },

    footerCopyright: {
        color: "#6b7280",
        fontSize: "14px",
    },

    footerLinks: {
        display: "flex",
        gap: "28px",
    },

    footerLink: {
        background: "none",
        border: "none",
        color: "#6b7280",
        cursor: "pointer",
        fontSize: "14px",
        transition: "0.3s",
    },

};

export default Contact;