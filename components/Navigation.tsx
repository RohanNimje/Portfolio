'use client'

import { motion } from 'framer-motion'
import { useCallback, useRef, useState } from 'react'
import { Home, Briefcase, Zap, Trophy, GraduationCap, Mail } from 'lucide-react'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { GHOST_BUTTON, PRIMARY_BUTTON } from '@/lib/uiStyles'

const NAV_SECTION_IDS = ['hero', 'projects', 'experience', 'honors', 'certifications', 'contact'] as const
const CLICK_SCROLL_LOCK_MS = 900

export default function Navigation() {
  const isClickScrollingRef = useRef(false)
  const clickScrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [clickedSection, setClickedSection] = useState<string | null>(null)

  const isPaused = useCallback(() => isClickScrollingRef.current, [])

  const spySection = useScrollSpy([...NAV_SECTION_IDS], { isPaused })
  const activeSection = clickedSection ?? spySection

  const navItems = [
    { id: 'hero', label: 'Home', icon: Home },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'experience', label: 'Experience', icon: Zap },
    { id: 'honors', label: 'Honors', icon: Trophy },
    { id: 'certifications', label: 'Certifications', icon: GraduationCap },
  ]

  const scrollToSection = (id: string) => {
    if (clickScrollTimerRef.current) {
      clearTimeout(clickScrollTimerRef.current)
    }

    setClickedSection(id)
    isClickScrollingRef.current = true

    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    clickScrollTimerRef.current = setTimeout(() => {
      isClickScrollingRef.current = false
      setClickedSection(null)
      clickScrollTimerRef.current = null
    }, CLICK_SCROLL_LOCK_MS)
  }

  return (
    <>
      {/* Desktop — top floating pill nav */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex fixed top-0 left-0 right-0 z-40 justify-center pt-5 px-4 w-full"
      >
        <div className="border border-slate-200/60 rounded-full px-6 py-3 bg-white shadow-lg shadow-slate-200/40 flex items-center gap-4 max-w-5xl w-full">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`relative px-3 py-2 text-sm font-semibold transition-all duration-300 flex items-center gap-2 rounded-lg ${
                  isActive
                    ? 'text-indigo-700 bg-indigo-50 border border-indigo-100'
                    : `${GHOST_BUTTON} !px-3 !py-2`
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 rounded-lg -z-10"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            )
          })}

          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => scrollToSection('contact')}
            className={`ml-auto ${PRIMARY_BUTTON} !px-5 !py-2 text-sm ${
              activeSection === 'contact' ? 'ring-2 ring-violet-200 ring-offset-2 ring-offset-white' : ''
            }`}
          >
            <Mail className="w-4 h-4" />
            Get In Touch
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile — solid light bottom dock */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex justify-center px-4 pb-5 pt-3 w-full bg-white border-t border-slate-200/60 shadow-[0_-8px_32px_rgba(15,23,42,0.08)]"
      >
        <div className="rounded-full px-3 py-2.5 bg-white border border-border flex items-center gap-1.5 max-w-lg w-full justify-center shadow-sm">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                whileTap={{ scale: 0.95 }}
                className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveIndicator"
                    className="absolute inset-0 rounded-full border border-indigo-200 -z-10"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className="w-[18px] h-[18px]" />
              </motion.button>
            )
          })}
        </div>
      </motion.div>
    </>
  )
}
