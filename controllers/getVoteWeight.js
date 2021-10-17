
let ControllerClass = require('../libs/ControllerClass');

const ethers = require('ethers');

module.exports = class getVoteWeight extends ControllerClass {

  get = (req, res) => {
    this.debug('getvoteweight!');
    this.debug(req.params);
    this.debug(req.query);

    let checksumAddress;

    if (req.query) {
      let walletAddress = req.query.walletAddress;

      try {
        checksumAddress = ethers.utils.getAddress(walletAddress.trim()); //EIP55
        if (!checksumAddress) {
          res.status(400);
          res.json({
            "error": {msg: "No address informed!"}
          });
          res.end();
          return;
        }
      } catch (e) {
        this.debug(e);
        res.status(400);
        res.json({
          "error": {msg: "Invalid Address!"}
        });
        res.end();
        return;
      }

      walletAddress = checksumAddress.trim().toLowerCase();

      this.debug('walletAddress to get voting points of! ' + walletAddress);
      Blkchain.getVoteWeight(walletAddress, Date.now(), true).then(voteWeight => {
        console.log('voteWeight! ' + voteWeight);

        res.end(JSON.stringify(voteWeight));
      });

    }
  }
}
