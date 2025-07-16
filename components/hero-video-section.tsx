"use client"

import { useState } from "react"

export function HeroVideoSection() {
  const [showSoundButton, setShowSoundButton] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  return (
    <section className="pt-8 md:pt-12 lg:pt-16 pb-4 md:pb-6 lg:pb-8 px-4 md:px-6">
      <div 
        className="relative w-full max-w-[80%] mx-auto h-[400px] md:h-[450px] lg:h-[500px] overflow-hidden rounded-lg shadow-lg cursor-pointer"
        onMouseEnter={() => setShowSoundButton(true)}
        onMouseLeave={() => setShowSoundButton(false)}
        onClick={() => {
          const video = document.getElementById('hero-video') as HTMLVideoElement;
          if (video) {
            setIsMuted(!isMuted);
            video.muted = !isMuted;
          }
        }}
      >
        <video
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
          controls={false}
          className="absolute inset-0 w-full h-full object-cover"
          id="hero-video"
          onLoadStart={() => console.log('Video loading started')}
          onLoadedData={() => console.log('Video data loaded')}
          onError={(e) => console.error('Video error:', e)}
        >
          <source src="/intro.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Sound indicator overlay */}
        <div className={`absolute inset-0 bg-black/20 transition-all duration-300 z-10 flex items-center justify-center ${showSoundButton ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-black/70 rounded-full p-4 text-white text-2xl">
            {isMuted ? '🔇' : '🔊'}
          </div>
        </div>
        
        {/* Small sound toggle button in corner */}
        <button
          className={`absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all duration-300 z-20 text-sm ${showSoundButton ? 'opacity-100' : 'opacity-0'}`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the video click
            const video = document.getElementById('hero-video') as HTMLVideoElement;
            if (video) {
              setIsMuted(!isMuted);
              video.muted = !isMuted;
            }
          }}
          title={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>
    </section>
  )
}