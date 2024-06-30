import React, { useEffect, useState, useRef } from 'react'
import "../CSS/favorites.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
    TbShoppingCartBolt,
    TbHeartFilled, 
    TbShoppingCartPlus,
    TbShoppingCartFilled,
    TbShoppingCartOff,    
} from "react-icons/tb";
import ImageEmbed from './ImageEmbed';
import { UserProfileData } from './UserProfileContext';


const LoginUserID = localStorage.getItem('profileUserID');
const AGStocksListAPI = process.env.REACT_APP_AG_STOCKS_LIST_API;
const AGUserFavoritesAPI = process.env.REACT_APP_AG_FETCH_USER_FAV_API;
const AGGamesListAPI = process.env.REACT_APP_AG_GAMES_LIST_API;
const AGUserProductsCartAPI = process.env.REACT_APP_AG_FETCH_USER_CART_API;


const fetchFavoriteProducts = async (setProductDetails, setLoadingProducts) => {
    setLoadingProducts(true);
    try {
        const response = await axios.get(AGUserFavoritesAPI);
        const filteredData = response.data.filter(product => product.ag_user_id	=== LoginUserID);
        const favoritesSortData = filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));

        try {
            const userDataResponse = await axios.get(AGGamesListAPI);
            const stockListResponse = await axios.get(AGStocksListAPI);
            const stockListData = stockListResponse.data;

            const favoriteWithData = favoritesSortData.map(product => {
                const productData = userDataResponse.data.find(game => game.game_canonical === product.ag_product_id);
                const stockCount = stockListData.filter(stock => stock.ag_product_id === product.ag_product_id).length;
                const stock = stockListData.find(stock => stock.ag_product_id === product.ag_product_id);
                return { ...product, productData, stock, stockCount };
            });
            setProductDetails(favoriteWithData);
        } catch (userDataError) {
            console.error('Error fetching user data:', userDataError);
        }
    } catch (storyError) {
        console.error('Error fetching stories:', storyError);
    } finally {
        setLoadingProducts(false);
    }
};
const fetchUserCart = async (setProductCarts, LoginUserID) => {
    try {
        const response = await axios.get(AGUserProductsCartAPI);
        const filteredData = response.data.filter(product => product.ag_user_id	=== LoginUserID);
        const gameCartProducts = filteredData.filter(product => product.ag_product_type === 'Game');
        setProductCarts(gameCartProducts);
    } catch (error) {
        console.error(error);
    }
};

const Favorites = () => {
    const { userLoggedData } = UserProfileData();
    const AGUserRemoveFavAPI = process.env.REACT_APP_AG_REMOVE_USER_FAV_API;
    const AGAddToCartsAPI = process.env.REACT_APP_AG_ADD_USER_CART_API;
    const [productDetails, setProductDetails] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [productCart, setProductCarts] = useState([]);

    useEffect(() => {
        fetchFavoriteProducts(setProductDetails, setLoadingProducts);
        fetchUserCart(setProductCarts, LoginUserID);
    }, []);
    const handleRemoveFavorite = (favorite) => {
        const removeFav = {
            user: userLoggedData.userid,
            favorite: favorite.ag_product_id
        }
        const removeFavJSON = JSON.stringify(removeFav)
        axios({
            method: 'delete',
            url: AGUserRemoveFavAPI,
            data: removeFavJSON,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.data.success) {
                console.log('Product removed successfully');
                fetchFavoriteProducts(setProductDetails, setLoadingProducts);
            } else {
                console.log(`Error: ${response.data.message}`);
            }
        })
        .catch(error => {
            console.log(`Error: ${error.message}`);
        });
    };
    const handleAddToCart = (favorite) => {
        const productCartGameCode = favorite.productData.game_canonical;
        const productCartGameName = favorite.productData.game_title;
    
        const formAddCart = {
          agCartUsername: userLoggedData.username,
          agCartUserID: userLoggedData.userid,
          agCartProductCode: productCartGameCode,
          agCartProductName: productCartGameName,
          agCartProductPrice: '',
          agCartProductDiscount: '',
          agCartProductType: 'Game',
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

    
    const renderFavoriteProducts = () => {
        if (productDetails.length){
            return (
                <>
                    {/* {!loadingProducts ? <> */}
                        {productDetails.map((favorite, i) => (
                            <div className="fcpcMi1Content" key={i}>
                                <div className="fcpcm1cGamePlatform">
                                    <img src='' platform={favorite.productData.game_platform} alt="" />
                                </div>
                                <Link to={`/Games/${favorite.productData.game_canonical}`}>{favorite.productData.game_cover !== '' ?
                                <img src={`https://2wave.io/GameCovers/${favorite.productData.game_cover}`} alt="Image Not Available" />
                                :<img src={require('../assets/imgs/GameBanners/DefaultNoBanner.png')} />}</Link>
                                <div className="fcpcm1cGameDetails">
                                    <h5>{favorite.productData.game_title}</h5>
                                    <p>{favorite.productData.game_edition}</p>
                                    <div>
                                        <div id="fcpcm1GDView">
                                            <h5>$ {
                                                (favorite.stock === undefined) ? 
                                                '--.--': 
                                                ((parseFloat(favorite.stock.ag_product_price) - parseFloat(favorite.stock.ag_product_discount / 100) * parseFloat(favorite.stock.ag_product_price)).toFixed(2))}
                                            </h5>
                                        </div>
                                        <button id='fcpcm1cGDHeart' onClick={() => handleRemoveFavorite(favorite)}><TbHeartFilled className='faIcons'/></button>
                                        {productCart.some(cartItem => cartItem.ag_product_id === favorite.productData.game_canonical) ?
                                            <button id='fcpcm1cGDAddedToCart'><TbShoppingCartFilled className='faIcons'/></button>:
                                            <button id='fcpcm1cGDAddToCart' onClick={() => handleAddToCart(favorite)} disabled={(favorite.stockCount === 0) ? true : false}>
                                                {(favorite.stock === undefined) ? <TbShoppingCartOff className='faIcons'/> : <TbShoppingCartPlus className='faIcons'/>}
                                            </button>
                                        }
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* </>:<>
                        {productDetails.map((favorite, i) => (
                            <div className="fcpcMi1CDummy" key={i}>
                                <div className="fcpcm1cGPDummy"></div>
                            </div>
                        ))} */}
                    {/* </>} */}
                </>
            );
        } else {
            return (
                <>
                    {!loadingProducts ? <>
                    <div className="fcpcMid1ContainerEmpty">
                        <h6>No Liked Products</h6>
                    </div></>:<>
                    <div className="fcpcMid1ContainerEmpty">
                        <h6>Loading Liked Products</h6>
                    </div>
                    </>}
                </>
            );
        }
    };


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
                        <p>Games you liked</p>
                    </div>
                </div>
            </section>
            <section className="favPageContainer mid">
                <div className="fcpcMid1Container">
                    {renderFavoriteProducts()}
                </div>
            </section>
        </div>
    )
}

export default Favorites