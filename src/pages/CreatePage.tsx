import { useState } from 'react'
import { Plus, Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import LetterCard from '../components/LetterCard'
import FloatingParticles from '../components/animations/FloatingParticles'
import SealAnimation from '../components/animations/SealAnimation'
import { generateId } from '../utils/id'
import { buildShareUrl } from '../utils/url'
import type { Letter } from '../types'

export default function CreatePage() {
    const [letters, setLetters] = useState<Letter[]>([
        { id: generateId(), title: '', message: '', emoji: '✉️' }
    ])
    const [senderName, setSenderName] = useState('')
    const [isSealing, setIsSealing] = useState(false)
    const [shareUrl, setShareUrl] = useState('')

    function addLetter() {
        setLetters(prev => [...prev, { id: generateId(), title: '', message: '', emoji: '' }])
    }

    function updateLetter(id: string, field: keyof Letter, value: string) {
        setLetters(prev => prev.map(l => (l.id === id ? { ...l, [field]: value } : l)))
    }

    function deleteLetter(id: string) {
        setLetters(prev => prev.filter(l => l.id !== id))
    }

    function handleSeal() {
        const url = buildShareUrl({ letters, senderName: senderName.trim() || undefined })
        setShareUrl(url)
        setIsSealing(true)
    }

    const isEmpty = letters.every(l => !l.title && !l.message)

    return (
        <div className="relative min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>
            <FloatingParticles />

            <main className="relative z-10 px-5 py-16 max-w-2xl mx-auto">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="text-center mb-14"
                >
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-xs tracking-widest uppercase mb-4 font-medium"
                        style={{ color: 'var(--warm-gray)' }}
                    >
                        A gift of words
                    </motion.p>

                    <h1
                        className="font-serif text-5xl md:text-6xl font-light italic leading-tight mb-3"
                        style={{ color: 'var(--deep-warm)' }}
                    >
                        Open When
                    </h1>

                    {/* Animated underline */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.5, duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="mx-auto mb-5 h-px w-16"
                        style={{ backgroundColor: 'var(--dusty-rose)', transformOrigin: 'center' }}
                    />

                    <p className="text-sm leading-relaxed max-w-sm mx-auto" style={{ color: 'var(--warm-gray)' }}>
                        Write letters for every moment they might need you.
                        <br />A new one opens every day.
                    </p>

                    {/* Letter count badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                        className="inline-flex items-center gap-2 mt-6 px-4 py-1.5 rounded-full border text-xs font-medium"
                        style={{ borderColor: 'var(--beige)', color: 'var(--warm-gray)', backgroundColor: 'var(--warm-white)' }}
                    >
                        <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: 'var(--dusty-rose)' }}
                        />
                        {letters.length} {letters.length === 1 ? 'letter' : 'letters'} written
                    </motion.div>
                </motion.header>

                {/* Sender name */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.7 }}
                    className="mb-10"
                >
                    <label
                        className="block text-xs tracking-widest uppercase mb-2 font-medium"
                        style={{ color: 'var(--warm-gray)' }}
                        htmlFor="sender"
                    >
                        From
                    </label>
                    <input
                        id="sender"
                        type="text"
                        value={senderName}
                        onChange={e => setSenderName(e.target.value)}
                        placeholder="Your name…"
                        className="w-full rounded-2xl border px-5 py-3.5 bg-transparent outline-none text-sm font-light"
                        style={{
                            borderColor: 'var(--beige)',
                            backgroundColor: 'var(--warm-white)',
                            color: 'var(--deep-warm)',
                        }}
                    />
                </motion.div>

                {/* Letters */}
                <section className="flex flex-col gap-5">
                    <AnimatePresence initial={false}>
                        {letters.map((letter, i) => (
                            <motion.div
                                key={letter.id}
                                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.25 } }}
                                transition={{ delay: i * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                            >
                                <LetterCard
                                    letter={letter}
                                    index={i}
                                    onChange={updateLetter}
                                    onDelete={deleteLetter}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </section>

                {/* Add button */}
                <motion.button
                    onClick={addLetter}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6 w-full rounded-2xl border-2 border-dashed py-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                    style={{ borderColor: 'var(--beige)', color: 'var(--warm-gray)' }}
                >
                    <Plus size={16} />
                    Add another letter
                </motion.button>

                {/* Seal */}
                <div className="mt-14 text-center">
                    <motion.button
                        onClick={handleSeal}
                        disabled={isEmpty}
                        whileHover={!isEmpty ? { scale: 1.04, y: -1 } : {}}
                        whileTap={!isEmpty ? { scale: 0.97 } : {}}
                        className="inline-flex items-center gap-3 px-10 py-4 rounded-full text-sm font-medium tracking-wide transition-all disabled:opacity-40"
                        style={{ backgroundColor: 'var(--deep-warm)', color: 'var(--cream)' }}
                    >
                        <Heart size={15} />
                        Seal Our Letters
                    </motion.button>
                    <p className="mt-4 text-xs" style={{ color: 'var(--warm-gray)' }}>
                        Creates a private link — no account needed
                    </p>
                </div>
            </main>

            <SealAnimation
                isPlaying={isSealing}
                shareUrl={shareUrl}
                onDone={() => setIsSealing(false)}
            />
        </div>
    )
}