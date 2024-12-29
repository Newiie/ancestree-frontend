import React, { 
  useState, 
  useEffect 
} from 'react';
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
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel"
import { type CarouselApi } from "@/components/ui/carousel"
import dashboardService from '@/services/api/dashboardService';

const progress = [
  {
    title: "Update profile details",
    description: "Complete your profile with personal information and customize your app settings.",
    completed: true
  },
  {
    title: "Create your first Family Tree",
    description: "Start building your family tree by adding members and exploring potential connections.",
    completed: false
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
  const titles = ["Tree ", "Connection "];

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
  const { userData } = useProfile();
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  const [progressSteps, setProgressSteps] = React.useState(progress)
  const [memoryPhotos, setMemoryPhotos] = React.useState(memories)
  const [monthlyUpdatesList, setMonthlyUpdatesList] = React.useState(monthlyUpdates)
  const [birthdays, setBirthdays] = React.useState([])
  const [anniversary, setAnniversary] = React.useState([])
  React.useEffect(() => {
    // Fetch user progress
    const fetchUserData = async () => {
      try {
        const progressResponse = await dashboardService.fetchUserProgress();
        const memoriesResponse = await dashboardService.fetchRecentMemories();
        const updatesResponse = await dashboardService.fetchMonthlyUpdates();
        const birthdaysResponse = await dashboardService.fetchUpcomingBirthdays();
        // Update progress steps if fetched successfully
        if (progressResponse?.progress) {
          setProgressSteps(progressResponse.progress);
        }

        // Update memory photos if fetched successfully
        if (memoriesResponse?.memories) {
          setMemoryPhotos(memoriesResponse.memories);
        }

        // Update monthly updates if fetched successfully
        if (updatesResponse?.monthlyUpdates) {
          setMonthlyUpdatesList(updatesResponse.monthlyUpdates);
        }

        if (birthdaysResponse?.upcomingEvents) {
          setBirthdays(birthdaysResponse.upcomingEvents);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchUserData();
  }, []);

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

  return (
    <div className='bg-[#DFDFDF] text-black p-4 sm:p-6'>
      <div className='bg-white rounded-[4px] p-4 gap-[2rem]'>
        <div>
          {/* PROFILE DETAILS */}
          <div className='relative flex flex-col sm:flex-row items-center ml-0 sm:ml-12 mt-4 sm:mt-12'>
            <div className='absolute z-10 left-0 lg:-top-[28px] lg:-left-[40px] p-2 bg-[#D4E2CC] rounded-full w-[80px] h-[80px] lg:w-[max-content] block'>
              <Image 
                src={`${userData?.profilePicture ? userData?.profilePicture : '/images/doge.png'}`} 
                alt='profile' 
                className='w-[80px] bg-white h-[80px] rounded-full object-cover' 
                width={100} 
                height={100} 
              />
            </div>
            <div className='relative flex flex-col sm:flex-row gap-4 sm:gap-[4rem] rounded-sm w-full sm:pl-16 py-2 px-4 bg-[#D4E2CC]'>
              <div className='text-center sm:text-left'>
                <p className='text-xl sm:text-[2rem] text-black/80 font-semibold'>
                  {userData?.generalInformation.firstName} {userData?.generalInformation.lastName}
                </p>
              </div>
              <div className='flex justify-center sm:justify-start items-center'>
                <Link 
                  href={`/dashboard/family-tree/${userData?.userId}`} 
                  className={`bg-white hover:bg-btn-secondary text-primary border-1 transition-colors duration-200 border-green px-2 py-1 rounded-lg mr-2`}
                >
                  View Tree
                </Link>
              </div>
              <EllipsisIcon className='absolute top-2 right-4 cursor-pointer hidden sm:block' />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
            {/* FIRST COLUMN */}
            <div className='space-y-4'>
              {/* ACCOUNT PROGRESS */}
              <Accordion type="single" collapsible className='w-full'>
                <AccordionItem value="item-1">
                  <AccordionTrigger className='text-sm sm:text-base'>
                    Welcome to AncesTREE! To get started, click here to show tasks and complete account progress.
                  </AccordionTrigger>
                  <AccordionContent>
                    {progressSteps.map((item, index) => (
                      <div key={index} className='flex ml-4 sm:ml-16 pl-3 flex-col justify-center relative'>
                        <div className={`absolute top-[5px] z-10 -left-4 h-[1rem] w-[1rem] border-1 border-[#174317] rounded-full ${item.completed ? 'bg-[#519F49]' : 'bg-white'}`}></div>
                        {index != progressSteps.length - 1 && <div className='absolute top-[5px] -left-[9px] h-full w-[1px] bg-[#434343]'></div>}
                        <p className='text-sm sm:text-lg text-[#434343] font-semibold'>{index + 1}. {item.title}</p>
                        <p className='text-xs sm:text-sm pl-4 text-black'>{item.description}</p>
                      </div>
                    ))}
                    <p className='text-base sm:text-xl text-[#1B5A1B] font-bold ml-4 sm:ml-16 mt-4'>
                      Well Done! You can now go through the app and start tracing your roots.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* MEMORIES CAROUSEL */}
              <div className='bg-[#EAF1E5] h-[max-content] rounded-lg p-4'>
                <h2 className='text-xl sm:text-2xl text-[#1B5A1B] font-semibold'>Memories</h2>
                <Carousel
                  setApi={setApi}
                  opts={{
                    loop: true,
                    align: 'center',
                    slidesToScroll: 1,
                  }}
                  className="mx-auto"
                >
                  <CarouselContent className="flex gap-4 px-4">
                    {memoryPhotos.map((item, index) => (
                      <CarouselItem 
                        key={index} 
                        className="basis-3/4 sm:basis-1/2 lg:basis-1/3 flex justify-center"
                      >
                        <div className='w-[200px] sm:w-[250px] h-[250px] sm:h-[300px] bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105'>
                          <Image 
                            src={item.image} 
                            alt='memory' 
                            className='w-full h-full object-cover' 
                            width={1000} 
                            height={1000} 
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
                <div className='flex justify-center w-full mx-auto mt-6 gap-2 items-center'>
                  {memoryPhotos.map((item, index) => (
                    <div 
                      key={index} 
                      className='h-[8px] w-[8px] rounded-full transition-all duration-300' 
                      style={{ 
                        backgroundColor: current === index ? '#1B5A1B' : 'rgba(27, 90, 27, 0.42)',
                        transform: current === index ? 'scale(1.5)' : 'scale(1)'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* OCCASIONS UPDATES */}
              <div className='flex flex-col sm:flex-row gap-4 bg-[#EAF1E5] rounded-lg p-4'>
                <div className='bg-[#D4E2CC] flex-1 rounded-lg p-4'>
                  <div className='flex items-center gap-4'>
                    <GiftIcon className='w-[20px] h-[20px] text-[#1B5A1B]' />
                    <h2 className='text-xl sm:text-2xl text-[#1B5A1B] font-semibold'>Birthdays</h2>
                  </div>
                  <div className='flex flex-col gap-2'>
                    {birthdays.length > 0 ? (
                      <ul className='list-disc list-inside'>
                        {birthdays.map((person : any, index) => (
                          <li key={index} className='text-sm sm:text-lg text-[#434343] font-semibold'>{person.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className='text-center text-gray-500 py-4'>No Birthdays</div>
                    )}
                  </div>
                </div>
                <div className='bg-[#D4E2CC] flex-1 rounded-lg p-4'>
                  <div className='flex items-center gap-4'>
                    <CalendarHeartIcon className='w-[20px] h-[20px] text-[#1B5A1B]' />
                    <h2 className='text-xl sm:text-2xl text-[#1B5A1B] font-semibold'>Anniversaries</h2>
                  </div>
                  <div>
                    {anniversary.length > 0 ? (
                      <ul className='list-disc list-inside'>
                        {anniversary.map((person : any, index) => (
                          <li key={index} className='text-sm sm:text-lg text-[#434343] font-semibold'>{person.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className='text-center text-gray-500 py-2'>No Anniversaries</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SECOND COLUMN */}
            <div className='space-y-4'>
              {/* NOTEPAD */}
              <div className='bg-[#EAF1E5] h-[max-content] rounded-lg p-4'>
                <div className='flex justify-between items-center'>
                  <h2 className='text-xl sm:text-2xl text-[#1B5A1B] font-semibold'>Notepad</h2>
                  <CirclePlusIcon className='w-[20px] cursor-pointer h-[20px] text-[#1B5A1B]' />
                </div>
                <div className='mt-4 flex flex-col gap-4'>
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className='bg-[#F3FFE6] rounded-lg p-4'>
                      <p className='text-sm sm:text-lg text-[#1B5A1B] font-semibold'>Add a new note</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* MONTHLY UPDATES */}
              <div className='bg-[#EAF1E5] h-[max-content] rounded-lg p-4'>
                <h2 className='text-xl sm:text-2xl text-[#1B5A1B] font-semibold'>Monthly Updates</h2>
                {monthlyUpdatesList.length > 0 ? (
                  <ul className='list-disc list-inside'>
                    {monthlyUpdatesList.map((item, index) => (
                      <li key={index} className='text-sm sm:text-lg text-[#434343] font-semibold'>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <div className='text-center text-gray-500 py-4'>
                    <p className='text-base italic'>No updates this month</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
