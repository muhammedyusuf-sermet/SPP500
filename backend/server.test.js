// START Registration Tests

// when a new registration entry with non-existing 
// email and username is posted to the route 
// expect statuscode to be 201
// expect result to be "success"

// when a new registration entry with existing 
// email is posted to the route 
// expect statuscode to be 400
// expect result to be "already have this email"

// when a new registration entry with existing 
// username is posted to the route 
// expect statuscode to be 400
// expect result to be "already have this username"

// when a new registration entry with non-valid 
// email is posted to the route 
// expect statuscode to be 400
// expect result to be "email is not valid"

// when a new registration entry with a password
// with a length of less than 8 
// expect statuscode to be 400
// expect result to be "password is not strong enough"

// END Registration Tests
