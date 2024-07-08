import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserProfileContext = createContext();

export const UserProfileDataProvider = ({ children }) => {
    const [userLoggedData, setUserLoggedData] = useState([]);
    const LoginUsername = localStorage.getItem('attractGameUsername');
    const AGUserListAPI = process.env.REACT_APP_AG_USERS_LIST_API;
    const AGUserDataAPI = process.env.REACT_APP_AG_USERS_PROFILE_API;

    // Fetch data once when component mounts
    useEffect(() => {
        const fetchUserProfile = async  () => {
            try {
                const [userListResponse, userDataResponse] = await Promise.all([
                  axios.get(AGUserListAPI),
                  axios.get(AGUserDataAPI)
                ]);
                const userDataStatus = userListResponse.data.find(item => item.username === LoginUsername);
                
                const storedProfileData = localStorage.getItem('profileDataJSON')
                if(storedProfileData) {
                    setUserLoggedData(JSON.parse(storedProfileData))
                }
            } catch (error) {
                console.error(error);
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