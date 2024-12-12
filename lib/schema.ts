import { z } from 'zod';

const formDataSchema = z.object({
    generalInformation: z.object({
        firstName: z.union([z.string().regex(/^\S*$/, "First Name cannot contain spaces"), z.literal('')]).optional(),
        middleName: z.union([z.string().regex(/^\S*$/, "Middle Name cannot contain spaces"), z.literal('')]).optional(),
        lastName: z.union([z.string().regex(/^\S*$/, "Last Name cannot contain spaces"), z.literal('')]).optional(),
        suffix: z.enum(['Jr.', 'Sr.', 'II', 'III', 'IV', 'V', ""]).optional(),
        birthDate: z.union([z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: "Invalid date format",
        }), z.literal('')]).optional(),
        birthPlace: z.union([z.string(), z.literal('')]).optional(),
        birthingCenter: z.union([z.string(), z.literal('')]).optional(),
        nationality: z.array(z.string()).optional(),
        civilStatus: z.union([z.string(), z.literal('')]).optional(),
    }),
    address: z.object({
        streetAddress: z.union([z.string(), z.literal('')]).optional(),
        city: z.union([z.string(), z.literal('')]).optional(),
        province: z.union([z.string(), z.literal('')]).optional(),
        country: z.union([z.string(), z.literal('')]).optional(),
        zipCode: z.union([z.string(), z.literal('')]).optional(),
    }),
    vitalInformation: z.object({
        sex: z.enum(['Male', 'Female', 'Other', '']).optional(),
        height: z.union([z.string(), z.literal('')]).optional(),
        weight: z.union([z.string(), z.literal('')]).optional(),
        eyeColor: z.union([z.string(), z.literal('')]).optional(),
        hairColor: z.union([z.string(), z.literal('')]).optional(),
        bloodType: z.union([z.string(), z.literal('')]).optional(),
    }),
    interests: z.array(z.object({
        title: z.string(),
        description: z.string(),
    })),
    personalContact: z.object({
        email: z.union([z.string().email(), z.literal('')]).optional(),
        phone: z.union([z.string(), z.literal('')]).optional(),
    }).optional(),
    emergencyContact: z.object({
        name: z.union([z.string(), z.literal('')]).optional(),
        email: z.union([z.string().email(), z.literal('')]).optional(),
        relationship: z.union([z.string(), z.literal('')]).optional(),
        phone: z.union([z.string(), z.literal('')]).optional(),
    }),
    aboutMe: z.union([z.string(), z.literal('')]).optional(),
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

const familyMemberSchema = z.object({
    firstName: z.string().min(1, "First Name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last Name is required"),
    suffix: z.string().optional(),
    birthdate: z.string().optional(),
    birthPlace: z.string(),
    birthCountry: z.string(),
    sex: z.enum(["male", "female"]),
    status: z.enum(["living", "deceased", "unknown"]),
    nationality: z.array(z.string()).min(1, "Nationality is required"),
    profilePicture: z.any().optional(), // File validation will be handled in the component
});

const editPersonSchema = z.object({
    firstName: z.string().min(1, "First Name is required"),
    middleName: z.string(),
    lastName: z.string().min(1, "Last Name is required"),
    suffix: z.string(),
    birthdate: z.string().optional(),
    birthPlace: z.string(),
    birthCountry: z.string(),
    sex: z.enum(["male", "female"]),
    status: z.enum(["living", "deceased", "unknown"]),
    profilePicture: z.any().optional(), // File validation will be handled in the component
});

const connectPersonSchema = z.object({
    userId: z.string(),
    personId: z.string(),
});

export { formDataSchema, registerSchema, familyMemberSchema, editPersonSchema, connectPersonSchema };