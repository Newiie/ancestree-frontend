"use client"
import Content from '@/components/dashboard/FamilyTree/Content'
import Header from '@/components/dashboard/Header'
import Sidebar from '@/components/dashboard/Sidebar'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '@/components/MainLayout'
import { useModal } from '@/hooks/ModalContext'
import { CircleXIcon } from 'lucide-react'

const AddFamilyMember = () => {
  const [selectedPerson, setSelectedPerson] = useState('Add Child');
  const { toggleAddFamilyModal, handleAddFamilyMember } = useModal();

  return (
    <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-black/50 z-10">
      <motion.form
        initial={{ y: '-10%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        exit={{ y: '-15%', opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative flex flex-col gap-4 bg-white rounded-[10px] py-2"
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
        <div className='grid grid-cols-[1.25fr_1.25fr_1.25fr_0.25fr] mt-4 w-full gap-2 px-4'>
          <div className='relative flex flex-col'>
            <label className='absolute -top-5 left-0 text-sm text-gray-600 mb-1 font-semibold'>Full Name</label>
            <input type="text" placeholder='First Name' className='border rounded px-2 py-1' />
          </div>
          <input type="text" placeholder='Middle Name' className='border rounded px-2 py-1' />
          <input type="text" placeholder='Last Name' className='border rounded px-2 py-1' />
          <input type="text" placeholder='Suffix' className='border rounded px-2 py-1' />
        </div>
        {/* BIRTH DETAILS */}
        <div className='grid grid-cols-[1fr_2fr_1fr] mt-4 w-full gap-2 px-4'>
          <div className='relative flex flex-col'>
            <label className='absolute -top-5 left-0 text-sm text-gray-600 mb-1 font-semibold'>Birth Details</label>
            <input type="text" placeholder='Birthday' className='border rounded px-2 py-1' />
          </div>
          <input type="text" placeholder='Birthplace' className='border rounded px-2 py-1' />
          <input type="text" placeholder='Birth Country' className='border rounded px-2 py-1' />
        </div>

        {/* SEX */}
        <div className='flex flex-col gap-2 px-4'>
          <label className='text-md font-semibold'>Sex</label>

          <div className='flex flex-col ml-4 gap-2'>
            <label htmlFor="male" className='flex items-center gap-1'>
              <input type="radio" id="male" name="sex" value="male" className='border rounded' />
              Male
            </label>
            <label htmlFor="female" className='flex items-center gap-1'>
              <input type="radio" id="female" name="sex" value="female" className='border rounded' />
              Female
            </label>
          </div>
        </div>

        {/* STATUS */}
        <div className='flex flex-col gap-2 px-4'>
          <label className='text-md font-semibold'>Status</label>

          <div className='flex flex-col ml-4 gap-2'>
            <label htmlFor="living" className='flex items-center gap-1'>
              <input type="radio" id="living" name="status" value="living" className='border rounded' />
              Living
            </label>
            <label htmlFor="deceased" className='flex items-center gap-1'>
              <input type="radio" id="deceased" name="status" value="deceased" className='border rounded' />
              Deceased
            </label>
          </div>
        </div>

        {/* NATIONALITY */}
        <div className='flex justify-start flex-col items-start gap-2 px-4'>
          <label className='text-md font-semibold'>Nationality</label>
          <input type="text" placeholder='Nationality' className='border rounded px-2 py-1' />
        </div>  

        {/* BUTTONS */}
        <div className='flex justify-center px-4 gap-4'>
          <button onClick={() => toggleAddFamilyModal()} className='bg-white-500 text-black border-1 border-green px-4 py-1 rounded-md'>Cancel</button>
          <button className='bg-primary text-white px-4 py-1 rounded-md' onClick={(e) => {
            e.preventDefault();
          handleAddFamilyMember()
          }}>Add Member</button> 
        </div>
      </motion.form>
    </div>
  );
};

const EditPersonNode = () => {
  const [selectedPerson, setSelectedPerson] = useState('Add Child');
  const { toggleEditPersonModal, handleEditPerson } = useModal();

  return (
    <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-black/50 z-10">
      <motion.form
        initial={{ y: '-10%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        exit={{ y: '-15%', opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative flex flex-col gap-4 bg-white rounded-[10px] p-8"
      >
        <div
          className="absolute top-2 right-2 cursor-pointer"
          onClick={() => toggleEditPersonModal()}
        >
          <CircleXIcon size={24} />
        </div>
        <div className='text-2xl font-bold'>Edit Person</div>
        {/* NAME DETAILS */}
        <div className='grid grid-cols-[1.25fr_1.25fr_1.25fr_0.25fr] mt-4 w-full gap-2'>
          <div className='relative flex flex-col'>
            <label className='absolute -top-5 left-0 text-sm text-gray-600 mb-1 font-semibold'>Full Name</label>
            <input type="text" placeholder='First Name' className='border rounded px-2 py-1' />
          </div>
          <input type="text" placeholder='Middle Name' className='border rounded px-2 py-1' />
          <input type="text" placeholder='Last Name' className='border rounded px-2 py-1' />
          <input type="text" placeholder='Suffix' className='border rounded px-2 py-1' />
        </div>
        {/* BIRTH DETAILS */}
        <div className='grid grid-cols-[1fr_2fr_1fr] mt-8 w-full gap-2'>
          <div className='relative flex flex-col'>
            <label className='absolute -top-5 left-0 text-sm text-gray-600 mb-1 font-semibold'>Birth Details</label>
            <input type="text" placeholder='Birthday' className='border rounded px-2 py-1' />
          </div>
          <input type="text" placeholder='Birthplace' className='border rounded px-2 py-1' />
          <input type="text" placeholder='Birth Country' className='border rounded px-2 py-1' />
        </div>

        {/* SEX */}
        <div className='flex flex-col gap-2'>
          <label className='text-md font-semibold'>Sex</label>

          <div className='flex flex-col ml-4 gap-2'>
            <label htmlFor="male" className='flex items-center gap-1'>
              <input type="radio" id="male" name="sex" value="male" className='border rounded' />
              Male
            </label>
            <label htmlFor="female" className='flex items-center gap-1'>
              <input type="radio" id="female" name="sex" value="female" className='border rounded' />
              Female
            </label>
          </div>
        </div>

        {/* STATUS */}
        <div className='flex flex-col gap-2'>
          <label className='text-md font-semibold'>Status</label>

          <div className='flex flex-col ml-4 gap-2'>
            <label htmlFor="living" className='flex items-center gap-1'>
              <input type="radio" id="living" name="status" value="living" className='border rounded' />
              Living
            </label>
            <label htmlFor="deceased" className='flex items-center gap-1'>
              <input type="radio" id="deceased" name="status" value="deceased" className='border rounded' />
              Deceased
            </label>
          </div>
        </div>

        {/* BUTTONS */}
        <div className='flex justify-center gap-4'>
        <button onClick={() => toggleEditPersonModal()} className='bg-red-500 text-white px-4 py-1 rounded-md'>Delete</button>
          <button onClick={() => toggleEditPersonModal()} className='bg-white-500 text-black border-1 border-green px-4 py-1 rounded-md'>Cancel</button>
          <button className='bg-primary text-white px-4 py-1 rounded-md' onClick={(e) => {
            e.preventDefault();
          handleEditPerson()
          }}>Edit Member</button> 
        </div>
      </motion.form>
    </div>
  );
};


const Page = () => {
  const {addFamilyMember, toggleAddFamilyModal, editPersonModal} = useModal();


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

export default Page
