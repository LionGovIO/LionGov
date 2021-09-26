
const c = require('./public/constants');

module.exports = class Blockchain {
  constructor(RedisClient, Moralis) {

    console.log("blockchain module loaded");
    this.RedisClient = RedisClient;

    this.Moralis = Moralis;

  }

  async getAddrTokenTransactions (chain, token_address, token_first_block, user_address){ //token_address must be lower case

    const transactions = await this.Moralis.Web3API.account.getTokenTransfers({
      chain: chain,
      address: user_address,
      from_block: token_first_block });

    return transactions.result.filter(item => (item.address == token_address.toLowerCase()));

  }

  getVoteWeightChain(transactions, user_address, chain){

    let MM_in = 0;
    let MM_out = 0;
    let MM_calc = 0;
    let MM_points = 0;
    let MM_balance = 0;
    let rows = [];

    user_address = user_address.toLowerCase() //must be lowercase

    transactions.forEach(function(item, index, array) {
      let amount = parseInt(item.value) / 10 ** 18; //18 decimals

      if(item.from_address == user_address) {MM_calc -= amount; MM_balance -= amount;}
      if(item.to_address == user_address) {
        MM_balance += amount;
        MM_calc += amount;

        if (MM_calc > 0){
          let blck_tmstamp = Date.parse(item.block_timestamp);
          let datediff = Math.round((Date.now()-blck_tmstamp)/(1000*60*60*24));
          //console.log(item.block_timestamp + " + " + MM_calc + " * " + datediff + " days = " + (datediff * MM_calc) + " -> total: " + MM_points);
          rows.push({
            timestamp: item.block_timestamp,
            token_amount: MM_calc,
            days: datediff,
            points: datediff * MM_calc
          });
          MM_points += datediff * MM_calc;
          MM_calc = 0; //reset points
        }
      }
    });

    return {
      points_detail: rows,
      token_balance: MM_balance,
      points_balance: MM_points,
      chain: chain
    };

  }

  async getVoteWeight(user_address){
    let voteWeightdetail = [];
    let voteWeight = 0;
    let tokenBalance = 0;
    let chain = Object.keys(c.MM_contract);
    user_address = user_address.toLowerCase()

    let redis_vote_key = "VoteWeight-" + user_address;
    let result = await this.RedisClient.get(redis_vote_key); //tries to fetch cache

    if (result){
      return JSON.parse(result);
    }

    for (let i = 0; i < chain.length; i++) {
      let txs = await this.getAddrTokenTransactions (chain[i], c.MM_contract[chain[i]].address, c.MM_contract[chain[i]].first_block, user_address);
      voteWeightdetail.push(this.getVoteWeightChain (txs, user_address, chain[i]));
    }
    voteWeightdetail.forEach(item => {
      voteWeight += item.points_balance;
      tokenBalance += item.token_balance;
    });
    result = {details: voteWeightdetail, voteWeight: voteWeight, token_balance: tokenBalance};

    //Save cache
    this.RedisClient.set(redis_vote_key, JSON.stringify(result), {
      EX: 60*60*24 // 1 day in seconds
    });

    return result;
  }

};
