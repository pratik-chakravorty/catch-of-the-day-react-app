
/*  
App
*/

import React from 'react';

//React-Catalyst for two-way data binding
import Catalyst from 'react-catalyst'

import Header from './Header';

import Fish from './Fish';

import Inventory from './Inventory';

import Order from './Order';

import reactMixin from 'react-mixin';

import autobind from 'autobind-decorator';


import base from '../../base'



@autobind
class App extends React.Component {

  constructor() {
    super();

    this.state = {
      fishes: {},
      order: {}
    }
  }

  componentDidMount() {
    base.syncState(this.props.params.storeid+'/fishes',{
      context: this,
      state: 'fishes'
    });

    var localStorageRef = localStorage.getItem('order-'+this.props.params.storeid);

    if(localStorageRef) {
      //update our component state to reflect what is in localStorage
      this.setState({
        order: JSON.parse(localStorageRef)
      })
    }
  }
  componentWillUpdate(nextProps,nextState) {
    //JSON.stringify is used because local storage stores everything in the form of a string.
    //So the objects contents have to be in a string.
    localStorage.setItem('order-'+this.props.params.storeid,JSON.stringify(nextState.order))

  }
  addToOrder(key) {
      this.state.order[key] = this.state.order[key] + 1 || 1;
      this.setState({order: this.state.order})
  }
  addFish(fish) {
    
    var timestamp = (new Date()).getTime();
    // update the state object
    const fishes = this.state.fishes;
      fishes['fish-'+timestamp] = fish;
      // set the state
      this.setState({ fishes});

  }
  removeFish(key) {
      if(confirm("Are you sure you want to remove this fish?")) {
        this.state.fishes[key] = null;
        this.setState({
          fishes: this.state.fishes
        }); 
    }
  }
  removeOrder(key) {
      delete this.state.order[key];
      this.setState({
        order: this.state.order
      });
  }
  loadSamples() {
    this.setState({
      fishes: require('../sample-fishes')
    })
  }
  renderFish(key) {
      return <Fish key={key} addToOrder={this.addToOrder} index={key} details={this.state.fishes[key]} />
  }
  render(){
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Sea Food Market" />
          <ul className="list-of-fishes">
              {/*Object.keys extracts the keys out of the given object into an array*/}
            {Object.keys(this.state.fishes).map(this.renderFish)}
              
          </ul>
        </div>
        <Order removeOrder={this.removeOrder}fishes={this.state.fishes} order={this.state.order}/>
        <Inventory {...this.props} removeFish={this.removeFish}linkState={this.linkState.bind(this)}fishes={this.state.fishes} addFish={this.addFish} loadSamples={this.loadSamples} />
      </div>
    )
  }
}

reactMixin.onClass(App,Catalyst.LinkedStateMixin);

export default App;





