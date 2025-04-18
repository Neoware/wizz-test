# Candidate Takehome Exercise
This is a simple backend engineer take-home test to help assess candidate skills and practices.  We appreciate your interest in Voodoo and have created this exercise as a tool to learn more about how you practice your craft in a realistic environment.  This is a test of your coding ability, but more importantly it is also a test of your overall practices.

If you are a seasoned Node.js developer, the coding portion of this exercise should take no more than 1-2 hours to complete.  Depending on your level of familiarity with Node.js, Express, and Sequelize, it may not be possible to finish in 2 hours, but you should not spend more than 2 hours.  

We value your time, and you should too.  If you reach the 2 hour mark, save your progress and we can discuss what you were able to accomplish. 

The theory portions of this test are more open-ended.  It is up to you how much time you spend addressing these questions.  We recommend spending less than 1 hour.  


For the record, we are not testing to see how much free time you have, so there will be no extra credit for monumental time investments.  We are looking for concise, clear answers that demonstrate domain expertise.

# Project Overview
This project is a simple game database and consists of 2 components.  

The first component is a VueJS UI that communicates with an API and renders data in a simple browser-based UI.

The second component is an Express-based API server that queries and delivers data from an SQLite data source, using the Sequelize ORM.

This code is not necessarily representative of what you would find in a Voodoo production-ready codebase.  However, this type of stack is in regular use at Voodoo.

# Project Setup
You will need to have Node.js, NPM, and git installed locally.  You should not need anything else.

To get started, initialize a local git repo by going into the root of this project and running `git init`.  Then run `git add .` to add all of the relevant files.  Then `git commit` to complete the repo setup.  You will send us this repo as your final product.
  
Next, in a terminal, run `npm install` from the project root to initialize your dependencies.

Finally, to start the application, navigate to the project root in a terminal window and execute `npm start`

You should now be able to navigate to http://localhost:3000 and view the UI.

You should also be able to communicate with the API at http://localhost:3000/api/games

If you get an error like this when trying to build the project: `ERROR: Please install sqlite3 package manually` you should run `npm rebuild` from the project root.

# Practical Assignments
Pretend for a moment that you have been hired to work at Voodoo.  You have grabbed your first tickets to work on an internal game database application. 

#### FEATURE A: Add Search to Game Database
The main users of the Game Database have requested that we add a search feature that will allow them to search by name and/or by platform.  The front end team has already created UI for these features and all that remains is for the API to implement the expected interface.  The new UI can be seen at `/search.html`

The new UI sends 2 parameters via POST to a non-existent path on the API, `/api/games/search`

The parameters that are sent are `name` and `platform` and the expected behavior is to return results that match the platform and match or partially match the name string.  If no search has been specified, then the results should include everything (just like it does now).

Once the new API method is in place, we can move `search.html` to `index.html` and remove `search.html` from the repo.

#### FEATURE B: Populate your database with the top 100 apps
Add a populate button that calls a new route `/api/games/populate`. This route should populate your database with the top 100 games in the App Store and Google Play Store.
To do this, our data team have put in place 2 files at your disposal in an S3 bucket in JSON format:

- https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/android.top100.json
- https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/ios.top100.json

# Theory Assignments
You should complete these only after you have completed the practical assignments.

The business goal of the game database is to provide an internal service to get data for all apps from all app stores.  
Many other applications at Voodoo will use consume this API.

#### Question 1:
We are planning to put this project in production. According to you, what are the missing pieces to make this project production ready? 
Please elaborate an action plan.

If I focus on the back-end part of this project:

## Code Structure & Maintainability:

- Currently, a large amount of business logic lives directly inside index.js. This should be refactored into a layered / hexagonal architecture
to improve readability, testability, and long-term maintainability.

- Same thing for tests that should be split following the app structure

## API Documentation & Versioning:

- Document the API with Swagger/OpenAPI for other teams to consume the API in an easy way.

- Version the API endpoints (e.g., /v1/games). So we can handle future API breaking changes gracefully.

## Security

- A rate limiting should be put in place to not get overwhelmed by other app requests (express-rate-limit).

- Implement an authentication mechanism like JWT so that the API is not opened to the world and so we can log access to it.

- Better validation of input in the API using library like Joi or zod

## Environment handling :

- The environment setup could be handled on a per branch basis

## Database

- SQLite is nice for a POC, but it won't scale well with complexity and performance

- Switch to a more robust database like PostgreSQL

## Monitoring

- So far logs are handled with console.log statement, we should switch to a real logging library like winston

- A healthcheck endpoint could have benefit to verify service uptime 

## Code quality

- Introduce CI/CD pipelines on the repo to verify what is done at every changes (tests, linter etc.)

- add git hooks to enforce eslint and other verifications on commit/push

## Deployment :

- Deploy the app as a docker container to avoid infrastructure / os issues

## Performance :

- Add load testing tests to know the limit of our service and the how to size it

- Add some caching layer in front of the API for common requests (get all apps for example)

- Introduce some horizontal scaling capability if necessary

## Resilience :

- Add a backup of the database and/or the API if the service is critical

- Setup some alerting on high resources usage (IO, ram, CPU)

## 🔧 Backend Improvement Action Plan

This action plan focuses on improving the back-end part of the project in terms of scalability, security, maintainability, and production-readiness.

---

### 🔹 Phase 1 – Core Architecture & Code Quality (High Priority)

**1. Refactor to Layered Architecture**
- Move logic out of `index.js` into:
  - `routes/` – Express route handlers
  - `controllers/` – request handling
  - `services/` – business logic
  - `models/` – Sequelize models (already in place)

**2. Reorganize Tests**
- Mirror app structure inside a `tests/` directory
- Create unit tests for controllers/services
- Create e2e tests

**3. Linting & Formatting**
- Add ESLint and Prettier configuration files
- Standardize code style across the project

**4. Git Hooks**
- Use `husky` to enforce linting and testing before commit/push

---

### 🔹 Phase 2 – API Maturity & DevOps Setup

**1. API Documentation**
- Use Swagger/OpenAPI with `swagger-jsdoc` + `swagger-ui-express`
- Document endpoints, parameters, and responses

**2. API Versioning**
- Prefix routes with `/api/v1/` to prepare for future breaking changes

**3. Continuous Integration**
- Add GitHub Actions or GitLab CI to run:
  - Tests
  - Lint checks
  - (Optional) Code coverage reports

**4. Dockerization**
- Create a `Dockerfile` and `docker-compose.yml`
- Ensure consistent environments across development and deployment

---

### 🔹 Phase 3 – Security & Performance

**1. Authentication & Authorization**
- Implement JWT-based authentication
- Protect routes and add access logging

**2. Rate Limiting**
- Use `express-rate-limit` to prevent abuse

**3. Input Validation**
- Use `zod` or `joi` to validate all request data (body, params, query)

**4. Performance Optimization**
- Cache frequent endpoints like `GET /api/games` using solution like varnish
- Use load testing tools (e.g. Gatling) to benchmark performance

---

### 🔹 Phase 4 – Production Readiness

**1. Logging**
- Replace `console.log` with a proper logger (e.g., `winston` or `pino`)
- Add timestamped, leveled, and formatted logs

**2. Monitoring**
- Add a `/health` endpoint to report uptime and DB status

**3. Database Upgrade**
- Migrate from SQLite to PostgreSQL using Sequelize
- Manage configs per environment with `.env`

**4. Backups & Alerts**
- Automate database backups (e.g., cron + S3)
- Setup alerting for errors or high resource usage

---

### 🔹 Phase 5 – Scalability & Resilience

**1. Horizontal Scalability**
- Use PM2 or deploy behind a load balancer
- Plan for container orchestration (Docker Swarm, Kubernetes)

**2. Uptime Monitoring**
- Add tools like UptimeRobot or StatusCake for availability checks

**3. Backup Strategy**
- Ensure regular and secure backups of the DB and optionally logs

---

#### Question 2:
Let's pretend our data team is now delivering new files every day into the S3 bucket, and our service needs to ingest those files
every day through the populate API. Could you describe a suitable solution to automate this? Feel free to propose architectural changes.


## ✅ Automating Daily Ingestion from S3 – Proposed Solution

To automate the ingestion of daily JSON files from the S3 bucket, we need to decouple ingestion logic from manual API calls, implement event-driven automation, and ensure robustness for a production-ready system.

### Suggested Architecture

Ingestion becomes a background job, decoupled from user interaction. This process can be triggered either on a fixed schedule (e.g., every night at 3AM) or through a serverless event (like AWS Lambda). The key idea is to isolate ingestion logic and make it callable independently.

### Step-by-Step Implementation

1. **Extract Ingestion Logic to a Service Module**

   Refactor the logic currently inside the `/api/games/populate` route into a separate module (e.g., `services/ingestionService.js`). This makes the ingestion process reusable both from the HTTP API and automated background tasks.

   This module should:
   - Download and parse S3 JSON files
   - Flatten and format the data (limiting to 100 entries per platform)
   - Insert into the database using Sequelize

2. **Introduce a Scheduler**

   Two viable options here:

   - **Option A: Node-based Cron Job**
     Use `node-cron` or `Agenda.js` to run the ingestion function daily at a specific time.

     Example:
     ```js
     const cron = require('node-cron');
     const { ingestLatestFiles } = require('./services/ingestionService');

     cron.schedule('0 3 * * *', async () => {
       console.log('Running daily ingestion...');
       await ingestLatestFiles();
     });
     ```
   - **Option B: AWS Lambda + S3 Events notifications **
     Use AWS Lambda triggered by putObject events on the targeted files. The Lambda function downloads the latest files and either:
     - Sends them to the backend API
     - Or runs the ingestion logic directly if the logic is duplicated or extracted into a shared library

     This option is more scalable and production-ready.

3. **Preparing data**

We need to have a unique constraint set on the appId and platform couple in the database and only update values for these entries.
Furthermore, we need to remove entries that are not in the top 100 anymore, by computing a diff between new entries keys and old ones.

4. **Use a Naming Convention for S3 Files**

Ensure that the data team uses predictable, timestamped file names, such as:
s3://your-bucket-name/ios/top100_YYYY-MM-DD.json 
s3://your-bucket-name/android/top100_YYYY-MM-DD.json

This makes it easy for the ingestion service to dynamically compute the URL for today's files.

5. **Error Handling and Observability**

Add proper logging using a structured logger (e.g., `winston`). 

In case of errors:
- Retry failed downloads or inserts (basic retry logic with backoff)
- Send an alert via email or Slack (using a webhook)
- Track ingestion status (e.g., last success time, errors, number of entries)
- All the operations on the database should be wrapped in a transaction to avoid partial state issues.

6. **Monitoring and Reporting**

Add an endpoint such as `/ingestion/status` to report the latest ingestion activity. This can help track whether everything is running as expected. Alternatively, integrate logs and metrics into a centralized dashboard like Grafana.

7. **Make the System Resilient and Idempotent**

- Avoid re-processing the same data multiple times (e.g., track ingested dates) with a batch management solution a la spring batch
- Consider backfilling support for missed days


