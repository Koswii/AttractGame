import React, { useEffect, useState, useRef } from 'react'
import "../CSS/giftcard.css";
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
import { GiftcardsFetchData } from './GiftcardsFetchContext';
import { CartsFetchData } from './CartsFetchContext';

const ImageComponentGiftcards = ({ imageName }) => {
    const { fetchAndCacheImageGiftcards, imageCache } = GiftcardsFetchData();
    const [loading, setLoading] = useState(true);
    const baseUrl = 'https://2wave.io/GiftCardCovers/';
    const url = `${baseUrl}${imageName}`;

    useEffect(() => {
        fetchAndCacheImageGiftcards(imageName);
    }, [imageName]);

    useEffect(() => {
        if (imageCache[url]) {
            setLoading(false);
        }
    }, [imageCache, url]);

    return (
        <img src={imageCache[url]} alt="Loading..." />
    );
};

const Giftcard = () => {
    const { giftcardCanonical } = useParams();
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
        setFilteredGiftcards,
        viewAllGiftcards,
        giftcards,
        filteredGiftcards,
        loading 
    } = GiftcardsFetchData();
    const AGAddToCartsAPI = process.env.REACT_APP_AG_ADD_USER_CART_API;
    const userLoggedIn = localStorage.getItem('isLoggedIn')
    const LoginUserID = localStorage.getItem('profileUserID');
    const [productCartAdded, setProductCartAdded] = useState('');
    const [getRandomGiftcards, setGetRandomGiftcards] = useState([]);

    const getRandomItems = (array, numItems) => {
        const shuffled = array.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, numItems);
    };
    const giftcardDetails = filteredGiftcards.filter(giftcard => giftcard.giftcard_canonical === giftcardCanonical);
    const agGiftcardData = giftcards.filter(giftcard => giftcard.giftcard_canonical === giftcardCanonical);
    const agGCCoverImg = giftcardDetails.map(giftcard => giftcard.giftcard_cover);
    const agGCName = giftcardDetails.map(giftcard => giftcard.giftcard_name);
    const agGCCategory = giftcardDetails.map(giftcard => giftcard.giftcard_category);
    const agGCDescription = giftcardDetails.map(giftcard => giftcard.giftcard_description);
    const agGiftcardSort = agGiftcardData.sort((a,b) => (a.giftcard_denomination) - (b.giftcard_denomination));

    useEffect(() => {
        fetchUserCart();
        const randomItemsGiftcards = getRandomItems(filteredGiftcards, 10);
        setGetRandomGiftcards(randomItemsGiftcards)
    }, []);
    
    // console.log(getRandomGiftcards);

    const handleClickGiftcard = () => {
        setActivePage('giftcards');
    }
    const handleAddToCart = (details) => {
        const productCartGiftcardCode = details.giftcard_id;
        const productCartGiftcardDenomination = details.giftcard_denomination;
        const productCartGiftcardName = details.giftcard_name;
        setProductCartAdded(productCartGiftcardDenomination)
    
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
            console.log(resMessage.message);
          }
        }) 
        .catch (error =>{
            console.log(error);
        });
    };


    return (
        <div className='mainContainer giftcardProfile'>
            <section className="giftcardPageContainer top"></section>
            <section className="giftcardPageContainer mid">
                {!loading ? <div className="gcardspcmContainer">
                    <div className="gcardspcmContent left">
                        <img src={`https://2wave.io/GiftCardCovers/${agGCCoverImg}`} alt="" />
                    </div>
                    <div className="gcardspcmContent right">
                        <h3>{agGCName}</h3>
                        <h6>{agGCCategory}</h6>
                        <p id='gcspcmcDef'>{agGCDescription}</p>
                        <div className="gcardspcmcrItems">
                            <div className="gcardspcmcr">
                                {agGiftcardSort.map((details, i) => (
                                    <div key={i} className={`${(details.stocks === 0) ? 'noStocks' : ''}`}>
                                        <ImageComponentGiftcards imageName={details.giftcard_cover} />
                                        <span>
                                            <h5>$ {details.giftcard_denomination}</h5>
                                            {userLoggedIn ? <> 
                                                {productCart.some(cartItem => cartItem.ag_product_id === details.giftcard_id) ?
                                                    <button><TbShoppingCartFilled className='faIcons'/></button>:
                                                    <button onClick={() => handleAddToCart(details)} disabled={(details.stocks === 0) ? true : false}>
                                                        {(details.stocks === undefined) ? <TbShoppingCartOff className='faIcons'/> : 
                                                        <>
                                                            {(productCartAdded === details.giftcard_denomination) ? 
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
                        {getRandomGiftcards.slice(0, 10).map((details, i) => (
                            <Link className="gcspcbcOtherGiftcard" to={`/Giftcards/${details.giftcard_canonical}`} key={i} onClick={handleClickGiftcard}>
                                <ImageComponentGiftcards imageName={details.giftcard_cover} />
                            </Link>
                        ))}
                    </div>
                    <div className="gcardspcbContent mobile">
                        {getRandomGiftcards.slice(0, 6).map((details, i) => (
                            <Link className="gcspcbcOtherGiftcard" to={`/Giftcards/${details.giftcard_canonical}`} key={i} onClick={handleClickGiftcard}>
                                <ImageComponentGiftcards imageName={details.giftcard_cover} />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Giftcard