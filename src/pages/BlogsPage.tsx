import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { blogPosts } from '../data/siteData'

export default function BlogsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const categories = ['All', ...new Set(blogPosts.map((post) => post.category))]

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesCategory = category === 'All' || post.category === category
      const searchTerm = query.toLowerCase().trim()
      const matchesSearch = !searchTerm || post.title.toLowerCase().includes(searchTerm) || post.excerpt.toLowerCase().includes(searchTerm)
      return matchesCategory && matchesSearch
    })
  }, [category, query])
  const showFeaturedPost = category === 'All' && !query.trim()
  const visiblePosts = showFeaturedPost ? filteredPosts.slice(1) : filteredPosts

  return (
    <>
      <section className="page-section inner-hero">
        <div className="container narrow-section">
          <p className="kicker">Blogs</p>
          <h1>Thoughtful ideas for curious families and growing learners.</h1>
          <p>Articles shown here are sample drafts for the website prototype, not approved school guidance or published announcements.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="container blog-tools">
          <div className="blog-filter-row">
            <div className="filter-chips" aria-label="Blog categories">
              {categories.map((item) => (
                <button type="button" key={item} className={category === item ? 'chip active' : 'chip'} aria-pressed={category === item} onClick={() => setCategory(item)}>
                  {item}
                </button>
              ))}
            </div>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search articles" aria-label="Search blog articles" />
          </div>
        </div>
      </section>

      {showFeaturedPost ? <section className="blog-feature-section">
        <div className="container">
          <article className="feature-article">
            <div className="feature-article-copy">
              <span className="blog-tag">Draft article</span>
              <h2>{blogPosts[0].title}</h2>
              <p>{blogPosts[0].excerpt}</p>
              <Link to={`/blogs/${blogPosts[0].id}`} className="inline-link">Read article</Link>
            </div>
          </article>
        </div>
      </section> : null}

      <section className="page-section">
        <div className="container">
          {visiblePosts.length > 0 ? (
            <div className="blog-grid">
              {visiblePosts.map((post) => (
                <article className="blog-card" key={post.id}>
                  <div className="blog-card-body">
                    <span className="blog-tag">{post.draft ? 'Draft article' : 'Article'}</span>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <div className="blog-foot">
                      <span>{post.readTime}</span>
                      <Link to={`/blogs/${post.id}`}>Read article</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No articles match your search.</h3>
              <p>Try a different keyword or filter setting.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
