import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Badge, Button } from "../components/ui";
import { useToast } from "../components/Toast";

const plans = {
  monthly: [
    {
      name: "Free",
      price: "$0",
      period: "/month",
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
  const toast = useToast();
  const [billing, setBilling] = useState("monthly");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [userPlan, setUserPlan] = useState("Free");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${import.meta.env.VITE_API_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          planName: planIdentifier,
          amount: numericAmount,
          billingPeriod: billing,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.assign(data.url);
      } else {
        toast.error("Payment initialization failed.", { title: "Checkout unavailable" });
        setLoadingPlan(null);
      }
    } catch (error) {
      console.error("Stripe Redirect Error:", error);
      toast.error("Something went wrong. Please try again.", { title: "Checkout failed" });
      setLoadingPlan(null);
    }
  };

  const faqs = [
    { q: "Can I upgrade anytime?", a: "Yes, you can upgrade or downgrade your plan at any time." },
    { q: "Is there a free trial?", a: "Professional plan comes with a 14-day free trial, no credit card required." },
    { q: "What payment methods?", a: "We accept all major credit cards, PayPal, and bank transfers." },
    { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time with no penalties." },
  ];

  return (
    <div>
      <PageHeader
        title="Pricing Plans"
        sub="Choose the plan that works best for you and your team"
      />

      <div className="mb-9 flex w-fit gap-1 rounded-md border border-line bg-surface p-1">
        <button
          onClick={() => setBilling("monthly")}
          className={`cursor-pointer rounded-sm border-none px-5 py-2 text-sm font-semibold transition-colors duration-150 ${
            billing === "monthly" ? "bg-primary text-black shadow-sm" : "text-text-2 hover:text-text"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBilling("yearly")}
          className={`flex cursor-pointer items-center gap-2 rounded-sm border-none px-5 py-2 text-sm font-semibold transition-colors duration-150 ${
            billing === "yearly" ? "bg-primary text-black shadow-sm" : "text-text-2 hover:text-text"
          }`}
        >
          Yearly
          <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">Save up to 58%</span>
        </button>
      </div>

      <div className="mb-12 grid items-stretch gap-6 md:grid-cols-3">
        {currentPlans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col gap-4.5 rounded-xl bg-surface p-7 ${
              plan.highlight ? "border border-primary/60 shadow-lg" : "border border-line shadow-sm"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-line-strong bg-primary px-4 py-1.5 text-xs font-bold text-black shadow-md">
                ★ Most Popular
              </div>
            )}
            {plan.badge && (
              <Badge color="#34d399" className="absolute right-4 top-4">{plan.badge}</Badge>
            )}

            <div className="flex items-start gap-3">
              <span className="shrink-0 text-[30px]">{plan.icon}</span>
              <div>
                <h3 className="m-0 mb-1 font-display text-[19px] font-bold text-text">{plan.name}</h3>
                <p className="m-0 text-[12.5px] leading-relaxed text-text-3">{plan.desc}</p>
              </div>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className={`font-display text-[42px] font-extrabold tracking-tight ${plan.highlight ? "text-primary" : "text-text"}`}>
                {plan.price}
              </span>
              <span className="text-sm text-text-3">{plan.period}</span>
            </div>

            <div className="h-px bg-line" />

            <ul className="m-0 flex flex-1 list-none flex-col gap-2.5 p-0">
              {plan.features.map((f) => (
                <li key={f.text} className="flex items-center gap-2.5 text-[13.5px]">
                  <span className={`w-4 shrink-0 text-[13px] font-bold ${f.included ? "text-success" : "text-text-3"}`}>
                    {f.included ? "✓" : "✕"}
                  </span>
                  <span className={f.included ? "text-text-2" : "text-text-3"}>{f.text}</span>
                </li>
              ))}
            </ul>

            <Button
              className="mt-2 w-full"
              onClick={() => handleCheckout(plan)}
              disabled={loadingPlan !== null || userPlan === plan.name}
              style={{
                background: userPlan === plan.name ? "rgba(212,175,55,0.12)" : plan.highlight ? "#d4af37" : "transparent",
                color: userPlan === plan.name ? "#d4af37" : plan.highlight ? "#050505" : "#e5e5e5",
                border: userPlan === plan.name ? "1px solid rgba(212,175,55,0.4)" : plan.highlight ? "1px solid #d4af37" : "1px solid #3a3a3a",
                cursor: userPlan === plan.name ? "default" : "pointer",
              }}
            >
              {loadingPlan === plan.name
                ? "Connecting..."
                : userPlan === plan.name
                ? "✓ Current Plan"
                : plan.cta}
            </Button>
          </div>
        ))}
      </div>

      <h2 className="mb-5 font-display text-xl font-bold text-text">Frequently Asked Questions</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {faqs.map((item) => (
          <div key={item.q} className="rounded-md border border-line bg-surface p-5">
            <h4 className="m-0 mb-2 text-[14.5px] font-semibold text-text">{item.q}</h4>
            <p className="m-0 text-[13px] leading-relaxed text-text-3">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
