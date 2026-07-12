'use client'

import { useCallback, useEffect, useRef } from 'react'

type AutoplayVideoProps = Omit<React.VideoHTMLAttributes<HTMLVideoElement>, 'src'> & {
  src: string
}

export default function AutoplayVideo({ src, className, ...props }: AutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const attemptPlay = useCallback(async () => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.defaultMuted = true

    try {
      await video.play()
    } catch {
      // Browser blocked autoplay — native controls remain available
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void attemptPlay()
        } else {
          video.pause()
        }
      },
      { threshold: 0.25, rootMargin: '50px' }
    )

    observer.observe(video)

    const handleCanPlay = () => {
      void attemptPlay()
    }

    video.addEventListener('canplay', handleCanPlay)
    video.load()

    return () => {
      observer.disconnect()
      video.removeEventListener('canplay', handleCanPlay)
    }
  }, [attemptPlay, src])

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      controls
      preload="auto"
      className={className}
      {...props}
    />
  )
}
