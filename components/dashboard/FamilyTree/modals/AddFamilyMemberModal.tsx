"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CircleXIcon } from 'lucide-react';
import Image from 'next/image';
import { familyMemberSchema } from '@/lib/schema';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES } from '@/lib/constants';
import { useTree } from '@/providers/TreeProvider';

const AddFamilyMemberModal = () => {
  const [selectedPerson, setSelectedPerson] = useState('Add Child');
  const {
    toggleAddFamilyModal,
    handleAddFamilyMember,
    selectedNode,
    isFetching
  } = useTree();

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    birthdate: '',
    birthPlace: '',
    birthCountry: '',
    sex: 'male',
    status: 'unknown',
    nationality: [] as string[],
    profilePicture: null as File | null,
  });
  const [picturePreview, setPicturePreview] = useState<string | null>(null);
  const [nationalityInput, setNationalityInput] = useState('');
  const [errors, setErrors] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    birthdate: '',
    birthPlace: '',
    nationality: '',
    profilePicture: '',
  });

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          profilePicture: 'Invalid file type. Please upload JPEG, PNG, or GIF.',
        }));
        return;
      }

      // Validate file size (5MB max)
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setErrors(prev => ({
          ...prev,
          profilePicture: 'File too large. Maximum size is 5MB.',
        }));
        return;
      }

      // Update form data with file
      setFormData(prev => ({ ...prev, profilePicture: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePicture = () => {
    setFormData(prev => ({ ...prev, profilePicture: null }));
    setPicturePreview(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Create FormData object to handle file upload
    const submitData = new FormData();

    // Add nodeId to FormData
    submitData.append('nodeId', selectedNode);

    // Add general information
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'sex') return;
      if (key === 'profilePicture' && value instanceof File) {
        submitData.append('generalInformation[profilePicture]', value);
      } else if (key === 'nationality' && Array.isArray(value)) {
        submitData.append('generalInformation[nationality]', JSON.stringify(value));
      } else if (typeof value === 'string') {
        submitData.append(`generalInformation[${key}]`, value);
      }
    });

    // Add vital information
    if (formData.sex) {
      submitData.append('vitalInformation[sex]', formData.sex);
    }

    const result = familyMemberSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors = result.error.format();
      setErrors({
        firstName: formattedErrors.firstName?._errors.join(', ') || '',
        middleName: formattedErrors.middleName?._errors.join(', ') || '',
        lastName: formattedErrors.lastName?._errors.join(', ') || '',
        suffix: formattedErrors.suffix?._errors.join(', ') || '',
        birthdate: formattedErrors.birthdate?._errors.join(', ') || '',
        birthPlace: formattedErrors.birthPlace?._errors.join(', ') || '',
        nationality: formattedErrors.nationality?._errors.join(', ') || '',
        profilePicture: formattedErrors.profilePicture?._errors.join(', ') || '',
      });
      return;
    }
    handleAddFamilyMember(selectedPerson, submitData);
  };

  const handleAddNationality = () => {
    if (nationalityInput.trim()) {
      setFormData((prevData) => ({
        ...prevData,
        nationality: [...prevData.nationality, nationalityInput.trim()],
      }));
      setNationalityInput('');
    }
  };

  return (
    <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-black/50 z-10">
      <motion.form
        initial={{ y: '-10%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        exit={{ y: '-15%', opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="
          relative
          flex
          flex-col
          gap-2
          bg-white
          w-[95%]
          max-w-[500px]
          rounded-[10px]
          py-2
          px-4
          max-h-[90vh]
          overflow-y-auto
          sm:w-[500px]
        "
        onSubmit={handleSubmit}
      >
        <div
          className="absolute top-2 right-2 cursor-pointer"
          onClick={() => toggleAddFamilyModal()}
        >
          <CircleXIcon size={24} />
        </div>

        <div className="grid grid-cols-2 text-center mb-4">
          {['Add Child', 'Add Parent'].map(link => (
            <button
              type="button"
              className={`
                text-base
                sm:text-[1.5rem]
                border-b-1
                border-primary
                transition
                hover:border-b-2
                hover:text-primary
                text-muted-foreground
                cursor-pointer
                duration-300
                ${selectedPerson === link ? 'border-b-2 text-primary' : ''}
              `}
              key={link}
              onClick={() => setSelectedPerson(link)}
            >
              {link}
            </button>
          ))}
        </div>

        {/* NAME DETAILS */}
        <div className='flex flex-wrap mt-2 w-full gap-2'>
          <div className='relative flex flex-col flex-grow'>
            <label className='absolute -top-5 left-0 text-sm text-gray-600 mb-1 font-semibold'>Full Name</label>
            <input
              type="text"
              placeholder='First Name'
              className='border flex-1 outline-none hover:bg-white/50 rounded px-2 py-1 text-sm sm:text-base'
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            {errors.firstName && <span className="absolute -bottom-6 left-0 text-red-500 text-xs sm:text-sm">{errors.firstName}</span>}
          </div>
          <input
            type="text"
            placeholder='Middle Name (optional)'
            className='border outline-none hover:bg-white/50 rounded px-2 py-1 flex-grow text-sm sm:text-base'
            value={formData.middleName}
            onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
          />
          <div className='relative flex-grow'>
            <input
              type="text"
              placeholder='Last Name'
              className='border w-full outline-none hover:bg-white/50 rounded px-2 py-1 flex-grow text-sm sm:text-base'
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
            {errors.lastName && <span className="absolute -bottom-6 left-0 text-red-500 text-xs sm:text-sm">{errors.lastName}</span>}
          </div>
          <input
            type="text"
            placeholder='Suffix'
            className='border outline-none hover:bg-white/50 rounded px-2 py-1 flex-grow-0 text-sm sm:text-base'
            value={formData.suffix}
            onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
          />
        </div>
        {/* BIRTH DETAILS */}
        <div className='flex flex-wrap mt-4 w-full gap-2'>
          <div className='relative flex flex-col'>
            <label className='absolute -top-5 left-0 text-sm text-gray-600 mb-1 font-semibold'>Birth Details</label>
            <input
              type="date"
              value={formData.birthdate}
              onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
            />
            {errors.birthdate && <span className="absolute -bottom-6 left-0 text-red-500 text-xs sm:text-sm">{errors.birthdate}</span>}
          </div>
          <input
            type="text"
            placeholder='Birth Place'
            className='border outline-none hover:bg-white/50 rounded px-2 py-1 text-sm sm:text-base'
            value={formData.birthPlace}
            onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
          />
          <input
            type="text"
            placeholder='Birth Country'
            className='border outline-none hover:bg-white/50 rounded px-2 py-1 text-sm sm:text-base'
            value={formData.birthCountry}
            onChange={(e) => setFormData({ ...formData, birthCountry: e.target.value })}
          />
        </div>

        {/* SEX */}
        <div className='flex flex-col sm:flex-row gap-4 px-4 items-center'>
          <div className='flex flex-col gap-2 w-full sm:w-1/2'>
            <label className='text-md font-semibold'>Sex</label>
            <div className='flex flex-row ml-4 gap-4'>
              <label htmlFor="male" className='flex items-center gap-1'>
                <input
                  type="radio"
                  id="male"
                  name="sex"
                  value="male"
                  className='border rounded'
                  checked={formData.sex === 'male'}
                  onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                />
                Male
              </label>
              <label htmlFor="female" className='flex items-center gap-1'>
                <input
                  type="radio"
                  id="female"
                  name="sex"
                  value="female"
                  className='border rounded'
                  checked={formData.sex === 'female'}
                  onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                />
                Female
              </label>
            </div>
          </div>

          {/* STATUS */}
          <div className='flex flex-col gap-2 w-full sm:w-1/2'>
            <label className='text-md font-semibold'>Status</label>
            <div className='flex flex-row ml-4 gap-4'>
              <label htmlFor="living" className='flex items-center gap-1'>
                <input
                  type="radio"
                  id="living"
                  name="status"
                  value="living"
                  className='border rounded'
                  checked={formData.status === 'living'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                />
                Living
              </label>
              <label htmlFor="deceased" className='flex items-center gap-1'>
                <input
                  type="radio"
                  id="deceased"
                  name="status"
                  value="deceased"
                  className='border rounded'
                  checked={formData.status === 'deceased'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                />
                Deceased
              </label>
              <label htmlFor="unknown" className='flex items-center gap-1'>
                <input
                  type="radio"
                  id="unknown"
                  name="status"
                  value="unknown"
                  className='border rounded'
                  checked={formData.status === 'unknown'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                />
                Unknown
              </label>
            </div>
          </div>
        </div>

        {/* NATIONALITY */}
        <div className='relative flex justify-start flex-col items-start gap-2 px-4'>
          <label className='text-md font-semibold'>Nationality</label>
          <div className='flex gap-2'>
            <input
              type="text"
              placeholder='Add Nationality'
              className='border rounded px-2 py-1 text-sm sm:text-base'
              value={nationalityInput}
              onChange={(e) => setNationalityInput(e.target.value)}
            />
            <button type="button" onClick={handleAddNationality} className='bg-primary hover:bg-primary/70 transition-colors duration-300 text-white px-2 py-1 rounded-md text-sm sm:text-base'>+</button>
          </div>
          <div className='flex flex-wrap gap-2 mt-2'>
            {formData.nationality.map((nat, index) => (
              <span key={index} className='bg-gray-200 px-2 py-1 rounded-md text-sm sm:text-base'>{nat}</span>
            ))}
          </div>
          {errors.nationality && <span className="absolute -bottom-6 left-5 text-red-500 text-xs sm:text-sm">{errors.nationality}</span>}
        </div>

        {/* PROFILE PICTURE */}
        <div className='flex flex-col gap-2 px-4'>
          <label className='text-md font-semibold'>Profile Picture</label>
          <div className='flex items-center gap-4'>
            <input
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(',')}
              onChange={handlePictureChange}
              className='hidden'
              id="profilePicture"
            />
            <label
              htmlFor="profilePicture"
              className='bg-primary hover:bg-primary/70 transition-colors duration-300 text-white px-4 py-2 rounded-md cursor-pointer text-sm sm:text-base'
            >
              Upload Picture
            </label>
            {picturePreview && (
              <div className='relative'>
                <Image
                  src={picturePreview}
                  alt="Profile Preview"
                  width={80}
                  height={80}
                  className='w-20 h-20 object-cover rounded-full'
                />
                <button
                  type="button"
                  onClick={handleRemovePicture}
                  className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600'
                >
                  ×
                </button>
              </div>
            )}
          </div>
          {errors.profilePicture && (
            <span className="text-red-500 text-sm">{errors.profilePicture}</span>
          )}
        </div>

        {/* BUTTONS */}
        <div className='flex justify-center px-4 gap-4 mt-4'>
          <button type="button" onClick={() => toggleAddFamilyModal()} className='bg-white-500 text-black border-1 border-green px-3 py-1 rounded-md text-sm sm:text-base sm:px-4 sm:py-2'>Cancel</button>
          <button disabled={isFetching} type="submit" className='bg-primary hover:bg-primary/70 transition-colors duration-300 text-white px-3 py-1 rounded-md text-sm sm:text-base sm:px-4 sm:py-2'>{isFetching ? 'Submitting...' : 'Save'}</button>
        </div>
      </motion.form>
    </div>
  );
};

export default AddFamilyMemberModal;
