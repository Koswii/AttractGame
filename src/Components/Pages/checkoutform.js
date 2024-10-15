import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../CSS/checkoutform.css'
import axios from "axios";
import Swal from 'sweetalert2';
import { 
  TbDeviceGamepad2,
  TbGiftCard, 
  TbDiamond,   
} from "react-icons/tb";
import { 
  MdOutlinePayment 
} from "react-icons/md";
import { UserProfileData } from './UserProfileContext';

const CheckoutForm = ({cartTotalPayment, allPrductsDetails,setSuccesstransaction,paymentIntentId,setClientSecret,totalprice,transactionData,setFinalcheckout}) => {
  const navigate = useNavigate();
  const { 
      userLoggedData
  } = UserProfileData();
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


  const cancelCheckout = () => {
    setFinalcheckout(false)
  }
  

  const [cardData, setCardData] = useState({
    cardNumber: '',
    month: '',
    year: '',
    nameOnCard: '',
    cvv: '',
  });
  const amount = totalprice.toFixed(2);
  const customerEmail = userLoggedData.email
  const [threeDSData, setThreeDSData] = useState({});
  const [sessionID, setSessionID] = useState('');
  const [threeDSServerTransID, setThreeDSServerTransID] = useState('');

  // Handler to update cardData state
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setCardData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validate the card data (optional)
  const validateCardData = () => {
    const { cardNumber, month, year, nameOnCard, cvv } = cardData;

    if (!cardNumber || cardNumber.length !== 16) {
      alert('Card number must be 16 digits.');
      return false;
    }
    if (!month || month < 1 || month > 12) {
      alert('Month must be between 1 and 12.');
      return false;
    }
    if (!year || year < 24) {
      alert('Year must be 24 or later.');
      return false;
    }
    if (!nameOnCard) {
      alert('Name on card is required.');
      return false;
    }
    if (!cvv || cvv.length !== 3) {
      alert('CVV must be 3 digits.');
      return false;
    }

    return true;
  };

  // Step 1: Add event listener for 3D secure server response
  useEffect(() => {
    const handle3DSServerResponse = (event) => {
      console.log({ event });

      if (event.data?.param?.threeDSServerTransID) {
        setThreeDSServerTransID(event.data.param.threeDSServerTransID);
      }

      if (event.data.src === 'method_notify') {
        dddAuthenticate(); // Proceed to step 3
      }

      if (event.data.src === 'challenge_notify') {
        handleChallengeResponse(event);
      }
    };

    window.addEventListener('message', handle3DSServerResponse);
    return () => window.removeEventListener('message', handle3DSServerResponse);
  }, []);

  // Step 1: Send request to init API
  const initialize3DSecure = async () => {
    try {
      const response = await axios.post('https://engeenx.com/rapidcentDDDInitProxy.php', {
        cardData,
        customerEmail,
        paymentLinkID: null,
      });

      const data = response.data;
      console.log(data);
      
      setSessionID(data.sessionID);
      setThreeDSData(data);

      if (data.status === 'DDD_FRICTIONLESS') {
        dddAuthenticate(); // Skip step 2 and proceed to authentication
      } else if (data.status === 'DDD_INVOKE') {
        invoke3DSServer(); // Proceed to step 2
      } else {
        Swal.fire('3D Secure not supported by this card.');
      }
    } catch (error) {
      console.error('Init API Error:', error);
    }
  };

  // Step 2: Invoke 3D-Secure Server
  const invoke3DSServer = () => {
    try {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

      const form = iframeDoc.createElement('form');
      form.method = 'POST';
      form.action = threeDSData.threeDSMethodURL;

      const input = iframeDoc.createElement('input');
      input.type = 'hidden';
      input.name = 'threeDSMethodData';
      input.value = threeDSData.threeDSMethodData;

      form.appendChild(input);
      iframeDoc.body.appendChild(form);

      form.submit();
    } catch (error) {
      Swal.fire({
        text: '3D secure card verification failed. Please try a different card.',
        icon: 'error',
        confirmButtonText: 'Ok, got it!',
      }).then(() => window.location.reload());
    }
  };

  // Step 3: Authenticate the transaction
  const dddAuthenticate = async () => {
    try {
      const response = await axios.post('https://engeenx.com/rapidcentDDDAuthProxy.php', {
        threeDSServerTransID,
        cardData,
        amount,
        sessionID,
      });

      const data = response.data.data;
      if (data.status === 'C') {
        initiateChallenge(data); // Proceed to step 4
      } else if (['Y', 'A'].includes(data.status)) {
        initiateTransaction(data); // Proceed to step 5
      } else {
        Swal.fire('Authentication failed. Transaction blocked.');
      }
    } catch (error) {
      console.error('Authentication Error:', error);
    }
  };

  // Step 4: Handle Challenge
  const initiateChallenge = (data) => {
    try {
      const iframe = document.createElement('iframe');
      const backdrop = document.createElement('div');

      backdrop.id = 'backdrop';
      backdrop.className =
        'tw-absolute tw-inset-0 tw-bg-black tw-bg-opacity-75 tw-backdrop-blur';
      document.body.appendChild(backdrop);

      iframe.id = 'challengeIframe';
      iframe.className =
        'tw-absolute tw-z-10 tw-w-[60vw] tw-h-[60vh] tw-top-[50%] tw-left-[50%] tw--translate-x-1/2 tw--translate-y-1/2 tw-rounded-lg';
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentWindow.document;
      const form = iframeDoc.createElement('form');
      form.method = 'POST';
      form.action = data.acsURL;

      const input = iframeDoc.createElement('input');
      input.type = 'hidden';
      input.name = 'creq';
      input.value = data.creq;

      form.appendChild(input);
      iframeDoc.body.appendChild(form);

      form.submit();
    } catch (error) {
      Swal.fire({
        text: '3D secure card verification failed. Please try a different card.',
        icon: 'error',
        confirmButtonText: 'Ok, got it!',
      });
      console.error(error);
    }
  };

  // Step 5: Proceed with transaction
  const initiateTransaction = (data) => {
    console.log('Transaction Successful:', data);
    // Send the final transaction request to the server with necessary details
    Swal.fire('Transaction completed successfully!');
  };

  // Handle Challenge Response
  const handleChallengeResponse = (event) => {
    const { param } = event.data;
    if (param.transStatus === 'Y') {
      initiateTransaction(param);
    } else if (param.challengeCancel === '01') {
      window.location.reload();
    } else {
      disablePaymentLink();
    }
    document.getElementById('backdrop').remove();
    document.getElementById('challengeIframe').remove();
  };

  // Disable payment link (on failure)
  const disablePaymentLink = () => {
    Swal.fire('Payment link disabled. Please try again.');
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateCardData()) {
      console.log('Card Data:', cardData);
      initialize3DSecure();
      // Proceed to initialize 3D secure or send data to API
    }
  };
  
  return (
    <div className="formpayment">
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
                <form onSubmit={handleSubmit}>
                  <div className="checkoutProductCard">
                    <label><p>Card Number:</p></label>
                    <input
                      type="text"
                      name="cardNumber"
                      maxLength="16"
                      value={cardData.cardNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="checkoutProductMonth">
                    <label><p>Month:</p></label>
                    <input
                      type="number"
                      name="month"
                      min="1"
                      max="12"
                      value={cardData.month}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="checkoutProductYear">
                    <label><p>Year:</p></label>
                    <input
                      type="number"
                      name="year"
                      min="24"
                      value={cardData.year}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="checkoutProductCvv">
                    <label><p>CVV:</p></label>
                    <input
                      type="text"
                      name="cvv"
                      maxLength="3"
                      value={cardData.cvv}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="checkoutProductName">
                    <label><p>Name on Card:</p></label>
                    <input
                      type="text"
                      name="nameOnCard"
                      value={cardData.nameOnCard}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <button type="submit">Submit</button>
                </form>
              </div>
              <button type="button" id="cancelCheckoutBtn" onClick={cancelCheckout}> Cancel Checkout </button>
            </div>
          </>}
        </div>
      </div>
    </div>
  );
}

export default CheckoutForm