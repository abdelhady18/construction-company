import Link from "next/link";

type Variant = "primary" | "secondary" | "accent" | "outline" | "ghost" | "danger";

interface ButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  href?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-light",
  secondary:
    "bg-border text-foreground hover:bg-border/80",
  accent:
    "bg-accent text-white hover:bg-accent-light",
  outline:
    "border border-accent text-accent hover:bg-accent hover:text-white",
  ghost:
    "text-foreground hover:bg-primary/5",
  danger:
    "bg-red-600 text-white hover:bg-red-700",
};

export default function Button({
  children,
  variant = "primary",
  href,
  type = "button",
  className = "",
  onClick,
  disabled = false,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm tracking-wide touch-manipulation";

  if (href) {
    return (
      <Link href={href} className={`${base} ${variantClasses[variant]} ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
