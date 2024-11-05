import { z } from 'zod';

const formDataSchema = z.object({
    generalInformation: z.object({
        firstname: z.string().regex(/^\S*$/, "First name cannot contain spaces").optional(),
        middlename: z.string().regex(/^\S*$/, "Middle name cannot contain spaces").optional(),
        lastname: z.string().regex(/^\S*$/, "Last name cannot contain spaces").optional(),
        suffix: z.enum(['Jr.', 'Sr.', 'II', 'III', 'IV', 'V']).optional(),
        birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
        }).optional(),
        birthPlace: z.string().optional(),
        birthingCenter: z.string().optional(),
        nationality: z.string().optional(),
        civilStatus: z.string().optional(),
    }),
    address: z.object({
        streetAddress: z.string().optional(),
        city: z.string().optional(),
        province: z.string().optional(),
        country: z.string().optional(),
        zipCode: z.string().optional(),
    }),
    vitalInformation: z.object({
        sex: z.enum(['Male', 'Female', 'Other']).optional(),
        height: z.string().optional(),
        weight: z.string().optional(),
        eyeColor: z.string().optional(),
        hairColor: z.string().optional(),
        bloodType: z.string().optional(),
    }),
    interests: z.array(z.object({
        title: z.string(),
        description: z.string(),
    })),
    personalContact: z.object({
        email: z.string().email().optional(),
        phone: z.string().optional(),
    }).optional(),
    emergencyContact: z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        relationship: z.string().optional(),
        phone: z.string().optional(),
    }),
    aboutMe: z.string().optional(),
    quotes: z.array(z.object({
        quote: z.string(),
        isFavorite: z.boolean(),
    })).optional(),
});


const registerSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters long"),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

// Define Zod schema for form validation
const familyMemberSchema = z.object({
    firstName: z.string().min(1, "First Name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last Name is required"),
    suffix: z.string().optional(),
    birthday: z.date().min(new Date(), "Birthday is required"),
    birthplace: z.string(),
    birthCountry: z.string(),
    sex: z.enum(["male", "female"]),
    status: z.enum(["living", "deceased", "unknown"]),
    nationality: z.array(z.string()).min(1, "Nationality is required"),
});
  
  // Define Zod schema for editing a person
const editPersonSchema = z.object({
    firstName: z.string().min(1, "First Name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last Name is required"),
    suffix: z.string().optional(),
    birthday: z.date().min(new Date(), "Birthday is required"),
    birthplace: z.string(),
    birthCountry: z.string(),
    sex: z.enum(["male", "female"]),
    status: z.enum(["living", "deceased", "unknown"]),
});

export { formDataSchema, registerSchema, familyMemberSchema, editPersonSchema };