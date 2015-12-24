var pg = require('pg');
var conString = "postgres://postgres:ccnsccns@140.116.252.150/course-rating";

//this initializes a connection pool
//it will keep idle connections open for a (configurable) 30 seconds
//and set a limit of 20 (also configurable)
var options = {
  course_number: "E111110",
  year: 104,
  student_id: "E14026046",
  success: function (datas) {
    console.log(datas); // datas - succes: course datas object,
                        //         data not found: null
  }
};

// getViews(options);
getCourseDatas(options);

function getCourseDatas(options) {
  var course_number = options.course_number;
  var year = options.year;
  var student_id = options.student_id;

  var courseDatas;
  pg.connect(conString, function(err, client, done) {
    if(err) {
      console.error('error fetching client from pool', err);
      return options.error('error fetching client from pool', err);
    }

    // Get course datas
    client.query('SELECT * FROM courses WHERE (course_number=$1 AND year=$2)', [course_number, year], function(err, result) {

      done();
      if(err) { // query errors
        console.error('error excuting query', err);
        return options.error('error excuting query', err);
      }

      var datas = result.rows[0];

      if ( typeof datas == 'undefined') { // does it have datas?
        console.log('no course data');
        return options.success(null);
      }

      courseDatas = datas;

      // Get first 10 reviews of the course
      client.query('SELECT * FROM reviews WHERE (course_number=$1 AND year=$2) ORDER BY array_length(useful, 1) DESC, post_time DESC LIMIT 10', [course_number, year], function(err, result) {

        done();
        if(err) { // query errors
          console.error('error excuting query', err);
          return options.error('error excuting query', err);
        }

        var datas = result.rows;

        for(var i = 0; i < datas.length; i++) { // clicked judgement and clicked count
          if ( datas[i].useful ) {
            datas[i].isClicked = datas[i].useful.indexOf(options.student_id) == -1 ? false : true;
            datas[i].useful = datas[i].useful.length;
          } else {
            datas[i].isClicked = false;
            datas[i].useful = 0;
          }
        }

        courseDatas.reviews = datas;

        pg.end();

        return options.success(courseDatas);

      });
    });
  });
}

function getViews(options) {
  var course_number = options.course_number;
  var year = options.year;
  var student_id = options.student_id;
  var shift = options.shift;

  if(typeof(shift) === 'undefined') shift = 0;

  pg.connect(conString, function(err, client, done) {
    if(err) {
      console.error('error fetching client from pool', err);
      return options.error('error fetching client from pool', err);
    }

    // Get course datas
    client.query('SELECT * FROM reviews WHERE (course_number=$1 AND year=$2) ORDER BY array_length(useful, 1) DESC, post_time DESC LIMIT 10 OFFSET $3', [course_number, year, shift], function(err, result) {

      done();
      if(err) { // query errors
        console.error('error excuting query', err);
        return options.error('error excuting query', err);
      }

      var datas = result.rows;

      for(var i = 0; i < datas.length; i++) { // clicked judgement and clicked count
        if ( datas[i].useful ) {
          datas[i].isClicked = datas[i].useful.indexOf(options.student_id) == -1 ? false : true;
          datas[i].useful = datas[i].useful.length;
        } else {
          datas[i].isClicked = false;
          datas[i].useful = 0;
        }
      }

      pg.end();

      return options.success(datas);

    });
  });
}

module.exports = {
  getCourseDatas: getCourseDatas,
  getViews: getViews
}
