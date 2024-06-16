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
            <span>This Page is</span>
            <h1>Under Development</h1>
            <p>Please Comeback later for the Latest Update</p>
        </div>
    </div>
  )
}

export default Underdevelop