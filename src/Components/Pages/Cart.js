import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom';
import "../CSS/cart.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
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
import CheckoutForm from "../Pages/checkoutform";
import { UserProfileData } from './UserProfileContext';
import { CartsFetchData } from './CartsFetchContext';
import { GamesFetchData } from './GamesFetchContext';
import { GiftcardsFetchData } from './GiftcardsFetchContext';
import { GamecreditsFetchData } from './GamecreditFetchContext';


const Cart = () => {
    const { 
      userLoggedData,
      fetchUserProductIds,
      rapidcentAcessToken,
    } = UserProfileData();
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
    const cartAdminState = localStorage.getItem('agAdminLoggedIn');
    const navigate = useNavigate();
    const AGUserRemoveToCartAPI = process.env.REACT_APP_AG_REMOVE_USER_CART_API;
    const AGUserProductTransferAPI = process.env.REACT_APP_AG_TRANSFER_PRODUCTS_API;
    const AGUserTransactionHistoryAPI = process.env.REACT_APP_AG_TRANSACTION_HISTORY_API;

    const [allProductDetails, setAllProductDetails] = useState([]);
    const [giftcardProductDetails, setGiftcardProductDetails] = useState([]);
    const [gamecreditProductDetails, setGamecreditProductDetails] = useState([]);
    const [gameProductDetails, setGameProductDetails] = useState([]);

    const [cartTotalPayment, setCartTotalPayment] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [checkoutTotal, setCheckoutTotal] = useState(0);
    const [agPoints, setAGPoints] = useState(0);
    const [productSubtotalSum, setProductSubtotalSum] = useState(0);

    const [transactionHash, setTransactionHash] = useState('');
    const [orderQuantities, setOrderQuantities] = useState({});

    const [finalCheckout,setFinalcheckout] = useState(false)
    const calculateEffectivePrice = (price, discount) => price - (price * discount) / 100;

    const mapProductsWithData = (products, dataset, key, getPrice) =>
      products.map((product) => {
        const productData = dataset.find((item) => item[key] === product.ag_product_id);
        const effectivePrice = getPrice(productData);
        const numberOfOrder = orderQuantities[product.ag_product_id] || 1;
        const totalPrice = effectivePrice * numberOfOrder;
        return { ...product, productData, effectivePrice, totalPrice, numberOfOrder };
    });
  
    const fetchCartProducts = useCallback(() => {
      setLoadingProducts(true);
  
      try {
        const cartGameWithData = mapProductsWithData(
          gameProducts,
          viewAGData1,
          'game_canonical',
          (data) => calculateEffectivePrice(data.stock.ag_product_price, data.stock.ag_product_discount)
        );
  
        const cartGiftcardWithData = mapProductsWithData(
          giftcardProducts,
          giftcards,
          'giftcard_id',
          (data) => calculateEffectivePrice(data.giftcard_denomination, 0)
        );
  
        const cartGamecreditWithData = mapProductsWithData(
          gamecreditProducts,
          gamecredits,
          'gamecredit_id',
          (data) => calculateEffectivePrice(data.gamecredit_denomination, 0)
        );
  
        const combinedAllData = [
          ...cartGameWithData,
          ...cartGiftcardWithData,
          ...cartGamecreditWithData,
        ];
  
        setAllProductDetails(combinedAllData);
        setGiftcardProductDetails(cartGiftcardWithData);
        setGamecreditProductDetails(cartGamecreditWithData);
        setGameProductDetails(cartGameWithData);

        setCartTotalPayment(combinedAllData);
        // Calculate subtotal, fees, and points
        const subtotal = combinedAllData
          .map((subTotal) => subTotal.totalPrice)
          .reduce((acc, cur) => acc + cur, 0);

        const transactionFeeRate = 7.5 / 100;
        const agTaxFee = 2.5 / 100;
        const agProductCharge = 3.5 / 100;

        const transactionFee = subtotal * (agTaxFee + agProductCharge);
        const checkoutOverallTotal = subtotal + transactionFee;

        const agProductPoints = subtotal / 10;

        // Update state with calculated totals
        setProductSubtotalSum(subtotal);
        setCheckoutTotal(checkoutOverallTotal);
        setAGPoints(agProductPoints);
      } catch (error) {
        console.error('Error fetching cart products:', error);
      } finally {
        setLoadingProducts(false);
      }
    }, [gameProducts, giftcardProducts, gamecreditProducts, viewAGData1, giftcards, gamecredits]);
  
    useEffect(() => {
      fetchCartProducts(); // Fetch products on component mount.
  
      // Optionally, use polling only if necessary.
      const interval = setInterval(() => {
        fetchCartProducts();
        fetchUserCart(productCart);
      }, 5000);
      return () => clearInterval(interval); // Cleanup on unmount.
    }, [fetchCartProducts, fetchUserCart, productCart]);









    useEffect(() => {
      const interval = setInterval(() => {
        if (allProductDetails) {
          const date = new Date();
          const dateString = date.toLocaleDateString();
          const timeString = date.toLocaleTimeString();
          const combinedString = `${allProductDetails}${dateString}${timeString}`;
          const hashValue = CryptoJS.SHA256(combinedString).toString(CryptoJS.enc.Hex);
          const agTransactionHash = `AG_${hashValue.slice(0, 18)}`;
          setTransactionHash(agTransactionHash);
        } else {
          setTransactionHash('');
        }
      }, 1000); // Update hash every second
  
      return () => clearInterval(interval);
    }, [allProductDetails]);
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
      setCartTotalPayment(allProductDetails);
    };
    const handleRemoveFromCart = (details) => {
      const removeDetails = {
        user: userLoggedData.userid,
        cart: details.ag_product_id,
      };
      const removeToCartJSON = JSON.stringify(removeDetails);
    
      axios({
        method: 'delete',
        url: AGUserRemoveToCartAPI,
        data: removeToCartJSON,
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.data.success) {
            // Update the cart state locally to remove the product
            setAllProductDetails((prevDetails) =>
              prevDetails.filter((product) => product.ag_product_id !== details.ag_product_id)
            );
            setCartTotalPayment((prevCart) =>
              prevCart.filter((product) => product.ag_product_id !== details.ag_product_id)
            );
    
            // Fetch the latest cart data to sync with the backend
            fetchUserCart(productCart);
            navigate('/MyCart');
          } else {
            console.log(`Error: ${response.data.message}`);
          }
        })
        .catch((error) => {
          console.log(`Error: ${error.message}`);
        });
    };
    const renderCartProducts = () => {
      return (
        <>
          {(allProductDetails.length != 0) ? 
            <>
                {gameProductDetails.map((details, i) => (
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
                {giftcardProductDetails.map((details, i) => (
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
                {gamecreditProductDetails.map((details, i) => (
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
          {(allProductDetails.length != 0) ? 
            <>
              {gameProductDetails.map((details, i) => (
                  <div className="cartpcm1clProduct mobile" key={i}>
                      <button onClick={() => handleRemoveFromCart(details)}><FaTimes className='faIcons'/></button>
                      <h5>{details.productData.game_title} - {details.productData.game_platform}</h5>
                      <div className="cartpcm1clpPrice">
                        <input type="number" min={1} max={details.productData.stockCount} value={orderQuantities[details.ag_product_id] || 1} onChange={(e) => handleQuantityChange(details.ag_product_id, e.target.value)} placeholder='1'/>
                        <h5>$ {(details.productData.stock === 0 || details.productData.stock === undefined) ? '--.--': details.effectivePrice.toFixed(2)}</h5>
                      </div>
                  </div>
              ))}
              {giftcardProductDetails.map((details, i) => (
                  <div className="cartpcm1clProduct mobile" key={i}>
                      <button onClick={() => handleRemoveFromCart(details)}><FaTimes className='faIcons'/></button>
                      <h5>{details.productData.giftcard_name} - ${details.productData.giftcard_denomination}</h5>
                      <div className="cartpcm1clpPrice">
                          <input type="number" min={1} max={details.stockCount} value={orderQuantities[details.ag_product_id] || 1} onChange={(e) => handleQuantityChange(details.ag_product_id, e.target.value)} placeholder='1'/>
                          <h5>$ {(details.productData.stock === 0 || undefined) ? '--.--': details.effectivePrice.toFixed(2)}</h5>
                      </div>
                  </div>
              ))}
              {gamecreditProductDetails.map((details, i) => (
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

    

  

  


    
    const handleSubmitTransaction = async () => {
      if (!userLoggedData.userid) {
        console.log('Owner field is required.');
        return;
      }
      const specificProductIds = [];
      const numberOfRows = [];
      allProductDetails.forEach(product => {
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

      const agProductNames = allProductDetails.map(products => products.ag_product_name);
      const agProductID = allProductDetails.map(products => products.ag_product_id);
      const agProductQuantity = allProductDetails.map(products => products.numberOfOrder);
      const agProductPrice = allProductDetails.map(products => products.effectivePrice);
      const agProductPurchasedDate = new Date();
      const agProductTransactionHash = transactionHash;
      const agOverallAGPoints = agPoints;


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
              fetchUserProductIds()
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


    const continueCheckout = () => {
      setFinalcheckout(true)
    }

    return (
      <div className="mainContainer cart">
        {finalCheckout ? 
          <>
            <CheckoutForm setFinalcheckout={setFinalcheckout} cartTotalPayment={cartTotalPayment} allProductDetails={allProductDetails} totalprice={checkoutTotal} handleSubmitTransaction={handleSubmitTransaction}/>
          </>:
          <>
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
                      {gameProductDetails.map((details, i) => (
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
                      ))}
                      <br />
                      <h6>
                        <TbGiftCard className="faIcons" /> GIFTCARDS
                      </h6>
                      {giftcardProductDetails.map((details, i) => (
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
                      ))}
                      <br />
                      <h6>
                        <TbDiamond className="faIcons" /> GAME CREDITS
                      </h6>
                      {gamecreditProductDetails.map((details, i) => (
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
                      ))}
                    </div>
                    <div className="cartpcm1crCheckout">
                    <span>
                      <p>SUBTOTAL</p>
                      <h6>$ {productSubtotalSum.toFixed(2)}</h6>
                    </span>
                    <span>
                      <p>TRANSACTION FEE</p>
                      <h6>6%</h6>
                    </span>
                    <hr />
                    <span>
                      <p>AG POINTS</p>
                      <h6>
                        {agPoints.toFixed(2)} <FaBolt className="faIcons" />
                      </h6>
                    </span>
                    <span>
                      <p>PAYABLE</p>
                      <h6>$ {checkoutTotal.toFixed(2)}</h6>
                    </span>
                      <button onClick={continueCheckout} className={(cartTotalPayment.length === 0) ? 'noProducts' : 'hasProducts'} disabled={(cartTotalPayment.length === 0) ? true : false}>
                        {(cartTotalPayment.length === 0) ? 'EMPTY CART' : 'CHECKOUT PRODUCTS'}
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