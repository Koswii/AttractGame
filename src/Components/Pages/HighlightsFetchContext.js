import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const HighlightsFetchDataContext = createContext();

export const HighlightsFetchDataProvider = ({ children }) => {
    const AGUserDataAPI = process.env.REACT_APP_AG_USERS_PROFILE_API;
    const AGUserPostAPI = process.env.REACT_APP_AG_FETCH_POST_API;
    const AGUserStoryAPI = process.env.REACT_APP_AG_FETCH_STORY_API;
    const PAGE_SIZE = 5; // Number of items to fetch per page

    
    const userStateLogin = localStorage.getItem('isLoggedIn');
    const adminLoggedIn = localStorage.getItem('agAdminLoggedIn');
    const userDetailData = localStorage.getItem('profileDataJSON');
    
    const [userLoggedData, setUserLoggedData] = useState('')
    const [viewFetchPost, setViewFetchPost] = useState([]);
    const [viewFetchStory, setViewFetchStory] = useState([]);
    const [postLoading, setPostLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [viewProfileDetails, setViewProfileDetails] = useState(false);
    const [selectedPostData, setSelectedPostData] = useState(null);
    const [initialLoad, setInitialLoad] = useState(true);


    const [currentStory, setCurrentStory] = useState(null);
    const [seenStories, setSeenStories] = useState([]);

    const isWithinLastTwelveHours = (date) => {
        const twelveHoursAgo = new Date();
        twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 24);
        return new Date(date) >= twelveHoursAgo;
    };
    const isWithinLastThreeDays = (date) => {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 15);
        return new Date(date) >= threeDaysAgo;
    };
    const fetchUserData = async (url, filterFunc) => {
        try {
            const response = await axios.get(url);
            const filteredData = response.data.filter(item => filterFunc(item.user_post_date || item.user_story_date));
            const sortedData = filteredData.sort((a, b) => new Date(b.user_post_date || b.user_story_date) - new Date(a.user_post_date || a.user_story_date));
            const userDataResponse = await axios.get(AGUserDataAPI);
            const dataWithUserData = sortedData.map(item => {
                const userData = userDataResponse.data.find(user => user.userid === item.user_id);
                return { ...item, userData };
            });
            return dataWithUserData;
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    };
    const fetchAllUserData = async (offset) => {
        setPostLoading(true);
        const [storyData, postData] = await Promise.all([
            fetchUserData(`${AGUserStoryAPI}?offset=${offset}&limit=${PAGE_SIZE}`, isWithinLastTwelveHours),
            fetchUserData(`${AGUserPostAPI}?offset=${offset}&limit=${PAGE_SIZE}`, isWithinLastThreeDays)
        ]);
    
        if (storyData.length > 0 || postData.length > 0) {
            setViewFetchStory(prevData => [...prevData, ...storyData]);
            setViewFetchPost(prevData => [...prevData, ...postData]);

        }
        setPostLoading(false);
    };
    const fetchUserProfile = () => {
        const storedProfileData = localStorage.getItem('profileDataJSON');
        if (storedProfileData) {
            setUserLoggedData(JSON.parse(storedProfileData));
        }
    }

    const handleStoryClick = (story) => {
        setCurrentStory(story);
    };
    const handleCloseModal = () => {
        setSeenStories([...seenStories, currentStory.id]);
        setCurrentStory(null);
    };
    useEffect(() => {
        let timer;
        if (currentStory) {
          timer = setTimeout(() => {
            const currentIndex = viewFetchStory.findIndex((story) => story.id === currentStory.id);
            const nextIndex = (currentIndex + 1) % viewFetchStory.length;
            const nextStory = viewFetchStory[nextIndex];
            setSeenStories([...seenStories, currentStory.id]);
            setCurrentStory(nextStory);
          }, 3000);
        }
        return () => clearTimeout(timer);
    }, [currentStory, viewFetchStory, seenStories]);
    useEffect(() => {
        if (seenStories.length === viewFetchStory.length) {
          setSeenStories('');
        }
    }, [seenStories, viewFetchStory]);
    const visibleStories = viewFetchStory.filter(story => !seenStories.includes(story.id));

    return (
        <HighlightsFetchDataContext.Provider value={{ 
            userStateLogin, 
            adminLoggedIn,
            userDetailData,
            userLoggedData,
            fetchUserProfile,
        }}>
            {children}
        </HighlightsFetchDataContext.Provider>
    );
};

export const HighlightsFetchData = () => useContext(HighlightsFetchDataContext);