import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
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

const CheckoutForm = ({allPrductsDetails,setSuccesstransaction,paymentIntentId,setClientSecret,totalprice,transactionData}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successTransfer,setSuccessTransfer] = useState(false)

  const [checkOutprod,setCheckoutprod] = useState(allPrductsDetails)

  const [loader,setLoader] = useState(true)

  const [gameData,setGamedata] = useState()
  const [giftCardData,setGiftCardData] = useState()
  const [gameCreditsdData,setGameCreditsdata] = useState()

  useEffect(() => {
    if (checkOutprod !== undefined) {
      const filterdataGiftcard = checkOutprod.filter(item => item.ag_product_type === 'Giftcard')
      const filterdataGame = checkOutprod.filter(item => item.ag_product_type === 'Game')
      const filterdataGamecredits = checkOutprod.filter(item => item.ag_product_type === 'Game Credit')

      setGamedata(filterdataGame)
      setGiftCardData(filterdataGiftcard)
      setGameCreditsdata(filterdataGamecredits)
    }

    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      console.log(paymentIntent);
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded! Buy again?");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmitform = async (e) => {
    e.preventDefault();
    setSuccessTransfer(true)
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }



    
    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "http://localhost:3000/MyCart",
      },
      redirect: 'if_required'
      }
    );

    if (successTransfer === false && error.type === "validation_error") {
      console.log('data error');
    } else {
      transactionData()
      setSuccesstransaction(true)
      setClientSecret()
      setTimeout(() => {
        window.location.href = 'http://localhost:3000/MyCart'
      }, 3000);
    }


    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }
    // transactionData()
    setIsLoading(false);
  };

  const cancelPayment = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:4242/cancel-payment-intent', { paymentIntentId });
      console.log(res);
      setClientSecret()
    } catch (err) {
      console.log(err);
    }
  }
  const paymentElementOptions = {
    layout: "tabs",
  };
  


  
  setTimeout(() => {
    setLoader(false)
  }, 2000);
  return (
    <div className="formpayment">
      <div className="formdataContainer">
        <div className="formdataContents">
          {loader ? 
          <>
          <div className="loadingCartCheckout">
            <section>
              <h1>Loading Products...</h1>
            </section>
          </div>
          </> :
          <>
            <div className="productCheckout">
              <div className="productCheckoutContents">
                <h1>Your Orders</h1>
                <ul>
                {gameData&&(
                  <>
                    {gameData.map(product => {
                      const productData = product.productData;
                      const productDataEntries = Object.entries(productData);
                      return (
                      <li style={{background: `linear-gradient(360deg, rgb(0, 0, 0) 0%, rgba(255, 255, 255, 0) 100%) 0% 0% / cover, url('https://2wave.io/GameCovers/${productDataEntries[3][1]}') center center no-repeat`, backgroundSize: 'cover'}}>
                        <span>{productDataEntries[6][1]}</span>
                        <h1>{productDataEntries[4][1]}</h1>
                        <section>
                          <p>${product.effectivePrice}</p>
                          <p>{product.numberOfOrder === undefined ? 1 : product.numberOfOrder} pcs</p>
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
                        <h1>{productDataEntries[3][1]}</h1>
                        <section>
                          <p>${product.effectivePrice}</p>
                          <p>{product.numberOfOrder === undefined ? 1 : product.numberOfOrder} pcs</p>
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
                      <li style={{background: `linear-gradient(360deg, rgb(0, 0, 0) 0%, rgba(255, 255, 255, 0) 100%) 0% 0% / cover, url('https://2wave.io/GiftCardCovers/${productDataEntries[5][1]}') center center no-repeat`, backgroundSize: 'cover'}}>
                        <h1>{productDataEntries[3][1]}</h1>
                        <section>
                          <p>${product.effectivePrice}</p>
                          <p>{product.numberOfOrder === undefined ? 1 : product.numberOfOrder} pcs</p>
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
                <form id="payment-form" onSubmit={handleSubmitform}>
                  <PaymentElement id="payment-element" options={paymentElementOptions} />
                  <button disabled={isLoading || !stripe || !elements} id="submit">
                    <span id="button-text">
                      {isLoading ? <div className="spinner" id="spinner"></div> : <>{message === 'Payment succeeded! Buy again?'? 'Buy Again' : 'Pay Now'}</>}
                    </span>
                  </button>
                  {/* Show any error or success messages */}
                  {message && <div id="payment-message"><p>{message}</p></div>}
                </form>
                <div className="cancelPaymentTransaction">
                  <button disabled={isLoading || !stripe || !elements} onClick={cancelPayment}>Cancel</button>
                </div>
                <div className="checkoutProductsummary">
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
                    <p>Total Price</p>
                    <h2>$ {totalprice.toFixed(2)}</h2>
                  </div>
                </div>
            </div>
          </>}
        </div>
      </div>
    </div>
  );
}

export default CheckoutForm