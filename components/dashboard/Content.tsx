import React, { useState } from 'react';
import { useProfile } from '@/providers/ProfileProvider';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarHeartIcon, CheckIcon, GiftIcon } from 'lucide-react';
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
import TreeService from '@/services/api/treeService';
import { TreeNode } from '@/types/tree';

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
  const [treeMemberCount, setTreeMemberCount] = useState<number | null>(null);
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
        // Merge API completion status into the hardcoded progress template
        // API may return objects [{title, completed}] or just completed titles as strings
        if (progressResponse?.progress) {
          const apiProgress: unknown[] = progressResponse.progress;
          const completedTitles = new Set(
            apiProgress.map((s: unknown) =>
              typeof s === 'string' ? s : (s as { title?: string }).title
            )
          );
          const isStatusArray = apiProgress.length > 0 && typeof apiProgress[0] === 'object';
          if (isStatusArray) {
            setProgressSteps(
              progress.map(step => ({
                ...step,
                completed: !!(apiProgress as { title?: string; completed?: boolean }[]).find(
                  s => s.title === step.title
                )?.completed
              }))
            );
          } else {
            // API returned array of completed title strings
            setProgressSteps(progress.map(step => ({ ...step, completed: completedTitles.has(step.title) })));
          }
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

  React.useEffect(() => {
    if (!userData?.userId) return;
    TreeService.fetchTreeData(userData.userId)
      .then(data => {
        const root = data.familyTree.root as unknown as TreeNode;
        const visited = new Set<string>();
        const queue: TreeNode[] = [root];
        let count = 0;
        while (queue.length > 0) {
          const node = queue.shift()!;
          if (!node?.id || visited.has(node.id)) continue;
          visited.add(node.id);
          count++;
          (node.children ?? []).forEach(c => queue.push(c));
          (node.parents ?? []).forEach(p => queue.push(p));
        }
        setTreeMemberCount(count);
      })
      .catch(() => setTreeMemberCount(null));
  }, [userData?.userId]);

  return (
    <div className='bg-stone-50 text-black p-4 sm:p-6 space-y-4'>
      {/* TREE SUMMARY HERO */}
      <div className='flex items-center gap-4 bg-white rounded-2xl p-5 border border-stone-200 shadow-sm'>
        <div className='relative flex-shrink-0'>
          <Image
            src={userData?.profilePicture ? userData.profilePicture : '/images/doge.png'}
            alt={userData?.generalInformation?.firstName ? `${userData.generalInformation.firstName}'s avatar` : 'User avatar'}
            width={56}
            height={56}
            className='w-14 h-14 rounded-full object-cover ring-2 ring-[#1B5A1B]/20'
          />
        </div>
        <div className='flex-grow min-w-0'>
          <p className='text-base font-bold text-stone-800 truncate'>
            {userData?.generalInformation?.firstName
              ? `${userData.generalInformation.firstName}'s Family Tree`
              : 'Your Family Tree'}
          </p>
          <p className='text-sm text-stone-400'>
            {treeMemberCount !== null
              ? `${treeMemberCount} member${treeMemberCount !== 1 ? 's' : ''} in your tree`
              : 'Start building your family history'}
          </p>
        </div>
        {userData?.userId && (
          <Link
            href={`/dashboard/family-tree/${userData.userId}`}
            className='flex-shrink-0 px-4 py-2 bg-[#1B5A1B] text-white text-sm font-medium rounded-xl hover:bg-[#1B5A1B]/90 transition-colors'
          >
            View Tree
          </Link>
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* FIRST COLUMN */}
            <div className='space-y-4'>
              {/* GETTING STARTED PROGRESS */}
              {progressSteps.some(s => !s.completed) && (() => {
                const completedCount = progressSteps.filter(s => s.completed).length;
                const pct = progressSteps.length ? Math.round((completedCount / progressSteps.length) * 100) : 0;
                return (
                  <div className='bg-white rounded-2xl border border-stone-200 p-5'>
                    <div className='flex items-center justify-between mb-2'>
                      <h2 className='text-sm font-semibold text-stone-700'>Getting Started</h2>
                      <span className='text-xs text-stone-400'>{completedCount} of {progressSteps.length} complete</span>
                    </div>
                    <div className='w-full h-1.5 bg-stone-100 rounded-full overflow-hidden mb-4'>
                      <div
                        className='h-full bg-[#1B5A1B] rounded-full transition-all duration-500'
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className='space-y-2.5'>
                      {progressSteps.slice(0, 4).map((step, i) => (
                        <div key={i} className='flex items-start gap-2.5'>
                          <div className={`mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center border ${step.completed ? 'bg-[#1B5A1B] border-[#1B5A1B]' : 'border-stone-300'}`}>
                            {step.completed && <CheckIcon size={9} className='text-white' />}
                          </div>
                          <p className={`text-sm leading-snug ${step.completed ? 'text-stone-400 line-through decoration-stone-300' : 'text-stone-700'}`}>
                            {step.title}
                          </p>
                        </div>
                      ))}
                    </div>
                    {progressSteps.length > 4 && (
                      <p className='mt-3 text-xs font-medium text-[#1B5A1B] cursor-pointer hover:underline'>
                        +{progressSteps.length - 4} more steps →
                      </p>
                    )}
                  </div>
                );
              })()}

              {/* UPCOMING EVENTS */}
              <div className='bg-white rounded-2xl border border-stone-200 p-5'>
                <h2 className='text-sm font-semibold text-stone-700 mb-3'>Upcoming</h2>
                {birthdays.length === 0 && anniversary.length === 0 ? (
                  <p className='text-sm text-stone-400 py-2'>No upcoming events</p>
                ) : (
                  <div className='space-y-2'>
                    {(birthdays as any[]).map((person, index) => (
                      <div key={`b-${index}`} className='flex items-center gap-3 py-2 border-b border-stone-100 last:border-0'>
                        <span className='w-7 h-7 flex items-center justify-center rounded-full bg-[#EAF1E5] flex-shrink-0'>
                          <GiftIcon size={13} className='text-[#1B5A1B]' />
                        </span>
                        <div className='min-w-0'>
                          <p className='text-sm font-medium text-stone-800 truncate'>{person.name}</p>
                          <p className='text-xs text-stone-400'>Birthday</p>
                        </div>
                      </div>
                    ))}
                    {(anniversary as any[]).map((person, index) => (
                      <div key={`a-${index}`} className='flex items-center gap-3 py-2 border-b border-stone-100 last:border-0'>
                        <span className='w-7 h-7 flex items-center justify-center rounded-full bg-[#EAF1E5] flex-shrink-0'>
                          <CalendarHeartIcon size={13} className='text-[#1B5A1B]' />
                        </span>
                        <div className='min-w-0'>
                          <p className='text-sm font-medium text-stone-800 truncate'>{person.name}</p>
                          <p className='text-xs text-stone-400'>Anniversary</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* MEMORIES CAROUSEL */}
              <div className='bg-white rounded-2xl border border-stone-200 p-5'>
                <h2 className='text-sm font-semibold text-stone-700 mb-3'>Memories</h2>
                {memoryPhotos.length > 0 ? (
                  <>
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
                  </>
                ) : (
                  <div className='flex flex-col items-center justify-center py-10 text-center'>
                    <Image
                      src='/images/no-memories.svg'
                      alt='No memories'
                      width={200}
                      height={200}
                      className='mb-4 opacity-70'
                    />
                    <h3 className='text-lg text-[#1B5A1B] font-semibold mb-2'>No Memories Yet</h3>
                    <p className='text-sm text-gray-600'>
                      Start capturing and preserving your family&apos;s precious moments.
                      Upload your first memory and watch your family story unfold.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* SECOND COLUMN */}
            <div className='space-y-4'>
              {/* MONTHLY UPDATES */}
              <div className='bg-white rounded-2xl border border-stone-200 p-5'>
                <h2 className='text-sm font-semibold text-stone-700 mb-3'>Monthly Updates</h2>
                {monthlyUpdatesList.length > 0 ? (
                  <div className='space-y-2'>
                    {monthlyUpdatesList.map((item, index) => (
                      <div key={index} className='flex items-start gap-2.5 py-2 border-b border-stone-100 last:border-0'>
                        <span className='mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1B5A1B] flex-shrink-0' />
                        <p className='text-sm text-stone-700'>{item}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center text-gray-500 py-4'>
                    <p className='text-sm text-stone-400 py-2'>No updates this month</p>
                  </div>
                )}
              </div>
            </div>
          </div>
    </div>
  );
};

export default Content;
