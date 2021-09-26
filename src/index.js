var ethUtil = require('ethereumjs-util')

window.ethUtil = ethUtil;
/*
import assert from 'assert'
import { isValidChecksumAddress, unpadBuffer, BN } from 'ethereumjs-util'
*/

function utilHashMessage(x) {

    const buff = Buffer.from(x, "utf-8");

    return ethUtil.keccak256(buff);
}

window.utilHashMessage = utilHashMessage;