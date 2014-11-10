
install
signup √
verify
login √
sync
browse surveys
do a survey
set user preferences

0. Install app and start it for the first time
1. Create a new account √
2. Verify via email
3. Login √
4. Device syncs all associated surveys into Local Storage
5. Browse all your surveys
6. Select and answer a survey
7. See and edit your user data

0. Login as admin
1. Create a survey
2. Run the survey

0. Login as practitioner
1. Select a survey
1. Answer the survey

0. Server receives survey.
1. Server verifies survey.
2. Server stores survey

Create a Survey 101
-------------------

First the users goes to /surveys/new, where he finds a new form to enter
survey data (i.e. not item data!) like `title`, `description`, `deadline`
etc.

Then he can add items to the survey and associate a child.

The survey must be answered by *any* practitioner who is member of the group
the child belongs to.

<-- POST w/ a json representation of the survey (this is mostly form data),
containing everything you would need to playback this survey. This should
probably come from the front ends SurveyService.create() or similar.

A survey is created by sending the create-a-new-survey-form-data to /v1/surveys/create

When a survey is created (1) a new db entry in `surveys` is inserted.

A survey must contain at least one item.
