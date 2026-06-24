import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Lock, Layers, Heart } from 'lucide-react'

interface Props {
  onDone: () => void
}

const SCREENS = [
  {
    icon: <Layers size={28} />,
    title: 'Letters for every moment',
    body: 'Open When lets you write a collection of private letters for someone you love. Each one opens on a different day — automatically.',
    hint: null,
  },
  {
    icon: <Lock size={28} />,
    title: 'Your letters live in the link',
    body: 'Nothing is stored on a server. Your letters are compressed into the share link itself. Only the person you send it to can read them — nobody else, not even us.',
    hint: '💡 Think of the link as the envelope. The letters are inside it.',
  },
  {
    icon: <Heart size={28} />,
    title: 'Write. Seal. Share.',
    body: "Write your letters, tap Seal, and send the link. They'll open one letter each day. Come back tomorrow and a new one appears — no app, no login, no magic required.",
    hint: null,
  },
]

export default function OnboardingModal({ onDone }: Props) {
  const [screen, setScreen] = useState(0)
  const [direction, setDirection] = useState(1)

  function next() {
    if (screen < SCREENS.length - 1) {
      setDirection(1)
      setScreen(s => s + 1)
    } else {
      onDone()
    }
  }

  function goTo(i: number) {
    setDirection(i > screen ? 1 : -1)
    setScreen(i)
  }

  const current = SCREENS[screen]
  const isLast = screen === SCREENS.length - 1

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ backgroundColor: 'rgba(61,53,48,0.35)', backdropFilter: 'blur(6px)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: 'var(--warm-white)' }}
      >
        {/* Skip */}
        <button
          onClick={onDone}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full"
          style={{ color: 'var(--warm-gray)' }}
          aria-label="Skip"
        >
          <X size={15} />
        </button>

        {/* Screen content */}
        <div className="px-8 pt-12 pb-8 min-h-64">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={screen}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col items-center text-center gap-5"
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--cream)', color: 'var(--dusty-rose)' }}
              >
                {current.icon}
              </div>

              {/* Title */}
              <h2
                className="font-serif text-2xl font-light italic leading-snug"
                style={{ color: 'var(--deep-warm)' }}
              >
                {current.title}
              </h2>

              {/* Body */}
              <p
                className="text-sm leading-7 font-light"
                style={{ color: 'var(--warm-gray)' }}
              >
                {current.body}
              </p>

              {/* Hint */}
              {current.hint && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="w-full px-4 py-3 rounded-xl text-xs leading-relaxed font-light text-center"
                  style={{
                    backgroundColor: 'var(--cream)',
                    color: 'var(--warm-gray)',
                    border: '1px solid var(--beige)',
                  }}
                >
                  {current.hint}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div
          className="px-8 pb-8 flex flex-col items-center gap-5"
          style={{ borderTop: '1px solid var(--beige)' }}
        >
          {/* Dot indicators */}
          <div className="flex items-center gap-2 pt-5">
            {SCREENS.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => goTo(i)}
                animate={{
                  scale: i === screen ? 1.4 : 1,
                  backgroundColor:
                    i === screen ? 'var(--dusty-rose)' : 'var(--beige)',
                }}
                transition={{ duration: 0.2 }}
                className="w-1.5 h-1.5 rounded-full"
                aria-label={`Go to screen ${i + 1}`}
              />
            ))}
          </div>

          {/* CTA */}
          <motion.button
            onClick={next}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-medium tracking-wide"
            style={{
              backgroundColor: 'var(--deep-warm)',
              color: 'var(--cream)',
              boxShadow: '0 6px 24px rgba(61,53,48,0.18)',
            }}
          >
            {isLast ? (
              <>
                <Heart size={14} fill="currentColor" />
                Got it — let's write
              </>
            ) : (
              <>
                Continue
                <ArrowRight size={14} />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}