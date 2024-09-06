import React, { useState, useEffect } from 'react'
// css 
import '../CSS/concernTicket.css'
import { IoClose } from "react-icons/io5";
import axios from 'axios';

const ConcernTicket = ({setConcernTicket,currentTicket,fetchTicketConcern}) => {

    const markTicketAPI = process.env.REACT_APP_AG_USERS_MARK_TICKET_API
    
    const closeTicket = () => {
        setConcernTicket(false)
    }

    const markConcern = async () => {
        const ticketData = {
            ticket_id : currentTicket.ticket_id
        }
        try {
            axios.post( markTicketAPI,ticketData ).then((response) =>{
                fetchTicketConcern()
            })
            setConcernTicket(false)
        } catch (error) {
            
        }
    }
    
  return (
    <div className="concernTicket">
        <div className="cntckt-container">
            <div className="clsctkt">
                <IoClose id='clsBtntckt' onClick={closeTicket}/>
            </div>
            <div className="cntckt-header">
                <h1>User Concern</h1>
            </div>
            <hr />
            <div className="cntckt-content">
                <p>{currentTicket.concern}</p>
            </div>
            <div className="cntcktmrkUs-resolve">
                <button onClick={markConcern}>Mark as Resolve</button>
            </div>
        </div>
    </div>
  )
}

export default ConcernTicket
