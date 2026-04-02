export interface UserFriend {
  _id?: string;
  userId?: string;
  user?: UserData;
}

export interface UserData {
  userId?: string;
  relatedUser?: string;
  profilePicture?: string;
  backgroundPicture?: string;
  friendsList?: UserFriend[];
  generalInformation?: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    suffix?: string;
    birthdate?: string;
    deathdate?: string;
    birthPlace?: string;
    birthingCenter?: string;
    nationality?: string[];
    civilStatus?: string;
  };
  address?: {
    streetAddress?: string;
    city?: string;
    province?: string;
    country?: string;
    zipCode?: string;
  };
  vitalInformation?: {
    sex?: string;
    height?: string;
    weight?: string;
    eyeColor?: string;
    hairColor?: string;
    bloodType?: string;
  };
  interests?: Array<{ title?: string; description?: string }>;
  personalContact?: {
    email?: string;
    phone?: string;
  };
  emergencyContact?: {
    name?: string;
    email?: string;
    relationship?: string;
    phone?: string;
  };
  aboutMe?: string;
  quote?: string;
  message?: string;
}
