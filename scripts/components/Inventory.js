/*
Inventory
<Inventory/>
*/
import React from 'react';
import AddFishForm from './AddFishForm';
import autobind from 'autobind-decorator';
import base from '../../base'
import firebase from 'firebase';
  var config = {
    apiKey: "AIzaSyAVaoCjNL5ybDRFKHI3UfzdJ2bvE1VUkyc",
    authDomain: "reactbase-b0070.firebaseapp.com",
    databaseURL: "https://reactbase-b0070.firebaseio.com",
    storageBucket: "reactbase-b0070.appspot.com",
    messagingSenderId: "802962597174"
  };
  firebase.initializeApp(config);

@autobind
class Inventory extends React.Component {

  constructor() {
    super();
    this.state = {
      uid: null,
      owner: null
    }
  }

  componentwillMount() {
    var token = localStorage.getItem('token')
    if(token) {
      firebase.authWithCustomToken(token,this.authenticate)
    }
  }

  authenticate(provider) {
    // console.log("Trying to log in with" + provider);
    base.authWithOAuthPopup(provider,this.authHandler);
    
  }

   componentDidMount() {
    base.onAuth((user) => {
      if(user) {
        this.authHandler(null, { user });
      }
    });
   }

  logout() {
      base.unauth();
      this.setState({uid: null})
    }

  authHandler(err,authData) {
    console.log(authData);
    if(err) {
      console.error(err);
      return;
    }

    

    //grab the store info
    const storeRef = base.database().ref(this.props.params.storeid);

    //query the firebase once for the store data
    storeRef.once('value',(snapshot)=>{
      const data = snapshot.val() || {}

      //claim it as your own if there is no owner already
      if(!data.owner) {
        storeRef.set({
          owner: authData.user.uid
        });
      }

      this.setState({
        uid: authData.user.uid,
        owner: data.owner || authData.user.uid
      })
    })
  }

  renderLogin() {

    return (
        <nav className="login">
          <h2>Inventory</h2>
          <p>Sign in to manage your store's inventory</p>
          <button className="facebook" onClick={this.authenticate.bind(this,'facebook')}>Log in with Facebook</button>
          <button className="twitter" onClick={this.authenticate.bind(this,'twitter')}>Log in with twitter</button>
        </nav>

      )
  }
  renderInventory(key) {
    var linkState = this.props.linkState;
     return (
          <div className="fish-edit" key={key}>
            <input type="text" valueLink={linkState('fishes.'+key+'.name')} />
            <input type="text" valueLink={linkState('fishes.'+key+'.price')} />
            <select ref="status" valueLink={linkState('fishes.'+key+'.status')}>
              <option value="available">Fresh!</option>
              <option value="unavailable">Sold Out!</option>
            </select>
            <textarea ref="desc" valueLink={linkState('fishes.'+key+'.desc')}></textarea>
            <input type="text" ref="image" valueLink={linkState('fishes.'+key+'.image')} placeholder="URL to image" />
            <button onClick={this.props.removeFish.bind(null,key)}>Remove Fish</button>
          </div>

      )
  }
  render() {
    let logoutButton = <button onClick={this.logout}>Log Out!</button>
    //first checked whether they arent logged in
    if(!this.state.uid) {
      return (
              <div>
                {this.renderLogin()}
              </div>
        )
    }

    //check if they arent the owner of the current store
    if(this.state.uid !== this.state.owner) {
      return (
          <div>
            <p>Sorry, you are not the owner of this store</p>
            {logoutButton}
          </div>
        )
    }
    return (
        <div>
          <h2>Inventory</h2>
          {logoutButton}

          {Object.keys(this.props.fishes).map(this.renderInventory)}
          <AddFishForm {...this.props}/>
          <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
        </div>
      )
  }

}

Inventory.propTypes = {
    removeFish: React.PropTypes.func.isRequired,
    loadSamples: React.PropTypes.func.isRequired,
    fishes: React.PropTypes.object.isRequired,
    linkState: React.PropTypes.func.isRequired,
    addFish: React.PropTypes.func.isRequired
  }



export default Inventory