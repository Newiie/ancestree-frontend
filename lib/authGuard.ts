import store from '@/store/store';
import { setUser } from '@/store/userSlice';

export const handleUnauthorized = () => {
    store.dispatch(setUser({ username: null, id: null, token: null, isCompleted: false }));
    window.localStorage.removeItem('AncestreeUser');
    window.location.href = '/login?reason=session_expired';
};
