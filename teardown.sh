#!/bin/bash

echo "🛑 Tearing down the Fabric network..."

# Go to the test-network directory
cd ./fabric-samples/test-network

# Use the network.sh script to bring down the network
./network.sh down

# Optional: Clean up any generated wallet/connection profiles in the backend
cd ../../backend
rm -f connection-org1.json
rm -rf wallet/

cd .. # Back to root
echo "✅ Network cleaned up successfully."
