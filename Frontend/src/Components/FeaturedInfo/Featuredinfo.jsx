import React from 'react'
import './featuredInfo.scss'
import { North, South } from '@mui/icons-material'


function Featuredinfo() {
  return (
    <div className='featured'>
        <div className="featuredItem">
           <span className="featuredTitle">
                Revenue
           </span>
           <div className="featuredMoneyContainer">
            <span className="featuredMoney">$2000</span>
            <span className="featuredMoneyRate">
                -11.4 <South className='featuredIcon negative'/>
            </span>
           </div>
           <span className="featuredSubtitle">Compared To Last Month</span>
        </div>

        <div className="featuredItem">
           <span className="featuredTitle">
                Sales
           </span>
           <div className="featuredMoneyContainer">
            <span className="featuredMoney">$2000</span>
            <span className="featuredMoneyRate">
                -7.4 <South className='featuredIcon negative'/>
            </span>
           </div>
           <span className="featuredSubtitle">Compared To Last Month</span>
        </div>

        <div className="featuredItem">
           <span className="featuredTitle">
                Cost
           </span>
           <div className="featuredMoneyContainer">
            <span className="featuredMoney">$4000</span>
            <span className="featuredMoneyRate">
                +5.9 <North className='featuredIcon'/>
            </span>
           </div>
           <span className="featuredSubtitle">Compared To Last Month</span>
        </div>
        </div>
  )
}

export default Featuredinfo