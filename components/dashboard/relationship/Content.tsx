import React, { useState } from 'react';
import ConnectionCard from '../content/ConnectionCard';
import relationshipService from '@/services/api/relationshipService';
import Loading from './Loading';
import { Input } from '@/components/ui/input';

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
    setIsSearching(true);
    setSearchResults([]);
    const data = await relationshipService.findSimilarPersons(formData);
    setSearchResults(data);
    setIsSearching(false);
    console.log('Similar persons found:', data);
  };

  return (
    <div className='bg-[#DFDFDF]  p-[1.5rem] h-full rounded-[4px]'>
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
              <Input label="First Name" type="text" name="firstName" id="first-name" value={formData.firstName} onChange={handleInputChange} />
              <Input label="Middle Name" type="text" name="middleName" id="middle-name" value={formData.middleName} onChange={handleInputChange} />
              <Input label="Last Name" type="text" name="lastName" id="last-name" value={formData.lastName} onChange={handleInputChange} />
            </div>

            <div className='grid grid-cols-[calc(70%-1rem)_30%] gap-x-[1rem] mt-[2rem]'>
              <Input label="Birth Place" type="text" name="birthPlace" id="birthPlace" value={formData.birthPlace} onChange={handleInputChange} />
              <Input label="Birthdate" type="date" name="birthdate" id="birthdate" value={formData.birthdate} onChange={handleInputChange} />
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

            {
              searchResults.length == 0 && !isSearching && (
                <div className='flex flex-col gap-4 px-4 justify-center h-[100%]'>
                  <p className='text-[1.2rem] text-gray-500'>No results found</p>
                </div>
              )
            }
            {
              isSearching && (
                <div className='flex gap-4 w-full'>
                  <Loading />
                  <Loading />
                  <Loading />
                </div>
              )
            }
            
          </div>
        </div>
      </div>  
    </div>
  );
};

export default Content;