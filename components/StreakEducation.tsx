'use client'

import { motion, useInView } from 'framer-motion'
import { portfolioData } from '@/lib/portfolioData'
import { ELEVATED_CARD, ELEVATED_CARD_HOVER, GRADIENT_HEADING, getTechPillClass } from '@/lib/uiStyles'
import { useRef, useState, useEffect } from 'react'

export default function StreakEducation() {
  const { streak, education } = portfolioData
  const [displayDays, setDisplayDays] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!isInView) return

    let count = 0
    const target = parseInt(streak.days)
    const increment = Math.ceil(target / 60)

    const interval = setInterval(() => {
      count += increment
      if (count >= target) {
        setDisplayDays(target)
        clearInterval(interval)
      } else {
        setDisplayDays(count)
      }
    }, 10)

    return () => clearInterval(interval)
  }, [isInView, streak.days])

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F7F9FC] relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center"
            >
              <div className="relative w-64 h-64 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 256 256">
                  <circle cx="128" cy="128" r="120" fill="none" stroke="url(#grad)" strokeWidth="2" opacity="0.35" />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4338ca" />
                      <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="relative z-10 text-center space-y-3">
                  <motion.div
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-6xl sm:text-7xl font-bold bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent"
                  >
                    {displayDays}
                  </motion.div>
                  <p className="text-lg font-semibold text-foreground">Day Streak</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">{streak.title}</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">{streak.description}</p>
              </div>

              <div className={`p-6 ${ELEVATED_CARD} space-y-3`}>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2" />
                  <p className="text-foreground">Consistency is the foundation of mastery</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2" />
                  <p className="text-foreground">Every day builds towards excellence</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2" />
                  <p className="text-foreground">One year of dedicated execution</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-20 origin-left"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className={`text-4xl sm:text-5xl font-bold mb-12 text-center ${GRADIENT_HEADING}`}>Education & Foundation</h2>

          <div className="grid md:grid-cols-1 gap-8">
            {education.map((edu) => (
              <motion.div
                key={edu.id}
                whileHover={{ y: -4 }}
                className={`p-8 ${ELEVATED_CARD} ${ELEVATED_CARD_HOVER} group`}
              >
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-1">{edu.degree}</h3>
                      <p className="text-lg text-indigo-600 font-semibold">{edu.institution}</p>
                      <p className="text-sm text-muted-foreground mt-1">{edu.specialization}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-emerald-600 font-bold text-lg">{edu.grade}</p>
                      <p className="text-sm text-muted-foreground">{edu.duration}</p>
                    </div>
                  </div>

                  <p className="text-foreground leading-relaxed">{edu.description}</p>

                  <div className="flex flex-wrap gap-3">
                    {[
                      'Core CS Fundamentals',
                      'Data Structures & Algorithms',
                      'AI/ML Principles',
                      'Full-Stack Development',
                    ].map((highlight, i) => (
                      <span
                        key={i}
                        className={getTechPillClass(highlight, i)}
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
