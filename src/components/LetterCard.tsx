import { Trash2, GripVertical } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Letter } from '../types'

interface Props {
    letter: Letter
    index: number
    onChange: (id: string, field: keyof Letter, value: string) => void
    onDelete: (id: string) => void
}

export default function LetterCard({ letter, index, onChange, onDelete }: Props) {
    return (
        <motion.div
            whileHover={{ y: -2, boxShadow: '0 8px 32px rgba(61,53,48,0.08)' }}
            transition={{ duration: 0.2 }}
            className="relative rounded-2xl border p-6 shadow-sm paper-texture"
            style={{ backgroundColor: 'var(--warm-white)', borderColor: 'var(--beige)' }}
        >
            {/* Header row */}
            <div className="flex items-center gap-3 mb-5">
                <GripVertical size={16} style={{ color: 'var(--warm-gray)' }} className="cursor-grab" />
                <span className="font-serif text-sm italic" style={{ color: 'var(--warm-gray)' }}>
                    Letter {index + 1}
                </span>
                <motion.button
                    onClick={() => onDelete(letter.id)}
                    whileHover={{ scale: 1.1, color: '#e53e3e' }}
                    whileTap={{ scale: 0.9 }}
                    className="ml-auto p-1.5 rounded-lg transition-colors"
                    style={{ color: 'var(--warm-gray)' }}
                    aria-label="Delete letter"
                >
                    <Trash2 size={15} />
                </motion.button>
            </div>

            {/* Emoji + Title */}
            <div className="flex gap-3 mb-4">
                <input
                    type="text"
                    value={letter.emoji ?? ''}
                    onChange={e => onChange(letter.id, 'emoji', e.target.value)}
                    placeholder="✉️"
                    maxLength={2}
                    className="w-12 text-center text-xl rounded-xl border py-2 bg-transparent outline-none transition-colors"
                    style={{ borderColor: 'var(--beige)', color: 'var(--deep-warm)' }}
                    aria-label="Emoji"
                />
                <input
                    type="text"
                    value={letter.title}
                    onChange={e => onChange(letter.id, 'title', e.target.value)}
                    placeholder="Open when you miss me…"
                    className="flex-1 rounded-xl border px-4 py-2 bg-transparent outline-none text-sm font-medium transition-colors"
                    style={{ borderColor: 'var(--beige)', color: 'var(--deep-warm)' }}
                    aria-label="Letter title"
                />
            </div>

            {/* Message */}
            <textarea
                value={letter.message}
                onChange={e => onChange(letter.id, 'message', e.target.value)}
                placeholder="Write something from the heart…"
                rows={5}
                maxLength={1000}
                className="w-full rounded-xl border px-4 py-3 bg-transparent outline-none text-sm leading-8 font-light transition-colors"
                style={{ borderColor: 'var(--beige)', color: 'var(--deep-warm)' }}
                aria-label="Letter message"
            />

            {/* Character count */}
            <p
                className="mt-2 text-right text-xs"
                style={{ color: letter.message.length > 800 ? 'var(--dusty-rose)' : 'var(--warm-gray)', opacity: 0.7 }}
            >
                {letter.message.length} / 1000
            </p>
        </motion.div>
    )
}