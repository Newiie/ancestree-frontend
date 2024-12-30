import React, { useState, useEffect } from 'react';
import { useProfile } from '../../../providers/ProfileProvider';
import { SquarePenIcon, StarIcon } from 'lucide-react';
import ConnectionCard from '../content/ConnectionCard';
import useAuth from '@/hooks/useAuth';
import { z } from 'zod';
import { formDataSchema } from '@/lib/schema';
import { sectionConfigs } from '@/lib/constants';

const DetailsContent = () => {
  const { selectedDetail, profileTabs, userData, updateUserData, isFetching } = useProfile();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  
  const [formData, setFormData] = useState<{
    generalInformation: Record<string, any>;
    address: Record<string, any>;
    vitalInformation: Record<string, any>;
    interests: Array<{ title: string; description: string }>;
    personalContact: Record<string, any>;
    emergencyContact: Record<string, any>;
    aboutMe: string;
    quotes: Array<{ quote: string; isFavorite: boolean }>;
  }>({
    generalInformation: {
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      birthDate: '',
      birthPlace: '',
      birthingCenter: '',
      nationality: [] as string[],
      civilStatus: ''
    },
    address: {
      streetAddress: '',
      city: '',
      province: '',
      country: '',
      zipCode: ''
    },
    vitalInformation: {
      sex: '',
      height: '',
      weight: '',
      eyeColor: '',
      hairColor: '',
      bloodType: ''
    },
    interests: [
      { title: '', description: '' }
    ],
    personalContact: {
      email: '',
      phone: ''
    },
    emergencyContact: {
      name: '',
      phone: ''
    },
    aboutMe: '',
    quotes: [
      { quote: '', isFavorite: false }
    ]
  });

  const [tempArrayInput, setTempArrayInput] = useState<{[key: string]: string}>({});

  type FormDataKeys = keyof typeof formData;
  
  const listQuotes = [
    "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse..."
  ];

  const deepMerge = (target: any, source: any) => {
    for (const key of Object.keys(source)) {
      if (source[key] instanceof Object && key in target) {
        Object.assign(source[key], deepMerge(target[key], source[key]));
      }
    }
    return { ...target, ...source };
  };

  useEffect(() => {
    
    if (!isFetching && userData) {
      setFormData((prevFormData) => deepMerge(prevFormData, userData));
      if (userData === null) {
        setIsEditing(true);
      }
    }
  }, [userData, isFetching]);

  // STYLES
  const inputStyles = 'border rounded-md p-2 mt-1 mb-2 w-full'; 
  const buttonStyles = 'px-4 py-2 font-bold text-white rounded-md';
  const errorStyles = 'text-red-500 text-sm mt-1';

  const handleEditClick = () => setIsEditing(true);
  
  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData((prevFormData) => deepMerge(prevFormData, userData));
    setErrors({});
  };

  const handleSaveClick = () => {
    try {
      formDataSchema.parse(formData);
      setIsEditing(false);
      updateUserData(formData);
      setErrors({});
    } catch (e) {
      if (e instanceof z.ZodError) {
        const errorObj: any = {};
        e.errors.forEach(error => {
          const path = error.path.join('.');
          errorObj[path] = error.message;
        });
        setErrors(errorObj);
        console.log("ERRORS", errorObj);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nameParts = name.split('.');

    setFormData((prevData) => {
      const updatedData = { ...prevData };
      
      // Handle nested array inputs (like interests.0.title)
      if (nameParts.length === 3) {
        const [section, indexStr, field] = nameParts;
        const index = parseInt(indexStr, 10);
        
        // Create a copy of the current section array
        const updatedSection = [...(updatedData[section as FormDataKeys] as any || [])];
        
        // Update the specific item in the array
        updatedSection[index] = {
          ...updatedSection[index],
          [field]: value
        };
        
        // Update the entire section
        updatedData[section as FormDataKeys]  = updatedSection as any;
        
        return updatedData;
      }
      
      // Original single-level input handling
      const [section, field] = nameParts;
      const currentValue = updatedData[section as FormDataKeys] as any;

      // Check if the field is an array type
      if (sectionConfigs[section as FormDataKeys]?.find(f => f.name === field && f.type === 'array')) {
        // If the current value is not an array, convert it to an array
        if (!Array.isArray(currentValue[field])) {
          currentValue[field] = currentValue[field] ? [currentValue[field]] : [];
        }
        
        // Update temp input for this field
        setTempArrayInput(prev => ({
          ...prev,
          [field]: value
        }));
      } else {
        // Regular input handling
        currentValue[field] = value;
      }

      return updatedData;
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');

    setFormData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleAddArrayItem = (section: FormDataKeys, field: string) => {
    const inputValue = tempArrayInput[field]?.trim();
    if (inputValue) {
      setFormData((prevData) => {
        const updatedData = { ...prevData };
        const currentSection = updatedData[section];

        // Type guard to ensure we're working with an object that can have array fields
        if (typeof currentSection === 'object' && currentSection !== null) {
          // Type assertion to handle array fields
          const currentSectionWithArrays = currentSection as Record<string, any>;

          // Ensure the field is an array
          if (!Array.isArray(currentSectionWithArrays[field])) {
            currentSectionWithArrays[field] = [];
          }

          // Add the new item if it's not already in the array
          if (!currentSectionWithArrays[field].includes(inputValue)) {
            currentSectionWithArrays[field].push(inputValue);
          }
        }

        return updatedData;
      });

      // Reset the input after adding
      setTempArrayInput((prev) => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const renderFields = (fields: { name: string; label: string; type?: string; options?: string[] }[], section: FormDataKeys) => {

    if (section === 'interests') {
      return (
        <>
          {(formData[section] || []).map((interest: { title: string, description: string }, index: number) => (
            <div key={index} className='mb-1'>
              {isEditing ? (
                <div className='flex gap-2'>
                  <div className='flex flex-col'>
                    <label htmlFor={`${section}.${index}.title`}>Title:</label>
                    <input
                      type='text'
                      className={inputStyles}
                      name={`${section}.${index}.title`}
                      value={interest?.title || ''}
                      onChange={handleInputChange}
                      placeholder='Title'
                    />
                  </div>
                  <div className='flex flex-col w-full'>
                    <label htmlFor={`${section}.${index}.description`}>Description:</label>
                    <input
                      type='text'
                      className={inputStyles}
                      name={`${section}.${index}.description`}
                      value={interest?.description || ''}
                      onChange={handleInputChange}
                      placeholder='Description'
                    />
                  </div>
                  <button 
                    type='button' 
                    className='text-red-500 self-end'
                    onClick={() => {
                      const updatedInterests = [...(formData[section] || [])];
                      updatedInterests.splice(index, 1);
                      setFormData(prev => ({
                        ...prev,
                        [section]: updatedInterests
                      }));
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <p><strong>{interest.title}:</strong> {interest.description || 'No Description'}</p>
              )}
            </div>
          ))}
          
          {isEditing && (
            <button 
              type='button' 
              className={`${buttonStyles} mt-2`}
              name='interests.addInterest'
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  interests: [
                    ...(prev.interests || []), 
                    { title: '', description: '' }
                  ]
                }));
              }}
            >
              Add Interest
            </button>
          )}
        </>
      );
    }

    if (section === 'personalContact') {
      return fields.map((field) => (
      <div key={field.name} className='mb-1'>
        {isEditing ? (
          <input
            type='text'
            className={inputStyles}
            name={`${section}.${field.name}`}
            value={(formData[section] as Record<string, any>)[field.name] || ''}
            onChange={handleInputChange}
            placeholder={field.label}
          />
        ) : (
          <p><strong>{field.label}:</strong> {(formData["generalInformation"] as Record<string, any>)[field.name] || 'Unknown'}</p>
        )}
        </div>
      ));
    }

    if (section === 'aboutMe') {
      return (
        <div className='mb-1'>
          {isEditing ? (
            <textarea
              className={inputStyles}
              name='aboutMe'
              value={formData.aboutMe || ''}
              onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
              placeholder='About Me'
            />
          ) : (
            <p>{formData.aboutMe || 'No About Me'}</p>
          )}
        </div>
      );
    }

    if (section === 'quotes') {
      return formData.quotes.map((quote, index) => (
        <div key={index} className='mb-1'>
          {isEditing ? (
            <input
              type='text'
              className={inputStyles}
              name={`quotes.${index}.quote`}
              value={quote.quote || ''}
              onChange={(e) => {
                const newQuotes = [...formData.quotes];
                newQuotes[index].quote = e.target.value;
                setFormData({ ...formData, quotes: newQuotes });
              }}
              placeholder='Quote'
            />
          ) : (
            <p className='flex items-center gap-2'>Quote: {quote.quote}  <StarIcon className={`w-4 h-4 hover:cursor-pointer hover:text-yellow-500 transition-all duration-300 ${quote.isFavorite ? 'text-yellow-500' : 'text-gray-400'}`} /></p>
          )}
        </div>
      ));
    }

    return fields.map((field) => (
      <div key={field.name} className='mb-1'>
        {isEditing ? (
          <>
            {field.type === 'array' ? (
            <div>
              

              {/* Input and button to add new item */}
              <div className="flex gap-2 items-center mt-2">
                <input
                  type="text"
                  name={`${section}.${field.name}`}
                  value={tempArrayInput[field.name] || ''}
                  onChange={handleInputChange}
                  className={`${inputStyles} flex-grow`}
                  placeholder={`Add ${field.label}`}
                />
                <button
                  type="button"
                  onClick={() => handleAddArrayItem(section, field.name)}
                  className="bg-primary hover:bg-primary/70 transition-colors duration-300 text-white px-2 py-1 rounded-md"
                >
                  +
                </button>
              </div>
              {/* Display existing items */}
              <div className="mb-2">
                <strong>{field.label}:</strong>
                <div className="flex flex-wrap gap-2 mt-1">
                  {(formData[section] as Record<string, any>)[field.name]?.map((item: string, index: number) => (
                    <span key={index} className="flex items-center bg-gray-200 px-2 py-1 rounded-md text-sm">
                      {item}
                      <button 
                        type="button"
                        onClick={() => {
                          const updatedItems = [...(formData[section] as Record<string, any>)[field.name]];
                          updatedItems.splice(index, 1);
                          setFormData(prevData => ({
                            ...prevData,
                            [section]: {
                              ...(prevData[section] as Record<string, any>),
                              [field.name]: updatedItems
                            }
                          }));
                        }}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            ) : field.type === 'select' ? (
              <select
                name={`${section}.${field.name}`}
                value={(formData[section] as Record<string, any>)[field.name] || ''}
                onChange={handleSelectChange}
                className={inputStyles}
              >
                <option value=''>Select {field.label}</option>
                {field.options?.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : field.type === 'date' ? (
              <input
                type='date'
                name={`${section}.${field.name}`}
                value={typeof (formData[section] as Record<string, any>)[field.name] === 'string' 
                  ? (formData[section] as Record<string, any>)[field.name].slice(0, 10) 
                  : (formData[section] as Record<string, any>)[field.name] || ''}
                // value={new Date((formData[section] as Record<string, any>)[field.name]).toISOString().split('T')[0] || ''}
                onChange={handleInputChange}
                className={inputStyles}
              />
            ) : (
              <input
                type='text'
                name={`${section}.${field.name}`}
                value={Array.isArray((formData[section] as Record<string, any>)[field.name]) 
                  ? (formData[section] as Record<string, any>)[field.name].join(', ') 
                  : (formData[section] as Record<string, any>)[field.name] || ''}
                onChange={handleInputChange}
                className={inputStyles}
                placeholder={field.label}
              />
            )}
            {errors[`${section}.${field.name}`] && (
              <p className={errorStyles}>{errors[`${section}.${field.name}`]}</p>
            )}
          </>
        ) : field.type === 'array' ? (
            <div>
              <strong>{field.label}:</strong>
              <div className='flex flex-wrap gap-2 mt-1'>
                {(formData[section] as Record<string, any>)[field.name]?.map((item: string, index: number) => (
                  <span key={index} className='bg-gray-200 px-2 py-1 rounded-md text-sm'>{item}</span>
                ))}
              </div>
            </div>
          ) : (
            <p><strong>{field.label}:</strong> {Array.isArray((formData[section] as Record<string, any>)[field.name]) 
                    ? (formData[section] as Record<string, any>)[field.name].join(', ') 
                    : (formData[section] as Record<string, any>)[field.name] || 'Unknown'}</p>
          )}
      </div>
    ));
  };

  const renderSection = (sectionKey: FormDataKeys, title: string) => (
    <div>
      <h4 className='font-bold text-lg my-2'>{title}</h4>
      {renderFields(sectionConfigs[sectionKey as keyof typeof sectionConfigs],  sectionKey)}
    </div>
  );

  return (
    <div className='p-4 sm:p-6 relative'>
      {isFetching ? (
        <p>Loading...</p>
      ) : (
        <>
          {user?.id === userData?.userId && (
            <SquarePenIcon
              className='w-5 h-5 cursor-pointer absolute top-4 right-4'
              onClick={handleEditClick}
            />
          )}

          <div className={`${isEditing ? 'pb-20 md:pb-0' : ''}`}>
            {profileTabs === 'Personal Details' && (
              <>
                <h2 className='text-lg sm:text-xl font-bold'>{selectedDetail}</h2>
                <div className='mt-4'>
                  {selectedDetail === 'General Information' && renderSection('generalInformation', 'General Information')}
                  {selectedDetail === 'Addresses' && renderSection('address', 'Current Address')}
                  {selectedDetail === 'Vital Information' && renderSection('vitalInformation', 'Physical Attributes')}
                  {selectedDetail === 'Personal Interests' && renderSection('interests', 'Interests')}
                  {selectedDetail === 'Contact Information' && (
                    <div className='space-y-4'>
                      {renderSection('personalContact', 'Personal Contact')}
                      {renderSection('emergencyContact', 'Emergency Contact')}
                    </div>
                  )}
                </div>
              </>
            )}

            {profileTabs === 'Profile Memo' && (
              <div className='space-y-4'>
                <h2 className='text-xl sm:text-2xl font-bold'>Profile Memo</h2>
                <p className='text-center text-base sm:text-2xl md:text-[2.5rem] w-full md:w-[60%] mx-auto'>
                  &quot;{formData.quotes.find((quote) => quote.isFavorite)?.quote || 'No Profile Memo'}&quot;
                </p>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <h4 className='text-lg font-bold mb-2'>About Me</h4>
                    {renderFields(sectionConfigs['aboutMe'], 'aboutMe')}
                  </div>
                  <div>
                    <h4 className='text-lg font-bold mb-2'>Quotes</h4>
                    {renderFields(sectionConfigs['quotes'], 'quotes')}
                  </div>
                </div>
              </div>
            )}

            {profileTabs === 'Connections' && (
              <div>
                <h2 className='text-xl sm:text-2xl font-bold mb-4'>Connections</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {
                    userData?.friendsList.map((friend: any) => ( 
                      <ConnectionCard key={friend.userId} result={friend} />
                    ))
                  }
                </div>
              </div>
            )}
          </div>

          {isEditing && (
            <div className='hidden md:flex justify-end p-4'>
              <div className='flex justify-end gap-4 max-w-4xl'>
                <button 
                  className={`${buttonStyles} bg-red-500 w-full sm:w-auto`} 
                  onClick={handleCancelClick}
                >
                  Cancel
                </button>
                <button 
                  className={`${buttonStyles} bg-blue-500 w-full sm:w-auto`} 
                  onClick={handleSaveClick}
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {isEditing && (
            <div className='fixed flex md:hidden bottom-0 left-0 right-0 bg-white shadow-lg p-4 z-50'>
              <div className='flex justify-end gap-4 max-w-4xl mx-auto'>
                <button 
                  className={`${buttonStyles} bg-red-500 w-full sm:w-auto`} 
                  onClick={handleCancelClick}
                >
                  Cancel
                </button>
                <button 
                  className={`${buttonStyles} bg-blue-500 w-full sm:w-auto`} 
                  onClick={handleSaveClick}
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DetailsContent;
