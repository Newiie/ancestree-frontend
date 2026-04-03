import React, { useState } from 'react';
import ConnectionCard from '../content/ConnectionCard';
import relationshipService from '@/services/api/relationshipService';
import Loading from './Loading';

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
    setIsSearching(true);
    setSearchResults([]);
    const data = await relationshipService.findSimilarPersons(formData);
    setSearchResults(data);
    setIsSearching(false);
  };

  return (
    <div className='bg-stone-50 min-h-screen p-4 sm:p-6 space-y-6'>

      {/* PAGE HEADER */}
      <div className='bg-[#1B5A1B] rounded-2xl p-6 sm:p-8'>
        <p className='text-[#D4F3C0] text-xs font-semibold uppercase tracking-widest mb-2'>Relationships</p>
        <h1 className='text-white text-2xl sm:text-3xl font-bold leading-snug mb-1'>Find Family Connections</h1>
        <p className='text-white/60 text-sm'>Search by name or birth details to discover potential relatives in the global family tree.</p>
      </div>

      {/* SEARCH CARD */}
      <div className='bg-white rounded-2xl border border-stone-200 shadow-sm p-5 sm:p-6'>

        {/* Tab switcher */}
        <div className='flex gap-0 bg-stone-100 rounded-xl p-1 mb-6 w-fit'>
          {['Find Person', 'Find by ID'].map(tab => (
            <button
              key={tab}
              type='button'
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-white text-stone-800 shadow-sm shadow-stone-200'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Find by ID' && (
          <div className='mb-4 px-4 py-3 bg-stone-50 border border-dashed border-stone-200 rounded-xl text-sm text-stone-400 text-center'>
            Search by ID is coming soon
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className={`space-y-4 ${activeTab === 'Find by ID' ? 'opacity-40 pointer-events-none select-none' : ''}`}>
          {/* Name row */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
            {[
              { label: 'First Name', name: 'firstName', id: 'first-name' },
              { label: 'Middle Name', name: 'middleName', id: 'middle-name' },
              { label: 'Last Name', name: 'lastName', id: 'last-name' },
            ].map(({ label, name, id }) => (
              <div key={name} className='flex flex-col gap-1'>
                <label htmlFor={id} className='text-xs font-semibold text-stone-500 uppercase tracking-wide'>{label}</label>
                <input
                  type='text'
                  name={name}
                  id={id}
                  value={formData[name as keyof typeof formData]}
                  onChange={handleInputChange}
                  placeholder={label}
                  className='w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 bg-stone-50 placeholder:text-stone-400 focus:outline-none focus:border-[#1B5A1B]/50 focus:bg-white transition-colors'
                />
              </div>
            ))}
          </div>

          {/* Birth details row */}
          <div className='grid grid-cols-1 sm:grid-cols-[1fr_160px] gap-3'>
            <div className='flex flex-col gap-1'>
              <label htmlFor='birthPlace' className='text-xs font-semibold text-stone-500 uppercase tracking-wide'>Birth Place</label>
              <input
                type='text'
                name='birthPlace'
                id='birthPlace'
                value={formData.birthPlace}
                onChange={handleInputChange}
                placeholder='City or Province'
                className='w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 bg-stone-50 placeholder:text-stone-400 focus:outline-none focus:border-[#1B5A1B]/50 focus:bg-white transition-colors'
              />
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor='birthdate' className='text-xs font-semibold text-stone-500 uppercase tracking-wide'>Birthdate</label>
              <input
                type='date'
                name='birthdate'
                id='birthdate'
                value={formData.birthdate}
                onChange={handleInputChange}
                className='w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-600 bg-stone-50 focus:outline-none focus:border-[#1B5A1B]/50 focus:bg-white transition-colors'
              />
            </div>
          </div>

          {/* Actions */}
          <div className='flex items-center gap-3 pt-1'>
            <button
              type='submit'
              disabled={isSearching}
              className='px-6 py-2.5 bg-[#1B5A1B] hover:bg-[#1B5A1B]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors'
            >
              {isSearching ? 'Searching…' : 'Search'}
            </button>
            <button
              type='button'
              className='px-4 py-2.5 text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors'
            >
              Advanced Search
            </button>
          </div>
        </form>
      </div>

      {/* RESULTS */}
      <div>
        {isSearching && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            <Loading />
            <Loading />
            <Loading />
          </div>
        )}

        {!isSearching && searchResults.length > 0 && (
          <>
            <p className='text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3'>
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
            </p>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {searchResults.map((result: any) => (
                <ConnectionCard key={result.userId} result={result} />
              ))}
            </div>
          </>
        )}

        {!isSearching && searchResults.length === 0 && (
          <div className='bg-white rounded-2xl border border-stone-200 p-10 flex flex-col items-center text-center'>
            <div className='w-12 h-12 rounded-full bg-[#EAF1E5] flex items-center justify-center mb-4'>
              <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#1B5A1B' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
                <circle cx='11' cy='11' r='8'/><path d='m21 21-4.35-4.35'/>
              </svg>
            </div>
            <p className='text-sm font-semibold text-stone-700 mb-1'>Search for relatives</p>
            <p className='text-sm text-stone-400 max-w-xs'>Enter a name or birth details above to find potential family connections in the global tree.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Content;