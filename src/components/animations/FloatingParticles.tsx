import { useEffect, useRef } from 'react'

interface Particle {
    x: number
    y: number
    size: number
    speedX: number
    speedY: number
    opacity: number
    opacitySpeed: number
    color: string
    pulse: number
    pulseSpeed: number
}

const COLORS = [
    '139, 120, 100',  // warm brown
    '201, 169, 154',  // dusty rose
    '184, 176, 200',  // muted lavender
    '196, 170, 126',  // envelope tan
    '210, 195, 170',  // light beige
]

export default function FloatingParticles() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animId: number
        const particles: Particle[] = []

        function resize() {
            if (!canvas) return
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        function spawnParticles() {
            // Large slow drifters — very visible
            for (let i = 0; i < 8; i++) {
                particles.push({
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    size: Math.random() * 3 + 2.5,
                    speedX: (Math.random() - 0.5) * 0.12,
                    speedY: -Math.random() * 0.15 - 0.05,
                    opacity: Math.random() * 0.25 + 0.18,
                    opacitySpeed: (Math.random() - 0.5) * 0.004,
                    color: COLORS[Math.floor(Math.random() * COLORS.length)],
                    pulse: Math.random() * Math.PI * 2,
                    pulseSpeed: Math.random() * 0.012 + 0.006,
                })
            }

            // Medium floaters
            for (let i = 0; i < 18; i++) {
                particles.push({
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    size: Math.random() * 2 + 1.2,
                    speedX: (Math.random() - 0.5) * 0.2,
                    speedY: -Math.random() * 0.2 - 0.06,
                    opacity: Math.random() * 0.2 + 0.12,
                    opacitySpeed: (Math.random() - 0.5) * 0.005,
                    color: COLORS[Math.floor(Math.random() * COLORS.length)],
                    pulse: Math.random() * Math.PI * 2,
                    pulseSpeed: Math.random() * 0.018 + 0.008,
                })
            }

            // Small quick sparkles
            for (let i = 0; i < 24; i++) {
                particles.push({
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    size: Math.random() * 1.2 + 0.4,
                    speedX: (Math.random() - 0.5) * 0.3,
                    speedY: -Math.random() * 0.28 - 0.08,
                    opacity: Math.random() * 0.28 + 0.1,
                    opacitySpeed: (Math.random() - 0.5) * 0.008,
                    color: COLORS[Math.floor(Math.random() * COLORS.length)],
                    pulse: Math.random() * Math.PI * 2,
                    pulseSpeed: Math.random() * 0.025 + 0.01,
                })
            }
        }

        function draw() {
            if (!canvas || !ctx) return
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            for (const p of particles) {
                // Movement
                p.x += p.speedX
                p.y += p.speedY

                // Pulse phase
                p.pulse += p.pulseSpeed
                const pulsedOpacity = p.opacity + Math.sin(p.pulse) * 0.08

                // Opacity drift
                p.opacity += p.opacitySpeed
                if (p.opacity <= 0.06) p.opacitySpeed = Math.abs(p.opacitySpeed)
                if (p.opacity >= 0.38) p.opacitySpeed = -Math.abs(p.opacitySpeed)

                // Wrap around edges
                if (p.y < -10) p.y = canvas.height + 10
                if (p.x < -10) p.x = canvas.width + 10
                if (p.x > canvas.width + 10) p.x = -10

                const finalOpacity = Math.max(0, Math.min(1, pulsedOpacity))

                // Draw with soft glow for larger particles
                if (p.size > 2) {
                    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5)
                    gradient.addColorStop(0, `rgba(${p.color}, ${finalOpacity})`)
                    gradient.addColorStop(1, `rgba(${p.color}, 0)`)
                    ctx.beginPath()
                    ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2)
                    ctx.fillStyle = gradient
                    ctx.fill()
                }

                // Core dot
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(${p.color}, ${finalOpacity})`
                ctx.fill()
            }

            animId = requestAnimationFrame(draw)
        }

        resize()
        spawnParticles()
        draw()

        window.addEventListener('resize', resize)
        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            aria-hidden="true"
        />
    )
}