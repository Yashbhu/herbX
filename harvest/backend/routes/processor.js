const express = require('express');
const router = express.Router();
const { getContract } = require('../fabric/gateway');

router.post('/process', async (req, res) => {
  try {
    const { processId, harvestId, status } = req.body;
    const contract = await getContract('processorCC');
    await contract.submitTransaction('processHarvest', processId, harvestId, status);
    res.json({ success: true, message: 'Harvest processed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const contract = await getContract('processorCC');
    const result = await contract.evaluateTransaction('readProcess', req.params.id);
    res.json(JSON.parse(result.toString()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
