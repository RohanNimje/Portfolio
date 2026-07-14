'use client'

import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { portfolioData } from '@/lib/portfolioData'
import { GRADIENT_HEADING } from '@/lib/uiStyles'
import { useState, useEffect, useCallback } from 'react'

const SWIPE_THRESHOLD = 60
const AUTO_PLAY_INTERVAL = 5000

function getRelativePosition(index: number, activeIndex: number, total: number) {
  let diff = index - activeIndex
  if (diff > total / 2) diff -= total
  if (diff < -total / 2) diff += total
  return diff
}

export default function CertificationsCoverFlow() {
  const { certifications } = portfolioData
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)

  const activeCert = certifications[activeIndex]

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % certifications.length)
  }, [certifications.length])

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + certifications.length) % certifications.length)
  }, [certifications.length])

  const pauseAutoPlay = useCallback(() => setAutoPlay(false), [])
  const resumeAutoPlay = useCallback(() => setAutoPlay(true), [])

  // Hydration boundary - CRITICAL for preventing render mismatch
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!autoPlay || !isHydrated) return
    const interval = setInterval(goNext, AUTO_PLAY_INTERVAL)
    return () => clearInterval(interval)
  }, [autoPlay, goNext, isHydrated])

  const handleSwipeEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x <= -SWIPE_THRESHOLD) goNext()
    else if (info.offset.x >= SWIPE_THRESHOLD) goPrev()
  }

  const handleCertClick = (index: number) => {
    setActiveIndex(index)
    pauseAutoPlay()
  }

  return (
    <section className="py-14 md:py-16 px-4 sm:px-6 lg:px-8 bg-[#F7F9FC] relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-6 md:mb-8 text-center"
        >
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-3 ${GRADIENT_HEADING}`}>Certifications</h2>
          <p className="text-sm sm:text-base text-slate-600">Apple-style Cover Flow carousel showcasing professional credentials.</p>
        </motion.div>

        {/* OUTER CAROUSEL CONTAINER - NO OVERFLOW CLIPPING */}
        <div className="group/carousel relative w-full max-w-4xl mx-auto" onMouseLeave={resumeAutoPlay}>
          
          {/* MOTION DRAGGABLE WRAPPER - Pure animation, no sizing constraints */}
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragStart={pauseAutoPlay}
            onDragEnd={handleSwipeEnd}
            className="relative w-full flex items-center justify-center touch-pan-y cursor-grab active:cursor-grabbing"
            style={{
              height: '320px',
              perspective: '1000px',
              WebkitPerspective: '1000px',
              willChange: 'transform',
            }}
          >
            {/* Left navigation button - overlay, not clipping */}
            <button
              type="button"
              aria-label="Previous certification"
              onClick={() => {
                pauseAutoPlay()
                goPrev()
              }}
              className="absolute left-0 top-1/2 z-40 -translate-y-1/2 w-12 sm:w-16 md:w-20 flex items-center justify-start pl-2 sm:pl-3 opacity-0 hover:opacity-100 group-hover/carousel:opacity-60 transition-opacity duration-300"
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/70 border border-slate-200/50 backdrop-blur-sm text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition-all duration-200 shadow-sm">
                <ChevronLeft className="w-5 h-5" />
              </span>
            </button>

            {/* Right navigation button - overlay, not clipping */}
            <button
              type="button"
              aria-label="Next certification"
              onClick={() => {
                pauseAutoPlay()
                goNext()
              }}
              className="absolute right-0 top-1/2 z-40 -translate-y-1/2 w-12 sm:w-16 md:w-20 flex items-center justify-end pr-2 sm:pr-3 opacity-0 hover:opacity-100 group-hover/carousel:opacity-60 transition-opacity duration-300"
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/70 border border-slate-200/50 backdrop-blur-sm text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition-all duration-200 shadow-sm">
                <ChevronRight className="w-5 h-5" />
              </span>
            </button>

            {/* LEFT FADE OVERLAY - No overflow-hidden parent, positioned absolutely at top level */}
            <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-24 md:w-32 bg-gradient-to-r from-[#F7F9FC] via-[#F7F9FC]/50 to-transparent z-20 pointer-events-none" />
            
            {/* RIGHT FADE OVERLAY - No overflow-hidden parent, positioned absolutely at top level */}
            <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-24 md:w-32 bg-gradient-to-l from-[#F7F9FC] via-[#F7F9FC]/50 to-transparent z-20 pointer-events-none" />

            {/* CERTIFICATE CARDS CONTAINER - NO OVERFLOW, PURE POSITIONING */}
            {isHydrated &&
              certifications.map((cert, index) => {
                const position = getRelativePosition(index, activeIndex, certifications.length)
                if (Math.abs(position) > 1) return null

                const isActive = position === 0
                const isLeft = position < 0
                const isRight = position > 0

                return (
                  <motion.div
                    key={cert.id}
                    onClick={() => handleCertClick(index)}
                    onMouseEnter={isActive ? pauseAutoPlay : undefined}
                    onMouseMove={isActive ? pauseAutoPlay : undefined}
                    initial={false}
                    animate={{
                      x: isLeft ? -220 : isRight ? 220 : 0,
                      scale: isActive ? 0.95 : 0.68,
                      opacity: isActive ? 1 : 0.35,
                      zIndex: isActive ? 50 : 20,
                      rotateY: isLeft ? 42 : isRight ? -42 : 0,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 120,
                      damping: 22,
                    }}
                    style={{
                      transformStyle: 'preserve-3d',
                      perspective: '1000px',
                      WebkitTransformStyle: 'preserve-3d',
                      WebkitPerspective: '1000px',
                      willChange: 'transform, opacity',
                    }}
                    className="absolute cursor-pointer"
                  >
                    {/* 
                      STATIC LAYOUT SIZING WRAPPER
                      - Fixed dimensions (no calc/percentage dependencies)
                      - Block display for proper layout
                      - Aspect ratio locked to prevent collapse
                      - No flex, no centering (that breaks height: auto)
                    */}
                    <div
                      className="block bg-white rounded-xl border border-slate-200"
                      style={{
                        width: 'clamp(240px, 76vw, 440px)',
                        aspectRatio: '1.41',
                        display: 'block',
                        position: 'relative',
                        overflow: 'visible',
                      }}
                    >
                      {/* 
                        IMAGE - FORCED BLOCK RENDERING
                        - w-full h-full for maximum fill
                        - object-contain preserves aspect and centers
                        - block display = no inline spacing
                        - visibility: visible OVERRIDE on post-hydration
                      */}
                      <img
                        src={cert.CertImgUrl}
                        alt={cert.name}
                        draggable={false}
                        loading="lazy"
                        decoding="async"
                        className="block w-full h-full object-contain bg-white rounded-[10px]"
                        style={{
                          display: 'block',
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          visibility: 'visible',
                          opacity: 1,
                          backgroundColor: '#ffffff',
                          borderRadius: '10px',
                          boxShadow: isActive
                            ? '0 12px 40px rgba(67, 56, 202, 0.14)'
                            : '0 4px 16px rgba(15, 23, 42, 0.06)',
                          willChange: 'box-shadow',
                          transition: 'box-shadow 0.3s ease',
                        }}
                      />
                    </div>
                  </motion.div>
                )
              })}
          </motion.div>
        </div>

        {/* INFO SECTION - Active certification name and issuer */}
        <div className="mt-8 md:mt-10 space-y-3 text-center">
          <AnimatePresence mode="wait">
            {isHydrated && (
              <motion.div
                key={activeCert?.id || 'empty'}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm sm:text-base md:text-lg font-semibold text-foreground">
                  {activeCert?.name || 'Certifications'}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {activeCert?.issuer || ''}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress indicators */}
          <div className="flex justify-center items-center gap-3 pt-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-accent"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
            />
            <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
              <span className="text-accent">{activeIndex + 1}</span> / {certifications.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
