import { motion } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const reduced = useReducedMotion()

    return (
        <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            {children}
        </motion.div>
    )
}