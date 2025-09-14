const express = require('express');
const bodyParser = require('body-parser');

const harvestRoutes = require('./routes/harvest');
const processorRoutes = require('./routes/processor');
const labRoutes = require('./routes/lab');
const distributionRoutes = require('./routes/distribution');

const app = express();
app.use(bodyParser.json());

app.use('/harvest', harvestRoutes);
app.use('/processor', processorRoutes);
app.use('/lab', labRoutes);
app.use('/distribution', distributionRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
