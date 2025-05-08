'use server'

import SM2calculateInterval from "@/lib/sm2";

export default async function Sm2PatchAction(qualityScore, easeFactor, repetition, id, setId) {
    
    const { I, efPrime, r } = SM2calculateInterval(parseInt(qualityScore), easeFactor, repetition);

    const now = new Date();
    const nextReview = new Date(now.setDate(now.getDate() + I));


    await fetch(`http://localhost:3000/api/sm2update/${setId}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Methods": "*", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
            repetition: r,
            easeFactor: efPrime,
            interval: I,
            next_review: nextReview
        })

    })


}