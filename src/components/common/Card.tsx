// File: /components/common/Card.tsx
import React from "react";
import { cn } from "@/lib/utils/ts-merge";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary";
  padding?: "none" | "sm" | "md" | "lg";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant = "default", padding = "md", children, ...props },
    ref
  ) => {
    const baseStyles = "rounded-lg shadow-sm";

    const variants = {
      default: "bg-slate-800 text-slate-200",
      secondary: "bg-slate-700 text-slate-200",
    };

    const paddings = {
      none: "p-0",
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
}

export const CardHeader = ({
  className,
  title,
  subtitle,
  children,
  ...props
}: CardHeaderProps) => {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-4", className)} {...props}>
      {title && <h3 className="font-semibold text-lg">{title}</h3>}
      {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
      {children}
    </div>
  );
};

export const CardContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn("p-4 pt-0", className)} {...props} />;
};

export const CardFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("flex items-center p-4 pt-0", className)} {...props} />
  );
};
