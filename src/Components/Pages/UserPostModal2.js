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



const UserPostModal2 = ({setAddUserPost2}) => {

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
    const [userPostSubmitting, setUserPostSubmitting] = useState(false);

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

    const getUserPostState = localStorage.getItem('setUserCanPost');
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

        
    }, [LoginUsername]);
    const renderPostingState1 = () => {
        if (getUserPostState === 'false'){
            return (
                <button className='active' type='button' disabled>Limited Posting</button>
            );
        } else {
            return (
                <button className='active' type='button' disabled>Post Highlight</button>
            );
        }
    };
    const renderPostingState2 = () => {
        if (getUserPostState === 'false'){
            return (
                <button className='active' type='button' disabled>Limited Posting</button>
            );
        } else {
            return (
                <button type='submit'>Post Highlight</button>
            );
        }
    };
    
    const [addPostYoutubeLink, setAddPostYoutubeLink] = useState(false);
    const [addPostMedia, setAddPostMedia] = useState(true);
    const handleCloseAnyModals = () => {
        setAddUserPost2(false)
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
    const handleRemoveUserImage = () => {
        setImagePost(null)
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
        setUserPostSubmitting(true);
    
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
                setAddUserPost2(false);
                window.location.reload();
            }
            if (!resMessagePostMedia.success) {
                console.log(resMessagePostMedia.message);
            }
            if (!resMessagePostDetails.failed) {
                setAddUserPost2(false);
            }
            if (!resMessagePostMedia.failed) {
                console.log(resMessagePostMedia.message);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setUserPostSubmitting(false);
        }
    
    };


    return (
        <>
            <div className="modalContainerProfile posting">
                <div className="modalContentPosting">
                    {viewCoverImg ? 
                    <img id='modalCSCover' src={`https://2wave.io/CoverPics/${viewCoverImg.replace(/ /g, '%20')}`} alt="" />
                    :<img id='modalCSCover' src={require('../assets/imgs/LoginBackground.jpg')} alt="" />}
                    <div className="modalCSCoverShadow"></div>
                    <button id='closeModalPosting' onClick={handleCloseAnyModals}><FaTimes className='faIcons'/></button>
                    <form id='userPostModalContainer' onSubmit={handleAddPostSubmit}>
                        <div className="mdcpPostingContainer">
                            <div className='mdcppcPostUser'>
                                <div>
                                    {viewProfileImg ? 
                                    <img src={`https://2wave.io/ProfilePics/${viewProfileImg}`} alt=""/>
                                    :<img src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')}/>}
                                </div>
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
                                    {!userPostSubmitting ? 
                                    <>{viewVerifiedUser ? <>
                                        {!agPostContent? 
                                            <><button className='active' type='button' disabled>Post Highlight</button></>:
                                            <>
                                            <button type='submit'>Post Highlight</button>
                                            </>
                                        }
                                    </>:
                                    <>{!agPostContent? renderPostingState1() : renderPostingState2()}</>}</>
                                    :<><button className='active' type='button' disabled>Uploading Post</button></>}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default UserPostModal2