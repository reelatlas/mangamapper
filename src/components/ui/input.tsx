import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:text-foreground [&:-webkit-autofill]:[-webkit-text-fill-color:hsl(var(--foreground))] [&:-webkit-autofill]:shadow-[var(--tw-ring-offset-shadow),var(--tw-ring-shadow),inset_0_0_0px_1000px_hsl(var(--muted)_/_0.3)] [&:-webkit-autofill:hover]:shadow-[var(--tw-ring-offset-shadow),var(--tw-ring-shadow),inset_0_0_0px_1000px_hsl(var(--muted)_/_0.3)] [&:-webkit-autofill:focus]:shadow-[var(--tw-ring-offset-shadow),var(--tw-ring-shadow),inset_0_0_0px_1000px_hsl(var(--muted)_/_0.3)] [&:-webkit-autofill:focus-visible]:shadow-[var(--tw-ring-offset-shadow),var(--tw-ring-shadow),inset_0_0_0px_1000px_hsl(var(--muted)_/_0.3)]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
