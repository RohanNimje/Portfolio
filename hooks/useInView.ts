'use client'

import { useEffect, useRef, useState } from 'react'

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLVideoElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true)
        ref.current?.play().catch(() => {})
      } else {
        setIsInView(false)
        ref.current?.pause()
      }
    }, {
      threshold: 0.5,
      ...options,
    })

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [options])

  return { ref, isInView }
}
