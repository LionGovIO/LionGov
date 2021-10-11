
const c = require('../public/constants');
let redis = false;

if(process.env.LIONGOV_CACHE_REDIS){
  redis = require('redis');
}

module.exports = class Blockchain {
  constructor(Moralis) {

    console.log("blockchain module loaded");

    if(parseInt(process.env.LIONGOV_CACHE_TIME) > 0){
      console.log("Caching enabled");
    }

    if (redis){
      this.RedisClient = redis.createClient({url: process.env.LIONGOV_CACHE_REDIS});
      this.RedisClient.on('error', (err) => console.log('Redis Client Error', err));
      this.RedisClient.connect().then(function(){
        console.log('Reddis Cache enabled and successfully connected');
      });
    }

    this.Moralis = Moralis;

  }

  async getAddrTokenTransactions(chain, token_address, token_first_block, user_address) { //token_address must be lower case

    try {

      const transactions = await this.Moralis.Web3API.account.getTokenTransfers({
        chain: chain,
        address: user_address,
        from_block: token_first_block
      });

      return transactions.result.filter(item => (item.address == token_address.toLowerCase()));
    } catch (e) {
      console.error("Moralis API connection error!");
      console.error(e);

      return {"error": {msg: "Moralis API connection error.", class: "Moralis"}};

    }
  }

  getVoteWeightChain(transactions, user_address, chain, timestamp) {

    let MM_in = 0;
    let MM_out = 0;
    let MM_calc = 0;
    let MM_points = 0;
    let MM_balance = 0;
    let last_sell = false;
    let rows = [];

    user_address = user_address.toLowerCase() //must be lowercase

    ////////////////////////////
    // Vote Weight calcuation //
    ////////////////////////////

    // It is a LIFO (Last-In, First-Out) calculation.
    // So we go in a reverse chronological order.

    if (transactions && transactions.length > 0) {
      transactions.forEach(function (item, index, array) {
        let amount = parseInt(item.value) / 10 ** 18; //18 decimals

        // Note: It is possible to an address to transfer to itself.

        /////////////////////////////
        // Sells and Transfers Out //
        /////////////////////////////

        if (item.from_address == user_address) {
          MM_calc -= amount;
          MM_balance -= amount;
          let blck_tmstamp = Date.parse(item.block_timestamp);
          last_sell = Math.round((timestamp - blck_tmstamp) / (1000 * 60 * 60 * 24));
        }

        ///////////////////////////
        // Buys and Transfers In //
        ///////////////////////////

        if (item.to_address == user_address) {
          MM_balance += amount;
          MM_calc += amount;

          if (MM_calc > 0) {
            let blck_tmstamp = Date.parse(item.block_timestamp);
            let datediff = Math.round((timestamp - blck_tmstamp) / (1000 * 60 * 60 * 24));
            //console.log(item.block_timestamp + " + " + MM_calc + " * " + datediff + " days = " + (datediff * MM_calc) + " -> total: " + MM_points);
            rows.push({
              timestamp: item.block_timestamp,
              token_amount: MM_calc,
              days: (last_sell ? last_sell : datediff),
              points: (last_sell ? last_sell : datediff) * MM_calc
            });
            MM_points += (last_sell ? last_sell : datediff) * MM_calc;
            MM_calc = 0; //reset calculation counter
          }
        }
      });
    }


    return {
      points_detail: rows,
      token_balance: MM_balance,
      points_balance: MM_points,
      chain: chain
    };

  }

  async getVoteWeight(user_address, timestamp, cache = false) {
    let voteWeightdetail = [];
    let voteWeight = 0;
    let tokenBalance = 0;
    let result = false;
    let cache_key = false;
    let chain = Object.keys(c.MM_contract);
    user_address = user_address.toLowerCase()

    /////////////////////////////////
    // Retrieves cache if possible //
    /////////////////////////////////
    if (cache && parseInt(process.env.LIONGOV_CACHE_TIME) > 0){
      cache_key = "VoteWeight-" + user_address;

      if(redis){
        let result = await this.RedisClient.get(cache_key); //tries to fetch cache

        if (result){
          return JSON.parse(result);
        }

      } else {

        //DynamoDB
        let params = {
          AttributesToGet: [
             'Value', 'ttl'
           ],
          TableName: 'Cache',
          Key : {
            'Key' : {
              'S' : cache_key
            }
          },
        };

        let r = await dynamoDB.getItem(params, async function(err, data) {
          if (err) {console.error(err);}
        }).promise();;

        if(Object.keys(r).length && r.Item){

          debug('seconds left in cache: '+ (parseInt(r.Item.ttl.N) - Math.round(Date.now() / 1000)))

          return JSON.parse(r.Item.Value.S);
        }
      }
    }


    //Go through all transactions
    for (const cha of chain) {
      let txs = await this.getAddrTokenTransactions(cha, c.MM_contract[cha].address, c.MM_contract[cha].first_block, user_address);
      if (txs.error){return txs;}
      voteWeightdetail.push(this.getVoteWeightChain(txs, user_address, cha, timestamp));
    }

    //Sum balances
    voteWeightdetail.forEach(item => {
      voteWeight += item.points_balance;
      tokenBalance += item.token_balance;
    });
    result = { token_balance: tokenBalance, voteWeight: voteWeight, details: voteWeightdetail };


    //////////////////
    // Stores cache //
    //////////////////
    if (cache && parseInt(process.env.LIONGOV_CACHE_TIME) > 0){
      if(redis) { //Save cache
        if (this.RedisClient.connected){
          this.RedisClient.set(cache_key, JSON.stringify(result), {
            EX: parseInt(process.env.LIONGOV_CACHE_TIME) // in seconds
          });
        }
      } else { //dynamoDB Cache

        let params = {
          TableName: "Cache",
          Item: {
            "Key": {
              S: cache_key
            },
            "Value": {
              S: JSON.stringify(result)
            },
            "ttl": {
              N: (Math.round(Date.now() / 1000) + parseInt(process.env.LIONGOV_CACHE_TIME)).toString()
            },
          },
          ExpressionAttributeNames: {
            "#ky":"Key"
          },
          ConditionExpression: 'attribute_not_exists(#ky)'
        };

        dynamoDB.putItem(params, function(err, data) {
          if (err) {
            debug(err);
            // ConditionalCheckFailedException: The conditional request failed
            // This is the return when it was already stored
          } else {
            debug(cache_key + ' cached in dynamoDB');
          }
        });

      }
    } // end Caching


    return result;
  }

};
