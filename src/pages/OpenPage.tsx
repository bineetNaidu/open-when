import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { Calendar, Mail } from 'lucide-react'
import AnimatedEnvelope from '../components/animations/AnimatedEnvelope'
import LetterReveal from '../components/animations/LetterReveal'
import FloatingParticles from '../components/animations/FloatingParticles'
import { decodeCollection } from '../utils/url'
import { getDailyLetter } from '../utils/daily'

function getTodayLabel(): string {
    return new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    })
}

function getDaysUntilNext(): string {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    const hrs = Math.round((tomorrow.getTime() - now.getTime()) / (1000 * 60 * 60))
    if (hrs <= 1) return 'in less than an hour'
    return `in ${hrs} hours`
}

export default function OpenPage() {
    const [stage, setStage] = useState<'envelope' | 'opening' | 'letter'>('envelope')
    const [searchParams] = useSearchParams()
    const [showMeta, setShowMeta] = useState(false)

    const raw = searchParams.get('d') ?? ''
    const collection = raw ? decodeCollection(raw) : null
    const letter = collection ? getDailyLetter(collection.letters, raw) : null

    // Show meta info shortly after letter appears
    useEffect(() => {
        if (stage === 'letter') {
            const t = setTimeout(() => setShowMeta(true), 2200)
            return () => clearTimeout(t)
        }
    }, [stage])

    function handleOpen() {
        setStage('opening')
        setTimeout(() => setStage('letter'), 600)
    }

    // ── Empty state ──
    if (!collection || !letter) {
        return (
            <div
                className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center"
                style={{ backgroundColor: 'var(--cream)' }}
            >
                <FloatingParticles />
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 flex flex-col items-center gap-5"
                >
                    <motion.div
                        animate={{ rotate: [0, -8, 8, -4, 0] }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-5xl"
                    >
                        ✉️
                    </motion.div>
                    <p className="font-serif text-3xl italic font-light" style={{ color: 'var(--deep-warm)' }}>
                        No letters found
                    </p>
                    <p className="text-sm max-w-xs leading-relaxed" style={{ color: 'var(--warm-gray)' }}>
                        This link may be incomplete or broken.
                        Ask the sender to share it again.
                    </p>
                    <motion.a
                        href="/"
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="mt-2 inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-medium"
                        style={{
                            backgroundColor: 'var(--deep-warm)',
                            color: 'var(--cream)',
                            boxShadow: '0 8px 24px rgba(61,53,48,0.18)',
                        }}
                    >
                        Write your own letters →
                    </motion.a>
                </motion.div>
            </div>
        )
    }

    const totalLetters = collection.letters.length

    return (
        <div
            className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20"
            style={{ backgroundColor: 'var(--cream)' }}
        >
            <FloatingParticles />

            {/* ── Top meta bar ── */}
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4"
                style={{ backgroundColor: 'rgba(250,248,245,0.85)', backdropFilter: 'blur(12px)' }}
            >
                {/* Date */}
                <div className="flex items-center gap-2">
                    <Calendar size={12} style={{ color: 'var(--warm-gray)' }} />
                    <span className="text-xs font-medium" style={{ color: 'var(--warm-gray)' }}>
                        {getTodayLabel()}
                    </span>
                </div>

                {/* Collection info */}
                <div className="flex items-center gap-2">
                    <Mail size={12} style={{ color: 'var(--warm-gray)' }} />
                    <span className="text-xs" style={{ color: 'var(--warm-gray)' }}>
                        {totalLetters} {totalLetters === 1 ? 'letter' : 'letters'} waiting
                        {collection.senderName ? ` from ${collection.senderName}` : ''}
                    </span>
                </div>
            </motion.div>

            {/* ── Main content ── */}
            <div className="relative z-10 w-full flex flex-col items-center">
                <AnimatePresence mode="wait">

                    {/* Envelope stage */}
                    {stage === 'envelope' && (
                        <motion.div
                            key="envelope"
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.85, y: -32, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }}
                            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="flex flex-col items-center gap-8"
                        >
                            {/* From label */}
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35, duration: 0.7 }}
                                className="flex flex-col items-center gap-2"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-px w-8" style={{ backgroundColor: 'var(--beige)' }} />
                                    <span
                                        className="text-xs tracking-[0.25em] uppercase font-medium"
                                        style={{ color: 'var(--warm-gray)' }}
                                    >
                                        {collection.senderName
                                            ? `From ${collection.senderName}`
                                            : 'A letter for you'}
                                    </span>
                                    <div className="h-px w-8" style={{ backgroundColor: 'var(--beige)' }} />
                                </div>

                                {/* Today's date context */}
                                <p className="text-xs italic font-serif" style={{ color: 'var(--dusty-rose)' }}>
                                    {getTodayLabel()}
                                </p>
                            </motion.div>

                            {/* Envelope */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.88, y: 16 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                            >
                                <AnimatedEnvelope onOpen={handleOpen} />
                            </motion.div>

                            {/* Tap hint with pulse */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.1, duration: 0.8 }}
                                className="flex flex-col items-center gap-3"
                            >
                                <motion.div
                                    animate={{ y: [0, 6, 0] }}
                                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                                    className="w-px h-6"
                                    style={{ backgroundColor: 'var(--beige)' }}
                                />
                                <p className="text-sm italic font-serif" style={{ color: 'var(--warm-gray)' }}>
                                    Tap to open your letter
                                </p>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Opening transition stage */}
                    {stage === 'opening' && (
                        <motion.div
                            key="opening"
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.6, ease: 'easeInOut' }}
                                className="w-8 h-8 rounded-full border-2"
                                style={{ borderColor: 'var(--dusty-rose)', borderTopColor: 'transparent' }}
                            />
                        </motion.div>
                    )}

                    {/* Letter stage */}
                    {stage === 'letter' && (
                        <motion.div
                            key="letter"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="w-full flex flex-col items-center gap-8"
                        >
                            <LetterReveal
                                emoji={letter.emoji ?? '✉️'}
                                title={letter.title || 'A letter for you'}
                                message={letter.message}
                                senderName={collection.senderName}
                            />

                            {/* Post-letter meta — fades in after reading time */}
                            <AnimatePresence>
                                {showMeta && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                                        className="flex flex-col items-center gap-4 pb-8"
                                    >
                                        {/* Next letter countdown */}
                                        {totalLetters > 1 && (
                                            <div
                                                className="flex items-center gap-3 px-5 py-3 rounded-2xl border text-xs"
                                                style={{
                                                    borderColor: 'var(--beige)',
                                                    backgroundColor: 'var(--warm-white)',
                                                    color: 'var(--warm-gray)',
                                                }}
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--dusty-rose)' }} />
                                                <span>
                                                    Next letter opens <strong>{getDaysUntilNext()}</strong>
                                                </span>
                                            </div>
                                        )}

                                        {/* Letter index context */}
                                        <p className="text-xs" style={{ color: 'var(--warm-gray)', opacity: 0.6 }}>
                                            {totalLetters > 1
                                                ? `${totalLetters} letters in this collection · one each day`
                                                : 'A single letter, written just for you'}
                                        </p>

                                        {/* CTA to create own */}
                                        <motion.a
                                            href="/"
                                            whileHover={{ scale: 1.02, y: -1 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="mt-2 text-xs underline underline-offset-4 font-medium"
                                            style={{ color: 'var(--warm-gray)' }}
                                        >
                                            Write letters for someone you love →
                                        </motion.a>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    )
}