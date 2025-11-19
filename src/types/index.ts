export type Card = {
    setId: number
    cardId: number
    category: string
    front: string
    back: string
    imageUrl: string | null
}

export type Set = {
    id: number
    userId: number
    title: string
    description: string
    cards: Card[]
    is_private: boolean
    card_cnt: number
    created_at: Date
    updated_at: Date
    rating: number
    study_count: number
    review_count: number
    tags: []
    category: string
    est_time: null
    conversation_history: []
}

export type CropData = {
    x: number
    y: number
    width: number
    height: number
}