import React, { useEffect, useState, useRef } from 'react'
import "../CSS/cart.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaBars, 
  FaTimes,
  FaBolt,
  FaRegUserCircle,
  FaRegEye,
  FaRegEyeSlash, 
} from 'react-icons/fa';
import { 
    TbDeviceGamepad2,
    TbGiftCard,   
} from "react-icons/tb";



const LoginUserID = localStorage.getItem('profileUserID');
const AGUserCartAPI = process.env.REACT_APP_AG_FETCH_USER_CART_API;
const AGGamesListAPI = process.env.REACT_APP_AG_GAMES_LIST_API;
const AGGiftcardsListAPI = process.env.REACT_APP_AG_GIFTCARDS_LIST_API;


const fetchCartProducts = async (setAllProductDetails, setGameProductDetails, setGiftcardProductDetails, setLoadingProducts) => {
    setLoadingProducts(true);
    try {
        const response = await axios.get(AGUserCartAPI);
        const filteredData = response.data.filter(product => product.ag_user_id === LoginUserID);
        // const cartProductSortData = filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        const gameProducts = filteredData.filter(product => product.ag_product_type === 'Game');
        const giftcardProducts = filteredData.filter(product => product.ag_product_type === 'Giftcard');
        
        try {
            const [userGameDataResponse, userGiftcardDataResponse] = await Promise.all([
                axios.get(AGGamesListAPI),
                axios.get(AGGiftcardsListAPI)
            ]);
            const cartGameWithData = gameProducts.map(product => {
                const productData = userGameDataResponse.data.find(game => game.game_canonical === product.ag_product_id);
                return { ...product, productData };
            });
            const cartGiftcardWithData = giftcardProducts.map(product => {
                const productData = userGiftcardDataResponse.data.find(giftcard => giftcard.giftcard_id === product.ag_product_id);
                return { ...product, productData };
            });

            const combinedDataGame = [...cartGameWithData];
            const combinedDataGiftcard = [...cartGiftcardWithData];
            const combinedAllData = [...cartGameWithData, ...cartGiftcardWithData];

            setAllProductDetails(combinedAllData);
            setGameProductDetails(combinedDataGame);
            setGiftcardProductDetails(combinedDataGiftcard);

        } catch (userDataError) {
            console.error('Error fetching user data:', userDataError);
        }
    } catch (storyError) {
        console.error('Error fetching stories:', storyError);
    } finally {
        setLoadingProducts(false);
    }
};



const Cart = () => {
    const AGUserProductsCartAPI = process.env.REACT_APP_AG_FETCH_USER_CART_API;
    const AGUserRemoveToCartAPI = process.env.REACT_APP_AG_REMOVE_USER_CART_API;
    const [userLoggedData, setUserLoggedData] = useState('');
    const [productGameDetails, setGameProductDetails] = useState([]);
    const [productGiftcardDetails, setGiftcardProductDetails] = useState([]);
    const [allPrductsDetails, setAllProductDetails] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [orderQuantities, setOrderQuantities] = useState({});

    useEffect(() => {
        const fetchUserProfile = () => {
            const storedProfileData = localStorage.getItem('profileDataJSON')
            if(storedProfileData) {
                const parsedProfileData = JSON.parse(storedProfileData);
                setUserLoggedData(JSON.parse(storedProfileData))
            }
        }

        fetchUserProfile();
        fetchCartProducts(setAllProductDetails, setGameProductDetails, setGiftcardProductDetails, setLoadingProducts);
    }, []);
    const handleQuantityChange = (productId, value) => {
        setOrderQuantities(prevQuantities => ({
            ...prevQuantities,
            [productId]: value
        }));
    };
    const handleRemoveFromCart = (details) => {
        const removeDetails = {
            user: userLoggedData.userid,
            cart: details.ag_product_id
        }
        const removeToCartJSON = JSON.stringify(removeDetails);
        console.log(removeToCartJSON);
        axios({
            method: 'delete',
            url: AGUserRemoveToCartAPI,
            data: removeToCartJSON,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.data.success) {
                // console.log('Product removed from the Cart Successfully');
                fetchCartProducts(setAllProductDetails, setGameProductDetails, setGiftcardProductDetails, setLoadingProducts);
            } else {
                console.log(`Error: ${response.data.message}`);
            }
        })
        .catch(error => {
            console.log(`Error: ${error.message}`);
        });
    };
    const renderCartProducts = () => {
        if (allPrductsDetails.length){
            return (
                <>
                    {loadingProducts ? <>
                        {allPrductsDetails.map((details, i) => (
                            <div className="cartpcm1clDummy" key={i}><div className="cartpcm1clppDummy"></div></div>
                        ))}
                    </>:
                    <>
                        {productGameDetails.map((details, i) => (
                            <div className="cartpcm1clProduct website" key={i}>
                                <img src={`https://2wave.io/GameCovers/${details.productData.game_cover}`} alt="" />
                                <button onClick={() => handleRemoveFromCart(details)}><FaTimes className='faIcons'/></button>
                                <div className="cartpcm1clpPlatform">
                                    <img src="" platform={details.productData.game_platform} alt="" />
                                </div>
                                <div className="cartpcm1clpPrice">
                                    <input type="number" min={1} value={orderQuantities[details.ag_product_id] || 1} onChange={(e) => handleQuantityChange(details.ag_product_id, e.target.value)} placeholder='1'/>
                                    <h5>$999.99</h5>
                                </div>
                            </div>
                        ))}
                        {productGiftcardDetails.map((details, i) => (
                            <div className="cartpcm1clProduct website" key={i}>
                                <img src={`https://2wave.io/GiftCardCovers/${details.productData.giftcard_cover}`} alt="" />
                                <button onClick={() => handleRemoveFromCart(details)}><FaTimes className='faIcons'/></button>
                                <div className="cartpcm1clpPlatform denomination">
                                    <h3>{details.productData.giftcard_denomination}</h3>
                                    <p>DOLLARS</p>
                                </div>
                                <div className="cartpcm1clpPrice">
                                    <input type="number" min={1} value={orderQuantities[details.ag_product_id] || 1} onChange={(e) => handleQuantityChange(details.ag_product_id, e.target.value)} placeholder='1'/>
                                    <h5>$20.99</h5>
                                </div>
                            </div>
                        ))}
                    </>}
                </>
            );
        } else {
            return (
                <>
                    {!loadingProducts ? <>
                        <div className="cartpcm1clProductEmpty">
                            <h6>No Products Here</h6>
                        </div></>:<>
                        <div className="cartpcm1clProductEmpty">
                            <h6>Loading Products Added</h6>
                        </div>
                    </>}
                </>
            );
        }
    };
    const renderCartProductsMobile = () => {
        if (allPrductsDetails.length){
            return (
                <>
                    {loadingProducts ? <>
                        {allPrductsDetails.map((details, i) => (
                            <div className="cartpcm1clDummy" key={i}><div className="cartpcm1clppDummy"></div></div>
                        ))}
                    </>:
                    <>
                        {productGameDetails.map((details, i) => (
                            <div className="cartpcm1clProduct mobile" key={i}>
                                <button onClick={() => handleRemoveFromCart(details)}><FaTimes className='faIcons'/></button>
                                <h5>{details.productData.game_title} - {details.productData.game_platform}</h5>
                                <div className="cartpcm1clpPrice">
                                    <input type="number" min={1} value={orderQuantities[details.ag_product_id] || 1} onChange={(e) => handleQuantityChange(details.ag_product_id, e.target.value)} placeholder='1'/>
                                    <h5>$999.99</h5>
                                </div>
                            </div>
                        ))}
                        {productGiftcardDetails.map((details, i) => (
                            <div className="cartpcm1clProduct mobile" key={i}>
                                <button onClick={() => handleRemoveFromCart(details)}><FaTimes className='faIcons'/></button>
                                <h5>{details.productData.giftcard_name} - ${details.productData.giftcard_denomination}</h5>
                                <div className="cartpcm1clpPrice">
                                    <input type="number" min={1} value={orderQuantities[details.ag_product_id] || 1} onChange={(e) => handleQuantityChange(details.ag_product_id, e.target.value)} placeholder='1'/>
                                    <h5>$20.99</h5>
                                </div>
                            </div>
                        ))}
                    </>}
                </>
            );
        } else {
            return (
                <>
                    {!loadingProducts ? <>
                        <div className="cartpcm1clProductEmpty">
                            <h6>No Products Here</h6>
                        </div></>:<>
                        <div className="cartpcm1clProductEmpty">
                            <h6>Loading Products Added</h6>
                        </div>
                    </>}
                </>
            );
        }
    };




    return (
        <div className='mainContainer cart'>
            <section className="cartPageContainer top">
                <div className="cartpcTopProfile">
                    <div className="cartpctProfile left">
                        {userLoggedData.profileimg ? 
                        <img src={`https://2wave.io/ProfilePics/${userLoggedData.profileimg}`} alt=""/>
                        :<img src={require('../assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
                    </div>
                    <div className="cartpctProfile right">
                        <h5>{userLoggedData.username}'s Cart</h5>
                        <p>Products you added to Cart</p>
                    </div>
                </div>
            </section>
            <section className="cartPageContainer mid">
                <div className="cartpcMid1Container">
                    <div className="cartpcm1Content left">
                        <div className="cartpcm1cLeft">
                            {renderCartProducts()}
                            {renderCartProductsMobile()}
                        </div>
                    </div>
                    <div className="cartpcm1Content right">
                        <div className="cartpcm1cRight">
                            <h5>ORDER SUMMARY</h5>
                            <div className='cartpcm1crList'>
                                <h6><TbDeviceGamepad2 className='faIcons'/> GAMES</h6>
                                {productGameDetails.map((details, i) => (
                                    <>
                                        <span key={i}>
                                            <p id='productTitle'>{details.productData.game_title} - {details.productData.game_platform}</p>
                                            <p id='productPrice'>$999.99 x {orderQuantities[details.ag_product_id] || 1}</p>
                                        </span>
                                    </>
                                ))}
                                <br />
                                <h6><TbGiftCard className='faIcons'/> GIFTCARDS</h6>
                                {productGiftcardDetails.map((details, i) => (
                                    <>
                                        <span key={i}>
                                            <p id='productTitle'>{details.productData.giftcard_name} - ${details.productData.giftcard_denomination}</p>
                                            <p id='productPrice'>$20.99 x {orderQuantities[details.ag_product_id] || 1}</p>
                                        </span>
                                    </>
                                ))}
                                <br />
                                <h6><TbGiftCard className='faIcons'/> GAME CREDITS</h6>
                            </div>
                            <div className="cartpcm1crCheckout">
                                <span>
                                    <p>SUBTOTAL</p>
                                    <h6>$ 999.99</h6>
                                </span>
                                <span>
                                    <p>OUR CHARGE</p>
                                    <h6>4.5%</h6>
                                </span>
                                <hr />
                                <span>
                                    <p>AG POINTS</p>
                                    <h6>99 <FaBolt className='faIcons'/></h6>
                                </span>
                                <span>
                                    <p>PAYABLE</p>
                                    <h6>$ 999.99</h6>
                                </span>
                                <button>CHECKOUT PRODUCTS</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Cart