import React, { useEffect, useState, useRef } from 'react'
import "../CSS/games.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
    TbShoppingCartPlus,
    TbShoppingCartFilled,
    TbShoppingCartOff,   
    TbHeart,
    TbHeartFilled,     
} from "react-icons/tb";
import { GiConsoleController } from "react-icons/gi";
import { TbCategoryFilled } from "react-icons/tb";
import { VscVersions } from "react-icons/vsc";
import { UserProfileData } from './UserProfileContext';
import { GamesFetchData } from './GamesFetchContext';
import { FavoritesFetchData } from './FavoritesFetchContext';
import { CartsFetchData } from './CartsFetchContext';

const Games = () => {
    const { userLoggedData } = UserProfileData();
    const { 
        viewAGData1,
        loadingMarketData 
    } = GamesFetchData();
    const { 
        fetchFavorites, 
        favorites, 
        setFavorites 
    } = FavoritesFetchData();
    const { 
        fetchUserCart, 
        productCart, 
        setProductCarts 
    } = CartsFetchData();
    const AGAddToFavoritesAPI = process.env.REACT_APP_AG_ADD_USER_FAV_API;
    const AGUserRemoveFavAPI = process.env.REACT_APP_AG_REMOVE_USER_FAV_API;
    const AGAddToCartsAPI = process.env.REACT_APP_AG_ADD_USER_CART_API;
    const userLoggedIn = localStorage.getItem('isLoggedIn')
    const LoginUserID = localStorage.getItem('profileUserID');
    const [searchGameName, setSearchGameName] = useState('');
    const [productFavAdded, setProductFavAdded] = useState('');
    const [productCartAdded, setProductCartAdded] = useState('');
    const [currentPage, setCurrentPage] = useState(
        parseInt(localStorage.getItem('currentPage')) || 1
    ); // state to track current page
    const [itemsPerPage] = useState(30); // number of items per page

    const handleSearchChange = event => {
        setSearchGameName(event.target.value);
        setCurrentPage(1); // Reset to the first page when searching
    };
    // Filter data based on search term
    const filteredData = viewAGData1.filter(game =>
      game.game_title.toLowerCase().includes(searchGameName.toLowerCase())
    );
    useEffect(() => {
        fetchUserCart();
        fetchFavorites();
        localStorage.setItem('currentPage', currentPage);
        setTimeout(() => {
            setLoader(false)
        }, 2000);
    }, [currentPage]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Logic for displaying page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredData.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }
    const renderPageNumbers = pageNumbers.map(number => (
        <li
        key={number}
        onClick={() => setCurrentPage(number)}
        className={currentPage === number ? 'active' : ''}
        >
        {number}
        </li>
    ));
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
        axios.post(AGAddToFavoritesAPI, jsonUserFavData)
        .then(response => {
          const resMessage = response.data;
          if (resMessage.success === true) {
            // console.log(resMessage.message);
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
            favorite: gameCanonical,
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
                // console.log('Product removed successfully');
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
    const handleAddToCart = (details) => {
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
        axios.post(AGAddToCartsAPI,jsonUserCartData)
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

    const [loader,setLoader] = useState(true)
    const [filterChanging,setFilterChanging] = useState(false)
    const gamePlatform = [...new Set(viewAGData1.map(game => game.game_platform))].sort();
    const gameCategory = [...new Set(viewAGData1.map(game => game.game_category))].sort();
    const gameEdition = [...new Set(viewAGData1.map(game => game.game_edition))].sort();
  
    const [filters, setFilters] = useState({
      platform: {},
      category: {},
      edition: {},
      favorite: false,
    });
    const handleFilterChange = (filterType, value) => {
      setFilters(prevFilters => ({
        ...prevFilters,
        [filterType]: {
          ...prevFilters[filterType],
          [value]: !prevFilters[filterType][value]
        }
      }));
      setFilterChanging(true)
    };
    // const handleFavoriteChange = () => {
    //   setFilters(prevFilters => ({
    //     ...prevFilters,
    //     favorite: !prevFilters.favorite
    //   }));
    // };
    const filteredDatagames = viewAGData1.filter(game => {
      const platformMatch = filters.platform[game.game_platform] || Object.values(filters.platform).every(v => !v);
      const categoryMatch = filters.category[game.game_category] || Object.values(filters.category).every(v => !v);
      const editionMatch = filters.edition[game.game_edition] || Object.values(filters.edition).every(v => !v);
      const favoriteMatch = !filters.favorite || game.favorite; // Assuming `game.favorite` indicates if a game is favorite

      return platformMatch && categoryMatch && editionMatch && favoriteMatch;
      
    });
    useEffect(() => {
        // Check if any filter is active
        if (filterChanging && Object.values(filters.platform).every(v => !v) && Object.values(filters.category).every(v => !v) && Object.values(filters.edition).every(v => !v) && !filters.favorite) {
        setFilterChanging(false);
        }
    }, [filters, filterChanging]);
    
    return (
        <div className='mainContainer gameList'>
            <section className="gamesPageContainer top">
                <div className="gmspContent top1">
                    {/* <h5>ALL GAMES</h5> */}
                    <input type="text" placeholder='Search Game Here...' value={searchGameName} onChange={handleSearchChange}/>
                    <ul className="pagination">
                        {loadingMarketData ? renderPageNumbers : <li>0</li>}
                    </ul>
                </div>
                <div className="gmspContent top2">
                    <div className="gmspContentTop2 left">
                        <section>
                            <div className="filterSelectgames">
                                <h4>Filter Games:</h4>
                                <h6><GiConsoleController id='filterIconcheck'/> Game Platform</h6>
                                <ul>
                                    {!loader ? 
                                        <>
                                            {gamePlatform.map(platform => (
                                                <li key={platform}>
                                                <input
                                                    type="checkbox"
                                                    checked={filters.platform[platform] || false}
                                                    onChange={() => handleFilterChange('platform', platform)}
                                                /> {platform}
                                                </li>
                                            ))}
                                        </> :
                                        <>
                                            <li>
                                                <input
                                                    type="checkbox"
                                                />NintendoSwitch
                                            </li>
                                            <li>
                                                <input
                                                    type="checkbox"
                                                />PC
                                            </li>
                                            <li>
                                                <input
                                                    type="checkbox"
                                                />PlayStation4
                                            </li>
                                            <li>
                                                <input
                                                    type="checkbox"
                                                />PlayStation5
                                            </li>
                                            <li>
                                                <input
                                                    type="checkbox"
                                                />XboxXS
                                            </li>
                                        </>
                                    }
                                </ul>
                                <h6><TbCategoryFilled id='filterIconcheck'/> Category</h6>
                                <ul>
                                    {!loader ? 
                                        <>
                                            {gameCategory.map(category => (
                                                <li key={category}>
                                                <input
                                                    type="checkbox"
                                                    checked={filters.category[category] || false}
                                                    onChange={() => handleFilterChange('category', category)}
                                                /> {category}
                                                </li>
                                            ))}
                                        </> :
                                        <>
                                            <li>
                                                <input
                                                    type="checkbox"
                                                />Classic
                                            </li>
                                            <li>
                                                <input
                                                    type="checkbox"
                                                />Hot
                                            </li>
                                            <li>
                                                <input
                                                    type="checkbox"
                                                />Preorder
                                            </li>
                                            <li>
                                                <input
                                                    type="checkbox"
                                                />Trending
                                            </li>
                                        </>
                                    }
                                </ul>
                                <h6><VscVersions id='filterIconcheck'/> Edition</h6>
                                <ul>
                                    {!loader ?
                                        <>
                                            {gameEdition.map(edition => (
                                                <li key={edition}>
                                                <input
                                                    type="checkbox"
                                                    checked={filters.edition[edition] || false}
                                                    onChange={() => handleFilterChange('edition', edition)}
                                                /> {edition}
                                                </li>
                                            ))}
                                        </> :
                                        <>
                                            <li>
                                                <input
                                                    type="checkbox"
                                                />Complete Edition
                                            </li>
                                            <li>
                                                <input
                                                    type="checkbox"
                                                />Deluxe Edition
                                            </li>
                                            <li>
                                                <input
                                                    type="checkbox"
                                                />Royal Edition
                                            </li>
                                            <li>
                                                <input
                                                    type="checkbox"
                                                />Standard Edition
                                            </li>
                                            <li>
                                                <input
                                                    type="checkbox"
                                                />Super Citizen Edition
                                            </li>
                                            <li>
                                                <input
                                                    type="checkbox"
                                                />Ultimate Edition
                                            </li>
                                        </>
                                    }
                                </ul>
                                {/* <h6><MdOutlineFavorite id='filterIconcheck'/> Favorite</h6>
                                <ul>
                                <li>
                                    <input
                                    type="checkbox"
                                    checked={filters.favorite}
                                    onChange={handleFavoriteChange}
                                    /> Favorite
                                </li>
                                </ul> */}
                            </div>
                        </section>
                    </div>
                    <div className='gmspContentTop2 right'>

                        {!filterChanging ? 
                            <>{loadingMarketData ? <>
                                {currentItems.map((details, index) => (
                                    <div className="gmspct2Game" key={index}>
                                        <div className="gmspct2gPlatform">
                                            <img src='' platform={details.game_platform} alt="" />
                                        </div>
                                        <Link to={`/Games/${details.game_canonical}`}>{details.game_cover !== '' ?
                                        <img src={`https://2wave.io/GameCovers/${details.game_cover}`} alt="Image Not Available" />
                                        :<img src={require('../assets/imgs/GameBanners/DefaultNoBanner.png')} />}</Link>
                                        <div className="gmspct2gDetails">
                                            <h5>{details.game_title}</h5>
                                            <p>{details.game_edition}</p>
                                            <div>
                                                <h6>$ {(details.stock === undefined) ? 
                                                    '--.--': 
                                                    ((parseFloat(details.stock.ag_product_price) - parseFloat(details.stock.ag_product_discount / 100) * parseFloat(details.stock.ag_product_price)).toFixed(2))}
                                                </h6>
                                                {userLoggedIn ?<>
                                                    <button id={favorites.includes(details.game_canonical) ? 'gmspct2gdRemoveFav' : 'gmspct2gdAddFav'} onClick={() => handleFavoriteToggle(details)}>
                                                        {favorites.includes(details.game_canonical) ? 
                                                        <TbHeartFilled className='faIcons'/> : 
                                                        <>
                                                            {(productFavAdded === details.game_canonical) ? 
                                                            <TbHeartFilled className='faIcons red'/>:
                                                            <TbHeart className='faIcons'/>}
                                                        </>
                                                        }
                                                    </button>
                                                    {productCart.some(cartItem => cartItem.ag_product_id === details.game_canonical) ?
                                                        <button id='gmspct2gdCartAdded'><TbShoppingCartFilled className='faIcons'/></button>:
                                                        <button onClick={() => handleAddToCart(details)} disabled={(details.stockCount === 0) ? true : false}>
                                                            {(details.stock === undefined || 0 || '') ? <TbShoppingCartOff className='faIcons'/> : 
                                                            <>
                                                                {(productCartAdded === details.game_canonical) ? 
                                                                <TbShoppingCartFilled className='faIcons gold'/>:
                                                                <TbShoppingCartPlus className='faIcons'/>}
                                                            </>}
                                                        </button>
                                                    }
                                                </>:<>
                                                    <button><TbHeart className='faIcons'/></button>
                                                    <button><TbShoppingCartPlus className='faIcons'/></button>
                                                </>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>:<>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                            </>}</> :<>{filteredDatagames.map((details, index) => (
                                    <div className="gmspct2Game" key={index}>
                                        <div className="gmspct2gPlatform">
                                            <img src='' platform={details.game_platform} alt="" />
                                        </div>
                                        <Link to={`/Games/${details.game_canonical}`}>{details.game_cover !== '' ?
                                        <img src={`https://2wave.io/GameCovers/${details.game_cover}`} alt="Image Not Available" />
                                        :<img src={require('../assets/imgs/GameBanners/DefaultNoBanner.png')} />}</Link>
                                        <div className="gmspct2gDetails">
                                            <h5>{details.game_title}</h5>
                                            <p>{details.game_edition}</p>
                                            <div>
                                                <h6>$ {(details.stock === undefined) ? 
                                                    '--.--': 
                                                    ((parseFloat(details.stock.ag_product_price) - parseFloat(details.stock.ag_product_discount / 100) * parseFloat(details.stock.ag_product_price)).toFixed(2))}
                                                </h6>
                                                {userLoggedIn ?<>
                                                    <button id={favorites.includes(details.game_canonical) ? 'gmspct2gdRemoveFav' : 'gmspct2gdAddFav'} onClick={() => handleFavoriteToggle(details)}>
                                                        {favorites.includes(details.game_canonical) ? <TbHeartFilled className='faIcons'/> : <TbHeart className='faIcons'/>}
                                                    </button>
                                                    {productCart.some(cartItem => cartItem.ag_product_id === details.game_canonical) ?
                                                        <button id='gmspct2gdCartAdded'><TbShoppingCartFilled className='faIcons'/></button>:
                                                        <button onClick={() => handleAddToCart(details)} disabled={(details.stockCount === 0) ? true : false}>
                                                            {(details.stock === undefined) ? <TbShoppingCartOff className='faIcons'/> : <TbShoppingCartPlus className='faIcons'/>}
                                                        </button>
                                                    }
                                                </>:<>
                                                    <button><TbHeart className='faIcons'/></button>
                                                    <button><TbShoppingCartPlus className='faIcons'/></button>
                                                </>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        }

                    </div>
                </div>
                {searchGameName == '' && <div className="gmspContent top1 mobile">
                    <h5></h5>
                    <ul className="pagination">
                        {loadingMarketData ? renderPageNumbers : <></>}
                    </ul>
                </div>}
            </section>
        </div>
    )

    
}

export default Games