import React, {useEffect,useState} from 'react'
// css
import '../CSS/ticketForm.css'
// icons
import { IoClose } from "react-icons/io5";
import axios from 'axios';

const TicketForm = ({ticketform, agGameDataName, gameCanonical}) => {
    const [ticketID, setTicketID] = useState()
    const [concern, setConcern] = useState('')

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
    
    
    const userLoggedInDetails = localStorage.getItem('profileDataJSON');

    const handleConcernChange = (event) => {
        setConcern(event.target.value)
    }

    useEffect(() => {
        const ticketid = 'AG_ticket_' + ticketIDGenerator(10)
        setTicketID(ticketid)
    }, [])
    
    const ticketApi = process.env.REACT_APP_AG_USERS_TICKET_API
    const sendTicket = async (e) => {
        e.preventDefault()
        const user = JSON.parse(userLoggedInDetails)
        const userID = user.userid
        console.log(userID);

        if (concern != '') {
            const ticketData = {
                ticket_id : ticketID,
                date : formattedDate,
                product_id : gameCanonical,
                product_name : agGameDataName[0],
                user_id : userID,
                concern : concern
            }
            console.log(ticketData);
            const ticketDatajson = JSON.stringify(ticketData)
            try {
                axios.post( ticketApi, ticketDatajson ).then((response)=>{
                    const data = response
                    console.log(data);
                    ticketform(false)
                    setConcern('')
                })
            } catch (error) {
                console.log(error);
            }
        } else {
            alert('input the concern');
        }
        
    }



    const closeTicketform = () => {
        ticketform(false)
        setConcern('')
    }

  return (
    <div className="TicketForm">
        <div className="ticketMain">
            <div className="ticktContainer">
                <IoClose id='closeticketForm' onClick={closeTicketform}/>
                <div className="ticktHeader">
                    <h1>Send a Ticket</h1>
                </div>
                <hr />
                <div className="ticktContent">
                    <ul>
                        <li>
                            <p>Product Name</p>
                            <input type="text" value={agGameDataName} disabled/>
                        </li>
                        <li>
                            <p>Product ID</p>
                            <input type="text" value={gameCanonical} disabled/>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <p>Date</p>
                            <input type="text" value={formattedDate} disabled/>
                        </li>
                        <li>
                            <p>Ticket ID</p>
                            <input type="text" value={ticketID} disabled/>
                        </li>
                    </ul>
                </div>
                <div className="tcketConcern">
                    <p>Concern</p>
                    <textarea value={concern} onChange={handleConcernChange} required></textarea>
                </div>
                <div className="tcktSendbtn">
                    <button onClick={sendTicket}>Send Ticket</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default TicketForm
