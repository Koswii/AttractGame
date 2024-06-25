import React from 'react'
import "../CSS/contactUs.css";
import { 
  FaSquareFacebook,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaTwitch,
  FaDiscord, 
} from "react-icons/fa6";

const ContactUs = () => {
  return (
    <div className='mainContainer contactUs'>
        <section className="contactUsPageContainer top">
            <div className="contactUsPageContent">
                <h4>CONTACT US</h4>
                <p>
                    Got questions, feedback, or just want to share your latest gaming triumph? We'd love to hear from you! At ATTRACT GAME, 
                    were here to ensure your gaming experience is nothing short of epic. Reach out to us anytime—we're ready to assist you 
                    with all your gaming needs!
                    <ul>
                        <li>Email us: support@attractgame.com</li>
                        <li>Call us: +1 (202) 972-3867</li>
                        <li>Visit us: 9131 Keele Street, Suite A4,Vaughan, Ontario L4K 0G7</li>
                    </ul>
                </p>
                <p>
                    Or connect with us on our social media platforms for the latest updates, exclusive offers, and a chance to be part of our vibrant gaming community:
                    <ul>
                        <li><a href="https://www.facebook.com/attractgamestore" target='blank'><FaSquareFacebook className='faIcons'/> Facebook</a></li>
                        <li><a href="https://www.instagram.com/attract_gamestore" target='blank'><FaInstagram className='faIcons'/> Instagram</a></li>
                        <li><a href="https://www.tiktok.com/@attractgame" target='blank'><FaTiktok className='faIcons'/> TikTok</a></li>
                        <li><a href="https://discord.gg/jHzDQa9M" target='blank'><FaDiscord className='faIcons'/> Discord</a></li>
                    </ul>
                </p>
                <p>
                    Thank you for choosing ATTRACT GAME. We're excited to help you level up your gaming experience!
                </p>
            </div>
        </section>
    </div>
  )
}

export default ContactUs