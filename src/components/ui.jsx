export const PageHeader = ({ title, sub, actions }) => (
  <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight text-text sm:text-[1.75rem]">{title}</h1>
      {sub && <p className="mt-1.5 text-sm text-text-2">{sub}</p>}
    </div>
    {actions}
  </div>
);

export const Card = ({ children, className = "", style, ...rest }) => (
  <div {...rest} style={style} className={`rounded-lg border border-line bg-surface ${className}`}>
    {children}
  </div>
);

const buttonBase =
  "inline-flex cursor-pointer select-none items-center justify-center gap-2 rounded-sm font-semibold transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50";

const buttonSizes = {
  sm: "h-9 px-3.5 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

const buttonVariants = {
  primary: "bg-primary text-black shadow-sm hover:bg-primary-hover",
  outline: "border border-line-strong bg-surface text-text hover:bg-surface-2",
  ghost: "text-text-2 hover:bg-surface-2",
  danger: "border border-danger/30 bg-danger/10 text-danger hover:bg-danger/15",
};

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  style,
  ...props
}) => (
  <button
    {...props}
    style={style}
    className={`${buttonBase} ${buttonSizes[size]} ${buttonVariants[variant]} ${className}`}
  >
    {children}
  </button>
);

const fieldClass =
  "w-full rounded-sm border border-line-strong bg-surface px-4 text-sm text-text outline-none transition placeholder:text-text-3 focus:border-primary focus:ring-2 focus:ring-primary/20";

export const Input = ({ className = "", style, ...props }) => (
  <input {...props} style={style} className={`${fieldClass} h-11 ${className}`} />
);

export const Textarea = ({ className = "", style, ...props }) => (
  <textarea {...props} style={style} className={`${fieldClass} min-h-24 resize-y py-3 ${className}`} />
);

export const Select = ({ className = "", style, ...props }) => (
  <select {...props} style={style} className={`${fieldClass} h-11 ${className}`} />
);

export const Field = ({ label, children }) => (
  <div className="flex flex-col gap-2">
    {label && (
      <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-3">
        {label}
      </label>
    )}
    {children}
  </div>
);

export const Badge = ({ children, color = "#d4af37", className = "", style }) => (
  <span
    style={{ background: `${color}18`, color, borderColor: `${color}38`, ...style }}
    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold tracking-wide ${className}`}
  >
    {children}
  </span>
);

export const Spinner = ({ size = 40, className = "" }) => (
  <div
    className={`animate-spin rounded-full border-[3px] border-surface-3 border-t-primary ${className}`}
    style={{ width: size, height: size }}
  />
);

export const ErrorBox = ({ children, className = "", style }) => (
  <div
    style={style}
    className={`mb-4 rounded-sm border border-danger/30 bg-danger/10 px-4 py-3 text-[13px] text-danger ${className}`}
  >
    {children}
  </div>
);

export const SuccessBox = ({ children, className = "", style }) => (
  <div
    style={style}
    className={`mb-4 rounded-sm border border-success/30 bg-success/10 px-4 py-3 text-[13px] text-success ${className}`}
  >
    {children}
  </div>
);

export const Skeleton = ({ width = "100%", height = 16, radius = 10, className = "", style }) => (
  <div className={`skeleton ${className}`} style={{ width, height, borderRadius: radius, ...style }} />
);

export const SkeletonText = ({ width = "100%", className = "", style }) => (
  <Skeleton height={14} width={width} className={`mb-2.5 ${className}`} style={style} />
);

export const EmptyState = ({ icon = "🗂", title, sub, action, className = "" }) => (
  <div
    className={`flex animate-fade-up flex-col items-center gap-1.5 rounded-lg border border-dashed border-line-strong bg-surface-2/40 px-6 py-14 text-center ${className}`}
  >
    <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary-soft text-2xl">
      {icon}
    </div>
    {title && <h3 className="m-0 text-base font-bold text-text">{title}</h3>}
    {sub && <p className="m-0 max-w-[360px] text-[13.5px] text-text-2">{sub}</p>}
    {action && <div className="mt-3.5">{action}</div>}
  </div>
);

export const ProgressRing = ({ pct = 0, size = 88, stroke = 8, color = "#d4af37", children }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="stroke-surface-3"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (clamped / 100) * c}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
};

export const WaveDivider = ({ fill = "#050505", opacity = 1, className = "", style }) => (
  <div aria-hidden="true" className={`w-full overflow-hidden leading-none ${className}`} style={style}>
    <svg
      width="200%"
      height="64"
      viewBox="0 0 2400 120"
      preserveAspectRatio="none"
      className="block"
      style={{ opacity }}
    >
      <path
        d="M0,64 C150,110 300,110 450,64 C600,18 750,18 900,64 C1050,110 1200,110 C1350,110 1500,110 1650,64 C1800,18 1950,18 2100,64 C2250,110 2400,110 L2400,120 L0,120 Z"
        fill={fill}
      />
      <path
        d="M0,88 C150,110 300,110 450,88 C600,66 750,66 900,88 C1050,110 1200,110 C1350,110 1500,110 1650,88 C1800,66 1950,66 2100,88 C2250,110 2400,110 L2400,120 L0,120 Z"
        fill={fill}
        opacity="0.45"
      />
    </svg>
  </div>
);

export const Logo = ({ size = 38, text = true }) => (
  <div className="flex items-center gap-2.5">
    <div
      className="flex items-center justify-center rounded-sm bg-primary font-display font-extrabold text-black shadow-sm"
      style={{ width: size, height: size, fontSize: size * 0.46 }}
    >
      S
    </div>
    {text && (
      <span className="font-display text-lg font-bold tracking-tight text-text">
        SaaS<span className="text-primary">Panel</span>
      </span>
    )}
  </div>
);
