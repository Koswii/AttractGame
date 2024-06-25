import React from 'react'
// css
import '../CSS/underdevelop.css'
// assets
import underdevelop from '../assets/imgs/Underdevelopment.gif'

const Underdevelop = () => {
  return (
    <div className="underDevelop">
        <div className="underDevelopMain">
            <section>
                <img src={underdevelop} alt="" />
            </section>
            <span>This Feature is</span>
            <h1>Under Development</h1>
            <p>Please comeback again soon for the Latest Update</p>
        </div>
    </div>
  )
}

export default Underdevelop