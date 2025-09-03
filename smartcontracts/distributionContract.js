'use strict';

const { Contract } = require('fabric-contract-api');

class DistributionContract extends Contract {

    // Initialize ledger (optional)
    async initLedger(ctx) {
        console.info('Distribution ledger initialized');
    }

    // Mark a harvest batch as shipped
    async shipProduct(ctx, batchId, distributorName) {
        const harvestBytes = await ctx.stub.getState(batchId);
        if (!harvestBytes || harvestBytes.length === 0) {
            throw new Error(`Harvest batch ${batchId} does not exist`);
        }

        const harvest = JSON.parse(harvestBytes.toString());
        const mspId = ctx.clientIdentity.getMSPID();

        if (mspId !== 'ProcessorOrgMSP') {
            throw new Error('Only Processor can mark as shipped');
        }

        harvest.status = 'SHIPPED';
        harvest.distributor = distributorName;
        harvest.lastUpdatedBy = mspId;
        harvest.lastUpdatedTime = new Date().toISOString();

        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(harvest)));
        return JSON.stringify(harvest);
    }

    // Mark a harvest batch as delivered
    async deliverProduct(ctx, batchId, receiverName) {
        const harvestBytes = await ctx.stub.getState(batchId);
        if (!harvestBytes || harvestBytes.length === 0) {
            throw new Error(`Harvest batch ${batchId} does not exist`);
        }

        const harvest = JSON.parse(harvestBytes.toString());
        const mspId = ctx.clientIdentity.getMSPID();

        if (mspId !== 'DistributorOrgMSP') {
            throw new Error('Only Distributor can mark as delivered');
        }

        harvest.status = 'DELIVERED';
        harvest.receiver = receiverName;
        harvest.lastUpdatedBy = mspId;
        harvest.lastUpdatedTime = new Date().toISOString();

        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(harvest)));
        return JSON.stringify(harvest);
    }

    // Read harvest details
    async readHarvest(ctx, batchId) {
        const harvestBytes = await ctx.stub.getState(batchId);
        if (!harvestBytes || harvestBytes.length === 0) {
            throw new Error(`Harvest batch ${batchId} does not exist`);
        }
        return harvestBytes.toString();
    }

    // Query all harvests
    async queryAllHarvests(ctx) {
        const iterator = await ctx.stub.getStateByRange('', '');
        const allResults = [];
        for await (const res of iterator) {
            allResults.push(JSON.parse(res.value.toString('utf8')));
        }
        return JSON.stringify(allResults);
    }
}

module.exports = DistributionContract;
