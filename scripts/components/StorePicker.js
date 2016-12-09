/*
Storepicker
This will help us to make <StorePicker/>
*/

import React from 'react';

import {browserHistory} from 'react-router';

import h from '../helpers'

import autobind from 'autobind-decorator';


 @autobind
class StorePicker extends React.Component {

   
    goToStore(event) {
    //makes sure the form doesnt refresh the page as it usually does..
    event.preventDefault();
    // get the data from the input
    var storeId = this.refs.storeId.value;
    //push it to the url
    browserHistory.push('/store/' + storeId);
  }


  render() {
    return (
      <form className="store-selector" onSubmit={this.goToStore}>
        <h2>Please Enter A Store</h2>
        <input type="text" ref="storeId" defaultValue={h.getFunName()} required />
        <input type="Submit" />
      </form>
    )
  }

}

export default StorePicker;
