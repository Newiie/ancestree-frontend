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
        className="relative flex flex-col gap-4 w-[30rem] h-[24rem] bg-white rounded-[10px] p-8"
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

        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Name', placeholder: 'Name' },
            { label: 'Birthday', placeholder: 'Birthday' },
            { label: 'Birthplace', placeholder: 'Birthplace' },
            { label: 'Gender', placeholder: 'Gender' },
            { label: 'Relationship', placeholder: 'Relationship' },
            { label: 'Occupation', placeholder: 'Occupation' },
            { label: 'Education', placeholder: 'Education' },
            { label: 'Death', placeholder: 'Death' },
          ].map(({ label, placeholder }, index) => (
            <div key={index} className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">{label}</label>
              <input
                type="text"
                placeholder={placeholder}
                className="border rounded px-2 py-1"
              />
            </div>
          ))}
        </div>
        <button className='' onClick={(e) => {
          e.preventDefault();
          handleAddFamilyMember()
          }}>Add Family Member</button> 
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
        className="relative flex flex-col gap-4 w-[30rem] h-[24rem] bg-white rounded-[10px] p-8"
      >
        <div
          className="absolute top-2 right-2 cursor-pointer"
          onClick={() => toggleEditPersonModal()}
        >
          <CircleXIcon size={24} />
        </div>
        <div className='text-2xl font-bold'>Edit Person</div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Name', placeholder: 'Name' },
            { label: 'Birthday', placeholder: 'Birthday' },
            { label: 'Birthplace', placeholder: 'Birthplace' },
            { label: 'Gender', placeholder: 'Gender' },
            { label: 'Relationship', placeholder: 'Relationship' },
            { label: 'Occupation', placeholder: 'Occupation' },
            { label: 'Education', placeholder: 'Education' },
            { label: 'Death', placeholder: 'Death' },
          ].map(({ label, placeholder }, index) => (
            <div key={index} className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">{label}</label>
              <input
                type="text"
                placeholder={placeholder}
                className="border rounded px-2 py-1"
              />
            </div>
          ))}
        </div>
        <button className='' onClick={(e) => {
          e.preventDefault();
          handleEditPerson()
          }}>Add Family Member</button> 
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
