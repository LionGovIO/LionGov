
let ControllerClass = require('../libs/ControllerClass');

module.exports = class singleProposalQuery extends ControllerClass {

  get = (req, res) => {
    // Retrieve the tag from our URL path
    this.debug('singleProposalQuery!');

    this.debug(req.query);

    if (!req.query || !req.query.proposal) {
      res.json({"error": "Request not valid!"});
      res.end(); return;
    }
    let proposal = req.query.proposal;

    dynamoDB.getItem({
      TableName: 'Proposals',
      Key : {
        'ProposalId' : {
          'S' : proposal
        }
      }
    }, function(err, data) {
      if (err) {
        debug(err);
        res.json({"error": "Database failed to fetch!"});
        res.end(); return;
      } else {
        if (!(Object.keys(data).length)){
          res.json({"error": "No data"});
          res.end(); return;
        }

        //Successfully fetched data

        let r = data.Item

        let Proposal = {
          Title : r.Title.S,
          ProposalId : r.ProposalId.S,
          ProposalType : r.ProposalType.S,
          CreationTime : r.CreationTime.S,
          Description : r.Description.S,
          WalletAddress : r.WalletAddress.S
        }

        res.json(Proposal);
        res.end();

      }
    });

  }
}
