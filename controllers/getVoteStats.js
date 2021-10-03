
let ControllerClass = require('../libs/ControllerClass');

module.exports = class getVoteStats extends ControllerClass {

  getAllData = async (params) => {
    const _getAllData = async (params, startKey) => {
      if (startKey) {
        params.ExclusiveStartKey = startKey
      }
      return dynamoDB.query(params).promise()
    }
    let lastEvaluatedKey = null
    let rows = []
    do {
      const result = await _getAllData(params, lastEvaluatedKey)
      rows = rows.concat(result.Items)
      lastEvaluatedKey = result.LastEvaluatedKey
    } while (lastEvaluatedKey)
    return rows
  }

  _getVoteStats = async (data, callback) => {

    var voteClass = data.voteClass;

    var params = {
      ExpressionAttributeValues: {
        ":v1": {
          S: voteClass
        }
      },
      KeyConditionExpression: "VoteClass = :v1",
      ScanIndexForward: false,
      TableName: 'Votes',
      IndexName: 'VoteClass-CreationTime-index'
    };


    ///

    var allData = null;
    try {
      allData = await this.getAllData(params);

    } catch (e) {
      console.error(e);
    }

    this.debug('yooo');
    this.debug(allData);
    this.debug('yooo...');

    var output = {
      sum: {},
      count: 0
    }

    var items = allData;
    if (items && items.length >= 1) {
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        this.debug(item);

        var voteClass = item.VoteClass.S;
        var voteValue = item.VoteValue.S;
        var voteWeight = item.VoteWeight.N;

        if (!output.sum[voteValue]) {
          output.sum[voteValue] = Number(voteWeight);
        } else {
          output.sum[voteValue] += Number(voteWeight);
        }

        output.count++;
      }
    }

    callback(null, output);

    // TODO: if 0 votes for vote class, consider looking up in Proposals table and add a field for that vote class with 0 count

    /*
    var output = {
        items: outputItems,
        count: data['Count'],
        scannedCount: data['ScannedCount']
    };

    callback(null, output);
    */

    // throw 'temp end';

    // return;
  }


  get = async (req, res) => {
    // Retrieve the tag from our URL path
    this.debug('getvotestats!');
    this.debug(req.params);
    this.debug(req.query);

    if (req.query) {
      var voteClass = req.query.voteClass;
      var queryInput = {
        voteClass: voteClass
      };

      if (voteClass) {
        try {
          this._getVoteStats(queryInput, function(err, output) {
            console.log('output!');
            console.log(output);

            res.json(output);
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
    // res.send('privacyvotequery!')
  }

}
