import React, { useState, useEffect } from 'react';
import "../CSS/cookies.css";

const CookieBanner = () => {
    const [accepted, setAccepted] = useState(false);
    const [thirdPartyCookieBlocked, setThirdPartyCookieBlocked] = useState(false);
  
    const acceptCookies = () => {
      localStorage.setItem('cookiesAccepted', 'true');
      setAccepted(true);
    };
  
    const isCookiesAccepted = () => {
      return localStorage.getItem('cookiesAccepted') === 'true';
    };
  
    useEffect(() => {
      // Check if third-party cookies are blocked
      const testCookieKey = 'testCookie';
      document.cookie = `${testCookieKey}=1; SameSite=None; Secure`;
      const cookieValue = document.cookie.indexOf(testCookieKey) !== -1;
      if (!cookieValue) {
        setThirdPartyCookieBlocked(true);
      }
    }, []);
  
    if (isCookiesAccepted() || thirdPartyCookieBlocked) {
      return null; // If cookies are already accepted or third-party cookies are blocked, don't display the banner
    }

    return (
        <div className="mainContainer cookies">
        <p>This website uses cookies to enhance user experience. Third-party cookie will be blocked.</p>
        <button onClick={acceptCookies}>Accept</button>
        </div>
    );
};

export default CookieBanner;