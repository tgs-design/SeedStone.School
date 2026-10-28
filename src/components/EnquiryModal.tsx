import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import EnquiryForm from './EnquiryForm'

type EnquiryModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function EnquiryModal({ isOpen, onClose }: EnquiryModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    modalRef.current?.querySelector<HTMLElement>('input, select, textarea, button')?.focus()

    return () => previouslyFocused?.focus()
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
      aria-describedby="enquiry-modal-description"
      onKeyDown={(event) => {
        if (event.key !== 'Tab' || !modalRef.current) {
          return
        }

        const focusable = modalRef.current.querySelectorAll<HTMLElement>('input:not(:disabled), select:not(:disabled), textarea:not(:disabled), button:not(:disabled)')
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="enquiry-modal" ref={modalRef}>
        <div className="modal-header">
          <div>
            <p className="modal-kicker">Enquiry prototype</p>
            <h3 id="enquiry-modal-title">Prepare an enquiry</h3>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close enquiry form">
            <X size={18} />
          </button>
        </div>
        <p id="enquiry-modal-description" className="modal-copy">Use this form to prepare your enquiry. It does not send your information to a live admissions team.</p>
        <EnquiryForm variant="modal" />
      </div>
    </div>
  )
}
