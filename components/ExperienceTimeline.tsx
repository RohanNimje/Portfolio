'use client'

import { motion } from 'framer-motion'
import { portfolioData } from '@/lib/portfolioData'
import { ELEVATED_CARD, ELEVATED_CARD_HOVER, GRADIENT_HEADING } from '@/lib/uiStyles'

export default function ExperienceTimeline() {
  const { experience } = portfolioData

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${GRADIENT_HEADING}`}>Experience</h2>
          <p className="text-slate-600">Professional journey and key roles.</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-8"
        >
          {experience.map((job, index) => (
            <motion.div key={job.id} variants={itemVariants} className="relative">
              {index !== experience.length - 1 && (
                <div className="absolute left-8 top-24 w-0.5 h-12 bg-gradient-to-b from-indigo-300 to-transparent" />
              )}

              <div className="flex gap-6 sm:gap-8">
                <div className="hidden sm:flex relative flex-col items-center flex-shrink-0">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-16 h-16 rounded-full border border-indigo-200 bg-white flex items-center justify-center shadow-sm"
                  >
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </motion.div>
                </div>

                <motion.div whileHover={{ x: 4 }} className="flex-1">
                  <div className={`p-6 ${ELEVATED_CARD} ${ELEVATED_CARD_HOVER}`}>
                    <div className="flex sm:hidden gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full border border-indigo-200 bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{job.role}</h3>
                        <p className="text-indigo-600 font-semibold text-sm">{job.company}</p>
                      </div>
                    </div>

                    <div className="hidden sm:flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{job.role}</h3>
                        <p className="text-indigo-600 font-semibold">{job.company}</p>
                      </div>
                      <span className="text-sm text-muted-foreground whitespace-nowrap font-mono">{job.duration}</span>
                    </div>

                    <p className="sm:hidden text-xs text-muted-foreground font-mono mb-2">{job.duration}</p>
                    <p className="text-sm text-muted-foreground mb-2">{job.location}</p>
                    <p className="text-foreground leading-relaxed">{job.description}</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
