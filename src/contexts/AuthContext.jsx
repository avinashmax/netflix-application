import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('nf_current_user');
        const token = localStorage.getItem('nf_auth_token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
        }
    }, []);

    const register = (userData) => {
        const users = JSON.parse(localStorage.getItem('nf_users') || '[]');
        const existing = users.find(u => u.email === userData.email);
        if (existing) throw new Error('An account with this email already exists.');
        const newUser = {
            id: Date.now().toString(),
            name: userData.name,
            email: userData.email,
            password: userData.password,
            myList: [],
            createdAt: new Date().toISOString(),
        };
        users.push(newUser);
        localStorage.setItem('nf_users', JSON.stringify(users));
        return newUser;
    };

    const login = (email, password) => {
        const users = JSON.parse(localStorage.getItem('nf_users') || '[]');
        const found = users.find(u => u.email === email && u.password === password);
        if (!found) throw new Error('Invalid email or password. Please try again.');
        const token = `nf_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        localStorage.setItem('nf_auth_token', token);
        localStorage.setItem('nf_current_user', JSON.stringify(found));
        setUser(found);
        setIsLoggedIn(true);
        return found;
    };

    const logout = () => {
        localStorage.removeItem('nf_auth_token');
        localStorage.removeItem('nf_current_user');
        setUser(null);
        setIsLoggedIn(false);
    };

    const addToMyList = (imdbID) => {
        const users = JSON.parse(localStorage.getItem('nf_users') || '[]');
        const idx = users.findIndex(u => u.id === user.id);
        if (idx === -1) return;
        if (!users[idx].myList.includes(imdbID)) {
            users[idx].myList.push(imdbID);
        }
        localStorage.setItem('nf_users', JSON.stringify(users));
        localStorage.setItem('nf_current_user', JSON.stringify(users[idx]));
        setUser({ ...users[idx] });
    };

    const removeFromMyList = (imdbID) => {
        const users = JSON.parse(localStorage.getItem('nf_users') || '[]');
        const idx = users.findIndex(u => u.id === user.id);
        if (idx === -1) return;
        users[idx].myList = users[idx].myList.filter(id => id !== imdbID);
        localStorage.setItem('nf_users', JSON.stringify(users));
        localStorage.setItem('nf_current_user', JSON.stringify(users[idx]));
        setUser({ ...users[idx] });
    };

    const isInMyList = (imdbID) => {
        return user?.myList?.includes(imdbID) ?? false;
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, register, login, logout, addToMyList, removeFromMyList, isInMyList }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be inside AuthProvider');
    return ctx;
};
