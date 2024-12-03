import React, { useState } from 'react';
import ConnectionCard from '../content/ConnectionCard';
import relationshipService from '@/services/api/relationshipService';
const FloatingInput = ({
  label,
  type,
  name,
  id,
  value,
  onChange,
}: {
  label: string;
  type: string;
  name: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const isActive = isFocused || value.length > 0;

  return (
    <div className="relative mt-4">
      <input
        className={`py-2 px-4 border-1 border-primary rounded-[4px] shadow-md w-full peer focus:outline-none`}
        type={type}
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <label
        className={`absolute left-4 transition-all duration-300 ease-in-out 
          ${(isActive || name === 'birthdate') ? 'top-[-20px] text-[0.8rem] text-primary' : 'top-[50%] text-[1rem] text-gray-500 translate-y-[-50%]'}`}
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
};

const Content = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    birthPlace: '',
    birthdate: ''
  });

  const [isSearching, setIsSearching] = useState<boolean>(false);  
  const [searchResults, setSearchResults] = useState([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSearch = async () => {
    console.log('Searching with data:', formData);
    const data = await relationshipService.findSimilarPersons(formData);
    setSearchResults(data);
    console.log('Similar persons found:', data);
  };

  return (
    <div className='bg-[#DFDFDF]  p-[1.5rem] h-[fit-content] rounded-[4px]'>
      <div className='bg-white rounded-[4px]'>
        <h2 className='text-primary font-bold text-[1.7rem] p-[1rem]'>Relationship</h2>
        <div className='bg-gradient-linear-navigation p-[1rem]  grid grid-cols-[40%_60%]'>
          <div className='text-white'>
            <h1 className='text-[2.5rem] font-bold'>Trace Your Roots with a Global Family Tree</h1>
            <p className='text-[1.2rem]'>Uncover your roots and trace your family connections. Discover ancestors and find out how your lineage intertwines with others.</p>
          </div>
          <form className='rounded-[4px] bg-white p-[1rem]' onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
            <div className='grid grid-cols-2 text-center  mb-[2rem]'>
              {['Find Person', 'Find by ID'].map(link => (
                <li
                  className='text-[1.5rem] border-b-1 border-primary transition hover:border-b-2 hover:text-primary text-muted-foreground cursor-pointer duration-300'
                  style={{ listStyle: 'none' }}
                  key={link}
                >
                  {link}
                </li>
              ))}
            </div>

            <div className='grid grid-cols-3 gap-x-[1rem] gap-y-[1rem] mt-[2rem]'>
              <FloatingInput label="First Name" type="text" name="firstName" id="first-name" value={formData.firstName} onChange={handleInputChange} />
              <FloatingInput label="Middle Name" type="text" name="middleName" id="middle-name" value={formData.middleName} onChange={handleInputChange} />
              <FloatingInput label="Last Name" type="text" name="lastName" id="last-name" value={formData.lastName} onChange={handleInputChange} />
            </div>

            <div className='grid grid-cols-[calc(70%-1rem)_30%] gap-x-[1rem] mt-[2rem]'>
              <FloatingInput label="Birth Place" type="text" name="birthPlace" id="birthPlace" value={formData.birthPlace} onChange={handleInputChange} />
              <FloatingInput label="Birthdate" type="date" name="birthdate" id="birthdate" value={formData.birthdate} onChange={handleInputChange} />
            </div>

            <div className='flex gap-[1rem] mt-[2rem]'>
              <button type="submit" className='py-[0.5rem] bg-btn-primary text-white font-bold px-[1rem] text-[0.9rem] rounded-[3px] hover:text-white hover:bg-primary transition-colors duration-400'>
                SEARCH
              </button>
              <button type="button" className='py-[0.5rem] text-primary px-[1rem] text-[0.9rem] rounded-[3px] cursor-pointer'>ADVANCE SEARCH</button>
            </div>
          </form>
        </div>

        <div className="p-4">
          <h3 className='text-primary font-bold text-[1.7rem] p-[1rem]'>Results</h3>
          <div className='grid grid-cols-3 gap-4'>
            {searchResults.map((result : any) => (
              <ConnectionCard key={result.userId} result={result} />
            ))}
          </div>
        </div>
      </div>  
    </div>
  );
};

export default Content;