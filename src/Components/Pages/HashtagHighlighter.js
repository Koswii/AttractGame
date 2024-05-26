import React from 'react';
import PropTypes from 'prop-types';
import '../CSS/hashtag.css';

const HashtagHighlighter = ({ text }) => {
    // Regular expression to find hashtags
    const hashtagRegex = /#\w+/g;
    
    // Split the text by the hashtags while keeping the hashtags using match and split
    const parts = text.split(/(#\w+)/g);
  
    return (
      <p>
        {parts.map((part, index) => {
          // Check if the part is a hashtag
          if (hashtagRegex.test(part)) {
            return <span key={index} className="highlight">{part}</span>;
          }
          // Otherwise, render the part normally
          return <span key={index}>{part}</span>;
        })}
      </p>
    );
  };
  
  HashtagHighlighter.propTypes = {
    text: PropTypes.string.isRequired,
  };
  
  export default HashtagHighlighter;
