import React, { 
    createContext, 
    useState, 
    useContext, 
    ReactNode, 
    useEffect 
} from 'react'
import galleryService from '@/services/api/galleryService'

// Define the Album interface
export interface Album {
    _id: string;
    name: string;
    photos: Photo[];
}

// Define the Photo interface
export interface Photo {
    key: string;
    url: string;
}

// Define the context type
interface RecordsContextType {
    albums: Album[];
    setAlbums: React.Dispatch<React.SetStateAction<Album[]>>;
    isFetching: boolean;
    setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
    fetchAlbums: () => Promise<void>;
}

// Create the context
const RecordsContext = createContext<RecordsContextType | undefined>(undefined)

// Provider component
export const RecordsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [albums, setAlbums] = useState<Album[]>([])
    const [isFetching, setIsFetching] = useState(false)

    const fetchAlbums = async () => {
        try {
            setIsFetching(true)
            const fetchedAlbums = await galleryService.getAlbums()
            console.log("FETCHED ALBUMS", fetchedAlbums)
            setAlbums(fetchedAlbums)
        } catch (error) {
            console.error('Error fetching albums:', error)
            // Optionally set error state or show error notification
        } finally {
            setIsFetching(false)
        }
    }

    useEffect(() => {
        fetchAlbums()
    }, [])
    // Provide the context value
    const contextValue = {
        albums,
        setAlbums,
        isFetching,
        setIsFetching,
        fetchAlbums
    }

    return (
        <RecordsContext.Provider value={contextValue}>
            {children}
        </RecordsContext.Provider>
    )
}

// Custom hook to use the Records context
export const useRecords = () => {
    const context = useContext(RecordsContext)
    if (context === undefined) {
        throw new Error('useRecords must be used within a RecordsProvider')
    }
    return context
}