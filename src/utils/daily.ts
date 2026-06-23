import type { Letter } from '../types'

function hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash = hash & hash // convert to 32-bit int
    }
    return Math.abs(hash)
}

function todayString(): string {
    const now = new Date()
    return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`
}

export function getDailyLetter(letters: Letter[], urlData: string): Letter {
    const seed = hashString(urlData + todayString())
    const index = seed % letters.length
    return letters[index]
}