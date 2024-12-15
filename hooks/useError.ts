"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
const useError = () => {
    const { logout } = useAuth();
    const [error, setError] = useState<string | null>(null)
    const router = useRouter();

    const tokenExpired = () => {
        logout();
        router.push('/login');
    }

    useEffect(() => {
        if (error === "token expired") {
            tokenExpired();
        }
    }, [error, router]);

    return { error, setError }
}

export default useError