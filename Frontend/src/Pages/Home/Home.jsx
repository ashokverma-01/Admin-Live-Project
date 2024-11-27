import React from 'react'
import './home.scss'
// import Featuredinfo from '../../Components/FeaturedInfo/Featuredinfo'
import Charts from '../../Components/Charts/Charts'
import {userdata} from '../../DummyData';
import SmallWidget from '../../Components/Widgets/WidgetSmall/SmallWidget';
import LargeWidget from '../../Components/Widgets/WidgetLarge/LargeWidget';

function Home() {
  return (
    <div className='home'>
        {/* <Featuredinfo  /> */}
        <Charts data={userdata} title="User Analytics" dataKey="ActiveUsers" grid/>
        <div className="homeWidgets">
        <SmallWidget />
        <LargeWidget />
          

        </div>
        </div>
  )
}

export default Home