import React, { memo, useState } from 'react';
import ProfileHeader from './content/ProfileHeader';
import ProfileTabs from './content/ProfileTabs';
import ProfileSidebar from './content/ProfileSidebar';
import DetailsContent from './content/DetailsContent';
import { useProfile } from '@/providers/ProfileProvider';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarHeartIcon, CirclePlusIcon, EllipsisIcon, GiftIcon } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { type CarouselApi } from "@/components/ui/carousel"

const progress = [
  {
    title: "Update profile details",
    description: "Complete your profile with personal information and customize your app settings.",
    completed: true
  },
  {
    title: "Create your first Family Tree",
    description: "Start building your family tree by adding members and exploring potential connections.",
    completed: true
  },
  {
    title: "Search for relatives using the Relationships tool",
    description: "Use advanced search options to find and connect with relatives through detailed filters.",
    completed: false
  },
  {
    title: "View search results and connect with relatives",
    description: "Explore potential matches in the results display and integrate them into your family tree.",
    completed: false
  },
  {
    title: "Upload and manage your family records",
    description: "Keep all essential documents and family records organized and accessible in one place.",
    completed: false
  },
  {
    title: "Add family photos to the Gallery",
    description: "Upload and organize family photos to create a visual representation of your family history.",
    completed: false
  },
  {
    title: "Stay informed with Notifications",
    description: "Receive alerts and updates on new family connections and changes in your family tree.",
    completed: false
  }
]


const memories = [
  {
    image: '/images/design-1.png'
  },
  {
    image: '/images/design-1.png'
  },
  {
    image: '/images/design-1.png'
  },
  {
    image: '/images/design-1.png'
  },
  {
    image: '/images/design-1.png'
  },
  {
    image: '/images/design-1.png'
  }
]

const monthlyUpdates = [
  "5 new family members added",
  "10 new connections found",
  "New family records uploaded",
  "Family photos added to the gallery",
  "Monthly update on family activities"
]

const ActivityCard = () => {
  const titles = ["Tree Activity", "Connection Activity"];

  const [isActive, setIsActive] = useState(titles[0]);
  return (

      <div className='flex flex-col items-center'>
          <div className='grid grid-cols-2 text-center rounded-t-2xl w-full bg-[#EAF1E5] justify-between items-center'>
            {
            titles.map((title, index) => (
              <p key={index} className={`text-lg cursor-pointer  font-semibold py-2 px-4 rounded-t-2xl ${isActive === title ? ' border-1 border-b-0 border-[#649F4F] bg-[#D4E2CC] text-primary' : 'text-gray-500'}`} onClick={() => setIsActive(title)}>{title}</p>
            ))
          }
        </div>
        <div className='bg-[#EAF1E5] p-4 border-1 border-[#649F4F] '>
        {
          isActive === titles[0] && 
            <>
              <div className='py-2 border-b-2 border-[#649F4F] text-lg'>A user has been detected to be potentially related to your tree. Check now!</div>
              <div className='py-2 border-b-2 border-[#649F4F] text-lg'>A user has been detected to be potentially related to your tree. Check now!</div>
              <div className='py-2 border-b-2 border-[#649F4F] text-lg'>A user has been detected to be potentially related to your tree. Check now!</div>
              <div className='py-2 border-b-2 border-[#649F4F] text-lg'>A user has been detected to be potentially related to your tree. Check now!</div>
              <div className='py-2 border-b-2 border-[#649F4F] text-lg'>A user has been detected to be potentially related to your tree. Check now!</div>
            </>
        }

        {
          isActive === titles[1] && 
            <>
              <div className='py-2 border-b-2 border-[#649F4F] text-lg'>You have connected with a new user. Check now!</div>
              <div className='py-2 border-b-2 border-[#649F4F] text-lg'>You have connected with a new user. Check now!</div>
              <div className='py-2 border-b-2 border-[#649F4F] text-lg'>You have connected with a new user. Check now!</div>
              <div className='py-2 border-b-2 border-[#649F4F] text-lg'>You have connected with a new user. Check now!</div>
              <div className='py-2 border-b-2 border-[#649F4F] text-lg'>You have connected with a new user. Check now!</div>
            </>
        }
      </div>
      </div>
  )
}


const Content = () => {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }
 
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())
 
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })

  }, [api])
  console.log(current)

  return (

      <div className='bg-[#DFDFDF] text-black p-6'>
        <div className='bg-white rounded-[4px] p-4 gap-[2rem] grid grid-cols-[3fr_1fr]'>
          <div>
            <div>
              <Image src={'/images/AnceTREE-thumb-1.png'} alt='profile' className='w-[350px] object-cover' width={1000} height={1000} />
              <p className='ml-4 text-sm'>Unraveling  Ancestral Lineages through Genealogy</p>
            </div>
            {/* PROFILE DETAILS */}
            <div className='relative flex items-center ml-12 mt-12'>
        
              <div className='absolute z-10 -top-[28px] -left-[40px] p-2 bg-[#D4E2CC] rounded-full w-[max-content]'>
                <Image src={'/images/doge.png'} alt='profile' className='w-[80px] bg-white h-[80px] rounded-full object-cover' width={100} height={100} />
              </div>
              <div className='relative flex gap-[4rem] rounded-sm w-full pl-16 py-2 px-4 bg-[#D4E2CC]'>
                <div>
                  <p className='text-lg font-semibold'>John Doe</p>
                  <p className=''>john@doe.com</p>
                </div>
                <div className='flex items-center'>
                  <Link href={'/dashboard/FamilyTree'} className={`bg-white hover:bg-btn-secondary text-primary border-1 border-green px-2 py-1 rounded-lg mr-2`}>View Tree</Link>
                  <Link href={'/dashboard/Connections'} className={`bg-white hover:bg-btn-secondary  text-primary border-1 border-green px-2 py-1 rounded-lg`}>Connections</Link>
                </div>
                <EllipsisIcon className='absolute top-2 right-4 cursor-pointer' />
              </div>
            </div>

            <div className='grid grid-cols-[2fr_1fr] gap-4'>
              {/* FIRST COLUMN */}
              <div>
                {/* ACCOUNT PROGRESS */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Welcome to AncesTREE ! To get started, click here to show tasks and and complete account progress.  </AccordionTrigger>
                    <AccordionContent>
                      {
                        progress.map((item, index) => (
                          <div key={index} className='flex ml-16 pl-3 flex-col justify-center relative'>
                            <div className={`absolute top-[5px] z-10 -left-4 h-[1rem] w-[1rem] border-1 border-[#174317] rounded-full ${item.completed ? 'bg-[#519F49]' : 'bg-white'}`}></div>
                            {index != progress.length - 1 && <div className='absolute top-[5px] -left-[9px] h-full w-[1px] bg-[#434343]'></div>}
                            <p className='text-lg text-[#434343] font-semibold'>{index + 1}. {item.title}</p>
                            <p className='text-sm pl-4 text-black'>{item.description}</p>
                          </div>
                        ))
                      }
                      <p className='text-[#1B5A1B] font-bold text-xl ml-16 mt-4'>Well Done! You can now go through the app and start tracing your roots.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* MEMORIES CAROUSEL */}
                <div className='bg-[#EAF1E5] h-[max-content] rounded-lg mt-4 p-4'>
                    <h2 className='text-2xl text-[#1B5A1B] font-semibold'>Memories</h2>
                    <Carousel 
                      setApi={setApi}
                      opts={{
                        loop: true,
                        align: 'center'
                      }}
                      >
                      <CarouselContent>
                        {memories.map((item, index) => (
                          <CarouselItem key={index}>
                            <Image src={item.image} alt='profile' className='w-[550px] object-contain' width={1000} height={1000} />
                          </CarouselItem>
                        ))}
                        
                      </CarouselContent>
                    </Carousel>
                    <div className='flex justify-center w-4/5 mx-auto mt-4 gap-[2px] items-center'>
                      {
                        memories.map((item, index) => (
                          <div key={index} className=' h-[8px] flex-1 rounded-full' style={{ backgroundColor: `${current === index ? '#1B5A1B' : 'rgba(27, 90, 27, 0.42)' }` }}></div>
                        ))
                      }
                    </div>
                </div>
                {/* OCCASIONS UPDATES */}
                <div className='flex gap-4 bg-[#EAF1E5] rounded-lg p-4 mt-4'>
                      <div className='bg-[#D4E2CC] flex-1 rounded-lg mt-4 p-4 flex items-center gap-4'>
                        <GiftIcon className='w-[20px] h-[20px] text-[#1B5A1B]' />
                        <h2 className='text-2xl text-[#1B5A1B] font-semibold'>Birthdays</h2>
                      </div>
                      <div className='bg-[#D4E2CC] flex-1 rounded-lg mt-4 p-4 flex items-center gap-4'>
                        <CalendarHeartIcon className='w-[20px] h-[20px] text-[#1B5A1B]' />
                        <h2 className='text-2xl text-[#1B5A1B] font-semibold'>Anniversaries</h2>
                      </div>
                </div>
              </div>

              {/* SECOND COLUMN */}
              <div>              
                {/* NOTEPAD */}
                <div className='bg-[#EAF1E5] h-[max-content] rounded-lg mt-4 p-4'>  
                  <div className='flex justify-between items-center'>
                    <h2 className='text-2xl text-[#1B5A1B] font-semibold'>Notepad</h2>
                    <CirclePlusIcon className='w-[20px] cursor-pointer h-[20px] text-[#1B5A1B]' />
                  </div>
                  <div className='mt-4 flex flex-col gap-4'>
                    <div className='bg-[#F3FFE6] rounded-lg p-4'>
                      <p className='text-lg text-[#1B5A1B] font-semibold'>Add a new note</p>
                    </div>
                    <div className='bg-[#F3FFE6] rounded-lg p-4'>
                      <p className='text-lg text-[#1B5A1B] font-semibold'>Add a new note</p>
                    </div>
                    <div className='bg-[#F3FFE6] rounded-lg p-4'>
                      <p className='text-lg text-[#1B5A1B] font-semibold'>Add a new note</p>
                    </div>
                  </div>
                </div>
                {/* MONTHLY UPDATES */}
                <div className='bg-[#EAF1E5] h-[max-content] rounded-lg mt-4 p-4'>
                  <h2 className='text-2xl text-[#1B5A1B] font-semibold'>Monthly Updates</h2>
                  <ul className='list-disc list-inside'>
                    {
                      monthlyUpdates.map((item, index) => (
                        <li key={index} className='text-lg text-[#434343] font-semibold'>{item}</li>
                      ))
                    }
                  </ul>
                </div>
              </div>
            </div>
          </div>


          {/* RECENT ACTIVITY COLUMN */}
          <div>
            <div>
              <Image src={'/images/design-1.png'} alt='profile' className='w-[350px] object-cover' width={1000} height={1000} />
            </div>
            <h2 className='text-lg font-semibold mt-4'>Recent Activity</h2>
            <div className='flex gap-4 '>
                <ActivityCard />
              </div>
            </div>
        </div>
      </div>
  
  );
};

export default Content;
