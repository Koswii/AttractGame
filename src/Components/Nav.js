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
  MdOutlineVideogameAsset,
  MdOutlineGamepad,
  MdOutlineCardGiftcard,
  MdCurrencyBitcoin    
} from "react-icons/md";
import { 
  TbUserSquareRounded,
  TbShoppingCartBolt,
  TbLogout 
} from "react-icons/tb";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate ();
  const [viewRegForm, setViewRegForm] = useState(false);
  const [viewRegFormRes, setViewRegFormRes] = useState(false);
  const [viewLoginForm, setViewLoginForm] = useState(false);
  const [viewUserCredentials, setViewUserCredentials] = useState(false);
  const [viewAdminCredentials, setViewAdminCredentials] = useState(localStorage.getItem('agAdminLoggedIn'));

  const addAGUserAPI = process.env.REACT_APP_AG_USER_REGISTER_API;
  const loginAGUserAPI = process.env.REACT_APP_AG_USER_LOGIN_API;
  const logoutAGUserAPI = process.env.REACT_APP_AG_USER_LOGOUT_API;
  const AGUserListAPI = process.env.REACT_APP_AG_USERS_LIST_API;
  const AGUserDataAPI = process.env.REACT_APP_AG_USERS_PROFILE_API;
  const AGUserPostAPI = process.env.REACT_APP_AG_FETCH_POST_API;

  const [agUserEmail, setAGUserEmail] = useState('')
  const [agUserUsername, setAGUserUsername] = useState('')
  const [agUserPassword, setAGUserPassword] = useState('')
  const [agTimestamp, setAgTimestamp] = useState(new Date().toLocaleDateString())
  const [agUserReferral, setAGUserReferral] = useState('')
  const [agUserAccount, setAGUserAccount] = useState('Customer')
  const [agUserStatus, setAGUserStatus] = useState('Active')
  const [messageResponse, setMessageResponse] = useState('')
  const [captcha, setCaptcha] = useState('');
  const [inputValueCaptcha, setInputValueCaptcha] = useState('');
  const [localTime, setLocalTime] = useState(new Date());
  const [icelandTime, setIcelandTime] = useState('');
  const [captchaComplete, setCaptchaComplete] = useState(null);
  const [isCaptchaOpen, setIsCaptchaOpen] = useState(false);


  const handleViewRegistration = () => {
    setViewRegForm(true);
    setViewLoginForm(false);
    setViewRegFormRes(false);
    setUserBlockedStatus(false);
    setMessageResponse('');
  }
  const handleViewLogin = () => {
    setViewLoginForm(true);
    setViewRegForm(false);
    setViewRegFormRes(false);
    setUserBlockedStatus(false);
    setMessageResponse('');
  }
  const handleCloseModal = () => {
    setViewRegForm(false)
    setViewLoginForm(false)
    setMessageResponse('')
  }


  const handleCaptchaComplete = (isCorrect) => {
    setCaptchaComplete(isCorrect);
    setIsCaptchaOpen(false);
  };
  const handleOpenCaptchaModal = () => {
    setIsCaptchaOpen(true);
  };


  useEffect(() => {
      const timer = setInterval(() => {
          setLocalTime(new Date());
      }, 1000);

      return () => clearInterval(timer);
  }, []);
  useEffect(() => {
      const options = {
          timeZone: 'Atlantic/Reykjavik',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false, // 24-hour format
      };
      const dateOptions = {
          timeZone: 'Atlantic/Reykjavik',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
      };

      const icelandFormatter = new Intl.DateTimeFormat([], options);
      const dateFormatter = new Intl.DateTimeFormat([], dateOptions);
      const icelandFormattedTime = icelandFormatter.format(localTime);
      const icelandFormattedDate = dateFormatter.format(localTime);

      // Combine date and time in "yyyy-mm-dd HH:MM:SS" format
      const [month, day, year] = icelandFormattedDate.split('/');
      const formattedDate = `${year}-${month}-${day}`;
      setIcelandTime(`${formattedDate} ${icelandFormattedTime}`);
  }, [localTime]);


  const LoginUsername = localStorage.getItem('attractGameUsername');
  const userLoggedIn = localStorage.getItem('isLoggedIn')
  // const [dataUser, setDataUser] = useState(profileDataJSON);
  const [userBlockedStatus, setUserBlockedStatus] = useState('');
  const [viewTextPassword, setViewTextPassword] = useState(false);
  const [postTimeRemaining, setPostTimeRemaining] = useState('');
  // console.log(LoginUsername);

  useEffect(() => {
    // if (!userLoggedIn) return;
    const fetchUserData = async () => {
      try {
        const [userListResponse, userDataResponse] = await Promise.all([
          axios.get(AGUserListAPI),
          axios.get(AGUserDataAPI)
        ]);
        const userDataStatus = userListResponse.data.find(item => item.username === LoginUsername);
        // console.log(userDataStatus);

        if (userDataStatus?.status === 'Blocked') {
          setUserBlockedStatus(true);
          setViewUserCredentials(false)
          setViewLoginForm(false);
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('agAdminLoggedIn');
          localStorage.removeItem('attractGameUsername');
          localStorage.removeItem('profileDataJSON')
          localStorage.removeItem('setUserCanPost')
          setAGUserUsername('');
          setAGUserPassword('');
          setTimeout(() => {
            setUserBlockedStatus(false);
          }, 10000)
          return;
        }else {
          const userData = userDataResponse.data.find(item => item.username === LoginUsername);
          setViewUserCredentials(true);
          const profileDetailsJSON = JSON.stringify(userData);
          localStorage.setItem('profileDataJSON', profileDetailsJSON);
          // setDataUser(profileDataJSON);

          if (userDataStatus?.account === 'Admin') {
            localStorage.setItem('agAdminLoggedIn', true);
          }
        }

      } catch (error) {
        console.error(error);
      }
    };

    const fetchUserPosts = async () => {
      if (!userLoggedIn) return;
      try {
        const response = await axios.get(AGUserPostAPI);
        const postSortData = response.data.sort((a, b) => b.id - a.id);
        const postData = postSortData.filter(post => post.user === LoginUsername);

        if (postData.length > 0) {
          const latestPostDate = new Date(parseDateString(postData[0].user_post_date));
          const nextPostDate = new Date(latestPostDate.getTime() + 12 * 60 * 60 * 1000);
          const serverDate = parseDateString(icelandTime);
          const postDateDifference = nextPostDate - serverDate;

          if (postDateDifference <= 0) {
            localStorage.setItem('setUserCanPost', true);
          } else {
            localStorage.setItem('setUserCanPost', false);
            const hours = Math.floor(postDateDifference / (1000 * 60 * 60));
            const minutes = Math.floor((postDateDifference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((postDateDifference % (1000 * 60)) / 1000);
            setPostTimeRemaining(`${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`);
          }
        }
      } catch (error) {
          console.error(error);
      }
    };

    fetchUserData();
    fetchUserPosts();
  }, [userLoggedIn, LoginUsername, agUserUsername, AGUserListAPI, AGUserDataAPI, AGUserPostAPI, icelandTime]);

  // const profileFromJSON = localStorage.getItem('profileDataJSON');
  // const profileDataJSON = JSON.parse(profileFromJSON);
  // console.log(profileDataJSON);

  const handleUserRegister = async (e) => {
    e.preventDefault();

    const formAddUser = {
      agSetEmail: agUserEmail,
      agSetUsername: agUserUsername,
      agSetPassword: agUserPassword,
      agSetDateRegister: agTimestamp,
      agSetReferral: agUserReferral,
      agSetAccount: agUserAccount,
      agSetStatus: agUserStatus,
    }

    const jsonUserData = JSON.stringify(formAddUser);
    axios.post(addAGUserAPI, jsonUserData)
    .then(response => {
      const resMessage = response.data;
      if (resMessage.success === false) {
        setMessageResponse(resMessage.message);
        setAGUserEmail('')
        setAGUserUsername('')
        setAGUserPassword('')
        setAGUserReferral('')
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
        localStorage.setItem('attractGameUsername', data.username);
        localStorage.setItem('isLoggedIn', 'true');
        // window.location.reload();
      } else {
        setMessageResponse(data.message);
      }
    })
    .catch(error => console.error('Error:', error));
    
  };
  const handleUserLogout = () => {
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
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('attractGameUsername');
        localStorage.removeItem('profileDataJSON');
        localStorage.removeItem('setUserCanPost');
        setViewUserCredentials(false);
        window.location.reload();
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

  const [activePage, setActivePage] = useState('');
  const handleNavigation = (page, path) => {
    setActivePage(page);
    navigate(path);
  };
  useEffect(() => {
    const keysToWatch = [
      'isLoggedIn',
      'attractGameUsername',
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


  return (
    <nav>
      {!viewUserCredentials ? <>
        {viewRegForm &&
        <div className="navContainerModal">
          <div className="navContentModal">
            <button id='closeModalContent' onClick={handleCloseModal}><FaTimes className='faIcons'/></button>
            <form id='userRegistraionFormContainer' className="navRegistrationContent" onSubmit={handleUserRegister}>
              <h6>REGISTER AN ACCOUNT</h6>
              <div className='navRegContents'>
                <div>
                  <label htmlFor=""><p>Email</p></label>
                  <input type="email" placeholder='ex. playerOne01@email.com' value={agUserEmail} onChange={(e) => setAGUserEmail(e.target.value)} required/>
                </div>
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
                  <button type='button' onClick={handleOpenCaptchaModal}>
                    <h6>CAT-CAPTCHA</h6>
                  </button>
                </div>
                :<div className='submitAccount'>
                  <button type='submit'>
                    <h6>REGISTER</h6>
                  </button>
                </div>}
                <div className='registrationTCPP'>
                  <p>
                    By registering, you agree to Attract Game's <br />
                    <Link>Terms & Conditions</Link> and <Link>Privacy Policy</Link><br /><br />
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
      </>:<></>}
      {!viewUserCredentials ? <>
        {viewLoginForm &&
        <div className="navContainerModal">
            <div className="navContentModal">
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
                  <div className='errorMessage'>
                    <p>{messageResponse}</p>
                  </div><br />
                  <div className='registrationTCPP'>
                    <p>
                      Didn't have an Account? <a onClick={handleViewRegistration}>Register Here</a>
                    </p>
                  </div>
                </div>
              </form>
            </div>
        </div>}
      </>:<></>}
      {!viewUserCredentials ?<>
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
      </>:<></>}
      {!viewUserCredentials ?<>
        {userBlockedStatus && <div className="navContainerModal">
          <div className="navContentModal blocked">
            <h4>ACCOUNT BLOCKED</h4>
            <p>If you believe this is an error, please contact AG Website Support.</p>
          </div>
        </div>}
      </>:<></>}
      {!viewUserCredentials ?<>
        {isCaptchaOpen && <div className="navContainerModal">
          <div className="navContentModal captcha">
            <CatCaptcha onComplete={handleCaptchaComplete} />
          </div>
        </div>}
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
            <Link to="/Highlights" onClick={() => handleNavigation('dashboard', '/Highlights')}><h6>HIGHLIGHTS</h6></Link>
            <Link to="/News" onClick={() => handleNavigation('news', '/News')}><h6>NEWS</h6></Link>
            <Link to="/Marketplace" onClick={() => handleNavigation('marketplace', '/Marketplace')}><h6>MARKETPLACE</h6></Link>
            <Link to="/Games" onClick={() => handleNavigation('games', '/Games')}><h6>GAMES</h6></Link>
            <Link onClick={() => handleNavigation('giftcards', '/Giftcards')}><h6>GIFTCARDS</h6></Link>
          </div>
          <div className="navContent right">
            {(!userLoggedIn) ? <div className='userPublicBtn'>
              <a id='agLoginBtn' onClick={handleViewLogin}><TbUserSquareRounded className='faIcons'/></a>
              <a id='agRegisterBtn' onClick={handleViewRegistration}><h6>REGISTER</h6></a>
            </div>:
            <div className='userProfileBtn'>
              {viewAdminCredentials &&<Link id='agAdminBtn' to='/Admin'><MdAdminPanelSettings className='faIcons'/></Link>}
              <Link id='agCartBtn'><TbShoppingCartBolt className='faIcons'/></Link>
              {/* <Link id='agProfileBtn' to='/Profile'>
                {profileDataJSON.profileimg ?
                <img src={`https://2wave.io/ProfilePics/${profileDataJSON.profileimg}`} alt="" />:
                <img src={require('./assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
              </Link> */}
              <a id='agLogoutBtn' onClick={handleUserLogout}><TbLogout /></a>
            </div>}
          </div>
        </div>
        <div className="navContainer mobile">
          <button className={`${activePage === 'dashboard' ? 'active' : ''}`} onClick={() => handleNavigation('dashboard', '/Highlights')}><h5><MdOutlineSpaceDashboard className='faIcons'/></h5></button>
          <button className={`${activePage === 'news' ? 'active' : ''}`} onClick={() => handleNavigation('news', '/News')}><h5><MdNewspaper className='faIcons'/></h5></button>
          <button className={`${activePage === 'marketplace' ? 'active' : ''}`} onClick={() => handleNavigation('marketplace', '/Marketplace')}><h5><MdOutlineShoppingBag className='faIcons'/></h5></button>
          <button className={`${activePage === 'games' ? 'active' : ''}`} onClick={() => handleNavigation('games', '/Games')}><h5><MdOutlineGamepad  className='faIcons'/></h5></button>
          <button className={`${activePage === 'giftcards' ? 'active' : ''}`} onClick={() => handleNavigation('giftcards', '/Giftcards')}><h5><MdOutlineCardGiftcard className='faIcons'/></h5></button>
          {/* <button className={localStorage.getItem('crypto')} onClick={handleClickCrypto}><h5><MdCurrencyBitcoin className='faIcons'/></h5></button> */}
          {/* {(userLoggedIn) && 
            <Link id='agProfileBtn' to='/Profile' className={`${activePage === 'profile' ? 'active' : ''}`} onClick={() => handleNavigation('profile', '/Profile')}>
              {profileDataJSON.profileimg ? 
              <img src={`https://2wave.io/ProfilePics/${profileDataJSON.profileimg}`} alt=""/>
              :<img src={require('./assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
            </Link>
          } */}
        </div>
        <hr />
      </div>
    </nav>
  ); 
}

export default Nav;