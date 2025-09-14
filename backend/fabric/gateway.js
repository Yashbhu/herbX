const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

async function connectToNetwork(identityName) {
    const ccpPath = path.resolve(__dirname, '../config/connection-profile.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: identityName,
        discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork('mychannel'); // replace with your channel
    const contract = network.getContract('supplychain');  // your chaincode name

    return { gateway, network, contract };
}

module.exports = { connectToNetwork };
