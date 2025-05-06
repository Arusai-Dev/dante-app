export default function FSRScalculateInterval(q: number, eF: number, r: number) {
    if (q >= 3) { r += 1 }

    let efPrime = eF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (efPrime < 1.3) { efPrime = 1.3 }

    let I:number;

    if (r == 1) {
        I = 1;
    } else if (r >= 2) {
        I = Math.round(1 * efPrime**(r-1));
    }

    return { I, efPrime }
}