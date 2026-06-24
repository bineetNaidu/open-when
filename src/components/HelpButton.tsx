import { useState } from 'react'
import { HelpCircle, X, Lock, Calendar, Mail, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function HelpButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Trigger */}
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
        style={{
          backgroundColor: 'var(--warm-white)',
          border: '1px solid var(--beige)',
          color: 'var(--warm-gray)',
        }}
        aria-label="How it works"
      >
        <HelpCircle size={16} />
      </motion.button>

      {/* Tooltip panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed bottom-20 right-6 z-50 w-72 rounded-2xl shadow-2xl p-5 flex flex-col gap-4"
              style={{
                backgroundColor: 'var(--warm-white)',
                border: '1px solid var(--beige)',
              }}
            >
              {/* Close */}
              <div className="flex items-center justify-between">
                <p
                  className="text-xs tracking-[0.2em] uppercase font-medium"
                  style={{ color: 'var(--warm-gray)' }}
                >
                  How it works
                </p>
                <button
                  onClick={() => setOpen(false)}
                  style={{ color: 'var(--warm-gray)' }}
                >
                  <X size={14} />
                </button>
              </div>

              {/* 3 facts */}
              <div className="flex flex-col gap-3">
                {[
                  {
                    icon: <Lock size={13} />,
                    title: 'Private by design',
                    body: 'Your letters live inside the link, not on any server.',
                  },
                  {
                    icon: <Calendar size={13} />,
                    title: 'One letter per day',
                    body: 'The same link opens a different letter each morning.',
                  },
                  {
                    icon: <Mail size={13} />,
                    title: 'No account needed',
                    body: 'Write, seal, share. That\'s it.',
                  },
                ].map((fact, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.3 }}
                    className="flex gap-3 items-start"
                  >
                    <div
                      className="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: 'var(--cream)', color: 'var(--dusty-rose)' }}
                    >
                      {fact.icon}
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--deep-warm)' }}>
                        {fact.title}
                      </p>
                      <p className="text-xs font-light leading-relaxed" style={{ color: 'var(--warm-gray)' }}>
                        {fact.body}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Link to full page */}
              <Link
                to="/how-it-works"
                className="flex items-center gap-1.5 text-xs font-medium pt-3"
                style={{
                  color: 'var(--dusty-rose)',
                  borderTop: '1px solid var(--beige)',
                }}
              >
                Learn more about how it works
                <ArrowRight size={12} />
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}