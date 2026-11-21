import heroImage from '../assets/hero-optimized.webp'

export default function HeroLearningWorld() {
  return (
    <figure className="hero-world">
      <div className="hero-world-art">
        <img className="hero-world-photo" src={heroImage} alt="A student learning at home with a laptop" fetchPriority="high" width="1600" height="893" decoding="async" />
      </div>
      <p className="hero-world-caption">A learning journey shaped by curiosity</p>
    </figure>
  )
}
