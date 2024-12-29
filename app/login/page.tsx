"use client"
import NavBar from '@/components/common/NavBar';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const LoginForm = dynamic(() => import('@/components/forms/LoginForm'), { ssr: false });

const Page = () => {
  return (
    <div className="relative min-h-screen">
      <NavBar />

      <div className="flex flex-col pt-[4rem] md:pt-[4rem] lg:flex-row min-h-screen">
        {/* Video Section */}
        <div className="relative w-full lg:w-[65%] h-[50vh] lg:h-screen order-2 lg:order-1">
          <video 
            className="absolute top-0 left-0 w-full h-full object-cover" 
            autoPlay 
            loop 
            muted
          >
            <source src="/videos/backgroundHome.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
            <h1 className="text-2xl md:text-3xl lg:text-[3rem] font-semibold text-shadow mb-4">
              Welcome to AncesTREE
            </h1>
            <p className="text-sm md:text-base lg:text-lg mb-6">
              Unraveling Ancestral Lineages through Geographical History
            </p>
            <Link 
              href="" 
              className="py-2 px-4 text-sm rounded-md bg-primary hover:bg-primary-dark transition-colors duration-200"
            >
              GET STARTED
            </Link>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="w-full lg:w-[35%] bg-[#658165] flex flex-col justify-center items-center px-4 md:px-10 lg:px-[3rem] order-2 lg:order-2 py-10 lg:py-0">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
