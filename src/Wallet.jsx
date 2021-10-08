import { obscureAddress } from './shared/obscureAddress'

class WalletClass {

  // Web3modal instance
  web3Modal;

  // Chosen wallet provider given by the dialog window
  provider;

  // Address of the selected account
  selectedAccount;

  // The button attaches a function to this variable
  changeButton;

  constructor () {
    this.Web3Modal = window.Web3Modal.default;
    this.WalletConnectProvider = window.WalletConnectProvider.default;

    const providerOptions = {
    /*  walletconnect: {
        package: WalletConnectProvider, //This should work only with HTTPS
        options: {
          // Mikko's test key - don't copy as your mileage may vary  //8043bb2cf99347b1bfadfb233c5325c0
          infuraId: "27e484dcd9e3efcfd25a83a78777cdf1", //a1d145ed2a82409a8a4371b4861f89cf
        }
      }*/
    };

    this.web3Modal = new this.Web3Modal({
      network: "matic",
      cacheProvider: false, // optional
      providerOptions, // required
      disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
    });

    // check if web wallet is already connected.
    if (window.ethereum) {

      web3 = new Web3(window.ethereum);

      web3.eth.getAccounts((accounta,accountb) => {
        //if(accounta){onConnect();}
        //else
        if(accountb[0]){this.onConnect();} // <<-- this is what works for me on Firefox Metamask
      });
    }

  }

  connected = () => {
    this.selectedAccount = ethereum.selectedAddress;
    this.changeButton(obscureAddress(ethereum.selectedAddress));
  }

  disconnected = () => {
    this.changeButton('disconnected');
  }


  fetchAccountData = async () => {

    // Get a Web3 instance for the wallet
    const web3 = new Web3(this.provider);

    // Get connected chain id from Ethereum node
    const chainId = await web3.eth.getChainId();

    // Get list of accounts of the connected wallet
    const accounts = await web3.eth.getAccounts();

    // MetaMask does not give you all accounts, only the selected account
    this.selectedAccount = ethereum.selectedAddress;

    if(!accounts[0]){await this.onDisconnect();return;} //if user disconnected wallet

    this.connected();
  }



  refreshAccountData = async () => {

    if (window.ethereum && ethereum.selectedAddress) {
      this.connected();
    } else {
      this.changeButton('disconnected');
    }

  }

  onConnect = async () => {
    try {
      this.provider = await this.web3Modal.connect();
    } catch(e) {
      console.log("Could not get a wallet connection", e);
      return;
    }

    // Subscribe to accounts change
    this.provider.on("accountsChanged", (accounts) => {
      console.log('event: accountsChanged')
      this.fetchAccountData();
    });

    // Subscribe to chainId change
    this.provider.on("chainChanged", (chainId) => {
      console.log('event: chainChanged')
      this.fetchAccountData();
    });

    console.log('await this.refreshAccountData();')
    await this.refreshAccountData();

  }


  Disconnect = async () => {

    if(this.provider.disconnect) {

      await this.provider.disconnect();

      await this.Disconnect();

    } else {

      alert ("The disconnection button is located in the wallet!");

    }

  }


  onDisconnect = async () => {

    // If the cached provider is not cleared,
    // WalletConnect will default to the existing session
    // and does not allow to re-scan the QR code with a new wallet.
    // Depending on your use case you may want or want not his behavir.
    await this.web3Modal.clearCachedProvider();

    //provider = null; //if set to null, we get an error when reconnecting the wallet

    this.selectedAccount = null;

    this.changeButton('disconnected');

  }


}

export default WalletClass;
