# 381project (group no.6)

## Project info
- Project name:
- Student Name(sid): Mak Yui Ming(13666578)<br/>
                     Chan Tsz Yin(13398567)<br/>
                     Chan Kin Pan(13378267)<br/>
                     Lee Chun Yin(13360891)<br/>

## The cloud-based server URL

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
  - Create booking
  - Booking list
  - Logout
  - Delete account
 
**4. Create booking**
- User can insert their name, phone number, booking size and choose date
- Then click create button
- After creating a booking, page will show "Create Successful"

**5. Booking list**
- User can review their inserted details
- User can edit or delete the inserted information by clicking the "edit" or "delete" button

**RESTful CRUD services**
- We provide the RESTful CRUD services to the users
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






