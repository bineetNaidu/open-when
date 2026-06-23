import { useState, useRef } from 'react'
import { Plus, Heart, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
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

// ── Single letter card (expanded or collapsed) ──
interface CardProps {
    letter: Letter
    index: number
    isActive: boolean
    total: number
    onChange: (id: string, field: keyof Letter, value: string) => void
    onDelete: (id: string) => void
    onClick: () => void
}

function LetterCard({ letter, index, isActive, onChange, onDelete, onClick }: CardProps) {
    return (
        <motion.div
            layout
            onClick={!isActive ? onClick : undefined}
            animate={{
                scale: isActive ? 1 : 0.97,
                opacity: isActive ? 1 : 0.72,
            }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full rounded-2xl border overflow-hidden paper-texture"
            style={{
                backgroundColor: 'var(--warm-white)',
                borderColor: isActive ? 'var(--dusty-rose)' : 'var(--beige)',
                cursor: isActive ? 'default' : 'pointer',
                boxShadow: isActive
                    ? '0 8px 32px rgba(61,53,48,0.10)'
                    : '0 2px 8px rgba(61,53,48,0.04)',
            }}
        >
            {/* Card header — always visible */}
            <div
                className="flex items-center gap-3 px-5 py-3.5 border-b"
                style={{ borderColor: 'var(--beige)' }}
            >
                <span className="text-base">{letter.emoji || '✉️'}</span>
                <span
                    className="flex-1 text-sm font-light truncate"
                    style={{ color: letter.title ? 'var(--deep-warm)' : 'var(--warm-gray)' }}
                >
                    {letter.title || `Letter ${index + 1} — untitled`}
                </span>
                {isActive && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={e => { e.stopPropagation(); onDelete(letter.id) }}
                        className="text-xs px-2 py-1 rounded-lg transition-colors hover:bg-red-50"
                        style={{ color: 'var(--warm-gray)' }}
                    >
                        remove
                    </motion.button>
                )}
            </div>

            {/* Expanded body */}
            <AnimatePresence initial={false}>
                {isActive && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="overflow-hidden"
                    >
                        <div className="p-5 flex flex-col gap-4">
                            {/* Emoji + Title row */}
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={letter.emoji ?? ''}
                                    onChange={e => onChange(letter.id, 'emoji', e.target.value)}
                                    placeholder="✉️"
                                    maxLength={2}
                                    className="w-11 text-center text-lg rounded-xl border py-2 bg-transparent outline-none"
                                    style={{ borderColor: 'var(--beige)' }}
                                    aria-label="Emoji"
                                />
                                <input
                                    type="text"
                                    value={letter.title}
                                    onChange={e => onChange(letter.id, 'title', e.target.value)}
                                    placeholder="Open when you miss me…"
                                    className="flex-1 rounded-xl border px-4 py-2 bg-transparent outline-none text-sm font-medium"
                                    style={{ borderColor: 'var(--beige)', color: 'var(--deep-warm)' }}
                                    aria-label="Letter title"
                                    autoFocus
                                />
                            </div>

                            {/* Message */}
                            <textarea
                                value={letter.message}
                                onChange={e => onChange(letter.id, 'message', e.target.value)}
                                placeholder="Write something from the heart…"
                                rows={6}
                                maxLength={1000}
                                className="w-full rounded-xl border px-4 py-3 bg-transparent outline-none text-sm leading-8 font-light"
                                style={{ borderColor: 'var(--beige)', color: 'var(--deep-warm)' }}
                                aria-label="Letter message"
                            />

                            {/* Char count */}
                            <p
                                className="text-right text-xs"
                                style={{
                                    color: letter.message.length > 850 ? 'var(--dusty-rose)' : 'var(--warm-gray)',
                                    opacity: 0.6,
                                }}
                            >
                                {letter.message.length} / 1000
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

// ── Main page ──
export default function CreatePage() {
    const [letters, setLetters] = useState<Letter[]>([
        { id: generateId(), title: '', message: '', emoji: '✉️' }
    ])
    const [activeIndex, setActiveIndex] = useState(0)
    const [senderName, setSenderName] = useState('')
    const [isSealing, setIsSealing] = useState(false)
    const [shareUrl, setShareUrl] = useState('')

    // Swipe tracking
    const dragX = useMotionValue(0)
    const dragOpacity = useTransform(dragX, [-80, 0, 80], [0.6, 1, 0.6])
    const containerRef = useRef<HTMLDivElement>(null)

    function goTo(index: number) {
        setActiveIndex(Math.max(0, Math.min(index, letters.length - 1)))
    }

    function addLetter(title = '') {
        const newId = generateId()
        const newLetter = { id: newId, title, message: '', emoji: '' }
        setLetters(prev => [...prev, newLetter])
        setActiveIndex(letters.length) // go to new card
    }

    function updateLetter(id: string, field: keyof Letter, value: string) {
        setLetters(prev => prev.map(l => (l.id === id ? { ...l, [field]: value } : l)))
    }

    function deleteLetter(id: string) {
        if (letters.length === 1) return // keep at least one
        setLetters(prev => {
            const next = prev.filter(l => l.id !== id)
            setActiveIndex(i => Math.min(i, next.length - 1))
            return next
        })
    }

    function applySuggestion(suggestion: string) {
        // If active card has no title, fill it
        const active = letters[activeIndex]
        if (active && !active.title) {
            updateLetter(active.id, 'title', suggestion)
        } else {
            // Check if any card has no title
            const emptyCard = letters.find(l => !l.title)
            if (emptyCard) {
                const idx = letters.indexOf(emptyCard)
                updateLetter(emptyCard.id, 'title', suggestion)
                setActiveIndex(idx)
            } else {
                addLetter(suggestion)
            }
        }
    }

    function handleSeal() {
        const url = buildShareUrl({ letters, senderName: senderName.trim() || undefined })
        setShareUrl(url)
        setIsSealing(true)
    }

    function handleDragEnd(_: never, info: { offset: { x: number } }) {
        if (info.offset.x < -50 && activeIndex < letters.length - 1) goTo(activeIndex + 1)
        else if (info.offset.x > 50 && activeIndex > 0) goTo(activeIndex - 1)
        dragX.set(0)
    }

    const filledLetters = letters.filter(l => l.title || l.message)
    const isEmpty = filledLetters.length === 0

    return (
        <div className="relative min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>
            <FloatingParticles />

            <main className="relative z-10 w-full max-w-xl mx-auto px-6 py-20">

                {/* ── Header ── */}
                <motion.header
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="text-center mb-14"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.7 }}
                        className="inline-flex items-center gap-2 mb-6"
                    >
                        <div className="h-px w-8" style={{ backgroundColor: 'var(--beige)' }} />
                        <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: 'var(--warm-gray)' }}>
                            A gift of words
                        </span>
                        <div className="h-px w-8" style={{ backgroundColor: 'var(--beige)' }} />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.9 }}
                        className="font-serif font-light italic leading-none mb-5"
                        style={{ color: 'var(--deep-warm)', fontSize: 'clamp(3rem, 8vw, 5rem)' }}
                    >
                        Open When
                    </motion.h1>

                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.55, duration: 1.0 }}
                        className="mx-auto mb-6 h-px w-12"
                        style={{ backgroundColor: 'var(--dusty-rose)', transformOrigin: 'center' }}
                    />

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

                {/* ── Step 1: From ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.7 }}
                    className="mb-10"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
                            style={{ backgroundColor: 'var(--deep-warm)', color: 'var(--cream)' }}
                        >1</div>
                        <label htmlFor="sender" className="text-xs tracking-[0.2em] uppercase font-medium" style={{ color: 'var(--warm-gray)' }}>
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65, duration: 0.7 }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
                            style={{ backgroundColor: 'var(--deep-warm)', color: 'var(--cream)' }}
                        >2</div>
                        <span className="text-xs tracking-[0.2em] uppercase font-medium" style={{ color: 'var(--warm-gray)' }}>
                            Write your letters
                        </span>
                        <span className="ml-auto text-xs" style={{ color: 'var(--warm-gray)', opacity: 0.6 }}>
                            {activeIndex + 1} / {letters.length}
                        </span>
                    </div>

                    {/* ── Suggestion chips ── */}
                    <div
                        className="flex gap-2 overflow-x-auto pb-3 mb-4"
                        style={{ scrollbarWidth: 'none' }}
                    >
                        {SUGGESTIONS.map((s, i) => {
                            const alreadyUsed = letters.some(l => l.title === s)
                            return (
                                <motion.button
                                    key={i}
                                    whileHover={{ scale: 1.03, y: -1 }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => applySuggestion(s)}
                                    disabled={alreadyUsed}
                                    className="shrink-0 px-3 py-1.5 rounded-full border text-xs font-light whitespace-nowrap transition-all"
                                    style={{
                                        borderColor: alreadyUsed ? 'transparent' : 'var(--beige)',
                                        color: alreadyUsed ? 'var(--dusty-rose)' : 'var(--warm-gray)',
                                        backgroundColor: alreadyUsed ? 'rgba(201,169,154,0.12)' : 'var(--warm-white)',
                                        textDecoration: alreadyUsed ? 'line-through' : 'none',
                                        opacity: alreadyUsed ? 0.5 : 1,
                                    }}
                                >
                                    {s}
                                </motion.button>
                            )
                        })}
                    </div>

                    {/* ── Dot indicators ── */}
                    <div className="flex items-center justify-center gap-1.5 mb-4">
                        {letters.map((l, i) => (
                            <motion.button
                                key={l.id}
                                onClick={() => goTo(i)}
                                animate={{
                                    scale: i === activeIndex ? 1.4 : 1,
                                    backgroundColor: i === activeIndex
                                        ? 'var(--dusty-rose)'
                                        : (l.title || l.message) ? 'var(--warm-gray)' : 'var(--beige)',
                                }}
                                transition={{ duration: 0.25 }}
                                className="w-1.5 h-1.5 rounded-full"
                                aria-label={`Go to letter ${i + 1}`}
                            />
                        ))}
                        {/* Add dot */}
                        <motion.button
                            whileHover={{ scale: 1.3 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => addLetter()}
                            className="w-1.5 h-1.5 rounded-full border flex items-center justify-center ml-1"
                            style={{ borderColor: 'var(--beige)' }}
                            aria-label="Add letter"
                        >
                            <Plus size={6} style={{ color: 'var(--warm-gray)' }} />
                        </motion.button>
                    </div>

                    {/* ── Swipeable card stack ── */}
                    <div ref={containerRef} className="relative">
                        {/* Background cards (peek) */}
                        {letters.length > 1 && (
                            <>
                                {activeIndex < letters.length - 1 && (
                                    <div
                                        className="absolute inset-x-0 top-2 rounded-2xl border"
                                        style={{
                                            backgroundColor: 'var(--ivory)',
                                            borderColor: 'var(--beige)',
                                            height: '56px',
                                            transform: 'scale(0.96)',
                                            zIndex: 0,
                                        }}
                                    />
                                )}
                                {activeIndex < letters.length - 2 && (
                                    <div
                                        className="absolute inset-x-0 top-4 rounded-2xl border"
                                        style={{
                                            backgroundColor: 'var(--beige)',
                                            borderColor: 'var(--beige)',
                                            height: '56px',
                                            transform: 'scale(0.92)',
                                            zIndex: 0,
                                        }}
                                    />
                                )}
                            </>
                        )}

                        {/* Active card — swipeable */}
                        <motion.div
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.15}
                            onDragEnd={handleDragEnd}
                            style={{ x: dragX, opacity: dragOpacity, position: 'relative', zIndex: 1 }}
                            className="touch-pan-y"
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={letters[activeIndex]?.id}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }}
                                    transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                                >
                                    {letters[activeIndex] && (
                                        <LetterCard
                                            letter={letters[activeIndex]}
                                            index={activeIndex}
                                            isActive={true}
                                            total={letters.length}
                                            onChange={updateLetter}
                                            onDelete={deleteLetter}
                                            onClick={() => { }}
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* ── Arrow navigation ── */}
                    <div className="flex items-center justify-between mt-4">
                        <motion.button
                            onClick={() => goTo(activeIndex - 1)}
                            disabled={activeIndex === 0}
                            whileHover={activeIndex > 0 ? { scale: 1.05, x: -2 } : {}}
                            whileTap={activeIndex > 0 ? { scale: 0.95 } : {}}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all disabled:opacity-25"
                            style={{ color: 'var(--warm-gray)' }}
                        >
                            <ChevronLeft size={14} />
                            Previous
                        </motion.button>

                        {/* Add letter button */}
                        <motion.button
                            onClick={() => addLetter()}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-medium transition-all"
                            style={{
                                borderColor: 'var(--beige)',
                                color: 'var(--warm-gray)',
                                backgroundColor: 'var(--warm-white)',
                            }}
                        >
                            <Plus size={13} />
                            New letter
                        </motion.button>

                        <motion.button
                            onClick={() => goTo(activeIndex + 1)}
                            disabled={activeIndex === letters.length - 1}
                            whileHover={activeIndex < letters.length - 1 ? { scale: 1.05, x: 2 } : {}}
                            whileTap={activeIndex < letters.length - 1 ? { scale: 0.95 } : {}}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all disabled:opacity-25"
                            style={{ color: 'var(--warm-gray)' }}
                        >
                            Next
                            <ChevronRight size={14} />
                        </motion.button>
                    </div>
                </motion.div>

                {/* ── Divider ── */}
                <div className="my-14 flex items-center gap-4">
                    <div className="flex-1 h-px" style={{ backgroundColor: 'var(--beige)' }} />
                    <Sparkles size={12} style={{ color: 'var(--dusty-rose)' }} />
                    <div className="flex-1 h-px" style={{ backgroundColor: 'var(--beige)' }} />
                </div>

                {/* ── Seal section ── */}
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