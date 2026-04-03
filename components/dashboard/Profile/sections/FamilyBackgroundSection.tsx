"use client";

import React from 'react';
import { UserData } from '@/types/profile';
import { sectionConfigs } from '@/lib/constants';

interface FamilyBackgroundSectionProps {
  data: Partial<UserData>;
  isEditing: boolean;
  onChange: (patch: Partial<UserData>) => void;
  errors?: Record<string, string>;
}

const inputStyles = 'w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 bg-stone-50 placeholder:text-stone-400 focus:outline-none focus:border-[#1B5A1B]/50 focus:bg-white transition-colors mt-1 mb-2';
const errorStyles = 'text-red-500 text-sm mt-1';

const FamilyBackgroundSection: React.FC<FamilyBackgroundSectionProps> = ({
  data,
  isEditing,
  onChange,
  errors = {},
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name: fieldName, value } = e.target;
    const field = fieldName.split('.')[1];
    const currentSection = (data.vitalInformation as Record<string, unknown>) || {};
    onChange({ vitalInformation: { ...currentSection, [field]: value } });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name: fieldName, value } = e.target;
    const field = fieldName.split('.')[1];
    const currentSection = (data.vitalInformation as Record<string, unknown>) || {};
    onChange({ vitalInformation: { ...currentSection, [field]: value } });
  };

  const renderFields = (
    fields: { name: string; label: string; type?: string; options?: string[] }[]
  ) => {
    return fields.map((field) => {
      const sectionData = (data.vitalInformation as Record<string, unknown>) || {};
      const rawValue = sectionData[field.name];
      const errorKey = `vitalInformation.${field.name}`;
      const displayValue =
        Array.isArray(rawValue)
          ? ((rawValue as string[]).join(', ') || '—')
          : typeof rawValue === 'string'
          ? (rawValue || '—')
          : '—';

      return (
        <div key={field.name} className="mb-1">
          {isEditing ? (
            <>
              {field.type === 'select' ? (
                <select
                  name={`vitalInformation.${field.name}`}
                  value={typeof rawValue === 'string' ? rawValue : ''}
                  onChange={handleSelectChange}
                  className={inputStyles}
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  name={`vitalInformation.${field.name}`}
                  value={typeof rawValue === 'string' ? rawValue : ''}
                  onChange={handleInputChange}
                  className={inputStyles}
                  placeholder={field.label}
                />
              )}
              {errors[errorKey] && (
                <p className={errorStyles}>{errors[errorKey]}</p>
              )}
            </>
          ) : (
            <p>
              <strong>{field.label}:</strong> {displayValue}
            </p>
          )}
        </div>
      );
    });
  };

  return (
    <div>
      <h4 className="font-bold text-lg my-2">Physical Attributes</h4>
      {renderFields(sectionConfigs.vitalInformation)}
    </div>
  );
};

export default FamilyBackgroundSection;
