var pg = require('pg');
var conString = "postgres://postgres:ccnsccns@140.116.252.150/course-rating";

//this initializes a connection pool
//it will keep idle connections open for a (configurable) 30 seconds
//and set a limit of 20 (also configurable)

// getReviews("E111110",104,"E14026046",function (datas) {
//   console.log(datas); // datas - succes: course datas object,
//                       //         data not found: null
// });
// getCourseDatas("E111110",104,"E14026046",0,function (datas) {
//   console.log(datas); // datas - succes: course datas object,
//                       //         data not found: null
// });

function getCourseDatas(course_number, year, student_id, success, error) {
  var courseDatas;
  pg.connect(conString, function(err, client, done) {
    if(err) {
      console.error('error fetching client from pool', err);
      return error('error fetching client from pool', err);
    }

    // Get course datas
    client.query('SELECT * FROM courses WHERE (course_number=$1 AND year=$2)', [course_number, year], function(err, result) {

      done();
      if(err) { // query errors
        console.error('error excuting query', err);
        return error('error excuting query', err);
      }

      var datas = result.rows[0];

      if ( typeof datas == 'undefined') { // does it have datas?
        console.log('no course data');
        return success(null);
      }

      courseDatas = datas;

      // Get first 10 reviews of the course
      client.query('SELECT * FROM reviews WHERE (course_number=$1 AND year=$2) ORDER BY array_length(useful, 1) DESC, post_time DESC LIMIT 10', [course_number, year], function(err, result) {

        done();
        if(err) { // query errors
          console.error('error excuting query', err);
          return error('error excuting query', err);
        }

        var datas = result.rows;

        for(var i = 0; i < datas.length; i++) { // clicked judgement and clicked count
          if ( datas[i].useful ) {
            datas[i].isClicked = datas[i].useful.indexOf(student_id) == -1 ? false : true;
            datas[i].useful = datas[i].useful.length;
          } else {
            datas[i].isClicked = false;
            datas[i].useful = 0;
          }
        }

        courseDatas.reviews = datas;

        pg.end();

        return success(courseDatas);

      });
    });
  });
}

function getReviews(course_number, year, student_id, offset, success, error) {

  if(typeof(offset) === 'undefined') offset = 0;

  pg.connect(conString, function(err, client, done) {
    if(err) {
      console.error('error fetching client from pool', err);
      return error('error fetching client from pool', err);
    }

    // Get course datas
    client.query('SELECT * FROM reviews WHERE (course_number=$1 AND year=$2) ORDER BY array_length(useful, 1) DESC, post_time DESC LIMIT 10 OFFSET $3', [course_number, year, offset], function(err, result) {

      done();
      if(err) { // query errors
        console.error('error excuting query', err);
        return error('error excuting query', err);
      }

      var datas = result.rows;

      for(var i = 0; i < datas.length; i++) { // clicked judgement and clicked count
        if ( datas[i].useful ) {
          datas[i].isClicked = datas[i].useful.indexOf(student_id) == -1 ? false : true;
          datas[i].useful = datas[i].useful.length;
        } else {
          datas[i].isClicked = false;
          datas[i].useful = 0;
        }
      }

      pg.end();

      return success(datas);

    });
  });
}

module.exports = {
  getCourseDatas: getCourseDatas,
  getReviews: getReviews
}
