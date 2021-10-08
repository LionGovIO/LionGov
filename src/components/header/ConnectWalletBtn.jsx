import React, { useEffect, Component } from 'react'
import { BigButton } from '../../shared/styles'


let handleClick = () => {
  console.log('click');
  console.log(Wallet.selectedAccount);
  if (!Wallet.selectedAccount){
    Wallet.onConnect();
  } else {
    alert ("The disconnection button is located in the wallet!");
  }

}


class ConnectWalletBtn extends Component {

  constructor(props) {
      super(props);

      //This function is called by the wallet class obj.
      Wallet.changeButton = (data) => {
        if(data == 'disconnected'){
          this.setState( {text: 'Connect Wallet'})
        } else {
          this.setState( {text: data})
        }
      }

      // Button is not fully loaded yet, so we can't use setState yet
      if (window.ethereum && ethereum.selectedAddress) {
        this.state.text = 'Connected';
      } else {
        this.state.text = 'Connect Wallet';
      }

    }

  state = {
    text: ''
  }

  render() {
    return (
      <BigButton onClick={handleClick} type="button" className="btn btn-outline-success">
        {this.state.text}
      </BigButton>
    );
  }

}


export default ConnectWalletBtn
