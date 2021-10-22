
const BigNumber = require('bignumber.js');
const c = require('../public/constants');
let redis = false;

BigNumber.set({ DECIMAL_PLACES: 18 })

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

      let offset = 0;
      let token_txs = [];
      let page_size = 500;
      let transactions = null;
      do {
        transactions = await this.Moralis.Web3API.account.getTokenTransfers({
          chain: chain,
          address: user_address,
          from_block: token_first_block,
          limit: page_size,
          offset: offset
        });
        offset += page_size;

        token_txs = token_txs.concat(transactions.result.filter(item => (item.address == token_address.toLowerCase())));

      } while (transactions.total > offset)

      return token_txs;
    } catch (e) {
      console.error("Moralis API connection error!");
      console.error(e);

      return {"error": {msg: "Moralis API connection error.", class: "Moralis"}};

    }
  }

  getVoteWeightChain(transactions, user_address, chain, timestamp) {

    let MM_in = new BigNumber(0);
    let MM_out = new BigNumber(0);
    let MM_calc = new BigNumber(0);
    let MM_points = new BigNumber(0);
    let MM_balance = new BigNumber(0);
    let last_sell = false;
    let rows = [];

    //Set day for higher seller punishment. Selling resets the whole bag voting points.

    let punish_sell_startdate = (new Date('2021-10-23 2:30 UTC')).getTime(); //timestamp

    user_address = user_address.toLowerCase() //must be lowercase

    ////////////////////////////
    // Vote Weight calcuation //
    ////////////////////////////

    // It is a LIFO (Last-In, First-Out) calculation.
    // So we go in a reverse chronological order.

    if (transactions && transactions.length > 0) {
      for (const item of transactions) {
        let amount = new BigNumber(item.value).times(1e-18) //18 decimals

        // Note: It is possible to an address to transfer to itself.

        /////////////////////////////
        // Sells and Transfers Out //
        /////////////////////////////

        if (item.from_address == user_address) {
          MM_calc = MM_calc.minus(amount);
          MM_balance = MM_balance.minus(amount);
          let blck_tmstamp = Date.parse(item.block_timestamp);

          if(blck_tmstamp > punish_sell_startdate && !last_sell){
            last_sell = Math.round((timestamp - blck_tmstamp) / (1000 * 60 * 60 * 24));
          }
        }

        ///////////////////////////
        // Buys and Transfers In //
        ///////////////////////////

        if (item.to_address == user_address) {
          MM_balance = MM_balance.plus(amount);
          MM_calc = MM_calc.plus(amount);

          if (MM_calc > 0) {
            let blck_tmstamp = Date.parse(item.block_timestamp);
            let datediff = Math.round((timestamp - blck_tmstamp) / (1000 * 60 * 60 * 24));
            if(last_sell) {
                // If there is a sell, their point calculation day is reset
                datediff = last_sell;
            }

            let row_points = MM_calc.times(datediff);
            //console.log(item.block_timestamp + " + " + MM_calc + " * " + datediff + " days = " + (datediff * MM_calc) + " -> total: " + MM_points + "  -balance: "+MM_balance);

            rows.push({
              timestamp: item.block_timestamp,
              token_amount: MM_calc.toString(),
              days: datediff,
              points: row_points.toString()
            });

            MM_points = MM_points.plus(row_points);

            MM_calc = MM_calc.times(0); //reset calculation counter
          }
        }

      }
    }


    return {
      points_detail: rows,
      token_balance: MM_balance.toString(),
      points_balance: MM_points.toString(),
      chain: chain
    };

  }

  async getVoteWeight(user_address, timestamp, cache = false) {
    let voteWeightdetail = [];
    let voteWeight = new BigNumber(0);
    let tokenBalance = new BigNumber(0);
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
      voteWeight = voteWeight.plus(new BigNumber(item.points_balance));
      tokenBalance = tokenBalance.plus(new BigNumber(item.token_balance));
    });
    result = { token_balance: tokenBalance.toString(), voteWeight: voteWeight.toString(), details: voteWeightdetail };


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
