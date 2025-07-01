export const generateUniqueCardId = (existingIds: number[], max = 100000): number => {
    let cardId;
    const usedIds = new Set(existingIds);

    do {
        cardId = Math.floor(Math.random() * max) + 1;
    } while (usedIds.has(cardId));

    return cardId;
}