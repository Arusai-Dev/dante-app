'use server'

import SM2calculateInterval from "@/lib/sm2";
import FSRSCalculateInterval from "@/lib/fsrs";
import {createEmptyCard, formatDate, fsrs, generatorParameters, Rating, Grades} from 'ts-fsrs';


import dayjs from 'dayjs';

export default async function Sm2PatchAction(qualityScore, easeFactor, repetition, id, setId, prevInterval) {
    
    const { I, efPrime, newR } = SM2calculateInterval(parseInt(qualityScore), easeFactor, repetition, prevInterval);

    const dueDate = await dayjs(Date.now()).add(I, 'day').toISOString();

    await fetch(`http://localhost:3000/api/sm2update/${setId}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Methods": "*", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
            repetition: newR,
            easeFactor: efPrime,
            interval: I,
            due_date: dueDate,
        })

    })

    return dueDate

}

export async function FsrsPatchAction(card) {

    const params = generatorParameters({ enable_fuzz: true, enable_short_term: false });
    const f = fsrs(params);
    const emptyCard = createEmptyCard(new Date());

    
    const now = new Date();
    const scheduling_cards = f.repeat(emptyCard, now);
    
    const fsrsCard = { ...card, ...emptyCard };

    await fetch(`http://localhost:3000/api/sm2update/${setId}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Methods": "*", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
            due: fsrsCard.due,
            stability: fsrsCard.stability,
            difficulty: fsrsCard.difficulty,
            elapsed_days: fsrsCard.elapsed_days,
            reps: fsrsCard.reps,
            lapses: fsrsCard.lapses,
            last_review: fsrsCard.last_review,
        })

    })


    return fsrsCard;


}