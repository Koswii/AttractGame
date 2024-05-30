import React, { useEffect, useState, useRef } from 'react'
import "../CSS/favorites.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
    TbShoppingCartBolt,
    TbHeartFilled,   
} from "react-icons/tb";

const Favorites = () => {

    const LoginUsername = localStorage.getItem('attractGameUsername');
    const userLoggedIn = localStorage.getItem('isLoggedIn')
    const [userLoggedData, setUserLoggedData] = useState('')
    useEffect(() => {
        const fetchUserProfile = () => {
            const storedProfileData = localStorage.getItem('profileDataJSON')
            if(storedProfileData) {
                const parsedProfileData = JSON.parse(storedProfileData);
                setUserLoggedData(JSON.parse(storedProfileData))
            }
        }
        fetchUserProfile();
    }, []);


    return (
        <div className='mainContainer favorites'>
            <section className="favPageContainer top">
                <div className="fcpcTopProfile">
                    <div className="favpctProfile left">
                        {userLoggedData.profileimg ? 
                        <img src={`https://2wave.io/ProfilePics/${userLoggedData.profileimg}`} alt=""/>
                        :<img src={require('../assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
                    </div>
                    <div className="favpctProfile right">
                        <h5>{userLoggedData.username}'s Favorites</h5>
                        <p>Products you liked</p>
                    </div>
                </div>
            </section>
            <section className="favPageContainer mid">
                <div className="fcpcMid1Container">
                    <div className="fcpcMi1Content">
                        <div className="fcpcm1cGamePlatform">
                            <img platform='' src="" alt="" />
                        </div>
                        <img src={require('../assets/imgs/GameBanners/DefaultNoBanner.png')} />
                        {/* <div className="mppcm2GameDiscount">
                            <h4><MdDiscount className='faIcons'/></h4>
                        </div> */}
                        <div className="fcpcm1cGameDetails">
                            <h5>Tekken 8</h5>
                            <p>Standard Edition</p>
                            <div>
                                <div id="mppcm2GDView"><h5>$999.99</h5></div>
                                <button id='mppcm2GDHeart'><TbHeartFilled className='faIcons'/></button>
                                <button id='mppcm2GDCart'><TbShoppingCartBolt className='faIcons'/></button>
                            </div>
                        </div>
                    </div>
                    <div className="fcpcMi1Content">
                        <div className="fcpcm1cGamePlatform">
                            <img platform='' src="" alt="" />
                        </div>
                        <img src={require('../assets/imgs/GameBanners/DefaultNoBanner.png')} />
                        {/* <div className="mppcm2GameDiscount">
                            <h4><MdDiscount className='faIcons'/></h4>
                        </div> */}
                        <div className="fcpcm1cGameDetails">
                            <h5>Tekken 8</h5>
                            <p>Standard Edition</p>
                            <div>
                                <div id="mppcm2GDView"><h5>$999.99</h5></div>
                                <button id='mppcm2GDHeart'><TbHeartFilled className='faIcons'/></button>
                                <button id='mppcm2GDCart'><TbShoppingCartBolt className='faIcons'/></button>
                            </div>
                        </div>
                    </div>
                    <div className="fcpcMi1Content">
                        <div className="fcpcm1cGamePlatform">
                            <img platform='' src="" alt="" />
                        </div>
                        <img src={require('../assets/imgs/GameBanners/DefaultNoBanner.png')} />
                        {/* <div className="mppcm2GameDiscount">
                            <h4><MdDiscount className='faIcons'/></h4>
                        </div> */}
                        <div className="fcpcm1cGameDetails">
                            <h5>Tekken 8</h5>
                            <p>Standard Edition</p>
                            <div>
                                <div id="mppcm2GDView"><h5>$999.99</h5></div>
                                <button id='mppcm2GDHeart'><TbHeartFilled className='faIcons'/></button>
                                <button id='mppcm2GDCart'><TbShoppingCartBolt className='faIcons'/></button>
                            </div>
                        </div>
                    </div>
                    <div className="fcpcMi1Content">
                        <div className="fcpcm1cGamePlatform">
                            <img platform='' src="" alt="" />
                        </div>
                        <img src={require('../assets/imgs/GameBanners/DefaultNoBanner.png')} />
                        {/* <div className="mppcm2GameDiscount">
                            <h4><MdDiscount className='faIcons'/></h4>
                        </div> */}
                        <div className="fcpcm1cGameDetails">
                            <h5>Tekken 8</h5>
                            <p>Standard Edition</p>
                            <div>
                                <div id="mppcm2GDView"><h5>$999.99</h5></div>
                                <button id='mppcm2GDHeart'><TbHeartFilled className='faIcons'/></button>
                                <button id='mppcm2GDCart'><TbShoppingCartBolt className='faIcons'/></button>
                            </div>
                        </div>
                    </div>
                    <div className="fcpcMi1Content">
                        <div className="fcpcm1cGamePlatform">
                            <img platform='' src="" alt="" />
                        </div>
                        <img src={require('../assets/imgs/GameBanners/DefaultNoBanner.png')} />
                        {/* <div className="mppcm2GameDiscount">
                            <h4><MdDiscount className='faIcons'/></h4>
                        </div> */}
                        <div className="fcpcm1cGameDetails">
                            <h5>Tekken 8</h5>
                            <p>Standard Edition</p>
                            <div>
                                <div id="mppcm2GDView"><h5>$999.99</h5></div>
                                <button id='mppcm2GDHeart'><TbHeartFilled className='faIcons'/></button>
                                <button id='mppcm2GDCart'><TbShoppingCartBolt className='faIcons'/></button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Favorites