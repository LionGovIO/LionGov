import React from 'react';
import { BrowserRouter as Link } from 'react-router-dom'

export const PointsTable = ({ PointsInChain }) => (
  <div className="app-card app-card-orders-table shadow-sm mb-5" style={{padding: "10px"}}>
    <div className="app-card-body">
      <div style={{margin: "10px"}}>{PointsInChain.chain}</div>
	    <div className="table-responsive">
	        <table className="table app-table-hover mb-0 text-left">
				<thead>
					<tr>
						<th className="cell">Date</th>
						<th className="cell">Days counted</th>
						<th className="cell">MM</th>
						<th className="cell">Points</th>
					</tr>
				</thead>
				<tbody>
          {PointsInChain.points_detail.map((txbuy) => (
  					<tr>
              <td className="cell">
                <span>{(new Date(txbuy.timestamp)).toLocaleDateString()}</span>
                <span className="note">{(new Date(txbuy.timestamp)).toLocaleTimeString()}</span></td>
  						<td className="cell">{txbuy.days}</td>
  						<td className="cell">{txbuy.token_amount}</td>
  						<td className="cell">{txbuy.points}</td>
  					</tr>
          ))}

				</tbody>
			</table>
        </div>

    </div>
</div>
)
