"use client";

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Marquee from "react-fast-marquee";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
  import { Mail, Github, Linkedin   } from 'lucide-react';
const sec_data = [
    {
        image: "/images/enhanced-search.png",
        title: "Enhanced Search",
        description: "Utilizing tree search algorithms to uncover hidden familial connections"
    },
    {
        image: "/images/migration-tracking.png",
        title: "Migration Tracking",
        description: "Utilizing acquired data from user to further trace geographical movement patterns across generations"
    },
    {
        image: "/images/privacy-first.png",
        title: "Privacy First",
        description: "Advanced security measures to protect sensitive genealogical data"
    },
    {
        image: "/images/community.png",
        title: "Community",
        description: "Collaborative platform for sharing and verifying family histories"
    }
]

const our_story = [
    "Today, AncesTREE stands at the forefront of genealogical research, offering users powerful tools to discover, preserve, and share their family history while maintaining the highest standards of data privacy and security.",
    "Born from the vision of making genealogical research more accessible and accurate, AncesTREE emerged as a response to the growing need for advanced family history research tools. Our platform combines traditional genealogical methods with advanced technology to provide users with unprecedented insights into their family history.",
    "Developed by researchers and genealogy enthusiasts at Cebu Institute of Technology-University, AncesTREE represents a significant advancement in digital genealogy. We recognized the challenges in traditional family history research - fragmented records,  incomplete data, and limited access to historical documents - and created a solution that addresses these issues through innovative technology.",
]

const page = () => {
  return (
    <div>
        <section className='relative w-full  h-[25rem] bg-[#F5F5F5]'>
            <Image className='absolute top-0 left-0 w-full h-full object-cover' src={"/images/bg_1.png"} alt='logo' height={1000} width={1000} />
            <div className='absolute top-0 left-0 w-full mt-[3rem] h-full px-[10rem] flex flex-col justify-center'>
                <h2 className='text-primary text-[4rem] leading-5 font-bold'>AncesTREE</h2>
                <p className='text-black-500 text-xl mt-4 max-w-[600px]'>Unraveling Ancestral Lineages through Geographical History</p>
                <p className='text-[#A1C14D] text-[2rem] mt-4'>About Us</p>
            </div>
        </section>
        <section className='py-[5rem]'>
            <div className='flex justify-between items-center w-4/5 mx-auto gap-[10rem]'>
                <div>
                    <h2 className='text-primary text-3xl font-bold'>Our Mission</h2>
                    <p className='text-gray-500 text-lg'>To revolutionize genealogical research by providing an innovative platform that combines advanced technology with traditional family history research methods, making it easier for people to discover and understand their ancestral heritage.</p>
                </div>
                <div>
                    <Image src={"/images/mission.png"} alt='logo' height={1000} width={1000} />
                </div>
            </div>
        </section>
        <section>
            <div className='flex justify-between items-center w-4/5 mx-auto gap-[10rem]'>
                <div>
                    <Image src={"/images/vision.png"} alt='logo' height={1000} width={1000} />
                </div>
                <div>
                    <h2 className='text-primary text-3xl font-bold'>Our Vision</h2>
                    <p className='text-gray-500 text-lg'>To become the leading platform in digital genealogy by creating meaningful connections between people and their heritage through maximizing technology and comprehensive historical data analysis.</p>
                </div>
                
            </div>
        </section>
        <section className='bg-[#002200] text-white mt-[5rem] py-[5rem] px-[10rem]'>
                <h2 className='text-[#FAFAFA] text-center text-3xl font-bold mb-[2rem]'>What Sets Us Apart</h2>
                <Marquee speed={50} pauseOnHover gradientColor="#002200"  gradient={true}>
                    {
                        sec_data.map((item, index) => (
                            <div key={index} className='flex cursor-pointer flex-col shadow-lg border h-[250px] justify-center gap-4 border-[#F0F0F0] p-4 rounded-[3px] items-center gap-1 ml-[8rem] w-[20rem]'>
                                <Image className='object-contain' src={item.image} alt='logo' height={40} width={40} />
                                <h2 className='text-[#FAFAFA] text-2xl font-bold'>{item.title}</h2>
                                <p className='text-[#F0F0F0] text-lg text-center'>{item.description}</p>
                            </div>
                        ))
                    }
                </Marquee>
        </section>
        <section className='w-full px-[10rem] py-[5rem]'>
            <h1 className='text-3xl text-primary font-bold text-center mb-[2rem]'>Our Story</h1>
            <Carousel className="w-[800px] mx-auto">
                <CarouselContent>
                    {our_story.map((story, index) => (
                    <CarouselItem key={index}>
                        <div className="p-4 bg-gray-50 rounded-lg shadow-sm min-h-[150px] flex items-center">
                            <p className="text-base text-gray-700 leading-relaxed text-center px-8">{story}</p>
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </section>
        <section className='bg-[#303E30] grid grid-cols-[2fr_1fr] gap-[4rem] items-center text-white py-[2rem] px-[10rem]'>
                <div className='space-y-6'>
                    <h2 className='text-white text-4xl font-bold'>Meet the Team</h2>
                    <p className='text-gray-200 text-lg leading-relaxed'>Behind AncesTREE is a passionate team of innovators from Cebu Institute of Technology-University, 
                    combining expertise in computer science, genealogy, and data analytics. United by our commitment to 
                    making family history research more accessible and meaningful, we work tirelessly to develop tools
                    that help people connect with their roots and understand their heritage.</p>
                </div>
                <div className='flex flex-col gap-8 justify-center'>
                    <div className='flex items-center gap-6 bg-[#3A4D3A] p-4 rounded-lg hover:bg-[#445744] transition-all'>
                        <Image className='w-[5.5rem] h-[5.5rem] rounded-full object-cover ring-2 ring-white/20' src={"/images/round_jethro.png"} alt='Jethro profile' height={1000} width={1000} />
                        <div className='space-y-2'>
                            <h5 className='text-xl font-semibold'>Jethro L. Cenas</h5>
                            <div className='flex gap-4 items-center'>
                                <Link href='mailto:jethrocenas@gmail.com' target='_blank' className='hover:text-primary transition-colors'>
                                    <Mail className='w-5 h-5' />
                                </Link>
                                <Link href='https://github.com/JethroCenas' target='_blank' className='hover:text-primary transition-colors'>
                                    <Github className='w-5 h-5' />
                                </Link>
                                <Link href='https://www.linkedin.com/in/jethro-cenas-0b1b1b1b1' target='_blank' className='hover:text-primary transition-colors'>
                                    <Linkedin className='w-5 h-5' />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center gap-6 bg-[#3A4D3A] p-4 rounded-lg hover:bg-[#445744] transition-all'>
                        <Image className='w-[5.5rem] h-[5.5rem] rounded-full object-cover ring-2 ring-white/20' src={"/images/round_raiza.png"} alt='Raiza profile' height={1000} width={1000} />
                        <div className='space-y-2'>
                            <h5 className='text-xl font-semibold'>Raiza J. Pagatpatan</h5>
                            <div className='flex gap-4 items-center'>
                                <Link href='mailto:raizapagatpatan@gmail.com' target='_blank' className='hover:text-primary transition-colors'>
                                    <Mail className='w-5 h-5' />
                                </Link>
                                <Link href='https://github.com/RaizaP' target='_blank' className='hover:text-primary transition-colors'>
                                    <Github className='w-5 h-5' />
                                </Link>
                                <Link href='https://www.linkedin.com/in/raiza-pagatpatan' target='_blank' className='hover:text-primary transition-colors'>
                                    <Linkedin className='w-5 h-5' />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
        </section>
        <section className='relative h-screen w-full'>
            <div className='absolute inset-0 bg-black/50 z-10'></div>
            <Image 
                className='absolute top-0 left-0 w-full h-full object-cover z-0' 
                src={"/images/journey.jpg"} 
                alt='Journey background' 
                width={1920} 
                height={1080}
                quality={100}
                priority
            />
            <div className='relative z-20 h-full px-[10rem] flex flex-col justify-center gap-8'>
                <h2 className='text-white text-[4rem] font-bold leading-tight'>START YOUR JOURNEY TODAY</h2>
                <Link href={'/register'} className='bg-primary/40 text-white px-8 py-2 rounded-[4px] 
                border hover:bg-primary/60 transition-all w-fit text-xl font-semibold'>
                    Sign Up
                </Link >
            </div>
        </section>
        <footer className='bg-white text-gray-500 py-[1rem] px-[10rem] text-center'>
            @2024 AncesTREE | All Rights Reserved
        </footer>
    </div>
  )
}

export default page