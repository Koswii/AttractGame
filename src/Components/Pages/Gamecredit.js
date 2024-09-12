import React, { useEffect, useState, useRef } from 'react'
import "../CSS/gamecredit.css";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useActivePage } from './ActivePageContext';
import axios from 'axios';
import { 
    TbShoppingCartBolt, 
    TbShoppingCartPlus,
    TbShoppingCartFilled,
    TbShoppingCartOff,
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
import { UserProfileData } from './UserProfileContext';
import { GamecreditsFetchData } from './GamecreditFetchContext';
import { CartsFetchData } from './CartsFetchContext';

const ImageComponentGamecredits = ({ imageName }) => {
    const { fetchAndCacheImageGamecredits, imageCache } = GamecreditsFetchData();
    const [loading, setLoading] = useState(true);
    const baseUrl = 'https://2wave.io/GameCreditCovers/';
    const url = `${baseUrl}${imageName}`;
  
    useEffect(() => {
        fetchAndCacheImageGamecredits(imageName);
    }, [imageName]);
  
    useEffect(() => {
        if (imageCache[url]) {
            setLoading(false);
        }
    }, [imageCache, url]);
  
    return (
        <img id='gameCreditCoverImg' src={imageCache[url]} alt="Loading..." />
    );
};

const Gamecredit = () => {
    const { gamecreditCanonical } = useParams();
    const { setActivePage } = useActivePage();
    const { 
        userLoggedData,
        handleLoginForm
    } = UserProfileData();
    const { 
        fetchUserCart, 
        productCart, 
        setProductCarts 
    } = CartsFetchData();
    const { 
        filterUniqueData,
        setFilteredGamecredits,
        viewAllGamecredits,
        gamecredits,
        filteredGamecredits,
        loading 
    } = GamecreditsFetchData();
    const AGAddToCartsAPI = process.env.REACT_APP_AG_ADD_USER_CART_API;
    const userLoggedIn = localStorage.getItem('isLoggedIn')
    const LoginUserID = localStorage.getItem('profileUserID');
    const [productCartAdded, setProductCartAdded] = useState('');
    const [getRandomGamecredits, setGetRandomGamecredits] = useState([]);

    const getRandomItems = (array, numItems) => {
        const shuffled = array.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, numItems);
    };
    const gamecreditDetails = filteredGamecredits.filter(gamecredit => gamecredit.gamecredit_canonical === gamecreditCanonical);
    const agGamecreditData = gamecredits.filter(gamecredit => gamecredit.gamecredit_canonical === gamecreditCanonical);
    const agGCCoverImg = gamecreditDetails.map(gamecredit => gamecredit.gamecredit_cover);
    const agGCName = gamecreditDetails.map(gamecredit => gamecredit.gamecredit_name);
    const agGCCategory = gamecreditDetails.map(gamecredit => gamecredit.gamecredit_category);
    const agGCDescription = gamecreditDetails.map(gamecredit => gamecredit.gamecredit_description);
    const agGamecreditSort = agGamecreditData.sort((a,b) => (a.gamecredit_denomination) - (b.gamecredit_denomination));

    useEffect(() => {
        fetchUserCart();
        const randomItemsGamecredits = getRandomItems(filteredGamecredits, 10);
        setGetRandomGamecredits(randomItemsGamecredits)
    }, [filteredGamecredits]);

    const handleClickGamecredit = () => {
        setActivePage('gamecredits');
    }
    const handleAddToCart = (details) => {
        const productCartGamecreditCode = details.gamecredit_id;
        const productCartGamecreditDenomination = details.gamecredit_denomination;
        const productCartGamecreditName = details.gamecredit_name;
        setProductCartAdded(productCartGamecreditDenomination)
    
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
            console.log(resMessage.message);
          }
        }) 
        .catch (error =>{
            console.log(error);
        });
    };

    return (
        <div className='mainContainer gamecreditProfile'>
            <section className="gamecreditPageContainer top"></section>
            <section className="gamecreditPageContainer mid">
                {/* {!loading ?  */}
                <div className="gcreditspcmContainer">
                    <div className="gcreditspcmContent left">
                        <div>
                            <img src={`https://2wave.io/GameCreditCovers/${agGCCoverImg}`} alt="" />
                        </div>
                        <h4>{agGCName}</h4>
                        <h6>{agGCCategory}</h6><br />
                        <p id='gcspcmcDef'>{agGCDescription}</p>
                    </div>
                    <div className="gcreditspcmContent right">
                        <div className="gcreditspcmcrItems">
                            <div className="gcreditspcmcr">
                                {agGamecreditSort.map((details, i) => (
                                    <div key={i} className={`${(details.stocks === 0) ? 'gcreditspcmcrContents noStocks' : 'gcreditspcmcrContents'}`}>
                                        <div className="gcreditspcmcrcNum">
                                            <p>{details.gamecredit_number} {details.gamecredit_type}</p>
                                        </div>
                                        <ImageComponentGamecredits imageName={details.gamecredit_cover} />
                                        <div className="gcreditspcmcrSeller">
                                            <img src={`https://2wave.io/StoreLogo/${details.gamecredit_seller}.png`} alt="" />
                                        </div>
                                        <span>
                                            <h5>$ {details.gamecredit_denomination}</h5>
                                            {userLoggedIn ? <> 
                                                {productCart.some(cartItem => cartItem.ag_product_id === details.gamecredit_id) ?
                                                    <button><TbShoppingCartFilled className='faIcons'/></button>:
                                                    <button onClick={() => handleAddToCart(details)} disabled={(details.stocks === 0) ? true : false}>
                                                        {(details.stocks === 0 || undefined) ? <TbShoppingCartOff className='faIcons'/> : 
                                                        <>
                                                            {(productCartAdded === details.gamecredit_denomination) ? 
                                                                <TbShoppingCartFilled className='faIcons'/>:
                                                                <TbShoppingCartPlus className='faIcons'/>
                                                            }
                                                        </>
                                                        }
                                                    </button>
                                                }
                                            </>:<>
                                                <button onClick={handleLoginForm}><TbShoppingCartPlus className='faIcons'/></button>
                                            </>}
                                        </span>
                                        <p>{details.stocks} Stocks</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {/* :
                <div className="gcreditspcmContainerDummy">
                    <div className="gcspcmclDummy left"></div>
                    <div className="gcspcmclDummy right">
                        <h3></h3>
                        <h5></h5>
                        <p></p>
                        <p></p>
                        <div></div>
                    </div>
                </div>
                } */}
            </section>
            <section className="gamecreditPageContainer bot">
                {getRandomGamecredits && <div className="gcreditspcbContainer">
                    <h4>GAME CREDITS YOU MIGHT LIKE</h4>
                    <div className="gcreditspcbContent website">
                        {getRandomGamecredits.slice(0, 10).map((details, i) => (
                            <Link className="gcspcbcOtherGamecredit" to={`/Gamecredits/${details.gamecredit_canonical}`} key={i} onClick={handleClickGamecredit}>
                                <ImageComponentGamecredits imageName={details.gamecredit_cover} />
                            </Link>
                        ))}
                    </div>
                    <div className="gcreditspcbContent mobile">
                        {getRandomGamecredits.slice(0, 6).map((details, i) => (
                            <Link className="gcspcbcOtherGamecredit" to={`/Gamecredits/${details.gamecredit_canonical}`} key={i} onClick={handleClickGamecredit}>
                                <ImageComponentGamecredits imageName={details.gamecredit_cover} />
                            </Link>
                        ))}
                    </div>
                </div>}
            </section>
        </div>
    )
}

export default Gamecredit