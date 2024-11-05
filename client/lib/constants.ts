const sectionConfigs = {
    generalInformation: [
      { name: 'firstname', label: 'First Name' },
      { name: 'middlename', label: 'Middle Name' },
      { name: 'lastname', label: 'Last Name' },
      { name: 'suffix', label: 'Suffix', type: 'select', options: ['Jr.', 'Sr.', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'] },
      { name: 'birthDate', label: 'Birth Date', type: 'date' },
      { name: 'deathDate', label: 'Death Date', type: 'date' },
      { name: 'birthPlace', label: 'Birth Place' },
      { name: 'birthingCenter', label: 'Birthing Center' },
      { name: 'nationality', label: 'Nationality' },
      { name: 'civilStatus', label: 'Civil Status' }
    ],
    address: [
      { name: 'streetAddress', label: 'Street Address' },
      { name: 'city', label: 'City' },
      { name: 'province', label: 'Province' },
      { name: 'country', label: 'Country' },
      { name: 'zipCode', label: 'Zip Code' }
    ],
    vitalInformation: [
      { name: 'sex', label: 'Sex', type: 'select', options: ['Male', 'Female', 'Other'] },
      { name: 'height', label: 'Height' },
      { name: 'weight', label: 'Weight' },
      { name: 'eyeColor', label: 'Eye Color' },
      { name: 'hairColor', label: 'Hair Color' },
      { name: 'bloodType', label: 'Blood Type' }
    ],
    interests: [
      { name: 'title', label: 'Title' },
      { name: 'description', label: 'Description' }
    ],
    personalContact: [
      { name: 'email', label: 'Email' },
      { name: 'phone', label: 'Phone' }
    ],
    emergencyContact: [
      { name: 'name', label: 'Name' },
      { name: 'email', label: 'Email' },
      { name: 'relationship', label: 'Relationship'},
      { name: 'phone', label: 'Phone' }
    ],
    aboutMe: [
      { name: 'aboutMe', label: 'About Me' }
    ],
    quotes: [
      { name: 'quote', label: 'Quote' }
    ]
};

export { sectionConfigs };
