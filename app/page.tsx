import React from 'react'
import BgImage from '@/components/BgImage'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ScrollingLogos from '@/components/ScrollingLogos'
import CreatorsSection from '@/components/CreatorsSection'
import TestimonialsSlider from '@/components/TestimonialsSlider'
import ComparisonSection from '@/components/ComparisonSection'
import PricingSection from '@/components/PricingSection'
import FAQSection from '@/components/FAQSection'
import UrgencyBanner from '@/components/UrgencyBanner'
import Footer from '@/components/Footer'

const page = () => {
  return (
    <div className='relative h-screen bg-[#010C0A] pt-6 px-2 sm:px-4 md:px-6 overflow-x-hidden'>
      <BgImage />
      <div className='relative items-center z-10'>
      <Navbar />
      </div>
        
      <div className='relative items-center'>
        <Hero />
      </div>
      {/* ✅ Scrolling Logos Positioned Below Hero */}
      <div className='relative -mt-16'>
        <ScrollingLogos />
      </div>
      <div>
        <CreatorsSection />
      </div>
      <div>
        <TestimonialsSlider />
      </div>
      <div>
        <ComparisonSection />
      </div>
      <div>
        <PricingSection />
      </div>
      <div>
        <FAQSection />
      </div>
      <div className='w-full'>
        <Footer />
      </div>
      
      {/* Sticky Urgency Banner */}
      <UrgencyBanner />
    </div>
  )
}

export default page