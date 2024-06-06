import React, { useEffect, useState, useRef } from 'react'
import "../CSS/giftcard.css";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import axios from 'axios';

const Giftcard = () => {
    const { giftcardID } = useParams();
    const AGGiftcardsListAPI = process.env.REACT_APP_AG_GIFTCARDS_LIST_API;
    const userLoggedIn = localStorage.getItem('isLoggedIn')
    const LoginUserID = localStorage.getItem('profileUserID');
    const [userLoggedData, setUserLoggedData] = useState('')

    useEffect(() => {
        const fetchUserProfile = () => {
            const storedProfileData = localStorage.getItem('profileDataJSON')
            if(storedProfileData) {
                const parsedProfileData = JSON.parse(storedProfileData);
                setUserLoggedData(JSON.parse(storedProfileData))
            }
        };

        const fetchGiftcards = async () => {
            try {
                const response = await axios.get(AGGiftcardsListAPI);
                const agGiftcardData = response.data.filter(giftcard => giftcard.giftcard_name === 'Apple Store Giftcard');
                console.log(agGiftcardData);
            } catch (error) {
                console.error(error);
            } 
        };

        
        fetchUserProfile();
        fetchGiftcards();
    }, [LoginUserID, giftcardID]);









    return (
        <div className='mainContainer giftcardProfile'>
        <section className="giftcardPageContainer top">

        </section>
        </div>
    )
}

export default Giftcard