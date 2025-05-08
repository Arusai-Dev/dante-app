// SM-2 spaced repetition algorithm
// Based on user's rating of question difficulty, calculate how often to repeat/practice said question.
/*

q = Quality of response
eF = Ease Factor 
r = Repetition count

*/

export default function SM2calculateInterval(q: number, eF: number, r: number, prevInterval: number) {
    let I: number;
    let efPrime:number; 
    let newR:number;

    if (q >= 3) {
        if (r == 0) {
            I = 1;
            newR = 1;
        } else if (r == 1) {
            I = 6;
            newR = 2;
        } else {
            I = Math.round(prevInterval * eF)
            newR = r +=1;
        }
    } else {
        I = 1;
        newR = 0;
    }

    efPrime = eF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (efPrime < 1.3) efPrime = 1.3;

    return { I, efPrime, newR }

}

