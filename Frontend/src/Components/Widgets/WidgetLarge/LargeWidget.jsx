import React from 'react'
import'./largeWidget.scss'

const LargeWidget = () => {

    const Button = ({type})=>{
        return <button className={"largeWidgetButton " + type}>{type}</button>
    }


  return (
    <div className='largeWidget'>
      <span className="largeWidgetTitle">
        Latest Transactions
      </span>
      <table className="largeWidgetTable">
        <tr className="largeWidgetTr">
            <th className="largeWidgetTh">
                Customer
            </th>
            <th className="largeWidgetTh">
                Date
            </th>
            <th className="largeWidgetTh">
                Amount
            </th>
            <th className="largeWidgetTh">
                Status
            </th>
        </tr>

        <tr className="largeWidgetTr">
            <td className="largeWidgetProfile">
          <img src="https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg" alt="User Image" className="largeWidgetImage" />
              <span className='largetWidgetUsername'>Sussane Carol</span>
            </td>
            <td className="largeWidgetDate">
                2 Jun 2021
            </td>
            <td className="largeWidgetAmount">
                $122
            </td>
            <td className="largeWidgetStatus">
                <Button type="Approved" />
            </td>
        </tr>

        <tr className="largeWidgetTr">
            <td className="largeWidgetProfile">
          <img src="https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg" alt="User Image" className="largeWidgetImage" />
              <span className='largetWidgetUsername'>Sussane Carol</span>
            </td>
            <td className="largeWidgetDate">
                2 Jun 2021
            </td>
            <td className="largeWidgetAmount">
                $122
            </td>
            <td className="largeWidgetStatus">
                <Button type="Declined" />
            </td>
        </tr>

        <tr className="largeWidgetTr">
            <td className="largeWidgetProfile">
          <img src="https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg" alt="User Image" className="largeWidgetImage" />
              <span className='largetWidgetUsername'>Sussane Carol</span>
            </td>
            <td className="largeWidgetDate">
                2 Jun 2021
            </td>
            <td className="largeWidgetAmount">
                $122
            </td>
            <td className="largeWidgetStatus">
                <Button type="Pending" />
            </td>
        </tr>
      </table>
      </div>
  )
}

export default LargeWidget