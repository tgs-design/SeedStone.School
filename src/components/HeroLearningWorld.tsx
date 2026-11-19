import { useState } from 'react'
import type { PointerEvent } from 'react'
import heroLearningImage from '../assets/hero-learning.jpg'

export default function HeroLearningWorld() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const bounds = event.currentTarget.getBoundingClientRect()
    setTilt({
      x: ((event.clientY - bounds.top) / bounds.height - 0.5) * -5,
      y: ((event.clientX - bounds.left) / bounds.width - 0.5) * 7,
    })
  }

  return (
    <div
      className="hero-world"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      aria-label="A school-age student learning at home with a teacher on a laptop screen"
      role="img"
    >
      <div className="hero-world-art" style={{ transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
        <img className="hero-world-photo" src={heroLearningImage} alt="" />
        <span className="hero-world-label label-explore">EXPLORE</span>
        <span className="hero-world-label label-learn">LEARN</span>
        <span className="hero-world-label label-practise">PRACTISE</span>
        <span className="hero-world-label label-reflect">REFLECT</span>
      </div>
      <p className="hero-world-caption">A learning journey shaped by curiosity</p>
    </div>
  )
}
