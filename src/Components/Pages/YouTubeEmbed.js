import React from 'react';
import "../CSS/game.css";

const YouTubeEmbed = ({ videoUrl }) => {
  // Extract the video ID from the YouTube URL
  const videoId = videoUrl.split('v=')[1];

  return (
    <div id='anyYoutubePostContent' className="youtube-embed">
      <iframe
        title="YouTube Video"
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default YouTubeEmbed;