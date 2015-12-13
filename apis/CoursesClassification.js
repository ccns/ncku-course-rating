var pg = require('pg');
var conString = "postgres://postgres:ccnsccns@140.116.252.150/course-rating";

pg.connect(conString, function(err, client, done) {
 	if(err) {
 		return console.error('error fetching client from pool', err);
	}
	client.query('SELECT * FROM colleges, departments, courses WHERE colleges.college = departments.college AND courses.department = departments.department', function(err, result) {
	    if(err) {
	    	return console.error('error running query', err);
	    }
   
	    console.log(result.rows);

	    client.end();
	});
});
