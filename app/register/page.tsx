"use client";
import NavBar from '@/components/common/NavBar';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Terms from './_components/Terms';
const RegisterForm = dynamic(() => import('@/components/forms/RegisterForm'), { ssr: false });

const Page = () => {
  return (
    <div className="relative min-h-screen">
      <NavBar />

      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="relative w-full lg:w-[65%] h-[50vh] lg:h-screen">
          <video 
            className="absolute top-0 left-0 w-full h-full object-cover" 
            autoPlay 
            loop 
            muted
          >
            <source src="/videos/backgroundHome.mp4" type="video/mp4" />
          </video>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
            <h1 className="text-2xl md:text-[3rem] font-semibold mb-4">Welcome to AncesTREE</h1>
            <p className="text-sm md:text-lg mb-6">Unraveling Ancestral Lineages through Geographical History</p>
            <Link 
              href="" 
              className="py-2 px-4 text-sm md:text-[0.9rem] rounded-[3px] bg-primary hover:text-primary hover:bg-hover transition-colors duration-200"
            >
              GET STARTED
            </Link>
          </div>
          <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
        </div>

        <div className="w-full lg:w-[35%] bg-[#658165] flex flex-col justify-center items-center px-4 md:px-[5rem] py-8 lg:py-0">
          <RegisterForm />
        </div>
      </div>
      <Terms />
    </div>
  );
};

export default Page;
