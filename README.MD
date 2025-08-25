
### Installation
```shell
git clone
cd basecamp-checkins
npm install
```


### Setup
1. Create a `.env` file in the root directory.
2. Add the following environment variables to the `.env` file:
```
CLIENT_ID=your_basecamp_account_id
CLIENT_SECRET=your_basecamp_access_token
REDIRECT_URI=your_basecamp_project_id
BASECAMP_PROJECT_ID=your_basecamp_checkin_id
BASECAMP_PROJECT_ID=your_basecamp_project_id
BASECAMP_BUCKET_ID=your_basecamp_bucket_id
BASECAMP_QUESTION_ID=your_basecamp_question_id

SET_ACCOUNT_ID=your_set_account_id
SET_AUTHORIZATION=Bearer xxxxx
SET_PROJECT_NAME=จ้าง Outsource โครงการ FundConnext ประจำปี 2025

```

### Start
```shell
node --env-file=.env index.js

```


### TODO
- [ ] confirm before send timesheet to SET 
- [ ] Add error handling
- [ ] Add logging
- [ ] Add unit tests
- [ ] Add more features
- [ ] Improve code quality