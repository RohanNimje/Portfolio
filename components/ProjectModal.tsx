'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { portfolioData } from '@/lib/portfolioData'
import { GRADIENT_HEADING, getTechPillClass } from '@/lib/uiStyles'

interface ProjectModalProps {
  project: (typeof portfolioData.projects)[0]
  onClose: () => void
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl max-h-[90vh] bg-white border border-border rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white border border-border hover:border-indigo-200 hover:bg-slate-50 transition-all shadow-sm"
          >
            <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="overflow-y-auto max-h-[90vh] p-8 space-y-6">
            {/* Header */}
            <div>
              <h2 className={`text-3xl sm:text-4xl font-bold mb-2 ${GRADIENT_HEADING}`}>{project.title}</h2>
              <p className="text-muted-foreground">{project.description}</p>
            </div>

            {/* Tech Stack */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className={getTechPillClass(tech, i)}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Media - Product video */}
            {project.videourlproduct && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Product Demo</h3>
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm">
                  <video
                    preload="none"
                    src={project.videourlproduct}
                    controls
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Media - Other video */}
            {project.videoUrl && !project.videourlproduct && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Video Demo</h3>
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm">
                  <video
                    preload="none"
                    src={project.videoUrl}
                    controls
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Screenshot */}
            {(project as any).screenshoturl && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Screenshots</h3>
                <img
                  src={(project as any).screenshoturl}
                  alt="Project screenshot"
                  className="w-full rounded-xl border border-border"
                  loading="lazy"
                />
              </div>
            )}

            {/* Certificate */}
            {project.projectCertImgUrl && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Certificate</h3>
                <img
                  src={project.projectCertImgUrl}
                  alt="Project certificate"
                  className="w-full rounded-xl border border-glass-border max-h-96 object-cover"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
