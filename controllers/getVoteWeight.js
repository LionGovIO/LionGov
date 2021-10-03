
let ControllerClass = require('../libs/ControllerClass');

module.exports = class getVoteWeight extends ControllerClass {

  get = (req, res) => {
    console.log('getvoteweight!');
    console.log(req.params);
    console.log(req.query);

    if (req.query) {
      var walletAddress = req.query.walletAddress;

      if (walletAddress) {
        walletAddress = walletAddress.trim().toLowerCase();
        console.log('walletAddress to get voting points of! ' + walletAddress);
        Blkchain.getVoteWeight(walletAddress, Date.now()).then(voteWeight => {
          console.log('voteWeight! ' + voteWeight);

          res.end(JSON.stringify(voteWeight));
        });
      }
    }
  }
}
