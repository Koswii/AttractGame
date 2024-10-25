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
    const AGRedeemProductsAPI = process.env.REACT_APP_AG_USER_REDEEM_EXT_CODE_API;
    const [redeemCode, setRedeemCode] = useState('');
    const [redeemLoader, setRedeenLoader] = useState(false);
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
        setRedeenLoader(true)

        const formRedeemProductDetails = {
            agProductCode: redeemCode,
            agProductState: 'Sold',
            agProductOwner: userLoggedData.userid,
        }
        try {
            const redeemProductResponse = await axios.post(AGRedeemProductsAPI, formRedeemProductDetails);
            const responseMessage = redeemProductResponse.data;
    
            if (responseMessage.success) {
                setResponseMessage(responseMessage.message);
                fetchUserProductIds();
                setRedeenLoader(false)
            }else{
                setResponseMessage(responseMessage.message);
                setRedeenLoader(false)
            }
    
        } catch (error) {
            console.error(error);
        } finally {
            setRedeenLoader(false)
        }
    }



    return (
        <div className='mainContainer redeemProduct'>
            <section className="redeemPageContainer top">
                <div className="redeemPageContent top1" style={userLoggedData.coverimg ? {background: `linear-gradient(transparent, black 75%), url(https://2wave.io/CoverPics/${userLoggedData.coverimg})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover',}
                    :{background: 'linear-gradient(transparent, black 75%), url(https://2wave.io/CoverPics/LoginBackground.jpg)', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover',}}>
                    <h5>CLAIM A PRODUCT</h5>
                    <p>Insert product code here.</p>
                    <input type="text" placeholder='*************' onChange={(e) => setRedeemCode(e.target.value)} required/>
                    <div className='rpct1Img'>
                        <div className="rpct1ImgShadow"></div>
                        <p>{responseMessage}</p>
                        <img src={require('../assets/imgs/GameBanners/DefaultNoBanner.png')} alt="" />
                        {!redeemLoader ? 
                            <button className={redeemCode ? 'active' : ''} onClick={handleRedeemProduct} disabled={!redeemCode}>Claim Code</button>:
                            <button>Verifiying Code...</button>    
                        }
                    </div>
                    <p id='rpcr1Disclaimer'>Disclaimer:<br /> Once claimed, Product cannot be sold to AG Marketplace</p>
                </div>
            </section>
        </div>
    )
}

export default RedeemProduct