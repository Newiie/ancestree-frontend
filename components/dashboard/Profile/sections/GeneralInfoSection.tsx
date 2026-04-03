"use client";

import React, { useState } from 'react';
import { UserData } from '@/types/profile';
import { sectionConfigs } from '@/lib/constants';

interface GeneralInfoSectionProps {
  data: Partial<UserData>;
  isEditing: boolean;
  onChange: (patch: Partial<UserData>) => void;
  errors?: Record<string, string>;
  selectedDetail?: string;
}

type SectionKey = 'generalInformation' | 'address';

const inputStyles = 'w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 bg-stone-50 placeholder:text-stone-400 focus:outline-none focus:border-[#1B5A1B]/50 focus:bg-white transition-colors mt-1 mb-2';
const errorStyles = 'text-red-500 text-sm mt-1';

const GeneralInfoSection: React.FC<GeneralInfoSectionProps> = ({
  data,
  isEditing,
  onChange,
  errors = {},
  selectedDetail,
}) => {
  const [tempArrayInput, setTempArrayInput] = useState<{ [key: string]: string }>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section: SectionKey
  ) => {
    const { name: fieldName, value } = e.target;
    const field = fieldName.split('.')[1];
    const currentSection = (data[section] as Record<string, unknown>) || {};
    const fieldConfig = sectionConfigs[section]?.find((f) => f.name === field);

    if (fieldConfig?.type === 'array') {
      setTempArrayInput((prev) => ({ ...prev, [field]: value }));
    } else {
      onChange({ [section]: { ...currentSection, [field]: value } });
    }
  };

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    section: SectionKey
  ) => {
    const { name: fieldName, value } = e.target;
    const field = fieldName.split('.')[1];
    const currentSection = (data[section] as Record<string, unknown>) || {};
    onChange({ [section]: { ...currentSection, [field]: value } });
  };

  const handleAddArrayItem = (section: SectionKey, field: string) => {
    const inputValue = tempArrayInput[field]?.trim();
    if (!inputValue) return;
    const currentSection = (data[section] as Record<string, unknown>) || {};
    const existing = Array.isArray(currentSection[field])
      ? (currentSection[field] as string[])
      : [];
    if (!existing.includes(inputValue)) {
      onChange({ [section]: { ...currentSection, [field]: [...existing, inputValue] } });
    }
    setTempArrayInput((prev) => ({ ...prev, [field]: '' }));
  };

  const handleRemoveArrayItem = (section: SectionKey, field: string, index: number) => {
    const currentSection = (data[section] as Record<string, unknown>) || {};
    const existing = Array.isArray(currentSection[field])
      ? (currentSection[field] as string[])
      : [];
    const updated = existing.filter((_, i) => i !== index);
    onChange({ [section]: { ...currentSection, [field]: updated } });
  };

  const renderFields = (
    fields: { name: string; label: string; type?: string; options?: string[] }[],
    section: SectionKey
  ) => {
    return fields.map((field) => {
      const sectionData = (data[section] as Record<string, unknown>) || {};
      const rawValue = sectionData[field.name];
      const errorKey = `${section}.${field.name}`;

      return (
        <div key={field.name} className="mb-1">
          {isEditing ? (
            <>
              {field.type === 'array' ? (
                <div>
                  <div className="flex gap-2 items-center mt-2">
                    <input
                      type="text"
                      name={`${section}.${field.name}`}
                      value={tempArrayInput[field.name] || ''}
                      onChange={(e) => handleInputChange(e, section)}
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
                  <div className="mb-2">
                    <strong>{field.label}:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {(Array.isArray(rawValue) ? (rawValue as string[]) : []).map(
                        (item, index) => (
                          <span
                            key={index}
                            className="flex items-center bg-[#EAF1E5] text-[#1B5A1B] px-2.5 py-1 rounded-full text-xs font-medium"
                          >
                            {item}
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveArrayItem(section, field.name, index)
                              }
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ) : field.type === 'select' ? (
                <select
                  name={`${section}.${field.name}`}
                  value={typeof rawValue === 'string' ? rawValue : ''}
                  onChange={(e) => handleSelectChange(e, section)}
                  className={inputStyles}
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.type === 'date' ? (
                <input
                  type="date"
                  name={`${section}.${field.name}`}
                  value={typeof rawValue === 'string' ? rawValue.slice(0, 10) : ''}
                  onChange={(e) => handleInputChange(e, section)}
                  className={inputStyles}
                />
              ) : (
                <input
                  type="text"
                  name={`${section}.${field.name}`}
                  value={
                    Array.isArray(rawValue)
                      ? (rawValue as string[]).join(', ')
                      : typeof rawValue === 'string'
                      ? rawValue
                      : ''
                  }
                  onChange={(e) => handleInputChange(e, section)}
                  className={inputStyles}
                  placeholder={field.label}
                />
              )}
              {errors[errorKey] && (
                <p className={errorStyles}>{errors[errorKey]}</p>
              )}
            </>
          ) : field.type === 'array' ? (
            <div>
              <strong>{field.label}:</strong>
              <div className="flex flex-wrap gap-2 mt-1">
                {(Array.isArray(rawValue) ? (rawValue as string[]) : []).map(
                  (item, index) => (
                    <span
                      key={index}
                      className="bg-[#EAF1E5] text-[#1B5A1B] px-2.5 py-1 rounded-full text-xs font-medium"
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>
          ) : (
            <p>
              <strong>{field.label}:</strong>{' '}
              {Array.isArray(rawValue)
                ? (rawValue as string[]).join(', ')
                : typeof rawValue === 'string'
                ? rawValue
                : 'Unknown'}
            </p>
          )}
        </div>
      );
    });
  };

  return (
    <>
      {selectedDetail === 'General Information' && (
        <div>
          <h4 className="font-bold text-lg my-2">General Information</h4>
          {renderFields(sectionConfigs.generalInformation, 'generalInformation')}
        </div>
      )}
      {selectedDetail === 'Addresses' && (
        <div>
          <h4 className="font-bold text-lg my-2">Current Address</h4>
          {renderFields(sectionConfigs.address, 'address')}
        </div>
      )}
    </>
  );
};

export default GeneralInfoSection;
