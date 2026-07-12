'use client'

import { motion } from 'framer-motion'

type CertificateSkeletonProps = {
  label?: string
}

export default function CertificateSkeleton({ label = 'Loading certificate…' }: CertificateSkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="w-[min(240px,76vw)] sm:w-[min(300px,68vw)] md:w-[min(380px,58vw)] lg:w-[min(440px,52vw)] max-h-[min(200px,30vh)] md:max-h-[min(230px,32vh)] lg:max-h-[min(250px,34vh)] aspect-[1.41/1] rounded-xl border border-cyan-500/20 bg-gradient-to-br from-card/60 via-card/30 to-background overflow-hidden relative"
      style={{ boxShadow: '0 0 30px rgba(6, 182, 212, 0.12)' }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent animate-[shimmer_1.8s_ease-in-out_infinite]" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
        <div className="w-12 h-12 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center">
          <svg className="w-6 h-6 text-cyan-400/70 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>

        <div className="w-full max-w-[180px] space-y-2">
          <div className="h-2 w-full rounded-full bg-muted/40 animate-pulse" />
          <div className="h-2 w-4/5 mx-auto rounded-full bg-muted/30 animate-pulse" />
        </div>

        <p className="text-xs text-cyan-400/60 font-medium tracking-wide">{label}</p>
      </div>
    </motion.div>
  )
}
