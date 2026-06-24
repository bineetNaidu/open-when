import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Calendar, Mail, ChevronDown, ArrowLeft, Heart } from 'lucide-react'
import FloatingParticles from '../components/animations/FloatingParticles'
import HelpButton from '../components/HelpButton'

const STEPS = [
  {
    number: '01',
    title: 'You write the letters',
    body: "Sit down and write as many letters as you want. Each one has a title — something like \"Open when you miss me\" or \"Open when today feels heavy.\" You write the message, pick an emoji, and move on to the next one. Nobody sees any of this yet.",
  },
  {
    number: '02',
    title: 'You seal them',
    body: 'When you\'re done, tap "Seal Our Letters." Everything gets bundled together and compressed into a single private link. No account needed. No sign-up. You\'ll see the letters fold into an envelope and a wax seal appear — that means they\'re ready.',
  },
  {
    number: '03',
    title: 'You share the link',
    body: "Copy the link and send it however you like — a text, an email, a DM. The link looks long and messy. That's normal. All your letters are compressed inside it. Only share it with the person it's meant for.",
  },
  {
    number: '04',
    title: 'They open one letter each day',
    body: "When they open the link, a sealed envelope waits for them. They tap it. It opens. One letter slides out — written by you, meant for exactly this moment. Tomorrow, they come back and a different letter opens. No app to download. No account to create.",
  },
  {
    number: '05',
    title: 'They never see all the letters at once',
    body: "This is intentional. They get one letter per day, chosen by the date. The same link on the same day always shows the same letter. The next letter only unlocks the next day.",
  },
]

const FAQS = [
  {
    q: 'Can anyone find my letters by searching online?',
    a: "No. There's no database. There's no search index. Your letters don't exist anywhere except inside that link. Nobody can find them unless you give them the link.",
  },
  {
    q: 'What if I send it to the wrong person by accident?',
    a: "The letters will be readable by whoever opens that link. There's no way to revoke access once the link is shared. If this happens, go back to the create page and make a new link — the old one will still work, but you can stop sharing it.",
  },
  {
    q: "Can I edit the letters after I've shared the link?",
    a: "Not directly. Once the link is created, it's fixed. If you want to change something, go back, rewrite your letters, and seal a new link. Share the new one.",
  },
  {
    q: 'What if I only write one letter?',
    a: "That's completely fine. They'll see the same letter every day. If you want the experience to feel more alive, writing 7 or more letters means a full week of different openings.",
  },
  {
    q: 'Does the link expire?',
    a: "No. The link works forever — as long as the URL hasn't been broken. We recommend they save it somewhere safe, like a notes app or a bookmark.",
  },
  {
    q: "What does 'one letter per day' actually mean?",
    a: "Every day at midnight (on their device's clock), a new letter becomes available. The rotation is based on the date and their specific link — so it's the same letter for everyone who opens that exact link on that exact day.",
  },
  {
    q: 'Can they read ahead?',
    a: "No. The app reveals one letter per day. Part of the magic is not knowing what tomorrow's letter says.",
  },
  {
    q: 'Is this really free?',
    a: "Yes. There's no subscription, no premium tier, no sign-up. It costs nothing because nothing is stored — the whole thing runs in the browser.",
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      layout
      className="rounded-2xl border overflow-hidden"
      style={{
        borderColor: open ? 'var(--dusty-rose)' : 'var(--beige)',
        backgroundColor: 'var(--warm-white)',
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left gap-4"
      >
        <span className="text-sm font-medium" style={{ color: 'var(--deep-warm)' }}>
          {q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0"
          style={{ color: 'var(--warm-gray)' }}
        >
          <ChevronDown size={15} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <p
              className="px-6 pb-5 text-sm leading-7 font-light"
              style={{ color: 'var(--warm-gray)' }}
            >
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function HowItWorksPage() {
  return (
    <div className="relative min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>
      <FloatingParticles />

      <main className="relative z-10 w-full max-w-xl mx-auto px-6 py-20">

        {/* Back link */}
        <motion.a
          href="/"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ x: -3 }}
          className="inline-flex items-center gap-2 text-xs font-medium mb-12"
          style={{ color: 'var(--warm-gray)' }}
        >
          <ArrowLeft size={13} />
          Back to writing
        </motion.a>

        {/* Hero */}
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="h-px w-8" style={{ backgroundColor: 'var(--beige)' }} />
            <span
              className="text-xs tracking-[0.3em] uppercase font-medium"
              style={{ color: 'var(--warm-gray)' }}
            >
              How it works
            </span>
            <div className="h-px w-8" style={{ backgroundColor: 'var(--beige)' }} />
          </div>

          <h1
            className="font-serif font-light italic leading-tight mb-6"
            style={{ color: 'var(--deep-warm)', fontSize: 'clamp(2.2rem, 6vw, 3.5rem)' }}
          >
            A private collection of letters, written by you, opened by someone you love.
          </h1>

          {/* Privacy callout */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex gap-4 p-5 rounded-2xl"
            style={{ backgroundColor: 'var(--warm-white)', border: '1px solid var(--beige)' }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{ backgroundColor: 'var(--cream)', color: 'var(--dusty-rose)' }}
            >
              <Lock size={14} />
            </div>
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--deep-warm)' }}>
                Your letters are completely private
              </p>
              <p className="text-xs leading-relaxed font-light" style={{ color: 'var(--warm-gray)' }}>
                Nothing gets saved to a server or database. The letters live entirely inside the link itself. Think of it like this — the link <em>is</em> the letters. Whoever you share that link with can read them. Nobody else.
              </p>
            </div>
          </motion.div>
        </motion.header>

        {/* Steps */}
        <section className="mb-20">
          <h2
            className="text-xs tracking-[0.25em] uppercase font-medium mb-8"
            style={{ color: 'var(--warm-gray)' }}
          >
            Step by step
          </h2>

          <div className="flex flex-col gap-5">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex gap-5 p-6 rounded-2xl"
                style={{ backgroundColor: 'var(--warm-white)', border: '1px solid var(--beige)' }}
              >
                <span
                  className="font-serif text-2xl font-light italic shrink-0 leading-none mt-0.5"
                  style={{ color: 'var(--dusty-rose)' }}
                >
                  {step.number}
                </span>
                <div>
                  <p className="text-sm font-medium mb-2" style={{ color: 'var(--deep-warm)' }}>
                    {step.title}
                  </p>
                  <p className="text-sm leading-7 font-light" style={{ color: 'var(--warm-gray)' }}>
                    {step.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Quick facts strip */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-3 gap-3 mb-20"
        >
          {[
            { icon: <Lock size={16} />, label: 'Private by design' },
            { icon: <Calendar size={16} />, label: 'One letter per day' },
            { icon: <Mail size={16} />, label: 'No account needed' },
          ].map((fact, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl text-center"
              style={{ backgroundColor: 'var(--warm-white)', border: '1px solid var(--beige)' }}
            >
              <div style={{ color: 'var(--dusty-rose)' }}>{fact.icon}</div>
              <p className="text-xs font-medium leading-snug" style={{ color: 'var(--deep-warm)' }}>
                {fact.label}
              </p>
            </div>
          ))}
        </motion.section>

        {/* FAQ */}
        <section className="mb-20">
          <h2
            className="text-xs tracking-[0.25em] uppercase font-medium mb-8"
            style={{ color: 'var(--warm-gray)' }}
          >
            Questions everyone asks
          </h2>
          <div className="flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ delay: i * 0.04, duration: 0.5 }}
              >
                <FaqItem q={faq.q} a={faq.a} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-12" style={{ backgroundColor: 'var(--beige)' }} />
            <Heart size={12} fill="currentColor" style={{ color: 'var(--dusty-rose)' }} />
            <div className="h-px w-12" style={{ backgroundColor: 'var(--beige)' }} />
          </div>

          <p
            className="font-serif text-2xl italic font-light"
            style={{ color: 'var(--deep-warm)' }}
          >
            Ready to write?
          </p>
          <p className="text-sm" style={{ color: 'var(--warm-gray)' }}>
            It takes about 5 minutes to write your first collection.
          </p>

          <motion.a
            href="/"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="mt-2 inline-flex items-center gap-2 px-10 py-4 rounded-full text-sm font-medium"
            style={{
              backgroundColor: 'var(--deep-warm)',
              color: 'var(--cream)',
              boxShadow: '0 8px 28px rgba(61,53,48,0.18)',
            }}
          >
            <Heart size={13} fill="currentColor" />
            Start writing
          </motion.a>
        </motion.div>

      </main>

      <HelpButton />
    </div>
  )
}