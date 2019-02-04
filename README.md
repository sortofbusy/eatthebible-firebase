# Eat The Bible

[Eat The Bible](https://eatthebible.com) is a serverless React SPA built on Google Firebase. It's designed to help people manage a Bible reading schedule that allows you the flexibility to keep track of multiple reading plans. You could read the New Testament in Greek while reading Joshua through Isaiah in Dutch; it's up to you!

## Features 
* Sign in with Google, Facebook, or email
* Use one of the template reading plans
* Choose from 49 translations of the Bible in 34 languages
* Manually enter chapters you've read

## API Structure
### Users
* GET /users/me - returns the logged in user
* PUT /users - updates the current user
* DELETE /users/accounts - removes one of a user's OAuth providers
* POST /users/password - changes a user's password

### Authentication

### Plans
* GET /plans - returns all plans
* POST /plans - creates a new plan
* GET /plans/:planId - returns one plan
* PUT /plans/:planId - updates one plan
* DELETE /plans/:planId - deletes one plan
* GET /plans/:planId/today - returns chapters read today in this plan 

### Chapters
* GET /chapters - returns all chapters (of the authenticated user)
* POST /chapters - creates a new chapter (of the authenticated user)
* GET /reference - returns a reference to a chapter  MESSY
* GET /chapters/:chapterId - reads one chapter
* PUT /chapters/:chapterId - updates one chapter
* DELETE /chapters/:chapterId - deletes one chapter
* GET /chapters/group/:groupId - returns recently read chapters by members of this group WRONG

### Groups
* GET /groups - returns all groups
* POST /groups - creates a new group
* GET /groups/:groupId - returns one group
* PUT /groups/:groupId - updates one group
* DELETE /groups/:groupId - deletes one group
* GET /groups/:groupId/chapters - returns recently read chapters in this group
* GET /groups/:groupId/messages - returns recent messages in this group

### Messages
* GET /messages - returns all messages
* POST /messages - creates a new message
* GET /messages/:messageId - returns one message
* PUT /messages/:messageId - updates one message
* DELETE /messages/:messageId - deletes one message

### Badges
* GET /badges - returns all badges
* POST /badges - creates a new badge
* GET /badges/:badgeId - returns one badge
* PUT /badges/:badgeId - updates one badge
* DELETE /badges/:badgeId - deletes one badge

## License
(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
