import React, { useEffect, useState, useRef } from 'react'
import "../CSS/cart.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { 
  FaBars, 
  FaTimes,
  FaBolt,
  FaRegUserCircle,
  FaRegEye,
  FaRegEyeSlash, 
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

const stripePromise = loadStripe(
  process.env.REACT_APP_AG_STRIPE_PROMISE
);

const LoginUserID = localStorage.getItem('profileUserID');
const AGUserCartAPI = process.env.REACT_APP_AG_FETCH_USER_CART_API;
const AGStocksListAPI = process.env.REACT_APP_AG_STOCKS_LIST_API;
const AGGamesListAPI = process.env.REACT_APP_AG_GAMES_LIST_API;
const AGGameCreditsListAPI = process.env.REACT_APP_AG_GAMECREDIT_LIST_API;
const AGGiftcardsListAPI = process.env.REACT_APP_AG_GIFTCARDS_LIST_API;


const fetchCartProducts = async (
    setAllProductDetails, 
    setGameProductDetails, 
    setGiftcardProductDetails, 
    setGamecreditProductDetails, 
    setLoadingProducts) => {
    setLoadingProducts(true);
    try {
        const response = await axios.get(AGUserCartAPI);
        const filteredData = response.data.filter(product => product.ag_user_id === LoginUserID);
        // const cartProductSortData = filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        const gameProducts = filteredData.filter(product => product.ag_product_type === 'Game');
        const giftcardProducts = filteredData.filter(product => product.ag_product_type === 'Giftcard');
        const gamecreditProducts = filteredData.filter(product => product.ag_product_type === 'Game Credit');
        
        try {
            const [userGameDataResponse, userGiftcardDataResponse, userGamecreditDataResponse, stockListResponse] = await Promise.all([
                axios.get(AGGamesListAPI),
                axios.get(AGGiftcardsListAPI),
                axios.get(AGGameCreditsListAPI),
                axios.get(AGStocksListAPI)
            ]);

            const stockListData = stockListResponse.data;
            const calculateEffectivePrice = (price, discount) => {
                return price - (price * (discount / 100));
            };

            const cartGameWithData = gameProducts.map(product => {
                const productData = userGameDataResponse.data.find(game => game.game_canonical === product.ag_product_id);
                const stock = stockListData.find(stock => stock.ag_product_id === product.ag_product_id);
                const stockCount = stockListData.filter(stock => stock.ag_product_id === product.ag_product_id).length;
                const effectivePrice = calculateEffectivePrice(stock.ag_product_price, stock.ag_product_discount);
                const numberOfOrder = 1;
                return { ...product, productData , stock, stockCount, effectivePrice, numberOfOrder, totalPrice: effectivePrice};
            });
            const cartGiftcardWithData = giftcardProducts.map(product => {
                const productData = userGiftcardDataResponse.data.find(giftcard => giftcard.giftcard_id === product.ag_product_id);
                const stock = stockListData.find(stock => stock.ag_product_id === product.ag_product_id);
                const stockCount = stockListData.filter(stock => stock.ag_product_id === product.ag_product_id).length;
                const effectivePrice = calculateEffectivePrice(stock.ag_product_price, stock.ag_product_discount);
                const numberOfOrder = 1;
                return { ...product, productData , stock, stockCount, effectivePrice, numberOfOrder, totalPrice: effectivePrice};
            });
            const cartGamecreditWithData = gamecreditProducts.map(product => {
                const productData = userGamecreditDataResponse.data.find(gamecredit => gamecredit.gamecredit_id === product.ag_product_id);
                const stock = stockListData.find(stock => stock.ag_product_id === product.ag_product_id);
                const stockCount = stockListData.filter(stock => stock.ag_product_id === product.ag_product_id).length;
                const effectivePrice = calculateEffectivePrice(stock.ag_product_price, stock.ag_product_discount);
                const numberOfOrder = 1;
                return { ...product, productData , stock, stockCount, effectivePrice, numberOfOrder, totalPrice: effectivePrice};
            });

            const combinedDataGame = [...cartGameWithData];
            const combinedDataGiftcard = [...cartGiftcardWithData];
            const combinedDataGamecredit = [...cartGamecreditWithData];
            const combinedAllData = [...cartGameWithData, ...cartGiftcardWithData, ...combinedDataGamecredit];

            setAllProductDetails(combinedAllData);
            setGameProductDetails(combinedDataGame);
            setGiftcardProductDetails(combinedDataGiftcard);
            setGamecreditProductDetails(combinedDataGamecredit);

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
    const AGUserRemoveToCartAPI = process.env.REACT_APP_AG_REMOVE_USER_CART_API;
    const AGUserProductTransferAPI = process.env.REACT_APP_AG_TRANSFER_PRODUCTS_API;
    const AGUserTransactionHistoryAPI = process.env.REACT_APP_AG_TRANSACTION_HISTORY_API;
    const [userLoggedData, setUserLoggedData] = useState('');
    const [productGameDetails, setGameProductDetails] = useState([]);
    const [productGiftcardDetails, setGiftcardProductDetails] = useState([]);
    const [productGamecreditDetails, setGamecreditProductDetails] = useState([]);
    const [allPrductsDetails, setAllProductDetails] = useState([]);
    const [transactionHash, setTransactionHash] = useState('');
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
        fetchCartProducts(setAllProductDetails, setGameProductDetails, setGiftcardProductDetails, setGamecreditProductDetails, setLoadingProducts);
        
        
    }, []);
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
                  return { ...product};
              }
              return product;
          });
      });
    };

    // console.log(transactionHash);
    const productSubtotalSum = allPrductsDetails.map(subTotal => subTotal.totalPrice).reduce((acc, cur) => acc + cur, 0);
    const agTaxFee = (3/100);
    const agProductCharge = (4.5/100);
    const checkoutOverallTotal = productSubtotalSum + (agProductCharge*productSubtotalSum) + (agTaxFee*productSubtotalSum);
    
    const agProductPointsSum = allPrductsDetails.map(subTotal => subTotal.totalPrice).reduce((acc, cur) => acc + cur, 0);
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
              // console.log('Product removed from the Cart Successfully');
              fetchCartProducts(setAllProductDetails, setGameProductDetails, setGiftcardProductDetails, setGamecreditProductDetails, setLoadingProducts);
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
                              <h5>$ {(details.stock === undefined) ? '--.--': details.effectivePrice.toFixed(2)}</h5>
                                  <input type="number" min={1} max={details.stockCount} value={orderQuantities[details.ag_product_id] || 1} onChange={(e) => handleQuantityChange(details.ag_product_id, Number(e.target.value))} placeholder='1'/>
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
                              <h5>$ {(details.stock === undefined) ? '--.--': details.effectivePrice.toFixed(2)}</h5>
                                  <input type="number" min={1} max={details.stockCount} value={orderQuantities[details.ag_product_id] || 1} onChange={(e) => handleQuantityChange(details.ag_product_id, Number(e.target.value))} placeholder='1'/>
                              </div>
                          </div>
                      ))}
                      {productGamecreditDetails.map((details, i) => (
                          <div className="cartpcm1clProduct website" key={i}>
                              <img src={`https://2wave.io/GiftCardCovers/${details.productData.gamecredit_cover}`} alt="" />
                              <button onClick={() => handleRemoveFromCart(details)}><FaTimes className='faIcons'/></button>
                              <div className="cartpcm1clpPlatform denomination">
                                  <h3>{details.productData.gamecredit_denomination}</h3>
                                  <p>DOLLARS</p>
                              </div>
                              <div className="cartpcm1clpPrice">
                              <h5>$ {(details.stock === undefined) ? '--.--': details.effectivePrice.toFixed(2)}</h5>
                                  <input type="number" min={1} max={details.stockCount} value={orderQuantities[details.ag_product_id] || 1} onChange={(e) => handleQuantityChange(details.ag_product_id, Number(e.target.value))} placeholder='1'/>
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
                                  <input type="number" min={1} max={details.stockCount} value={orderQuantities[details.ag_product_id] || 1} onChange={(e) => handleQuantityChange(details.ag_product_id, e.target.value)} placeholder='1'/>
                                  <h5>$ {(details.stock === undefined) ? '--.--': details.effectivePrice.toFixed(2)}</h5>
                              </div>
                          </div>
                      ))}
                      {productGiftcardDetails.map((details, i) => (
                          <div className="cartpcm1clProduct mobile" key={i}>
                              <button onClick={() => handleRemoveFromCart(details)}><FaTimes className='faIcons'/></button>
                              <h5>{details.productData.giftcard_name} - ${details.productData.giftcard_denomination}</h5>
                              <div className="cartpcm1clpPrice">
                                  <input type="number" min={1} max={details.stockCount} value={orderQuantities[details.ag_product_id] || 1} onChange={(e) => handleQuantityChange(details.ag_product_id, e.target.value)} placeholder='1'/>
                                  <h5>$ {(details.stock === undefined) ? '--.--': details.effectivePrice.toFixed(2)}</h5>
                              </div>
                          </div>
                      ))}
                      {productGamecreditDetails.map((details, i) => (
                          <div className="cartpcm1clProduct mobile" key={i}>
                              <button onClick={() => handleRemoveFromCart(details)}><FaTimes className='faIcons'/></button>
                              <h5>{details.productData.gamecredit_name} - ${details.productData.gamecredit_denomination}</h5>
                              <div className="cartpcm1clpPrice">
                                  <input type="number" min={1} max={details.stockCount} value={orderQuantities[details.ag_product_id] || 1} onChange={(e) => handleQuantityChange(details.ag_product_id, e.target.value)} placeholder='1'/>
                                  <h5>$ {(details.stock === undefined) ? '--.--': details.effectivePrice.toFixed(2)}</h5>
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
                      <div className="cartpcm1clProductEmpty mobile">
                          <h6>No Products Here</h6>
                      </div></>:<>
                      <div className="cartpcm1clProductEmpty mobile">
                          <h6>Loading Products Added</h6>
                      </div>
                  </>}
              </>
          );
      }
    };



    const [clientSecret, setClientSecret] = useState();
    const [paymentIntentid, setPaymentIntentID] = useState();
    const [successtransaction,setSuccesstransaction] = useState(false)

    const appearance = {
      theme: "night",
      labels: "floating",
    };
    const options = {
        clientSecret,
        appearance,
    };
    
    const checkOutprod = async () => {
        const body = {
          product: allPrductsDetails,
        };
        const bodyString = JSON.stringify(body)
        const headers = { "Content-type": "application/json" };

        try {
            const response = await fetch(
              "https://paranworld.com/create-check-out-session",
              {
                method: "POST",
                headers: headers,
                body: bodyString,
              }
            );

            const session = await response.json();
            setClientSecret(session.clientSecret);
            setPaymentIntentID(session.paymentIntentID)
        } catch (error) {
            console.log(error);
        }
    }
    
    
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


    if(successtransaction){
      window.document.body.style.overflow = 'hidden';
    } else{
      window.document.body.style.overflow = 'auto';
    }

    return (
      <div className="mainContainer cart">
        {successtransaction && (
          <div className="successTransaction">
            <div className="successTransactionContainer">
              <span><FaClipboardCheck /></span>
              <section>
                <h1>THANK YOU FOR PURCHASING.</h1>
                <p>Check your Profile for your Products.</p>
              </section>
            </div>
          </div>
        )}
        <section className="cartPageContainer top">
              <div className="cartpcTopProfile">
                <div className="cartpctProfile left">
                  {userLoggedData.profileimg ? (
                    <img
                      src={`https://2wave.io/ProfilePics/${userLoggedData.profileimg}`}
                      alt=""
                    />
                  ) : (
                    <img
                      src={require("../assets/imgs/ProfilePics/DefaultSilhouette.png")}
                      alt=""
                    />
                  )}
                </div>
                <div className="cartpctProfile right">
                  <h5>{userLoggedData.username}'s Cart</h5>
                  <p>Products you added to Cart</p>
                </div>
              </div>
        </section>
        {clientSecret ? 
          <>
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm setSuccesstransaction={setSuccesstransaction} allPrductsDetails={allPrductsDetails} paymentIntentId={paymentIntentid} setClientSecret={setClientSecret} totalprice={checkoutOverallTotal} transactionData={handleSubmitTransaction}/>
            </Elements>
          </>:<>
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
                              {details.stock === undefined
                                ? "--.--"
                                : details.stock === undefined
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
                              {details.stock === undefined
                                ? "--.--"
                                : details.stock === undefined
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
                              {details.stock === undefined
                                ? "--.--"
                                : details.stock === undefined
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
                        <p>TAX FEE</p>
                        <h6>3%</h6>
                      </span>
                      <span>
                        <p>OUR CHARGE</p>
                        <h6>4.5%</h6>
                      </span>
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
                      {/* <button onClick={checkOutprod}>CHECKOUT PRODUCTS</button> */}
                      <button onClick={checkOutprod} className={(allPrductsDetails.length === 0) ? 'noProducts' : 'hasProducts'} disabled={(allPrductsDetails.length === 0) ? true : false}>
                        {(allPrductsDetails.length === 0) ? 'EMPTY CART' : 'CHECKOUT PRODUCTS'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </> 
        }
      </div>
    );
}

export default Cart