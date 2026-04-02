const sectionConfigs = {
    generalInformation: [
      { name: 'firstName', label: 'First Name', type: 'default' },
      { name: 'middleName', label: 'Middle Name', type: 'default' },
      { name: 'lastName', label: 'Last Name', type: 'default' },
      { name: 'suffix', label: 'Suffix', type: 'select', options: ['Jr.', 'Sr.', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'] },
      { name: 'birthdate', label: 'Birth Date', type: 'date' },
      { name: 'deathdate', label: 'Death Date', type: 'date' },
      { name: 'birthPlace', label: 'Birth Place', type: 'default' },
      { name: 'birthingCenter', label: 'Birthing Center', type: 'default' },
      { name: 'nationality', label: 'Nationality', type: 'array' },
      { name: 'civilStatus', label: 'Civil Status', type: 'default' }
    ],
    address: [
      { name: 'streetAddress', label: 'Street Address', type: 'default' },
      { name: 'city', label: 'City', type: 'default' },
      { name: 'province', label: 'Province', type: 'default' },
      { name: 'country', label: 'Country', type: 'default' },
      { name: 'zipCode', label: 'Zip Code', type: 'default' }
    ],
    vitalInformation: [
      { name: 'sex', label: 'Sex', type: 'select', options: ['Male', 'Female', 'Other'] },
      { name: 'height', label: 'Height', type: 'default' },
      { name: 'weight', label: 'Weight', type: 'default' },
      { name: 'eyeColor', label: 'Eye Color', type: 'default' },
      { name: 'hairColor', label: 'Hair Color', type: 'default' },
      { name: 'bloodType', label: 'Blood Type', type: 'default' }
    ],
    interests: [
      { name: 'title', label: 'Title', type: 'default' },
      { name: 'description', label: 'Description', type: 'default' },
      { name: 'addInterest', label: 'Add Interest', type: 'button' }
    ],
    personalContact: [
      { name: 'email', label: 'Email', type: 'default' },
      { name: 'phone', label: 'Phone', type: 'default' }
    ],
    emergencyContact: [
      { name: 'name', label: 'Name', type: 'default' },
      { name: 'email', label: 'Email', type: 'default' },
      { name: 'relationship', label: 'Relationship', type: 'default' },
      { name: 'phone', label: 'Phone', type: 'default' }
    ],
    aboutMe: [
      { name: 'aboutMe', label: 'About Me', type: 'default' }
    ],
    quotes: [
      { name: 'quote', label: 'Quote', type: 'default' }
    ]
};

export { sectionConfigs };

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_ZOOM = 3;
export const MIN_ZOOM = 0.2;
export const ZOOM_STEP = 0.1;
export const FALLBACK_AVATAR = '/images/pirot.png';
