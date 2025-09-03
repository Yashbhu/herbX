'use strict';

const { Contract } = require('fabric-contract-api');

class LabContract extends Contract {

    // Initialize ledger (optional)
    async initLedger(ctx) {
        console.info('Lab ledger initialized');
    }

    // Mark a harvest batch as tested
    async testHarvest(ctx, batchId, testResult, testerName) {
        const harvestBytes = await ctx.stub.getState(batchId);
        if (!harvestBytes || harvestBytes.length === 0) {
            throw new Error(`Harvest batch ${batchId} does not exist`);
        }

        const harvest = JSON.parse(harvestBytes.toString());
        const mspId = ctx.clientIdentity.getMSPID();

        if (mspId !== 'LabOrgMSP') {
            throw new Error('Only Lab can mark as tested');
        }

        harvest.status = 'TESTED';
        harvest.testResult = testResult;  // e.g., "PASSED" or "FAILED"
        harvest.tester = testerName;
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

module.exports = LabContract;
