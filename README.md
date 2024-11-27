# 381project (group no.6)

## Project info
- Project name: Restaurant Booking System
- Student Name(sid): Mak Yui Ming(13666578)<br/>
                     Chan Tsz Yin(13398567)<br/>
                     Chan Kin Pan(13378267)<br/>
                     Lee Chun Yin(13360891)<br/>

## The cloud-based server URL

https://three81project-group6.onrender.com

## Operation guides

**1. Login pages**
- User can enter their User ID and Password
- User can create an account if user doesn't have an account

**2. Create an account**
- User can insert their User ID and Password to create an account
- If the User ID and Password are existed, page will show "Existing user id, please use another".
User need to register again
- After creating an account, page will show "Create Successful"
- User can login the account now

**3. Home Page**
- After login, user will directly visit home page<br/>
- the page will show "Welcome (userid)"
- At the top include several functions
  - Create booking (Have another button under the part of booking details)
  - Logout
  - Delete account
- At the middle 
  - Search function
  - Booking list
 
**4. Create booking**
- User can insert their name, phone number, booking size and choose date
- Then click create button
- After creating a booking, page will show "Create Successful"

**5. Booking list**
- User can review their inserted details
- User can edit or delete the inserted information by clicking the "edit" or "delete" button

**6. Search booking**
- User can search their booking after creating their booking details by typing their booking name

**7. Logout**
- User can click the Logout button to logout their account
- Then will back to the login page

**8. Delete account**
- User can click the Delete account button to delete their account
- Then will back to the login page and the account will be cleared

**RESTful CRUD services**
- We provide the RESTful CRUD services 
  - Create
  - Read
  - Update
  - Delete

Create 
```bash
curl -X POST http://localhost:3000/api/booking/Daniel -H "Content-Type: application/json" -d '{
  "mobile": "1234567890",
  "size": "2",
  "date": "2024-11-27"
}'
```
Read
```bash
curl -X GET http://localhost:3000/api/booking/Daniel
```
Update
```bash
curl -X PUT http://localhost:3000/api/booking/Daniel -H "Content-Type: application/json" -d '{
  "bookingname": "daniel88",
  "mobile": "0987654321",
  "size": "3",
  "date": "2024-12-01"
}'
```
Delete
```bash
curl -X DELETE http://localhost:3000/api/booking/daniel88
```






