// SM-2 spaced repetition algorithm
// Based on user's rating of question difficulty, calculate how often to repeat/practice said question.
/*

q = Quality of response
eF = Ease Factor 
r = Repetition count

*/

export default function calculateInterval(q: number, eF: number, r: number) {
    let I:number;

    if (q >= 3) {
        if (r == 0) { I = 0 }
        else if (r == 1) { I = 6 }
        else if (r >= 2) {
            I = Math.round( (r-1) * eF )
        }
    }

    r += 1;

    let efPrime = eF = 0.8 + (0.28 * q) - (0.02 * q**2)
    if (efPrime < 1.3) { efPrime = 1.3 }

    return {I, efPrime}
}