/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, useEffect, useRef } from "react";
import { LogOut, Menu, Settings, Settings2, User, User2, X, XIcon } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { SignedIn, SignedOut, SignUpButton, useClerk, UserButton, UserProfile, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function Navbar() {
    // Custom Clerk Menu
    const { user } = useUser()
    const { signOut } = useClerk()
    const [menuOpen, setMenuOpen] = useState(false)
    const [showProfileMenu, setShowProfileMenu] = useState(false)

    const [scrolled, setScrolled] = useState(false);
    const [responsive, setResponsive] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 0);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const pathname = usePathname()

    const hideNavbar = pathname?.startsWith('/flashcards/practice/') || pathname?.startsWith('/flashcards/play/') || pathname?.startsWith('/flashcards/quiz/') 

    if (hideNavbar) return null

    return (
        <nav className={clsx(
            "fixed top-0 left-0 w-screen z-50 transition-transform duration-300 bg-[#141414] "
        )}>
            <div className="flex items-center justify-between h-[50px] px-4 text-white border-b-1 border-b-[#8c8c8c]">
                <Link href="/" className="text-[16px] font-bold z-[999]">Dante</Link>

                {/* Desktop Nav */}
                <ul className="hidden md:flex gap-6 text-md font-semibold">
                    <Link className="hover-animation-text" href="/flashcards/my-sets">My Sets</Link>
                    <Link className="hover-animation-text" href="/flashcards/manager">Set Manager</Link>
                    <Link className="hover-animation-text" href="/explore">Explore</Link>

                    {/* <Link className="hover-animation-text" href="/contact">Pricing</Link> */}
                </ul>

                {/* Mobile Toggle Button */}
                <button
                    className="md:hidden text-white z-[999]"
                    onClick={() => setResponsive(!responsive)}
                >
                    {responsive ? <X size={20} /> : <Menu size={20} />}
                </button>

                <div className="hidden md:flex items-center">
                    <SignedIn>
                        <div className="relative z-3 flex items-center">
                            <button
                                className="relative overflow-hidden cursor-pointer  rounded-full bg-gradient-to-r hover:shadow-lg transition duration-300"
                                onClick={() => setMenuOpen(!menuOpen)}
                            >
                                <span className="absolute inset-0 shine-glint rounded-full z-30 pointer-events-none" />

                                <img
                                    className="relative z-10 w-7 h-7 rounded-full"
                                    alt="Profile Picture"
                                    src={user?.imageUrl}
                                />
                            </button>
                            {menuOpen && (
                                <div className=" absolute w-[368px] flex flex-col justify-center h-fit bg-[#1e1e1e] right-0 top-12 border border-[#8c8c8c] rounded-sm">
                                    <div className="px-4 py-4 flex items-center gap-3 border-b border-[#8c8c8c] pb-4"> 
                                        <img
                                            className="relative z-10 w-7 h-7 rounded-full"
                                            alt="Profile Picture"
                                            src={user?.imageUrl}
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-semibold">{user?.fullName}</span>
                                            <span className="text-[14px]">{user?.primaryEmailAddress?.emailAddress}</span>
                                        </div>
                                    </div>
 
                                    <Link className="group relative overflow-hidden flex items-center px-4 py-4 gap-3 border-b border-[#8c8c8c] " href="/settings" onClick={() => setResponsive(false)}>
                                        <Settings2 className="h-[14px] z-10"/>
                                        <span className="text-[14px] z-10">Settings</span>
                                        <span 
                                            className="absolute inset-0 bg-gradient-to-l from-purple-900 to-purple-600 z-0 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"
                                        />
                                    </Link>

                                    <div 
                                        className="group relative px-4 py-4 flex items-center gap-3 border-b border-[#8c8c8c] cursor-pointer overflow-hidden"
                                        onClick={() => setShowProfileMenu(true)}
                                    > 
                                        <User2 className="h-[14px] z-10" />
                                        <span className="text-[14px] z-10">Profile Management</span>

                                        <span 
                                            className="absolute inset-0 bg-gradient-to-l from-purple-900 to-purple-600 z-0 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"
                                        />
                                    </div>   

                                    <div 
                                        className="group relative px-4 py-4 flex items-center gap-3 border-b border-[#8c8c8c] cursor-pointer overflow-hidden"
                                        onClick={() => signOut()}
                                    > 
                                        <LogOut className="h-[14px] z-10" />
                                        <span className="text-[14px] z-10">Sign Out</span>

                                        <span 
                                            className="absolute inset-0 bg-gradient-to-l from-purple-900 to-purple-600 z-0 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"
                                        />
                                    </div>                             

                                </div>
                            )}
                        </div>

                        {showProfileMenu && (
                            <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                                <div className="relative">
                                    <button 
                                        onClick={() => setShowProfileMenu(false)}
                                        className="absolute top-4 right-5 text-white text-xl z-10 cursor-pointer"
                                    >
                                        <XIcon/>
                                    </button>
                                    <UserProfile routing='hash'/>
                                </div>
                            </div>
                        )}


                    </SignedIn>

                    <SignedOut>
                        <SignUpButton/>
                    </SignedOut>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={clsx(
                    "fixed top-0 left-[50%] w-[50%] h-screen bg-[#141414] border-l-1 border-l-[#828282] flex flex-col items-center justify-center gap-3 text-white text-md transform transition-transform duration-500 ease-in-out lg:hidden",
                    responsive ? "translate-x-0" : "translate-x-full pointer-events-none"
                )}
            >
                <Link href="/flashcards/my-sets" onClick={() => setResponsive(false)}>
                    My Sets
                </Link>
                <Link href="/flashcards/manager" onClick={() => setResponsive(false)}>
                    Set Manager
                </Link>
                <Link href="/explore" onClick={() => setResponsive(false)}>
                    Explore
                </Link>
                {/* <Link href="/contact" onClick={() => setResponsive(false)}>
                    Pricing
                </Link> */}
            </div>
        </nav>   
    );
}
