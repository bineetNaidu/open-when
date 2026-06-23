export interface Letter {
    id: string
    title: string
    message: string
    emoji?: string
}

export interface LetterCollection {
    letters: Letter[]
    senderName?: string
}