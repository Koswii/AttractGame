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
  TbGiftCardFilled 
} from "react-icons/tb";



const Home = () => {
  const [hasScrolled, setHasScrolled] = useState(false);




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
            <div>
              <h6><FaFire className='faIcons'/></h6>
              <img src={require('../assets/imgs/GameBanners/ALONE IN THE DARK.png')} alt="" />
              <span>
                <h5>$ 999</h5>
              </span>
            </div>
            <div>
              <h6><FaFire className='faIcons'/></h6>
              <img src={require('../assets/imgs/GameBanners/HELL DIVERS.png')} alt="" />
              <span>
                <h5>$ 999</h5>
              </span>
            </div>
            <div>
              <h6><FaFire className='faIcons'/></h6>
              <img src={require('../assets/imgs/GameBanners/HOGWARTS LEGACY.png')} alt="" />
              <span>
                <h5>$ 999</h5>
              </span>
            </div>
            <div>
              <h6><FaFire className='faIcons'/></h6>
              <img src={require('../assets/imgs/GameBanners/OCTOPATH TRAVELER.png')} alt="" />
              <span>
                <h5>$ 999</h5>
              </span>
            </div>
            <div>
              <h6><FaFire className='faIcons'/></h6>
              <img src={require('../assets/imgs/GameBanners/OUTCAST BEGINNING.png')} alt="" />
              <span>
                <h5>$ 999</h5>
              </span>
            </div>
            <div>
              <h6><FaFire className='faIcons'/></h6>
              <img src={require('../assets/imgs/GameBanners/PERSONA 4.png')} alt="" />
              <span>
                <h5>$ 999</h5>
              </span>
            </div>
            <div>
              <h6><FaFire className='faIcons'/></h6>
              <img src={require('../assets/imgs/GameBanners/SKULL AND BONES.png')} alt="" />
              <span>
                <h5>$ 999</h5>
              </span>
            </div>
            <div>
              <h6><FaFire className='faIcons'/></h6>
              <img src={require('../assets/imgs/GameBanners/SPIDERMAN MILES MORALES.png')} alt="" />
              <span>
                <h5>$ 999</h5>
              </span>
            </div>
            <div>
              <h6><FaFire className='faIcons'/></h6>
              <img src={require('../assets/imgs/GameBanners/SUICIDE SQUAD.png')} alt="" />
              <span>
                <h5>$ 999</h5>
              </span>
            </div>
            <div>
              <h6><FaFire className='faIcons'/></h6>
              <img src={require('../assets/imgs/GameBanners/TEKKEN 8.png')} alt="" />
              <span>
                <h5>$ 999</h5>
              </span>
            </div>
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
              <h3>300+</h3>
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
            <div className='lndpcfgc'>
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