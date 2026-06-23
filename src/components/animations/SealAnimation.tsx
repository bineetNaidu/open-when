import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Props {
    isPlaying: boolean
    shareUrl: string
    onDone: () => void
}

export default function SealAnimation({ isPlaying, shareUrl, onDone }: Props) {
    const [stage, setStage] = useState<'idle' | 'stacking' | 'sealing' | 'floating' | 'done'>('idle')
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!isPlaying) { setStage('idle'); return }

        setStage('stacking')
        const t1 = setTimeout(() => setStage('sealing'), 900)
        const t2 = setTimeout(() => setStage('floating'), 2000)
        const t3 = setTimeout(() => setStage('done'), 2800)

        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
    }, [isPlaying])

    async function copyLink() {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
    }

    return (
        <AnimatePresence>
            {isPlaying && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center"
                    style={{ backgroundColor: 'rgba(250,248,245,0.96)', backdropFilter: 'blur(8px)' }}
                >
                    {/* Stacking letters */}
                    <AnimatePresence>
                        {stage === 'stacking' && (
                            <motion.div
                                className="relative w-48 h-36"
                                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.4 } }}
                            >
                                {[2, 1, 0].map(i => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: -30 + i * 12, rotate: (i - 1) * 6 }}
                                        animate={{ opacity: 1, y: i * 4, rotate: (i - 1) * 3 }}
                                        transition={{ delay: i * 0.12, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                                        className="absolute inset-0 rounded-xl shadow-md"
                                        style={{
                                            backgroundColor: i === 0 ? 'var(--warm-white)' : i === 1 ? 'var(--ivory)' : 'var(--beige)',
                                            border: '1px solid var(--beige)',
                                        }}
                                    >
                                        {i === 0 && (
                                            <div className="p-4">
                                                <div className="h-2 rounded-full w-3/4 mb-2" style={{ backgroundColor: 'var(--beige)' }} />
                                                <div className="h-2 rounded-full w-1/2 mb-2" style={{ backgroundColor: 'var(--beige)' }} />
                                                <div className="h-2 rounded-full w-2/3" style={{ backgroundColor: 'var(--beige)' }} />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Envelope sealing */}
                    <AnimatePresence>
                        {(stage === 'sealing' || stage === 'floating') && (
                            <motion.div
                                initial={{ scale: 0.6, opacity: 0 }}
                                animate={{
                                    scale: stage === 'floating' ? [1, 1.04, 1] : 1,
                                    opacity: 1,
                                    y: stage === 'floating' ? [0, -8, 0] : 0,
                                }}
                                transition={{
                                    scale: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
                                    opacity: { duration: 0.4 },
                                    y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
                                }}
                                className="relative w-56 h-40"
                            >
                                {/* Envelope body */}
                                <div
                                    className="absolute inset-0 rounded-2xl shadow-2xl"
                                    style={{ backgroundColor: 'var(--envelope-tan)' }}
                                />
                                {/* Flap closed */}
                                <motion.div
                                    initial={{ scaleY: -1 }}
                                    animate={{ scaleY: 1 }}
                                    transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                                    className="absolute top-0 left-0 right-0"
                                    style={{
                                        height: '55%',
                                        background: 'var(--envelope-shadow)',
                                        clipPath: 'polygon(0 0, 100% 0, 50% 65%)',
                                        borderRadius: '16px 16px 0 0',
                                        transformOrigin: 'top',
                                    }}
                                />
                                {/* Bottom fold */}
                                <div
                                    className="absolute bottom-0 left-0 right-0"
                                    style={{
                                        height: '60%',
                                        background: 'var(--envelope-tan)',
                                        clipPath: 'polygon(0 100%, 50% 0, 100% 100%)',
                                    }}
                                />
                                {/* Wax seal */}
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.7, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-10"
                                    style={{ backgroundColor: 'var(--wax-seal)' }}
                                >
                                    <Heart size={14} fill="currentColor" style={{ color: 'var(--cream)' }} />
                                </motion.div>

                                {/* Sparkles */}
                                {stage === 'floating' && (
                                    <>
                                        {[
                                            { x: -30, y: -20, delay: 0 },
                                            { x: 30, y: -25, delay: 0.1 },
                                            { x: -20, y: 20, delay: 0.2 },
                                            { x: 35, y: 15, delay: 0.15 },
                                            { x: 0, y: -35, delay: 0.05 },
                                        ].map((s, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                                                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], x: s.x, y: s.y }}
                                                transition={{ delay: s.delay, duration: 0.9, ease: 'easeOut' }}
                                                className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full"
                                                style={{ backgroundColor: 'var(--dusty-rose)' }}
                                            />
                                        ))}
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Share link */}
                    <AnimatePresence>
                        {stage === 'done' && (
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                                className="flex flex-col items-center gap-5 px-6 text-center"
                            >
                                {/* Still show floating envelope */}
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                                    className="relative w-56 h-40 mb-2"
                                >
                                    <div className="absolute inset-0 rounded-2xl shadow-2xl" style={{ backgroundColor: 'var(--envelope-tan)' }} />
                                    <div className="absolute top-0 left-0 right-0" style={{ height: '55%', background: 'var(--envelope-shadow)', clipPath: 'polygon(0 0, 100% 0, 50% 65%)', borderRadius: '16px 16px 0 0' }} />
                                    <div className="absolute bottom-0 left-0 right-0" style={{ height: '60%', background: 'var(--envelope-tan)', clipPath: 'polygon(0 100%, 50% 0, 100% 100%)' }} />
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-10" style={{ backgroundColor: 'var(--wax-seal)' }}>
                                        <Heart size={14} fill="currentColor" style={{ color: 'var(--cream)' }} />
                                    </div>
                                </motion.div>

                                <p className="font-serif text-2xl italic font-light" style={{ color: 'var(--deep-warm)' }}>
                                    Your letters are sealed
                                </p>
                                <p className="text-xs" style={{ color: 'var(--warm-gray)' }}>
                                    Share this link with someone you love
                                </p>

                                {/* URL box */}
                                <div
                                    className="flex items-center gap-2 w-full max-w-sm rounded-2xl border px-4 py-3"
                                    style={{ backgroundColor: 'var(--warm-white)', borderColor: 'var(--beige)' }}
                                >
                                    <span className="flex-1 text-xs truncate font-mono" style={{ color: 'var(--warm-gray)' }}>
                                        {shareUrl}
                                    </span>
                                    <button
                                        onClick={copyLink}
                                        className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                                        style={{
                                            backgroundColor: copied ? '#e8f5e9' : 'var(--deep-warm)',
                                            color: copied ? '#2e7d32' : 'var(--cream)',
                                        }}
                                    >
                                        {copied ? '✓ Copied' : 'Copy'}
                                    </button>
                                </div>

                                <button
                                    onClick={onDone}
                                    className="text-xs underline underline-offset-4 mt-1"
                                    style={{ color: 'var(--warm-gray)' }}
                                >
                                    Edit letters
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    )
}