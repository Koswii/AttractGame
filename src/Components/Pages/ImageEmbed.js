import React, { useState, useEffect } from 'react';

const ImageEmbed = ({ url }) => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(url);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const imgTags = doc.querySelectorAll('img');
        const imgUrls = Array.from(imgTags).map(img => img.src);
        setImages(imgUrls);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchImages();
  }, [url]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {images.length > 0 ? (
        images.map((src, index) => <img key={index} src={src} alt={`img-${index}`} />)
      ) : (
        <p>No images found.</p>
      )}
    </div>
  );
};

export default ImageEmbed;
