//What we'll use to store the instructors
var profContent = {
    keys: []
};
//What we'll use to store the locations of the
//instructors on the page
var profLocation;

function copy(l){
    var newList = new Array();
    for (var i = 0; i< l.length; i++){
        if (i >= 3){
            newList.push(l[i]);
        }
    }
    return newList;
}
/*
* Remove the inner HTML that we have previously injected
* so no there are no repeated reviews
*/
function clearInnerHTML(){
    //What we name the reviews
    var reviews = document.getElementsByClassName("outerRating");
    //Loop through all of them and delete them from the page
    for (var i=reviews.length-1; i>=0; i--){
        var current = reviews[i];
        current.parentElement.removeChild(current);
    }
}
/*
* Change the inner HTML of the webpage in order
* to add the review to the page
* @param {String} key - key to the professor's review and location on the webpage
* @param {Array} value - list of review information
*/
function setInnerHTML(key,value){
    
    if (profLocation[key]){
        //Some declerations
        var full = value[0];
        var link = value[1];
        var overall = value[2];
        var difficulty = value[3];
        var reviews = value[4];
        var hotness = chrome.extension.getURL(value[5]);
        var tags = value[6];
        var locationKey = profLocation[key];
        var locationLength = locationKey.length;
        //Loop through the locations of the name
        for (var i = 0; i<locationLength; i++){
            var currentLocation = locationKey[i];
            //Construct the outputted string
            var ratingHTML ='<td class = "insertedRating" style="padding-left:5px;padding-bottom: 5px;"><i><strong>Rating</strong></i></td>'
            var nameHTML = '<td class = "insertedRating" style="padding-left:5px;padding-bottom: 5px;"> <i>'+full+'</i></td>';
            var overallHTML = '<td class = "insertedRating" style="padding-left:5px;padding-bottom: 5px;"><i>Overall: '+overall+'</i></td>';
            var difficultyHTML = '<td class = "insertedRating style" ="padding-left:5px;padding-bottom: 5px;"><i>Difficulty: '+difficulty+'</i></td>';
            var imgHTML = '<td class = "insertedRating" width ="30" style="padding-left:5px;padding-bottom: 5px;"><img src='+hotness+' width = "70"></td>';
            var hrefHTML = '<td class = "insertedRating style" ="padding-left:5px;padding-bottom: 5px;"><a href = '+link+' target = "_blank"><i>'+reviews+'</i></a></td>';
            //Insert the html, set the class as the key so it can easily be delete on page click
            currentLocation.innerHTML+= '<tr class = "outerRating" style="padding-bottom:5px">'+ratingHTML + nameHTML + overallHTML + difficultyHTML + hrefHTML+imgHTML+'</tr>';
            //If this is the last location, delete the key
            if (i==(locationLength-1)){
                delete profLocation[key];
            }
        }
    }
}


/*
* Get the locations of the instructors on the webpage
* so we can add them later with ease
*/
function getProfs(){
    //Reset it
    profLocation = {
    };
    var colInst = document.getElementsByClassName("colInst");
    //Loop through all the instructor columns
    for (var i =0; i<colInst.length; i++){
        //We'll use this as the location
        var parent = colInst[i].parentElement.parentElement;
        var currentText = colInst[i].innerHTML.trim().replace(/ /g, '').replace(/\n/g, '');
        //Instructor has not been selected
        if (currentText == '<spanclass="alignC">—</span>'){
            continue;
        }
        currentText = currentText.replace(/<ul>/, "").replace(/<\/ul>/, "").replace(/<li>/g, "").replace(/<\/li>/g, "")
        //To match keys in profContent
        if (currentText[currentText.length-1] == ".") { 
            currentText = currentText.slice(0,-1);
        }
        //To match the keys in profContent
        currentText = currentText.replace(/,/g, ", ");
        var locationKey = currentText.split(".");
        for (var j=0; j<locationKey.length; j++){
            //It does exist, add a location to it
            var curr = locationKey[j];
            if (profLocation[curr]){
                profLocation[curr].push(parent);
            }
            else{
                profLocation[curr] = [parent];
            }
        }
    }
}
chrome.runtime.onMessage.addListener(
    function(request, sender, senderResponse){
    //If the message needs a response
    //We want to send the instructors on this page
    if (request.todo == "send_inst"){
            //Clear the page of injected html
            clearInnerHTML();
            //Reset the JSON objects
            profContent = {
                keys: []
            };
            var message = "";
            var courseSearch = document.getElementById("courseSearchResultNum").innerHTML.match(/(.*?) courses found./)[1].replace("<span>", "").replace("</span>", "");
            courseSearch = parseInt(courseSearch,10);
            if (courseSearch > 0 ){
                //Get all the information from the table
                var courseStart = document.getElementsByClassName("start");
                //Go through all the courses
                for (var i = 0; i<courseStart.length; i++){
                    var courseName = courseStart[i].nextElementSibling.firstElementChild.firstElementChild.innerHTML;
                    //Get the deptName
                    var deptName = courseName.substring(0,3);
                    var section = courseStart[i].parentElement.children;
                    //Lecture sections start at 3 and go on till the end
                    var meetings = copy(section);
                    //Go through all the meeting sections per course.
                    
                    for (var j =0; j <meetings.length; j++){
                        //Only do something if they are a meeting section
                        var currentMeeting = meetings[j];
                        if(currentMeeting.className == "perMeeting"){
                            //Get the data on the course
                            var meetingData = currentMeeting.firstElementChild.firstElementChild.firstElementChild.children[1];
                            
                            //////SUBTITLE ERROR FIX/////
                            if (meetingData.children.length == 1){
                                meetingData = currentMeeting.firstElementChild.firstElementChild.firstElementChild.children[3];
                            }
                            
                            //Lecture or Tutorial
                            var meetingCode = (meetingData.firstElementChild.innerHTML).substring(0,3);
                            //Only parse through Lecture sections
                            if (meetingCode == "LEC"){
                                //Put in HTML right away because we have to account for the
                                //fact that there is no assigned instructor at the moment.
                                var meetingInst = (meetingData.children[3].innerHTML);
                                //This means if there has an assigned instructor
                                var match = meetingInst.match(' *<ul>\n *<li>(.*)<\/li>\n *<\/ul>')
                                if (match != null){
                                    //Remove "." and " ".
                                    //The thing that seperates the first from the last is a comma
                                    //that already exists
                                    var prof = match[1];
                                    prof = prof.replace(/ /g,'');
                                    prof = prof.replace(/\./g,'');
                                    var find = '</li><li>';
                                    //Removed nested tags, in case for multiple professors
                                    if (prof.includes(find)){
                                        var re = new RegExp(find, 'g');
                                        prof = prof.replace(re, " "+deptName+"\n");
                                    }
                                    //Check if the name exists in the string already
                                    if (!(message.includes(prof))){
                                        var newInfo = prof + " " + deptName;
                                        message+= newInfo;
                                        message += "\n";
                                    }
                                }
                            }
                        }
                    }
                }
                senderResponse({instructors: message});
                getProfs();
            }
            else{
                senderResponse({instructors: message});
            }
        }
        else{
            //We recieved a message
            var messageArray = request.todo;
            var key = messageArray[0];
            var value = messageArray[1];
            profContent.keys.push(key);
            profContent[key]=value;
            setInnerHTML(key,value);
        }
    });