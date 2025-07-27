import React from "react";
import type { ReactNode } from "react";
import clsx from "clsx";

type CustomButtonProps = {
    label: string;
    icon?: ReactNode;
    variant?: "light" | "dark";
    onClick?: () => void;
    className?: string;
};

const CustomButton: React.FC<CustomButtonProps> = ({
    label,
    icon,
    variant = "dark",
    onClick,
    className = "",
}) => {
    const baseStyles =
        "cursor-pointer w-fit h-[33px] md:h-[40px] py-1 px-6 rounded-[5px] flex items-center gap-2 transition-all duration-300 text-sm md:text-[15px] font-semibold";
    const darkStyles =
        "bg-[#151515] border border-[#404040] text-[#e3e3e3] hover:bg-[#202020] hover:border-[#606060]";
    const lightStyles =
        "bg-white border border-[#cccccc] text-black hover:bg-[#f3f3f3] hover:border-[#aaaaaa]";

    return (
        <button
            onClick={onClick}
            className={clsx(baseStyles, variant === "dark" ? darkStyles : lightStyles, className)}
        >
            {icon && <span className="flex items-center">{icon}</span>}
            <span>{label}</span>
        </button>
    );
};

export default CustomButton;
