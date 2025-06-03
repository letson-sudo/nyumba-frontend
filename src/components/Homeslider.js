'use client'
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

const slides = [
  {
    image: '/image/swd1.jpg',
    title: 'Software Development',
    description: 'We build custom applications that solve real-world problems.',
  },
  {
    image: '/image/network.AVIF',
    title: 'Networking Solutions',
    description: 'Secure and reliable network infrastructure for your business.',
  },
  {
    image: '/image/sale1.jpg',
    title: 'Computer Sales & Deals',
    description: 'Find affordable laptops, desktops, and accessories.',
  },
  {
    image: '/image/repair2.jpg',
    title: 'Computer Repairs',
    description: 'Fast, affordable, and professional computer repair services.',
  },
]

const Homeslider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const slideInterval = useRef(null)

  const startSlideShow = () => {
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
  }

  const stopSlideShow = () => clearInterval(slideInterval.current)

  useEffect(() => {
    if (!paused) startSlideShow()
    return stopSlideShow
  }, [paused])

  return (
    <div
      className="relative h-[65vh] w-full text-white overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={clsx(
            'absolute inset-0 transition-opacity duration-1000 ease-in-out',
            idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          )}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-black opacity-60" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-6 text-center transition-all duration-700 ease-in-out">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.7 }}
            className="space-y-4"
          >
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#d6a531] via-[#f5d478] to-[#d6a531] bg-clip-text text-transparent drop-shadow-lg">
              {slides[currentSlide].title}
            </h1>
            <p className="text-base md:text-lg max-w-2xl text-gray-200">
              {slides[currentSlide].description}
            </p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#services"
              className="mt-4 inline-block bg-[#d6a531] text-black font-semibold py-2 px-5 rounded-full shadow-lg hover:bg-[#e8ba53] transition"
            >
              Explore Services
            </motion.a>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={clsx(
              'w-3 h-3 rounded-full border transition',
              currentSlide === idx
                ? 'bg-[#d6a531] border-[#d6a531]'
                : 'bg-transparent border-[#d6a531]'
            )}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Homeslider
