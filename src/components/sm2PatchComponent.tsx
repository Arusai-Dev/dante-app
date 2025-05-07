import SM2calculateInterval from "@/lib/sm2";

export default async function Sm2PatchComponent({ qualityScore, easeFactor, repetition, id }) {
    
    const { I, efPrime, r } = SM2calculateInterval(parseInt(qualityScore), easeFactor, repetition);

    const now = new Date();
    const nextReview = new Date(now.setDate(now.getDate() + I));

    await fetch(`/api/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            repetition: r,
            easeFactor: efPrime,
            interval: I,
            next_review: nextReview
        })

    })


    return (
        <h1></h1>
    )
}