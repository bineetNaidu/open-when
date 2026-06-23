import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import AnimatedEnvelope from '../components/animations/AnimatedEnvelope'
import LetterReveal from '../components/animations/LetterReveal'
import FloatingParticles from '../components/animations/FloatingParticles'
import { decodeCollection } from '../utils/url'
import { getDailyLetter } from '../utils/daily'

export default function OpenPage() {
    const [opened, setOpened] = useState(false)
    const [searchParams] = useSearchParams()

    const raw = searchParams.get('d') ?? ''
    const collection = raw ? decodeCollection(raw) : null
    const letter = collection ? getDailyLetter(collection.letters, raw) : null

    // No valid data in URL
    if (!collection || !letter) {
        return (
            <div
                className="relative min-h-screen flex flex-col items-center justify-center px-5 text-center gap-6"
                style={{ backgroundColor: 'var(--cream)' }}
            >
                <FloatingParticles />
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 flex flex-col items-center gap-5"
                >
                    <span className="text-5xl">✉️</span>
                    <p
                        className="font-serif text-3xl italic font-light"
                        style={{ color: 'var(--deep-warm)' }}
                    >
                        No letters found
                    </p>
                    <p className="text-sm max-w-xs leading-relaxed" style={{ color: 'var(--warm-gray)' }}>
                        This link may be incomplete or broken.
                        Ask the sender to share it again.
                    </p>
                    <motion.a
                        href="/"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="mt-2 inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium"
                        style={{ backgroundColor: 'var(--deep-warm)', color: 'var(--cream)' }}
                    >
                        Write your own letters →
                    </motion.a>
                </motion.div>
            </div>
        )
    }

    return (
        <div
            className="relative min-h-screen flex flex-col items-center justify-center px-5 py-16"
            style={{ backgroundColor: 'var(--cream)' }}
        >
            <FloatingParticles />

            <div className="relative z-10 flex flex-col items-center gap-8 w-full">
                {!opened ? (
                    <>
                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-xs tracking-widest uppercase font-medium"
                            style={{ color: 'var(--warm-gray)' }}
                        >
                            {collection.senderName
                                ? `A letter from ${collection.senderName}`
                                : 'A letter for you'}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            <AnimatedEnvelope onOpen={() => setOpened(true)} />
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.9 }}
                            className="text-sm italic font-serif"
                            style={{ color: 'var(--warm-gray)' }}
                        >
                            Tap to open your letter
                        </motion.p>
                    </>
                ) : (
                    <LetterReveal
                        emoji={letter.emoji ?? '✉️'}
                        title={letter.title}
                        message={letter.message}
                        senderName={collection.senderName}
                    />
                )}
            </div>
        </div>
    )
}