'use client'

import { useEffect, useRef, useState } from 'react'

type UseScrollSpyOptions = {
  rootMargin?: string
  threshold?: number | number[]
  /** Pause observer updates while smooth-scroll from nav clicks is in progress */
  isPaused?: () => boolean
}

const DEFAULT_ROOT_MARGIN = '-20% 0px -55% 0px'
const DEFAULT_THRESHOLD = [0, 0.15, 0.35, 0.5, 0.75, 1]

/**
 * Tracks which section ID is currently dominant in the viewport.
 * Uses IntersectionObserver ratios so scroll and click navigation stay in sync.
 */
export function useScrollSpy(sectionIds: string[], options: UseScrollSpyOptions = {}) {
  const {
    rootMargin = DEFAULT_ROOT_MARGIN,
    threshold = DEFAULT_THRESHOLD,
    isPaused,
  } = options

  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? '')
  const ratiosRef = useRef<Map<string, number>>(new Map())
  const isPausedRef = useRef(isPaused)
  isPausedRef.current = isPaused

  useEffect(() => {
    if (sectionIds.length === 0) return

    const pickActiveSection = () => {
      if (isPausedRef.current?.()) return

      const ratios = ratiosRef.current
      if (ratios.size === 0) return

      let bestId = sectionIds[0]
      let bestRatio = -1

      for (const id of sectionIds) {
        const ratio = ratios.get(id) ?? 0
        if (ratio > bestRatio) {
          bestRatio = ratio
          bestId = id
        }
      }

      setActiveSection((prev) => (prev === bestId ? prev : bestId))
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id
          if (!id) continue
          ratiosRef.current.set(id, entry.isIntersecting ? entry.intersectionRatio : 0)
        }
        pickActiveSection()
      },
      { rootMargin, threshold }
    )

    for (const id of sectionIds) {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    }

    return () => {
      observer.disconnect()
      ratiosRef.current.clear()
    }
  }, [sectionIds, rootMargin, threshold])

  return activeSection
}
