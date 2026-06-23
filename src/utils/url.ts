import LZString from 'lz-string'
import type { LetterCollection } from '../types'

export function encodeCollection(collection: LetterCollection): string {
    const json = JSON.stringify(collection)
    return LZString.compressToEncodedURIComponent(json)
}

export function decodeCollection(param: string): LetterCollection | null {
    try {
        const json = LZString.decompressFromEncodedURIComponent(param)
        if (!json) return null
        const parsed = JSON.parse(json)
        if (!Array.isArray(parsed.letters)) return null
        return parsed as LetterCollection
    } catch {
        return null
    }
}

export function buildShareUrl(collection: LetterCollection): string {
    const encoded = encodeCollection(collection)
    const base = window.location.origin
    return `${base}/open?d=${encoded}`
}