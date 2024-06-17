import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
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
import { 
  MdOutlinePayment 
} from "react-icons/md";

const CheckoutForm = ({allPrductsDetails,setSuccesstransaction,paymentIntentId,setClientSecret,totalprice,transactionData}) => {
  const navigate = useNavigate();
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
    setSuccessTransfer(true);

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
        return_url: navigate('/MyCart'),
      },
      redirect: 'if_required'
      }
    );

    if (!successTransfer && error && error.type === "validation_error") {
      console.log('data error');
    } else {
      transactionData();
      setSuccesstransaction(true);
      setClientSecret();
      // setTimeout(() => {
      //   window.location.href = 'http://localhost:3000/MyCart';
      // }, 3000);
    }

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
    }

    setIsLoading(false);
  };

  const cancelPayment = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('https://paranworld.com/cancel-payment-intent', { paymentIntentId });
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
          {loader ? <>
            <div className="loadingCartCheckout">
              <div>
                <h3><MdOutlinePayment className="faIcons"/></h3>
                <h6>Processing Your Payment</h6>
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
                          <p>{product.numberOfOrder === undefined ? 1 : product.numberOfOrder} pc/s</p>
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
                          <p>{product.numberOfOrder === undefined ? 1 : product.numberOfOrder} pc/s</p>
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
              <form id="payment-form" onSubmit={handleSubmitform}>
                <PaymentElement id="payment-element" options={paymentElementOptions} />
                <div className="paymentSetupBtn">
                  <button disabled={isLoading || !stripe || !elements} id="submit">
                    {isLoading ? <div className="loader" id="loader"></div> : <>{message === 'Payment succeeded! Buy again?' ? 'Buy Again' : 'Pay Now'}</>}
                  </button>
                  <button disabled={isLoading || !stripe || !elements} onClick={cancelPayment}>Cancel</button>
                </div>
                {message && <div id="payment-message"><p>{message}</p></div>}
              </form>
            </div>
          </>}
        </div>
      </div>
    </div>
  );
}

export default CheckoutForm