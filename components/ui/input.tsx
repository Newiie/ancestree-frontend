import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const isActive = isFocused || (props.value && props.value.toString().length > 0);

    return (
      <div className="relative mt-4">
        <input
          type={type}
          className={cn(
            "py-2 px-4 mt-2 border-[1px] border-primary rounded-[4px] shadow-md w-full peer focus:outline-none",
            className
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {label && (
          <label
            className={cn(
              "absolute left-4 transition-all duration-300 ease-in-out",
              isActive 
                ? "top-[-10px] left-0 text-[0.8rem] text-primary" 
                : "top-[50%] text-[1rem] text-gray-500 translate-y-[-50%]"
            )}
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
