'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const ccpPath = path.resolve(__dirname, '../config/connection-profile.json');
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

async function getContract(chaincodeName, contractName) {
  // Load wallet
  const walletPath = path.resolve(__dirname, '../wallet');
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  // Check identity
  const identity = await wallet.get('appUser');
  if (!identity) {
    throw new Error('Identity "appUser" not found in wallet');
  }

  // Connect gateway
  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: 'appUser',
    discovery: { enabled: true, asLocalhost: true }
  });

  const network = await gateway.getNetwork('mychannel');
  const contract = network.getContract(chaincodeName, contractName); // Pass contractName

  return contract;
}

module.exports = { getContract };
