interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow ${className}`}>
      {children}
    </div>
  );
}
