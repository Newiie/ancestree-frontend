import React from 'react';
import { useProfile } from '../../../hooks/ProfileContext';

const DetailsContent = () => {
  const { selectedDetail } = useProfile();

  return (
    <div className='p-4'>
      <h2 className='text-xl font-bold'>{selectedDetail}</h2>
      <div className='mt-4'>
        {selectedDetail === 'General Information' && (
          <>
            <h3 className='font-bold'>Name</h3>
            <p><strong>First Name:</strong> Jethro</p>
            <p><strong>Middle Name:</strong> Layan</p>
            <p><strong>Last Name:</strong> Cenas</p>
            <p><strong>Suffix:</strong> N/A</p>
            <h3 className='font-bold mt-4'>Birth Details</h3>
            <p><strong>Birth Date:</strong> January 01, 2002</p>
            <p><strong>Birth Place:</strong> Cebu City, Cebu, Visayas, PH</p>
            <p><strong>Birthing Center:</strong> Unknown</p>
            <h3 className='font-bold mt-4'>Citizenship</h3>
            <p><strong>Nationality:</strong> Filipino</p>
            <p><strong>Civil Status:</strong> Divorced</p>
          </>
        )}
      </div>
    </div>
  );
};

export default DetailsContent;
