"use client"
import Content from '@/components/dashboard/FamilyTree/Content'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { CircleXIcon } from 'lucide-react'
import FamilyTreeSkeleton from './loading'
import { familyMemberSchema, editPersonSchema } from '@/lib/schema';
import { TreeProvider, useTree } from '../../../../providers/TreeProvider'

const AddFamilyMember = () => {
  const [selectedPerson, setSelectedPerson] = useState('Add Child');
  const { toggleAddFamilyModal, handleAddFamilyMember } = useTree();

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
  });
  const [nationalityInput, setNationalityInput] = useState('');
  const [errors, setErrors] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    birthdate: '',
    birthPlace: '',
    nationality: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = familyMemberSchema.safeParse(formData);
    console.log(result);
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
      });
      return;
    }
    handleAddFamilyMember(selectedPerson, formData);
  };

  const handleAddNationality = () => {
    if (nationalityInput.trim()) {
      setFormData((prevData: any) => ({
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
        <div className='flex flex-col gap-1 px-4'>
          <label className='text-md font-semibold'>Status</label>

          <div className='flex flex-col ml-4'>
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
            <button type="button" onClick={handleAddNationality} className='bg-primary text-white px-2 py-1 rounded-md'>+</button>
          </div>
          <div className='flex flex-wrap gap-2 mt-2'>
            {formData.nationality.map((nat, index) => (
              <span key={index} className='bg-gray-200 px-2 py-1 rounded-md'>{nat}</span>
            ))}
          </div>
          {errors.nationality && <span className="absolute -bottom-6 left-5 text-red-500">{errors.nationality}</span>}
        </div>  

        {/* BUTTONS */}
        <div className='flex justify-center px-4 gap-4'>
          <button type="button" onClick={() => toggleAddFamilyModal()} className='bg-white-500 text-black border-1 border-green px-4 py-1 rounded-md'>Cancel</button>
          <button type="submit" className='bg-primary text-white px-4 py-1 rounded-md'>Add Member</button> 
        </div>
      </motion.form>
    </div>
  );
};

const EditPersonNode = () => {
  const { toggleEditPersonModal, handleEditPerson, handleDeletePersonNode } = useTree();
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
  });

  
  const [errors, setErrors] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    birthdate: '',
    birthPlace: '',
    birthCountry: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = editPersonSchema.safeParse(formData);
    console.log(formData)
    if (!result.success) {
      const formattedErrors = result.error.format();
      console.log(formattedErrors)
      setErrors({
        firstName: formattedErrors.firstName?._errors.join(', ') || '',
        middleName: formattedErrors.middleName?._errors.join(', ') || '',
        lastName: formattedErrors.lastName?._errors.join(', ') || '',
        suffix: formattedErrors.suffix?._errors.join(', ') || '',
        birthdate: formattedErrors.birthdate?._errors.join(', ') || '',
        birthPlace: formattedErrors.birthPlace?._errors.join(', ') || '',
        birthCountry: formattedErrors.birthCountry?._errors.join(', ') || '',
      });
      return;
    }
    handleEditPerson(formData);
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
          onClick={() => toggleEditPersonModal()}
        >
          <CircleXIcon size={24} />
        </div>
        <div className='text-2xl font-bold'>Edit Person</div>
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

          <div className='flex flex-col ml-4'>
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

        {/* BUTTONS */}
        <div className='flex justify-center gap-4'>
          <button onClick={() => handleDeletePersonNode()} className='bg-red-500 text-white px-4 py-1 rounded-md'>Delete</button>
          <button onClick={() => toggleEditPersonModal()} className='bg-white-500 text-black border-1 border-green px-4 py-1 rounded-md'>Cancel</button>
          <button  className='bg-primary text-white px-4 py-1 rounded-md' type='submit'>Edit Member</button> 
        </div>
      </motion.form>
    </div>
  );
};

const FamilyTreeContent = () => {
  const {addFamilyMember, isFetching, editPersonModal} = useTree();

  if (isFetching) return <FamilyTreeSkeleton />;
  return (
    <div className="relative content | overflow-y-auto">
        <Content />
        <AnimatePresence>
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
