"use client"

import { useState } from "react"
import { Volume2, VolumeX } from "lucide-react"

export function HeroVideoSection() {
  const [showSoundButton, setShowSoundButton] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  return (
    <section className="pt-8 md:pt-12 lg:pt-16 pb-4 md:pb-6 lg:pb-8" style={{ paddingLeft: '1.5%', paddingRight: '1.5%' }}>
      <div 
        className="relative w-full h-[400px] md:h-[450px] lg:h-[500px] overflow-hidden rounded-lg shadow-lg cursor-pointer"
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
          <div className="bg-white/90 rounded-full p-4 backdrop-blur-sm">
            {isMuted ? (
              <VolumeX className="w-8 h-8 text-gray-900" />
            ) : (
              <Volume2 className="w-8 h-8 text-gray-900" />
            )}
          </div>
        </div>
        
        {/* Small sound toggle button in corner */}
        <button
          className={`absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white transition-all duration-300 z-20 backdrop-blur-sm ${showSoundButton ? 'opacity-100' : 'opacity-0'}`}
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
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-gray-900" />
          ) : (
            <Volume2 className="w-4 h-4 text-gray-900" />
          )}
        </button>
      </div>
    </section>
  )
}