const express = require('express');
const router = express.Router();
const { connectToNetwork } = require('../fabric/gateway');


router.post('/create', async (req, res) => {
    try {
        const { identity, batchId, farmerName, farmerMSP, species, weight, moisture, latitude, longitude, date } = req.body;
        const { contract, gateway } = await connectToNetwork(identity);

        const result = await contract.submitTransaction('createHarvest', batchId, farmerName, farmerMSP, species, weight, moisture, latitude, longitude, date);
        await gateway.disconnect();
        res.json({ success: true, result: JSON.parse(result.toString()) });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
