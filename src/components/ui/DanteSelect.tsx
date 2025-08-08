import React from "react";
import type { ReactNode } from "react";
import clsx from "clsx";
import { ArrowDown } from "lucide-react";

interface DanteSelectProps {
  label?: string; 
  icon?: ReactNode; 
  variant?: string;
  onChange?: (value: string) => void;
  className?: string;
  options: Array<string>;
  value?: string;
  placeholder?: string;
}

const DanteSelect = ({
    label,
    icon,
    variant,
    onChange,
    className = "",
    options = [],
    value,
}: DanteSelectProps) => {
  const baseStyles =
    "text-white text-sm cursor-pointer rounded px-3 py-2 appearance-none focus:outline-1 border-[#8c8c8c] border w-full transition-all";
  
  const darkStyles = "bg-[#1c1c1c]";
  
  const lightStyles = "text-black";

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    return (
        <div className="relative">
            {label && (
                <label className={clsx(
                    "block text-sm font-medium mb-1",
                    variant === "dark" ? "text-[#e3e3e3]" : "text-black"
                )}>
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center pointer-events-none z-10">
                        {icon}
                    </span>
                )}
                <select
                    value={value || ""}
                    onChange={handleChange}
                    className={clsx(
                        baseStyles,
                        variant === "light" ? lightStyles : darkStyles,
                        icon && "pl-10", 
                        className
                    )}
                    >
                        {options.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                </select>
                <ArrowDown
                    className={clsx(
                        "absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none",
                        variant === "light" ? "text-black" : "text-white"
                    )}
                />

            </div>
        </div>
    );
};

export default DanteSelect;
