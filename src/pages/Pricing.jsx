import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const plans = {
  monthly: [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      color: "#38bdf8",
      icon: "🆓",
      desc: "Perfect for individuals getting started.",
      highlight: false,
      features: [
        { text: "1 User", included: true },
        { text: "Basic Dashboard", included: true },
        { text: "5GB Storage", included: true },
        { text: "Email Support", included: true },
        { text: "Access to Free Courses", included: true },
        { text: "API Access", included: false },
        { text: "Pro Courses", included: false },
        { text: "Priority Support", included: false },
        { text: "Custom Integrations", included: false },
        { text: "Dedicated Manager", included: false },
      ],
      cta: "Get Started Free",
    },
    {
      name: "Professional",
      price: "$19",
      period: "/month",
      color: "#7c3aed",
      icon: "⚡",
      desc: "For growing teams and professionals.",
      highlight: true,
      features: [
        { text: "10 Users", included: true },
        { text: "Advanced Dashboard", included: true },
        { text: "50GB Storage", included: true },
        { text: "Priority Email Support", included: true },
        { text: "Access to Free Courses", included: true },
        { text: "API Access", included: true },
        { text: "Pro Courses", included: true },
        { text: "Priority Support", included: true },
        { text: "Custom Integrations", included: false },
        { text: "Dedicated Manager", included: false },
      ],
      cta: "Buy Professional Plan",
    },
    {
      name: "Business",
      price: "$49",
      period: "/month",
      color: "#f59e0b",
      icon: "🏢",
      desc: "For large teams and enterprises.",
      highlight: false,
      features: [
        { text: "Unlimited Users", included: true },
        { text: "Custom Analytics", included: true },
        { text: "500GB Storage", included: true },
        { text: "24/7 Phone Support", included: true },
        { text: "Access to Free Courses", included: true },
        { text: "API Access", included: true },
        { text: "Pro Courses", included: true },
        { text: "Priority Support", included: true },
        { text: "Custom Integrations", included: true },
        { text: "Dedicated Manager", included: true },
      ],
      cta: "Buy Business Plan",
    },
  ],
  yearly: [
    {
      name: "Free",
      price: "$0",
      period: "/year",
      color: "#38bdf8",
      icon: "🆓",
      desc: "Perfect for individuals getting started.",
      highlight: false,
      features: [
        { text: "1 User", included: true },
        { text: "Basic Dashboard", included: true },
        { text: "5GB Storage", included: true },
        { text: "Email Support", included: true },
        { text: "Access to Free Courses", included: true },
        { text: "API Access", included: false },
        { text: "Pro Courses", included: false },
        { text: "Priority Support", included: false },
        { text: "Custom Integrations", included: false },
        { text: "Dedicated Manager", included: false },
      ],
      cta: "Get Started Free",
    },
    {
      name: "Professional",
      price: "$99",
      period: "/year",
      color: "#7c3aed",
      icon: "⚡",
      desc: "For growing teams and professionals.",
      highlight: true,
      badge: "Save 57%",
      features: [
        { text: "10 Users", included: true },
        { text: "Advanced Dashboard", included: true },
        { text: "50GB Storage", included: true },
        { text: "Priority Email Support", included: true },
        { text: "Access to Free Courses", included: true },
        { text: "API Access", included: true },
        { text: "Pro Courses", included: true },
        { text: "Priority Support", included: true },
        { text: "Custom Integrations", included: false },
        { text: "Dedicated Manager", included: false },
      ],
      cta: "Buy Professional Plan",
    },
    {
      name: "Business",
      price: "$249",
      period: "/year",
      color: "#f59e0b",
      icon: "🏢",
      desc: "For large teams and enterprises.",
      highlight: false,
      badge: "Save 58%",
      features: [
        { text: "Unlimited Users", included: true },
        { text: "Custom Analytics", included: true },
        { text: "500GB Storage", included: true },
        { text: "24/7 Phone Support", included: true },
        { text: "Access to Free Courses", included: true },
        { text: "API Access", included: true },
        { text: "Pro Courses", included: true },
        { text: "Priority Support", included: true },
        { text: "Custom Integrations", included: true },
        { text: "Dedicated Manager", included: true },
      ],
      cta: "Buy Business Plan",
    },
  ],
};

const Pricing = () => {
  const navigate = useNavigate();
  const [billing, setBilling] = useState("monthly");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [userPlan, setUserPlan] = useState("Free"); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${import.meta.env.VITE_API_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        console.log("USER DATA:", data);
        if (data.is_pro || data.has_purchased) {
          setUserPlan("Professional");
        } else {
          setUserPlan("Free");
        }
      });
  }, []);

  const currentPlans = plans[billing];

  const handleCheckout = async (plan) => {
    if (plan.price === "$0") {
      navigate("/dashboard");
      return;
    }

    const numericAmount = parseInt(plan.price.replace("$", ""), 10);
    const planIdentifier = `${plan.name} (${billing})`;

    setLoadingPlan(plan.name);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/payment/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          planName: planIdentifier,
          amount: numericAmount,
          billingPeriod: billing
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Payment initialization failed.");
        setLoadingPlan(null);
      }
    } catch (error) {
      console.error("Stripe Redirect Error:", error);
      alert("Something went wrong. Please try again.");
      setLoadingPlan(null);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.topRow}>
        <button
          onClick={() => navigate("/dashboard")}
          style={styles.dashboardBtn}
          onMouseEnter={(e) => { e.target.style.background = "#1d4ed8"; }}
          onMouseLeave={(e) => { e.target.style.background = "#2563eb"; }}
        >
          Home
        </button>
      </div>

      <h1 style={styles.heading}>Pricing Plans</h1>
      <p style={styles.sub}>Choose the plan that works best for you and your team.</p>

      <div style={styles.toggleWrap}>
        <button
          onClick={() => setBilling("monthly")}
          style={{
            ...styles.toggleBtn,
            background: billing === "monthly" ? "#7c3aed" : "transparent",
            color: billing === "monthly" ? "#fff" : "#6b7280",
          }}
        >
          Monthly
        </button>
        <button
          onClick={() => setBilling("yearly")}
          style={{
            ...styles.toggleBtn,
            background: billing === "yearly" ? "#7c3aed" : "transparent",
            color: billing === "yearly" ? "#fff" : "#6b7280",
          }}
        >
          Yearly
          <span style={styles.saveBadge}>Save up to 58%</span>
        </button>
      </div>

      <div style={styles.grid}>
        {currentPlans.map((plan) => (
          <div
            key={plan.name}
            style={{
              ...styles.card,
              border: plan.highlight ? `2px solid ${plan.color}` : "1px solid #1e2130",
              transform: plan.highlight ? "scale(1.03)" : "scale(1)",
            }}
          >
            {plan.highlight && (
              <div style={{ ...styles.popularBadge, background: plan.color }}>
                Most Popular
              </div>
            )}

            {plan.badge && (
              <div style={styles.yearSaveBadge}>{plan.badge}</div>
            )}

            <div style={styles.cardHeader}>
              <span style={styles.planIcon}>{plan.icon}</span>
              <div>
                <h3 style={styles.planName}>{plan.name}</h3>
                <p style={styles.planDesc}>{plan.desc}</p>
              </div>
            </div>

            <div style={styles.priceRow}>
              <span style={{ ...styles.price, color: plan.color }}>{plan.price}</span>
              <span style={styles.period}>{plan.period}</span>
            </div>

            <div style={styles.divider} />

            <ul style={styles.featureList}>
              {plan.features.map((f) => (
                <li key={f.text} style={styles.featureItem}>
                  <span style={{ ...styles.featureIcon, color: f.included ? "#34d399" : "#374151" }}>
                    {f.included ? "✓" : "✕"}
                  </span>
                  <span style={{ ...styles.featureText, color: f.included ? "#d1d5db" : "#4b5563" }}>
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleCheckout(plan)}
              disabled={loadingPlan !== null || userPlan === plan.name}
              style={{
                ...styles.ctaBtn,
                background: userPlan === plan.name ? "#22c55e" : plan.highlight ? plan.color : "transparent",
                color: "#fff",
                border: userPlan === plan.name ? "1px solid #22c55e" : `1px solid ${plan.color}`,
                opacity: loadingPlan && loadingPlan !== plan.name ? 0.5 : 1,
                cursor: userPlan === plan.name ? "default" : "pointer",
              }}
            >
              {loadingPlan === plan.name
                ? "Connecting..."
                : userPlan === plan.name
                ? "✓ Current Plan"
                : plan.cta}
            </button>
          </div>
        ))}
      </div>

      <div style={styles.faqSection}>
        <h2 style={styles.faqTitle}>Frequently Asked Questions</h2>
        <div style={styles.faqGrid}>
          {[
            { q: "Can I upgrade anytime?", a: "Yes, you can upgrade or downgrade your plan at any time." },
            { q: "Is there a free trial?", a: "Professional plan comes with a 14-day free trial, no credit card required." },
            { q: "What payment methods?", a: "We accept all major credit cards, PayPal, and bank transfers." },
            { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time with no penalties." },
          ].map((item) => (
            <div key={item.q} style={styles.faqCard}>
              <h4 style={styles.faqQ}>{item.q}</h4>
              <p style={styles.faqA}>{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { padding: "40px", background: "#1B1464", minHeight: "100vh" },
  heading: { color: "#fff", fontSize: "30px", fontWeight: "800", margin: "0 0 5px", letterSpacing: "-0.5px" },
  sub: { color: "#9ca3af", fontSize: "14px", marginBottom: "28px" },
  toggleWrap: { display: "flex", background: "#161824", border: "1px solid #1e2130", borderRadius: "12px", padding: "4px", width: "fit-content", marginBottom: "36px", gap: "4px" },
  toggleBtn: { padding: "8px 20px", borderRadius: "8px", border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s" },
  saveBadge: { background: "#052e16", color: "#34d399", fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "20px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "40px", alignItems: "start" },
  card: { background: "#161824", borderRadius: "20px", padding: "28px", position: "relative", display: "flex", flexDirection: "column", gap: "16px", transition: "transform 0.2s" },
  popularBadge: { position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", color: "#fff", fontSize: "11px", fontWeight: "700", padding: "4px 16px", borderRadius: "20px", whiteSpace: "nowrap" },
  yearSaveBadge: { position: "absolute", top: "16px", right: "16px", background: "#052e16", color: "#34d399", fontSize: "10px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px", border: "1px solid #166534" },
  cardHeader: { display: "flex", alignItems: "flex-start", gap: "12px" },
  planIcon: { fontSize: "28px", flexShrink: 0 },
  planName: { color: "#fff", fontSize: "18px", fontWeight: "700", margin: "0 0 4px" },
  planDesc: { color: "#6b7280", fontSize: "12px", margin: 0, lineHeight: "1.5" },
  priceRow: { display: "flex", alignItems: "baseline", gap: "6px" },
  price: { fontSize: "40px", fontWeight: "800", letterSpacing: "-1px" },
  period: { color: "#6b7280", fontSize: "14px" },
  divider: { height: "1px", background: "#1e2130" },
  featureList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" },
  featureItem: { display: "flex", alignItems: "center", gap: "10px" },
  featureIcon: { fontSize: "13px", fontWeight: "700", width: "16px", flexShrink: 0 },
  featureText: { fontSize: "13px" },
  ctaBtn: { width: "100%", padding: "13px", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", marginTop: "8px", transition: "all 0.2s" },
  faqSection: { marginTop: "16px" },
  faqTitle: { color: "#fff", fontSize: "20px", fontWeight: "700", marginBottom: "20px" },
  faqGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" },
  faqCard: { background: "#161824", border: "1px solid #1e2130", borderRadius: "12px", padding: "20px" },
  faqQ: { color: "#fff", fontSize: "14px", fontWeight: "600", margin: "0 0 8px" },
  faqA: { color: "#6b7280", fontSize: "13px", margin: 0, lineHeight: "1.6" },
  topRow: { display: "flex", justifyContent: "flex-end", marginBottom: "10px", marginTop: "-10px" },
  dashboardBtn: { background: "#2563eb", color: "#fff", border: "none", padding: "10px 15px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", transition: "background 0.2s" },
};

export default Pricing;