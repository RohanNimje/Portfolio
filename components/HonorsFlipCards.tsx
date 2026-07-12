'use client'

import { motion } from 'framer-motion'
import { portfolioData } from '@/lib/portfolioData'
import { useState } from 'react'

export default function HonorsFlipCards() {
  const { honors } = portfolioData
  const [flipped, setFlipped] = useState<{ [key: number]: boolean }>({})

  const toggleFlip = (id: number) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-neon-orange opacity-5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Honors & Achievements</h2>
          <p className="text-muted-foreground">Recognitions from national-level competitions. Hover to flip and reveal details.</p>
        </motion.div>

        {/* Flip Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {honors.map((honor) => (
            <motion.button
              key={honor.id}
              variants={itemVariants}
              onClick={() => toggleFlip(honor.id)}
              className="h-80 cursor-pointer perspective"
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
                {/* Front side */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                  className="absolute inset-0"
                >
                  <div className="w-full h-full rounded-2xl border border-glass-border bg-gradient-to-br from-card/40 to-card/20 backdrop-blur-xl p-6 flex flex-col justify-between hover:border-neon-orange/50 transition-all overflow-hidden group">
                    {/* Glow effect */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ boxShadow: 'inset 0 0 30px rgba(255, 87, 34, 0.2)' }}
                    />

                    <div className="relative z-10 space-y-4">
                      <img
                        src={honor.CertImgUrl}
                        alt={honor.title}
                        className="w-full h-32 object-cover rounded-lg border border-glass-border"
                      />
                      <div>
                        <h3 className="text-lg font-bold text-neon-orange">{honor.title}</h3>
                        <p className="text-sm text-foreground mt-1">{honor.event}</p>
                      </div>
                    </div>

                    <div className="relative z-10 text-neon-teal text-sm font-semibold flex items-center gap-2">
                      Click to reveal <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Back side */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                  className="absolute inset-0"
                >
                  <div className="w-full h-full rounded-2xl border border-glass-border bg-gradient-to-br from-neon-teal/10 to-neon-orange/10 backdrop-blur-xl p-6 flex flex-col justify-between hover:border-neon-teal/50 transition-all">
                    <div className="space-y-3">
                      <p className="text-2xl font-bold text-neon-teal">{honor.title}</p>
                      <div className="w-1 h-8 bg-gradient-to-b from-neon-orange to-neon-teal rounded-full" />
                      <p className="text-foreground leading-relaxed">{honor.description}</p>
                    </div>

                    <div className="text-neon-orange text-sm font-semibold flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Click to flip back
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
