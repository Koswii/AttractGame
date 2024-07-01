import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

import { ActivePageProvider } from './Components/Pages/ActivePageContext';
import { UserProfileDataProvider } from './Components/Pages/UserProfileContext';
import { GamesFetchDataProvider } from './Components/Pages/GamesFetchContext';
import { GiftcardsFetchDataProvider } from './Components/Pages/GiftcardsFetchContext';
import { NewsFetchDataProvider } from './Components/Pages/NewsFetchContext';




import CookieBanner from './Components/Pages/CookieBanner';
import Nav from './Components/Nav'
import Footer from './Components/Pages/footer';
import ScrollToTop from './Components/Pages/ScrollToTop';
import Admin from './Components/Pages/Admin';
import Profile from './Components/Pages/Profile';
import Favorites from './Components/Pages/Favorites';
import Cart from './Components/Pages/Cart';

import Loader from './Components/Pages/Loader';
import Home from './Components/Pages/Home'
import Highlights from './Components/Pages/Highlights';
import Marketplace from './Components/Pages/Marketplace';
import Games from './Components/Pages/Games';
import Game from './Components/Pages/Game';
import Giftcards from './Components/Pages/Giftcards';
import Giftcard from './Components/Pages/Giftcard';

import Robux from './Components/Pages/Robux';

import AboutUs from './Components/Pages/AboutUs';
import ContactUs from './Components/Pages/ContactUs';
import FAQs from './Components/Pages/faqs';
import TermsAndCondition from './Components/Pages/TermsAndCondition';
import PrivacyAndPolicies from './Components/Pages/PrivacyAndPolicies';

import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import News from './Components/Pages/News';
import Success from './Components/Pages/success';

import Underdevelop from './Components/Pages/underdevelop';




function App() {
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const LoginUsername = localStorage.getItem('attractGameUsername');
  const userLoggedInState = localStorage.getItem('isLoggedIn');
  const userLoggedInDetails = localStorage.getItem('profileDataJSON');
  const getAdminCredentials = localStorage.getItem('agAdminLoggedIn');

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
  

  return (
    <ActivePageProvider>
      <UserProfileDataProvider>
        <GamesFetchDataProvider>
        <GiftcardsFetchDataProvider>
        <NewsFetchDataProvider>
        <Router>
        <div>
          <ScrollToTop />
          <Nav />
          <CookieBanner />
          <Routes>
            <Route exact path="/" element={<Home/>}/>
            <Route exact path="/Highlights" element={<Highlights/>}/>
            <Route exact path="/Marketplace" element={<Marketplace/>}/>
            <Route exact path="/Games" element={<Games/>}/>
            <Route exact path="/News" element={<News/>}/>
            <Route exact path="/Games/:gameCanonical" element={<Game/>}/>
            <Route exact path="/Giftcards" element={<Giftcards/>}/>
            <Route exact path="/Giftcards/:giftcardCanonical" element={<Giftcard/>}/>
            <Route exact path="/GameCredits/Robux" element={<Robux/>}/>
            {/* <Route exact path="/Giftcard" element={<Giftcard/>}/> */}
            {(LoginUsername != null && userLoggedInState != null && userLoggedInDetails != undefined) ?
            <>
              <Route exact path="/MyProfile" element={<Profile/>}/>
              <Route exact path="/MyFavorites" element={<Favorites/>}/>
              <Route exact path="/MyCart" element={<Cart/>}/>
              <Route exact path="/success" element={<Success/>}/>
            </>:<Route path="*" element={<Home/>}/>}
            {(getAdminCredentials && userLoggedInState) && <Route path="/Admin" element={<Admin/>}/>}

              

            <Route exact path="/AboutUs" element={<AboutUs/>}/>
            <Route exact path="/ContactUS" element={<ContactUs/>}/>
            <Route exact path="/FAQs" element={<FAQs/>}/>
            <Route exact path="/TermsAndConditions" element={<TermsAndCondition/>}/>
            <Route exact path="/PrivacyAndPolicies" element={<PrivacyAndPolicies/>}/>


            <Route exact path="/AGElite" element={<Underdevelop/>}/>
            <Route exact path="/ApplyAsSeller" element={<Underdevelop/>}/>
            <Route exact path="/ContentCreation" element={<Underdevelop/>}/>
            <Route exact path="/AGCrypto" element={<Underdevelop/>}/>
            <Route path="*" element={<Home/>}/>
          </Routes>
          <Footer />
        </div>
        </Router>
        </NewsFetchDataProvider>
        </GiftcardsFetchDataProvider>
        </GamesFetchDataProvider>
      </UserProfileDataProvider>
    </ActivePageProvider>
  );
}


export default App;
