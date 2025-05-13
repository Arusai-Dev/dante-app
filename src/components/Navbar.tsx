"use client"
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { SignedIn, SignedOut, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [responsive, setResponsive] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 0);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={clsx(
            "fixed top-0 left-0 w-full z-50 transition-transform duration-300",
            scrolled ? "bg-[#141414] shadow-md" : "bg-transparent"
        )}>
            <div className="flex items-center justify-between h-[50px] px-4 text-white border-b-1 border-b-[#828282]">
                <div className="text-[16px] font-bold z-[999]">Dante</div>

                {/* Desktop Nav */}
                <ul className="hidden md:flex gap-3 text-md">
                    <Link href="/flashcards/my-sets">My Sets</Link>
                    <Link href="/flashcards/manager">Set Manager</Link>
                    {/* <Link href="/contact">Pricing</Link> */}
                </ul>

                {/* Mobile Toggle Button */}
                <button
                    className="md:hidden text-white z-[999]"
                    onClick={() => setResponsive(!responsive)}
                >
                    {responsive ? <X size={20} /> : <Menu size={20} />}
                </button>

                <div className="hidden md:flex">
                    <SignedIn><UserButton/></SignedIn>

                    <SignedOut><SignUpButton/></SignedOut>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={clsx(
                    "fixed top-0 left-0 w-full h-screen bg-[#141414] flex flex-col items-center justify-center gap-3 text-white text-md transform transition-transform duration-500 ease-in-out lg:hidden",
                    responsive ? "translate-y-0" : "-translate-y-full pointer-events-none"
                )}
            >
                <Link href="/flashcards/my-sets" onClick={() => setResponsive(false)}>
                    My Sets
                </Link>
                <Link href="/flashcards/manager" onClick={() => setResponsive(false)}>
                    Set Manager
                </Link>
                {/* <Link href="/contact" onClick={() => setResponsive(false)}>
                    Pricing
                </Link> */}
            </div>
        </nav>   
    );
}
