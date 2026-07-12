'use client'

import { motion } from 'framer-motion'
import { portfolioData } from '@/lib/portfolioData'
import { ELEVATED_CARD, ELEVATED_CARD_HOVER, GRADIENT_HEADING } from '@/lib/uiStyles'

export default function ContactFooter() {
  const { contact, personalInfo } = portfolioData

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative border-t border-slate-200/60">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${GRADIENT_HEADING}`}>Let&apos;s Build Together</h2>
          <p className="text-lg text-slate-600">Ready to turn ideas into reality? Let&apos;s connect and create something extraordinary.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">{personalInfo.name}</h3>
              <p className="text-sm text-muted-foreground">{personalInfo.tagline}</p>
            </div>
            <p className="text-sm leading-relaxed text-foreground">{personalInfo.summary}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-lg font-bold text-foreground">Quick Links</h3>
            <nav className="space-y-3">
              {[
                { label: 'Projects', href: '#projects' },
                { label: 'Experience', href: '#experience' },
                { label: 'Honors', href: '#honors' },
                { label: 'Certifications', href: '#certifications' },
              ].map((link, i) => (
                <motion.a
                  key={i}
                  href={link.href}
                  whileHover={{ x: 6 }}
                  className="flex items-center gap-2 text-muted-foreground hover:text-indigo-600 transition-colors text-sm"
                >
                  <div className="w-1 h-1 rounded-full bg-indigo-400" />
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-lg font-bold text-foreground">Connect</h3>

            <motion.a
              href={`mailto:${contact.email}`}
              whileHover={{ scale: 1.02, y: -2 }}
              className={`flex items-start gap-3 p-4 ${ELEVATED_CARD} ${ELEVATED_CARD_HOVER} group`}
            >
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-semibold text-foreground truncate">{contact.email}</p>
              </div>
            </motion.a>

            <div className="flex gap-3">
              <motion.a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-xl border border-border bg-white hover:bg-slate-50 hover:border-blue-200 flex items-center justify-center transition-all shadow-sm"
              >
                <svg className="w-6 h-6 text-slate-600 hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                </svg>
              </motion.a>

              <motion.a
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-xl border border-border bg-white hover:bg-slate-50 hover:border-slate-300 flex items-center justify-center transition-all shadow-sm"
              >
                <svg className="w-6 h-6 text-slate-600 hover:text-slate-900 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </motion.a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="h-px bg-gradient-to-r from-transparent via-border to-transparent mt-16 mb-8 origin-left"
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          viewport={{ once: true }}
          className="text-center space-y-2"
        >
          <p className="text-sm text-muted-foreground">Crafted with precision. Built to perform.</p>
          <p className="text-xs text-muted-foreground/60">© 2026 {personalInfo.name}. All rights reserved.</p>
        </motion.div>
      </div>
    </section>
  )
}
