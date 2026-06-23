import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useRef } from 'react'

interface Props {
    onOpen: () => void
}

export default function AnimatedEnvelope({ onOpen }: Props) {
    const ref = useRef<HTMLDivElement>(null)

    const rawX = useMotionValue(0)
    const rawY = useMotionValue(0)
    const springX = useSpring(rawX, { stiffness: 80, damping: 20 })
    const springY = useSpring(rawY, { stiffness: 80, damping: 20 })
    const rotateX = useTransform(springY, [-1, 1], [6, -6])
    const rotateY = useTransform(springX, [-1, 1], [-6, 6])

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        rawX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2)
        rawY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2)
    }

    function handleMouseLeave() {
        rawX.set(0)
        rawY.set(0)
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onOpen}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' } }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="relative w-72 h-48 md:w-96 md:h-64 rounded-2xl cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label="Open your letter"
            onKeyDown={e => e.key === 'Enter' && onOpen()}
        >
            {/* Shadow layer */}
            <motion.div
                className="absolute -bottom-4 left-4 right-4 h-8 rounded-full blur-xl"
                style={{ backgroundColor: 'rgba(139,120,100,0.25)' }}
                animate={{ scaleX: [1, 0.92, 1], opacity: [0.35, 0.2, 0.35] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Envelope body */}
            <div
                className="absolute inset-0 rounded-2xl shadow-2xl"
                style={{ backgroundColor: 'var(--envelope-tan)' }}
            />

            {/* Flap */}
            <div
                className="absolute top-0 left-0 right-0"
                style={{
                    height: '55%',
                    background: 'var(--envelope-shadow)',
                    clipPath: 'polygon(0 0, 100% 0, 50% 65%)',
                    borderRadius: '16px 16px 0 0',
                }}
            />

            {/* Bottom V */}
            <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                    height: '60%',
                    background: 'var(--envelope-tan)',
                    clipPath: 'polygon(0 100%, 50% 0, 100% 100%)',
                }}
            />

            {/* Left fold */}
            <div
                className="absolute left-0 top-0 bottom-0"
                style={{
                    width: '52%',
                    background: 'rgba(196,170,126,0.35)',
                    clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
                }}
            />

            {/* Right fold */}
            <div
                className="absolute right-0 top-0 bottom-0"
                style={{
                    width: '52%',
                    background: 'rgba(196,170,126,0.2)',
                    clipPath: 'polygon(100% 0, 0 50%, 100% 100%)',
                }}
            />

            {/* Wax seal */}
            <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center shadow-xl z-10"
                style={{ backgroundColor: 'var(--wax-seal)', translateZ: 20 }}
                animate={{ scale: [1, 1.07, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
                <Heart size={16} fill="currentColor" style={{ color: 'var(--cream)' }} />
            </motion.div>
        </motion.div>
    )
}