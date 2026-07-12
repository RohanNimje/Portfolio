'use client'

import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { portfolioData } from '@/lib/portfolioData'
import { GRADIENT_HEADING } from '@/lib/uiStyles'
import { useState, useEffect, useCallback } from 'react'

const SWIPE_THRESHOLD = 60
const AUTO_PLAY_INTERVAL = 5000

const CERT_IMAGE_CLASS =
  'w-[min(240px,76vw)] sm:w-[min(300px,68vw)] md:w-[min(380px,58vw)] lg:w-[min(440px,52vw)] max-h-[min(200px,30vh)] md:max-h-[min(230px,32vh)] lg:max-h-[min(250px,34vh)] rounded-xl border border-slate-200 aspect-[1.41/1] object-contain bg-white shadow-sm'

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

  const activeCert = certifications[activeIndex]

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % certifications.length)
  }, [certifications.length])

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + certifications.length) % certifications.length)
  }, [certifications.length])

  const pauseAutoPlay = useCallback(() => setAutoPlay(false), [])
  const resumeAutoPlay = useCallback(() => setAutoPlay(true), [])

  useEffect(() => {
    if (!autoPlay) return
    const interval = setInterval(goNext, AUTO_PLAY_INTERVAL)
    return () => clearInterval(interval)
  }, [autoPlay, goNext])

  const handleSwipeEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x <= -SWIPE_THRESHOLD) goNext()
    else if (info.offset.x >= SWIPE_THRESHOLD) goPrev()
  }

  const handleCertClick = (index: number) => {
    setActiveIndex(index)
    pauseAutoPlay()
  }

  return (
    <section className="py-14 md:py-16 px-4 sm:px-6 lg:px-8 bg-[#F7F9FC] relative overflow-hidden">
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

        <div className="group/carousel relative w-full max-w-4xl mx-auto" onMouseLeave={resumeAutoPlay}>
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragStart={pauseAutoPlay}
            onDragEnd={handleSwipeEnd}
            className="relative min-h-[13rem] sm:min-h-[15rem] md:min-h-[16rem] lg:min-h-[17rem] flex items-center justify-center perspective touch-pan-y cursor-grab active:cursor-grabbing"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1/5 bg-gradient-to-r from-background via-background/0 to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-1/5 bg-gradient-to-l from-background via-background/0 to-transparent z-20 pointer-events-none" />

            <button
              type="button"
              aria-label="Previous certification"
              onClick={() => {
                pauseAutoPlay()
                goPrev()
              }}
              className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 md:w-20 z-30 flex items-center justify-start pl-2 sm:pl-3 opacity-0 hover:opacity-100 group-hover/carousel:opacity-60 transition-opacity duration-300"
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-background/70 border border-white/10 backdrop-blur-sm text-foreground/70 hover:text-accent hover:border-accent/40 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </span>
            </button>

            <button
              type="button"
              aria-label="Next certification"
              onClick={() => {
                pauseAutoPlay()
                goNext()
              }}
              className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 md:w-20 z-30 flex items-center justify-end pr-2 sm:pr-3 opacity-0 hover:opacity-100 group-hover/carousel:opacity-60 transition-opacity duration-300"
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-background/70 border border-white/10 backdrop-blur-sm text-foreground/70 hover:text-accent hover:border-accent/40 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </span>
            </button>

            <div className="relative w-full h-full flex items-center justify-center overflow-hidden px-4 sm:px-6 md:px-8">
              {certifications.map((cert, index) => {
                const position = getRelativePosition(index, activeIndex, certifications.length)
                if (Math.abs(position) > 1) return null

                const isActive = position === 0
                const isLeft = position < 0
                const isRight = position > 0

                return (
                  <motion.button
                    key={cert.certImgUrl}
                    type="button"
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
                    style={{ transformStyle: 'preserve-3d' }}
                    className="absolute cursor-pointer max-w-[calc(100%-2rem)]"
                  >
                    <img
                      src={cert.certImgUrl}
                      alt={cert.name}
                      draggable={false}
                      className={CERT_IMAGE_CLASS}
                      style={{
                        boxShadow: isActive
                          ? '0 12px 40px rgba(67, 56, 202, 0.14)'
                          : '0 4px 16px rgba(15, 23, 42, 0.06)',
                      }}
                    />
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </div>

        <div className="mt-4 md:mt-5 space-y-1.5 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCert.certImgUrl}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm sm:text-base md:text-lg font-semibold text-foreground">{activeCert.name}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">{activeCert.issuer}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center items-center gap-3 pt-1">
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
