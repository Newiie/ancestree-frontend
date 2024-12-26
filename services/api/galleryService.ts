import { baseUrl } from '@/lib/config';
import { selectToken, selectId } from "@/store/userSlice";
import store from "@/store/store";

const getAlbums = async () => {
    try {
        const token = selectToken(store.getState());
        const userId = selectId(store.getState());
        const response = await fetch(`${baseUrl}/records/${userId}/albums`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`Error getting albums: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

const getAlbum = async (albumId: any) => {
    try {
        const token = selectToken(store.getState());
        const userId = selectId(store.getState());
        const response = await fetch(`${baseUrl}/records/${userId}/albums/${albumId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`Error getting albums: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

const addAlbum = async (album: any) => {
    try {
        const token = selectToken(store.getState());
        const userId = selectId(store.getState());
        const response = await fetch(`${baseUrl}/records/${userId}/albums`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: album
            })
        });
        if (!response.ok) {
            throw new Error(`Error adding album: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

const deleteAlbum = async (albumId: string) => {
    try {
        const token = selectToken(store.getState());
        const userId = selectId(store.getState());
        const response = await fetch(`${baseUrl}/records/${userId}/albums/${albumId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`Error deleting album: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

const uploadPhoto = async (albumId: string | string[], photoData: FormData) => {
    try {
        const token = selectToken(store.getState());
        const userId = selectId(store.getState());
        const response = await fetch(`${baseUrl}/records/${userId}/albums/${albumId}/photos`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: photoData
        });
        if (!response.ok) {
            throw new Error(`Error adding photo to album: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

const deletePhoto = async (albumId: string | string[], photoId: string) => {
    try {
        const token = selectToken(store.getState());
        const userId = selectId(store.getState());
        const response = await fetch(`${baseUrl}/records/${userId}/albums/${albumId}/photos/${photoId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`Error deleting photo: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

const editAlbum = async (albumId: string, newName: string) => {
    try {
        const token = selectToken(store.getState());
        const userId = selectId(store.getState());
        const response = await fetch(`${baseUrl}/records/${userId}/albums/${albumId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: newName })
        });
        if (!response.ok) {
            throw new Error(`Error editing album: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

const editPhoto = async (albumId: string, photoKey: string, formData: FormData) => {
    try {
        const token = selectToken(store.getState());
        const userId = selectId(store.getState());
        const response = await fetch(`${baseUrl}/records/${userId}/albums/${albumId}/photos/${photoKey}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        if (!response.ok) {
            throw new Error(`Error editing photo: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

const galleryService = {
    getAlbums,
    getAlbum,
    addAlbum,
    deleteAlbum,
    uploadPhoto,
    deletePhoto,
    editAlbum,
    editPhoto
}

export default galleryService