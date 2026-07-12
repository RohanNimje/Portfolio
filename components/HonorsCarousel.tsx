'use client'

import { motion, useMotionValue, animate, type PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { portfolioData } from '@/lib/portfolioData'
import { GRADIENT_HEADING } from '@/lib/uiStyles'
import { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react'

const CARD_WIDTH = 288
const CARD_GAP = 32
const ITEM_STRIDE = CARD_WIDTH + CARD_GAP
const SWIPE_THRESHOLD = 60
const DESKTOP_BREAKPOINT = 768
const CENTER_PADDING = `calc(50% - ${CARD_WIDTH / 2}px)`

/** Desktop starts on the middle card (index 1); mobile starts at the beginning (index 0). */
function getResponsiveStartIndex(honorsCount: number): number {
  if (honorsCount <= 1) return 0
  if (typeof window === 'undefined') return 0
  return window.innerWidth >= DESKTOP_BREAKPOINT ? Math.min(1, honorsCount - 1) : 0
}

export default function HonorsCarousel() {
  const { honors } = portfolioData
  const [flipped, setFlipped] = useState<{ [key: number]: boolean }>({})
  const [activeIndex, setActiveIndex] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const skipAnimatedSnap = useRef(true)
  const x = useMotionValue(0)

  const toggleFlip = (id: number) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const goNext = () => setActiveIndex((prev) => Math.min(prev + 1, honors.length - 1))
  const goPrev = () => setActiveIndex((prev) => Math.max(prev - 1, 0))

  const snapToIndex = useCallback(
    (index: number, instant = false) => {
      const target = -index * ITEM_STRIDE
      if (instant) {
        x.set(target)
        return
      }
      animate(x, target, { type: 'spring', stiffness: 260, damping: 30 })
    },
    [x]
  )

  // Set responsive starting index before first paint
  useLayoutEffect(() => {
    const startIndex = getResponsiveStartIndex(honors.length)
    setActiveIndex(startIndex)
    snapToIndex(startIndex, true)
    setIsReady(true)
  }, [honors.length, snapToIndex])

  useEffect(() => {
    if (!isReady) return
    if (skipAnimatedSnap.current) {
      skipAnimatedSnap.current = false
      return
    }
    snapToIndex(activeIndex)
  }, [activeIndex, isReady, snapToIndex])

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x <= -SWIPE_THRESHOLD) goNext()
    else if (info.offset.x >= SWIPE_THRESHOLD) goPrev()
    else snapToIndex(activeIndex)
  }

  const maxDragLeft = -(honors.length - 1) * ITEM_STRIDE
  const activeHonor = honors[activeIndex]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-indigo-100/40 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${GRADIENT_HEADING}`}>Honors & Achievements</h2>
          <p className="text-slate-600">Recognitions from national-level competitions.</p>
        </motion.div>

        <div
          className={`group/carousel relative overflow-hidden transition-opacity duration-200 ${isReady ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

          <button
            type="button"
            aria-label="Previous honor"
            onClick={goPrev}
            disabled={activeIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 sm:w-16 h-40 z-30 flex items-center justify-start pl-1 sm:pl-2 opacity-0 hover:opacity-100 group-hover/carousel:opacity-60 transition-opacity duration-300 disabled:pointer-events-none disabled:opacity-0"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-background/70 border border-white/10 backdrop-blur-sm text-foreground/70 hover:text-accent hover:border-accent/40 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </span>
          </button>

          <button
            type="button"
            aria-label="Next honor"
            onClick={goNext}
            disabled={activeIndex === honors.length - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 sm:w-16 h-40 z-30 flex items-center justify-end pr-1 sm:pr-2 opacity-0 hover:opacity-100 group-hover/carousel:opacity-60 transition-opacity duration-300 disabled:pointer-events-none disabled:opacity-0"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-background/70 border border-white/10 backdrop-blur-sm text-foreground/70 hover:text-accent hover:border-accent/40 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </span>
          </button>

          <motion.div
            drag="x"
            dragConstraints={{ left: maxDragLeft, right: 0 }}
            dragElastic={0.12}
            style={{ x, paddingLeft: CENTER_PADDING, paddingRight: CENTER_PADDING }}
            onDragEnd={handleDragEnd}
            className="flex gap-8 cursor-grab active:cursor-grabbing touch-pan-y py-2 w-max"
          >
            {honors.map((honor, index) => {
              const isActive = index === activeIndex
              return (
                <div
                  key={honor.id}
                  className="flex-shrink-0 flex flex-col items-center"
                  style={{ width: CARD_WIDTH }}
                >
                  <motion.button
                    type="button"
                    onClick={() => toggleFlip(honor.id)}
                    animate={{
                      scale: isActive ? 1 : 0.88,
                      opacity: isActive ? 1 : 0.55,
                    }}
                    transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                    whileHover={isActive ? { y: -4 } : {}}
                    className="w-72 h-80 cursor-pointer perspective"
                  >
                    <motion.div
                      animate={{ rotateY: flipped[honor.id] ? 180 : 0 }}
                      transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: `rotateY(${flipped[honor.id] ? 180 : 0}deg)`,
                      }}
                      className="w-full h-full relative"
                    >
                      <div
                        style={{
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                        }}
                        className="absolute inset-0 group"
                      >
                        <img
                          src={honor.CertImgUrl}
                          alt={honor.title}
                          className="w-full h-full rounded-2xl border border-slate-200 object-contain group-hover:border-indigo-200 transition-all shadow-sm"
                          style={{
                            boxShadow: isActive
                              ? '0 8px 32px rgba(67, 56, 202, 0.12)'
                              : '0 2px 12px rgba(15, 23, 42, 0.06)',
                          }}
                          loading={isActive ? 'eager' : 'lazy'}
                          draggable={false}
                        />

                        <div className="absolute bottom-4 right-4 z-10 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full flex items-center gap-1.5 text-xs font-semibold text-indigo-700 group-hover:bg-indigo-100 transition-all">
                          <span>Click to Flip</span>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4v12m6-16v12m0 0l4-4m-4 4l-4-4" />
                          </svg>
                        </div>
                      </div>

                      <div
                        style={{
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                        }}
                        className="absolute inset-0"
                      >
                        <div className="w-full h-full rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50/80 to-white p-6 flex flex-col justify-between hover:border-indigo-200 transition-all shadow-sm">
                          <div className="space-y-3">
                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">{honor.event}</p>
                            <div className="w-1 h-5 bg-gradient-to-b from-accent to-foreground rounded-full" />
                            <p className="text-xs text-foreground leading-relaxed">{honor.description}</p>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs font-semibold text-accent">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4v12m6-16v12m0 0l4-4m-4 4l-4-4" />
                            </svg>
                            <span>Click to flip</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.button>
                </div>
              )
            })}
          </motion.div>
        </div>

        <div className="mt-5 space-y-3 text-center">
          <motion.h3
            key={activeHonor.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-base sm:text-lg font-bold text-foreground px-4"
          >
            {activeHonor.title}
          </motion.h3>

          <div className="flex justify-center items-center gap-2">
            {honors.map((honor, index) => (
              <button
                key={honor.id}
                type="button"
                aria-label={`Go to honor ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : undefined}
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'w-6 bg-accent' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
