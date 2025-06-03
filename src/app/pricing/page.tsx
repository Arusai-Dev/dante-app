'use client'

import { Button } from "@/components/ui/button"
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function Pricing() {

    return (
        <div className="flex items-center justify-center text-center h-screen gap-20">
        
            <div className="inline-block align-middle bg-neutral-900 rounded-2xl h-1/2 w-1/6 border-3 border-gray-500/30">
                    <CardHeader className="mt-10">
                        <CardTitle className="text-4xl inline-block">
                            Free Tier
                        </CardTitle>

                        <CardTitle className="text-4xl">
                            $0<p className="text-xs inline-block text-gray-400">/month</p>
                        </CardTitle>

                        <CardDescription></CardDescription>

                    </CardHeader>

                    <CardContent>
                        <ul className="text-left list-disc list-inside">
                            <li>Learn with intelligence models to boost your understanding</li>
                            <li>31 Image to Flashcard usages monthly</li>
                        </ul>
                    </CardContent>

            </div>


            <div className="inline-block align-middle bg-gradient-to-r from-blue-300 to-purple-300 rounded-2xl h-1/2 w-1/6 p-0.5">
                <div className="bg-neutral-900 rounded-2xl h-full w-full px-3 py-2">
                    <CardHeader className="mt-10">
                        <CardTitle className="text-4xl bg-gradient-to-r from-blue-300 to-purple-300 inline-block text-transparent bg-clip-text">
                            Pro
                        </CardTitle>

                        <CardTitle className="text-4xl">$8<p className="text-xs inline-block text-gray-400">/month</p></CardTitle>
                        <CardDescription>Level up your learning with <p className="bg-gradient-to-r from-blue-300 to-purple-300 inline-block text-transparent bg-clip-text">Pro.</p></CardDescription>

                    </CardHeader>

                    <CardContent>
                        <ul className="text-left list-disc list-inside">
                            <li>Gain access to reasoning models for better insight</li>
                            <li>Deeper insights into your learning progress</li>
                            <li>100 Image to Flashcard uses monthly</li>
                            <li>Access to themes</li>
                        </ul>
                    </CardContent>

                <Button variant="outline" className="mt-10 bottom-0 inset-x-0 bg-neutral-900
                    text-white border-purple-300 hover:shadow-2xl hover:shadow-purple-300">
                    Get Started.
                </Button>
                
                </div>

            </div>



            <div 
            className="inline-block align-middle relative rounded-2xl h-1/2 w-1/6 shadow-[0_20px_50px_rgba(59,130,246,0.3),0_10px_25px_rgba(147,51,234,0.2)] hover:shadow-[0_25px_60px_rgba(59,130,246,0.4),0_15px_35px_rgba(147,51,234,0.3)] transition-shadow duration-300"
            style={{
                background: 'linear-gradient(90deg, rgb(129 140 248), rgb(59 130 246), rgb(129 140 248))',
                backgroundSize: '200% 100%',
                animation: 'gradientShift s ease-in-out infinite',
                padding: '2px'
            }}
            >
                <div className="bg-neutral-900 rounded-2xl h-full w-full px-3 py-2">

                    <CardHeader className="mt-10">
                    <CardTitle className="text-4xl bg-gradient-to-r from-blue-300 to-purple-300 inline-block text-transparent bg-clip-text">
                        Ultimate
                    </CardTitle>

                    <CardTitle className="text-4xl">
                        $16<p className="text-xs inline-block text-gray-400">/month</p>
                    </CardTitle>
                    <CardDescription className="text-left">
                        The best and fastest features all times.
                    </CardDescription>
                    </CardHeader>

                    <CardContent>
                    <ul className="text-left list-disc list-inside">
                        <li>Unlimited text Reasoning Intelligence usage</li>
                        <li><p className="inline-block font-extrabold">1000</p> Image to Flashcard uses monthly</li>
                        <li>Fastest processing times for Reasoning Intelligence and Image to Flashcard</li>
                    </ul>
                    </CardContent>
                    <Button variant="outline" className="mt-5 bottom-0 inset-x-0 bg-neutral-900
                    text-white border-blue-300 hover:shadow-2xl hover:shadow-blue-300">
                        Get Started.
                    </Button>     

                </div>
            </div>  




        </div>

    )
}