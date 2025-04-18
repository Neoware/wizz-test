const express = require('express');
const bodyParser = require('body-parser');
const { Op } = require('sequelize');
const db = require('./models');

const app = express();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/static`));

app.get('/api/games', (req, res) => db.Game.findAll()
  .then((games) => res.send(games))
  .catch((err) => {
    console.log('There was an error querying games', JSON.stringify(err));
    return res.send(err);
  }));

app.post('/api/games', (req, res) => {
  const { publisherId, name, platform, storeId, bundleId, appVersion, isPublished } = req.body;
  return db.Game.create({ publisherId, name, platform, storeId, bundleId, appVersion, isPublished })
    .then((game) => res.send(game))
    .catch((err) => {
      console.log('***There was an error creating a game', JSON.stringify(err));
      return res.status(400).send(err);
    });
});

app.delete('/api/games/:id', (req, res) => {
  // eslint-disable-next-line radix
  const id = parseInt(req.params.id);
  return db.Game.findByPk(id)
    .then((game) => game.destroy({ force: true }))
    .then(() => res.send({ id }))
    .catch((err) => {
      console.log('***Error deleting game', JSON.stringify(err));
      res.status(400).send(err);
    });
});

app.put('/api/games/:id', (req, res) => {
  // eslint-disable-next-line radix
  const id = parseInt(req.params.id);
  return db.Game.findByPk(id)
    .then((game) => {
      const { publisherId, name, platform, storeId, bundleId, appVersion, isPublished } = req.body;
      return game.update({ publisherId, name, platform, storeId, bundleId, appVersion, isPublished })
        .then(() => res.send(game))
        .catch((err) => {
          console.log('***Error updating game', JSON.stringify(err));
          res.status(400).send(err);
        });
    });
});

app.post('/api/games/search', (req, res) => {
  const { name, platform } = req.body;

  const whereClause = {
    ...(name && { name: { [Op.like]: `%${name}%` } }),
    ...(platform && { platform: { [Op.like]: platform } }),
  };
  db.Game.findAll({ where: whereClause })
    .then((games) => res.send(games))
    .catch((err) => {
      console.log('There was an error querying games', JSON.stringify(err));
      return res.send(err);
    });
});

const urls = [
  'https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/ios.top100.json',
  'https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/android.top100.json',
];

const fetchAndPrepareApps = async (url, limit) => {
  const response = await fetch(url);
  const raw = await response.json();
  const apps = raw.flat().slice(0, limit);

  return apps.map((appToInsert) => ({
    publisherId: appToInsert.publisher_id,
    name: appToInsert.name,
    platform: appToInsert.os,
    storeId: appToInsert.app_id,
    bundleId: appToInsert.bundle_id,
    appVersion: appToInsert.version,
    isPublished: true,
    createdAt: appToInsert.release_date,
    updatedAt: appToInsert.updated_date,
  }));
};

app.post('/api/games/populate', async (req, res) => {
  try {
    const allApps = await Promise.all(urls.map((url) => fetchAndPrepareApps(url, 100)));
    const appsToInsert = allApps.flat();

    await db.Game.bulkCreate(appsToInsert, { ignoreDuplicates: true });

    res.status(200).json({ inserted: appsToInsert.length });
  } catch (err) {
    console.error('Populate error:', err);
    res.status(500).json({ error: 'Failed to populate games' });
  }
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});

module.exports = app;
