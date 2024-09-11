import React, { useState, useEffect } from 'react'
import "../CSS/redeemProduct.css";
import axios from 'axios';
import { UserProfileData } from './UserProfileContext';



const RedeemProduct = () => {
    const { 
        userLoggedData, 
        userProductCodeIDData, 
        viewTransactionList,
        fetchUserProductIds, 
    } = UserProfileData();
    const AGRedeemProductsAPI = process.env.REACT_APP_AG_USER_REDEEM_CODE_API;
    const [redeemCode, setRedeemCode] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const postIDGenerator = (length) => {
        const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        result += charset.charAt(randomIndex);
        }
        return result;
    };

    const handleRedeemProduct = async () => {

        const formRedeemProductDetails = {
            agProductCode: redeemCode,
            agProductState: 'Sold',
            agProductStatus: 'Redeemed',
            agProductOwner: userLoggedData.userid,
        }
        try {
            const redeemProductResponse = await axios.post(AGRedeemProductsAPI, formRedeemProductDetails);
            const responseMessage = redeemProductResponse.data;
    
            if (responseMessage.success) {
                setResponseMessage(responseMessage.message);
                setResponseMessage('');
                fetchUserProductIds();
            }else{
                setResponseMessage(responseMessage.message);
            }
    
        } catch (error) {
            console.error(error);
        }
    }



    return (
        <div className='mainContainer redeemProduct'>
            <section className="redeemPageContainer top">
                <div className="redeemPageContent top1" style={userLoggedData.coverimg ? {background: `linear-gradient(transparent, black 75%), url(https://2wave.io/CoverPics/${userLoggedData.coverimg})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover',}
                    :{background: 'linear-gradient(transparent, black 75%), url(https://2wave.io/CoverPics/LoginBackground.jpg)', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover',}}>
                    <h5>REDEEEM A CODE</h5>
                    <p>Insert product code here.</p>
                    <input type="text" placeholder='*************' onChange={(e) => setRedeemCode(e.target.value)} required/>
                    <div className='rpct1Img'>
                        <div className="rpct1ImgShadow"></div>
                        <p>{responseMessage}</p>
                        <img src={require('../assets/imgs/GameBanners/DefaultNoBanner.png')} alt="" />
                        <button className={redeemCode ? 'active' : ''} onClick={handleRedeemProduct} disabled={!redeemCode}>REDEEM</button>
                    </div>
                    <p id='rpcr1Disclaimer'>Disclaimer:<br /> Once redeemed, Product cannot be sold to AG Marketplace</p>
                </div>
            </section>
        </div>
    )
}

export default RedeemProduct