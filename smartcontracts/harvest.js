'use strict';

const { Contract } = require('fabric-contract-api');

class HarvestContract extends Contract {
    async initLedger(ctx) {
        console.info('Ledger initialized');
    }

    async createHarvest(ctx, batchId, farmerName, farmerMSP, species, weight, moisture, latitude, longitude, date) {
        const mspId = ctx.clientIdentity.getMSPID();
        if (!['FarmerOrgMSP', 'CoopOrgMSP'].includes(mspId)) {
            throw new Error('Only Farmer or Cooperative can create harvest');
        }

        const harvest = {
            batchId,
            farmerName,
            farmerMSP,
            species,
            weight: parseFloat(weight),
            moisture: parseFloat(moisture),
            location: { latitude, longitude },
            date,
            status: 'COLLECTED',
        };

        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(harvest)));
        return JSON.stringify(harvest);
    }

    async updateHarvestStatus(ctx, batchId, newStatus) {
        const harvestBytes = await ctx.stub.getState(batchId);
        if (!harvestBytes || harvestBytes.length === 0) {
            throw new Error(`Harvest batch ${batchId} does not exist`);
        }

        const harvest = JSON.parse(harvestBytes.toString());
        const mspId = ctx.clientIdentity.getMSPID();

        if (newStatus === 'IN_TRANSIT_TO_PROCESSOR' && mspId !== 'CoopOrgMSP') {
            throw new Error('Only Cooperative can mark as in transit');
        }
        if (newStatus === 'TESTED' && mspId !== 'LabOrgMSP') {
            throw new Error('Only Lab can mark as tested');
        }
        if (newStatus === 'PROCESSED' && mspId !== 'ProcessorOrgMSP') {
            throw new Error('Only Processor can mark as processed');
        }

        harvest.status = newStatus;
        harvest.lastUpdatedBy = mspId;
        harvest.lastUpdatedTime = new Date().toISOString();

        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(harvest)));
        return JSON.stringify(harvest);
    }

    async readHarvest(ctx, batchId) {
        const harvestBytes = await ctx.stub.getState(batchId);
        if (!harvestBytes || harvestBytes.length === 0) {
            throw new Error(`Harvest batch ${batchId} does not exist`);
        }
        return harvestBytes.toString();
    }

    async queryAllHarvests(ctx) {
        const iterator = await ctx.stub.getStateByRange('', '');
        const allResults = [];
        for await (const res of iterator) {
            allResults.push(JSON.parse(res.value.toString('utf8')));
        }
        return JSON.stringify(allResults);
    }
}

module.exports = HarvestContract;
