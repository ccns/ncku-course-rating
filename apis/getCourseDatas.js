var pg = require('pg');
var conString = "postgres://postgres:ccnsccns@140.116.252.150/course-rating";

//this initializes a connection pool
//it will keep idle connections open for a (configurable) 30 seconds
//and set a limit of 20 (also configurable)
var options = {
  course_number: "E134700",
  year: 104,
  student_id: "E14026046",
  success: function (datas) {
    console.log(datas);
  }
};

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
      if(err) {
        console.error('error running query', err);
        return options.error('error running query', err);
      }

      var datas = result.rows[0];
      courseDatas = datas;

      // Get reviews and calculate the averge rating
      client.query('SELECT * FROM reviews WHERE (course_number=$1 AND year=$2) ORDER BY array_length(useful, 1) DESC, post_time DESC', [course_number, year], function(err, result) {

        done();
        if(err) {
          console.error('error running query', err);
          return options.error('error running query', err);
        }

        var datas = result.rows;
        var n = datas.length;
        var sweet = 0;
        var hard = 0;
        var knowledge = 0;
        for(var i = 0; i < n; i++) {
          sweet += datas[i].sweet;
          hard += datas[i].hard;
          knowledge += datas[i].knowledge;
          if ( datas[i].useful ) {
            datas[i].isClicked = datas[i].useful.indexOf(options.student_id) == -1 ? false : true;
            datas[i].useful = datas[i].useful.length;
          } else {
            datas[i].isClicked = false;
            datas[i].useful = 0;
          }
        }
        sweet /= n;
        hard /= n;
        knowledge /= n;
        courseDatas.sweet = sweet;
        courseDatas.hard = hard;
        courseDatas.knowledge = knowledge;
        courseDatas.reviews = datas;

        return options.success(courseDatas);

      });
    });

    pg.end();
  });
}
