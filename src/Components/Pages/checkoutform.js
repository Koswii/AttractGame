import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
// stripe
// import {
//   PaymentElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
// css
import '../CSS/checkoutform.css'
// axios
import axios from "axios";
// icons
import { 
  TbDeviceGamepad2,
  TbGiftCard, 
  TbDiamond,   
} from "react-icons/tb";
import { 
  MdOutlinePayment 
} from "react-icons/md";
import PayPalButton from "./PayPalButton";
import { parse } from "qs";

const CheckoutForm = ({cartTotalPayment, allPrductsDetails,setSuccesstransaction,paymentIntentId,setClientSecret,totalprice,transactionData,setFinalcheckout}) => {
  const navigate = useNavigate();
  // const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successTransfer,setSuccessTransfer] = useState(false)

  const [checkOutprod,setCheckoutprod] = useState(cartTotalPayment)

  const [loader,setLoader] = useState(true)

  const [gameData,setGamedata] = useState()
  const [giftCardData,setGiftCardData] = useState()
  const [gameCreditsdData,setGameCreditsdata] = useState()

  useEffect(() => {
    if (cartTotalPayment !== undefined) {
      const filterdataGiftcard = cartTotalPayment.filter(item => item.ag_product_type === 'Giftcard')
      const filterdataGame = cartTotalPayment.filter(item => item.ag_product_type === 'Game')
      const filterdataGamecredits = cartTotalPayment.filter(item => item.ag_product_type === 'Game Credit')

      setGamedata(filterdataGame)
      setGiftCardData(filterdataGiftcard)
      setGameCreditsdata(filterdataGamecredits)
    }

    // if (!stripe) {
    //   return;
    // }

    // const clientSecret = new URLSearchParams(window.location.search).get(
    //   "payment_intent_client_secret"
    // );

    // if (!clientSecret) {
    //   return;
    // }

    // stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
    //   console.log(paymentIntent);
    //   switch (paymentIntent.status) {
    //     case "succeeded":
    //       setMessage("Payment succeed! Buy again?");
    //       break;
    //     case "processing":
    //       setMessage("Your payment is processing.");
    //       break;
    //     case "requires_payment_method":
    //       setMessage("Your payment was not successful, please try again.");
    //       break;
    //     default:
    //       setMessage("Something went wrong.");
    //       break;
    //   }
    // });
  }, []);

  // console.log(cartTotalPayment);

  const handleSubmitform = async (e) => {
    e.preventDefault();
    setSuccessTransfer(true);

    // if (!stripe || !elements) {
    //     // Stripe.js hasn't yet loaded.
    //     // Make sure to disable form submission until Stripe.js has loaded.
    //     return;
    // }

    // setIsLoading(true);


    // const [error] = await stripe.confirmPayment({
    //   elements,
    //   confirmParams: {
    //     // Return URL where the customer should be redirected after the PaymentIntent is confirmed.
    //     // return_url: 'https://example.com',
    //   },
    //     redirect: 'if_required'
    // })
    // .then(function(result) {
    //   if (result.paymentIntent === undefined) {
    //     console.log('error occured');
    //     setIsLoading(false);
    //     setMessage(result.error.message);
    //   } else if (result.paymentIntent.status === "succeeded") {
    //     setIsLoading(false);
    //     transactionData();
    //     setSuccesstransaction(true);
    //     setClientSecret();
    //     const navigatePage = navigate('/MyCart')
    //   } 
    // });


  };

  const cancelPayment = async (e) => {
    // e.preventDefault()
    // try {
    //   const cancelPaymentAPI = process.env.REACT_APP_AG_CHECKOUT_CANCEL
    //   const res = await axios.post(cancelPaymentAPI, { paymentIntentId });
    //   setClientSecret()
    // } catch (err) {
    //   console.log(err);
    // }
  }
  // const paymentElementOptions = {
  //   layout: "tabs",
  // };

  
  setTimeout(() => {
    setLoader(false)
  }, 2000);

  
  
  const orderIDGenerator = (length) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset.charAt(randomIndex);
    }
    return result;
  };


  const [openPayment, setOpenPayment] = useState(false)
  const [orderLink, setOrderLink] = useState('')

  const payUsingUSDT = async () => {
    const apiKey = 'ZC6GE5W-HBWMFWP-JADFWDE-XEEXAE8'; // Replace with your actual API key
    const url = 'https://api.nowpayments.io/v1/invoice';
    const orderID = orderIDGenerator(20)
    
    
    const data = {
        price_amount: totalprice,
        price_currency: 'usd',
        pay_currency: 'btc',
        ipn_callback_url: 'https://nowpayments.io',
        order_id: orderID,
        order_description: "Order History on Attractgame.com",
        ipn_callback_url: "https://nowpayments.io",
        success_url: "https://nowpayments.io",
        cancel_url: "https://nowpayments.io"
    };

    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (result && result.invoice_url) {
        setOpenPayment(true);
        const invoiceUrl = result.invoice_url;
        const updatedUrl = invoiceUrl.startsWith('http://')
          ? invoiceUrl.replace('http://', 'https://')
          : invoiceUrl;
        setOrderLink(updatedUrl);
      }
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  const closeNopay = () => {
    setOpenPayment(false)
  }

  const cancelCheckout = () => {
    setFinalcheckout(false)
  }
  
  return (
    <div className="formpayment">
      {openPayment&&(
        <div className="payment-crypto">
          <iframe src={`${orderLink}`} frameborder="0"></iframe>
          <button onClick={closeNopay}>x</button>
        </div>
      )}
      <div className="formdataContainer">
        <div className="formdataContents">
          {loader ? <>
            <div className="loadingCartCheckout">
              <div>
                <h3><MdOutlinePayment className="faIcons"/></h3>
                <h6>Processing For Payment</h6>
              </div>
            </div>
          </>:<>
            <div className="productCheckout">
              <div className="productCheckoutContents">
                <ul>
                {gameData&&(
                  <>
                    {gameData.map(product => {
                      const productData = product.productData;
                      const productDataEntries = Object.entries(productData);
                      return (
                      <li style={{background: `linear-gradient(360deg, rgb(0, 0, 0) 0%, rgba(255, 255, 255, 0) 100%) 0% 0% / cover, url('https://2wave.io/GameCovers/${productDataEntries[3][1]}') center center no-repeat`, backgroundSize: 'cover'}}>
                        <div className="copDenomination">
                          <img src="" platform={productDataEntries[11][1]} alt="" />
                        </div>
                        <div className="copProductDetails">
                          <span>
                            <h5>{productDataEntries[4][1]}</h5>
                            <h6>{productDataEntries[6][1]}</h6>
                          </span>
                        </div>
                        <section>
                          <p>${product.effectivePrice}</p>
                          <p>x {product.numberOfOrder === 0 || undefined ? 1 : product.numberOfOrder} pc/s</p>
                        </section>
                      </li>
                      )
                    })}
                  </>
                )}
                {giftCardData&&(
                  <>
                    {giftCardData.map(product => {
                      const productData = product.productData;
                      const productDataEntries = Object.entries(productData);
                      return (
                      <li style={{background: `linear-gradient(360deg, rgb(0, 0, 0) 0%, rgba(255, 255, 255, 0) 100%) 0% 0% / cover, url('https://2wave.io/GiftCardCovers/${productDataEntries[5][1]}') center center no-repeat`, backgroundSize: 'cover'}}>
                        <div className="copDenomination">
                          <span>
                            <h5>{productDataEntries[6][1]}</h5>
                            <p>DOLLARS</p>
                          </span>
                        </div>
                        <div className="copProductDetails">
                          <span>
                            <h5>{productDataEntries[3][1]}</h5>
                          </span>
                        </div>
                        <section>
                          <p>${product.effectivePrice}</p>
                          <p>x {product.numberOfOrder === 0 || undefined ? 1 : product.numberOfOrder} pc/s</p>
                        </section>
                      </li>
                      )
                    })}
                  </>
                )}
                {gameCreditsdData&&(
                  <>
                    {gameCreditsdData.map(product => {
                      const productData = product.productData;
                      const productDataEntries = Object.entries(productData);
                      return (
                      <li style={{background: `linear-gradient(360deg, rgb(0, 0, 0) 0%, rgba(255, 255, 255, 0) 100%) 0% 0% / cover, url('https://2wave.io/GameCreditCovers/${productDataEntries[5][1]}') center center no-repeat`, backgroundSize: 'cover'}}>
                        <div className="copDenomination">
                          <span>
                            <h5><sup>$</sup>{productDataEntries[8][1]}</h5>
                            <p>CREDIT</p>
                          </span>
                        </div>
                        <div className="copProductDetails">
                          <span>
                            <h5>{productDataEntries[3][1]}</h5>
                          </span>
                        </div>
                        <section>
                          <p>${product.effectivePrice}</p>
                          <p>x {product.numberOfOrder === 0 || undefined ? 1 : product.numberOfOrder} pc/s</p>
                        </section>
                      </li>
                      )
                    })}
                  </>
                )}
                </ul>
              </div>
            </div>
            <div className="transactionPaymentInfo">
              <div className="checkoutProductsummary">
                <h5>PAYMENT CHECKOUT</h5>
                <ul>
                  {gameData&&(
                    <li>
                      <p><TbDeviceGamepad2 id="gsIcon"/>{gameData.length}</p>
                    </li>
                  )}
                  {giftCardData&&(
                    <li>
                      <p><TbGiftCard id="gsIcon"/>{giftCardData.length}</p>
                    </li>
                  )}
                  {gameCreditsdData&&(
                    <li>
                      <p><TbDiamond id="gsIcon"/>{gameCreditsdData.length}</p>
                    </li>
                  )}
                </ul>
                <div className="totalpriceDatasummary">
                  <p>Total Amount</p>
                  <h2>$ {totalprice.toFixed(2)}</h2>
                </div>
              </div>
              {/* <form id="payment-form" onSubmit={handleSubmitform}>
                <PaymentElement id="payment-element" options={paymentElementOptions} />
                <div className="paymentSetupBtn">
                  <button disabled={isLoading || !stripe || !elements} id="submit">
                    {isLoading ? <div className="loader" id="loader"></div> : <>{message === 'Payment succeeded! Buy again?' ? 'Buy Again' : 'Pay Now'}</>}
                  </button>
                  <button disabled={isLoading || !stripe || !elements} onClick={cancelPayment}>Cancel</button>
                </div>
                {message && <div id="payment-message"><p>{message}</p></div>}
                <p>Pay using:</p>
                <PayPalButton totalprice={totalprice} transactionData={transactionData} setClientSecret={setClientSecret} setSuccesstransaction={setSuccesstransaction}/>
              </form>
              <button className='PayUsingAG' disabled>
                <img src={require('../assets/imgs/PayAGGiftcard.png')} alt="" />
              </button>
              <button className='PayUsingAG' disabled>
                <img src={require('../assets/imgs/PayAGPoints.png')} alt="" />
              </button> */}
              {/* <button id="payCrypto" onClick={payUsingUSDT}>Pay Using USDT</button> */}
                <button id="cancelCheckoutBtn" onClick={cancelCheckout}> Cancel Checkout </button>
            </div>
          </>}
        </div>
      </div>
    </div>
  );
}

export default CheckoutForm