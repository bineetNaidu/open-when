import { useState } from 'react'
import { Plus, Heart, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import LetterCard from '../components/LetterCard'
import FloatingParticles from '../components/animations/FloatingParticles'
import SealAnimation from '../components/animations/SealAnimation'
import { generateId } from '../utils/id'
import { buildShareUrl } from '../utils/url'
import type { Letter } from '../types'

const SUGGESTIONS = [
    "Open when you miss me…",
    "Open when you can't sleep…",
    "Open when you need motivation…",
    "Open when today feels heavy…",
    "Open when you're doubting yourself…",
    "Open when you need a smile…",
    "Open when you feel lonely…",
    "Open when you achieve something…",
]

export default function CreatePage() {
    const [letters, setLetters] = useState<Letter[]>([
        { id: generateId(), title: '', message: '', emoji: '✉️' }
    ])
    const [senderName, setSenderName] = useState('')
    const [isSealing, setIsSealing] = useState(false)
    const [shareUrl, setShareUrl] = useState('')
    const [focusedId, setFocusedId] = useState<string | null>(null)

    function addLetter() {
        const newId = generateId()
        setLetters(prev => [...prev, { id: newId, title: '', message: '', emoji: '' }])
        // Scroll to new card after render
        setTimeout(() => {
            document.getElementById(`letter-${newId}`)?.scrollIntoView({
                behavior: 'smooth', block: 'center'
            })
        }, 100)
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

    const filledLetters = letters.filter(l => l.title || l.message)
    const isEmpty = filledLetters.length === 0
    const progress = Math.min((filledLetters.length / Math.max(letters.length, 1)) * 100, 100)

    return (
        <div className="relative min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>
            <FloatingParticles />

            <main className="relative z-10 w-full max-w-xl mx-auto px-6 py-20">

                {/* ── Hero Header ── */}
                <motion.header
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="text-center mb-16"
                >
                    {/* Eyebrow */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.7 }}
                        className="inline-flex items-center gap-2 mb-6"
                    >
                        <div className="h-px w-8" style={{ backgroundColor: 'var(--beige)' }} />
                        <span
                            className="text-xs tracking-[0.3em] uppercase font-medium"
                            style={{ color: 'var(--warm-gray)' }}
                        >
                            A gift of words
                        </span>
                        <div className="h-px w-8" style={{ backgroundColor: 'var(--beige)' }} />
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.9 }}
                        className="font-serif font-light italic leading-none mb-5"
                        style={{ color: 'var(--deep-warm)', fontSize: 'clamp(3rem, 8vw, 5rem)' }}
                    >
                        Open When
                    </motion.h1>

                    {/* Divider */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.55, duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="mx-auto mb-6 h-px w-12"
                        style={{ backgroundColor: 'var(--dusty-rose)', transformOrigin: 'center' }}
                    />

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.65, duration: 0.8 }}
                        className="text-sm leading-7 max-w-xs mx-auto"
                        style={{ color: 'var(--warm-gray)' }}
                    >
                        Write letters for every moment they might need you.
                        A new one opens every day.
                    </motion.p>
                </motion.header>

                {/* ── Step 1: From field ── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.7 }}
                    className="mb-12"
                >
                    {/* Step label */}
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
                            style={{ backgroundColor: 'var(--deep-warm)', color: 'var(--cream)' }}
                        >
                            1
                        </div>
                        <label
                            htmlFor="sender"
                            className="text-xs tracking-[0.2em] uppercase font-medium"
                            style={{ color: 'var(--warm-gray)' }}
                        >
                            Who is this from?
                        </label>
                    </div>

                    <input
                        id="sender"
                        type="text"
                        value={senderName}
                        onChange={e => setSenderName(e.target.value)}
                        placeholder="Your name…"
                        className="w-full rounded-2xl border px-5 py-4 bg-transparent outline-none text-sm font-light transition-all"
                        style={{
                            borderColor: senderName ? 'var(--dusty-rose)' : 'var(--beige)',
                            backgroundColor: 'var(--warm-white)',
                            color: 'var(--deep-warm)',
                        }}
                    />
                </motion.div>

                {/* ── Step 2: Letters ── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65, duration: 0.7 }}
                    className="mb-4"
                >
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
                                style={{ backgroundColor: 'var(--deep-warm)', color: 'var(--cream)' }}
                            >
                                2
                            </div>
                            <span
                                className="text-xs tracking-[0.2em] uppercase font-medium"
                                style={{ color: 'var(--warm-gray)' }}
                            >
                                Write your letters
                            </span>
                        </div>

                        {/* Progress pill */}
                        <motion.div
                            animate={{ opacity: filledLetters.length > 0 ? 1 : 0.4 }}
                            className="flex items-center gap-2 px-3 py-1 rounded-full border text-xs"
                            style={{ borderColor: 'var(--beige)', color: 'var(--warm-gray)', backgroundColor: 'var(--warm-white)' }}
                        >
                            <div
                                className="w-1.5 h-1.5 rounded-full transition-colors duration-500"
                                style={{ backgroundColor: filledLetters.length > 0 ? 'var(--dusty-rose)' : 'var(--beige)' }}
                            />
                            {filledLetters.length} / {letters.length} filled
                        </motion.div>
                    </div>

                    {/* Progress bar */}
                    <div
                        className="w-full h-0.5 rounded-full mb-6 overflow-hidden"
                        style={{ backgroundColor: 'var(--beige)' }}
                    >
                        <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: 'var(--dusty-rose)' }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                        />
                    </div>
                </motion.div>

                {/* Letter suggestions strip */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.7 }}
                    className="mb-5 -mx-1 flex gap-2 overflow-x-auto pb-2 scrollbar-none"
                    style={{ scrollbarWidth: 'none' }}
                >
                    {SUGGESTIONS.slice(0, 5).map((s, i) => (
                        <motion.button
                            key={i}
                            whileHover={{ scale: 1.03, y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                                // Fill the first empty title
                                const emptyLetter = letters.find(l => !l.title)
                                if (emptyLetter) {
                                    updateLetter(emptyLetter.id, 'title', s)
                                } else {
                                    const newId = generateId()
                                    setLetters(prev => [...prev, { id: newId, title: s, message: '', emoji: '' }])
                                }
                            }}
                            className="shrink-0 px-3 py-1.5 rounded-full border text-xs font-light transition-all whitespace-nowrap"
                            style={{
                                borderColor: 'var(--beige)',
                                color: 'var(--warm-gray)',
                                backgroundColor: 'var(--warm-white)',
                            }}
                        >
                            {s}
                        </motion.button>
                    ))}
                </motion.div>

                {/* ── Letter Cards ── */}
                <section className="flex flex-col gap-4">
                    <AnimatePresence initial={false}>
                        {letters.map((letter, i) => (
                            <motion.div
                                id={`letter-${letter.id}`}
                                key={letter.id}
                                initial={{ opacity: 0, y: 28, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -12, scale: 0.95, transition: { duration: 0.25 } }}
                                transition={{ delay: i * 0.05, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                                onFocus={() => setFocusedId(letter.id)}
                                onBlur={() => setFocusedId(null)}
                                style={{
                                    outline: 'none',
                                    filter: focusedId && focusedId !== letter.id
                                        ? 'opacity(0.55)'
                                        : 'opacity(1)',
                                    transition: 'filter 0.3s ease',
                                }}
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

                {/* ── Add Letter Button ── */}
                <motion.button
                    onClick={addLetter}
                    whileHover={{ scale: 1.01, borderColor: 'var(--dusty-rose)' }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-4 w-full rounded-2xl border-2 border-dashed py-5 flex flex-col items-center justify-center gap-1.5 transition-all group"
                    style={{ borderColor: 'var(--beige)', color: 'var(--warm-gray)' }}
                >
                    <Plus size={16} className="transition-transform group-hover:rotate-90 duration-300" />
                    <span className="text-xs font-medium tracking-wide">Add another letter</span>
                    <span className="text-xs opacity-50 font-light">
                        {SUGGESTIONS[letters.length % SUGGESTIONS.length]}
                    </span>
                </motion.button>

                {/* ── Divider ── */}
                <div className="my-14 flex items-center gap-4">
                    <div className="flex-1 h-px" style={{ backgroundColor: 'var(--beige)' }} />
                    <Sparkles size={12} style={{ color: 'var(--dusty-rose)' }} />
                    <div className="flex-1 h-px" style={{ backgroundColor: 'var(--beige)' }} />
                </div>

                {/* ── Seal Section ── */}
                <div className="flex flex-col items-center gap-4">

                    {/* Readiness message */}
                    <AnimatePresence mode="wait">
                        {isEmpty ? (
                            <motion.p
                                key="empty"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                className="text-xs text-center"
                                style={{ color: 'var(--warm-gray)' }}
                            >
                                Write at least one letter to continue
                            </motion.p>
                        ) : (
                            <motion.p
                                key="ready"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                className="font-serif text-base italic text-center"
                                style={{ color: 'var(--dusty-rose)' }}
                            >
                                {filledLetters.length === 1
                                    ? 'One letter, ready to be opened.'
                                    : `${filledLetters.length} letters, sealed with love.`}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    {/* Seal button */}
                    <motion.button
                        onClick={handleSeal}
                        disabled={isEmpty}
                        whileHover={!isEmpty ? { scale: 1.05, y: -3 } : {}}
                        whileTap={!isEmpty ? { scale: 0.97 } : {}}
                        className="relative inline-flex items-center gap-3 px-12 py-4 rounded-full text-sm font-medium tracking-wide transition-all disabled:opacity-35 disabled:cursor-not-allowed overflow-hidden"
                        style={{
                            backgroundColor: 'var(--deep-warm)',
                            color: 'var(--cream)',
                            boxShadow: isEmpty ? 'none' : '0 8px 32px rgba(61,53,48,0.22)',
                        }}
                    >
                        {/* Shimmer effect on hover */}
                        <motion.div
                            className="absolute inset-0 opacity-0"
                            style={{
                                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)',
                            }}
                            whileHover={{ opacity: 1, x: ['-100%', '100%'] }}
                            transition={{ duration: 0.6 }}
                        />
                        <Heart size={14} fill="currentColor" />
                        <span>Seal Our Letters</span>
                    </motion.button>

                    <p className="text-xs" style={{ color: 'var(--warm-gray)', opacity: 0.7 }}>
                        No account needed · Opens a new letter each day
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