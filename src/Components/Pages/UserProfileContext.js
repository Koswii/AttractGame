import React, { createContext, useContext, useState, useEffect } from 'react';

const UserProfileContext = createContext();

export const UserProfileDataProvider = ({ children }) => {
    const [userLoggedData, setUserLoggedData] = useState([]);

    // Fetch data once when component mounts
    useEffect(() => {
        const fetchUserProfile = () => {
            const storedProfileData = localStorage.getItem('profileDataJSON')
            if(storedProfileData) {
                setUserLoggedData(JSON.parse(storedProfileData))
            }
            
        }
        fetchUserProfile();
    }, []);

    return (
        <UserProfileContext.Provider value={{ userLoggedData }}>
            {children}
        </UserProfileContext.Provider>
    );
};

export const UserProfileData = () => useContext(UserProfileContext);