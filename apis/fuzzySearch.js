var pg = require('pg');
var conString = "postgres://postgres:ccnsccns@140.116.252.150/course-rating";

//this initializes a connection pool
//it will keep idle connections open for a (configurable) 30 seconds
//and set a limit of 20 (also configurable)

function fuzzySearch(keyword, success, error) {
  var str = keyword;

  pg.connect(conString, function(err, client, done) {
    if(err) {
      console.error('error fetching client from pool', err);
      return error('error fetching client from pool', err);
    }

    // Get course datas
    client.query('SELECT *, ARRAY[course_name <-> $1, professor <-> $1, enroll_number <-> $1] AS fuzzy FROM courses ORDER BY fuzzy LIMIT 10', [str], function(err, result) {

      done();
      if(err) { // query errors
        console.error('error running query', err);
        return error('error running query', err);
      }

      var datas = result.rows;

      return success(datas);

    });

    pg.end();
  });
}

module.exports = fuzzySearch;
