import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { decodeCollection } from '../utils/url'
import type { LetterCollection } from '../types'

export function useLetterCollection(): LetterCollection | null {
    const [searchParams] = useSearchParams()

    return useMemo(() => {
        const data = searchParams.get('d')
        if (!data) return null
        return decodeCollection(data)
    }, [searchParams])
}