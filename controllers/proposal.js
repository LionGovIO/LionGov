let ControllerClass = require('../libs/ControllerClass');

const singleProposalQuery = new (require('./singleProposalQuery'))();

const path = require('path');
const fs = require('fs');

function escapeHtml(s) {
    return s.replace(
        /[^0-9A-Za-z ]/g,
        c => "&#" + c.charCodeAt(0) + ";"
    );
}

module.exports = class getVoteWeight extends ControllerClass {

  get = (req, res) => {

    const filePath = path.resolve(__dirname, '../dist/index.html');

    // read in the index.html file
    fs.readFile(filePath, 'utf8', function (err,data) {
      if (err) {
        res.send("Error");
        return console.log(err);
      }

      singleProposalQuery._singleProposalQuery(req.params.uid, function(Proposal){

        if(!Proposal.error){

          // Adds Proposal Title to Social Link shares

          let title = escapeHtml(Proposal.Title) + ' | LionGov';

          data = data.replace(/(<title>)(.*?)(<\/title>)/, '$1'+ title +'$3')
                     .replace(/(og:title".*?")(.*?)("\/>)/, '$1'+ title +'$3')
                     .replace(/(og:description".*?")(.*?)("\/>)/, '$1'+ escapeHtml(Proposal.Description) +'$3');
        }

        res.send(data);
        res.end();

      });

    });

  }
}
