'use client'

import type { ReactNode } from 'react'

type ActivityProps = {
  mode: 'visible' | 'hidden'
  children: ReactNode
}

/** Lightweight stand-in for React's experimental Activity API in template demos. */
export function Activity({ mode, children }: ActivityProps) {
  return (
    <div
      style={{ display: mode === 'visible' ? undefined : 'none' }}
      aria-hidden={mode === 'hidden'}
    >
      {children}
    </div>
  )
}
