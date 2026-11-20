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

        // Mark step as done whenever the user performs a search
        await profileService.updateUserProgress("Search for relatives using the Relationships tool");

        return data;
    } catch (error) {
    }
};


const relationshipService = {
    findSimilarPersons
}

export default relationshipService