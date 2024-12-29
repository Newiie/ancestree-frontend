import { baseUrl } from '@/lib/config';
import profileService from './profileService';

const findSimilarPersons = async (personDetails: { firstName?: string, lastName?: string, middleName?: string, birthdate?: string, birthPlace?: string }) => {
    try {
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(personDetails)) {
            if (value) { 
                queryParams.append(key, value);
            }
        }

        const response = await fetch(`${baseUrl}/person/find-person?${queryParams.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        // Update user progress for searching relatives
        if (data && data.length > 0) {
            await profileService.updateUserProgress("Search for relatives using the Relationships tool");
        }

        return data;
    } catch (error) {
        console.error("Error fetching similar persons:", error);
    }
};


const relationshipService = {
    findSimilarPersons
}

export default relationshipService