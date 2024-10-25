import React, { useState, useEffect } from 'react'
import "./CSS/nav.css";
import { 
  FaBars, 
  FaTimes,
  FaRegUserCircle,
  FaRegEye,
  FaRegEyeSlash, 
} from 'react-icons/fa';
import { 
  MdSettings,
  MdAdminPanelSettings,
  MdOutlineSpaceDashboard,
  MdOutlineShoppingBag,
  MdNewspaper,
  MdOutlineStorefront,
  MdOutlineVideogameAsset,
  MdOutlineGamepad,
  MdOutlineCardGiftcard,
  MdCurrencyBitcoin,
  MdOutlinePostAdd   
} from "react-icons/md";
import { 
  TbUserSquareRounded,
  TbShoppingCartPlus,
  TbShoppingCartFilled,
  TbHeartFilled,
  TbShoppingCartBolt,
  TbCalendarEvent, 
  TbLogout,
  TbGiftCard,
  TbDeviceGamepad2,
  TbDiamond,
  TbTicket,
  TbNews,
  TbTimelineEvent     
} from "react-icons/tb";
import { 
  RiVerifiedBadgeFill,
  RiSparklingFill,
  RiImageEditLine,
  RiGamepadFill     
} from "react-icons/ri";
import { AiOutlineShop } from "react-icons/ai";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useActivePage } from './Pages/ActivePageContext';
import { UserProfileData } from './Pages/UserProfileContext';
import CatCaptcha from './Pages/CatCaptcha';



const formatDateToWordedDate = (numberedDate) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const date = new Date(numberedDate);
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  
  return `${month} ${day}, ${year}`;
}

const formatDate = (date) => {
  const givenDate = new Date(date);
  const currentDate = new Date();

  // Clear the time part of the dates
  const currentDateNoTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  const givenDateNoTime = new Date(givenDate.getFullYear(), givenDate.getMonth(), givenDate.getDate());

  const timeDifference = currentDateNoTime - givenDateNoTime;
  const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds

  if (timeDifference === 0) {
    return "Now";
  } else if (timeDifference === oneDay) {
    return "Yesterday";
  } else {
    return formatDateToWordedDate(givenDate);
  }
};

const parseDateString = (dateString) => {
  const [datePart, timePart] = dateString.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes, seconds] = timePart.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, seconds);
};


const Nav = () => {
  const { 
    viewProfileBtn, 
    setViewProfileBtn,
    userEmail, 
    fetchUsersEmails,
    viewLoginForm, 
    setViewLoginForm 
  } = UserProfileData();
  const navigate = useNavigate ();
  const [viewRegForm, setViewRegForm] = useState(false);
  const [viewRegFormRes, setViewRegFormRes] = useState(false);
  // const [viewLoginForm, setViewLoginForm] = useState(false);
  const [viewUserCredentials, setViewUserCredentials] = useState(false);
  const [viewAdminCredentials, setViewAdminCredentials] = useState(false);
  const [viewSellerCredentials, setViewSellerCredentials] = useState(false);
  const [viewForgotPassword, setViewForgotPassword] = useState(false)
  const [searchAccinput, setSearchAccInput] = useState('')


  const addAGUserAPI = process.env.REACT_APP_AG_USER_REGISTER_API;
  const loginAGUserAPI = process.env.REACT_APP_AG_USER_LOGIN_API;
  const logoutAGUserAPI = process.env.REACT_APP_AG_USER_LOGOUT_API;
  const AGUserListAPI = process.env.REACT_APP_AG_USERS_LIST_API;
  const AGUserDataAPI = process.env.REACT_APP_AG_USERS_PROFILE_API;
  const AGUserPostAPI = process.env.REACT_APP_AG_FETCH_POST_API;
  const AGUserCartAPI = process.env.REACT_APP_AG_FETCH_USER_CART_API;

  const [agUserEmail, setAGUserEmail] = useState('')
  const [agUserUsername, setAGUserUsername] = useState('')
  const [agUserPassword, setAGUserPassword] = useState('')
  const [agTimestamp, setAgTimestamp] = useState(new Date().toLocaleDateString())
  const [agUserReferral, setAGUserReferral] = useState('')
  const [agUserIDHash, setAgUserIDHash] = useState('')
  const [agUserAccount, setAGUserAccount] = useState('Customer')
  const [agUserStatus, setAGUserStatus] = useState('Active')
  const [messageResponse, setMessageResponse] = useState('')
  const [localTime, setLocalTime] = useState(new Date());
  const [icelandTime, setIcelandTime] = useState('');
  const [captchaComplete, setCaptchaComplete] = useState(null);
  const [isCaptchaOpen, setIsCaptchaOpen] = useState(false);


  const handleViewRegistration = () => {
    setViewForgotPassword(false)
    setViewRegForm(true);
    setViewLoginForm(false);
    setViewRegFormRes(false);
    setUserBlockedStatus(false);
    setMessageResponse('');
  }
  const handleViewLogin = () => {
    setViewForgotPassword(false)
    setViewLoginForm(true);
    setViewRegForm(false);
    setViewRegFormRes(false);
    setUserBlockedStatus(false);
    setMessageResponse('');
  }
  const handleViewProfileBtns = () => {
    setViewProfileBtn(true)
    // const timer = setTimeout(() => {
    //   setViewProfileBtn(false);
    // }, 5000);
  }
  const handleCloseModal = () => {
    setViewForgotPassword(false)
    setViewProfileBtn(false);
    setViewRegForm(false);
    setViewLoginForm(false);
    setMessageResponse('');
  }
  const handleForgotPassword = () => {
    setViewForgotPassword(true)
    setViewRegForm(false);
    setViewLoginForm(false);
    setViewRegFormRes(false);
    setUserBlockedStatus(false);
    setMessageResponse('');
  }
  const handleSearchAcc = (event) => {
    setSearchAccInput(event.target.value)
  }
  

  const handleCaptchaComplete = async (isCorrect) => {
    if(registeredEmail) return;

    setCaptchaComplete(isCorrect);
    setIsCaptchaOpen(false);
    handleconfirmEmail();
  };
  const handleOpenCaptchaModal = () => {
    if(registeredEmail || agUserEmail === '' || agUserUsername === '' || agUserPassword === ''){
      setMessageResponse('Please Fill all fields')
    }else{
      setIsCaptchaOpen(true);
    }
  };

  const userLoggedIn = localStorage.getItem('isLoggedIn');
  const LoginUserID = localStorage.getItem('profileUserID');
  const [dataUser, setDataUser] = useState([]);
  const [userBlockedStatus, setUserBlockedStatus] = useState('');
  const [viewTextPassword, setViewTextPassword] = useState(false);
  const [postTimeRemaining, setPostTimeRemaining] = useState('');
  const [agUserProductCart, setUserProductCart] = useState('');
  
  const registeredEmail = userEmail.find(email => email.email === agUserEmail);

  const fetchUserData = async () => {
    try {
      const [userListResponse, userDataResponse] = await Promise.all([
        axios.get(AGUserListAPI),
        axios.get(AGUserDataAPI)
      ]);
      const userDataStatus = userListResponse.data.find(item => item.userid === LoginUserID);

      if (userDataStatus?.status === 'Blocked') {
        setUserBlockedStatus(true);
        setViewUserCredentials(false)
        setViewLoginForm(false);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('agAdminLoggedIn');
        localStorage.removeItem('attractGameUsername');
        localStorage.removeItem('profileDataJSON')
        setAGUserUsername('');
        setAGUserPassword('');
        setTimeout(() => {
          setUserBlockedStatus(false);
        }, 10000)
        return;
      }else {
        const userData = userDataResponse.data.find(item => item.userid === LoginUserID);
        setViewUserCredentials(true);
        const profileDetailsJSON = JSON.stringify(userData);
        const profileDataJSON = JSON.parse(profileDetailsJSON)
        const profileGetUserID = profileDataJSON.userid
        localStorage.setItem('profileDataJSON', profileDetailsJSON);
        localStorage.setItem('profileUserID', profileGetUserID)

        if (userDataStatus?.account === 'Admin') {
          localStorage.setItem('agAdminLoggedIn', true);
        }
        if (userDataStatus?.account === 'Seller') {
          localStorage.setItem('agSellerLoggedIn', true);
        }

        const storedProfileData = localStorage.getItem('profileDataJSON');
        const storedUserState = localStorage.getItem('agAdminLoggedIn');
        const storedSellerState = localStorage.getItem('agSellerLoggedIn');

        if(storedProfileData) {
          setDataUser(JSON.parse(storedProfileData))
        }
        if(storedUserState) {
          setViewAdminCredentials(JSON.parse(storedUserState))
        }
        if(storedSellerState) {
          setViewSellerCredentials(JSON.parse(storedSellerState))
        }
        
      }

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const generateUserIDHash = async (str) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(str);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
      const shortHash = hashHex.substring(0, 10);
      setAgUserIDHash(shortHash);
    };
    const userHashID = `AG_Genesis_${agUserUsername}_${agUserEmail}`;
    generateUserIDHash(userHashID);
    if(registeredEmail){
      setMessageResponse('Email already exist');
      setAGUserUsername('');
      setAGUserPassword('');
      setAGUserReferral('');
    }

    if (!userLoggedIn) return;
    fetchUserData();
  }, [
    agUserUsername,
    agUserEmail,
    userLoggedIn, 
    LoginUserID, 
    agUserUsername, 
    AGUserListAPI, 
    AGUserDataAPI, 
    AGUserPostAPI, 
    icelandTime
  ]);
  useEffect(() => {
    const fetchUserCart = async () => {
      try {
        const response = await axios.get(AGUserCartAPI);
        const filteredData = response.data.filter(product => product.ag_user_id	=== LoginUserID);
        setUserProductCart(filteredData.length);
      } catch (error) {
          console.error(error);
      }
    };
    const interval = setInterval(() => {
      fetchUserCart();
    }, 1000); // Increment every second

    return () => clearInterval(interval); 
  }, [LoginUserID, setUserProductCart]);



  const [confirmEmail,setConfirmEmail] = useState(false)
  const [passwordError,setPasswordError] = useState()
  const [confirmCode, setConfirmcode] = useState()
  const [message, setMessage] = useState('');

  const [codeInput,setCodeinput] = useState()

  const handleInputCode = ( event ) => {
    setCodeinput( event.target.value );
  };

  const handleconfirmEmail = async () => {
    if(registeredEmail) return;
    const to = agUserEmail
    try {
      const response = await axios.post('https://attractgame.com/verify-email', {
          to,
      });
      setConfirmcode(response.data.code)
      setMessage('Verification code sent successfully, kindly check your inbox or spam');
    } catch (error) {
      console.log(error);
      setMessage('Error sending email');
    }
  }

  const handleConfirmcode = () => {
    if(registeredEmail) return;
    if (confirmCode === codeInput) {
      setConfirmEmail(true)
      setMessage("Verification Complete")
    } else {
      setMessage("Code Error")
    }
  }

  const handleUserRegister = async (e) => {
    e.preventDefault();
    if(registeredEmail) return;

    const formAddUser = {
      agSetEmail: agUserEmail,
      agSetUsername: agUserUsername,
      agSetUserID: agUserIDHash,
      agSetPassword: agUserPassword,
      agSetDateRegister: agTimestamp,
      agSetReferral: agUserReferral,
      agSetAccount: agUserAccount,
      agSetStatus: agUserStatus,
    }
    const jsonUserData = JSON.stringify(formAddUser);
    
    if (confirmEmail === true) {
      try {
        axios.post(addAGUserAPI, jsonUserData)
        .then(response => {
          const resMessage = response.data;
          if (resMessage.success === false) {
            setMessageResponse(resMessage.message);
          }
          if (resMessage.success === true) {
            setAGUserEmail('')
            setAGUserUsername('')
            setAGUserPassword('')
            setAGUserReferral('')
            setViewRegFormRes(true)
            setViewRegForm(false)
          }
      }) 
      .catch (error =>{
        setMessageResponse(error);
      });
      } catch (error) {
        console.log("unknown error occured", error);
      }
    } else {
      console.log("please check your email first");
    }
  };
  const handleUserLogin = (e) => {
    e.preventDefault();
  
    if (!agUserUsername || !agUserPassword) {
      setMessageResponse('Please fill in all fields.');
      return;
    }
  
    fetch(loginAGUserAPI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: agUserUsername,
        password: agUserPassword,
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success === true) {
        console.log(data);
        localStorage.setItem('attractGameUsername', data.username);
        localStorage.setItem('profileUserID', data.userid);
        localStorage.setItem('isLoggedIn', 'true');
        window.location.reload();
        fetchUserData();
      } else {
        setMessageResponse(data.message);
      }
    })
    .catch(error => console.error('Error:', error));
  };
  const handleUserLogout = () => {
    if (!userLoggedIn) return;
    fetch(logoutAGUserAPI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        localStorage.removeItem('agAdminLoggedIn');
        localStorage.removeItem('agSellerLoggedIn');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('attractGameUsername');
        localStorage.removeItem('profileUserID');
        localStorage.removeItem('profileDataJSON');
        localStorage.removeItem('initialiaze3DSData');
        localStorage.removeItem('authenticate3DSData');
        localStorage.removeItem('newCustomerID');
        setViewUserCredentials(false);
        window.location.reload();
        navigate('/')
      } else {
        setMessageResponse('Logout failed. Please try again.');
      }
    })
    .catch(error => console.error('Error:', error));
  };
  const handleViewPassword = (e) => {
    e.preventDefault();
    setViewTextPassword(true)
  };
  const handleHidePassword = (e) => {
    e.preventDefault();
    setViewTextPassword(false)
  };

  const { activePage, setActivePage } = useActivePage();
  const handleNavigation = (page, path) => {
    setViewProfileBtn(false);
    setActivePage(page);
    navigate(path);
  };
  useEffect(() => {
    if (!userLoggedIn) return;
    const keysToWatch = [
      'isLoggedIn',
      'attractGameUsername',
      'profileUserID',
      'profileDataJSON',
      'agAdminLoggedIn',
      'setUserCanPost',
    ];
    const handleStorageChange = (event) => {
      if (keysToWatch.includes(event.key)) {
        handleUserLogout();
        setTimeout(() => {
          keysToWatch.forEach((key) => localStorage.removeItem(key));
          setViewUserCredentials(false);
        }, 1000);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [handleUserLogout, setViewUserCredentials])


  if(viewRegForm == true || viewLoginForm == true){
    window.document.body.style.overflow = 'hidden';
  } else{
    window.document.body.style.overflow = 'auto';
  }

  const [fpResult,setFPresult] = useState()
  const handleForgotSearch = async ()  => {
    try {
      const emailData = {
        email: searchAccinput
      }
      axios.post("/forgot-acc-search", emailData).then((response => {
        const code = response.data.codePass;
        setFPresult(response.data.message)
        localStorage.setItem('recoveryCode', code)
        localStorage.setItem('changeEpass', searchAccinput)
      }))
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <nav>
      {!viewUserCredentials ? <>
        {viewRegForm &&
        <div className="navContainerModal">
          <div className="navContentModal register">
            <button id='closeModalContent' onClick={handleCloseModal}><FaTimes className='faIcons'/></button>
            <form id='userRegistraionFormContainer' className="navRegistrationContent" onSubmit={handleUserRegister}>
              <h6>REGISTER AN ACCOUNT</h6>
              <div className='navRegContents'>
                <div>
                  <label htmlFor=""><p>Email</p></label>
                  <input type="email" placeholder='ex. playerOne01@email.com' value={agUserEmail} onChange={(e) => setAGUserEmail(e.target.value)} required/>
                </div>
                {confirmCode &&(
                  <>
                    <div className="confirmEmail">
                      <label htmlFor=""><p>Email verification code</p></label>
                      <input type="text" value={codeInput} onChange={handleInputCode}/>
                    </div>
                    <span>
                      <p>{message}</p>
                    </span>
                  </>
                )}
                <div>
                  <label htmlFor=""><p>Username</p></label>
                  <input type="text" placeholder='ex. Player One' value={agUserUsername} onChange={(e) => setAGUserUsername(e.target.value)} required/>
                </div>
                <div>
                  <label htmlFor=""><p>Password</p></label>
                  <input type={!viewTextPassword ? "password" : "text"} minLength={8} maxLength={16} placeholder={!viewTextPassword ? '********' : 'Password Length 8-16 Characters'} value={agUserPassword} min={8} max={16} onChange={(e) => setAGUserPassword(e.target.value)} required/>
                  {!viewTextPassword ? <button className='navRefContViewPass' onClick={handleViewPassword}><FaRegEyeSlash className='faIcons'/></button>
                  :<button className='navRefContViewPass' onClick={handleHidePassword}><FaRegEye className='faIcons'/></button>}
                </div>
                <div>
                  <label htmlFor=""><p>Referrer (Optional)</p></label>
                  <input type="text" placeholder='ex. PlayerTwo' value={agUserReferral} onChange={(e) => setAGUserReferral(e.target.value)}/>
                </div>
                {!captchaComplete ? <div className='recaptchaSetup'>
                  {(!registeredEmail || agUserEmail != '') ? 
                    <button type='button' onClick={handleOpenCaptchaModal}>
                      <h6>CAT-CAPTCHA</h6>
                    </button>:
                    <button type='button'>
                      <h6>CAT-CAPTCHA</h6>
                    </button>
                  }
                </div>
                :<div className='submitAccount'>
                  {confirmEmail ? 
                    <button type='submit'>
                      <h6>Submit</h6>
                    </button>: 
                    <button type='button' onClick={handleConfirmcode}>
                      <h6>REGISTER</h6>
                    </button> 
                  }
                </div>}
                <div className='registrationTCPP'>
                  <p>
                    By registering, you agree to Attract Game's <br />
                    <Link to='/TermsAndConditions'>Terms & Conditions</Link> and <Link to='/PrivacyAndPolicies'>Privacy Policy</Link><br /><br />
                    <span>{messageResponse}</span><br /><br />
                  </p>
                  <p>
                    Already have an Account? <a onClick={handleViewLogin}>Login Here</a>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>}
        {viewLoginForm &&
        <div className="navContainerModal">
            <div className="navContentModal login">
              <button id='closeModalContent' onClick={handleCloseModal}><FaTimes className='faIcons'/></button>
              <form id='userLoginFormContainer' className="navRegistrationContent" onSubmit={handleUserLogin}>
                <h6>LOGIN ACCOUNT</h6>
                <div className='navRegContents'>
                  <div>
                    <label htmlFor=""><p>Username</p></label>
                    <input type="text" placeholder='ex. Player One' value={agUserUsername} onChange={e => setAGUserUsername(e.target.value)} required/>
                  </div>
                  <div>
                    <label htmlFor=""><p>Password</p></label>
                    <input type={!viewTextPassword ? "password" : "text"} placeholder='*****' value={agUserPassword} onChange={e => setAGUserPassword(e.target.value)} required/>
                    {!viewTextPassword ? <button className='navRefContViewPass' onClick={handleViewPassword}><FaRegEyeSlash className='faIcons'/></button>
                    :<button className='navRefContViewPass' onClick={handleHidePassword}><FaRegEye className='faIcons'/></button>}
                  </div><br /><br />
                  <div className='submitAccount'>
                    <button type='submit'>
                      <h6>LOGIN</h6>
                    </button>
                  </div>
                  {messageResponse&&(
                    <div className='errorMessage'>
                      <p>{messageResponse}</p>
                    </div>
                  )}<br />
                  <div className="forgotPassAcc">
                    <a onClick={handleForgotPassword}>Forgot Password</a>
                  </div>
                  <div className='registrationTCPP'>
                    <p>
                      Didn't have an Account? <a onClick={handleViewRegistration}>Register Here</a>
                    </p>
                  </div>
                </div>
              </form>
            </div>
        </div>}
        {viewRegFormRes && <div className="navContainerModal">
          <div className="navContentModal regRes">
            <h4>WELCOME GAMER!</h4>
            <h6>YOU SUCCESSFULLY REGISTERED</h6>
            <div className="navRegContents">
              <div className="registrationTCPP">
                <p>
                  Start your AG Account, <a onClick={handleViewLogin}>Login Here!</a>
                </p>
              </div>
            </div>
          </div>
        </div>}
        {userBlockedStatus && <div className="navContainerModal">
          <div className="navContentModal blocked">
            <h4>ACCOUNT BLOCKED</h4>
            <p>If you believe this is an error, please contact AG Website Support.</p>
          </div>
        </div>}
        {isCaptchaOpen && <div className="navContainerModal">
          <div className="navContentModal captcha">
            <CatCaptcha onComplete={handleCaptchaComplete} />
          </div>
        </div>}
      </>:<></>}

      {!viewUserCredentials ? <>
      {viewForgotPassword &&(
        <div className="navContainerModal">
          <div className="navContentModal">
          <button id='closeModalContent' onClick={handleCloseModal}><FaTimes className='faIcons'/></button>
          <div className="navForgotpassword">
            <h1>Find your account</h1>
            <p>Enter your Email to search your account</p>
            <input type="text" value={searchAccinput} onChange={handleSearchAcc} placeholder='Email'/>
            <div className="searchFrPassAcc">
              {fpResult&&(<p>{fpResult}</p>)}
            </div>
            <button onClick={handleForgotSearch}>Recover</button> 
            <br />
            <div className="backToLogin">
              <a onClick={handleViewLogin}>Back to Login</a>
            </div>
          </div>
          </div>
        </div>
      )}
      </>:<></>}
      

      <div className="mainNavContainer">
        <div className="navContainer website">
          <div className="navContent left">
            <Link to='/' onClick={() => handleNavigation('home', '/')}>
                <img id='nclLogoWebsite' src={require('./assets/imgs/AGLogoWhite.png')} alt="" />
                {/* <h5>ATTRACT GAME</h5> */}
                <img id='nclLogoMobile' src={require('./assets/imgs/AGLogoNameWhite2.png')} alt="" />
            </Link>
          </div>
          <div className="navContent center">
            {/* <Link to="/Highlights" onClick={() => handleNavigation('dashboard', '/Highlights')}><h6>HIGHLIGHTS</h6></Link> */}
            <Link to="/News" onClick={() => handleNavigation('news', '/News')}><h6>NEWS</h6></Link>
            <Link to="/Marketplace" onClick={() => handleNavigation('marketplace', '/Marketplace')}><h6>MARKETPLACE</h6></Link>
            <Link to="/Games" onClick={() => handleNavigation('games', '/Games')}><h6>GAMES</h6></Link>
            <Link to="/Giftcards" onClick={() => handleNavigation('giftcards', '/Giftcards')}><h6>GIFTCARDS</h6></Link>
            <Link to="/GameCredits" onClick={() => handleNavigation('gamecredits', '/GameCredits')}><h6>GAMECREDITS</h6></Link>
          </div>
          <div className="navContent right">
            {(!userLoggedIn) ? <div className='userPublicBtn'>
              <a id='agLoginBtn' onClick={handleViewLogin}><TbUserSquareRounded className='faIcons'/></a>
              <a id='agRegisterBtn' onClick={handleViewRegistration}><h6>REGISTER</h6></a>
            </div>:
            <div className='userProfileBtn'>
              {viewSellerCredentials &&<Link id='agAdminBtn' to='/SellerPanel'><MdOutlineStorefront  className='faIcons'/></Link>}
              {viewAdminCredentials &&<Link id='agAdminBtn' to='/Admin'><MdAdminPanelSettings className='faIcons'/></Link>}
              <Link id='agAddToCartBtn' to='/MyCart' onClick={() => handleNavigation('cart', '/MyCart')}>
                {!agUserProductCart ? '' : <p><sup>{agUserProductCart}</sup></p>}
                <TbShoppingCartFilled className='faIcons'/>
              </Link>
              <div className='agProfileSelect' onClick={handleViewProfileBtns}>
                {dataUser.profileimg ?
                <img src={`https://2wave.io/ProfilePics/${dataUser.profileimg}`} alt="" />:
                <img src={require('./assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
              </div>
              {viewProfileBtn && <div className="profileModalContainer">
                <Link id='agProfileBtn' to='/MyProfile' onClick={() => handleNavigation('profile', '/Profile')}>
                  <div>
                    {dataUser.profileimg ?
                    <img src={`https://2wave.io/ProfilePics/${dataUser.profileimg}`} alt="" />:
                    <img src={require('./assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
                  </div>
                  <h6>{dataUser.username}</h6>
                </Link>
                <Link id='agHeartBtn' to='/MyFavorites' onClick={() => handleNavigation('favorites', '/MyFavorites')}><TbHeartFilled className='faIcons'/> My Favorites</Link>
                <Link id='agCartBtn' to='/MyCart' onClick={() => handleNavigation('cart', '/MyCart')}><TbShoppingCartFilled className='faIcons'/> My Cart</Link>
                <Link id='agRedeemBtn' to='/ClaimACode' onClick={() => handleNavigation('redeem', '/ClaimACode')}><TbTicket className='faIcons'/> Claim a Code</Link>
                <Link id='agCartBtn'><TbCalendarEvent className='faIcons'/> Events</Link>
                <a id='agLogoutBtn' onClick={handleUserLogout}><TbLogout className='faIcons'/> Logout</a>
              </div>}
            </div>}
          </div>
        </div>
        <div className="navContainer mobile">
          {/* <button className={`${activePage === 'dashboard' ? 'active' : ''}`} onClick={() => handleNavigation('dashboard', '/Highlights')}><h5><MdOutlinePostAdd className='faIcons'/></h5></button> */}
          <button className={`${activePage === 'news' ? 'active' : ''}`} onClick={() => handleNavigation('news', '/News')}><h5><MdNewspaper className='faIcons'/></h5></button>
          <button className={`${activePage === 'marketplace' ? 'active' : ''}`} onClick={() => handleNavigation('marketplace', '/Marketplace')}><h5><AiOutlineShop className='faIcons'/></h5></button>
          <button className={`${activePage === 'games' ? 'active' : ''}`} onClick={() => handleNavigation('games', '/Games')}><h5><TbDeviceGamepad2  className='faIcons'/></h5></button>
          <button className={`${activePage === 'giftcards' ? 'active' : ''}`} onClick={() => handleNavigation('giftcards', '/Giftcards')}><h5><TbGiftCard className='faIcons'/></h5></button>
          <button className={`${activePage === 'gamecredits' ? 'active' : ''}`} onClick={() => handleNavigation('gamecredits', '/GameCredits')}><h5><TbDiamond className='faIcons'/></h5></button>
          {/* <button className={localStorage.getItem('crypto')} onClick={handleClickCrypto}><h5><MdCurrencyBitcoin className='faIcons'/></h5></button> */}
          {(userLoggedIn) && 
            <>
              {!viewProfileBtn ?
                <div className='agProfileBtnMobile' onClick={handleViewProfileBtns}>
                  {dataUser.profileimg ? 
                  <img src={`https://2wave.io/ProfilePics/${dataUser.profileimg}`} alt=""/>
                  :<img src={require('./assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
                </div>:
                <div className='agProfileBtnMobile' onClick={handleCloseModal}>
                  {dataUser.profileimg ? 
                  <img src={`https://2wave.io/ProfilePics/${dataUser.profileimg}`} alt=""/>
                  :<img src={require('./assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
                </div>
              }
            </>
          }
        </div>
        <hr />
        {viewProfileBtn && 
        <div className="navContainer profileSelect">
          <div className="navContentprofileDum" onClick={handleCloseModal}></div>
          <div className="navContentprofileSel">
            <h4>MENU</h4>
            <Link id='agProfileBtn' to='/MyProfile' onClick={() => handleNavigation('profile', '/Profile')}>
              <div>
                {dataUser.profileimg ?
                <img src={`https://2wave.io/ProfilePics/${dataUser.profileimg}`} alt="" />:
                <img src={require('./assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
              </div>
              <h6>{dataUser.username}</h6>
            </Link>
            <div className="navContentpsAGElite">
              {dataUser.verified ?
                <Link id="ncpsagelite"><RiVerifiedBadgeFill className='faIcons'/> VERIFIED AG ELITE</Link>:
                <Link id="ncpsagelite"><RiSparklingFill className='faIcons'/>APPLY AG ELITE</Link>
              }
            </div>
            <div className="navContentpsMyProfile">
              <Link to='/MyFavorites' onClick={() => handleNavigation('favorites', '/MyFavorites')}>
                <h4><TbHeartFilled className='faIcons'/></h4>
                <h6>My Favorites</h6>
              </Link>
              <Link to='/MyCart' onClick={() => handleNavigation('cart', '/MyCart')}>
                <h4><TbShoppingCartFilled className='faIcons'/></h4>
                <h6>My Cart</h6>
              </Link>
              <Link to='/ClaimACode' onClick={() => handleNavigation('redeem', '/ClaimACode')}>
                <h4><TbTicket className='faIcons'/></h4>
                <h6>Claim a Code</h6>
              </Link>
              <Link>
                <h4><TbCalendarEvent className='faIcons'/></h4>
                <h6>Events</h6>
              </Link>
              {/* <Link>
                <h4><TbHeartFilled className='faIcons'/></h4>
                <h6>My Favorites</h6>
              </Link> */}
            </div>
            <div className="navContentpsMyLogout">
              <button onClick={handleUserLogout}><TbLogout className='faIcons'/> Logout</button>
            </div>
          </div>
        </div>}
      </div>
    </nav>
  ); 
}

export default Nav;