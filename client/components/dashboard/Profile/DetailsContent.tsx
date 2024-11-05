import React, { useState, useEffect } from 'react';
import { useProfile } from '../../../providers/ProfileProvider';
import { SquarePenIcon, StarIcon } from 'lucide-react';
import ConnectionCard from '../content/ConnectionCard';
import useAuth from '@/hooks/useAuth';
import { z } from 'zod';
import { formDataSchema } from '@/lib/schema';
import { sectionConfigs } from '@/lib/constants';

const DetailsContent = () => {
  const { selectedDetail, profileTabs, userData, setUserData, updateUserData, isFetching } = useProfile();
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
      firstname: '',
      middlename: '',
      lastname: '',
      suffix: '',
      birthDate: '',
      birthPlace: '',
      birthingCenter: '',
      nationality: '',
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

  type FormDataKeys = keyof typeof formData;
  
  const listQuotes = [
    "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse..."
  ];

  useEffect(() => {
    if (!isFetching) {
      setFormData(userData || {});
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
    setFormData(userData); 
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
    const [section, field, index] = name.split('.'); 

    setFormData((prev: any) => {
      if (section === 'interests' && index !== undefined) {
        const interests = [...prev.interests];
        interests[parseInt(index)][field] = value;
        return { ...prev, interests };
      }
      
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      };
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

  

  const renderFields = (fields: { name: string; label: string; type?: string; options?: string[] }[], section: FormDataKeys) => {
    if (section === 'interests') {
      return (formData[section] || []).map((interest: { title: string, description: string }, index: number) => (
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
            </div>
          ) : (
            <p><strong>{interest.title}:</strong> {interest.description || 'No Description'}</p>
          )}
        </div>
      ));
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
            {field.type === 'select' ? (
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
                value={(formData[section] as Record<string, any>)[field.name] || ''}
                onChange={handleInputChange}
                className={inputStyles}
              />
            ) : (
              <input
                type='text'
                name={`${section}.${field.name}`}
                value={(formData[section] as Record<string, any>)[field.name] || ''}
                onChange={handleInputChange}
                className={inputStyles}
                placeholder={field.label}
              />
            )}
            {errors[`${section}.${field.name}`] && (
              <p className={errorStyles}>{errors[`${section}.${field.name}`]}</p>
            )}
          </>
        ) : (
          <p><strong>{field.label}:</strong> {(formData[section] as Record<string, any>)[field.name] || 'Unknown'}</p>
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
    <div className='p-4 relative'>
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

          {profileTabs === 'Personal Details' && (
            <>
              <h2 className='text-xl font-bold'>{selectedDetail}</h2>
              <div className='mt-4'>
                {selectedDetail === 'General Information' && renderSection('generalInformation', 'General Information')}
                {selectedDetail === 'Addresses' && renderSection('address', 'Current Address')}
                {selectedDetail === 'Vital Information' && renderSection('vitalInformation', 'Physical Attributes')}
                {selectedDetail === 'Personal Interests' && renderSection('interests', 'Interests')}
                {selectedDetail === 'Contact Information' && (
                  <>
                    {renderSection('personalContact', 'Personal Contact')}
                    {renderSection('emergencyContact', 'Emergency Contact')}
                  </>
                )}
              </div>
            </>
          )}

          {profileTabs === 'Profile Memo' && (
            <div>
              <h2 className='text-[1.5rem] font-bold'>Profile Memo</h2>
              <p className='text-center text-[2.5rem] w-[60%] mx-auto'>
                &quot;{formData.quotes.map((quote) => {
                  if (quote.isFavorite) {
                    return quote.quote;
                  }
                }) || 'No Profile Memo'}&quot;
              </p>
              <h4 className='text-[1.2rem] font-bold'>About Me</h4>
              {renderFields(sectionConfigs['aboutMe'], 'aboutMe')}
              <h4 className='text-[1.2rem] font-bold'>Quotes</h4>
              {renderFields(sectionConfigs['quotes'], 'quotes')}
            </div>
          )}

          {profileTabs === 'Connections' && (
            <div>
              <h2 className='text-[1.5rem] font-bold'>Connections</h2>
              <div className='grid grid-cols-3 gap-4'>
                <ConnectionCard />
                <ConnectionCard />
                <ConnectionCard />
                <ConnectionCard />
                <ConnectionCard />
                <ConnectionCard />
              </div>
            </div>
          )}

          {isEditing && (
            <div className='flex justify-end gap-4 mt-8'>
              <button className={`${buttonStyles} bg-red-500`} onClick={handleCancelClick}>Cancel</button>
              <button className={`${buttonStyles} bg-blue-500`} onClick={handleSaveClick}>Save</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DetailsContent;
