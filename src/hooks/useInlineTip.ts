import { useState, useEffect } from 'react'

export function useInlineTip(trigger: boolean, delay = 800) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!trigger) { setVisible(false); return }
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [trigger, delay])

  return visible
}