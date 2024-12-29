"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Mail, Phone, MapPin } from 'lucide-react'

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Page = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <section className='relative w-full h-[25rem] bg-[#EFFFF4]'>
        <Image 
          className='absolute top-0 left-0 w-full h-full object-cover opacity-30' 
          src={"/images/bg_1.png"} 
          alt='logo' 
          height={1000} 
          width={1000} 
        />
        <div className='absolute top-0 left-0 w-full mt-[3rem] h-full px-4 lg:px-[10rem] flex flex-col justify-center'>
          <h2 className='text-primary text-[2rem] lg:text-[4rem] leading-5 font-bold'>AncesTREE</h2>
          <p className='text-black-500 text-xl mt-4 max-w-[600px]'>Unraveling Ancestral Lineages through Geographical History</p>
          <p className='text-[#A1C14D] text-[2rem] mt-4'>Contact Us</p>
        </div>
      </section>

      <section className='bg-gradient-linear-top min-h-screen py-[5rem] px-4'>
        <div className='w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16'>
          <div className='space-y-8 md:space-y-12'>
            <div className='space-y-4'>
              <h1 className='text-2xl md:text-4xl font-bold text-primary text-center md:text-left'>Let&apos;s Connect <br /> With Your Heritage!</h1>
              <div className='space-y-1 text-gray-600 text-center md:text-left'>
                <p>Have questions about your family history?</p>
                <p>Ready to start your genealogy journey?</p>
                <p>Our team is here to guide you through every step of discovering your roots.</p>
              </div>
            </div>

            <div className='space-y-4'>
              <div className='flex items-center justify-center md:justify-start gap-3'>
                <Mail className='text-primary w-5 h-5' />
                <p className='text-sm md:text-base'>Email us at: <span className='text-primary font-medium'>info@ancestree.com</span></p>
              </div>
              <div className='flex lg:items-center justify-center md:justify-start gap-3'>
                <Phone className='text-primary w-5 h-5' />
                <p className='text-sm md:text-base'>Phone: <span className='font-medium'>+63 123-456-789</span></p>
              </div>
              <div className='flex items-center justify-center md:justify-start gap-3'>
                <MapPin className='text-primary w-5 h-5' />
                <p className='text-sm md:text-base'>Address: <span className='font-medium'>Cebu Institute of Technology-University, N. Bacalso Avenue, Cebu City</span></p>
              </div>
            </div>
          </div>

          <div className='bg-white p-6 md:p-8 rounded-lg shadow-md'>
            <form className='space-y-6'>
              <div className='space-y-4'>
                <Input 
                  type="text" 
                  name="name"
                  id='name'
                  label='Name'
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <Input 
                  type="email" 
                  name="email"
                  id='email'
                  label='Email'
                  value={formData.email}
                  onChange={handleInputChange}
                />
                
                <Input 
                  type="text" 
                  name="subject"
                  label='Subject'
                  id='subject'
                  value={formData.subject}
                  onChange={handleInputChange}
                />
                <textarea 
                  name="message"
                  placeholder='Message' 
                  value={formData.message}
                  onChange={handleInputChange}
                  className='bg-gray-50 w-full border-[1px] border-primary rounded-[4px] shadow-md p-4 h-40 resize-none' 
                />
              </div>
              <Button className='w-full bg-primary hover:bg-primary/90'>
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Page