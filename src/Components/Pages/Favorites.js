import React, { useEffect, useState, useRef } from 'react'
import "../CSS/favorites.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
    TbShoppingCartBolt,
    TbHeartFilled,   
} from "react-icons/tb";


const LoginUserID = localStorage.getItem('profileUserID');
const AGUserFavoritesAPI = process.env.REACT_APP_AG_FETCH_USER_FAV_API;
const AGGamesListAPI = process.env.REACT_APP_AG_GAMES_LIST_API;
const fetchFavoriteProducts = async (setProductDetails, setLoadingProducts) => {
    setLoadingProducts(true);

    try {
        const response = await axios.get(AGUserFavoritesAPI);
        const filteredData = response.data.filter(product => product.ag_user_id	=== LoginUserID);
        const favoritesSortData = filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));

        try {
            const userDataResponse = await axios.get(AGGamesListAPI);
            const favoriteWithData = favoritesSortData.map(product => {
                const productData = userDataResponse.data.find(game => game.game_canonical === product.ag_product_id);
                return { ...product, productData };
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


const Favorites = () => {

    const AGUserRemoveFavAPI = process.env.REACT_APP_AG_REMOVE_USER_FAV_API;
    const [userLoggedData, setUserLoggedData] = useState('');
    const [productDetails, setProductDetails] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    useEffect(() => {
        const fetchUserProfile = () => {
            const storedProfileData = localStorage.getItem('profileDataJSON')
            if(storedProfileData) {
                const parsedProfileData = JSON.parse(storedProfileData);
                setUserLoggedData(JSON.parse(storedProfileData))
            }
        }

        fetchUserProfile();
        fetchFavoriteProducts(setProductDetails, setLoadingProducts);
    }, []);

    const handleRemoveFavorite = (favorite) => {
        const removeFav = {favorite: favorite.ag_product_id}
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


    const renderFavoriteProducts = () => {
        if (productDetails.length){
            return (
                <>
                    {!loadingProducts ? <>
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
                                        <div id="mppcm2GDView"><h5>$999.99</h5></div>
                                        <button id='mppcm2GDHeart' onClick={() => handleRemoveFavorite(favorite)}><TbHeartFilled className='faIcons'/></button>
                                        <button id='mppcm2GDCart'><TbShoppingCartBolt className='faIcons'/></button>
                                    </div>
                                </div>
                            </div>
                        ))}</>:<>
                            <div className="fcpcMi1CDummy"><div className="fcpcm1cGPDummy"></div></div>
                            <div className="fcpcMi1CDummy"><div className="fcpcm1cGPDummy"></div></div>
                            <div className="fcpcMi1CDummy"><div className="fcpcm1cGPDummy"></div></div>
                            <div className="fcpcMi1CDummy"><div className="fcpcm1cGPDummy"></div></div>
                            <div className="fcpcMi1CDummy"><div className="fcpcm1cGPDummy"></div></div>
                    </>}
                </>
            );
        } else {
            return (
                <>
                    {!loadingProducts ? <>
                    <div className="fcpcMid1ContainerEmpty">
                        <h6>No Liked Products</h6>
                    </div></>:<>
                        <div className="fcpcMi1CDummy"><div className="fcpcm1cGPDummy"></div></div>
                        <div className="fcpcMi1CDummy"><div className="fcpcm1cGPDummy"></div></div>
                        <div className="fcpcMi1CDummy"><div className="fcpcm1cGPDummy"></div></div>
                        <div className="fcpcMi1CDummy"><div className="fcpcm1cGPDummy"></div></div>
                        <div className="fcpcMi1CDummy"><div className="fcpcm1cGPDummy"></div></div>
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
                        <p>Products you liked</p>
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