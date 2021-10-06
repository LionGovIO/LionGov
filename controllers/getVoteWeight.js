
let ControllerClass = require('../libs/ControllerClass');

module.exports = class getVoteWeight extends ControllerClass {

  get = (req, res) => {
    this.debug('getvoteweight!');
    this.debug(req.params);
    this.debug(req.query);

    if (req.query) {
      var walletAddress = req.query.walletAddress;

      if (walletAddress) {
        walletAddress = walletAddress.trim().toLowerCase();
        this.debug('walletAddress to get voting points of! ' + walletAddress);
        Blkchain.getVoteWeight(walletAddress, Date.now(), true).then(voteWeight => {
          console.log('voteWeight! ' + voteWeight);

          res.end(JSON.stringify(voteWeight));
        });
      }
    }
  }
}
