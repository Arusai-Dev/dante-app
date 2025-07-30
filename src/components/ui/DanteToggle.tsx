import React from "react";
import type { ReactNode } from "react";
import clsx from "clsx";
import DanteButton from "./DanteButton";

interface DanteToggleProps {
  title: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  variant?: "light" | "dark";
  className?: string;
}

const DanteToggle = ({
  title,
  description,
  value,
  onChange,
  variant = "dark",
  className = "",
}: DanteToggleProps) => {
  const handleToggle = () => {
    onChange(!value);
  };

  return (
    <div className={clsx("flex justify-between", className)}>
      <div>
        <label className={clsx(
          "block text-sm font-medium mb-1",
          variant === "light" ? "text-black" : "text-[#e3e3e3]"
        )}>
          {title}
        </label>
        {description && (
          <label className="block text-[12px] text-[#838383]">
            {description}
          </label>
        )}
      </div>
      <DanteButton
        label={value ? 'On' : 'Off'}
        variant={value ? 'light' : 'dark'}
        onClick={handleToggle}
      />
    </div>
  );
};

export default DanteToggle;