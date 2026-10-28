import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { blogPosts } from '../data/siteData'

export default function BlogDetailPage() {
  const { slug } = useParams()
  const post = blogPosts.find((item) => item.id === slug)

  if (!post) {
    return (
      <section className="page-section">
        <div className="container narrow-section empty-state">
          <h2>Article not found.</h2>
          <Link to="/blogs" className="primary-button">Return to blogs</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="page-section blog-detail-page">
      <div className="container article-shell">
        <Link to="/blogs" className="inline-link back-link"><ArrowLeft size={16} /> Back to blogs</Link>
        <span className="blog-tag">{post.draft ? 'Draft article' : 'Article'}</span>
        <h1>{post.title}</h1>
        <div className="article-meta">
          <span>{post.category}</span>
          <span>{post.readTime}</span>
        </div>
        <div className="article-copy">
          <p>This sample article is illustrative prototype content and has not been approved for publication.</p>
          <p>{post.excerpt}</p>
          <p>When the team has approved final copy, this area can be replaced with a fully researched article, author details, and verified publish dates. For now, the layout remains intentionally editable and clearly marked as draft material.</p>
        </div>
      </div>
    </section>
  )
}
