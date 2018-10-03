var target = document.querySelector('body');

last_tick = new Date();

var observer = new MutationObserver(function(mutations) {// $(document).ready(function() {
        current = new Date();
        if (last_tick.getTime() + 25 - current.getTime() <= 0) {
        console.log("Beginning search for Professors.");
        var schoolids = [1484, 12184, 4919, 4928]
        $("div").each(function() {
            if ($(this).text() != "Instructor" && $(this).hasClass("instructorDetails")) { // Begin loop for current instructor
                var name = $(this).text().replace(" ", "+"); // Replace space with plus

                // This is used to store all the ratings for each professor. That way we can average it at the end.
                // *IDEA* Get different rating depending on class? Doable?
                var ratings = []; // Initialize ratings array.

                schoolids.forEach(function(id) { // Begin foreach loop for every school (UTM, UofT, UTSG, UTSC)
                    var url = "https://www.ratemyprofessors.com/find/professor/?department=&institution=&page=1&query=" + name + "&queryoption=TEACHER&queryBy=schoolId&sid=" + id + "&sortBy=";
                    if (name != "TBA") { // Ignore all TBAs.
                        $.ajax({ // AJAX was my best option for accessing external data. Might replace if I can find something quicker.
                            url: url,
                            async: false,
                            dataType: 'json',
                            success: function(data) {
                                data['professors'].forEach(function(info) {
                                    if (info['overall_rating'].length >= 1) {
                                        ratings.push(info['overall_rating']); // Add to ratings array
                                    }
                                });
                            }
                        });

                    }
                });
                var avg = findAvg(ratings);
                if (avg >= 3.5) {
                    $(this).append("&nbsp;<font color='green'>" + avg + "</font>");
                } else if (avg < 3.5 && avg != 0) {
                    $(this.append("&nbsp;<font color='red'>" + avg + "</font>"));
                }

            }
        });
        }
        last_tick = new Date();
//});
});

var findAvg = function(ratings) {
    var avg = 0;
    if (ratings.length >= 1) {
        ratings.forEach(function(rating) {
            avg += Number(rating);
        });
    avg = avg / ratings.length;
}
return avg;
}

var config = { attributes: false, childList: true, subtree: true, characterData: false };

// pass in the target node, as well as the observer options
observer.observe(target, config);
