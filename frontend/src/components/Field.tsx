import { cn } from "@/lib/utils";
import { FC } from "react";

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> { }

export const Field: FC<FieldProps> = ({ children, className, ...props }) => {
  return <div className={cn("flex flex-col gap-2 w-full", className)} {...props}>{children}</div>;
};

export const FieldError: FC<FieldProps> = ({ children, className, ...props }) => {
  return <div className={cn("text-sm text-red-600 w-full", className)} {...props}>{children}</div>;
};
