import heroImage from '../../hero image.png'

export default function HeroLearningWorld() {
  return (
    <figure className="hero-world">
      <div className="hero-world-art">
        <img className="hero-world-photo" src={heroImage} alt="A student learning at home with a laptop" />
      </div>
      <p className="hero-world-caption">A learning journey shaped by curiosity</p>
    </figure>
  )
}
