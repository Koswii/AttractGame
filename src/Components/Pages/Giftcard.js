import React, { useEffect, useState, useRef } from 'react'
import "../CSS/giftcard.css";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useActivePage } from './ActivePageContext';
import axios from 'axios';
import { 
    TbShoppingCartBolt, 
    TbShoppingCartPlus,
    TbDeviceGamepad2,
    TbGiftCard,
    TbHeart,
    TbHeartFilled,
    TbTrendingUp,
    TbAwardFilled,
    TbCampfireFilled,
    TbCalendarStar,
    TbSquareRoundedArrowRight,      
} from "react-icons/tb";

const Giftcard = () => {
    const { giftcardCanonical } = useParams();
    const { setActivePage } = useActivePage();
    const AGGiftcardsListAPI = process.env.REACT_APP_AG_GIFTCARDS_LIST_API;
    const userLoggedIn = localStorage.getItem('isLoggedIn')
    const LoginUserID = localStorage.getItem('profileUserID');
    const [userLoggedData, setUserLoggedData] = useState('');
    const [giftcardViewAll, setGiftcardViewAll] = useState([]);
    const [giftcardViewDetails, setGiftcardViewDetails] = useState([]);
    const [giftcardViewContent, setViewGiftcardContent] = useState('');
    const [loadingGiftcard, setLoadingGiftcard] = useState(true);

    const getRandomItems = (array, numItems) => {
        const shuffled = array.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, numItems);
    };

    useEffect(() => {
        const fetchUserProfile = () => {
            const storedProfileData = localStorage.getItem('profileDataJSON')
            if(storedProfileData) {
                const parsedProfileData = JSON.parse(storedProfileData);
                setUserLoggedData(JSON.parse(storedProfileData))
            }
        };

        const fetchGiftcards = async () => {
            setLoadingGiftcard(true);
            try {
                const response = await axios.get(AGGiftcardsListAPI);
                const agViewAllGiftcards = response.data.slice(0, 16)
                const agGiftcardData = response.data.filter(giftcard => giftcard.giftcard_canonical === giftcardCanonical);
                const agGiftcardDetails = agGiftcardData[0];
                const agGiftcardSort = agGiftcardData.sort((a,b) => (a.giftcard_denomination) - (b.giftcard_denomination));
                setGiftcardViewDetails(agGiftcardSort);
                setViewGiftcardContent(agGiftcardDetails);


                if (agViewAllGiftcards.length > 0) {
                    const randomItems = getRandomItems(agViewAllGiftcards, 10);
                    setGiftcardViewAll(randomItems);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingGiftcard(false);
            }
        };

        
        fetchUserProfile();
        fetchGiftcards();
    }, [LoginUserID, giftcardCanonical]);

    const handleClickGiftcard = (e) => {
        e.preventDefault();

        setActivePage('giftcards');
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }


    return (
        <div className='mainContainer giftcardProfile'>
            <section className="giftcardPageContainer top"></section>
            <section className="giftcardPageContainer mid">
                {!loadingGiftcard ? <div className="gcardspcmContainer">
                    <div className="gcardspcmContent left">
                        <img src={`https://2wave.io/GiftCardCovers/${giftcardViewContent.giftcard_cover}`} alt="" />
                    </div>
                    <div className="gcardspcmContent right">
                        <h3>{giftcardViewContent.giftcard_name}</h3>
                        <h6>{giftcardViewContent.giftcard_category}</h6>
                        <p>{giftcardViewContent.giftcard_description}</p>
                        <div className="gcardspcmcr">
                            {giftcardViewDetails.map((details, i) => (
                                <div key={i}>
                                    <img src={`https://2wave.io/GiftCardCovers/${details.giftcard_cover}`} alt="" />
                                    <span>
                                        <h5>$ {details.giftcard_denomination}</h5>
                                        <button><TbShoppingCartPlus className='faIcons'/></button>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>:
                <div className="gcardspcmContainerDummy">
                    <div className="gcspcmclDummy left"></div>
                    <div className="gcspcmclDummy right">
                        <h3></h3>
                        <h5></h5>
                        <p></p>
                        <p></p>
                        <div></div>
                    </div>
                </div>
                }
            </section>
            <section className="giftcardPageContainer bot">
                <div className="gcardspcbContainer">
                    <h4>GIFTCARDS YOU MIGHT LIKE</h4>
                    <div className="gcardspcbContent website">
                        {giftcardViewAll.map((details, i) => (
                            <div className="gcspcbcOtherGiftcard" to={`/Giftcards/${details.giftcard_canonical}`} key={i} onClick={handleClickGiftcard}>
                                <img src={`https://2wave.io/GiftCardCovers/${details.giftcard_cover}`} alt="" />
                            </div>
                        ))}
                    </div>
                    <div className="gcardspcbContent mobile">
                        {giftcardViewAll.slice(0, 6).map((details, i) => (
                            <div className="gcspcbcOtherGiftcard" to={`/Giftcards/${details.giftcard_canonical}`} key={i} onClick={handleClickGiftcard}>
                                <img src={`https://2wave.io/GiftCardCovers/${details.giftcard_cover}`} alt="" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Giftcard