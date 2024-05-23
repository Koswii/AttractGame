import React, { useState, useEffect } from 'react'
import "../CSS/profile.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
    FaTimes,
} from 'react-icons/fa';
import { 
    RiVerifiedBadgeFill,
} from "react-icons/ri";
import { 
    IoLogoYoutube,
    IoIosImages,
} from "react-icons/io";

const formatDateToWordedDate = (numberedDate) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const date = new Date(numberedDate);
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${month} ${day}, ${year}`;
}

const formatDate = (date) => {
    const givenDate = new Date(date);
    const currentDate = new Date();
  
    // Clear the time part of the dates
    const currentDateNoTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const givenDateNoTime = new Date(givenDate.getFullYear(), givenDate.getMonth(), givenDate.getDate());
  
    const timeDifference = currentDateNoTime - givenDateNoTime;
    const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
  
    if (timeDifference === 0) {
      return "Now";
    } else if (timeDifference === oneDay) {
      return "Yesterday";
    } else {
      return formatDateToWordedDate(givenDate);
    }
};

const parseDateString = (dateString) => {
    const [datePart, timePart] = dateString.split(' ');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds);
};

const UserPostModal = ({setAddUserPost}, {setPostContentState}) => {

    const AGUserDataAPI = process.env.REACT_APP_AG_USERS_PROFILE_API;
    const AGUserPostAPI = process.env.REACT_APP_AG_FETCH_POST_API;
    const LoginUsername = localStorage.getItem('attractGameUsername');

    const [viewUserID, setViewUserID] = useState('')
    const [viewRefCode, setViewRefCode] = useState('');
    const [viewCoverImg, setViewCoverImg] = useState('');
    const [viewProfileImg, setViewProfileImg] = useState('');
    const [viewUsername, setViewUsername] = useState('');
    const [viewVerifiedUser, setViewVerifiedUser] = useState('');
    const [randomNumber, setRandomNumber] = useState('');
    const [randomPostID, setRandomPostID] = useState('');
    const [viewFetchPost, setViewFetchPost] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
        const number = Math.floor(Math.random() * 900000) + 100000; // Generates a 6-digit number
        setRandomNumber(number);
        }, 1000); // Change interval as needed (in milliseconds)

        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        const interval = setInterval(() => {
        const number = Math.floor(Math.random() * 90000000) + 10000000; // Generates a 8-digit number
        setRandomPostID(number);
        }, 1000); // Change interval as needed (in milliseconds)

        return () => clearInterval(interval);
    }, []);
    const [localTime, setLocalTime] = useState(new Date());
    const [icelandTime, setIcelandTime] = useState('');
    useEffect(() => {
        const timer = setInterval(() => {
            setLocalTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);
    useEffect(() => {
        const options = {
            timeZone: 'Atlantic/Reykjavik',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false, // 24-hour format
        };
        const dateOptions = {
            timeZone: 'Atlantic/Reykjavik',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        };

        const icelandFormatter = new Intl.DateTimeFormat([], options);
        const dateFormatter = new Intl.DateTimeFormat([], dateOptions);
        const icelandFormattedTime = icelandFormatter.format(localTime);
        const icelandFormattedDate = dateFormatter.format(localTime);

        // Combine date and time in "yyyy-mm-dd HH:MM:SS" format
        const [month, day, year] = icelandFormattedDate.split('/');
        const formattedDate = `${year}-${month}-${day}`;
        setIcelandTime(`${formattedDate} ${icelandFormattedTime}`);
    }, [localTime]);
    const [canPost, setCanPost] = useState(false);
    const [postTimeRemaining, setPostTimeRemaining] = useState('');
    useEffect(() => {
        const fetchUserProfile = () => {
            const storedProfileData = localStorage.getItem('profileDataJSON')
            if(storedProfileData) {
                const parsedProfileData = JSON.parse(storedProfileData);
                setViewUserID(parsedProfileData.id);
                setViewUsername(parsedProfileData.username);
                setViewProfileImg(parsedProfileData.profileimg);
                setViewCoverImg(parsedProfileData.coverimg);
                setViewVerifiedUser(parsedProfileData.verified);
                setViewRefCode(parsedProfileData.refcode);
            }
        }
        fetchUserProfile();

        const fetchUserDataPost = () => {
            axios.get(AGUserPostAPI)
            .then((response) => {
                const postSortData = response.data.sort((a, b) => b.id - a.id);
                const postData = postSortData.filter(post => post.user == LoginUsername);
                setViewFetchPost(postData);

                const latestPostDate = postData.slice(0, 1).map(post => post.user_post_date);
                const latestDateNumbered = parseDateString(`${latestPostDate}`);
                const nextPostDateNumbered = new Date(latestDateNumbered.getTime() + 12 * 60 * 60 * 1000);
                const serverDateNumbered = parseDateString(icelandTime);
                const postDateDifference = nextPostDateNumbered - serverDateNumbered;
                
                if (postDateDifference <= 0) {
                    setCanPost(true);
                } else {
                    setCanPost(false);
                    const hours = Math.floor((postDateDifference / (1000 * 60 * 60)) % 24);
                    const minutes = Math.floor((postDateDifference / 1000 / 60) % 60);
                    const seconds = Math.floor((postDateDifference / 1000) % 60);
                    setPostTimeRemaining(`${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`);
                }


            })
            .catch(error => {
                console.log(error)
            })
        }
        fetchUserDataPost();
    }, [LoginUsername, icelandTime]);
    const [addPostYoutubeLink, setAddPostYoutubeLink] = useState(false);
    const [addPostMedia, setAddPostMedia] = useState(false);
    const handleCloseAnyModals = () => {
        setAddUserPost(false)
    }
    const handlePostYoutubeLink = () => {
        setAddPostYoutubeLink(true)
        setAddPostMedia(false)
    }
    const closeAddYoutubeLink = () => {
        setAddPostYoutubeLink(false)
    }
    const handlePostMedia = () => {
        setAddPostMedia(true)
        setAddPostYoutubeLink(false)
    }
    const closeAddPostMedia = () => {
        setAddPostMedia(false)
        setImagePost(null)
    }
    const [imagePost, setImagePost] = useState(null);
    const [imagePostName, setImagePostName] = useState('');
    const handleUploadMediaChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImagePost(file);
            setImagePostName(file.name);
        }
    };
    const [agPostContent, setAGPostContent] = useState('');
    const [agPostYoutube, setAGPostYoutube] = useState('');
    const postMaxCharacters = 250;
    const AGAddMediaAPI = process.env.REACT_APP_AG_ADD_MEDIA_POST_API;
    const AGAddUserPostAPI = process.env.REACT_APP_AG_ADD_USER_POST_API;
    const handlePostCharacters = (event) => {
        if (event.target.value.length <= postMaxCharacters) {
            setAGPostContent(event.target.value);
        }
    };
    const renderImagePost = () => {
        if (imagePostName == ''){
            return (
                ''
            );
        } else {
            return (
                `agHighlight_${viewUsername}${randomPostID}_${imagePostName}`
            );
        }
    };
    const handleAddPostSubmit = async (e) => {
        e.preventDefault();
    
        const formPostData = {
            user_username: viewUsername,
            user_verified: viewVerifiedUser,
            user_post_id: `agHighlight_${viewUsername}${randomPostID}`,
            user_post_date: new Date(),
            user_post_text: agPostContent,
            user_post_youtube: agPostYoutube,
            user_post_image: renderImagePost(),
            user_post_video: renderImagePost(),
        };
    
        const formUserPostData = new FormData();
        formUserPostData.append('profileuser', viewUsername);
        formUserPostData.append('profileimg', imagePost);
        formUserPostData.append('profileimgid', randomPostID);

    
        try {
            const [responsePostDetails, responsePostMedia] = await Promise.all([
                axios.post(AGAddUserPostAPI, JSON.stringify(formPostData)),
                axios.post(AGAddMediaAPI, formUserPostData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }),
            ]);
            const resMessagePostDetails = responsePostDetails.data;
            const resMessagePostMedia = responsePostMedia.data;
            if (!resMessagePostDetails.success) {
                setAddUserPost(false);
            }
            if (!resMessagePostMedia.success) {
                console.log(resMessagePostMedia.message);
            }
            if (!resMessagePostDetails.failed) {
                setAddUserPost(false);
            }
            if (!resMessagePostMedia.failed) {
                console.log(resMessagePostMedia.message);
            }
        } catch (error) {
            console.error(error);
        } 
    
    };


    return (
        <>
            <div className="modalContainerProfile posting">
                <div className="modalContentPosting"
                    style={viewCoverImg ? {background: `linear-gradient(transparent, black 80%), url(https://2wave.io/CoverPics/${viewCoverImg})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover',}
                    :{background: 'linear-gradient(transparent, black 80%), url(https://2wave.io/CoverPics/LoginBackground.jpg)', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover',}}>
                    <button id='closeModalPosting' onClick={handleCloseAnyModals}><FaTimes className='faIcons'/></button>
                    <form onSubmit={handleAddPostSubmit}>
                        <div className="mdcpPostingContainer">
                            <div className='mdcppcPostUser'>
                                {viewProfileImg ? 
                                <img src={`https://2wave.io/ProfilePics/${viewProfileImg}`} alt=""/>
                                :<img src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')}/>}
                                <span>
                                    <h5>
                                        {viewUsername} 
                                        {viewVerifiedUser ? <>
                                            {viewVerifiedUser === 'Gold' ? <RiVerifiedBadgeFill className='faIcons gold'/> : <></>}
                                            {viewVerifiedUser === 'Blue' ? <RiVerifiedBadgeFill className='faIcons blue'/> : <></>}
                                        </>:<></>}
                                    </h5>
                                    <p>{viewRefCode}</p>
                                </span>
                            </div>
                            <div className="mdcppcPostContent">
                                <div className='mdcppcpcPost'>
                                    <textarea name="" id="" value={agPostContent} maxLength={250} placeholder='Post about your Gameplay...' onChange={handlePostCharacters}></textarea>
                                    <p>{agPostContent.length} / {postMaxCharacters}</p>
                                </div>
                                {addPostYoutubeLink && <div className="mdcppcpcAddition youtube">
                                    <input type="text" placeholder='Place YouTube Link here...' onChange={(e) => setAGPostYoutube(e.target.value)}/>
                                    <button onClick={closeAddYoutubeLink}><FaTimes className='faIcons'/></button>
                                </div>}
                                {addPostMedia && <div className="mdcppcpcAddition media">
                                    <div className='mdcppcpcaMedia'>
                                        <div>
                                            {imagePost ? 
                                                <img src={URL.createObjectURL(imagePost)} alt="No image Selected" /> :
                                                <h6>Select/Drop Image only</h6>
                                            }
                                        </div>
                                        <input type="file" accept='image/*' onChange={handleUploadMediaChange}/>    
                                    </div>
                                    <button onClick={closeAddPostMedia}><FaTimes className='faIcons'/></button>
                                </div>}
                            </div>
                            <div className="mdcppcPostButton">
                                <div className='mdcppcpb left'>
                                    <button type='button' className={addPostYoutubeLink ? 'active' : ''} onClick={handlePostYoutubeLink}><IoLogoYoutube className='faIcons'/></button>
                                    <button type='button' className={addPostMedia ? 'active' : ''} onClick={handlePostMedia}><IoIosImages className='faIcons'/></button>
                                </div>
                                <div className='mdcppcpb right'>
                                    {viewVerifiedUser ? <>
                                        {!agPostContent? 
                                            <><button className='active' type='button' disabled>Post Highlight</button></>:
                                            <>
                                            <button type='submit'>Post Highlight</button>
                                            </>
                                        }
                                    </>:
                                    <>
                                        {!agPostContent? 
                                            <>
                                                {!canPost ?
                                                <>
                                                    <button id='cantPostWeb' className='active' type='button' disabled>{postTimeRemaining}</button>
                                                    <button id='cantPostMobile' className='active' type='button' disabled>Limited Posting</button>
                                                </>:
                                                <button className='active' type='button' disabled>Post Highlight</button>}
                                            </>:
                                            <>
                                                {!canPost ?
                                                <>
                                                    <button id='cantPostWeb' className='active' type='button' disabled>{postTimeRemaining}</button>
                                                    <button id='cantPostMobile' className='active' type='button' disabled>Limited Posting</button>
                                                </>:
                                                <button type='submit'>Post Highlight</button>}
                                            </>
                                        }
                                    </>
                                    }
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default UserPostModal