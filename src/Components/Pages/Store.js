import React, { useState, useEffect } from 'react'
import "../CSS/store.css";
import placeholderImage from '../assets/imgs/GameBanners/DefaultNoBanner.png'
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useActivePage } from './ActivePageContext';
import { 
    FaSearch,
    FaGamepad,
    FaBolt,
    FaTicketAlt,
    FaGem,
    FaFire,
    FaStar,     
    FaFacebookSquare,
    FaBitcoin 
} from 'react-icons/fa';
import { 
    FaRankingStar 
} from "react-icons/fa6";
import { 
    TbShoppingCartBolt,
    TbShoppingCartFilled,
    TbShoppingCartPlus,
    TbShoppingCartOff, 
    TbDiamond,
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
import { 
    MdOutlineFiberNew,
    MdDiscount 
} from "react-icons/md";
import axios from 'axios';
import { UserProfileData } from './UserProfileContext';
import { GamesFetchData } from './GamesFetchContext';
import { GiftcardsFetchData } from './GiftcardsFetchContext';
import { GamecreditsFetchData } from './GamecreditFetchContext';
import { FavoritesFetchData } from './FavoritesFetchContext';
import { CartsFetchData } from './CartsFetchContext';


const AGGameCreditsListAPI = process.env.REACT_APP_AG_GAMECREDIT_LIST_API;
const fetchDataGameCredits = async (setLoadingMarketData1, setViewAllGameCredits) => {
  setLoadingMarketData1(true);
  try {
      const response = await axios.get(AGGameCreditsListAPI);
      setViewAllGameCredits(response.data.slice(0, 10));
  } catch (error) {
      console.error(error);
  } finally {
      setLoadingMarketData1(false);
  }
}
const ImageComponentGames = ({ imageName }) => {
  const { fetchAndCacheImageGames, imageCache } = GamesFetchData();
  const [loading, setLoading] = useState(true);
  const baseUrl = 'https://2wave.io/GameCovers/';
  const url = `${baseUrl}${imageName}`;

  useEffect(() => {
      fetchAndCacheImageGames(imageName);
  }, [imageName]);

  useEffect(() => {
      if (imageCache[url]) {
          setLoading(false);
      }
  }, [imageCache, url]);

  return (
      <img src={loading ? placeholderImage : imageCache[url]} alt="Loading..." />
  );
};
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
      <img src={loading ? placeholderImage : imageCache[url]} alt="Loading..." />
  );
};
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
      <img src={loading ? placeholderImage : imageCache[url]} alt="Loading..." />
  );
};
const UsernameSlicer = ({ text = '', maxLength }) => {
  const truncatedText = text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

  return (
    <>{truncatedText}</>
  );
};

const Store = () => {
  const { userStore } = useParams();
  const { setActivePage } = useActivePage();
  const navigate = useNavigate ();
  const { 
    userLoggedData,
    handleLoginForm,
    viewStoreList  
  } = UserProfileData();
  const { 
    viewAllGames,
    viewAllGames2,
    viewAllGamesNum,
    viewAllListedGames,
    viewAGData2,
    viewWikiData,
    viewMetacriticData,
    loadingMarketData2 
  } = GamesFetchData();
  const { 
    giftcards,
    viewAllGiftcards,
    filteredGiftcards 
  } = GiftcardsFetchData();
  const { 
    gamecredits,
    viewAllGamecredits,
    filteredGamecredits
  } = GamecreditsFetchData();
  const { 
    fetchFavorites, 
    favorites, 
    setFavorites,
    numberOfLikes 
  } = FavoritesFetchData();
  const { 
    fetchUserCart, 
    productCart, 
    setProductCarts 
  } = CartsFetchData();

  const [viewRegularGiftcards, setViewRegularGiftcards] = useState([]);

  useEffect(() => {
      const regularGiftcards = filteredGiftcards.filter(giftcard => giftcard.giftcard_category !== "Special");
      setViewRegularGiftcards(regularGiftcards);
  }, [filteredGiftcards]);
  


  const AGAddToFavorites = process.env.REACT_APP_AG_ADD_USER_FAV_API;
  const AGUserRemoveFavAPI = process.env.REACT_APP_AG_REMOVE_USER_FAV_API;
  const AGAddToCartsAPI = process.env.REACT_APP_AG_ADD_USER_CART_API;
  const userLoggedIn = localStorage.getItem('isLoggedIn')
  const LoginUserID = localStorage.getItem('profileUserID');
  const [viewAllGameCredits, setViewAllGameCredits] = useState([]);
  const [loadingMarketData, setLoadingMarketData] = useState(false);
  const [loadingMarketData1, setLoadingMarketData1] = useState(true);
  const [scrapedMetacriticData, setScrapedMetacriticData] = useState('');
  const [viewRobloxPartners, setViewRobloxPartners] = useState([]);
  const [productFavAdded, setProductFavAdded] = useState('');
  const [productCartAdded, setProductCartAdded] = useState('');

  useEffect(() => {
    fetchUserCart();
    fetchFavorites();
    fetchDataGameCredits(setLoadingMarketData1, setViewAllGameCredits);


  }, [LoginUserID]);
  const handleClickGames = () => {
    setActivePage('games');
  }
  const handleClickGiftcards = () => {
    setActivePage('giftcards');
  }
  const handleClickGamecredits = () => {
    setActivePage('gamecredits');
  }
  const handleAddFavorite = (details) => {
    const productFavGameCode = details.game_canonical;
    const productFavGameName = details.game_title;
    setProductFavAdded(productFavGameCode)

    const formAddfavorite = {
      agFavUsername: userLoggedData.username,
      agFavUserID: userLoggedData.userid,
      agFavGameCode: productFavGameCode,
      agFavGameName: productFavGameName,
    }

    const jsonUserFavData = JSON.stringify(formAddfavorite);
    axios.post(AGAddToFavorites, jsonUserFavData)
    .then(response => {
      const resMessage = response.data;
      if (resMessage.success === true) {
        setFavorites([...favorites, productFavGameCode]);
        fetchFavorites(setFavorites, LoginUserID);
      } else {
        console.log(resMessage.message);
      }
    }) 
    .catch (error =>{
        console.log(error);
    });
  };
  const handleRemoveFavorite = (gameCanonical) => {
    setProductFavAdded('')
    const removeFav = {
        user: userLoggedData.userid,
        favorite: gameCanonical
    }
    const removeFavJSON = JSON.stringify(removeFav);
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
            setFavorites(favorites.filter(fav => fav !== gameCanonical));
        } else {
            console.log(`Error: ${response.data.message}`);
        }
    })
    .catch(error => {
        console.log(`Error: ${error.message}`);
    });
  };
  const handleFavoriteToggle = (details) => {
    if (favorites.includes(details.game_canonical)) {
        handleRemoveFavorite(details.game_canonical);
    } else {
        handleAddFavorite(details);
    }
  };
  const handleAddToCartGame = (details) => {
    const productCartGameCode = details.game_canonical;
    const productCartGameName = details.game_title;
    setProductCartAdded(productCartGameCode)

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
        // console.log(resMessage.message);
      }
    }) 
    .catch (error =>{
        // console.log(error);
    });
  };
  const handleAddToCartGiftcard = (details) => {
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

  const storeTotalDetails = viewStoreList.map(seller => {
    const gameTotal = viewAllGames.filter(stores => stores.game_seller === seller.store).length;
    const giftcardTotal = viewAllGiftcards.filter(stores => stores.giftcard_seller === seller.store).length;
    const gamecreditTotal = viewAllGamecredits.filter(stores => stores.gamecredit_seller === seller.store).length;
    return {
        ...seller, gameTotal, giftcardTotal, gamecreditTotal
    }
  });
  
  const currentStoreDetails = storeTotalDetails ? storeTotalDetails.filter(storeName => storeName.store === userStore) : null;
  const storeName = currentStoreDetails.map(str => str.store)
  const storeOwner = currentStoreDetails.map(str => str.username)
  const storeID = currentStoreDetails.map(str => str.userid)
  const storeGames = currentStoreDetails.map(str => str.gameTotal)
  const storeGiftcards = currentStoreDetails.map(str => str.giftcardTotal)
  const storeGamecredits = currentStoreDetails.map(str => str.gamecreditTotal)

  const storeListedGames = viewAllGames2.filter(games => games.game_seller === userStore);
  const storeListedGiftcards = giftcards.filter(giftcards => giftcards.giftcard_seller === userStore);
  const storeListedGamecredits = gamecredits.filter(giftcards => giftcards.gamecredit_seller === userStore);

  console.log(storeListedGamecredits);
  


  return (
    <div className='mainContainer sellerStore'>
      <section className="storePageContainer top">
        <div className="storePageContentTop">
          <div className="strpContenTop left">
            <img src={`https://2wave.io/StoreLogo/${storeName}.png`} alt="" />
          </div>
          <div className="strpContenTop right">
            <h4>{storeName}</h4>
            <p>By. {storeOwner} <span>({storeID})</span></p><br />
            <h6>Codes Sold: 0 Code/s</h6>
            <div className="strpctrStocks">
              <h6>{storeGames} <TbDeviceGamepad2 className='faIcons'/></h6>
              <h6>{storeGiftcards} <TbGiftCard className='faIcons'/></h6>
              <h6>{storeGamecredits} <TbDiamond className='faIcons'/></h6>
            </div>
          </div>
        </div>
      </section>
      <section className="storePageContainer mid">
        <div className="storePageContentMid1">
          {(storeListedGames.length > 0) && <>
            <h4><TbDeviceGamepad2 className='faIcons'/> LISTED GAMES</h4>
            <div className="mpPageContentMid2 website store">
              {loadingMarketData2 ? 
              <>
                <div className="mppContentMid2Dummy store"><div className="mppcm2gpDummy"></div></div>
                <div className="mppContentMid2Dummy store"><div className="mppcm2gpDummy"></div></div>
                <div className="mppContentMid2Dummy store"><div className="mppcm2gpDummy"></div></div>
                <div className="mppContentMid2Dummy store"><div className="mppcm2gpDummy"></div></div>
                <div className="mppContentMid2Dummy store"><div className="mppcm2gpDummy"></div></div>
                <div className="mppContentMid2Dummy store"><div className="mppcm2gpDummy"></div></div>
                <div className="mppContentMid2Dummy store"><div className="mppcm2gpDummy"></div></div>
                <div className="mppContentMid2Dummy store"><div className="mppcm2gpDummy"></div></div>
                <div className="mppContentMid2Dummy store"><div className="mppcm2gpDummy"></div></div>
                <div className="mppContentMid2Dummy store"><div className="mppcm2gpDummy"></div></div>
              </>:
              <>{storeListedGames.map((details, i) => (
                <div className="mppContentMid2" key={i}>
                  <div className="mppcm2GamePlatform" to={`/Games/${details.game_canonical}`}>
                      <img platform={details.game_platform} src="" alt="" />
                  </div>
                  {(details.game_seller === 'Attract Game') ? 
                      <div className="mppcm2GameSeller">
                          <img src={require('../assets/imgs/AGLogoWhite01.png')} alt="" />
                      </div>:
                      <div className="mppcm2GameSeller">
                          <img src={`https://2wave.io/StoreLogo/${details.game_seller}.png`} alt="" />
                      </div>
                  }
                  <Link to={`/Games/${details.game_canonical}`} onClick={handleClickGames}>{details.game_cover !== '' ?
                  <ImageComponentGames imageName={details.game_cover} />
                  :<img src={require('../assets/imgs/GameBanners/DefaultNoBanner.png')} />}</Link>
                  <div className="mppcm2GameDetails">
                      <div className="mppcm2gdTitle">
                          <h5>{details.game_title}<br /><span>{details.game_edition}</span></h5>
                      </div>
                      {/* <p>{details.game_edition}</p> */}
                      <div className="mppcm2gdPricing">
                          <div id="mppcm2GDView">
                              {(details.stock === undefined) ?
                              <h5 id='gameNoStocks'>No Stocks</h5>:
                              <h5>$ {((parseFloat(details.stock.ag_product_price) - parseFloat(details.stock.ag_product_discount / 100) * parseFloat(details.stock.ag_product_price)).toFixed(2))}
                              </h5>}
                              </div>
                          {userLoggedIn ?<>
                              <button id={favorites.includes(details.game_canonical) ? 'mppcm2GDHRemove' : 'mppcm2GDAdd'} onClick={() => handleFavoriteToggle(details)}>
                                  {favorites.includes(details.game_canonical) ? <TbHeartFilled className='faIcons'/> : 
                                  <>
                                      {(productFavAdded === details.game_canonical) ? 
                                      <TbHeartFilled className='faIcons red'/>:
                                      <TbHeart className='faIcons'/>}
                                  </>
                                  }
                              </button>
                              {productCart.some(cartItem => cartItem.ag_product_id === details.game_canonical) ?
                                  <button id='mppcm2GDAddedCart'><TbShoppingCartFilled className='faIcons'/></button>:
                                  <button id='mppcm2GDCart' onClick={() => handleAddToCartGame(details)} disabled={(details.stockCount === 0) ? true : false}>
                                      {(details.stock === undefined) ? <TbShoppingCartOff className='faIcons'/> : 
                                      <>
                                          {(productCartAdded === details.game_canonical) ? 
                                          <TbShoppingCartFilled className='faIcons gold'/>:
                                          <TbShoppingCartPlus className='faIcons'/>}
                                      </>}
                                  </button>
                              }
                          </>:<>
                              <button id='mppcm2GDAdd' onClick={handleLoginForm}><TbHeart className='faIcons'/></button>
                              <button id='mppcm2GDCart' onClick={handleLoginForm}><TbShoppingCartPlus className='faIcons'/></button>
                          </>}
                      </div>
                  </div>
                </div>
              ))}</>}
            </div>
          </>}
          {(storeListedGiftcards.length > 0) && <>
            <h4><TbGiftCard className='faIcons'/> LISTED GIFTCARDS</h4>
            <div className="mpPageContentMid2 website store">
              {loadingMarketData2 ? 
              <>
                <div className="mppContentMid2Dummy store"></div>
                <div className="mppContentMid2Dummy store"></div>
                <div className="mppContentMid2Dummy store"></div>
                <div className="mppContentMid2Dummy store"></div>
                <div className="mppContentMid2Dummy store"></div>
                <div className="mppContentMid2Dummy store"></div>
                <div className="mppContentMid2Dummy store"></div>
                <div className="mppContentMid2Dummy store"></div>
                <div className="mppContentMid2Dummy store"></div>
                <div className="mppContentMid2Dummy store"></div>
              </>:
              <>{storeListedGiftcards.map((details, i) => (
                <div className="mppContentMid2" key={i}>
                  {(details.giftcard_seller === 'Attract Game') ? 
                    <div className="mppcm2GameSeller">
                        <img src={require('../assets/imgs/AGLogoWhite01.png')} alt="" />
                    </div>:
                    <div className="mppcm2GameSeller">
                        <img src={`https://2wave.io/StoreLogo/${details.giftcard_seller}.png`} alt="" />
                    </div>
                  }
                  <Link to={`/Giftcards/${details.giftcard_canonical}`} onClick={handleClickGiftcards}>{details.giftcard_cover !== '' ?
                  <ImageComponentGiftcards imageName={details.giftcard_cover} />
                  :<img src={require('../assets/imgs/GameBanners/DefaultNoBanner.png')} />}</Link>
                  <div className="mppcm2GameDetails">
                      <div className="mppcm2gdTitle">
                          <h5>{details.giftcard_name}<br /><span>{details.giftcard_category}</span></h5>
                      </div>
                      {/* <p>{details.game_edition}</p> */}
                      <div className="mppcm2gdPricing">
                          <div id="mppcm2GDView">
                            <h5>$ {details.giftcard_denomination}</h5>
                          </div>
                          {userLoggedIn ?<>
                            {productCart.some(cartItem => cartItem.ag_product_id === details.giftcard_id) ?
                              <button id='mppcm2GDAddedCart'><TbShoppingCartFilled className='faIcons'/></button>:
                              <button id='mppcm2GDCart' onClick={() => handleAddToCartGiftcard(details)} disabled={(details.stocks === 0) ? true : false}>
                              {(details.stocks === 0 || undefined) ? <TbShoppingCartOff className='faIcons'/> : 
                              <>
                                  {(productCartAdded === details.giftcard_denomination) ? 
                                    <TbShoppingCartFilled className='faIcons'/>:
                                    <TbShoppingCartPlus className='faIcons'/>
                                  }
                              </>}
                          </button>
                            }
                          </>:<>
                              <button id='mppcm2GDCart' onClick={handleLoginForm}><TbShoppingCartPlus className='faIcons'/></button>
                          </>}
                      </div>
                  </div>
                </div>
              ))}</>}
            </div>
          </>}
          {(storeListedGamecredits.length > 0) && <>
            <h4><TbDiamond className='faIcons'/> LISTED GAMECREDITS</h4>
            <div className="mpPageContentMid2 website store">
              {loadingMarketData2 ? 
                <>
                  <div className="mppContentMid2Dummy store"></div>
                  <div className="mppContentMid2Dummy store"></div>
                  <div className="mppContentMid2Dummy store"></div>
                  <div className="mppContentMid2Dummy store"></div>
                  <div className="mppContentMid2Dummy store"></div>
                  <div className="mppContentMid2Dummy store"></div>
                  <div className="mppContentMid2Dummy store"></div>
                  <div className="mppContentMid2Dummy store"></div>
                  <div className="mppContentMid2Dummy store"></div>
                  <div className="mppContentMid2Dummy store"></div>
                </>:
                <>{storeListedGamecredits.map((details, i) => (
                <div className="mppContentMid2" key={i}>
                  {(details.gamecredit_seller === 'Attract Game') ? 
                    <div className="mppcm2GameSeller">
                        <img src={require('../assets/imgs/AGLogoWhite01.png')} alt="" />
                    </div>:
                    <div className="mppcm2GameSeller">
                        <img src={`https://2wave.io/StoreLogo/${details.gamecredit_seller}.png`} alt="" />
                    </div>
                  }
                  <Link to={`/Gamecredits/${details.gamecredit_canonical}`} onClick={handleClickGiftcards}>{details.gamecredit_cover !== '' ?
                  <ImageComponentGamecredits imageName={details.gamecredit_cover} />
                  :<img src={require('../assets/imgs/GameBanners/DefaultNoBanner.png')} />}</Link>
                  <div className="mppcm2GameDetails">
                      <div className="mppcm2gdTitle">
                          <h5>{details.gamecredit_name}<br /><span>{details.gamecredit_number} {details.gamecredit_type}</span></h5>
                      </div>
                      {/* <p>{details.game_edition}</p> */}
                      <div className="mppcm2gdPricing">
                          <div id="mppcm2GDView">
                            <h5>$ {details.gamecredit_denomination}</h5>
                          </div>
                          {userLoggedIn ?<>
                            {productCart.some(cartItem => cartItem.ag_product_id === details.gamecredit_id) ?
                              <button id='mppcm2GDAddedCart'><TbShoppingCartFilled className='faIcons'/></button>:
                              <button id='mppcm2GDCart' onClick={() => handleAddToCartGiftcard(details)} disabled={(details.stocks === 0) ? true : false}>
                              {(details.stocks === 0 || undefined) ? <TbShoppingCartOff className='faIcons'/> : 
                              <>
                                  {(productCartAdded === details.gamecredit_denomination) ? 
                                    <TbShoppingCartFilled className='faIcons'/>:
                                    <TbShoppingCartPlus className='faIcons'/>
                                  }
                              </>}
                          </button>
                            }
                          </>:<>
                              <button id='mppcm2GDCart' onClick={handleLoginForm}><TbShoppingCartPlus className='faIcons'/></button>
                          </>}
                      </div>
                  </div>
                </div>
              ))}</>}
            </div>
          </>}
        </div>
      </section>
    </div>
  )
}

export default Store