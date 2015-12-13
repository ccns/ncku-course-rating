var pg = require('pg');
var conString = "postgres://postgres:ccnsccns@140.116.252.150/course-rating";

department_name = "機械系";

pg.connect(conString, function(err, client, done) {
 	  if(err) {
 		  return console.error('error fetching client from pool', err);
	  }
    
	  client.query('SELECT * FROM courses WHERE (courses.department=$1)', [department_name], function(err, result) {
        done();
	      if(err) {
	    	    return console.error('error running query', err);
	      }

        courses = result.rows;
        console.log(courses);

	      client.end();
	  });
});
