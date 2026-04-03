"use client";

import React from 'react';
import { UserData } from '@/types/profile';
import { sectionConfigs } from '@/lib/constants';

interface ContactSectionProps {
  data: Partial<UserData>;
  isEditing: boolean;
  onChange: (patch: Partial<UserData>) => void;
  errors?: Record<string, string>;
}

type SectionKey = 'personalContact' | 'emergencyContact';

const inputStyles = 'w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 bg-stone-50 placeholder:text-stone-400 focus:outline-none focus:border-[#1B5A1B]/50 focus:bg-white transition-colors mt-1 mb-2';
const errorStyles = 'text-red-500 text-sm mt-1';

const ContactSection: React.FC<ContactSectionProps> = ({
  data,
  isEditing,
  onChange,
  errors = {},
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section: SectionKey
  ) => {
    const { name: fieldName, value } = e.target;
    const field = fieldName.split('.')[1];
    const currentSection = (data[section] as Record<string, unknown>) || {};
    onChange({ [section]: { ...currentSection, [field]: value } });
  };

  const renderFields = (
    fields: { name: string; label: string; type?: string; options?: string[] }[],
    section: SectionKey
  ) => {
    return fields.map((field) => {
      const sectionData = (data[section] as Record<string, unknown>) || {};
      const rawValue = sectionData[field.name];
      const errorKey = `${section}.${field.name}`;
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
              <input
                type="text"
                className={inputStyles}
                name={`${section}.${field.name}`}
                value={typeof rawValue === 'string' ? rawValue : ''}
                onChange={(e) => handleInputChange(e, section)}
                placeholder={field.label}
              />
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
    <div className="space-y-4">
      <div>
        <h4 className="font-bold text-lg my-2">Personal Contact</h4>
        {renderFields(sectionConfigs.personalContact, 'personalContact')}
      </div>
      <div>
        <h4 className="font-bold text-lg my-2">Emergency Contact</h4>
        {renderFields(sectionConfigs.emergencyContact, 'emergencyContact')}
      </div>
    </div>
  );
};

export default ContactSection;
