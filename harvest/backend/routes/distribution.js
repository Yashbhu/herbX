const express = require('express');
const router = express.Router();
const { getContract } = require('../fabric/gateway');

router.post('/distribute', async (req, res) => {
  try {
    const { distributionId, processId, destination } = req.body;
    const contract = await getContract('distributionCC');
    await contract.submitTransaction('distributeProduct', distributionId, processId, destination);
    res.json({ success: true, message: 'Distribution recorded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const contract = await getContract('distributionCC');
    const result = await contract.evaluateTransaction('readDistribution', req.params.id);
    res.json(JSON.parse(result.toString()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
