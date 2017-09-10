$(document).ready(function() {
    setTimeout(function() {
        console.log("HELLO");
        console.log("Go.");
        var schoolids = [1484, 12184, 4919, 4928]
        //$(".instructorDetails").append("Lol.");
        //$("div.instructorDetails").append("Lol.");
        $("div").each(function() {
            if ($(this).text() != "Instructor" && $(this).hasClass("instructorDetails")) { // Begin loop for current instructor
                var name = $(this).text().replace(" ", "+"); // Replace space with plus
                var ratings = []; // Initialize ratings array
                schoolids.forEach(function(id) { //For every school we have
                    var url = "https://www.ratemyprofessors.com/find/professor/?department=&institution=&page=1&query=" + name + "&queryoption=TEACHER&queryBy=schoolId&sid=" + id + "&sortBy=";
                    if (name != "TBA") { // Ignore all TBAs.
                        //console.log(name)
                        //                        $.getJSON(url, function(data) { //Gets the JSON from the above URL
                        //                            data['professors'].forEach(function(info) {
                        //                                if (info['overall_rating'].length >= 1) {
                        //                                    ratings.push(info['overall_rating']);
                        //                                    //console.log(ratings[0]);
                        //                                }
                        //                            });
                        //                        });
                        $.ajax({
                            url: url,
                            async: false,
                            dataType: 'json',
                            success: function(data) {
                                data['professors'].forEach(function(info) {
                                    if (info['overall_rating'].length >= 1) {
                                        ratings.push(info['overall_rating']);
                                        //console.log(ratings[0]);
                                    }
                                });
                            }
                        });

                    }
                });
                var avg = 0
                if (ratings.length >= 1) {
                    ratings.forEach(function(rating) {
                        avg += Number(rating);
                        //console.log(rating);
                    })
                    avg = avg / ratings.length;
                    $(this).append("&nbsp;"+avg+"");
                }
                //console.log(sum);
                //console.log(sum);
            }
        });
    }, 2000);
});
//    var callback = function(professor) {
//      if (professor === null) {
//        console.log("No professor found.");
//        return;
//      }
//      console.log("Name: " + professor.fname + " " + professor.lname);
//      console.log("University: "+ professor.university);
//      console.log("Quality: " + professor.quality);
//      console.log("Easiness: " + professor.easiness);
//      console.log("Helpfulness: " + professor.help);
//      console.log("Average Grade: " + professor.grade);
//      console.log("Chili: " + professor.chili);
//      console.log("URL: " + professor.url);
//      console.log("First comment: " + professor.comments[0]);
//    };
//
//    rmp.get("Arnold Rosenbloom", callback);