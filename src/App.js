import React, { useState, useEffect } from 'react';
import './App.css';


import Nav from './Components/Nav'
// import Footer from './Components/Pages/footer';
import ScrollToTop from './Components/Pages/ScrollToTop';

import Loader from './Components/Pages/Loader';
import Home from './Components/Pages/Home'



import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    <Router>
    <div>
      <ScrollToTop />
      {loading || isLoading ? <Loader />:
      <>
        <Nav />
        <Routes>
          <Route path="/" element={<Home/>}/>


        </Routes>
        {/* <Footer /> */}
      </>}
    </div>
    </Router>
  );
}


export default App;
