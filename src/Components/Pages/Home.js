import React, { useEffect, useState, useRef  } from 'react'
import "../CSS/home.css";
import { Link } from 'react-router-dom';
import { useActivePage } from './ActivePageContext';
import { 
  FaSearch,
  FaBolt,
  FaTicketAlt,
  FaGem,
  FaFire,
  FaStar,     
  FaFacebookSquare,
  FaBitcoin 
} from 'react-icons/fa';
import { 
  FaSquareFacebook,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaTwitch 
} from "react-icons/fa6";
import { 
  TbShoppingCartBolt, 
  TbHeart,
  TbHeartFilled,
  TbTrendingUp,
  TbAwardFilled,
  TbCampfireFilled,
  TbCalendarStar,
  TbSquareRoundedArrowRight, 
  TbGiftCardFilled, 
  TbDeviceGamepad2,
  TbGiftCard, 
  TbDiamond,   
} from "react-icons/tb";
import axios from 'axios';



const Home = () => {
  const { setActivePage } = useActivePage();
  const marqueeRef = useRef(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const AGGamesListAPI1 = process.env.REACT_APP_AG_GAMES_LIST_API;
  const AGGiftcardsListAPI = process.env.REACT_APP_AG_GIFTCARDS_LIST_API;
  const AGGiftcardsListAPI2 = process.env.REACT_APP_AG_GIFTCARDS_LIST_API2;
  const [viewAllGamesNum, setViewAllGamesNum] = useState([]);
  const [viewAllGames, setViewAllGames] = useState([]);
  const [viewAllGiftcard, setViewAllGiftcard] = useState([]);
  const [viewAGData1, setViewAGData1] = useState([]);
  const [loading, setLoading] = useState(true);


  const handleClickGames = () => {
    setActivePage('games');
  }
  const handleClickGiftcards = () => {
    setActivePage('giftcards');
  }

  useEffect(() => {
    const fetchDataGames = async () => {
      try {
        const response1 = await axios.get(AGGamesListAPI1);
        const agAllGames = response1.data;
        setViewAllGames(agAllGames)
        // Get current year
        const currentYear = new Date().getFullYear();
        // Filter games based on the current year
        const currentYearGames = agAllGames.filter(game => {
          const gameDate = new Date(game.game_released);
          return gameDate.getFullYear() === currentYear;
        });

        // Sort the games by release month and year
        const sortedCurrentYearGames = currentYearGames.sort((a, b) => {
          const dateA = new Date(a.game_released);
          const dateB = new Date(b.game_released);
          if (dateA.getFullYear() === dateB.getFullYear()) {
              return dateB.getMonth() - dateA.getMonth(); // Sort by month if years are the same
          }
          return dateB.getFullYear() - dateA.getFullYear(); // Sort by year
        });
        setViewAllGamesNum(agAllGames.length);
        setViewAGData1(sortedCurrentYearGames);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchDataGiftcards = () => {
      axios.get(AGGiftcardsListAPI2)
      .then((response) => {
          const giftcardData = response.data; 
          setViewAllGiftcard(giftcardData);
      })
      .catch(error => {
          console.log(error)
      })
    }

    const fetchAllData = async () => {
      setLoading(true); // Set loading to true before data fetch
      await fetchDataGames();
      await fetchDataGiftcards();
      setLoading(false); // Set loading to false after data fetch
    };
    fetchAllData();


  }, []);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === 10 ? 0 : prevIndex + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const marquee = marqueeRef.current;
    let animationId = null;
    const animateMarquee = () => {
      if (!isPaused) {
        if (marquee.scrollLeft >= marquee.scrollWidth - marquee.clientWidth) {
          marquee.scrollLeft = 0;
        } else {
          marquee.scrollLeft += 1;
        }
      }
      animationId = requestAnimationFrame(animateMarquee);
    };
    animationId = requestAnimationFrame(animateMarquee);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);
  const handleMouseEnter = () => {
    setIsPaused(true);
  };
  const handleMouseLeave = () => {
    setIsPaused(false);
  };


  
  const [searchInput, setSearchinput] = useState()
  const [searchGc,setSearchgc] = useState()
  const [searchGame,setSearchgame] = useState()
  const [searching,setSearching] = useState(false)
  const [viewfiltergame,setViewfiltergame] = useState()
  const [previewAllgame,setpreviewAllgame] = useState()
  

  const handleSearch = (event) => {
    setSearchinput(event.target.value)
    if (event.target.value === '') {
      setSearching(false)
    } else {
      setSearching(true)
      const unique = filterUniqueData(viewAllGiftcard)
      unique.sort((a, b) => {
        if (a.giftcard_name < b.giftcard_name) return -1;
        if (a.giftcard_name > b.giftcard_name) return 1;
        return 0;
      });
      const searchGiftcard = unique.filter(item => {
        return Object.values(item).some(value => 
            typeof value === 'string' && value.toLowerCase().includes(event.target.value.toLowerCase())
        );
      });
      const searchGames = viewAllGames.filter(item => {
        return Object.values(item).some(value => 
            typeof value === 'string' && value.toLowerCase().includes(event.target.value.toLowerCase())
        );
      });

      setpreviewAllgame(searchGames)
      setSearchgc(searchGiftcard)
      setSearchgame(searchGames)
    }
  }
  const filterUniqueData = (giftcards) => {
    const uniqueRecords = [];
    const recordMap = {};

    giftcards.forEach(record => {
        if (!recordMap[record.giftcard_name]) {
            recordMap[record.giftcard_name] = true;
            uniqueRecords.push(record);
        }
    });

    return uniqueRecords;
};

  const filtertoTrending = () => {
    if (searching === false) {
      const filteredData = viewAllGames.filter(item => item.game_category === 'Trending')
      setViewfiltergame(filteredData)
    } else {
      const filteredData = previewAllgame.filter(item => item.game_category === 'Trending')
      setSearchgame(filteredData)
      setViewfiltergame()
    }
  }
  const filtertoClassic = () => {
    if (searching === false) {
      const filteredData = viewAllGames.filter(item => item.game_category === 'Classic')
      console.log(filteredData);
      setViewfiltergame(filteredData)
    } else {
      const filteredData = previewAllgame.filter(item => item.game_category === 'Classic')
      console.log(filteredData);
      setSearchgame(filteredData)
      setViewfiltergame()
    }
  }
  const filtertoHot = () => {
    if (searching === false) {
      const filteredData = viewAllGames.filter(item => item.game_category === 'Hot')
      console.log(filteredData);
      setViewfiltergame(filteredData)
    } else {
      const filteredData = previewAllgame.filter(item => item.game_category === 'Hot')
      console.log(filteredData);
      setSearchgame(filteredData)
      setViewfiltergame()
    }
  }

  return (
    <div className='mainContainer home'>
      <section className="landingPageContainer top">
        <video autoPlay muted loop>
          <source src='https://koswitestdata.online/Videos/WebIntro.mp4' type="video/mp4" />
        </video>
        <div className="lndPageContent top">
          <div className="lndpcTop right">
            <img src={require('../assets/imgs/AGLogoNameWhite.png')} alt="" />
            <p>
              Welcome to Attract Game – your ultimate destination for the most affordable and hottest games 
              worldwide! Dive into a world where gaming meets affordability, offering you access to the 
              latest and most trending titles at unbeatable prices.
            </p>
            <span>
              <Link to='/AboutUs'>READ MORE</Link>
            </span>
          </div>
        </div>
      </section>
      <section className="landingPageContainer mid">
        <div className="lndPageContent mid1">
          <div className='lndpcSearch'>
            <h6><FaSearch className='faIcons'/></h6>
            <input type="text" placeholder='Search Games / Voucher / Giftcards / Crypto / Merchandise' onChange={handleSearch}/>
          </div>
          <div className="lndpcFeatures">
            <Link>
              <h6><FaTicketAlt className='faIcons'/></h6>
            </Link>
            <Link>
              <h6><FaBolt className='faIcons'/></h6>
            </Link>
            <Link>
              <h6><FaGem className='faIcons'/></h6>
            </Link>
          </div>
        </div>
        <div className="lndPageContent mid2">
          <div className="lndpcMid2">
            <div id='lndpcTrending' onClick={filtertoTrending}>
              <h5>TRENDING GAMES</h5>
            </div>
            <div id='lndpcHot' onClick={filtertoHot}>
              <h5>HOT GAMES</h5>
            </div>
            <div id='lndpcClassic' onClick={filtertoClassic}>
              <h5>CLASSIC GAMES</h5>
            </div>
          </div>
        </div>
        {!searching ?
          <>
            {viewfiltergame &&(
              <>
                <div className="lndpcm2ContentResults">
                  {viewfiltergame &&(
                    <>
                      {/* {viewfiltergame.length !== 0 &&(<h5>Games</h5>)} */}
                      <div className='searchItemContainers'>
                        {viewfiltergame.map(items => (
                          <Link key={items.id} to={`/Games/${items.game_canonical}`}>
                            <div className='searchItemContents' style={{ background: `linear-gradient(360deg, rgba(0,0,0,1) 0%, rgba(255,255,255,0) 100%),url('https://2wave.io/GameCovers/${items.game_cover}')no-repeat center`, backgroundSize: 'cover'}}>
                              <div className="searchICName">
                                <h6>{items.game_title}</h6>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </>
          : 
          <>
            {searchGc &&(
              <>
                <div className="lndpcm2ContentResults">
                  {searchGame &&(
                    <>
                      {searchGame.length !== 0 &&(<h5>Games</h5>)}
                      <div className='searchItemContainers'>
                        {searchGame.map(items => (
                          <Link key={items.id} to={`/Games/${items.game_canonical}`}>
                            <div className='searchItemContents' style={{ background: `linear-gradient(360deg, rgba(0,0,0,1) 0%, rgba(255,255,255,0) 100%),url('https://2wave.io/GameCovers/${items.game_cover}')no-repeat center`, backgroundSize: 'cover'}}>
                              <div className="searchICName">
                                <h6>{items.game_title}</h6>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                  {searchGc &&(
                    <>
                      {searchGc.length !== 0 &&(<h5>GiftCards</h5>)}
                      <div className='searchItemContainers'>
                        {searchGc.map(items => (
                          <Link key={items.id} to={`/Giftcards/${items.giftcard_canonical}`}>
                            <div className='searchItemContents' style={{ background: `linear-gradient(360deg, rgba(0,0,0,1) 0%, rgba(255,255,255,0) 100%),url('https://2wave.io/GiftCardCovers/${items.giftcard_cover}')no-repeat center`, backgroundSize: 'cover'}}>
                              <div className="searchICName">
                                <h6>{items.giftcard_name}</h6>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </>
          }
        <div className="lndPageContent mid3">
          <div className="lndpcFeaturedGames">
            <div className="lndpcfgWeb left">
              <div className={`lndpcdgwlSlider ${currentIndex === 0 ? 'active' : ''}`}>
                <div className="lndpcfgwl">
                  <div className="lndpcfgwlImage">
                    <img src={require('../assets/imgs/GameBanners/TEKKEN 8.png')} alt="" />
                    <div className="lndpcfgwlShadow"></div>
                  </div>
                  <div className='lndpcfgwlDetails'>
                    <img src={require('../assets/imgs/GameLogos/Tekken8.png')} alt="" />
                    <p>Bandai Namco Studios</p>
                  </div>
                </div>
              </div>
              <div className={`lndpcdgwlSlider ${currentIndex === 1 ? 'active' : ''}`}>
                <div className="lndpcfgwl">
                  <div className="lndpcfgwlImage">
                    <img src={require('../assets/imgs/GameBanners/StellarBlade.png')} alt="" />
                    <div className="lndpcfgwlShadow"></div>
                  </div>
                  <div className='lndpcfgwlDetails'>
                    <img src={require('../assets/imgs/GameLogos/StellarBlade.png')} alt="" />
                    <p>Sony Entertainment</p>
                  </div>
                </div>
              </div>
              <div className={`lndpcdgwlSlider ${currentIndex === 2 ? 'active' : ''}`}>
                <div className="lndpcfgwl">
                  <div className="lndpcfgwlImage">
                    <img src={require('../assets/imgs/GameBanners/CYBER PUNK 2077.png')} alt="" />
                    <div className="lndpcfgwlShadow"></div>
                  </div>
                  <div className='lndpcfgwlDetails'>
                    <img src={require('../assets/imgs/GameLogos/CyberPunk2077.png')} alt="" />
                    <p>Warner Bros Entertainment</p>
                  </div>
                </div>
              </div>
              <div className={`lndpcdgwlSlider ${currentIndex === 3 ? 'active' : ''}`}>
                <div className="lndpcfgwl">
                  <div className="lndpcfgwlImage">
                    <img src={require('../assets/imgs/GameBanners/HELL DIVERS.png')} alt="" />
                    <div className="lndpcfgwlShadow"></div>
                  </div>
                  <div className='lndpcfgwlDetails'>
                    <img src={require('../assets/imgs/GameLogos/Helldivers2.png')} alt="" />
                    <p>Sony Entertainment</p>
                  </div>
                </div>
              </div>
              <div className={`lndpcdgwlSlider ${currentIndex === 4 ? 'active' : ''}`}>
                <div className="lndpcfgwl">
                  <div className="lndpcfgwlImage">
                    <img src={require('../assets/imgs/GameBanners/HOGWARTS LEGACY.png')} alt="" />
                    <div className="lndpcfgwlShadow"></div>
                  </div>
                  <div className='lndpcfgwlDetails'>
                    <img src={require('../assets/imgs/GameLogos/HogwartsLegacy.png')} alt="" />
                    <p>Warner Bros Entertainment</p>
                  </div>
                </div>
              </div>
              <div className={`lndpcdgwlSlider ${currentIndex === 5 ? 'active' : ''}`}>
                <div className="lndpcfgwl">
                  <div className="lndpcfgwlImage">
                    <img src={require('../assets/imgs/GameBanners/SPIDERMAN MILES MORALES.png')} alt="" />
                    <div className="lndpcfgwlShadow"></div>
                  </div>
                  <div className='lndpcfgwlDetails'>
                    <img src={require('../assets/imgs/GameLogos/SpidermanMilesMorales.png')} alt="" />
                    <p>Sony Entertainment</p>
                  </div>
                </div>
              </div>
              <div className={`lndpcdgwlSlider ${currentIndex === 6 ? 'active' : ''}`}>
                <div className="lndpcfgwl">
                  <div className="lndpcfgwlImage">
                    <img src={require('../assets/imgs/GameBanners/LIKE A DRAGON INFINITE WEALTH.png')} alt="" />
                    <div className="lndpcfgwlShadow"></div>
                  </div>
                  <div className='lndpcfgwlDetails'>
                    <img src={require('../assets/imgs/GameLogos/LikeADragonInfiniteWealth.png')} alt="" />
                    <p>SEGA</p>
                  </div>
                </div>
              </div>
              <div className={`lndpcdgwlSlider ${currentIndex === 7 ? 'active' : ''}`}>
                <div className="lndpcfgwl">
                  <div className="lndpcfgwlImage">
                    <img src={require('../assets/imgs/GameBanners/SuperMarioWonders.png')} alt="" />
                    <div className="lndpcfgwlShadow"></div>
                  </div>
                  <div className='lndpcfgwlDetails'>
                    <img src={require('../assets/imgs/GameLogos/SuperMarioWonders.png')} alt="" />
                    <p>Nintendo</p>
                  </div>
                </div>
              </div>
              <div className={`lndpcdgwlSlider ${currentIndex === 8 ? 'active' : ''}`}>
                <div className="lndpcfgwl">
                  <div className="lndpcfgwlImage">
                    <img src={require('../assets/imgs/GameBanners/FORZA MOTORSPORT 7.png')} alt="" />
                    <div className="lndpcfgwlShadow"></div>
                  </div>
                  <div className='lndpcfgwlDetails'>
                    <img src={require('../assets/imgs/GameLogos/ForzaMotorsport7.png')} alt="" />
                    <p>Microsoft Game Studio</p>
                  </div>
                </div>
              </div>
              <div className={`lndpcdgwlSlider ${currentIndex === 9 ? 'active' : ''}`}>
                <div className="lndpcfgwl">
                  <div className="lndpcfgwlImage">
                    <img src={require('../assets/imgs/GameBanners/TheLastOfUsPart2.png')} alt="" />
                    <div className="lndpcfgwlShadow"></div>
                  </div>
                  <div className='lndpcfgwlDetails'>
                    <img src={require('../assets/imgs/GameLogos/TheLastOfUsPart2.png')} alt="" />
                    <p>Sony Entertainment</p>
                  </div>
                </div>
              </div>
              <div className={`lndpcdgwlSlider ${currentIndex === 10 ? 'active' : ''}`}>
                <div className="lndpcfgwl">
                  <div className="lndpcfgwlImage">
                    <img src={require('../assets/imgs/GameBanners/StreetFighter6.png')} alt="" />
                    <div className="lndpcfgwlShadow"></div>
                  </div>
                  <div className='lndpcfgwlDetails'>
                    <img src={require('../assets/imgs/GameLogos/StreetFighter6.png')} alt="" />
                    <p>CAPCOM</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lndpcfgWeb right">
              <h5>70+ Total Listed Games</h5>
              <h3>SELLING THE<br />BEST GAMES</h3>
              <p>
                Attract Game is your ultimate destination for the best games! We proudly offer you access 
                to the latest and most trending titles, ensuring you always play the hottest games 
                worldwide at the best prices. Experience the thrill of premier gaming with Attract Game - 
                where the best games are just a click away!
              </p>
              <div className="lndpcMarqueeContainer" ref={marqueeRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <img src={require('../assets/imgs/GameDeveloper/ActivitionBlizzard.png')} alt="" />
                <img src={require('../assets/imgs/GameDeveloper/BandaiNamco.png')} alt="" />
                <img src={require('../assets/imgs/GameDeveloper/ElectronicArts.png')} alt="" />
                <img src={require('../assets/imgs/GameDeveloper/EpicGames.png')} alt="" />
                <img src={require('../assets/imgs/GameDeveloper/Gameloft.png')} alt="" />
                <img src={require('../assets/imgs/GameDeveloper/Nintendo.png')} alt="" />
                <img src={require('../assets/imgs/GameDeveloper/RockStar.png')} alt="" />
                <img src={require('../assets/imgs/GameDeveloper/Sega.png')} alt="" />
                <img src={require('../assets/imgs/GameDeveloper/SonyInteractiveEntertainment.png')} alt="" />
                <img src={require('../assets/imgs/GameDeveloper/Ubisoft.png')} alt="" />
                <img src={require('../assets/imgs/GameDeveloper/ActivitionBlizzard.png')} alt="" />
                <img src={require('../assets/imgs/GameDeveloper/BandaiNamco.png')} alt="" />
                <img src={require('../assets/imgs/GameDeveloper/ElectronicArts.png')} alt="" />
                <img src={require('../assets/imgs/GameDeveloper/EpicGames.png')} alt="" />
                <img src={require('../assets/imgs/GameDeveloper/Gameloft.png')} alt="" />
                <img src={require('../assets/imgs/GameDeveloper/Nintendo.png')} alt="" />
                <img src={require('../assets/imgs/GameDeveloper/RockStar.png')} alt="" />
                <img src={require('../assets/imgs/GameDeveloper/Sega.png')} alt="" />
                <img src={require('../assets/imgs/GameDeveloper/SonyInteractiveEntertainment.png')} alt="" />
                <img src={require('../assets/imgs/GameDeveloper/Ubisoft.png')} alt="" />
              </div>
              <Link to="/Games" onClick={handleClickGames}>VIEW GAMES</Link>
            </div>
          </div>
        </div>
        <div className="lndPageContent mid4">
          <div className="lndpcmid4Container">
            <div className="lndpcm4Content left">
              
              <img id='lndpcm4crMobileMob' src={require('../assets/imgs/MobileHighlights.png')} alt="" />
              <h4>INTERACT ON OUR</h4>
              <h3>COMMUNITY</h3>
              <div className='lndpcm4cStats'>
                <div>
                  <h3>100+</h3>
                  <p>Registered Users</p>
                </div>
                <div>
                  <h3>400+</h3>
                  <p>Discord Members</p>
                </div>
              </div>
              <p>
                Create an account on Attract Game and dive into the action by sharing your game highlights, epic stories, 
                and game-related content on the Highlight Page. Plus, join our vibrant official Discord Channel to connect 
                with fellow gamers and be part of an exciting community!
              </p>
              <div className="lndpcm4lBtns">
                {/* <a>REGISTER</a> */}
                <a href='https://discord.gg/jHzDQa9M' target='blank'>JOIN DISCORD</a>
              </div>
            </div>
            <div className="lndpcm4Content right">
              <img id='lndpcm4crMobile' src={require('../assets/imgs/MobileHighlights.png')} alt="" />
            </div>
          </div>
        </div>
        <div className="lndPageContent mid5">

          <h4><TbGiftCardFilled className='faIcons'/> GIFT CARDS & VOUCHERS</h4>
          <div className="lndpcmid5Giftcard">
            <div className="lndpcmid5Container">
              {viewAllGiftcard.slice(0,5).map((details, i) => (
                <Link className="lndpcm5Content" key={i} to={`/Giftcards/${details.giftcard_canonical}`} onClick={handleClickGiftcards}>
                  <div className="lndpcm5c left">
                    <img src={`https://2wave.io/GiftCardCovers/${details.giftcard_cover}`} alt="" />
                  </div>
                  <div className="lndpcm5c right">
                    <h3>{details.giftcard_name}</h3>
                    <p>{details.giftcard_description.slice(0, 250)}...</p>
                  </div>
                </Link>
              ))}
              <Link className="lndpcm5Content" to="/Giftcards" onClick={handleClickGiftcards}>
                <p>View More</p>
              </Link>
            </div>
          </div>
        </div>
        <div className="lndPageContent mid6">
          <h4><FaBitcoin className='faIcons'/> CRYPTOCURRENCY</h4>
          <div className="lndpcFeaturedCrypto">
            <div>
              <img src={require('../assets/imgs/AGCoinBanner.png')} alt="" />
            </div>
            <div className='lndpcfCrypto'>
              <h3>AG VOUCHER</h3>
              <p>Unlock endless possibilities with the AG Voucher! Use it to purchase 
                anything your heart desires from the Attract Game - Gamestore. Be an early bird 
                and get your hands on the exclusive Attract Game Token - don't miss out on 
                the fun and excitement!</p>
              <span>
                <Link to="/AGCrypto">ICO SOON</Link>
              </span>
            </div>
          </div>
        </div>
        <div className="lndPageContent mid7">
          <div className="lndpcmid7Container">
            <div className="lndpcmid7content left">
              <img src={require('../assets/imgs/GameLogos/RobloxLogo.png')} alt="" />
              <p>
                We sell Roblox Giftcards from the official Roblox Store and also offer cheap Robux from our 
                partnered Roblox developers, allowing players to purchase costumes and items at a lower cost. 
                This Roblox Game Credit originated directly from a Roblox developer, rather than being purchased 
                through the official Roblox platform. As such, it is sometimes informally referred to as 'Dirty 
                Robux' since it was not acquired via the standard purchase process.
              </p>
              <Link to={`/GameCredits/Robux`} onClick={handleClickGiftcards}>View Roblox Offers</Link>
            </div>
            <div className="lndpcmid7content right">
              <img src={require('../assets/imgs/PlayRoblox.gif')} alt="" />
            </div>
          </div> 
        </div>
        <div className="lndPageContent mid8">
          <h4>START YOUR GAMING ADVENTURE</h4>
          <h5>JOIN ATTRACT GAME</h5><br />
          <p>
            There are still many amazing games you must play and try. 
            Let us be a part of your unforgettable gaming journey!
          </p>
        </div>
      </section>
    </div>
  )
}

export default Home;