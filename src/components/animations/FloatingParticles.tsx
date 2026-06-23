import { useEffect, useRef } from 'react'

interface Particle {
    x: number
    y: number
    size: number
    speedX: number
    speedY: number
    opacity: number
    opacitySpeed: number
}

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
            for (let i = 0; i < 38; i++) {
                particles.push({
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    size: Math.random() * 2 + 0.5,
                    speedX: (Math.random() - 0.5) * 0.18,
                    speedY: -Math.random() * 0.22 - 0.08,
                    opacity: Math.random() * 0.18 + 0.04,
                    opacitySpeed: (Math.random() - 0.5) * 0.003,
                })
            }
        }

        function draw() {
            if (!canvas || !ctx) return
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            for (const p of particles) {
                p.x += p.speedX
                p.y += p.speedY
                p.opacity += p.opacitySpeed

                if (p.opacity <= 0.03) p.opacitySpeed = Math.abs(p.opacitySpeed)
                if (p.opacity >= 0.22) p.opacitySpeed = -Math.abs(p.opacitySpeed)
                if (p.y < -10) p.y = canvas.height + 10
                if (p.x < -10) p.x = canvas.width + 10
                if (p.x > canvas.width + 10) p.x = -10

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(139, 120, 100, ${p.opacity})`
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