 Clone Hyperledger Fabric Samples
cd ~/xyz/harvest  # your project folder
git clone https://github.com/hyperledger/fabric-samples.git
cd fabric-samples


You’ll use:

fabric-samples/test-network/
smartcontracts/  # your folder with all 4 smart contracts + index.js

2️⃣ Install Fabric Binaries & Docker Images
curl -sSL https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/bootstrap.sh | bash -s -- 2.5.0 1.6.0


Downloads Fabric binaries (peer, orderer, etc.) and Docker images.

Add binaries to PATH:

export PATH=$PWD/bin:$PATH


Verify installation:

peer version

3️⃣ Start the Test Network
cd fabric-samples/test-network
./network.sh up createChannel -c mychannel -ca


-c mychannel → sets channel name to mychannel

-ca → generates Fabric CA for MSP identities

This starts all peers, orderer, CLI, and creates the channel.

4️⃣ Prepare Your Smart Contracts

Folder structure:

smartcontracts/
  harvest.js
  distributionContract.js
  labContract.js
  processorContract.js
  index.js
  package.json


index.js:

'use strict';
const Contract1 = require('./harvest.js');
const Contract2 = require('./distributionContract.js');
const Contract3 = require('./labContract.js');
const Contract4 = require('./processorContract.js');

module.exports.contracts = [Contract1, Contract2, Contract3, Contract4];


package.json:

{
  "name": "smartcontracts",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "fabric-ca-client": "^2.2.20",
    "fabric-network": "^2.2.20",
    "fabric-shim": "^2.5.8"
  }
}


Run npm install inside smartcontracts/ to install dependencies.

5️⃣ Deploy Chaincode
cd fabric-samples/test-network
./network.sh deployCC -ccn supplychain -ccp ../smartcontracts -ccl javascript


-ccn supplychain → chaincode name

-ccp ../smartcontracts → path to your smart contracts

-ccl javascript → language

✅ All 4 contracts are bundled under one chaincode.

6️⃣ Verify Installation on Peers

Set peer environment variables (example: Org1 Peer0):

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=$PWD/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=$PWD/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051


Query installed chaincodes:

peer lifecycle chaincode queryinstalled


You’ll see Package ID and label for supplychain. -






1️⃣ Current structure breakdown
backend/
├─ config/
│  └─ connection-profile.json    # Fabric network connection profile
├─ fabric/
│  └─ gateway.js                # Connects backend to Fabric network
├─ node_modules/
├─ routes/
│  ├─ distribution.js
│  ├─ harvest.js
│  ├─ lab.js
│  └─ processor.js
├─ wallet/                       # Stores identities for Fabric network
├─ index.js                       # Main backend entry (Express app)
├─ package.json
└─ package-lock.json

2️⃣ How it works

gateway.js

Reads the connection-profile.json in config/.

Connects to the Fabric network using the wallet identities.

Returns a contract object for submitting/evaluating chaincode transactions.

routes/*.js

Each file corresponds to a smart contract (Harvest, Distribution, Lab, Processor).

Defines REST APIs for actions like create, update, read, query all.

Uses gateway.js to get the Fabric contract and call transactions.

wallet/

Stores identities (e.g., appUser) needed to authenticate with Fabric peers.

index.js

Imports all routes and initializes the Express server.

Binds routes to URLs like /harvest, /distribution, etc.

package.json

Contains backend dependencies like fabric-network and express.