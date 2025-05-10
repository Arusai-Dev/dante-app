'use server'

import SM2calculateInterval from "@/lib/sm2";
import {createEmptyCard, formatDate, fsrs, generatorParameters, Rating, Grades, FSRS, RecordLog} from 'ts-fsrs';
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

export async function FsrsPatchAction(card, rating) {

    const emptyCard = createEmptyCard();
    const f: FSRS = new FSRS();
    const now = new Date();
    const schedulingCards: RecordLog = f.repeat(emptyCard, now);

    const fsrsCard = { ...card, ...schedulingCards[parseInt(rating)].card };

    console.log(fsrsCard);

    await fetch(`http://localhost:3000/api/fsrs-update/${setId}/${card.cardId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Methods": "*", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
            due: fsrsCard.due,
            stability: fsrsCard.stability,
            difficulty: fsrsCard.difficulty,
            elapsed_days: fsrsCard.elapsed_days,
            scheduled_days: fsrsCard.scheduled_days,
            reps: fsrsCard.reps,
            lapses: fsrsCard.lapses,
            state: fsrsCard.state,
            last_review: fsrsCard.last_review,
        })

    })

}