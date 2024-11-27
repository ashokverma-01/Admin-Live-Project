import React from 'react'
import'./smallWidget.scss'
import { Visibility } from '@mui/icons-material'

const SmallWidget = () => {
  return (
    <div className='smallWidget'>
      <span className="smallWidgetTitle">
        New Join Members
      </span>
      <ul className="smallWidgetList">
        <li className="smallWidgetListItem">
          <img src="https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg" alt="User Image" className="smallWidgetImage" />
          <div className="smallWidgetUser">
            <span className="smallWidgetUsername">
              Anna Keller
            </span>
            <span className="smallWidgetJobTitle">
              Software Engineer
            </span>
          </div>
          <button className="smallWidgetButton">
            <Visibility className='smallWidgetButtonIcon'/>
            Display
          </button>
        </li>

        <li className="smallWidgetListItem">
          <img src="https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg" alt="User Image" className="smallWidgetImage" />
          <div className="smallWidgetUser">
            <span className="smallWidgetUsername">
              Anna Keller
            </span>
            <span className="smallWidgetJobTitle">
              Software Engineer
            </span>
          </div>
          <button className="smallWidgetButton">
            <Visibility className='smallWidgetButtonIcon'/>
            Display
          </button>
        </li>

        <li className="smallWidgetListItem">
          <img src="https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg" alt="User Image" className="smallWidgetImage" />
          <div className="smallWidgetUser">
            <span className="smallWidgetUsername">
              Anna Keller
            </span>
            <span className="smallWidgetJobTitle">
              Software Engineer
            </span>
          </div>
          <button className="smallWidgetButton">
            <Visibility className='smallWidgetButtonIcon'/>
            Display
          </button>
        </li>
      </ul>
      </div>
  )
}

export default SmallWidget