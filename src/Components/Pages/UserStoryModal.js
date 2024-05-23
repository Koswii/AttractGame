import React, { useState, useEffect } from 'react'
import "../CSS/profile.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
    FaSearch,
    FaBolt,
    FaTicketAlt,
    FaGem,
    FaCoins,
    FaFire,
    FaStar,     
    FaFacebookSquare,
    FaBitcoin, 
    FaTimes,
    FaRegImages 
} from 'react-icons/fa';
import { 
    FaSquareFacebook,
    FaInstagram,
    FaTiktok,
    FaYoutube,
    FaTwitch,
    FaCircleCheck  
} from "react-icons/fa6";
import { 
    TbUserSquareRounded,
    TbGiftCardFilled,
    TbSettings2,
    TbSettingsBolt,
    TbUpload,   
} from "react-icons/tb";
import { 
    RiVerifiedBadgeFill,
    RiSparklingFill  
} from "react-icons/ri";
import { 
    IoLogoYoutube,
    IoIosImages,
    IoMdAddCircle  
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

const UserStoryModal = ({setAddPostStory}) => {
        // User Profile Fetching

    const LoginUsername = localStorage.getItem('attractGameUsername');

    const [viewRefCode, setViewRefCode] = useState('');
    const [viewCoverImg, setViewCoverImg] = useState('');
    const [viewProfileImg, setViewProfileImg] = useState('');
    const [viewUsername, setViewUsername] = useState('');
    const [viewVerifiedUser, setViewVerifiedUser] = useState('');
    const [randomNumber, setRandomNumber] = useState('');
    const [randomPostID, setRandomPostID] = useState('');
    const [viewFetchPost, setViewFetchPost] = useState([]);
    const [viewFetchStory, setViewFetchStory] = useState([]);

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
    useEffect(() => {
        const fetchUserProfile = () => {
            const storedProfileData = localStorage.getItem('profileDataJSON')
            if(storedProfileData) {
                const parsedProfileData = JSON.parse(storedProfileData);
                setViewUsername(parsedProfileData.username);
                setViewProfileImg(parsedProfileData.profileimg);
                setViewCoverImg(parsedProfileData.coverimg);
                setViewVerifiedUser(parsedProfileData.verified);
                setViewRefCode(parsedProfileData.refcode);
            }
        }
        fetchUserProfile();

    }, [LoginUsername]);
    const handleCloseAnyModals = (e) => {
        e.preventDefault();
        setAddPostStory(false)
        setImageStory(null)
    }
    const [image, setImage] = useState(null);
    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
        }
    };
    const [imageStory, setImageStory] = useState(null);
    const [imageStoryName, setImageStoryName] = useState('');
    const handleUploadUserStory = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageStory(file);
            setImageStoryName(file.name);
        }
    };
    const AGAddMediaStoryAPI = process.env.REACT_APP_AG_ADD_MEDIA_STORY_API;
    const AGAddUserStoryAPI = process.env.REACT_APP_AG_ADD_USER_STORY_API;
    const handleAddStorySubmit = async (e) => {
        e.preventDefault();
    
        const formStoryData = {
            user_username: viewUsername,
            user_verified: viewVerifiedUser,
            user_story_id: `agStory_${viewUsername}${randomPostID}`,
            user_story_date: new Date(),
            user_story_image: `agStory_${viewUsername}${randomPostID}_${imageStoryName}`,
        };
    
        const formUserStoryData = new FormData();
        formUserStoryData.append('profileuser', viewUsername);
        formUserStoryData.append('profileimg', imageStory);
        formUserStoryData.append('profileimgid', randomPostID);

    
        try {
            const [responseStoryDetails, responseStoryMedia] = await Promise.all([
                axios.post(AGAddUserStoryAPI, JSON.stringify(formStoryData)),
                axios.post(AGAddMediaStoryAPI, formUserStoryData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }),
            ]);
            const resMessageStoryDetails = responseStoryDetails.data;
            const resMessageStoryMedia = responseStoryMedia.data;
            if (!resMessageStoryDetails.success) {
                setAddPostStory(false);
            }
            if (!resMessageStoryMedia.success) {
                console.log(resMessageStoryMedia.message);
            }
            if (!resMessageStoryMedia.failed) {
                setAddPostStory(false);
            }
            if (!resMessageStoryMedia.failed) {
                console.log(resMessageStoryMedia.message);
            }
        } catch (error) {
            console.error(error);
        } 
    
    };


    return (
        <>
            <div className="modalContainerProfile addStory">
                <div className="modalContentStory"
                    style={viewCoverImg ? {background: `linear-gradient(transparent, black 80%), url(https://2wave.io/CoverPics/${viewCoverImg})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover',}
                    :{background: 'linear-gradient(transparent, black 80%), url(https://2wave.io/CoverPics/LoginBackground.jpg)', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover',}}>
                    <button id='closeModalStory' onClick={handleCloseAnyModals}><FaTimes className='faIcons'/></button>
                    <form className="mdcsStoryContainer" onSubmit={handleAddStorySubmit}>
                        <div className='mdcsscDP'>
                            {viewProfileImg ? 
                            <img src={`https://2wave.io/ProfilePics/${viewProfileImg}`} alt=""/>
                            :<img src={require('../assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
                            <h6>
                                {viewUsername} 
                                {viewVerifiedUser ? <>
                                    {viewVerifiedUser === 'Gold' ? <RiVerifiedBadgeFill className='faIcons gold'/> : <></>}
                                    {viewVerifiedUser === 'Blue' ? <RiVerifiedBadgeFill className='faIcons blue'/> : <></>}
                                </>:<></>} <br />
                                <span>{viewRefCode}</span>
                            </h6>
                        </div>
                        {imageStory ? 
                            <img src={URL.createObjectURL(imageStory)} alt="No image Selected" /> :
                            <h6>Add Gamer Story...</h6>
                        }
                        <input type="file" onChange={handleUploadUserStory} required/>
                        <button type='submit'><FaRegImages className='faIcons'/> ADD STORY</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default UserStoryModal