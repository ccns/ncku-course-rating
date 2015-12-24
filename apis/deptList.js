var pg = require('pg');
var conString = "postgres://postgres:ccnsccns@140.116.252.150/course-rating";

// deptList(function (datas) {
//   console.log(datas);
// });

function deptList(success) {
  pg.connect(conString, function(err, client, done) {
   	if(err) {
   		return console.error('error fetching client from pool', err);
  	}
  	client.query('SELECT * FROM colleges', function(err, result) {

      done();
	    if(err) {
	    	return console.error('error running query', err);
	    }

	    var colleges = result.rows;
      for(var i = 0; i < colleges.length; i++) {
        colleges[i].departments = [];
      }

      client.query('SELECT * FROM departments', function(err, result) {
  	    if(err) {
  	    	return console.error('error running query', err);
  	    }

  	    var departments = result.rows;

        for(var i = 0; i < departments.length; i++) {
          for(var j = 0; j < colleges.length; j++) {
            if ( colleges[j].college === departments[i].college ) {
              colleges[j].departments.push(departments[i].department);
            }
          }
        }

        return success(colleges);

      });
    });
  });
};

module.exports = deptList;
