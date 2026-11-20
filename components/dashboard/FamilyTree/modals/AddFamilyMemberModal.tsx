"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Camera, Leaf, Calendar, Users, Globe } from 'lucide-react';
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
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setErrors(prev => ({ ...prev, profilePicture: 'Please upload a JPEG, PNG, or GIF.' }));
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setErrors(prev => ({ ...prev, profilePicture: 'Maximum file size is 5MB.' }));
        return;
      }
      setFormData(prev => ({ ...prev, profilePicture: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPicturePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePicture = () => {
    setFormData(prev => ({ ...prev, profilePicture: null }));
    setPicturePreview(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append('nodeId', selectedNode);
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
    if (formData.sex) submitData.append('vitalInformation[sex]', formData.sex);
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
      setFormData(prev => ({ ...prev, nationality: [...prev.nationality, nationalityInput.trim()] }));
      setNationalityInput('');
    }
  };

  const inputClass = 'w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 bg-stone-50 placeholder:text-stone-400 focus:outline-none focus:border-[#1B5A1B]/40 focus:bg-white transition-colors duration-150';

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-10">
      <motion.form
        initial={{ y: -16, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -12, opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-[#faf9f7] w-[95%] max-w-[480px] rounded-2xl shadow-2xl shadow-stone-900/20 max-h-[92vh] overflow-y-auto border border-stone-200/60"
        onSubmit={handleSubmit}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#faf9f7] border-b border-stone-200/70 px-5 pt-5 pb-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#D4F3C0]/60 flex items-center justify-center">
                <Leaf size={12} className="text-[#1B5A1B]" />
              </div>
              <span className="text-xs uppercase tracking-widest text-stone-400 font-medium">Family Tree</span>
            </div>
            <button
              type="button"
              onClick={() => toggleAddFamilyModal()}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-0 bg-stone-100 rounded-xl p-1 mb-3">
            {['Add Child', 'Add Parent'].map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedPerson(tab)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedPerson === tab
                    ? 'bg-white text-stone-800 shadow-sm shadow-stone-200'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <h2 className="text-base font-semibold text-stone-800 mb-4">
            {selectedPerson === 'Add Child' ? 'New Child' : 'New Parent'}
          </h2>
        </div>

        <div className="px-5 pt-4 pb-6 flex flex-col gap-5">

          {/* Photo + Name row */}
          <div className="flex gap-4 items-start">
            {/* Profile picture upload */}
            <div className="flex-shrink-0">
              <input
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(',')}
                onChange={handlePictureChange}
                className="hidden"
                id="profilePicture"
              />
              <label htmlFor="profilePicture" className="group cursor-pointer block">
                <div className="w-16 h-16 rounded-full bg-stone-100 border-2 border-dashed border-stone-300 group-hover:border-[#1B5A1B]/40 flex items-center justify-center overflow-hidden transition-colors relative">
                  {picturePreview ? (
                    <>
                      <Image src={picturePreview} alt="Preview" width={64} height={64} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition-opacity">
                        <Camera size={16} className="text-white" />
                      </div>
                    </>
                  ) : (
                    <Camera size={18} className="text-stone-400 group-hover:text-[#1B5A1B]/60 transition-colors" />
                  )}
                </div>
              </label>
              {picturePreview && (
                <button
                  type="button"
                  onClick={handleRemovePicture}
                  className="w-full mt-1 text-xs text-stone-400 hover:text-red-400 transition-colors text-center"
                >
                  Remove
                </button>
              )}
              {errors.profilePicture && (
                <p className="text-xs text-red-400 mt-1 w-16 leading-tight">{errors.profilePicture}</p>
              )}
            </div>

            {/* Name fields */}
            <div className="flex-1 flex flex-col gap-2">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Full Name</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="text"
                    placeholder="First name"
                    className={inputClass}
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                  {errors.firstName && <p className="text-xs text-red-400 mt-0.5">{errors.firstName}</p>}
                </div>
                <input
                  type="text"
                  placeholder="Middle (opt.)"
                  className={inputClass}
                  value={formData.middleName}
                  onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <input
                    type="text"
                    placeholder="Last name"
                    className={inputClass}
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                  {errors.lastName && <p className="text-xs text-red-400 mt-0.5">{errors.lastName}</p>}
                </div>
                <input
                  type="text"
                  placeholder="Suffix"
                  className={inputClass}
                  value={formData.suffix}
                  onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-stone-100" />

          {/* Birth details */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <Calendar size={12} className="text-[#1B5A1B]/70" />
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Birth Details</p>
            </div>
            <div className="bg-stone-50/80 rounded-xl p-3 flex flex-col gap-2 border border-stone-100">
              <div>
                <input
                  type="date"
                  className={`${inputClass} text-stone-600`}
                  value={formData.birthdate}
                  onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                />
                {errors.birthdate && <p className="text-xs text-red-400 mt-0.5">{errors.birthdate}</p>}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="City / Province"
                  className={inputClass}
                  value={formData.birthPlace}
                  onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Country"
                  className={inputClass}
                  value={formData.birthCountry}
                  onChange={(e) => setFormData({ ...formData, birthCountry: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-stone-100" />

          {/* Sex + Status */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <Users size={12} className="text-[#1B5A1B]/70" />
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Identity</p>
            </div>
            <div className="bg-stone-50/80 rounded-xl p-3 grid grid-cols-2 gap-4 border border-stone-100">
              <div className="flex flex-col gap-1.5">
                <p className="text-xs text-stone-400 font-medium">Sex</p>
                <div className="flex gap-1 bg-stone-100 rounded-lg p-1">
                  {['male', 'female'].map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, sex: option })}
                      className={`flex-1 py-1.5 rounded-md text-xs font-medium capitalize transition-all duration-150 ${
                        formData.sex === option
                          ? 'bg-white text-[#1B5A1B] shadow-sm'
                          : 'text-stone-500 hover:text-stone-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <p className="text-xs text-stone-400 font-medium">Status</p>
                <div className="flex gap-1 bg-stone-100 rounded-lg p-1">
                  {['living', 'deceased', 'unknown'].map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, status: option })}
                      className={`flex-1 py-1.5 rounded-md text-xs font-medium capitalize transition-all duration-150 ${
                        formData.status === option
                          ? 'bg-white text-[#1B5A1B] shadow-sm'
                          : 'text-stone-500 hover:text-stone-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-100" />

          {/* Nationality */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <Globe size={12} className="text-[#1B5A1B]/70" />
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Nationality</p>
            </div>
            <div className="bg-stone-50/80 rounded-xl p-3 flex flex-col gap-2 border border-stone-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Filipino"
                  className={`${inputClass} flex-1`}
                  value={nationalityInput}
                  onChange={(e) => setNationalityInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddNationality(); } }}
                />
                <button
                  type="button"
                  onClick={handleAddNationality}
                  className="px-3 py-2 bg-[#1B5A1B] hover:bg-[#34762E] text-white text-sm rounded-lg transition-colors duration-150"
                >
                  Add
                </button>
              </div>
              {formData.nationality.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {formData.nationality.map((nat, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-[#D4F3C0]/60 text-[#1B5A1B] px-2.5 py-1 rounded-full text-xs font-medium border border-[#1B5A1B]/10"
                    >
                      {nat}
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, nationality: prev.nationality.filter((_, i) => i !== index) }))}
                        className="text-[#1B5A1B]/50 hover:text-[#1B5A1B] ml-0.5 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {errors.nationality && <p className="text-xs text-red-400">{errors.nationality}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => toggleAddFamilyModal()}
              className="flex-1 py-2.5 rounded-xl border border-[#1B5A1B]/30 text-[#1B5A1B] text-sm font-medium hover:bg-[#D4F3C0]/40 transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isFetching}
              className="flex-1 py-2.5 rounded-xl bg-[#1B5A1B] hover:bg-[#34762E] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors duration-150"
            >
              {isFetching ? 'Saving…' : `Save ${selectedPerson === 'Add Child' ? 'Child' : 'Parent'}`}
            </button>
          </div>

        </div>
      </motion.form>
    </div>
  );
};

export default AddFamilyMemberModal;
