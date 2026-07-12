'use client'

import { motion } from 'framer-motion'
import { portfolioData } from '@/lib/portfolioData'
import { useState } from 'react'
import AutoplayVideo from './AutoplayVideo'
import ProjectModal from './ProjectModal'
import {
  ELEVATED_CARD,
  ELEVATED_CARD_HOVER,
  GRADIENT_HEADING,
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
  getTechPillClass,
} from '@/lib/uiStyles'

const VIEW_DETAILS_BUTTON = `${SECONDARY_BUTTON} w-full text-xs py-2.5 hover:border-indigo-200 hover:text-indigo-700`

export default function ProjectsBento() {
  const { projects } = portfolioData
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null)
  const [showAllProjects, setShowAllProjects] = useState(false)

  const featuredProject = projects.find(p => p.isFeatured)
  const otherProjects = projects.filter(p => !p.isFeatured)

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#F7F9FC] relative">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${GRADIENT_HEADING}`}>Featured Projects</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Premium architectures showcasing AI automation, full-stack development, and MVP deployment.</p>
        </div>

        {featuredProject && (
          <div className={`group relative rounded-3xl overflow-hidden ${ELEVATED_CARD} ${ELEVATED_CARD_HOVER}`}>
            <div className="p-8 md:p-12 space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-1.5 rounded-full bg-violet-50 border border-violet-200">
                  <span className="text-violet-700 text-xs font-semibold">Featured Project</span>
                </div>
                <h3 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${GRADIENT_HEADING}`}>{featuredProject.title}</h3>
                <p className="text-base md:text-lg text-slate-600 max-w-3xl">{featuredProject.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {featuredProject.techStack.map((tech, i) => (
                  <span key={i} className={getTechPillClass(tech, i)}>
                    {tech}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="space-y-3"
                >
                  <h4 className="text-sm font-semibold text-slate-800">MVP Architecture</h4>
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md">
                    <div className="bg-gray-900 px-4 py-3 border-b border-gray-800 flex items-center gap-2">
                      <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                      </div>
                    </div>
                    <AutoplayVideo
                      src={featuredProject.videoUrlmvp}
                      className="w-full bg-black aspect-video object-cover"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="space-y-3 flex flex-col items-center"
                >
                  <h4 className="text-sm font-semibold text-slate-800 self-start">Product Demo</h4>
                  <div className="relative w-full max-w-[280px] aspect-[9/16] mx-auto rounded-[2.5rem] overflow-hidden border-[6px] border-gray-900 bg-black shadow-2xl flex-1">
                    <AutoplayVideo
                      src="https://res.cloudinary.com/doyiqcna9/video/upload/v1783677832/Untitled_design_exdmtc.mp4"
                      className="w-full h-full bg-black object-cover"
                    />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-3xl z-20 flex items-center justify-center pointer-events-none">
                      <div className="w-1 h-1 bg-gray-700 rounded-full" />
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedProject(featuredProject)}
                  className={PRIMARY_BUTTON}
                >
                  View Full Project Details
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAllProjects(!showAllProjects)}
                  className={SECONDARY_BUTTON}
                >
                  {showAllProjects ? 'Hide Projects' : `Show All Projects (${otherProjects.length})`}
                  <motion.svg
                    animate={{ rotate: showAllProjects ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </motion.svg>
                </motion.button>
              </div>
            </div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={showAllProjects ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={showAllProjects ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group relative overflow-hidden text-left h-full"
              >
                <div className={`relative h-64 sm:h-60 p-5 flex flex-col overflow-hidden ${ELEVATED_CARD} ${ELEVATED_CARD_HOVER}`}>
                  <div className="relative z-10 space-y-2">
                    <h3 className="text-sm md:text-base font-bold text-slate-800 line-clamp-2">{project.title}</h3>
                    <p className="text-slate-600 text-xs line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {project.techStack.map((tech, j) => (
                        <span key={j} className={`${getTechPillClass(tech, j)} !px-2 !py-0.5 !text-[10px]`}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="relative z-10 mt-auto pt-3">
                    <button
                      type="button"
                      onClick={() => setSelectedProject(project)}
                      className={VIEW_DETAILS_BUTTON}
                    >
                      View Details
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </section>
  )
}
