#!/bin/bash
set -e

echo "========================================"
echo "Starting Fabric Network + HarvestCC Setup"
echo "========================================"

# -------------------------
# Environment Variables
# -------------------------
export FABRIC_CFG_PATH=$PWD/fabric-samples/config
export PATH=$PWD/fabric-samples/bin:$PATH

# Peers and Orderer TLS certs
ORDERER_CA=$PWD/fabric-samples/test-network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
PEER0_ORG1_CA=$PWD/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
CHANNEL_NAME="mychannel"
CHAINCODE_NAME="harvestCC"
CHAINCODE_VERSION="1.0"
CHAINCODE_LABEL="harvestCC_1"
CHAINCODE_PATH=$PWD/smartcontracts
SEQUENCE=1

# -------------------------
# Start Network
# -------------------------
echo "Starting Fabric test network..."
pushd fabric-samples/test-network
./network.sh up
popd

# -------------------------
# Create Channel (if not exists)
# -------------------------
echo "Checking if channel $CHANNEL_NAME exists..."
peer channel list | grep $CHANNEL_NAME || {
    echo "Channel $CHANNEL_NAME does not exist. Creating..."
    peer channel create -o localhost:7050 -c $CHANNEL_NAME \
      --ordererTLSHostnameOverride orderer.example.com \
      --outputBlock $PWD/fabric-samples/test-network/channel-artifacts/${CHANNEL_NAME}.block \
      --tls --cafile $ORDERER_CA
}

# -------------------------
# Join Peers to Channel (if not already)
# -------------------------
echo "Checking if peer0.org1 is in channel..."
peer channel list | grep $CHANNEL_NAME | grep "mychannel" || {
    echo "Joining peer0.org1 to channel..."
    peer channel join -b $PWD/fabric-samples/test-network/channel-artifacts/${CHANNEL_NAME}.block
}

# -------------------------
# Package Chaincode (if not exists)
# -------------------------
if [ ! -f smartcontracts.tar.gz ]; then
    echo "Packaging chaincode..."
    peer lifecycle chaincode package smartcontracts.tar.gz \
        --path $CHAINCODE_PATH \
        --lang node \
        --label $CHAINCODE_LABEL
else
    echo "Chaincode package smartcontracts.tar.gz already exists, skipping..."
fi

# -------------------------
# Install Chaincode (if not installed)
# -------------------------
echo "Checking if chaincode is installed..."
INSTALLED=$(peer lifecycle chaincode queryinstalled | grep $CHAINCODE_LABEL || true)
if [ -z "$INSTALLED" ]; then
    echo "Installing chaincode..."
    peer lifecycle chaincode install smartcontracts.tar.gz
else
    echo "Chaincode already installed, skipping..."
fi

# Get package ID for approve
PACKAGE_ID=$(peer lifecycle chaincode queryinstalled | grep $CHAINCODE_LABEL | awk -F', ' '{print $1}' | awk '{print $3}')

# -------------------------
# Approve Chaincode (idempotent)
# -------------------------
echo "Checking if chaincode approved for Org1..."
CHECK_APPROVAL=$(peer lifecycle chaincode checkcommitreadiness --channelID $CHANNEL_NAME \
    --name $CHAINCODE_NAME --version $CHAINCODE_VERSION --sequence $SEQUENCE --output json | grep true || true)
if [[ $CHECK_APPROVAL == *"Org1MSP"* ]]; then
    echo "Chaincode already approved by Org1, skipping..."
else
    echo "Approving chaincode for Org1..."
    peer lifecycle chaincode approveformyorg --channelID $CHANNEL_NAME \
        --name $CHAINCODE_NAME --version $CHAINCODE_VERSION \
        --package-id $PACKAGE_ID --sequence $SEQUENCE \
        -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.example.com \
        --tls --cafile $ORDERER_CA
fi

# -------------------------
# Commit Chaincode (if not committed)
# -------------------------
echo "Checking if chaincode committed..."
COMMITTED=$(peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME | grep $CHAINCODE_NAME || true)
if [ -z "$COMMITTED" ]; then
    echo "Committing chaincode..."
    peer lifecycle chaincode commit -o localhost:7050 \
        --channelID $CHANNEL_NAME --name $CHAINCODE_NAME \
        --version $CHAINCODE_VERSION --sequence $SEQUENCE \
        --tls --cafile $ORDERER_CA \
        --peerAddresses localhost:7051 \
        --tlsRootCertFiles $PEER0_ORG1_CA \
        --ordererTLSHostnameOverride orderer.example.com
else
    echo "Chaincode already committed, skipping..."
fi

# -------------------------
# Start Backend
# -------------------------
if [ -f backend/package.json ]; then
    echo "Starting backend..."
    pushd backend
    npm install
    npm run dev
    popd
else
    echo "Backend folder not found. Skipping backend start."
fi

echo "========================================"
echo "Fabric Network + Chaincode Setup Complete"
echo "========================================"
