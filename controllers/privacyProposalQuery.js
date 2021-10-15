
let ControllerClass = require('../libs/ControllerClass');

module.exports = class privacyProposalQuery extends ControllerClass {
  // semi-private since it doesn't reveal who created the proposal
  // this function is privacy-first, does not reveal the full address in the query result
  _privacyProposalQuery = (data, callback) => {

    this.debug('###### privacyProposalQuery 1 !!!!!!!');

    var params = {
      // KeyConditionExpression: "ProposalId <> 'coffeezilla'", // TODO: make a better query / scan, just a temp hack
      // ScanIndexForward: false,
      TableName: 'Proposals'
    };

    // TODO: pagination

    dynamoDB.scan(params, function(err, data) {
      if (err) {
        console.log(err);
        // TODO: propagate error to client UI via callback
      } else {
        console.log('###### privacyProposalQuery 2 !!!!!!!');

        // console.log('userInfoLock query!');
        console.log(data); // successful response
        console.log(JSON.stringify(data));



        // TODO: handle pagination
        // TODO: consider returning latest 50 votes, and return # of votes if possible
        // pagination in UI is a bonus feature, ok to show latest 50 votes for now

        var outputItems = [];
        var items = data['Items'];
        if (items && items.length >= 1) {
          for (var i = 0; i < items.length; i++) {
            var item = items[i];
            console.log(item);

            // TODO: handle case where desired attributes in item are missing, probably throw an error via callback

            // based on how OpenSea obscures wallet in display in profile page
            // var obscuredWalletAddress = walletAddress.substring(0, 6) + '...' + walletAddress.substring(walletAddress.length - 4, walletAddress.length);

            // do not return the VoteValue! ;)
            var outputItem = {
              ProposalId: item.ProposalId.S,
              ProposalType: item.ProposalType.S,
              CreationTime: item.CreationTime.S,
              EndTimestamp : (item.EndTimestamp ? item.EndTimestamp.S : ''),
              WalletAddress: item.WalletAddress.S,
              Title: item.Title.S,
              Description: item.Description.S
            }

            console.log(outputItem);

            outputItems.push(outputItem);
          }
        }

        // TODO: make API inputs / outputs better, better organization, better names, etc.

        var output = {
          items: outputItems,
          count: data['Count'],
          scannedCount: data['ScannedCount']
        };

        callback(null, output)

        /*
        var result = {};

        if (data['Items'] && data['Items'].length >= 1) {
            var item = data['Items'][0];
        }
        */

        // addResult(userResult);
      }
    });
  }


  get = (req, res) => {
    // Retrieve the tag from our URL path
    this.debug('privacyproposalquery!');
    this.debug(req.params);
    this.debug(req.query);debugger;
    this.debug(this.testb);
    debugger;

    this._privacyProposalQuery({}, function(err, output) {
      console.log('output!');
      console.log(output);

      res.json(output);
    });
  }
}
