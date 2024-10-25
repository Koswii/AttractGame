import React, { useEffect } from 'react';

const TawkToChat = () => {
  useEffect(() => {
    var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
    const s1 = document.createElement('script');
    s1.src = 'https://embed.tawk.to/66bc4c92146b7af4a43a2063/1ib20h9k5';
    s1.async = true;
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    document.body.appendChild(s1);

    return () => {
      document.body.removeChild(s1);
    };
  }, []);

  return null;
};

export default TawkToChat;
