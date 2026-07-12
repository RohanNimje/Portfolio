'use client'

import { motion } from 'framer-motion'
import { portfolioData } from '@/lib/portfolioData'
import { GRADIENT_HEADING, getTechPillClass } from '@/lib/uiStyles'
import MagneticButton from './MagneticButton'

const STACK_PILLS = ['Next.js', 'Supabase', 'MongoDB', 'n8n', 'TypeScript', 'Vercel']

export default function Hero() {
  const { personalInfo } = portfolioData

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 right-0 w-[28rem] h-[28rem] rounded-full bg-indigo-100/70 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-violet-100/50 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(67,56,202,0.07),transparent_55%)]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight ${GRADIENT_HEADING}`}>
              {personalInfo.name}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-mono tracking-wide uppercase leading-relaxed">
              {personalInfo.tagline}
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
            {personalInfo.summary}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {STACK_PILLS.map((tool, i) => (
              <span key={tool} className={getTechPillClass(tool, i)}>
                {tool}
              </span>
            ))}
          </div>

          <div className="pt-2">
            <MagneticButton>Get In Touch</MagneticButton>
          </div>
        </div>

        <div className="relative h-72 sm:h-96 flex items-center justify-center lg:justify-end">
          <div
            className="absolute w-64 sm:w-80 md:w-96 aspect-square rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(67,56,202,0.2) 0%, rgba(139,92,246,0.1) 45%, transparent 70%)',
            }}
          />
          <div className="relative rounded-full p-1.5 bg-white ring-1 ring-slate-200/80 shadow-lg shadow-slate-300/60">
            <div className="rounded-full overflow-hidden aspect-square w-52 sm:w-64 md:w-72 shadow-[0_20px_50px_-12px_rgba(67,56,202,0.25)]">
              <img
                src={personalInfo.profileImages[0]}
                alt={personalInfo.name}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
