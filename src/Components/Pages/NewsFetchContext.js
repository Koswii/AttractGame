import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const NewsFetchDataContext = createContext();

export const NewsFetchDataProvider = ({ children }) => {
    const AGAllNewsAPI = process.env.REACT_APP_AG_FETCH_NEWS_API;
    const [newsList, setNewsList] = useState([]);
    const [loader, setLoader] = useState(true);
    const [previewData, setPreviewData] = useState([]);
    const [mainLinkData, setMainLinkData] = useState([]);
    const [subLinkData, setSubLinkData] = useState([]);
    const [error, setError] = useState("");

    // Fetch data once when component mounts
    const fetchLinkPreview = async (url) => {
        try {
          const response = await axios.get(
            `https://attractgame.com/link-preview?url=${encodeURIComponent(url)}`
          );
          return response.data;
        } catch (error) {
          console.error("Error fetching link preview:", error);
          setError("Error fetching preview data");
          return null;
        }
    };

    const retrieveDataNews = async () => {
        try {
          const response = await fetch(AGAllNewsAPI);
          const data = await response.json();
  
          const filterMain = data.filter((link) => link.type === "main");
          const filterSub = data.filter((link) => link.type === "sub").sort((a,b) => (b.id) - (a.id));
          const filterOther = data.filter((link) => link.type === "other").sort((a,b) => (b.id) - (a.id));
  
          setNewsList(filterOther);
  

          const mainlink = await Promise.all(
            filterMain.map(async (linkObj) => {
              const data = await fetchLinkPreview(linkObj.link);
              return data ? { id: linkObj.id, data, link: linkObj.link } : null;
            })
          );
  
          const sublink = await Promise.all(
            filterSub.map(async (linkObj) => {
              const data = await fetchLinkPreview(linkObj.link);
              return data ? { id: linkObj.id, data, link: linkObj.link } : null;
            })
          );
  
          const otherlink = await Promise.all(
            filterOther.map(async (linkObj) => {
              const data = await fetchLinkPreview(linkObj.link);
              return data ? { id: linkObj.id, data, link: linkObj.link } : null;
            })
          );
  
          setMainLinkData(mainlink.filter(Boolean));
          setSubLinkData(sublink.filter(Boolean));
          setPreviewData(otherlink.filter(Boolean));
          setLoader(false);
        } catch (error) {
          console.error("Error retrieving data:", error);
          setError("Error fetching data");
          setLoader(false);
        }
    };

    useEffect(() => {
        retrieveDataNews();
    }, []);




    return (
        <NewsFetchDataContext.Provider value={{ 
          newsList, 
          loader, 
          previewData, 
          mainLinkData, 
          subLinkData, 
          error
        }}>
            {children}
        </NewsFetchDataContext.Provider>
    );
};

export const NewsFetchData = () => useContext(NewsFetchDataContext);