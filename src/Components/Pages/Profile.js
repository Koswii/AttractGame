import React, { useState } from 'react'
import "../CSS/profile.css";
import { Link } from 'react-router-dom';
import { 
    FaSearch,
    FaBolt,
    FaTicketAlt,
    FaGem,
    FaFire,
    FaStar,     
    FaFacebookSquare,
    FaBitcoin, 
    FaTimes
} from 'react-icons/fa';
import { 
    FaSquareFacebook,
    FaInstagram,
    FaTiktok,
    FaYoutube,
    FaTwitch 
} from "react-icons/fa6";
import { 
    TbGiftCardFilled,
    TbSettings2  
} from "react-icons/tb";
import { 
    RiVerifiedBadgeFill 
} from "react-icons/ri";
import { 
    IoIosImages,
    IoMdAddCircle  
} from "react-icons/io";

const Profile = () => {

    const [pickProfileImg00, setPickProfileImg00] = useState('DefaultProfilePic.png');
    const [editSocialsModal, setEditSocialsModal] = useState(false);

    const switchToDP01 = () => {
        setPickProfileImg00('AG Logo1.png')
    }
    const switchToDP02 = () => {
        setPickProfileImg00('AG Logo2.png')
    }
    const switchToDP03 = () => {
        setPickProfileImg00('AG Logo3.png')
    }
    const switchToDP04 = () => {
        setPickProfileImg00('AG Logo4.png')
    }
    const switchToDP05 = () => {
        setPickProfileImg00('AG Logo5.png')
    }
    const switchToDP06 = () => {
        setPickProfileImg00('DefaultProfilePic.png')
    }
    const switchToDP07 = () => {
        setPickProfileImg00('MaleDP01.png')
    }
    const switchToDP08 = () => {
        setPickProfileImg00('MaleDP02.png')
    }
    const switchToDP09 = () => {
        setPickProfileImg00('FemaleDP01.png')
    }
    const switchToDP10 = () => {
        setPickProfileImg00('FemaleDP02.png')
    }

    const handleOpenSocialSettings = () => {
        setEditSocialsModal(true)
    }

    const handleCloseAnyModals = () => {
        setEditSocialsModal(false)
    }



    return (
        <div className='mainContainer profile'>
            {editSocialsModal && <div className="modalContainerProfile settings">
                <div className="modalContentProfile">
                    <button id='closeModalSettings' onClick={handleCloseAnyModals}><FaTimes className='faIcons'/></button>
                    <div className="mdcpSettingsContainer">
                        <div className="mdcpsContent left">
                            <span>
                                <img src={`https://engeenx.com/ProfilePics/${pickProfileImg00 ? pickProfileImg00 : 'DefaultProfilePic.png'}`} alt="" />
                                <input type="text" value={pickProfileImg00} readOnly disabled/>
                            </span>
                            <div>
                                <img onClick={switchToDP01} src={require('../assets/imgs/ProfilePics/AG Logo1.png')} alt="" />
                                <img onClick={switchToDP02} src={require('../assets/imgs/ProfilePics/AG Logo2.png')} alt="" />
                                <img onClick={switchToDP03} src={require('../assets/imgs/ProfilePics/AG Logo3.png')} alt="" />
                                <img onClick={switchToDP04} src={require('../assets/imgs/ProfilePics/AG Logo4.png')} alt="" />
                                <img onClick={switchToDP05} src={require('../assets/imgs/ProfilePics/AG Logo5.png')} alt="" />
                                <img onClick={switchToDP06} src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')} alt="" />
                                <img onClick={switchToDP07} src={require('../assets/imgs/ProfilePics/MaleDP01.png')} alt="" />
                                <img onClick={switchToDP08} src={require('../assets/imgs/ProfilePics/MaleDP02.png')} alt="" />
                                <img onClick={switchToDP09} src={require('../assets/imgs/ProfilePics/FemaleDP01.png')} alt="" />
                                <img onClick={switchToDP10} src={require('../assets/imgs/ProfilePics/FemaleDP02.png')} alt="" />
                            </div>
                        </div>
                        <div className="mdcpsContent right">
                            <h4>Koswi <RiVerifiedBadgeFill className='faIcons'/></h4>
                            <p>djmaglaqui@gmail.com</p>
                            <div className="mdcpccrSocials">
                                <h6>EDIT SOCIALS</h6>
                                <div>
                                    <span>
                                        <label htmlFor=""><p><FaSquareFacebook className='faIcons'/> Facebook</p></label>
                                        <input type="text" placeholder='Facebook Profile Link'/>
                                    </span>
                                    <span>
                                        <label htmlFor=""><p><FaInstagram className='faIcons'/> Instagram</p></label>
                                        <input type="text" placeholder='Instagram Profile Link'/>
                                    </span>
                                    <span>
                                        <label htmlFor=""><p><FaTiktok className='faIcons'/> TikTok</p></label>
                                        <input type="text" placeholder='TikTok Profile Link'/>
                                    </span>
                                    <span>
                                        <label htmlFor=""><p><FaYoutube className='faIcons'/> YouTube</p></label>
                                        <input type="text" placeholder='YouTube Channel Link'/>
                                    </span>
                                    <span>
                                        <label htmlFor=""><p><FaTwitch className='faIcons'/> Twitch</p></label>
                                        <input type="text" placeholder='Twitch Channel Link'/>
                                    </span>
                                </div>
                            </div>
                            <div className="mdcpccrSubmit">
                                <button type='submit'>Update Profile</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
            <div className="modalContainerProfile posting">
                <div className="modalContentPosting">
                    <button id='closeModalPosting'><FaTimes className='faIcons'/></button>
                    <div className="mdcpPostingContainer">
                        
                    </div>
                </div>
            </div>
            <section className="profilePageContainer top">
                <img src={require('../assets/imgs/DefaultProfile.jpg')} alt="" />
                <div></div>
            </section>
            <section className="profilePageContainer mid">
                <div className="profilePageContent left">
                    <div className='ppclProfilePic'>
                        <img src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')} alt="" />
                    </div>
                    <div className="ppclProfileName">
                        <h5>Koswi <RiVerifiedBadgeFill className='faIcons'/></h5>
                        <p>djmaglaqui@gmail.com</p>
                    </div>
                    <div className="ppclProfileSocials">
                        <a href=""><h6><FaSquareFacebook className='faIcons'/></h6></a>
                        <a href=""><h6><FaInstagram className='faIcons'/></h6></a>
                        <a href=""><h6><FaTiktok className='faIcons'/></h6></a>
                        <a href=""><h6><FaYoutube className='faIcons'/></h6></a>
                        <a href=""><h6><FaTwitch className='faIcons'/></h6></a>
                        <div>
                            <button onClick={handleOpenSocialSettings}>Edit Profile <TbSettings2 className='faIcons'/></button>
                        </div>
                    </div>
                    <div className="ppclProfileDetails">
                        <span>
                            <p>My Referral Code</p>
                            <p>AG_KoswiFilo</p>
                        </span>
                        <span>
                            <p>AG Points</p>
                            <p id='agPoints'>0 <FaBolt className='faIcons'/></p>
                        </span>
                        <span>
                            <p>AG Gems</p>
                            <p id='agGems'>0 <FaGem className='faIcons'/></p>
                        </span>
                    </div>
                </div>
                <div className="profilePageContent right">
                    <div className="ppcrProfileNavigations">
                        <button className='active'><h6>HIGHLIGHTS</h6></button>
                        <button><h6>MY PRODUCTS</h6></button>
                        <button><h6>MISSIONS</h6></button>
                        <button><h6>FEEDBACKS</h6></button>
                    </div>
                    <div className="ppcrProfileContents highlights">
                        <div className="ppcrpchPosting">
                            <div className="ppcrpchpWhat">
                                <img src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')} alt="" />
                                <input type="text" placeholder='Post your Gameplay...' readOnly/>
                                <button id='postAStory'><IoIosImages className='faIcons'/></button>
                            </div>
                            <div className="ppcrpchpStories">
                                <div className='postAStory'>
                                    <img src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')} alt="" />
                                    <span>
                                        <h5><IoMdAddCircle className='faIcons'/></h5>
                                        <p>Add Story</p>
                                    </span>
                                </div>
                                <div className='viewAStory'>
                                    <div className="storiesContents">
                                        <div>
                                            <img src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')} alt="" />
                                        </div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>
                            </div>
                            <div className="ppcrpchpMyPosts">
                                <div className='ppcrpchpPost'>
                                    <div className='ppcrpchpUser'>
                                        <img src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')} alt="" />
                                        <span>
                                            <h6>Koswi <RiVerifiedBadgeFill className='faIcons'/></h6>
                                            <p>Apr 17</p>
                                        </span>
                                    </div>
                                    <div className="ppcrpchpupWords">
                                        <p>Hi guys I changed a profile</p>
                                    </div>
                                    <div className="ppcrpchpuPosting">
                                        <img id='ppcrpchpuPostingBG' src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')} alt="" />
                                        <img id='ppcrpchpuPostingImg' src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')} alt="" />
                                    </div>
                                </div>
                                <div className='ppcrpchpPost'>
                                    <div className='ppcrpchpUser'>
                                        <img src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')} alt="" />
                                        <span>
                                            <h6>Koswi <RiVerifiedBadgeFill className='faIcons'/></h6>
                                            <p>Apr 17</p>
                                        </span>
                                    </div>
                                    <div className="ppcrpchpupWords">
                                        <p>Hi guys I changed a profile</p>
                                    </div>
                                    <div className="ppcrpchpuPosting">
                                        <img id='ppcrpchpuPostingBG' src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')} alt="" />
                                        <img id='ppcrpchpuPostingImg' src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')} alt="" />
                                    </div>
                                </div>
                                <div className='ppcrpchpPost'>
                                    <div className='ppcrpchpUser'>
                                        <img src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')} alt="" />
                                        <span>
                                            <h6>Koswi <RiVerifiedBadgeFill className='faIcons'/></h6>
                                            <p>Apr 17</p>
                                        </span>
                                    </div>
                                    <div className="ppcrpchpupWords">
                                        <p>Hi guys I changed a profile</p>
                                    </div>
                                    <div className="ppcrpchpuPosting">
                                        <img id='ppcrpchpuPostingBG' src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')} alt="" />
                                        <img id='ppcrpchpuPostingImg' src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Profile