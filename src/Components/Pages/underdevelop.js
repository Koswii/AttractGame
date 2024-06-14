import React from 'react'
// css
import '../CSS/underdevelop.css'
// assets
import underdevelop from '../assets/imgs/underdevelopment.png'

const Underdevelop = () => {
  return (
    <div className="underDevelop">
        <div className="underDevelopMain">
            <section>
                <img src={underdevelop} alt="" />
            </section>
            <span>This page is</span>
            <h1>Under Development</h1>
            <p>please comeback for the latest gaming news update</p>
        </div>
    </div>
  )
}

export default Underdevelop