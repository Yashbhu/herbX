const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const ccpPath = path.resolve(__dirname, '../config/connection-profile.json');
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

async function getContract(chaincodeName) {
  const walletPath = path.join(process.cwd(), 'wallet');
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  const identity = await wallet.get('appUser');
  if (!identity) {
    throw new Error('No identity found for appUser in wallet. Run registerUser.js first.');
  }

  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: 'appUser',
    discovery: { enabled: false } // simplify for local dev
  });

  const network = await gateway.getNetwork('mychannel');
  const contract = network.getContract(chaincodeName);

  return contract;
}

module.exports = { getContract };
