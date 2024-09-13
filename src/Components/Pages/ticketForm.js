import React, {useEffect,useState} from 'react'
// css
import '../CSS/ticketForm.css'
// icons
import { IoClose } from "react-icons/io5";
import axios from 'axios';
import { UserProfileData } from './UserProfileContext';
import { 
    FaSearch,
    FaBolt,
    FaTicketAlt,
    FaGem,
    FaCoins,
    FaFire,
    FaStar,     
    FaFacebookSquare,
    FaBitcoin, 
    FaTimes
} from 'react-icons/fa';

const TicketForm = ({ticketform, agGameDataName, agGameDataSeller, agGameDataCover, agGameCreditNumber, agGameDataEdition, agProductType, gameCanonical}) => {
    const { 
        userLoggedData,
        fetchUserTicketReport
    } = UserProfileData();
    const [ticketID, setTicketID] = useState()
    const [concern, setConcern] = useState('')
    const [ticketLoader, setTicketLoader] = useState(false)
    const [ticketSuccess, setTicketSuccess] = useState(false)

    const dateTicket = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = dateTicket.toLocaleDateString('en-US', options);

    const ticketIDGenerator = (length) => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        result += charset.charAt(randomIndex);
        }
        return result;
    };
    const handleConcernChange = (event) => {
        setConcern(event.target.value)
    }
    useEffect(() => {
        const ticketid = 'TIX - AG' + ticketIDGenerator(5)
        setTicketID(ticketid)
    }, [])
    const ticketApi = process.env.REACT_APP_AG_USERS_TICKET_API
    const sendTicket = async (e) => {
        e.preventDefault()
        setTicketLoader(true)

        if (concern != '') {
            const ticketData = {
                ticket_id : ticketID,
                date : formattedDate,
                product_id : gameCanonical,
                product_name : agGameDataName,
                product_seller : agGameDataSeller,
                user_id : userLoggedData.userid,
                concern : concern
            }
            const ticketDatajson = JSON.stringify(ticketData)
            try {
                axios.post( ticketApi, ticketDatajson )
                .then((response)=>{
                    const data = response
                    // console.log(data);
                    fetchUserTicketReport()
                    setTicketLoader(false)
                    setTicketSuccess(true)
                    setConcern('')
                })
            } catch (error) {
                console.log(error);
            }
        } else {
            alert('In put your concern');
        }
        
    }



    const closeTicketform = () => {
        ticketform(false)
        setConcern('')
    }

  return (
    <div className="TicketForm">
        <div className="ticketMain" style={userLoggedData.coverimg ? {background: `linear-gradient(transparent, black 75%), url(https://2wave.io/CoverPics/${userLoggedData.coverimg})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover',}
            :{background: 'linear-gradient(transparent, black 75%), url(https://2wave.io/CoverPics/LoginBackground.jpg)', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover',}}>
            <button id='closeModalTicket' onClick={closeTicketform} type='button'><FaTimes className='faIcons'/></button>
            <div className="ticketContainer">
                <div className="ticketContent left">
                    <div className="ticketclSeller">
                        <img src={`https://2wave.io/StoreLogo/${agGameDataSeller}.png`} alt="" />
                    </div>
                    {(agProductType === "Games") && <img id='prdImgCover' src={`https://2wave.io/GameCovers/${agGameDataCover}`} alt="" />}
                    {(agProductType === "Giftcards") && <img id='prdImgCover' src={`https://2wave.io/GiftCardCovers/${agGameDataCover}`} alt="" />}
                    {(agProductType === "Game Credits") && <img id='prdImgCover' src={`https://2wave.io/GameCreditCovers/${agGameDataCover}`} alt="" />}
                </div>
                <div className="ticketContent right">
                    <h5>SEND A TICKET REPORT</h5>
                    <div className="tcRightDetails">
                        <h4>{agGameDataName}</h4>
                        <p>{agGameCreditNumber} {agGameDataEdition}</p>
                    </div>
                    {!ticketSuccess ? <>
                        <div className="tcConcern">
                            <textarea value={concern} onChange={handleConcernChange} placeholder='Type your concern/report here...' required></textarea>
                        </div>
                        <div className="tcSendConcern">
                            {!ticketLoader ?
                                <button className={concern ? 'active' : ''} onClick={sendTicket} disabled={!concern}>Send Ticket</button>:
                                <button disabled>Sending Ticket</button>
                            }
                        </div>
                    </>:
                    <>
                        <div className="tcConcernSent">
                            <div>
                                <h2><FaTicketAlt className='faIcons'/></h2>
                                <p>Ticket Report Sent <br /> ID : {ticketID}</p>
                            </div>
                        </div>
                    </>}
                </div>
            </div>
        </div>
    </div>
  )
}

export default TicketForm
