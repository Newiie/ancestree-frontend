import React, { useState } from 'react';
import ConnectionCard from '../content/ConnectionCard';

const FloatingInput = ({ label, type, name, id }: { label: string, type: string, name: string, id: string }) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className='relative mt-4'>
      <input
        className={`py-2 px-4 border-1 border-primary rounded-[4px] shadow-md w-full peer focus:outline-none`}
        type={type}
        name={name}
        id={id}
        value={inputValue}
        onChange={handleChange}
        required
      />
      <label 
        className={`absolute left-4 top-2 text-[1rem]  bg-white px-1 transition-all duration-300 ease-in-out peer-focus:top-[-10px] peer-focus:text-[0.8rem] peer-focus:text-primary peer-valid:top-[-10px] peer-valid:text-[0.8rem] peer-valid:text-primary`}
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
};

const Content = () => {
  return (
    <div className='bg-[#DFDFDF]  p-[1.5rem] h-[fit-content] rounded-[4px]'>
      <div className='bg-white rounded-[4px]'>
        <h2 className='text-primary font-bold text-[1.7rem] p-[1rem]'>Relationship</h2>
        <div className='bg-gradient-linear-navigation p-[1rem]  grid grid-cols-[40%_60%]'>
        <div className='text-white'>
          <h1 className='text-[2.5rem] font-bold'>Trace Your Roots with a Global Family Tree</h1>
          <p className='text-[1.2rem]'>Uncover your roots and trace your family connections. Discover ancestors and find out how your lineage intertwines with others.</p>
        </div>
        <form className='rounded-[4px] bg-white p-[1rem]'>
          <div className='grid grid-cols-2 text-center  mb-[3rem]'>
            {['Find Person', 'Find by ID'].map(link => {
              return (
                <li
                  className='text-[1.5rem] border-b-1 border-primary transition hover:border-b-2 hover:text-primary text-muted-foreground cursor-pointer duration-300'
                  style={{ listStyle: 'none' }}
                  key={link}
                >
                  {link}
                </li>
              );
            })}
          </div>

          <div className='grid grid-cols-3 gap-x-[1rem] gap-y-[1rem] mt-[2rem]'>
            <FloatingInput label="Last Name" type="text" name="last-name" id="last-name" />
            <FloatingInput label="First Name" type="text" name="first-name" id="first-name" />
            <FloatingInput label="Middle Name" type="text" name="middle-name" id="middle-name" />
          </div>

          <div className='grid grid-cols-[calc(70%-1rem)_30%] gap-x-[1rem] mt-[2rem]'>
            <FloatingInput label="Place" type="text" name="place" id="place" />
            <FloatingInput label="Birthyear" type="date" name="birthyear" id="birthyear" />
          </div>

          <div className='flex gap-[1rem] mt-[2rem]'>
            <button className='py-[0.5rem] bg-btn-primary text-white font-bold px-[1rem] text-[0.9rem] rounded-[3px] hover:text-white hover:bg-primary transition-colors duration-200'>
              SEARCH
            </button>
            <button className='py-[0.5rem] text-primary px-[1rem] text-[0.9rem] rounded-[3px] cursor-pointer'>ADVANCE SEARCH</button>
          </div>
        </form>
      </div>

      <div className="p-4">
        <h3 className='text-primary font-bold text-[1.7rem] p-[1rem]'>Results</h3>
        <div className='grid grid-cols-3 gap-4'>
          <ConnectionCard />
          <ConnectionCard />
          <ConnectionCard />
          <ConnectionCard />
          <ConnectionCard />
          <ConnectionCard />
          <ConnectionCard />
          <ConnectionCard />
          <ConnectionCard />
        </div>
      </div>
      </div>  
    </div>
  );
};

export default Content;
