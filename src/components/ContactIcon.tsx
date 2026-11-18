type ContactIconName = 'phone' | 'telegram' | 'viber'

export function ContactIcon({ name }: { name: ContactIconName }) {
  if (name === 'telegram') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0" aria-hidden="true">
        <path d="M21.5 3.4a1.5 1.5 0 0 0-1.6-.2L2.7 10a1.3 1.3 0 0 0 .1 2.5l4.3 1.4 1.7 5.5c.3.9 1.4 1.1 2 .4l2.6-2.7 4.4 3.2a1.4 1.4 0 0 0 2.2-.9l2.1-14.5a1.5 1.5 0 0 0-.6-1.5ZM9 13.4l8.8-6.5-7.1 8.3-.4 2.3L9 13.4Z" />
      </svg>
    )
  }
  if (name === 'viber') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0" aria-hidden="true">
        <path d="M6.3 4.3A16 16 0 0 1 18 4.2c2 1 3 3.1 3 6.6 0 4-1.1 6.1-4.5 7.1l-4.4.8-3.2 2.2.2-2.5C4.7 17.9 3 15.7 3 11c0-3.4 1-5.6 3.3-6.7Z" />
        <path d="M8 8.5c.2 3.5 3 6.4 6.5 7l1.4-1.5-2.4-1.7-1.1 1c-1.1-.5-2.2-1.6-2.7-2.7l1-1.1L9 7.2 8 8.5ZM13.2 7.5c2 .1 3.3 1.4 3.4 3.4M13.3 5.3c3.2.1 5.4 2.3 5.5 5.5" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0" aria-hidden="true">
      <path d="M6.7 3.3 9.8 6.5 8.1 9c1.5 3 3.8 5.3 6.9 6.9l2.5-1.7 3.2 3.1-1.6 3.1c-.5.9-1.5 1.3-2.5 1-7.1-2-12-6.9-14-14-.3-1 .1-2 1-2.5l3.1-1.6Z" />
    </svg>
  )
}
