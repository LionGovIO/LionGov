import { BASE_URL } from '../../shared/urls'

export function init() {
  var web3 = null
  var provider = null

  // Unpkg imports
  const Web3Modal = window.Web3Modal.default
  const WalletConnectProvider = window.WalletConnectProvider.default
  const evmChains = window.evmChains

  // Web3modal instance
  let web3Modal

  // Tell Web3modal what providers we have available.
  // Built-in web browser provider (only one can exist as a time)
  // like MetaMask, Brave or Opera is added automatically by Web3modal
  const providerOptions = {
    /*  walletconnect: {
                    package: WalletConnectProvider, //This should work only with HTTPS
                    options: {
                      // Mikko's test key - don't copy as your mileage may vary  //8043bb2cf99347b1bfadfb233c5325c0
                      infuraId: "27e484dcd9e3efcfd25a83a78777cdf1", //a1d145ed2a82409a8a4371b4861f89cf
                    }
                  } */
  }

  web3Modal = new Web3Modal({
    network: 'matic',
    cacheProvider: true, // optional
    providerOptions, // required
    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
  })

  // providerX = web3Modal.connect();

  var primaryChain = null

  if (window.ethereum) {
    web3 = new Web3(window.ethereum)

    primaryChain = window.ethereum
  } else {
    alert('Crypto wallet not found')
  }

  function getVoteWeight(walletAddress) {
    console.log('getVoteWeight!!!!!!!')
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      console.log('state change!!!')
      if (this.readyState == 4 && this.status == 200) {
        console.log('query response!')
        console.log(xhttp.responseText)
        // Typical action to be performed when the document is ready:
        // document.getElementById("demo").innerHTML = xhttp.responseText;

        var result = JSON.parse(xhttp.responseText)

        console.log(result)

        var token_balance = result.token_balance
        var voteWeight = result.voteWeight

        $('#mm_balance_num').text(token_balance)
        $('#vote_weight_num').text(voteWeight)
      }
    }
    xhttp.open(
      'GET',
      BASE_URL + '/getvoteweight?walletAddress=' + walletAddress,
      true
    )
    xhttp.send()
  }

  function fetchAccountData(callback) {
    // Get a Web3 instance for the wallet
    web3 = new Web3(provider)

    web3.eth.getAccounts().then(function (accounts) {
      console.log('Got accounts! ' + accounts)
      // MetaMask does not give you all accounts, only the selected account
      selectedAccount = accounts[0]

      console.log('Connected wallet address: ' + accounts[0])

      getVoteWeight(selectedAccount)

      if (callback) {
        callback(selectedAccount)
      }
    })
  }

  function connectProvider(callback) {
    web3Modal.connect().then(function (aProvider) {
      provider = aProvider

      console.log('Got provider! ' + provider)

      fetchAccountData(callback)

      // Get connected chain id from Ethereum node
      //web3.eth.getChainId().then(function (chainId) {
      // Load chain information over an HTTP API
      //const chainData = evmChains.getChain(chainId);
      // document.querySelector("#network-name").textContent = chainData.name;

      // Get list of accounts of the connected wallet

      /*
                    const signer = provider.getSigner();
 
                    signer.getAddress().then((walletAddress) => {
                        console.log('signer wallet address: ' + walletAddress);
                    });
                    */
      //});
    })
  }

  // load your wallet stats if already connected
  try {
    if (web3.eth) {
      web3.eth.getAccounts().then(function (accounts) {
        if (ethereum.selectedAddress) {
          //still the best way to detect if metamask is connected.
          console.log('Got accounts!!! ' + accounts)
          // MetaMask does not give you all accounts, only the selected account
          selectedAccount = accounts[0]

          console.log('Connected wallet address: ' + accounts[0])
          $('#btn-connect-wallet').text('Wallet connected')

          getVoteWeight(selectedAccount)
        }
      })
    }
  } catch (e) {
    console.error(e)
  }

  $('#btn-connect-wallet').click(function () {
    connectProvider(function () {
      console.log('Provider connected')
      $('#btn-connect-wallet').text('Wallet connected')
    })
  })

  function submitProposal(title, description) {
    console.log('submitProposal 1!!!')

    connectProvider((walletAddress) => {
      console.log('submitProposal 2!!!')
      // walletAddress = Web3.utils.toChecksumAddress(walletAddress);

      // we are normalizing the wallet address by lower casing it
      // argument is that this is fine for computer code / database, the checksum address is mainly for humans
      walletAddress = walletAddress.toLowerCase()

      console.log('walletAddress for submitProposal: ' + walletAddress)

      var signPromise = null

      var message = walletAddress // TODO: temp variable, remove/adjust, maybe a more "secure" message

      // TODO: add more signature verification on proposals, to make sure that wallet address actually submitted the proposal

      var bcaddr = walletAddress // user blockchain address
      var password = ''
      web3.eth.personal.sign(
        message,
        bcaddr,
        password,
        function (err, signature) {
          console.log('submitProposal 3!!!')

          if (err) {
            console.log('Signature Denied')
          }
          if (signature) {
            console.log('submitProposal 4!!!')

            console.log('signature! ' + signature)

            var signedWalletAddress = signature

            // alert('signedVoteValue: ' + signedVoteValue);

            var xhr = new XMLHttpRequest()
            xhr.open('POST', '/submitproposal', true)
            xhr.setRequestHeader('Content-Type', 'application/json')

            xhr.onreadystatechange = function () {
              if (xhr.readyState == XMLHttpRequest.DONE) {
                console.log('submitProposal 5!!!')

                console.log('response: ' + xhr.responseText)

                if (xhr.status == 200) {
                  // TODO: go to a vote successful page, helps a bit to prevent people to vote multiple times
                  // TODO: when doing vote calculation, need to get rid of other votes from the same person, only pick 1 (probably the latest one)
                  alert('Proposal submitted successfully')
                } else {
                  alert('Proposal submission failed, please try again')
                }
              }
            }

            xhr.send(
              JSON.stringify({
                techlead: 'knows dae wae! 😎',
                signedWalletAddress: signedWalletAddress,
                walletAddress: walletAddress,
                title: title,
                description: description,
              })
            )
          }
        }
      )

      /*
                    signPromise = signer.signMessage(message);

                    console.log('signPromise: ' + signPromise);

                    signPromise.then((signedTransaction) => {

                        console.log('signedTransaction: ' + signedTransaction);
                        // "0xf86c808504a817c8008252089488a5c2d9919e46f883eb62f7b8dd9d0cc45bc2
                        //    90880de0b6b3a76400008025a05e766fa4bbb395108dc250ec66c2f88355d240
                        //    acdc47ab5dfaad46bcf63f2a34a05b2cb6290fd8ff801d07f6767df63c1c3da7
                        //    a7b83b53cd6cea3d3075ef9597d5"

                        var signedVoteValue = signedTransaction;

                        // alert('signedVoteValue: ' + signedVoteValue);

                        var xhr = new XMLHttpRequest();
                        xhr.open("POST", '/submitvote', true);
                        xhr.setRequestHeader('Content-Type', 'application/json');

                        xhr.onreadystatechange = function () {
                            if (xhr.readyState == XMLHttpRequest.DONE) {
                                console.log('response: ' + xhr.responseText);

                                if (xhr.status == 200) {
                                    // TODO: go to a vote successful page, helps a bit to prevent people to vote multiple times
                                    // TODO: when doing vote calculation, need to get rid of other votes from the same person, only pick 1 (probably the latest one)
                                    alert('Vote submitted successfully')
                                } else {
                                    alert('Vote submission failed, please try again')
                                }
                            }
                        }

                        xhr.send(JSON.stringify({
                            voteClass: voteClass,
                            voteValue: voteValue,
                            signedVoteValue: signedVoteValue,
                            walletAddress: walletAddress
                        }));
                    });
                    */
    })
  }

  $('#proposal_form').submit(function (event) {
    // alert("Handler for .submit() called.");

    var title = $('#proposal_title_input').val()
    var description = $('#proposal_description_input').val()

    // alert(title);
    // alert(description);

    submitProposal(title, description)

    event.preventDefault()
  })

  var globalProposals = {}

  var globalSelectedProposal = null

  function proposalIdClick(proposalId) {
    // alert(proposalId);

    // TECHLEAD!!!!!!!!!!!

    var item = globalProposals[proposalId]

    globalSelectedProposal = item

    var proposalId = item.proposalId
    var proposalType = item.proposalType
    var creationTime = item.creationTime
    var title = item.title
    var description = item.description

    $('#single_proposal_title').text(title)
    $('#single_proposal_description').html('')
    $('#single_proposal_description').text(description)

    var voteClass = proposalId
    techleadVotesTablleeeeee(voteClass)
  }

  window.proposalIdClick = proposalIdClick

  function techleadViewProposals() {
    console.log('Yo TechLead!!!!!!!')
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      console.log('state change!!!')
      if (this.readyState == 4 && this.status == 200) {
        console.log('query response!')
        console.log(xhttp.responseText)
        // Typical action to be performed when the document is ready:
        // document.getElementById("demo").innerHTML = xhttp.responseText;

        var result = JSON.parse(xhttp.responseText)

        var items = result.items
        if (items) {
          for (var i = 0; i < items.length; i++) {
            var item = items[i]
            console.log(item)

            var proposalId = item.proposalId
            var proposalType = item.proposalType
            var creationTime = item.creationTime
            var title = item.title
            var description = item.description

            globalProposals[proposalId] = item

            // TODO: make creationDate prettier/more human readable
            var creationDate = new Date(parseInt(creationTime))
            console.log(creationDate)

            var html = '<tr>'
            html += '<td>' + creationTime + '</td>'
            html +=
              '<td onclick="proposalIdClick(\'' +
              proposalId +
              '\');"><a href="#' +
              proposalId +
              '">' +
              proposalId +
              '</a></td>'
            html += '<td>' + title + '</td>'
            html += '<td>' + description + '</td>'
            html += '</tr>'

            $('#proposals_table_tbody').append(html)
          }
        }

        //var totalVoteCount = result.count;
        //$('#total_vote_count_num').text(totalVoteCount);
      }
    }
    xhttp.open('GET', BASE_URL + '/privacyproposalquery', true)
    xhttp.send()
  }

  techleadViewProposals()

  function submitVote(voteClass, voteValue) {
    connectProvider((walletAddress) => {
      // walletAddress = Web3.utils.toChecksumAddress(walletAddress);

      // we are normalizing the wallet address by lower casing it
      // argument is that this is fine for computer code / database, the checksum address is mainly for humans
      walletAddress = walletAddress.toLowerCase()

      console.log('walletAddress for vote submission: ' + walletAddress)

      // var from = walletAddress;
      var message = voteValue // TODO: see comments in server.js, should hash on more info to be safe

      // console.log('msgHash: ' + msgHash);

      var signPromise = null

      // Note: Why we don't support Binance wallet (uses old eth_sign message which may be insecure)
      // Binance only supports eth_sign now
      // Note that eth_sign shows following warning on MetaMask: "Signing this message can have dangerous side effects. Only sign messages from sites you fully trust with your entire account. This dangerous method will be removed in a future version."
      // This reddit explains that eth_sign can be used to sign things maliciously: https://www.reddit.com/r/ethdev/comments/llvdqa/any_risk_in_simply_signing_a_message_on_ethereum/
      // Binance doc on eth_sign: https://docs.binance.org/smart-chain/wallet/wallet_api.html#using-the-provider
      //
      // signPromise = primaryChain.request({
      //     method: "eth_sign",
      //     params: [from, message]
      // });

      // TODO: gray out voting if wallet not connected, or something like that
      // basically ideally don't want user to start the voting process without having a wallet connected

      var bcaddr = walletAddress // user blockchain address
      var password = ''
      web3.eth.personal.sign(
        message,
        bcaddr,
        password,
        function (err, signature) {
          if (err) {
            console.log('Signature Denied')
          }
          if (signature) {
            console.log('signature! ' + signature)

            var signedVoteValue = signature

            // alert('signedVoteValue: ' + signedVoteValue);

            var xhr = new XMLHttpRequest()
            xhr.open('POST', '/submitvote', true)
            xhr.setRequestHeader('Content-Type', 'application/json')

            xhr.onreadystatechange = function () {
              if (xhr.readyState == XMLHttpRequest.DONE) {
                console.log('response: ' + xhr.responseText)

                if (xhr.status == 200) {
                  // TODO: go to a vote successful page, helps a bit to prevent people to vote multiple times
                  // TODO: when doing vote calculation, need to get rid of other votes from the same person, only pick 1 (probably the latest one)
                  alert('Vote submitted successfully')
                } else {
                  alert('Vote submission failed, please try again')
                }
              }
            }

            xhr.send(
              JSON.stringify({
                voteClass: voteClass,
                voteValue: voteValue,
                signedVoteValue: signedVoteValue,
                walletAddress: walletAddress,
              })
            )
          }
        }
      )

      /*
                    signPromise = signer.signMessage(message);

                    console.log('signPromise: ' + signPromise);

                    signPromise.then((signedTransaction) => {

                        console.log('signedTransaction: ' + signedTransaction);
                        // "0xf86c808504a817c8008252089488a5c2d9919e46f883eb62f7b8dd9d0cc45bc2
                        //    90880de0b6b3a76400008025a05e766fa4bbb395108dc250ec66c2f88355d240
                        //    acdc47ab5dfaad46bcf63f2a34a05b2cb6290fd8ff801d07f6767df63c1c3da7
                        //    a7b83b53cd6cea3d3075ef9597d5"

                        var signedVoteValue = signedTransaction;

                        // alert('signedVoteValue: ' + signedVoteValue);

                        var xhr = new XMLHttpRequest();
                        xhr.open("POST", '/submitvote', true);
                        xhr.setRequestHeader('Content-Type', 'application/json');

                        xhr.onreadystatechange = function () {
                            if (xhr.readyState == XMLHttpRequest.DONE) {
                                console.log('response: ' + xhr.responseText);

                                if (xhr.status == 200) {
                                    // TODO: go to a vote successful page, helps a bit to prevent people to vote multiple times
                                    // TODO: when doing vote calculation, need to get rid of other votes from the same person, only pick 1 (probably the latest one)
                                    alert('Vote submitted successfully')
                                } else {
                                    alert('Vote submission failed, please try again')
                                }
                            }
                        }

                        xhr.send(JSON.stringify({
                            voteClass: voteClass,
                            voteValue: voteValue,
                            signedVoteValue: signedVoteValue,
                            walletAddress: walletAddress
                        }));
                    });
                    */
    })
  }

  $('#voteButton').click(function () {
    var radioValue = $("input[name='voteOptions']:checked").val()
    if (radioValue) {
      // alert("Your are a - " + radioValue);

      var voteClass = null
      if (globalSelectedProposal) {
        voteClass = globalSelectedProposal.proposalId
      } else {
        voteClass = 'matrix'
      }

      submitVote(voteClass, radioValue)
    }
  })

  function techleadVotesTablleeeeee(currentVoteClass) {
    // clear recent votes table
    $('#votes_table_tbody').html('')

    console.log('Yo!!!!!!!')
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      console.log('state change!!!')
      if (this.readyState == 4 && this.status == 200) {
        console.log('query response!')
        console.log(xhttp.responseText)
        // Typical action to be performed when the document is ready:
        // document.getElementById("demo").innerHTML = xhttp.responseText;

        var result = JSON.parse(xhttp.responseText)

        var items = result.items
        if (items) {
          for (var i = 0; i < items.length; i++) {
            var item = items[i]
            console.log(item)

            var voteClass = item.voteClass
            var obscuredWalletAddress = item.obscuredWalletAddress
            var creationTime = item.creationTime // in epoch milli
            var voteValue = item.voteValue
            var voteWeight = item.voteWeight

            // TODO: make creationDate prettier/more human readable
            var creationDate = new Date(parseInt(creationTime))
            console.log(creationDate)

            var html = '<tr>'
            html += '<td>' + creationDate + '</td>'
            html += '<td>' + obscuredWalletAddress + '</td>'
            html += '<td>' + voteValue + '</td>'
            html += '<td>' + voteWeight + '</td>'
            html += '</tr>'

            $('#votes_table_tbody').append(html)
          }
        }

        var totalVoteCount = result.count
        $('#total_vote_count_num').text(totalVoteCount)
      }
    }
    // var currentVoteClass = 'matrix';
    xhttp.open(
      'GET',
      BASE_URL + '/privacyvotequery?voteClass=' + currentVoteClass,
      true
    )
    xhttp.send()
  }

  techleadVotesTablleeeeee('matrix')
}
