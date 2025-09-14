'use strict';

const Contract1 = require('./harvest.js');
const Contract2 = require('./distributionContract.js')
const Contract3 = require('./labContract.js');
const Contract4 = require('./processorContract.js');

module.exports.contracts = [Contract1, Contract2, Contract3, Contract4];
