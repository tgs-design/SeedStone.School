import { useState } from 'react'
import type { PointerEvent } from 'react'

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
      aria-label="Illustration of a growing idea surrounded by a learning path"
      role="img"
    >
      <div className="hero-world-art" style={{ transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
        <svg viewBox="0 0 560 440" aria-hidden="true" focusable="false">
          <ellipse cx="284" cy="369" rx="211" ry="33" fill="#082B43" opacity=".08" />
          <ellipse cx="284" cy="361" rx="174" ry="28" fill="#FFF0D4" stroke="#082B43" strokeOpacity=".13" />
          <path d="M111 273c34-74 104-117 184-117 76 0 136 37 170 101" fill="none" stroke="#082B43" strokeOpacity=".18" strokeWidth="2" strokeDasharray="5 8" />
          <path d="M120 293c43-61 95-88 159-88 62 0 117 28 158 78" fill="none" stroke="#C41625" strokeOpacity=".35" strokeWidth="2" />
          <circle cx="146" cy="243" r="13" fill="#C41625" />
          <circle cx="429" cy="276" r="9" fill="#082B43" />
          <path d="m281 94 102 59v119l-102 59-103-59V153z" fill="#082B43" />
          <path d="m281 94 102 59-102 60-103-60z" fill="#fff" opacity=".14" />
          <path d="M281 213v118l102-59V153z" fill="#fff" opacity=".07" />
          <path d="M281 200c-2-29-2-54 2-75" fill="none" stroke="#FFF0D4" strokeWidth="7" strokeLinecap="round" />
          <path d="M282 150c-27-4-42-17-48-39 24-1 42 9 50 31M284 137c8-24 25-35 48-37-4 23-19 39-48 45" fill="#FFF0D4" />
          <path d="M212 289c23-19 48-29 70-29 24 0 49 10 72 29" fill="none" stroke="#FFF0D4" strokeOpacity=".58" strokeWidth="3" />
          <path d="m112 120 31-18 31 18v36l-31 18-31-18z" fill="#FFF0D4" stroke="#082B43" strokeOpacity=".13" />
          <path d="m143 102 31 18-31 18-31-18z" fill="#fff" />
          <path d="M143 138v36l31-18v-36z" fill="#082B43" opacity=".12" />
          <path d="m406 95 25-14 25 14v29l-25 14-25-14z" fill="#C41625" />
          <path d="m431 81 25 14-25 15-25-15z" fill="#e55460" />
          <path d="M431 110v28l25-14V95z" fill="#082B43" opacity=".12" />
          <circle cx="102" cy="227" r="4" fill="#C41625" />
          <circle cx="467" cy="193" r="5" fill="#082B43" />
          <path d="M112 365h347" stroke="#082B43" strokeOpacity=".16" strokeWidth="2" />
          <path d="M137 379h294" stroke="#082B43" strokeOpacity=".08" strokeWidth="2" />
        </svg>
        <span className="hero-world-label label-discover">DISCOVER</span>
        <span className="hero-world-label label-practise">PRACTISE</span>
        <span className="hero-world-label label-reflect">REFLECT</span>
      </div>
      <p className="hero-world-caption">A learning journey shaped by curiosity</p>
    </div>
  )
}
