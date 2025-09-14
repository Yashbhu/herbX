const express = require('express');
const router = express.Router();
const { getContract } = require('../fabric/gateway');

router.post('/test', async (req, res) => {
  try {
    const { testId, harvestId, quality } = req.body;
    const contract = await getContract('labCC');
    await contract.submitTransaction('testHarvest', testId, harvestId, quality);
    res.json({ success: true, message: 'Lab test recorded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const contract = await getContract('labCC');
    const result = await contract.evaluateTransaction('readTest', req.params.id);
    res.json(JSON.parse(result.toString()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
