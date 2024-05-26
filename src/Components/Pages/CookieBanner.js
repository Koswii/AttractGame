import React, { useState, useEffect } from 'react';
import "../CSS/cookies.css";

const CookieBanner = () => {
    const [accepted, setAccepted] = useState(false);
    const [thirdPartyCookieBlocked, setThirdPartyCookieBlocked] = useState(false);

    const acceptCookies = () => {
        localStorage.setItem('cookiesAccepted', 'true');
        setAccepted(true);

        // Allow third-party cookies
        document.cookie = `thirdPartyAccepted=true; path=/; SameSite=None; Secure`;
    };

    const isCookiesAccepted = () => {
        return localStorage.getItem('cookiesAccepted') === 'true';
    };

    useEffect(() => {
        // Check if third-party cookies are blocked
        const testCookieKey = 'testCookie';
        document.cookie = `${testCookieKey}=1; SameSite=None; Secure`;
        const cookieValue = document.cookie.includes(testCookieKey);
        if (!cookieValue) {
            setThirdPartyCookieBlocked(true);
        }

        // Cleanup test cookie
        document.cookie = `${testCookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure`;

        // Set accepted state if cookies are already accepted
        if (isCookiesAccepted()) {
            setAccepted(true);
        }
    }, []);

    if (accepted || thirdPartyCookieBlocked) {
        return null; // If cookies are already accepted or third-party cookies are blocked, don't display the banner
    }

    return (
        <div className="mainContainer cookies">
            <p>This website uses cookies to enhance user experience. By accepting, you agree to the use of third-party cookies.</p>
            <button onClick={acceptCookies}>Accept</button>
        </div>
    );
};

export default CookieBanner;
