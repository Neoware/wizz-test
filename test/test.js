const request = require('supertest');
const assert = require('assert');
const app = require('../index');

/**
 * Testing create game endpoint
 */
describe('POST /api/games', () => {
  const data = {
    publisherId: '1234567890',
    name: 'Test App',
    platform: 'ios',
    storeId: '1234',
    bundleId: 'test.bundle.id',
    appVersion: '1.0.0',
    isPublished: true,
  };
  it('respond with 200 and an object that matches what we created', (done) => {
    request(app)
      .post('/api/games')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, result) => {
        if (err) return done(err);
        assert.strictEqual(result.body.publisherId, '1234567890');
        assert.strictEqual(result.body.name, 'Test App');
        assert.strictEqual(result.body.platform, 'ios');
        assert.strictEqual(result.body.storeId, '1234');
        assert.strictEqual(result.body.bundleId, 'test.bundle.id');
        assert.strictEqual(result.body.appVersion, '1.0.0');
        assert.strictEqual(result.body.isPublished, true);
        return done();
      });
  });
});

/**
 * Testing get all games endpoint
 */
describe('GET /api/games', () => {
  it('respond with json containing a list that includes the game we just created', (done) => {
    request(app)
      .get('/api/games')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, answer) => {
        if (err) return done(err);
        const result = answer.body.find((elem) => elem.name === 'Test App');
        assert.strictEqual(result.publisherId, '1234567890');
        assert.strictEqual(result.name, 'Test App');
        assert.strictEqual(result.platform, 'ios');
        assert.strictEqual(result.storeId, '1234');
        assert.strictEqual(result.bundleId, 'test.bundle.id');
        assert.strictEqual(result.appVersion, '1.0.0');
        assert.strictEqual(result.isPublished, true);
        return done();
      });
  });
});

/**
 * Testing update game endpoint
 */
describe('PUT /api/games/6', () => {
  const data = {
    id: 1,
    publisherId: '999000999',
    name: 'Test App Updated',
    platform: 'android',
    storeId: '5678',
    bundleId: 'test.newBundle.id',
    appVersion: '1.0.1',
    isPublished: false,
  };
  it('respond with 200 and an updated object', (done) => {
    request(app)
      .put('/api/games/6')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, result) => {
        if (err) return done(err);
        assert.strictEqual(result.body.publisherId, '999000999');
        assert.strictEqual(result.body.name, 'Test App Updated');
        assert.strictEqual(result.body.platform, 'android');
        assert.strictEqual(result.body.storeId, '5678');
        assert.strictEqual(result.body.bundleId, 'test.newBundle.id');
        assert.strictEqual(result.body.appVersion, '1.0.1');
        assert.strictEqual(result.body.isPublished, false);
        return done();
      });
  });
});

/**
 * Testing delete game endpoint
 */
describe('DELETE /api/games/6', () => {
  it('respond with 200', (done) => {
    request(app)
      .delete('/api/games/6')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });
});

/**
 * Testing get all games endpoint
 */
describe('GET /api/games', () => {
  it('respond with json containing no games', (done) => {
    request(app)
      .get('/api/games')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        const expected = [
          { name: 'Helix Jump', platform: 'ios' },
          { name: 'Helix Jump', platform: 'android' },
          { name: 'Swing Rider', platform: 'ios' },
          { name: 'Swing Rider', platform: 'android' },
          { name: 'Car Crash!', platform: 'ios' },
        ];

        const simplified = res.body.map((g) => ({ name: g.name, platform: g.platform }));
        assert.deepStrictEqual(simplified, expected);
        return done();
      });
  });
});

/**
 * Testing get all games endpoint through search endpoint with no filters
 */
describe('POST /api/games/search', () => {
  it('returns all games when no filter is given', (done) => {
    request(app)
      .post('/api/games/search')
      .send({})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        const expected = [
          { name: 'Helix Jump', platform: 'ios' },
          { name: 'Helix Jump', platform: 'android' },
          { name: 'Swing Rider', platform: 'ios' },
          { name: 'Swing Rider', platform: 'android' },
          { name: 'Car Crash!', platform: 'ios' },
        ];

        const simplified = res.body.map((g) => ({ name: g.name, platform: g.platform }));
        assert.deepStrictEqual(simplified, expected);
        return done();
      });
  });

  /**
  * Testing get games with a partial match name filter
  */
  it('filters games by name (partial match)', (done) => {
    request(app)
      .post('/api/games/search')
      .send({ name: 'Helix' })
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        const expected = [
          { name: 'Helix Jump', platform: 'ios' },
          { name: 'Helix Jump', platform: 'android' },
        ];

        const simplified = res.body.map((g) => ({ name: g.name, platform: g.platform }));
        assert.deepStrictEqual(simplified, expected);
        return done();
      });
  });

  /**
  * Testing get games with an exact match name filter
  */
  it('filters games by name (exact match)', (done) => {
    request(app)
      .post('/api/games/search')
      .send({ name: 'Helix Jump' })
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        const expected = [
          { name: 'Helix Jump', platform: 'ios' },
          { name: 'Helix Jump', platform: 'android' },
        ];

        const simplified = res.body.map((g) => ({ name: g.name, platform: g.platform }));
        assert.deepStrictEqual(simplified, expected);
        return done();
      });
  });

  /**
  * Testing get games with an exact match platform filter
  */
  it('filters games by platform (exact match)', (done) => {
    request(app)
      .post('/api/games/search')
      .send({ platform: 'ios' })
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        const expected = [
          { name: 'Helix Jump', platform: 'ios' },
          { name: 'Swing Rider', platform: 'ios' },
          { name: 'Car Crash!', platform: 'ios' },
        ];

        const simplified = res.body.map((g) => ({ name: g.name, platform: g.platform }));
        assert.deepStrictEqual(simplified, expected);
        return done();
      });
  });

  it('filters games by both name and platform', (done) => {
    request(app)
      .post('/api/games/search')
      .send({ name: 'Swing', platform: 'android' })
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        const expected = [
          { name: 'Swing Rider', platform: 'android' },
        ];

        const simplified = res.body.map((g) => ({ name: g.name, platform: g.platform }));
        assert.deepStrictEqual(simplified, expected);
        return done();
      });
  });
});
