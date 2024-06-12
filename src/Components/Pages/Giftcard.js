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


const AGUserProductsCartAPI = process.env.REACT_APP_AG_FETCH_USER_CART_API;
const fetchUserCart = async (setProductCarts, LoginUserID) => {
    try {
        const response = await axios.get(AGUserProductsCartAPI);
        const filteredData = response.data.filter(product => product.ag_user_id	=== LoginUserID);
        const gameCartProducts = filteredData.filter(product => product.ag_product_type === 'Giftcard');
        setProductCarts(gameCartProducts);
    } catch (error) {
        console.error(error);
    }
};

const Giftcard = () => {
    const { giftcardCanonical } = useParams();
    const { setActivePage } = useActivePage();
    const AGStocksListAPI = process.env.REACT_APP_AG_STOCKS_LIST_API;
    const AGGiftcardsListAPI = process.env.REACT_APP_AG_GIFTCARDS_LIST_API;
    const AGAddToCartsAPI = process.env.REACT_APP_AG_ADD_USER_CART_API;
    const userLoggedIn = localStorage.getItem('isLoggedIn')
    const LoginUserID = localStorage.getItem('profileUserID');
    const [userLoggedData, setUserLoggedData] = useState('');
    const [giftcardViewAll, setGiftcardViewAll] = useState([]);
    const [giftcardViewDetails, setGiftcardViewDetails] = useState([]);
    const [giftcardViewContent, setViewGiftcardContent] = useState('');
    const [loadingGiftcard, setLoadingGiftcard] = useState(true);
    const [productCart, setProductCarts] = useState([]);

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
                setViewGiftcardContent(agGiftcardDetails);

                if (agViewAllGiftcards.length > 0) {
                    const randomItems = getRandomItems(agViewAllGiftcards, 10);
                    setGiftcardViewAll(randomItems);
                }

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

        
        fetchUserProfile();
        fetchGiftcards();
        fetchUserCart(setProductCarts, LoginUserID);
    }, [LoginUserID, giftcardCanonical]);

    const handleClickGiftcard = () => {
        setActivePage('giftcards');
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }
    const handleAddToCart = (details) => {
        const productCartGiftcardCode = details.giftcard_id;
        const productCartGiftcardName = details.giftcard_name;
    
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
                {!loadingGiftcard ? <div className="gcardspcmContainer">
                    <div className="gcardspcmContent left">
                        <img src={`https://2wave.io/GiftCardCovers/${giftcardViewContent.giftcard_cover}`} alt="" />
                    </div>
                    <div className="gcardspcmContent right">
                        <h3>{giftcardViewContent.giftcard_name}</h3>
                        <h6>{giftcardViewContent.giftcard_category}</h6>
                        <p id='gcspcmcDef'>{giftcardViewContent.giftcard_description}</p>
                        <div className="gcardspcmcrItems">
                            <div className="gcardspcmcr">
                                {giftcardViewDetails.map((details, i) => (
                                    <div key={i} className={`${(details.stockCount === 0) ? 'noStocks' : ''}`}>
                                        <img src={`https://2wave.io/GiftCardCovers/${details.giftcard_cover}`} alt="" />
                                        <span>
                                            <h5>$ {details.giftcard_denomination}</h5>
                                            {productCart.some(cartItem => cartItem.ag_product_id === details.giftcard_id) ?
                                                <button><TbShoppingCartFilled className='faIcons'/></button>:
                                                <button onClick={() => handleAddToCart(details)} disabled={(details.stockCount === 0) ? true : false}>
                                                    {(details.stock === undefined) ? <TbShoppingCartOff className='faIcons'/> : <TbShoppingCartPlus className='faIcons'/>}
                                                </button>
                                            }
                                        </span>
                                        <p>{details.stockCount} Stocks</p>
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
                        {giftcardViewAll.map((details, i) => (
                            <Link className="gcspcbcOtherGiftcard" to={`/Giftcards/${details.giftcard_canonical}`} key={i} onClick={handleClickGiftcard}>
                                <img src={`https://2wave.io/GiftCardCovers/${details.giftcard_cover}`} alt="" />
                            </Link>
                        ))}
                    </div>
                    <div className="gcardspcbContent mobile">
                        {giftcardViewAll.slice(0, 6).map((details, i) => (
                            <Link className="gcspcbcOtherGiftcard" to={`/Giftcards/${details.giftcard_canonical}`} key={i} onClick={handleClickGiftcard}>
                                <img src={`https://2wave.io/GiftCardCovers/${details.giftcard_cover}`} alt="" />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Giftcard