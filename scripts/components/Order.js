
/*
Order
<Order/>
*/
import React from 'react'
import CSSTransitionGroup from 'react-addons-css-transition-group'
import h from '../helpers.js'
import autobind from 'autobind-decorator';

@autobind
class Order extends React.Component {
   renderOrder(key) {
    //we need all the details about the fish like name etc..
    var fish = this.props.fishes[key];
    //how much has been ordered for a given fish
    var count = this.props.order[key];

    var removeButton = <button onClick={this.props.removeOrder.bind(null,key)}>&times;</button>

    if(!fish) {
      return <li key={key}>Sorry, fish no longer available {removeButton}</li>
    }

    return (<li key={key}>
          <span>
          <CSSTransitionGroup component="span" transitionName="count" transitionLeaveTimeout={250} transitionEnterTimeout={250}>
            <span key={count}>{count}</span>  
          </CSSTransitionGroup>
          lbs {fish.name} {removeButton}
          </span>
          <span className="price">{h.formatPrice(count*fish.price)}</span>
          
        </li>)

  }
  render() {
    var orderIds = Object.keys(this.props.order)
    var total = orderIds.reduce((prevTotal,key)=>{
      var fish = this.props.fishes[key];
      var count = this.props.order[key];
      var isAvailable = fish && fish.status === 'available';

      if(fish && isAvailable) {
        return prevTotal + (count * parseInt(fish.price)|| 0);

      }
      return prevTotal;
    },0);
    return (
        <div className="order-wrap">
          <h2 className="order-title">Your Order</h2>
          <CSSTransitionGroup 
          className="order" 
          transitionName="order"
           component="ul"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}>
            {orderIds.map(this.renderOrder)}
            <li className="total">
               <strong>Total:</strong>
               {h.formatPrice(total)}
            </li>
          </CSSTransitionGroup>
        </div>
      )
  }

}

Order.propTypes ={
    removeOrder: React.PropTypes.func.isRequired,
    fishes:React.PropTypes.object.isRequired,
    order:React.PropTypes.object.isRequired
  }



export default Order