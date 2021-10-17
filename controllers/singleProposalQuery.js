
let ControllerClass = require('../libs/ControllerClass');

module.exports = class singleProposalQuery extends ControllerClass {

  _singleProposalQuery = (ProposalId, callback) => {
    dynamoDB.getItem({
      TableName: 'Proposals',
      Key : {
        'ProposalId' : {
          'S' : ProposalId
        }
      }
    }, function(err, data) {
      if (err) {
        debug(err);
        callback({"error": "Database failed to fetch!"});
        return;
      } else {
        if (!(Object.keys(data).length)){
          callback({"error": "No data"});
          return;
        }

        //Successfully fetched data

        let r = data.Item

        let Options = []

        if(r.Options) {
          for (const i in r.Options.L) {
            Options.push(r.Options.L[i].S);
          }
        }

        let Proposal = {
          Title : r.Title.S,
          ProposalId : r.ProposalId.S,
          ProposalType : r.ProposalType.S,
          CreationTime : r.CreationTime.S,
          EndTimestamp : (r.EndTimestamp ? r.EndTimestamp.S : ''),
          Description : r.Description.S,
          Options : Options,
          WalletAddress : r.WalletAddress.S
        }

        callback(Proposal);
        return;

      }
    });
  }

  get = (req, res) => {
    // Retrieve the tag from our URL path
    this.debug('singleProposalQuery!');

    this.debug(req.query);

    if (!req.query || !req.query.proposal) {
      res.status(400);
      res.json({"error": "Request not valid!"});
      res.end(); return;
    }
    let proposalId = req.query.proposal;

    this._singleProposalQuery(proposalId, function(Proposal){
      if(Proposal && Proposal.error){
        res.status(500);
      }
      res.json(Proposal);
      res.end();
    });

  }
}
