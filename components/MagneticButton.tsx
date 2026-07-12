'use client'

import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { PRIMARY_BUTTON } from '@/lib/uiStyles'

interface MagneticButtonProps {
  children: React.ReactNode
  href?: string
}

export default function MagneticButton({ children }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return

    const button = ref.current
    const rect = button.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distance = 50
    const x = (e.clientX - centerX) / distance
    const y = (e.clientY - centerY) / distance

    setPosition({ x: x * 4, y: y * 4 })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        const contact = document.getElementById('contact')
        if (contact) contact.scrollIntoView({ behavior: 'smooth' })
      }}
      className={`${PRIMARY_BUTTON} overflow-hidden group cursor-pointer`}
    >
      <span className="relative flex items-center gap-2">
        {children}
        <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </span>
    </motion.button>
  )
}
