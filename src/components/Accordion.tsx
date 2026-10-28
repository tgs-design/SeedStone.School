import { ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'

type AccordionProps = {
  title: string
  content: React.ReactNode
  defaultOpen?: boolean
}

export default function Accordion({ title, content, defaultOpen = false }: AccordionProps) {
  const contentId = useId()
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
      <button className="accordion-trigger" onClick={() => setIsOpen((open) => !open)} type="button" aria-expanded={isOpen} aria-controls={contentId}>
        <span>{title}</span>
        <ChevronDown size={18} />
      </button>
      <div className="accordion-content" id={contentId} hidden={!isOpen}>{content}</div>
    </div>
  )
}
