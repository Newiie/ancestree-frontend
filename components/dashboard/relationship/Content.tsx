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
  const [activeTab, setActiveTab] = useState('Find Person');

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
    <div className='bg-[#DFDFDF] p-4 sm:p-[1.5rem] h-[max-content] min-h-screen rounded-[4px]'>
      <div className='bg-white rounded-[4px]'>
        <h2 className='text-primary font-bold text-xl sm:text-[1.7rem] p-4 sm:p-[1rem]'>Relationship</h2>
        
        <div className='bg-gradient-linear-navigation p-4 sm:p-[1rem] grid grid-cols-1 md:grid-cols-[40%_60%] gap-4'>
          <div className='text-white text-center md:text-left'>
            <h1 className='text-2xl sm:text-[2.5rem] font-bold mb-2 sm:mb-4'>Trace Your Roots with a Global Family Tree</h1>
            <p className='text-base sm:text-[1.2rem]'>Uncover your roots and trace your family connections. Discover ancestors and find out how your lineage intertwines with others.</p>
          </div>
          
          <form 
            className='rounded-[4px] bg-white p-4 sm:p-[1rem]' 
            onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
          >
            {/* Tabs for Mobile and Desktop */}
            <div className='grid grid-cols-2 text-center mb-4 sm:mb-[2rem]'>
              {['Find Person', 'Find by ID'].map(link => (
                <li
                  key={link}
                  className={`
                    text-base sm:text-[1.5rem] 
                    border-b-1 border-primary 
                    transition hover:border-b-2 
                    hover:text-primary 
                    text-muted-foreground 
                    cursor-pointer 
                    duration-300
                    ${activeTab === link ? 'text-primary border-b-2' : ''}
                  `}
                  style={{ listStyle: 'none' }}
                  onClick={() => setActiveTab(link)}
                >
                  {link}
                </li>
              ))}
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-3 lg:gap-4 mt-4 sm:mt-[2rem]'>
              <Input 
                label="First Name" 
                type="text" 
                name="firstName" 
                id="first-name" 
                value={formData.firstName} 
                onChange={handleInputChange} 
              />
              <Input 
                label="Middle Name" 
                type="text" 
                name="middleName" 
                id="middle-name" 
                value={formData.middleName} 
                onChange={handleInputChange} 
              />
              <Input 
                label="Last Name" 
                type="text" 
                name="lastName" 
                id="last-name" 
                value={formData.lastName} 
                onChange={handleInputChange} 
              />
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-[calc(70%-1rem)_30%] gap-4 mt-4 sm:mt-[2rem]'>
              <Input 
                label="Birth Place" 
                type="text" 
                name="birthPlace"
                id="birthPlace"
                value={formData.birthPlace}
                onChange={handleInputChange} 
              />
              <Input 
                label="Birthdate" 
                type="date" 
                name="birthdate" 
                id="birthdate" 
                value={formData.birthdate} 
                onChange={handleInputChange} 
              />
            </div>

            <div className='flex flex-col sm:flex-row gap-4 mt-4 sm:mt-[2rem]'>
              <button 
                type="submit" 
                className='
                  w-full sm:w-auto 
                  py-[0.5rem] 
                  bg-btn-primary 
                  text-white 
                  font-bold 
                  px-[1rem] 
                  text-[0.9rem] 
                  rounded-[3px] 
                  hover:text-white 
                  hover:bg-primary 
                  transition-colors 
                  duration-400
                '
              >
                SEARCH
              </button>
              <button 
                type="button" 
                className='
                  w-full sm:w-auto 
                  py-[0.5rem] 
                  text-primary 
                  px-[1rem] 
                  text-[0.9rem] 
                  rounded-[3px] 
                  cursor-pointer
                '
              >
                ADVANCE SEARCH
              </button>
            </div>
          </form>
        </div>

        <div className="p-4">
          <h3 className='text-primary font-bold text-xl sm:text-[1.7rem] p-4 sm:p-[1rem]'>Results</h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {searchResults.map((result : any) => (
              <ConnectionCard key={result.userId} result={result} />
            ))}

            {
              searchResults.length == 0 && !isSearching && (
                <div className='col-span-full flex flex-col gap-4 px-4 justify-center h-[100%]'>
                  <p className='text-base sm:text-[1.2rem] text-gray-500 text-center'>No results found</p>
                </div>
              )
            }
            {
              isSearching && (
                <div className='col-span-full flex flex-wrap gap-4 w-full justify-center'>
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