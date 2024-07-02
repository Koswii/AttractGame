import React, { useEffect, useState, useRef } from 'react'
import "../CSS/robux.css";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    SiRoblox 
} from "react-icons/si";
import { 
    TbShoppingCartBolt, 
    TbShoppingCartPlus,
    TbShoppingCartFilled,
    TbShoppingCartOff,    
} from "react-icons/tb";
import { UserProfileData } from './UserProfileContext';
import { CartsFetchData } from './CartsFetchContext';



const Robux = () => {
    const { userLoggedData } = UserProfileData();
    const { 
        fetchUserCart, 
        productCart, 
        setProductCarts 
    } = CartsFetchData();
    const AGStocksListAPI = process.env.REACT_APP_AG_STOCKS_LIST_API;
    const AGGiftcardsListAPI = process.env.REACT_APP_AG_GIFTCARDS_LIST_API;
    const AGGameCreditsListAPI = process.env.REACT_APP_AG_GAMECREDIT_LIST_API;
    const AGAddToCartsAPI = process.env.REACT_APP_AG_ADD_USER_CART_API;
    const userLoggedIn = localStorage.getItem('isLoggedIn')
    const LoginUserID = localStorage.getItem('profileUserID');
    const [giftcardViewDetails, setGiftcardViewDetails] = useState([]);
    const [gamecreditViewDetails, setGamecreditViewDetails] = useState([]);
    const [loadingGiftcard, setLoadingGiftcard] = useState(true);
    const [loadingGamecredit, setLoadingGamecredit] = useState(true);
    const [productCartAdded, setProductCartAdded] = useState('');


    useEffect(() => {
        const fetchGiftcards = async () => {
            setLoadingGiftcard(true);
            try {
                const response = await axios.get(AGGiftcardsListAPI);
                const agGiftcardData = response.data.filter(giftcard => giftcard.giftcard_canonical === 'Roblox_Giftcard');
                const agGiftcardSort = agGiftcardData.sort((a,b) => (a.giftcard_denomination) - (b.giftcard_denomination));
                // setGiftcardViewDetails(agGiftcardSort);

                const stockListResponse = await axios.get(AGStocksListAPI);
                const stockListData = stockListResponse.data;
                const stockInfo = agGiftcardSort.map(giftcard => {
                    const stock = stockListData.find(stock => stock.ag_product_id === giftcard.giftcard_id);
                    const stockCount = stockListData.filter(stock => stock.ag_product_id === giftcard.giftcard_id).length;
                    return {
                        ...giftcard, stock, stockCount
                    };
                });
                setGiftcardViewDetails(stockInfo);


            } catch (error) {
                console.error(error);
            } finally {
                setLoadingGiftcard(false);
            }
        };
        const fetchGameCredits = async () => {
            setLoadingGamecredit(true);
            try {
                const response = await axios.get(AGGameCreditsListAPI);
                const agGameCreditData = response.data.filter(gamecredit => gamecredit.gamecredit_canonical === 'Roblox_Game_Credit_Dev');
                const agGamecreditSort = agGameCreditData.sort((a,b) => (a.gamecredit_denomination) - (b.gamecredit_denomination));
                // setGamecreditViewDetails(agGamecreditSort);

                const stockListResponse = await axios.get(AGStocksListAPI);
                const stockListData = stockListResponse.data;
                const stockInfo = agGamecreditSort.map(gamecredit => {
                    const stock = stockListData.find(stock => stock.ag_product_id === gamecredit.gamecredit_id);
                    const stockCount = stockListData.filter(stock => stock.ag_product_id === gamecredit.gamecredit_id).length;
                    return {
                        ...gamecredit, stock, stockCount
                    };
                });
                setGamecreditViewDetails(stockInfo);

            } catch (error) {
                console.error(error);
            } finally {
                setLoadingGamecredit(false);
            }
        }

        
        fetchGiftcards();
        fetchGameCredits();
    }, [LoginUserID]);


    const handleAddToCartGiftcard = (details) => {
        const productCartGiftcardCode = details.giftcard_id;
        const productCartGiftcardName = details.giftcard_name;
        setProductCartAdded(productCartGiftcardCode)
    
        const formAddCart = {
          agCartUsername: userLoggedData.username,
          agCartUserID: userLoggedData.userid,
          agCartProductCode: productCartGiftcardCode,
          agCartProductName: productCartGiftcardName,
          agCartProductPrice: '',
          agCartProductDiscount: '',
          agCartProductType: 'Giftcard',
          agCartProductState: 'Pending',
        }
    
        const jsonUserCartData = JSON.stringify(formAddCart);
        axios.post(AGAddToCartsAPI, jsonUserCartData)
        .then(response => {
          const resMessage = response.data;
          if (resMessage.success === true) {
            fetchUserCart(setProductCarts, LoginUserID);
          } else {
            // console.log(resMessage.message);
          }
        }) 
        .catch (error =>{
            console.log(error);
        });
    };
    const handleAddToCartGamecredit = (details) => {
        const productCartGamecreditCode = details.gamecredit_id;
        const productCartGamecreditName = details.gamecredit_name;
        setProductCartAdded(productCartGamecreditCode)
    
        const formAddCart = {
          agCartUsername: userLoggedData.username,
          agCartUserID: userLoggedData.userid,
          agCartProductCode: productCartGamecreditCode,
          agCartProductName: productCartGamecreditName,
          agCartProductPrice: '',
          agCartProductDiscount: '',
          agCartProductType: 'Game Credit',
          agCartProductState: 'Pending',
        }
    
        const jsonUserCartData = JSON.stringify(formAddCart);
        axios.post(AGAddToCartsAPI, jsonUserCartData)
        .then(response => {
          const resMessage = response.data;
          if (resMessage.success === true) {
            fetchUserCart(setProductCarts, LoginUserID);
          } else {
            // console.log(resMessage.message);
          }
        }) 
        .catch (error =>{
            console.log(error);
        });
    };

    return (
        <div className='mainContainer robux'>
            <section className="robuxPageContainer top">
                <div className="rbPageContentTop">
                    <div className="rbpcTopContainer left">
                        <img src={require('../assets/imgs/GiftCards/RobloxGiftCard.png')} alt="" />
                    </div>
                    <div className="rbpcTopContainer right">
                        <h3>Attract Game Roblox</h3>
                        <h6>Buy Gift Cards and Game Credits Here!</h6><br />
                        <p id='rbpcrcrTextWebsite'>
                            <span></span>A Roblox Gift Card can be used to buy Robux or a Premium subscription. The consumer can scratch 
                            off a gray security bar on the back of the card which reveals a PIN code number. The PIN code can 
                            then be typed into the Gift Cards section of the website, where, if activated by a cash register, 
                            it can be redeemed. <br /><br />
                            <span></span>We sell Roblox Giftcards from the official Roblox Store and also offer cheap Robux from our partnered 
                            Roblox developers, allowing players to purchase costumes and items at a lower cost. This Roblox Game 
                            Credit originated directly from a Roblox developer, rather than being purchased through the official 
                            Roblox platform. As such, it is sometimes informally referred to as 'Dirty Robux' since it was not 
                            acquired via the standard purchase process.
                        </p>
                        <p id='rbpcrcrTextMobile'>
                            A Roblox Gift Card can be used to buy Robux or a Premium subscription. The consumer can scratch 
                            off a gray security bar on the back of the card which reveals a PIN code number. The PIN code can 
                            then be typed into the Gift Cards section of the website, where, if activated by a cash register, 
                            it can be redeemed.
                        </p>
                    </div>
                </div>
            </section>
            <section className="robuxPageContainer mid">
                <div className="rbPageContentMid2">
                    <h4><SiRoblox className='faIcons'/> ROBLOX GIFTCARDS</h4>
                    <h5>INSTANT DIRECT CLAIM</h5>
                    <div className="rbpcMid2Container">
                        {!loadingGiftcard ? <>{giftcardViewDetails.map((details, i) => (
                            <div className={`rbpcm2Content ${(details.stockCount === 0) ? 'noStocks' : ''}`} key={i}>
                                <img src={`https://2wave.io/GiftCardCovers/${details.giftcard_cover}`} alt="" />
                                <div>
                                    <h6>$ {details.giftcard_denomination}</h6>
                                    {userLoggedIn ? <>
                                        {productCart.some(cartItem => cartItem.ag_product_id === details.giftcard_id) ?
                                            <button><TbShoppingCartFilled className='faIcons'/></button>:
                                            <button onClick={() => handleAddToCartGiftcard(details)} disabled={(details.stockCount === 0) ? true : false}>
                                                {(details.stock === undefined) ? <TbShoppingCartOff className='faIcons'/> : 
                                                <>
                                                {(productCartAdded === details.giftcard_id) ? 
                                                    <TbShoppingCartFilled className='faIcons'/>:
                                                    <TbShoppingCartPlus className='faIcons'/>}
                                                </>}
                                            </button>
                                        }
                                    </>:<>
                                        <button><TbShoppingCartPlus className='faIcons'/></button>
                                    </>}
                                </div>
                                <p>{details.stockCount} Stocks</p>
                            </div>
                        ))}</>:<>
                        <div className="rbpcm2ContentDummy"></div>
                        <div className="rbpcm2ContentDummy"></div>
                        <div className="rbpcm2ContentDummy"></div>
                        <div className="rbpcm2ContentDummy"></div>
                        <div className="rbpcm2ContentDummy"></div>
                        <div className="rbpcm2ContentDummy"></div>
                        </>}
                    </div>
                </div>
                <div className="rbPageContentMid2">
                    <h4><SiRoblox className='faIcons'/> ROBLOX GAMECREDITS</h4>
                    <h5>AG DISCORD CLAIM</h5>
                    <div className="rbpcMid2Container">
                        {!loadingGamecredit ? <>{gamecreditViewDetails.map((details, i) => (
                            <div className={`rbpcm2Content ${(details.stockCount === 0) ? 'noStocks' : ''}`} key={i}>
                                <span className="rbpcm2CreditNumber">
                                    <h6>{details.gamecredit_number} <SiRoblox className='faIcons'/></h6>
                                </span>
                                <img src={`https://2wave.io/GiftCardCovers/${details.gamecredit_cover}`} alt="" />
                                <div>
                                    <h6>$ {details.gamecredit_denomination}</h6>
                                    {userLoggedIn ? <>
                                        {productCart.some(cartItem => cartItem.ag_product_id === details.gamecredit_id) ?
                                            <button><TbShoppingCartFilled className='faIcons'/></button>:
                                            <button onClick={() => handleAddToCartGamecredit(details)} disabled={(details.stockCount === 0) ? true : false}>
                                                {(details.stock === undefined) ? <TbShoppingCartOff className='faIcons'/> : 
                                                <>
                                                {(productCartAdded === details.gamecredit_id) ? 
                                                    <TbShoppingCartFilled className='faIcons'/>:
                                                    <TbShoppingCartPlus className='faIcons'/>}
                                                </>}
                                            </button>
                                        }
                                    </>:<>
                                        <button><TbShoppingCartPlus className='faIcons'/></button>
                                    </>}
                                </div>
                                <p>{details.stockCount} Stocks</p>
                            </div>
                        ))}</>:<>
                            <div className="rbpcm2ContentDummy"></div>
                            <div className="rbpcm2ContentDummy"></div>
                            <div className="rbpcm2ContentDummy"></div>
                            <div className="rbpcm2ContentDummy"></div>
                            <div className="rbpcm2ContentDummy"></div>
                        </>}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Robux