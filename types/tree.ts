import { z } from 'zod';
import { familyMemberSchema } from '@/lib/schema';

// Backend API returns both casings on generalInformation fields.
// Both are optional until the backend normalises field names.
export interface GeneralInformation {
  firstName?: string;
  firstname?: string;
  middleName?: string;
  lastName?: string;
  lastname?: string;
  suffix?: string;
  birthdate?: string;
  deathdate?: string;
  birthPlace?: string;
  birthCountry?: string;
  birthingCenter?: string;
  nationality?: string[];
  civilStatus?: string;
  status?: string;
  sex?: string;
  height?: string;
  weight?: string;
  eyeColor?: string;
  hairColor?: string;
  bloodType?: string;
  email?: string;
  phone?: string;
  aboutMe?: string;
  quote?: string;
}

export interface VitalInformation {
  sex?: string;
  height?: string;
  weight?: string;
  eyeColor?: string;
  hairColor?: string;
  bloodType?: string;
}

export interface PersonNode {
  profilePicture?: string;
  relatedUser?: string;
  generalInformation?: GeneralInformation;
  vitalInformation?: VitalInformation;
}

export interface TreeNode {
  id: string;
  name?: string;
  person?: PersonNode;
  parents?: TreeNode[];
  children?: TreeNode[];
  parent?: Array<{ id: string }>;
}

// Derived from existing Zod schema to avoid divergence
export type FamilyMember = z.infer<typeof familyMemberSchema>;
