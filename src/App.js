import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

import CookieBanner from './Components/Pages/CookieBanner';
import Nav from './Components/Nav'
// import Footer from './Components/Pages/footer';
import ScrollToTop from './Components/Pages/ScrollToTop';
import Admin from './Components/Pages/Admin';
import Profile from './Components/Pages/Profile';

import Loader from './Components/Pages/Loader';
import Home from './Components/Pages/Home'
import Marketplace from './Components/Pages/Marketplace';
import Games from './Components/Pages/Games';
import Game from './Components/Pages/Game';


import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [viewUserCredentials, setViewUserCredentials] = useState(false)
  const [viewAdminCredentials, setViewAdminCredentials] = useState(false)
  const AGUserListAPI = process.env.REACT_APP_AG_USERS_LIST_API;

  useEffect(() => {
    // Display loader when the page is being reloaded
    window.addEventListener('beforeunload', () => {
      setIsLoading(true);
    });

    // Hide loader when the page is fully loaded
    window.addEventListener('load', () => {
      setIsLoading(false);
    });

    return () => {
      // Clean up event listeners
      window.removeEventListener('beforeunload', () => {});
      window.removeEventListener('load', () => {});
    };
  }, []);
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);
  
    // Listen to route changes and update loading state accordingly
    const history = window.history;
    const pushState = history.pushState;
    
    history.pushState = (...args) => {
      handleStart();
      const result = pushState.apply(history, args);
      setTimeout(handleComplete, 2000); // Delay handleComplete() by 10 seconds
      return result;
    };
  
    const popstateHandler = () => {
      handleStart();
      setTimeout(handleComplete, 2000); // Delay handleComplete() by 10 seconds
    };
  
    window.addEventListener('popstate', popstateHandler);
  
    return () => {
      window.removeEventListener('popstate', popstateHandler);
    };
  }, []);


  const LoginUsername = localStorage.getItem('attractGameUsername');
  const [dataUser, setDataUser] = useState('');
  const [dataAccount, setDataAccount] = useState('')

  useEffect(() => {
    const fetchDataUser = () => {
      axios.get(AGUserListAPI)
      .then((response) => {
        const userData = response.data.find(item => item.username == LoginUsername);
        setDataAccount([userData['account']]);
        setDataUser([userData['username']]);
      })
      .catch(error => {
        // console.log(error)
      })
    }
    fetchDataUser();
  }, []);
  
  useEffect(() => {
    const userFromLocalStorage = localStorage.getItem('isLoggedIn');
    if (userFromLocalStorage == 'true') {
      setViewUserCredentials(true);
    }

    if (dataAccount == 'Admin'){
      const getUserAccountState = localStorage.getItem('agAdminLoggedIn');
      setViewAdminCredentials(getUserAccountState);
    }
  }, [dataAccount]);


  return (
    <Router>
    <div>
      <ScrollToTop />
      {loading || isLoading ? <Loader />:
      <>
        <Nav />
        <CookieBanner />
        <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route exact path="/Marketplace" element={<Marketplace/>}/>
          <Route exact path="/Games" element={<Games/>}/>
          <Route exact path="/Games/:gameCanonical" element={<Game/>}/>
          <Route exact path="/Profile" element={<Profile/>}/>
          {viewAdminCredentials && <Route path="/Admin" element={<Admin/>}/>}
          {/* <Route path="/Admin" element={<Admin/>}/> */}




          {/* <Route path="*" element={<Home/>}/> */}
        </Routes>
        {/* <Footer /> */}
      </>}
    </div>
    </Router>
  );
}


export default App;
