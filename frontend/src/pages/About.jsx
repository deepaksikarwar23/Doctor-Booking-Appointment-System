import React from 'react'
import { assets } from '../assets/assets_frontend/assets'

const About = () => {
  return (
    <div>
      {/*-------------about us section ---------------------------- */}
      <div className=' text-center text-2xl pt-10 text-gray-500'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US </span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12 '>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600 '>
          <p>Welcome To Prescripto, Your Trusted Partner In Managing Your Healthcare Needs Conviniently And Efficiently. At Prescripto, We Understand The Challenges An Individual Face When It Comes To Shceduling   Doctor Appointment And Managing Their Healthcare Records. </p>
          <p>Prescripto Is Committed To Excellence In Health Care Technology. We Continuously Strive To Enhance Our Platform , Integrating The Latest Advancement To Improve User Experience And Deliver Superior Service. Whether You Are Booking Your First Appointment Or Managing Ongoing Care. Prescripto Is Here To Support You Every Step Of The Way.  </p>
          <b className='text-gray-800'>Our Vision </b>
          <p>Our Vision At Prescripto Is To Create A Seamless Healthcare Experience For Every User. We Use To Bridge The Gap Between Patients And Healthcare Providers , Making It Easier For You To Access The Care You Need. When You Need It.  </p>
        </div>
      </div>

      {/*-----------------why choose us section--------------------------------*/}
      <div className='text-xl my-4 '>
        <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US </span></p>
      </div>

      {/*----------------last section---------------------------*/}
      <div className='flex flex-col md:flex-row mb-20'>

        <div className='border border-zinc-200/60  px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer  '>
          <b>Efficiency:</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>

        <div className='border border-zinc-200/60 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer  '>
          <b>Convinience:</b>
          <p>Access to a network of trusted healthcare professionals in your area. </p>
        </div>

        <div className='border border-zinc-200/60 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer  '>
          <b>Personalization:</b>
          <p>Tailored recommendations and reminders to help you stay on the top of your health.</p>
        </div>

      </div>

    </div>
  )
}

export default About
