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
  MdShield,
  MdOutlinePayment,
  MdOutlineReportGmailerrorred  
} from "react-icons/md";
import { UserProfileData } from './UserProfileContext';

const CheckoutForm = ({cartTotalPayment, allPrductsDetails, setSuccesstransaction, paymentIntentId, setClientSecret, totalprice, handleSubmitTransaction, setFinalcheckout}) => {
  const navigate = useNavigate();
  const { 
    userLoggedData,
    rapidcentAcessToken
  } = UserProfileData();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successTransfer,setSuccessTransfer] = useState(false)

  const [checkOutprod,setCheckoutprod] = useState(cartTotalPayment)

  const [loader,setLoader] = useState(true)
  const [gameData,setGamedata] = useState()
  const [giftCardData,setGiftCardData] = useState()
  const [gameCreditsdData,setGameCreditsdata] = useState()
  const [getUserDeviceIP, setGetUserDeviceIP] = useState('')

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
  useEffect(() => {
    const fetchIP = async () => {
      try {
        const response = await axios.get('https://api.ipify.org?format=json');
        setGetUserDeviceIP(response.data.ip);
      } catch (error) {
        console.error('Error fetching the IP address:', error);
      }
    };
    fetchIP();
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


  
  

  const getInitialize3DSData = () => {
    const data = localStorage.getItem('initialiaze3DSData');
    return data ? JSON.parse(data) : null; // Return parsed data or null if not found
  };
  const getAuthenticate3DSData = () => {
    const data = localStorage.getItem('authenticate3DSData');
    return data ? JSON.parse(data) : null; // Return parsed data or null if not found
  };
  const getCustomerCreateDetails = () => {
    const data = localStorage.getItem('newCustomerID');
    return data ? JSON.parse(data) : null; // Return parsed data or null if not found
  };
  const BusinessID = process.env.REACT_APP_RAPIDCENT_BUSINESS_ID;
  const BearerToken = rapidcentAcessToken.access_token
  const amount = totalprice.toFixed(2);
  const customerEmail = userLoggedData.email
  const [threeDSData, setThreeDSData] = useState({});
  const [threeDSServerTransID, setThreeDSServerTransID] = useState('');
  const [paymentProcessingModal, setPaymentProcessingModal] = useState(false);
  const [paymentErrorModal, setPaymentErrorModal] = useState(false);
  const [paymentSecureModal, setPaymentSecureModal] = useState(false);
  const [paymentReciept, setPaymentReceipt] = useState(false);
  const [paymentProcessingResponse, setPaymentProcessingResponse] = useState('');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    month: '',
    year: '',
    cvv: '',
    postal: '',
    firstName: '',
    lastName: '',
  });
  
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
    const { cardNumber, month, year, firstName, lastName, cvv } = cardData;
  
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
    if (!firstName) {
      alert('First name is required.');
      return false;
    }
    if (!lastName) {
      alert('Last name is required.');
      return false;
    }
    if (!cvv || cvv.length !== 3) {
      alert('CVV must be 3 digits.');
      return false;
    }
  
    return true;
  };



  // Export Customers from Rapidcent
  const exportCustomerData = async () => {
    setPaymentProcessingModal(true);
    setPaymentProcessingResponse('Checking Account Record');

    const dateParam = {
      fromDate: 10-17-2024,
      toDate: 10-18-2030,
    }

    const options = {
      method: 'GET',
      url: 'https://uatstage00-api.rapidcents.com/api/90662b5d-4f38-4183-9522-e97f8866affa/customers/export',
      params: {dateParam},
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${BearerToken}`, // Include Bearer token
      },
    };

    try {
      const data = await axios.request(options);
      const customersList = data?.customers || data?.data?.customers;
      const getAccountFromList = customersList.filter(email => email.email === customerEmail)
      const getLatestAccount = getAccountFromList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

      if(getLatestAccount){
        const storeCustomerID = JSON.stringify(getLatestAccount);
        localStorage.setItem('newCustomerID', storeCustomerID);
        setPaymentProcessingResponse('Account Existing on Rapidcent');
        initialize3DSecure();
      }else{
        createCustomerDetails()
      }

    } catch (error) {
      setPaymentProcessingModal(false)
      setPaymentErrorModal(true)
      setPaymentProcessingResponse('Error Fetching Rapidcent Accounts');

      const timeoutId = setTimeout(() => {
        setPaymentErrorModal(false)
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  };


  // Rapidcent Create Customer
  const createCustomerDetails = async () => {
    setPaymentProcessingResponse('Creating Account on Rapidcent');


    try {
      const customerDetails = {
        firstName: `${cardData.firstName}`,
        lastName: `${cardData.lastName}`,
        email: `${customerEmail}`,
      };
      const response = await axios.post(
        'https://uatstage00-api.rapidcents.com/api/90662b5d-4f38-4183-9522-e97f8866affa/customers',
        JSON.stringify(customerDetails), // Send payload as raw JSON string
        {
          headers: {
            'Accept': 'application/json', // Add Accept header
            'Content-Type': 'application/json', // Ensure content type is JSON
            'Authorization': `Bearer ${BearerToken}`, // Authorization header
          },
        }
      );

      const data = response.data;
      const storeCustomerID = JSON.stringify(data);
      localStorage.setItem('newCustomerID', storeCustomerID);
      setPaymentProcessingResponse('Rapidcent Account Created');

      if(data){
        initialize3DSecure();
      }
    } catch (error) {
      setPaymentProcessingModal(false)
      setPaymentErrorModal(true)
      setPaymentProcessingResponse('Error Creating Rapidcent Account');

      const timeoutId = setTimeout(() => {
        setPaymentErrorModal(false)
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  };


  // Rapidcent 3DS setup Logic
  // Step 1: Add event listener for 3D secure server response
  useEffect(() => {
    const handle3DSServerResponse = (event) => {
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
    setPaymentProcessingResponse('Initializing Rapidcent 3DSecure');
    const newCustomerData = getCustomerCreateDetails();
    const newCustomerID = newCustomerData?.id || newCustomerData?.data?.id;


    try {
      const payload = {
        customerId: `${newCustomerID}`,
        cardData: { 
          cardNumber: `${cardData.cardNumber}`,
          cvv: `${cardData.cvv}`,
          year: cardData.year,
          month: cardData.month,
          nameOnCard: `${cardData.firstName} ${cardData.lastName}`
        }
      };
  
      const response = await axios.post(
        'https://uatstage00-api.rapidcents.com/api/ddd/init',
        JSON.stringify(payload), // Send payload as raw JSON string
        {
          headers: {
            'Accept': 'application/json', // Add Accept header
            'Content-Type': 'application/json', // Ensure content type is JSON
          },
        }
      );
      const data = response.data;
      const initialiaze3DSData = JSON.stringify(data);
      localStorage.setItem('initialiaze3DSData', initialiaze3DSData);

      setThreeDSData(data);

      if (data.status === 'DDD_FRICTIONLESS') {
        dddAuthenticate(); // Skip step 2 and proceed to authentication
        setPaymentProcessingResponse('Proceeding to Authentication');
      } 
      
      if (data.status === 'DDD_INVOKE') {
        invoke3DSServer(); // Proceed to step 2
        setPaymentProcessingResponse('Sending Records to 3DSecure');
      } else {
        setPaymentProcessingModal(false)
        setPaymentErrorModal(true)
        setPaymentProcessingResponse('3D Secure Error, Please Try Again.');

        const timeoutId = setTimeout(() => {
          setPaymentErrorModal(false)
        }, 5000);
        return () => clearTimeout(timeoutId);
      }
    } catch (error) {
      setPaymentProcessingModal(false)
      setPaymentErrorModal(true)
      setPaymentProcessingResponse('3DSecure is not supported for this card');

      const timeoutId = setTimeout(() => {
        setPaymentErrorModal(false)
      }, 5000);
      return () => clearTimeout(timeoutId);
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

      setPaymentProcessingResponse('Proceeding to Authentication');
      dddAuthenticate();
    } catch (error) {
      setPaymentProcessingModal(false)
      setPaymentErrorModal(true)
      setPaymentProcessingResponse('3D secure card verification failed. Please try a different card.');

      const timeoutId = setTimeout(() => {
        setPaymentErrorModal(false)
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  };
  // Step 3: Authenticate the transaction
  const dddAuthenticate = async () => {    
    const data = getInitialize3DSData();
    const sessionID = data?.sessionID || data?.data?.sessionID;
    const threeDSServerTransID = data?.threeDSServerTransID || data?.data?.threeDSServerTransID;
    
    try {
      const payload2 = {
        threeDSServerTransID: threeDSServerTransID,
        cardData: { 
          cardNumber: `${cardData.cardNumber}`,
          cvv: `${cardData.cvv}`,
          year: cardData.year,
          month: cardData.month,
          nameOnCard: `${cardData.firstName} ${cardData.lastName}`,
          saveCard: 'false'
        },
        amount: amount,
        sessionID: sessionID,
        email: `${customerEmail}`
      };

      const response = await axios.post(
        'https://uatstage00-api.rapidcents.com/api/ddd/authenticate',
        JSON.stringify(payload2), // Send payload as raw JSON string
        {
          headers: {
            Accept: 'application/json', // Add Accept header
            'Content-Type': 'application/json', // Ensure content type is JSON
          },
        }
      );

      const data = response.data;
      const authenticate3DSData = JSON.stringify(data);
      localStorage.setItem('authenticate3DSData', authenticate3DSData);
      if (data.status === 'C') {
        initiateChallenge(data); // Proceed to step 4
      } else if (['Y', 'A'].includes(data.status)) {
        setPaymentProcessingResponse('3DSecure Authentication Complete');
        initiateTransaction(data); // Proceed to step 5
      } else {
        setPaymentProcessingModal(false)
        setPaymentErrorModal(true)
        setPaymentProcessingResponse('Authentication failed. Transaction blocked.');      
        
        const timeoutId = setTimeout(() => {
          setPaymentErrorModal(false)
        }, 5000);
        return () => clearTimeout(timeoutId);
      }
    } catch (error) {
      setPaymentProcessingModal(false)
      setPaymentErrorModal(true)
      setPaymentProcessingResponse('3DSecure Verification failed. Please try a different card.');

      const timeoutId = setTimeout(() => {
        setPaymentErrorModal(false)
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  };
  // Step 4: Handle Challenge
  const initiateChallenge = (data) => {
    setPaymentProcessingResponse('3DSecure Authenticating');

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
      setPaymentProcessingResponse('3DSecure Authentication Complete');
      initiateTransaction();
    } catch (error) {
      setPaymentProcessingModal(false)
      setPaymentErrorModal(true)
      setPaymentProcessingResponse('3DSecure Verification failed. Please try a different card.');

      const timeoutId = setTimeout(() => {
        setPaymentErrorModal(false)
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  };
  // Step 5: Proceed with transaction
  const initiateTransaction = () => {
    const customerInfo = getCustomerCreateDetails();
    const init3DSData = getInitialize3DSData();
    const auth3DSData = getAuthenticate3DSData();

    setPaymentProcessingResponse('3DSecure Verification Complete');
    paymentTransfer();
  };


  // Send Payment to Rapidcent
  const paymentTransfer = async () => {
    setPaymentProcessingResponse('Processing Payment');

    const newCustomerData = getCustomerCreateDetails();
    const newCustomerID = newCustomerData?.id || newCustomerData?.data?.id;

    const init3DSData = getInitialize3DSData();
    const association = init3DSData?.association || init3DSData?.data?.association;
    const sessionID = init3DSData?.sessionID || init3DSData?.data?.sessionID;
    const threeDSMethodData = init3DSData?.threeDSMethodData || init3DSData?.data?.threeDSMethodData;
    const threeDSMethodURL = init3DSData?.threeDSMethodURL || init3DSData?.data?.threeDSMethodURL;
    const threeDSServerTransID = init3DSData?.threeDSServerTransID || init3DSData?.data?.threeDSServerTransID;

    const auth3DSData = getAuthenticate3DSData();
    const status = auth3DSData?.status || auth3DSData?.data?.status;
    const eci = auth3DSData?.eci || auth3DSData?.data?.eci;
    const acsURL = auth3DSData?.acsURL || auth3DSData?.data?.acsURL;
    const creq = auth3DSData?.creq || auth3DSData?.data?.creq;
    const dsTransID = auth3DSData?.dsTransID || auth3DSData?.data?.dsTransID;
    const threeDSSessionData = auth3DSData?.threeDSSessionData || auth3DSData?.data?.threeDSSessionData;
    const authenticationValue = auth3DSData?.authenticationValue || auth3DSData?.data?.authenticationValue;
    const version = auth3DSData?.version || auth3DSData?.data?.version;


    try {
      const paymentData = {
        invoice_id: "No Invoice",
        amount: amount,
        cardData: { 
          cardNumber: `${cardData.cardNumber}`,
          cvv: `${cardData.cvv}`,
          year: cardData.year,
          month: cardData.month,
          nameOnCard: `${cardData.firstName} ${cardData.lastName}`
        },
        address: {
          postalCode: `${cardData.postal}`
        },
        customerId: `${newCustomerID}`,
        vt: false,
        ip_address: `${getUserDeviceIP}`,
        user_agent: `${cardData.firstName} ${cardData.lastName}`,
        ddd: {
          threeDSMethodURL: `${threeDSMethodURL}`,
          threeDSMethodData: `${threeDSMethodData}`,
          acsUrl: `${acsURL}`,
          creq: `${creq}`,
          dsTransID: `${dsTransID}`,
          threeDSServerTransID: `${threeDSServerTransID}`,
          transStatus: `${status}`,
          authenticationValue: `${authenticationValue}`,
          eci: `${eci}`,
          version: `${version}`,
          association: `${association}`
        },
        dddSessionID: `${sessionID}`
      };
  
      const response = await axios.post(
        'https://uatstage00-api.rapidcents.com/api/90662b5d-4f38-4183-9522-e97f8866affa/sale',
        JSON.stringify(paymentData), // Send payload as raw JSON string
        {
          headers: {
            'Accept': 'application/json', // Add Accept header
            'Content-Type': 'application/json', // Ensure content type is JSON
            'Authorization': `Bearer ${BearerToken}`, // Add Bearer Token
          },
        }
      );


      const data = response.data;
      if(data.status === "Approved"){
        setPaymentProcessingResponse('Your Payment Sent!');
        setPaymentReceipt(true);
        handleSubmitTransaction();
  
        
        const timeoutId = setTimeout(() => {
          setPaymentProcessingModal(false)
          navigate('/MyProfile')
        }, 5000);
        return () => clearTimeout(timeoutId);
      }

      if(data.status === "Declined"){
        setPaymentProcessingModal(false)
        setPaymentErrorModal(true)
        setPaymentProcessingResponse('Your Payment Declined');
        
        const timeoutId = setTimeout(() => {
          setPaymentErrorModal(false)
        }, 5000);
        return () => clearTimeout(timeoutId);
      }

      if(data.message === "Unauthenticated"){
        setPaymentProcessingModal(false)
        setPaymentErrorModal(true)
        setPaymentProcessingResponse('Payment Error Occur: "Unauthenticated"');
        
        const timeoutId = setTimeout(() => {
          setPaymentErrorModal(false)
        }, 5000);
        return () => clearTimeout(timeoutId);
      }

    } catch (error) {
      setPaymentProcessingModal(false)
      setPaymentErrorModal(true)
      setPaymentProcessingResponse('Payment Error Occur: Rapidcent Error.');
      
      const timeoutId = setTimeout(() => {
        setPaymentErrorModal(false)
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
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
      exportCustomerData();
    }
  };
  
  return (
    <div className="formpayment">
      <iframe id="myIframe" style={{display:'none'}}></iframe>
      {paymentProcessingModal && <div className="paymentStatusModalContainer">
        <div className="paymentStatusModalContents">
          <div>
            <h3><MdOutlinePayment className="faIcons"/></h3>
            <h6>{paymentProcessingResponse}</h6>
          </div>
        </div>
      </div>}
      {paymentErrorModal && <div className="paymentStatusModalContainer">
        <div className="paymentStatusModalContents">
          <div>
            <h3 id="paymentError"><MdOutlineReportGmailerrorred className="faIcons"/></h3>
            <h6>{paymentProcessingResponse}</h6>
          </div>
        </div>
      </div>}
      <div className="formdataContainer">
        <div className="formdataContents">
          {loader ? <>
            <div className="loadingCartCheckout">
              <div>
                <h3><MdOutlinePayment className="faIcons"/></h3>
                <h6>Summarizing For Payment</h6>
              </div>
            </div>
          </>:<>
            <div className="productCheckout">
              <div className="productCheckoutContents">
                <ul>
                {gameData&&(
                  <>
                    {gameData.map((product, i) => {
                      const productData = product.productData;
                      const productDataEntries = Object.entries(productData);
                      return (
                      <li key={i} style={{background: `linear-gradient(360deg, rgb(0, 0, 0) 0%, rgba(255, 255, 255, 0) 100%) 0% 0% / cover, url('https://2wave.io/GameCovers/${productDataEntries[3][1]}') center center no-repeat`, backgroundSize: 'cover'}}>
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
                    {giftCardData.map((product, i) => {
                      const productData = product.productData;
                      const productDataEntries = Object.entries(productData);
                      return (
                      <li key={i} style={{background: `linear-gradient(360deg, rgb(0, 0, 0) 0%, rgba(255, 255, 255, 0) 100%) 0% 0% / cover, url('https://2wave.io/GiftCardCovers/${productDataEntries[5][1]}') center center no-repeat`, backgroundSize: 'cover'}}>
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
                    {gameCreditsdData.map((product, i) => {
                      const productData = product.productData;
                      const productDataEntries = Object.entries(productData);
                      return (
                      <li key={i} style={{background: `linear-gradient(360deg, rgb(0, 0, 0) 0%, rgba(255, 255, 255, 0) 100%) 0% 0% / cover, url('https://2wave.io/GameCreditCovers/${productDataEntries[5][1]}') center center no-repeat`, backgroundSize: 'cover'}}>
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
                      placeholder="0000 0000 0000 0000"
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
                      placeholder="00"
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
                      placeholder="24"
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
                      placeholder="000"
                      required
                    />
                  </div>
                  <div className="checkoutProductPostal">
                    <label><p>Postal Code:</p></label>
                    <input
                      type="text"
                      name="postal"
                      value={cardData.postal}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="checkoutProductName">
                    <label><p>Name on Card:</p></label>
                    <div>
                      <input
                        type="text"
                        name="firstName"
                        value={cardData.firstName}
                        onChange={handleInputChange}
                        placeholder="Firstname"
                        required
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={cardData.lastName}
                        onChange={handleInputChange}
                        placeholder="Surname"
                        required
                      />
                    </div>
                  </div>
                  <div className="checkoutProductDisclaimer">
                    <p>Transaction hosted by Rapidcent 3DSecure</p>
                  </div>

                  {!paymentReciept ? 
                    <button id="payCheckoutBtn" type="submit">Pay Now</button>:
                    <button id="payCheckoutBtn" type="button">Transaction Complete</button>
                  }
                </form>
              </div>
              {!paymentReciept ? 
                <button type="button" id="cancelCheckoutBtn" onClick={cancelCheckout}> Cancel Checkout </button>:
                <div className="checkoutProductSuccess">
                  <p>Hooray! Check your profile dashboard to view your purchased products, Enjoy!</p>
                </div>
              }
            </div>
          </>}
        </div>
      </div>
    </div>
  );
}

export default CheckoutForm