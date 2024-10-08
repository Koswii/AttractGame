import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import "../CSS/cart.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { 
  FaBars, 
  FaTimes,
  FaBolt,
  FaClipboardCheck
} from 'react-icons/fa';
import { 
    TbDeviceGamepad2,
    TbGiftCard, 
    TbDiamond,   
} from "react-icons/tb";

// stripe
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../Pages/checkoutform";
import { UserProfileData } from './UserProfileContext';
import { CartsFetchData } from './CartsFetchContext';
import { GamesFetchData } from './GamesFetchContext';
import { GiftcardsFetchData } from './GiftcardsFetchContext';
import { GamecreditsFetchData } from './GamecreditFetchContext';

const stripePromise = loadStripe(
  'pk_live_51NpiTWGmWxGfJOSJJkBZLErq1wH9iElM7ixsOF0WRi7HG812NxEsHlsbQwKATn9vZm13e7iu8XsllV0VoY8LT7qJ00p1y83XlO'
);



const Cart = () => {
    const { userLoggedData } = UserProfileData();
    const { 
      fetchUserCart, 
      carts, 
      productCart, 
      setProductCarts,
      gameProducts,
      giftcardProducts,
      gamecreditProducts
    } = CartsFetchData();
    const { viewAGData1 } = GamesFetchData();
    const { giftcards } = GiftcardsFetchData();
    const { gamecredits } = GamecreditsFetchData();
    const navigate = useNavigate();
    const AGUserRemoveToCartAPI = process.env.REACT_APP_AG_REMOVE_USER_CART_API;
    const AGUserProductTransferAPI = process.env.REACT_APP_AG_TRANSFER_PRODUCTS_API;
    const AGUserTransactionHistoryAPI = process.env.REACT_APP_AG_TRANSACTION_HISTORY_API;

    const [productGameDetails, setGameProductDetails] = useState([]);
    const [productGiftcardDetails, setGiftcardProductDetails] = useState([]);
    const [productGamecreditDetails, setGamecreditProductDetails] = useState([]);
    const [allPrductsDetails, setAllProductDetails] = useState([]);
    const [cartTotalPayment, setCartTotalPayment] = useState([]);

    const [transactionHash, setTransactionHash] = useState('');
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [orderQuantities, setOrderQuantities] = useState({});

    const calculateEffectivePrice = (price, discount) => {
      return price - (price * (discount / 100));
    };
    const fetchCartProducts = () => {
      try {

        const cartGameWithData = gameProducts.map(product => {
          const productData = viewAGData1.find(game => game.game_canonical === product.ag_product_id);
          const effectivePrice = calculateEffectivePrice(productData.stock.ag_product_price, productData.stock.ag_product_discount);
          const numberOfOrder = orderQuantities[product.ag_product_id] || 1;
          const totalPrice  = effectivePrice*numberOfOrder
          return { ...product, productData, effectivePrice, totalPrice, numberOfOrder};
        });

        const cartGiftcardWithData = giftcardProducts.map(product => {
          const productData = giftcards.find(giftcard => giftcard.giftcard_id === product.ag_product_id);
          const effectivePrice = calculateEffectivePrice(productData.giftcard_denomination, 0);
          const numberOfOrder = orderQuantities[product.ag_product_id] || 1;
          const totalPrice  = effectivePrice*numberOfOrder
          return { ...product, productData, effectivePrice, totalPrice, numberOfOrder};
        });

        const cartGamecreditWithData = gamecreditProducts.map(product => {
          const productData = gamecredits.find(gamecredit => gamecredit.gamecredit_id === product.ag_product_id);
          const effectivePrice = calculateEffectivePrice(productData.gamecredit_denomination, 0);
          const numberOfOrder = orderQuantities[product.ag_product_id] || 1;
          const totalPrice  = effectivePrice*numberOfOrder
          return { ...product, productData, effectivePrice, totalPrice, numberOfOrder};
        });


        const combinedDataGame = [...cartGameWithData];
        const combinedDataGiftcard = [...cartGiftcardWithData];
        const combinedDataGamecredit = [...cartGamecreditWithData];
        const combinedAllData = [...cartGameWithData, ...cartGiftcardWithData, ...cartGamecreditWithData];
        setAllProductDetails(combinedAllData);
        setGiftcardProductDetails(combinedDataGiftcard);
        setGamecreditProductDetails(combinedDataGamecredit);
        setGameProductDetails(combinedDataGame);
        setCartTotalPayment(combinedAllData);
        

        const timeout = setTimeout(() => {
          setLoadingProducts(false);
        }, 3500); // 3.5 seconds
  
        return () => {
          clearTimeout(timeout);
        }
        
      } catch (error) {
        // console.log('Error fetching cart products:', error);
      } 
    };
    useEffect(() => {
      fetchCartProducts(carts);
      fetchUserCart(productCart);
    }, [ carts, productCart ]);
    useEffect(() => {
      const interval = setInterval(() => {
        if (allPrductsDetails) {
          const date = new Date();
          const dateString = date.toLocaleDateString();
          const timeString = date.toLocaleTimeString();
          const combinedString = `${allPrductsDetails}${dateString}${timeString}`;
          const hashValue = CryptoJS.SHA256(combinedString).toString(CryptoJS.enc.Hex);
          const agTransactionHash = `AG_${hashValue.slice(0, 18)}`;
          setTransactionHash(agTransactionHash);
        } else {
          setTransactionHash('');
        }
      }, 1000); // Update hash every second
  
      return () => clearInterval(interval);
    }, [allPrductsDetails]);
    const handleQuantityChange = (productId, value) => {
      setOrderQuantities(prevQuantities => ({
          ...prevQuantities,
          [productId]: value
      }));
  
      setAllProductDetails(prevProducts => {
        return prevProducts.map(product => {
            if (product.ag_product_id === productId) {
                const effectivePrice = product.effectivePrice;
                // Update numberOfOrder for the current product
                product.totalPrice = effectivePrice * value
                product.numberOfOrder = value;
                return { ...product };
            }
            return product;
        });
      });
      setCartTotalPayment(allPrductsDetails);
    };
    const productSubtotalSum = cartTotalPayment.map(subTotal => subTotal.totalPrice).reduce((acc, cur) => acc + cur, 0);
    const agTaxFee = (3/100);
    const agProductCharge = (4.5/100);
    const checkoutOverallTotal = productSubtotalSum + (agProductCharge*productSubtotalSum) + (agTaxFee*productSubtotalSum);
    const agProductPointsSum = cartTotalPayment.map(subTotal => subTotal.totalPrice).reduce((acc, cur) => acc + cur, 0);
    const checkoutOverallAGPoints = agProductPointsSum/10;
    const handleRemoveFromCart = (details) => {
      const removeDetails = {
        user: userLoggedData.userid,
        cart: details.ag_product_id
      }
      const removeToCartJSON = JSON.stringify(removeDetails);
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
            fetchCartProducts(carts);
            fetchUserCart(productCart);
            navigate('/MyCart');
          } else {
            console.log(`Error: ${response.data.message}`);
          }
      })
      .catch(error => {
          console.log(`Error: ${error.message}`);
      });
    };
    const renderCartProducts = () => {
      return (
        <>
          {(allPrductsDetails.length != 0) ? 
            <>
                {productGameDetails.map((details, i) => (
                  <div className="cartpcm1clProduct website" key={i}>
                    <img src={`https://2wave.io/GameCovers/${details.productData.game_cover}`} alt="" />
                    <button onClick={() => handleRemoveFromCart(details)}><FaTimes className='faIcons'/></button>
                    <div className="cartpcm1clpPlatform">
                      <img src="" platform={details.productData.game_platform} alt="" />
                    </div>
                    <div className="cartpcm1clpPrice">
                      <h5>$  {(details.productData.stock === 0 || details.productData.stock === undefined) ? '--.--': details.effectivePrice.toFixed(2)}</h5>
                      <input type="number" min={1} max={details.productData.stockCount} value={orderQuantities[details.ag_product_id] || 1} onChange={(e) => handleQuantityChange(details.ag_product_id, Number(e.target.value))} placeholder='1'/>
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
                        <h5>$ {(details.productData.stock === 0 || undefined) ? '--.--': details.effectivePrice.toFixed(2)}</h5>
                        <input type="number" min={1} max={details.productData.stockCount} value={orderQuantities[details.ag_product_id] || 1} onChange={(e) => handleQuantityChange(details.ag_product_id, Number(e.target.value))} placeholder='1'/>
                      </div>
                  </div>
                ))}
                {productGamecreditDetails.map((details, i) => (
                    <div className="cartpcm1clProduct website" key={i}>
                        <img src={`https://2wave.io/GameCreditCovers/${details.productData.gamecredit_cover}`} alt="" />
                        <button onClick={() => handleRemoveFromCart(details)}><FaTimes className='faIcons'/></button>
                        <div className="cartpcm1clpPlatform denomination">
                            <h3><sup>$</sup>{details.productData.gamecredit_denomination}</h3>
                            <p>CREDIT</p>
                        </div>
                        <div className="cartpcm1clpPrice">
                        <h5>$ {(details.productData.stock === 0 || undefined) ? '--.--': details.effectivePrice.toFixed(2)}</h5>
                            <input type="number" min={1} max={details.productData.stockCount} value={orderQuantities[details.ag_product_id] || 1} onChange={(e) => handleQuantityChange(details.ag_product_id, Number(e.target.value))} placeholder='1'/>
                        </div>
                    </div>
                ))}
            </>:<>
              <div className="cartpcm1clProductEmpty">
                <h6>No Products Here</h6>
              </div>
            </>
          }
        </>
      );
    };
    const renderCartProductsMobile = () => {
      return (
        <>
          {(allPrductsDetails.length != 0) ? 
            <>
              {productGameDetails.map((details, i) => (
                  <div className="cartpcm1clProduct mobile" key={i}>
                      <button onClick={() => handleRemoveFromCart(details)}><FaTimes className='faIcons'/></button>
                      <h5>{details.productData.game_title} - {details.productData.game_platform}</h5>
                      <div className="cartpcm1clpPrice">
                        <input type="number" min={1} max={details.productData.stockCount} value={orderQuantities[details.ag_product_id] || 1} onChange={(e) => handleQuantityChange(details.ag_product_id, e.target.value)} placeholder='1'/>
                        <h5>$ {(details.productData.stock === 0 || details.productData.stock === undefined) ? '--.--': details.effectivePrice.toFixed(2)}</h5>
                      </div>
                  </div>
              ))}
              {productGiftcardDetails.map((details, i) => (
                  <div className="cartpcm1clProduct mobile" key={i}>
                      <button onClick={() => handleRemoveFromCart(details)}><FaTimes className='faIcons'/></button>
                      <h5>{details.productData.giftcard_name} - ${details.productData.giftcard_denomination}</h5>
                      <div className="cartpcm1clpPrice">
                          <input type="number" min={1} max={details.stockCount} value={orderQuantities[details.ag_product_id] || 1} onChange={(e) => handleQuantityChange(details.ag_product_id, e.target.value)} placeholder='1'/>
                          <h5>$ {(details.productData.stock === 0 || undefined) ? '--.--': details.effectivePrice.toFixed(2)}</h5>
                      </div>
                  </div>
              ))}
              {productGamecreditDetails.map((details, i) => (
                  <div className="cartpcm1clProduct mobile" key={i}>
                      <button onClick={() => handleRemoveFromCart(details)}><FaTimes className='faIcons'/></button>
                      <h5>{details.productData.gamecredit_name} - ${details.productData.gamecredit_denomination}</h5>
                      <div className="cartpcm1clpPrice">
                          <input type="number" min={1} max={details.stockCount} value={orderQuantities[details.ag_product_id] || 1} onChange={(e) => handleQuantityChange(details.ag_product_id, e.target.value)} placeholder='1'/>
                          <h5>$ {(details.productData.stock === 0 || undefined) ? '--.--': details.effectivePrice.toFixed(2)}</h5>
                      </div>
                  </div>
              ))}
            </>:<>
              <div className="cartpcm1clProductEmpty mobile">
                <h6>No Products Here</h6>
              </div>
            </>
          }
        </>
      );
    };

    
    const AGRapidCentAuthCode = process.env.REACT_APP_RAPIDCENT_AUTH_CODE;
    const AGRapidCentClientID = process.env.REACT_APP_RAPIDCENT_CLIENT_ID;
    const AGRapidCentClientSecret = process.env.REACT_APP_RAPIDCENT_CLIENT_SECRET;
    const AGRapidCentTokenExchange = process.env.REACT_APP_AG_RAPIDCENT_TOKEN;

    const clientId = AGRapidCentClientID;
    const clientSecret = AGRapidCentClientSecret;
    const redirectUri = 'https://attractgame-beta-website.vercel.app/MyCart';
    const authorizationEndpoint = 'https://uatstage00-api.rapidcents.com/oauth/authorize';
    const tokenEndpoint = 'https://uatstage00-api.rapidcents.com/oauth/token';
  
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
  
    // Step 1: Redirect to authorization URL
    const handleLogin = () => {
      const authUrl = `${authorizationEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code`;
      window.location.href = authUrl;
    };
  
    // Step 2: Handle the redirect and exchange the authorization code for tokens
    useEffect(() => {
      const fetchAuthorizationCode = () => {
        // const urlParams = new URLSearchParams(window.location.search);
        // const authorizationCode = urlParams.get('code');
        const authorizationCode = AGRapidCentAuthCode;

        if (authorizationCode) {
          // Exchange authorization code for access and refresh tokens
          const fetchTokens = async () => {
            try {
              const response = await axios.post(AGRapidCentTokenExchange, {
                grant_type: 'authorization_code',
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                code: authorizationCode,
              });

              console.log(response.data);
              
              const { access_token, refresh_token } = response.data;
              setAccessToken(access_token);
              setRefreshToken(refresh_token);
              console.log('Access Token:', access_token);
              console.log('Refresh Token:', refresh_token);

              // Clear the URL search parameters
              window.history.replaceState({}, document.title, window.location.pathname);
            } catch (error) {
              console.error('Error exchanging authorization code for tokens', error);
            }
          };

          fetchTokens();
        }
      };

      fetchAuthorizationCode();
    }, []); // The effect runs once on mount
  
    // Step 3: Refresh access token if it expires
    const refreshAccessToken = async () => {
      if (!refreshToken) return;
  
      try {
        const response = await axios.post(AGRapidCentTokenExchange, {
          grant_type: 'refresh_token',
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
        });
  
        const { access_token, refresh_token } = response.data;
        setAccessToken(access_token);
        setRefreshToken(refresh_token);
        console.log('New Access Token:', access_token);
        console.log('New Refresh Token:', refresh_token);
      } catch (error) {
        console.error('Error refreshing access token', error);
      }
    };


    // const [clientSecret, setClientSecret] = useState();
    // const [paymentIntentid, setPaymentIntentID] = useState();
    // const [successtransaction,setSuccesstransaction] = useState(false)

    // const appearance = {
    //   theme: "night",
    //   labels: "floating",
    // };
    // const options = {
    //     clientSecret,
    //     appearance,
    // };
    // const checkOutprod = async () => {
    //   const body = {
    //     product: allPrductsDetails,
    //   };
    //   const bodyString = JSON.stringify(body)
    //   const headers = { "Content-type": "application/json" };
    
    //   try {
    //     const response = await fetch(
    //       "https://attractgame.com/create-check-out-session",
    //       // "http://localhost:4242/create-check-out-session",
    //       {
    //         method: "POST",
    //         headers: headers,
    //         body: bodyString,
    //       }
    //     );
    
    //     const session = await response.json();
    //     setClientSecret(session.clientSecret);
    //     setPaymentIntentID(session.paymentIntentID)
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }



    
    const handleSubmitTransaction = async () => {
      if (!userLoggedData.userid) {
        console.log('Owner field is required.');
        return;
      }
      const specificProductIds = [];
      const numberOfRows = [];
      allPrductsDetails.forEach(product => {
        specificProductIds.push(product.ag_product_id);
        numberOfRows.push(product.numberOfOrder);
      });
      const flattenedProductIds = [];
      specificProductIds.forEach((productId, index) => {
        for (let i = 0; i < numberOfRows[index]; i++) {
          flattenedProductIds.push(productId);
        }
      });
      const flattenedNumberOfRows = [];
      numberOfRows.forEach(num => {
        for (let i = 0; i < num; i++) {
          flattenedNumberOfRows.push(1);
        }
      });
      const postData = {
        specificProductIds: flattenedProductIds,
        newOwner: userLoggedData.userid,
        numberOfRows: flattenedNumberOfRows,
      };

      const agProductNames = allPrductsDetails.map(products => products.ag_product_name);
      const agProductID = allPrductsDetails.map(products => products.ag_product_id);
      const agProductQuantity = allPrductsDetails.map(products => products.numberOfOrder);
      const agProductPrice = allPrductsDetails.map(products => products.effectivePrice);
      const agProductPurchasedDate = new Date();
      const agProductTransactionHash = transactionHash;
      const agOverallAGPoints = checkoutOverallAGPoints;


      const transactionData = {
        productOwner: userLoggedData.userid,
        productNames: agProductNames,
        productIds: agProductID,
        productQuantity: agProductQuantity,
        productPrice: agProductPrice,
        productPDate: agProductPurchasedDate,
        productTHash: agProductTransactionHash,
        productAGPoints: agOverallAGPoints,
        productAGCommand: 'Purchase',
      }

      axios.post(AGUserProductTransferAPI, postData)
      .then(response => {
        const resMessage = response.data;
        if (resMessage.success === false) {
          console.log(resMessage.message);
        }
        if (resMessage.success === true) {
          axios.post(AGUserTransactionHistoryAPI, transactionData)
          .then(response => {
            const resMessage = response.data;
            if (resMessage.success === false) {
              console.log(resMessage.message);
            }
            if (resMessage.success === true) {
              console.log(resMessage.message);
              setAllProductDetails([]);
              setGameProductDetails([]);
              setGiftcardProductDetails([]);
              setGamecreditProductDetails([]);
            }
          }) 
          .catch (error =>{
              console.log(error);
          });
        }
      }) 
      .catch (error =>{
          console.log(error);
      });
    };



    // if(successtransaction){
    //   window.document.body.style.overflow = 'hidden';
    // } else{
    //   window.document.body.style.overflow = 'auto';
    // }

    return (
      // <></>
      <div className="mainContainer cart">
        {/* {successtransaction && (
          <div className="successTransaction">
            <div className="successTransactionContainer">
              <span><FaClipboardCheck /></span>
              <section>
                <h1>THANK YOU FOR PURCHASING.</h1>
                <p>Check your Profile for your Products.</p>
              </section>
            </div>
          </div>
        )} */}
        {/* {clientSecret ? 
          <>
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm checkOutprod={checkOutprod} setSuccesstransaction={setSuccesstransaction} cartTotalPayment={cartTotalPayment} allPrductsDetails={allPrductsDetails} paymentIntentId={paymentIntentid} setClientSecret={setClientSecret} totalprice={checkoutOverallTotal} transactionData={handleSubmitTransaction}/>
            </Elements>
          </>:
          <> */}
            <section className="cartPageContainer mid">
              <div className="cartpcMid1Container">
                <div className="cartpcm1Content left">
                  <div className="cartpcm1cLeft">
                    {!loadingProducts ? <>
                      {renderCartProducts()}
                      {renderCartProductsMobile()}
                    </>:<>
                      <div className="cartpcm1clProductEmpty mobile">
                        <h6>Loading up your Cart</h6>
                      </div>
                      <div className="cartpcm1clProductEmpty">
                        <h6>Loading up your Cart</h6>
                      </div>
                    </>}
                  </div>
                </div>
                <div className="cartpcm1Content right">
                  <div className="cartpcm1cRight">
                    <h5>ORDER SUMMARY</h5>
                    <div className="cartpcm1crList">
                      <h6>
                        <TbDeviceGamepad2 className="faIcons" /> GAMES
                      </h6>
                      {productGameDetails.map((details, i) => (
                        <>
                          <span key={i}>
                            <p id="productTitle">
                              {details.productData.game_title} -{" "}
                              {details.productData.game_platform}
                            </p>
                            <p id="productPrice">
                              ${" "}
                              {details.productData.stock === undefined
                                ? "--.--"
                                : details.productData.stock === undefined
                                ? "--.--"
                                : details.effectivePrice.toFixed(2)}{" "}
                              x {orderQuantities[details.ag_product_id] || 1}
                            </p>
                          </span>
                        </>
                      ))}
                      <br />
                      <h6>
                        <TbGiftCard className="faIcons" /> GIFTCARDS
                      </h6>
                      {productGiftcardDetails.map((details, i) => (
                        <>
                          <span key={i}>
                            <p id="productTitle">
                              {details.productData.giftcard_name} - $
                              {details.productData.giftcard_denomination}
                            </p>
                            <p id="productPrice">
                              ${" "}
                              {(details.productData.stock === 0 || undefined)
                                ? "--.--"
                                : (details.productData.stock === 0 || undefined)
                                ? "--.--"
                                : details.effectivePrice.toFixed(2)}{" "}
                              x {orderQuantities[details.ag_product_id] || 1}
                            </p>
                          </span>
                        </>
                      ))}
                      <br />
                      <h6>
                        <TbDiamond className="faIcons" /> GAME CREDITS
                      </h6>
                      {productGamecreditDetails.map((details, i) => (
                        <>
                          <span key={i}>
                            <p id="productTitle">
                              {details.productData.gamecredit_name} - $
                              {details.productData.gamecredit_denomination}
                            </p>
                            <p id="productPrice">
                              ${" "}
                              {(details.productData.stock === 0 || undefined)
                                ? "--.--"
                                : (details.productData.stock === 0 || undefined)
                                ? "--.--"
                                : details.effectivePrice.toFixed(2)}{" "}
                              x {orderQuantities[details.ag_product_id] || 1}
                            </p>
                          </span>
                        </>
                      ))}
                    </div>
                    <div className="cartpcm1crCheckout">
                      <span>
                        <p>SUBTOTAL</p>
                        <h6>$ {productSubtotalSum.toFixed(2)}</h6>
                      </span>
                      <span>
                        <p>TRANSACTION FEE</p>
                        <h6>7.5%</h6>
                      </span>
                      {/* <span>
                        <p>OUR CHARGE</p>
                        <h6>4.5%</h6>
                      </span> */}
                      <hr />
                      <span>
                        <p>AG POINTS</p>
                        <h6>
                          {checkoutOverallAGPoints.toFixed(2)}{" "}
                          <FaBolt className="faIcons" />
                        </h6>
                      </span>
                      <span>
                        <p>PAYABLE</p>
                        <h6>$ {checkoutOverallTotal.toFixed(2)}</h6>
                      </span>
                      <button className={(cartTotalPayment.length === 0) ? 'noProducts' : 'hasProducts'} disabled={(cartTotalPayment.length === 0) ? true : false}>
                        {(cartTotalPayment.length === 0) ? 'EMPTY CART' : 'CHECKOUT PRODUCTS'}
                      </button>
                      <button className='devButton' onClick={handleLogin}>Generate Auth</button>
                      <button className='devButton' onClick={refreshAccessToken}>Refresh Token</button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          {/* </> 
        } */}
      </div>
    );
}

export default Cart