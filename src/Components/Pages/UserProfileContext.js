import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserProfileContext = createContext();

export const UserProfileDataProvider = ({ children }) => {
    const [userLoggedData, setUserLoggedData] = useState([]);
    const [userEmail, setUserEmaiil] = useState([]);
    const LoginUsername = localStorage.getItem('attractGameUsername');
    const LoginUserID = localStorage.getItem('profileUserID');
    const AGUserListAPI = process.env.REACT_APP_AG_USERS_LIST_API;
    const AGUserDataAPI = process.env.REACT_APP_AG_USERS_PROFILE_API;
    const AGUserEmailsAPI = process.env.REACT_APP_AG_USER_EMAIL_API;


    const fetchUsersEmails = async () => {
        try {
          const response = await axios.get(AGUserEmailsAPI);
          setUserEmaiil(response.data);
        } catch (error) {
          console.error(error);
        }
      };

    // Fetch data once when component mounts
    useEffect(() => {
        const fetchUserProfile = async  () => {
            try {
                const [userListResponse, userDataResponse] = await Promise.all([
                  axios.get(AGUserListAPI),
                  axios.get(AGUserDataAPI)
                ]);
                const userDataStatus = userListResponse.data.find(item => item.userid === LoginUserID);
                
                const storedProfileData = localStorage.getItem('profileDataJSON')
                if(storedProfileData) {
                    setUserLoggedData(JSON.parse(storedProfileData))
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchUserProfile();
        fetchUsersEmails();
    }, []);

    return (
        <UserProfileContext.Provider value={{ userLoggedData, userEmail, fetchUsersEmails }}>
            {children}
        </UserProfileContext.Provider>
    );
};

export const UserProfileData = () => useContext(UserProfileContext);