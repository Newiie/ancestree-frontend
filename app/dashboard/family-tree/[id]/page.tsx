"use client"
import Content from '@/components/dashboard/FamilyTree/Content'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { CircleXIcon } from 'lucide-react'
import FamilyTreeSkeleton from './loading'
import { 
  familyMemberSchema, 
  editPersonSchema,
  connectPersonSchema,
 } from '@/lib/schema';
import { TreeProvider, useTree } from '../../../../providers/TreeProvider'
import Image from 'next/image'

const AddFamilyMember = () => {
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
    nationality: [],
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
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          profilePicture: 'Invalid file type. Please upload JPEG, PNG, or GIF.',
        }));
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
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
    console.log("FORM DATA", formData);
    const submitData = new FormData();

    // Add nodeId to FormData
    submitData.append('nodeId', selectedNode);

    // Add general information
    Object.entries(formData).forEach(([key, value]) => {
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
      setFormData((prevData: any) => ({
        ...prevData,
        nationality: prevData.nationality ? [...prevData.nationality, nationalityInput.trim()] : [nationalityInput.trim()],
        profilePicture: prevData.profilePicture || ''
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
        className="relative flex flex-col gap-2 bg-white w-[500px] rounded-[10px] py-2"
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
            <li
              className={`text-[1.5rem] border-b-1 border-primary transition hover:border-b-2 hover:text-primary text-muted-foreground cursor-pointer duration-300 ${
                selectedPerson === link ? 'border-b-2 text-primary' : ''
              }`}
              style={{ listStyle: 'none' }}
              key={link}
              onClick={() => setSelectedPerson(link)}
            >
              {link}
            </li>
          ))}
        </div>

        {/* NAME DETAILS */}
        <div className='flex flex-wrap mt-2 w-full gap-2 px-4'>
          <div className='relative flex flex-col flex-grow'>
            <label className='absolute -top-5 left-0 text-sm text-gray-600 mb-1 font-semibold'>Full Name</label>
            <input
              type="text"
              placeholder='First Name'
              className='border flex-1 outline-none hover:bg-white/50 rounded px-2 py-1'
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            {errors.firstName && <span className="absolute -bottom-6 left-0 text-red-500">{errors.firstName}</span>}
          </div>
          <input
            type="text"
            placeholder='Middle Name (optional)'
            className='border outline-none hover:bg-white/50 rounded px-2 py-1 flex-grow'
            value={formData.middleName}
            onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
          />
          <div className='relative flex-grow'>
            <input
              type="text"
              placeholder='Last Name'
              className='border w-full outline-none hover:bg-white/50 rounded px-2 py-1 flex-grow'
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
            {errors.lastName && <span className="absolute -bottom-6 left-0 text-red-500">{errors.lastName}</span>}
          </div>
          <input
            type="text"
            placeholder='Suffix'
            className='border outline-none hover:bg-white/50  rounded px-2 py-1 flex-grow-0'
            value={formData.suffix}
            onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
          />
        </div>
        {/* BIRTH DETAILS */}
        <div className='flex flex-wrap mt-4 w-full gap-2 px-4'>
          <div className='relative flex flex-col'>
            <label className='absolute -top-5 left-0 text-sm text-gray-600 mb-1 font-semibold'>Birth Details</label>
            <input
              type="date"
              value={formData.birthdate}
              onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
            />
            {errors.birthdate && <span className="absolute -bottom-6 left-0 text-red-500">{errors.birthdate}</span>}
          </div>
          <input
            type="text"
            placeholder='Birth Place'
            className='border outline-none rounded px-2 py-1'
            value={formData.birthPlace}
            onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
          />
          <input
            type="text"
            placeholder='Birth Country'
            className='border outline-none rounded px-2 py-1'
            value={formData.birthCountry}
            onChange={(e) => setFormData({ ...formData, birthCountry: e.target.value })}
          />
        </div>

        {/* SEX */}
        <div className='flex flex-col gap-2 px-4'>
          <label className='text-md font-semibold'>Sex</label>

          <div className='flex flex-col ml-4 '>
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
        <div className='flex flex-col gap-2 px-4'>
          <label className='text-md font-semibold'>Status</label>

          <div className='flex flex-col ml-4 '>
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

        {/* NATIONALITY */}
        <div className='relative flex justify-start flex-col items-start gap-2 px-4'>
          <label className='text-md font-semibold'>Nationality</label>
          <div className='flex gap-2'>
            <input
              type="text"
              placeholder='Add Nationality'
              className='border rounded px-2 py-1'
              value={nationalityInput}
              onChange={(e) => setNationalityInput(e.target.value)}
            />
            <button type="button" onClick={handleAddNationality} className='bg-primary hover:bg-primary/70 transition-colors duration-300 text-white px-2 py-1 rounded-md'>+</button>
          </div>
          <div className='flex flex-wrap gap-2 mt-2'>
            {formData.nationality.map((nat, index) => (
              <span key={index} className='bg-gray-200 px-2 py-1 rounded-md'>{nat}</span>
            ))}
          </div>
          {errors.nationality && <span className="absolute -bottom-6 left-5 text-red-500">{errors.nationality}</span>}
        </div>  

        {/* PROFILE PICTURE */}
        <div className='flex flex-col gap-2 px-4'>
          <label className='text-md font-semibold'>Profile Picture</label>
          <div className='flex items-center gap-4'>
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handlePictureChange}
              className='hidden'
              id="profilePicture"
            />
            <label
              htmlFor="profilePicture"
              className='bg-primary hover:bg-primary/70 transition-colors duration-300 text-white px-4 py-2 rounded-md cursor-pointer'
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
        <div className='flex justify-center px-4 gap-4'>
          <button type="button" onClick={() => toggleAddFamilyModal()} className='bg-white-500 text-black border-1 border-green px-4 py-1 rounded-md'>Cancel</button>
          <button disabled={isFetching} type="submit" className='bg-primary hover:bg-primary/70 transition-colors duration-300 text-white px-4 py-1 rounded-md'>{isFetching ? 'Submitting...' : 'Save'}</button> 
        </div>
      </motion.form>
    </div>
  );
};

const EditPersonNode = () => {
  const { toggleEditPersonModal, handleEditPerson, isFetching, selectedNode, handleDeletePersonNode } = useTree();
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
    profilePicture: null as File | null,
  });
  const [picturePreview, setPicturePreview] = useState<string | null>(null);

  const [errors, setErrors] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    birthdate: '',
    birthPlace: '',
    birthCountry: '',
    profilePicture: '',
  });

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          profilePicture: 'Invalid file type. Please upload JPEG, PNG, or GIF.',
        }));
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
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

    // Add general information
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'profilePicture' && value instanceof File) {
        submitData.append('generalInformation[profilePicture]', value);
      } else if (typeof value === 'string') {
        submitData.append(`generalInformation[${key}]`, value);
      }
    });

    // Add vital information
    if (formData.sex) {
      submitData.append('vitalInformation[sex]', formData.sex);
    }

    const result = editPersonSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors = result.error.format();
      setErrors({
        firstName: formattedErrors.firstName?._errors.join(', ') || '',
        middleName: formattedErrors.middleName?._errors.join(', ') || '',
        lastName: formattedErrors.lastName?._errors.join(', ') || '',
        suffix: formattedErrors.suffix?._errors.join(', ') || '',
        birthdate: formattedErrors.birthdate?._errors.join(', ') || '',
        birthPlace: formattedErrors.birthPlace?._errors.join(', ') || '',
        birthCountry: formattedErrors.birthCountry?._errors.join(', ') || '',
        profilePicture: '',
      });
      return;
    }
    handleEditPerson(submitData);
  };

  return (
    <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-black/50 z-10">
      <motion.form
        initial={{ y: '-10%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        exit={{ y: '-15%', opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative flex flex-col gap-4 bg-white w-[500px] rounded-[10px] py-2"
        onSubmit={handleSubmit}
      >
        <div
          className="absolute top-2 right-2 cursor-pointer"
          onClick={() => toggleEditPersonModal()}
        >
          <CircleXIcon size={24} />
        </div>
        <div className='text-2xl px-4 font-bold'>Edit Person</div>
        {/* NAME DETAILS */}
        <div className='flex flex-wrap mt-2 w-full gap-2 px-4'>
          <div className='relative flex flex-col flex-grow'>
            <label className='absolute -top-5 left-0 text-sm text-gray-600 mb-1 font-semibold'>Full Name</label>
            <input
              type="text"
              placeholder='First Name'
              className='border flex-1 outline-none hover:bg-white/50 rounded px-2 py-1'
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            {errors.firstName && <span className="absolute -bottom-6 left-0 text-red-500">{errors.firstName}</span>}
          </div>
          <input
            type="text"
            placeholder='Middle Name (optional)'
            className='border outline-none hover:bg-white/50 rounded px-2 py-1 flex-grow'
            value={formData.middleName}
            onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
          />
          <div className='relative flex-grow'>
            <input
              type="text"
              placeholder='Last Name'
              className='border w-full outline-none hover:bg-white/50 rounded px-2 py-1 flex-grow'
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
            {errors.lastName && <span className="absolute -bottom-6 left-0 text-red-500">{errors.lastName}</span>}
          </div>
          <input
            type="text"
            placeholder='Suffix'
            className='border outline-none hover:bg-white/50  rounded px-2 py-1 flex-grow-0'
            value={formData.suffix}
            onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
          />
        </div>
        {/* BIRTH DETAILS */}
        <div className='flex flex-wrap mt-4 w-full gap-2 px-4'>
          <div className='relative flex flex-col'>
            <label className='absolute -top-5 left-0 text-sm text-gray-600 mb-1 font-semibold'>Birth Date</label>
            <input
              type="date"
              value={formData.birthdate}
              onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
            />
            {errors.birthdate && <span className="absolute -bottom-6 left-0 text-red-500">{errors.birthdate}</span>}
          </div>
          <input
            type="text"
            placeholder='Birth Place'
            className='border outline-none hover:bg-white/50 rounded px-2 py-1'
            value={formData.birthPlace}
            onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
          />
          <input
            type="text"
            placeholder='Birth Country'
            className='border outline-none hover:bg-white/50 rounded px-2 py-1'
            value={formData.birthCountry}
            onChange={(e) => setFormData({ ...formData, birthCountry: e.target.value })}
          />
        </div>

        {/* SEX */}
        <div className='flex flex-col gap-2 px-4'>
          <label className='text-md font-semibold'>Sex</label>

          <div className='flex flex-col ml-4 '>
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
        <div className='flex flex-col gap-2 px-4'>
          <label className='text-md font-semibold'>Status</label>

          <div className='flex flex-col ml-4 '>
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

        {/* PROFILE PICTURE */}
        <div className='flex flex-col gap-2 px-4'>
          <label className='text-md font-semibold'>Profile Picture</label>
          <div className='flex items-center gap-4'>
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handlePictureChange}
              className='hidden'
              id="editProfilePicture"
            />
            <label
              htmlFor="editProfilePicture"
              className='bg-primary hover:bg-primary/70 transition-colors duration-300 text-white px-4 py-2 rounded-md cursor-pointer'
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
        <div className='flex justify-center gap-4'>
          <button onClick={() => toggleEditPersonModal()} className='bg-white-500 text-black border-1 border-green px-4 py-1 rounded-md'>Cancel</button>
          <button disabled={isFetching} type="submit" className='bg-primary hover:bg-primary/70 transition-colors duration-300 text-white px-4 py-1 rounded-md'>{isFetching ? 'Submitting...' : 'Save'}</button> 
        </div>
      </motion.form>
    </div>
  );
};

const ConnectPersonModal = () => {
  const { 
    toggleConnectPersonModal,
    handleConnectPersonToUser
   } = useTree();
  const [userId, setUserId] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleConnectPersonToUser(userId);
  };
  return (
    <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-black/50 z-10">
      <motion.form
        initial={{ y: '-10%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        exit={{ y: '-15%', opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative flex flex-col gap-6 bg-white rounded-[10px] py-4 px-8"
        onSubmit={handleSubmit}
      >
        <div className='text-xl text-black/70 font-bold pr-4'>Connect Person to User</div>
        <div
          className="absolute top-4 right-2 cursor-pointer"
          onClick={() => toggleConnectPersonModal()}
        >
          <CircleXIcon 
            className='text-black/70 hover:text-black/50 transition-colors duration-300'
            size={24} 
          />
        </div>
        {/* NAME DETAILS */}
        <div className='flex flex-wrap mt-2 w-full gap-2'>
          <div className='relative flex flex-col flex-grow'>
            <label className='absolute -top-5 left-0 text-sm text-gray-600 mb-1 font-semibold'>User ID: </label>
            <input
              type="text"
              placeholder='User ID'
              className='border flex-1 outline-none hover:bg-white/50 rounded px-2 py-1'
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className='flex justify-end gap-4'>
          <button onClick={() => toggleConnectPersonModal()} className='bg-white hover:bg-[#DFDFDF] transition-colors duration-300 text-black border-1 border-green px-4 py-1 rounded-md'>Cancel</button>
          <button  className='bg-primary hover:bg-primary/70 transition-colors duration-300 text-white px-4 py-1 rounded-md' type='submit'>Connect</button> 
        </div>
      </motion.form>
    </div>
  )
}

const FamilyTreeContent = () => {
  const {
    addFamilyMember, 
    editPersonModal,
    showConnectPersonModal,
    isFetching
  } = useTree();

  if (isFetching) return <FamilyTreeSkeleton />;

  return (
    <div className="relative content | overflow-y-auto">
        <Content />
        <AnimatePresence>
        {showConnectPersonModal && <ConnectPersonModal />}
        {addFamilyMember && <AddFamilyMember />}
        {editPersonModal && <EditPersonNode />}
      </AnimatePresence>
    </div>
  )
}

const Page = ({ params }: { params: { id: string } }) => {
  const { id } = params; 

  return (
    <TreeProvider id={id}>
      <FamilyTreeContent />
    </TreeProvider>
  );
}

export default Page
