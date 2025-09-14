const express = require('express');
const router = express.Router();
const { getContract } = require('../fabric/gateway');

// Create a harvest
router.post('/create', async (req, res) => {
  try {
    const { harvestId, cropType, quantity } = req.body;
    const contract = await getContract('harvestCC');
    await contract.submitTransaction('createHarvest', harvestId, cropType, quantity);
    res.json({ success: true, message: 'Harvest created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read a harvest
router.get('/:id', async (req, res) => {
  try {
    const contract = await getContract('harvestCC');
    const result = await contract.evaluateTransaction('readHarvest', req.params.id);
    res.json(JSON.parse(result.toString()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Query all harvests
router.get('/', async (req, res) => {
  try {
    const contract = await getContract('harvestCC');
    const result = await contract.evaluateTransaction('queryAllHarvests');
    res.json(JSON.parse(result.toString()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
