import React, { useEffect, useState } from 'react'
import "../CSS/home.css";
import { Link } from 'react-router-dom';
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
  TbDeviceGamepad2,
  TbGiftCard,
  TbHeart,
  TbHeartFilled,
  TbTrendingUp,
  TbAwardFilled,
  TbCampfireFilled,
  TbCalendarStar,
  TbSquareRoundedArrowRight, 
  TbGiftCardFilled 
} from "react-icons/tb";
import axios from 'axios';



const Home = () => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const AGGamesListAPI1 = process.env.REACT_APP_AG_GAMES_LIST_API;
  const [viewAllGamesNum, setViewAllGamesNum] = useState([]);
  const [viewAGData1, setViewAGData1] = useState([]);


  useEffect(() => {
      const fetchDataGames = async () => {
          try {
              const response1 = await axios.get(AGGamesListAPI1);
              const agAllGames = response1.data;

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
      fetchDataGames();
  }, []);
  
  
  

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
              <Link>Read More</Link>
            </span>
          </div>
        </div>
      </section>
      <section className="landingPageContainer mid">
        <div className="lndPageContent mid1">
          <div className='lndpcSearch'>
            <h6><FaSearch className='faIcons'/></h6>
            <input type="text" placeholder='Search Games / Voucher / Giftcards / Crypto / Merchandise'/>
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
            <div id='lndpcTrending'>
              <h5>TRENDING GAMES</h5>
            </div>
            <div id='lndpcHot'>
              <h5>HOT GAMES</h5>
            </div>
            <div id='lndpcClassic'>
              <h5>CLASSIC GAMES</h5>
            </div>
          </div>
        </div>
        <div className="lndPageContent mid3">
          <h4><FaFire className='faIcons'/>FEATURED GAMES</h4>
          <div className="lndpcFeaturedGames">
            {viewAGData1.slice(0, 10).map((details, i) => (
            <div className='lndpcfgames website' key={i}>
              {details.game_cover ?
                <img src={`https://engeenx.com/GameCovers/${details.game_cover}`} alt="" />
                :<img src={require('../assets/imgs/GameBanners/DefaultNoBanner.png')} alt="" />}
              <div className='lndpcfgDetails'>
                <h6>{details.game_title}</h6>
                <p>{details.game_developer}</p>
              </div>
              <div className="lndpcfgPlatform">
                <img platform={details.game_platform} src="" alt="" />
              </div>
            </div>))}
            {viewAGData1.slice(0, 4).map((details, i) => (
            <div className='lndpcfgames mobile' key={i}>
              {details.game_cover ?
                <img src={`https://engeenx.com/GameCovers/${details.game_cover}`} alt="" />
                :<img src={require('../assets/imgs/GameBanners/DefaultNoBanner.png')} alt="" />}
              <div className='lndpcfgDetails'>
                <h6>{details.game_title}</h6>
                <p>{details.game_developer}</p>
              </div>
              <div className="lndpcfgPlatform">
                <img platform={details.game_platform} src="" alt="" />
              </div>
            </div>))}
          </div>
        </div>
        <div className="lndPageContent mid4">
          <img src={require('../assets/imgs/LandingImg/AGStarFeature.png')} alt="" />
          <div className='lndpcAGElite'>
            <div className='lndpcageSocials'>
              <p>FOLLOW US</p>
              <a href=""><FaSquareFacebook className='faIcons'/></a>
              <a href=""><FaInstagram className='faIcons'/></a>
              <a href=""><FaTiktok className='faIcons'/></a>
              <a href=""><FaYoutube className='faIcons'/></a>
              <a href=""><FaTwitch className='faIcons'/></a>
            </div>
            <h3>BE AN <span>AG ELITE</span></h3>
            <h6>JOIN THE AFFILIATE PROGRAM AND GET FREEBIES AND PERKS</h6>
            <div className='lndpcageJoin'>
              <Link>Join Here</Link>
            </div>
          </div>
        </div>
        <div className="lndPageContent mid5">
          <div className="lndpcGameListed">
            <span>
              <h3>{viewAllGamesNum}</h3>
              <h6>LISTED GAMES</h6>
            </span>
            <span>
              <h3>4 <FaStar className='faIcons'/></h3>
              <h6>GAMESTORE RATING</h6>
            </span>
            <span>
              <h3>37</h3>
              <h6>AG ELITE</h6>
            </span>
            <span>
              <h3>1000+</h3>
              <h6>USERS</h6>
            </span>
          </div>
        </div>
        <div className="lndPageContent mid6">
          <a href="">
            <img src={require('../assets/imgs/DefaultAd.gif')} alt="" />
          </a>
        </div>
        <div className="lndPageContent mid7">
          <h4><TbGiftCardFilled className='faIcons'/> GIFT CARDS & VOUCHERS</h4>
          <div className="lndpcFeaturedGiftCards">
            <div className='lndpcfgc'>
              <img src={require('../assets/imgs/GiftCards/AppleGiftCard.png')} alt="" />
            </div>
            <div className='lndpcfgc mobile'>
              <img src={require('../assets/imgs/GiftCards/GooglePlayGiftCard.png')} alt="" />
            </div>
            <div className='lndpcfgc'>
              <img src={require('../assets/imgs/GiftCards/PlayStationStoreGiftCard.png')} alt="" />
            </div>
            <div className='lndpcfgc'>
              <img src={require('../assets/imgs/GiftCards/SteamGiftCard.png')} alt="" />
            </div>
            <div className='lndpcfgc'>
              <img src={require('../assets/imgs/GiftCards/XboxGiftCard.png')} alt="" />
            </div>
            <div className="lndpcfgcRobloxBinance">
              <div className="lndpcfgcrb left">
                <h4>ROBLOX</h4>
                <h5>GIFT CARD</h5>
                <p>
                  Surprise a Roblox fan. Choose from dozens of eGift card 
                  based on your favorite experiences, characters, and more.
                </p>
                <Link>View More Game Credits</Link>
              </div>
              <div className="lndpcfgcrb right">
                <img src={require('../assets/imgs/GiftCards/RobloxGiftCard.png')} alt="" />
              </div>
            </div>
            <div className="lndpcfgcRobloxBinance">
              <div className="lndpcfgcrb left">
                <h4>BINANCE</h4>
                <h5>GIFT CARD</h5>
                <p>
                  Buy, Sell and Send Binance Gift Card to anyone, anywhere instantly! 
                  Redeem your cryptocurrency with the Gift Card code.
                </p>
                <Link>View More Binance Cypto</Link>
              </div>
              <div className="lndpcfgcrb right">
                <img src={require('../assets/imgs/GiftCards/BinanceGiftCardTether.png')} alt="" />
              </div>
            </div>
          </div>
          <div className="lndpcfgcViewMore">
            <Link>View More</Link>
          </div>
        </div>
        <div className="lndPageContent mid8">
          <h4><FaBitcoin className='faIcons'/> CRYPTOCURRENCY</h4>
          <div className="lndpcFeaturedCrypto">
            <div>
              <img src={require('../assets/imgs/AGCoinBanner.png')} alt="" />
            </div>
            <div className='lndpcfCrypto'>
              <h3>AG VOUCHER</h3>
              <h6>To Purchase Anything on Attract Game Store</h6>
              <p>Be the Early-Bird for Attract Game Token</p>
              <span>
                <Link>Learn More</Link>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home;