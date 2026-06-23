import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

interface Props {
    emoji: string
    title: string
    message: string
    senderName?: string
}

export default function LetterReveal({ emoji, title, message, senderName }: Props) {
    const lines = message.split('\n').filter(l => l.trim() !== '')

    return (
        <motion.article
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-lg w-full rounded-3xl shadow-2xl px-8 py-10 md:px-12 md:py-14"
            style={{ backgroundColor: 'var(--warm-white)' }}
        >
            {/* Emoji */}
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                className="text-center mb-6"
            >
                <span className="text-5xl">{emoji || '✉️'}</span>
            </motion.div>

            {/* Title */}
            <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="font-serif text-3xl md:text-4xl font-light italic text-center leading-snug mb-10"
                style={{ color: 'var(--deep-warm)' }}
            >
                {title}
            </motion.h1>

            {/* Divider */}
            <motion.hr
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="mb-10 border-none h-px"
                style={{ backgroundColor: 'var(--beige)', transformOrigin: 'left' }}
            />

            {/* Message lines */}
            <div className="space-y-4">
                {lines.map((line, i) => (
                    <motion.p
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            delay: 0.65 + i * 0.13,
                            duration: 0.65,
                            ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                        className="text-sm leading-8 font-light"
                        style={{ color: 'var(--deep-warm)' }}
                    >
                        {line}
                    </motion.p>
                ))}
            </div>

            {/* Signature */}
            {senderName && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.65 + lines.length * 0.13 + 0.3, duration: 0.8 }}
                    className="mt-8 font-serif italic text-right text-base"
                    style={{ color: 'var(--warm-gray)' }}
                >
                    — {senderName}
                </motion.p>
            )}

            {/* End heart */}
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    delay: 0.65 + lines.length * 0.13 + 0.6,
                    duration: 0.5,
                    ease: [0.34, 1.56, 0.64, 1],
                }}
                className="mt-12 text-center"
            >
                <Heart size={20} fill="currentColor" style={{ color: 'var(--dusty-rose)', display: 'inline-block' }} />
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.65 + lines.length * 0.13 + 1.0, duration: 0.8 }}
                    className="mt-4 text-xs tracking-widest uppercase font-medium"
                    style={{ color: 'var(--warm-gray)' }}
                >
                    Another letter waits for tomorrow
                </motion.p>
            </motion.div>
        </motion.article>
    )
}