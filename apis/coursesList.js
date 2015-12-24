var pg = require('pg');
var conString = "postgres://postgres:ccnsccns@140.116.252.150/course-rating";

// coursesList("機械系", function (datas) {
//   console.log(datas);
// });

function coursesList(dept, success) {
  pg.connect(conString, function(err, client, done) {
    if(err) {
      console.error('error fetching client from pool', err);
      return options.error('error fetching client from pool', err);
    }

	  client.query('SELECT * FROM courses WHERE (courses.department=$1)', [dept], function(err, result) {
        done();
        if(err) { // query errors
          console.error('error excuting query', err);
          return options.error('error excuting query', err);
        }

        courses = result.rows;

        pg.end();

        return success(courses);
	  });
  });
}
