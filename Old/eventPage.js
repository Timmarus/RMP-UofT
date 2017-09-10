/////////////////////////////////////////////////////////////////////////
// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
// If the tabs url starts with "http://specificsite.com"...
if (tab.url.indexOf("https://timetable.iit.artsci.utoronto.ca/") == 0) {
// ... show the page action.
chrome.pageAction.show(tabId);
}
};
// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
/////////////////////////////////////////////////////////////////////////

//Where we will store all the information
var profJSON = {};
//So we can use tab.id elsewhere
var pageTab;

/*
Takes a UofT course code and translates it
into a valid RateMyProf Department
* @return {Array} list representing possible departments
*/
function courseDecoder(code){
    if (code == "RSM" || code == "MGT"){
        return ["Accounting", "Management", "Finance", "Marketing"];
    }
    else if (code == "ACT"){
        return ["Actuarial Science", "Statistics"];
    }
    else if (code == "ANT" || code == "ARH" || code == "JAH" || code == "JAL" || code == "HAJ" ){
        return ["Anthropology", "International Studies"];
    }
    else if (code == "ARC"){
        return ["Architecture"];
    }
    else if (code == "FAH"){
        return ["Art History"];
    }
    else if (code == "AST" || code == "PCN"){
        return ["Astronomy", "Science"];
    }
    else if (code == "BCH" || code == "BCB"){
        return ["Biochemistry", "Biology","Chemical Engineering", "Science",];
    }
    
    else if (code== "CHM" || code== "JSC"){
        return ["Chemistry","Chemical Engineering", "Science"];
    }
    else if (code== "MGY" || code== "MIJ"){
        return ["Molecular Genetics", "Science"];
    }
    else if (code== "CLA" || code== "GRK" || code == "LAT"){
        return ["Classics", "Languages"];
    }
    else if (code == "CSC" || code == "ECE"){
        return ["Computer Science", "Science"];
    }
    else if (code == "EAS" ){
        return ["East Asian Studies", "Humanities", "International Studies", "Languages"];
    }
    else if (code == "ECO" ){
        return ["Economics"];
    }
    else if (code == "EDU" ){
        return ["Education"];
    }
    else if (code == "ENG" || code == "JEI" || code == "INI"){
        return ["English", "Literature", "Writing"];
    }
    else if (code == "ENV" ){
        return ["Environmental Studies", "Epidemiology", "Geology", "Physics"];
    }
    else if (code == "CIN" ){
        return ["Film", "Fine Arts"];
    }
    else if (code== "FRE" || code== "FSL" || code == "FCS" || code== "JFL" || code == "JFV"){
        return ["French", "French Studies", "Languages"];
    }
    else if (code== "GGR" || code== "JFG" || code == "JFE" || code== "JGE" || code == "JGI" || code== "JUG" || code == "JEG"){
        return ["Geography", "Geology"];
    }
    else if(code== "ESS" || code == "JGA" || code== "JPA" || code == "JEE"){
        return ["Geology"];
    }
    else if (code == "ANA"){
        return ["Health Sciences", "Medicine"];
    }
    else if (code== "HIS" || code== "JHA" || code == "JHP" || code== "JHN" || code == "JSH" || code== "JAH"){
        return ["History", "Humanities"];
    }
    else if (code== "HIS" || code== "JHA" || code == "JHP" || code== "JHN" || code == "JSH" || code== "JAH"){
        return ["History", "Humanities"];
    }
    else if (code== "HPS" || code== "JHE" || code == "JPH", code == "PHL"){
        return ["History", "Philosophy"]
    }
    else if (code== "NMC" || code== "NML"){
        return ["Humanities", "Near & Middle Eastern Civilizations", "Languages"];
    }
    else if (code == "CRI"){
        return ["Criminal Justice"];
    }
    else if (code == "ITA"){
        return ["Italian", "Languages"];
    }
     else if (code== "SLA" || code== "EST" || code == "FIN"|| code== "SPA" || code == "GER" || code== "JGJ" || code == "SPA" || code== "PRT"){
        return ["Languages"];
    }
    else if (code== "LIN" || code== "JLP" || code == "JLS"|| code== "JAL" || code == "JFL" ){
        return ["Linguistics"];
    }
    else if (code == "MAT" || code== "APM" || code == "JMB"|| code== "JUM" || code == "STA"){
        return ["Math", "Statistics"];
    }
    else if (code == "PSL"|| code == "PSL"){
        return ["Medicine", "Pharmacology", "Science"];
    }
    else if (code == "MUS"){
        return ["Music"];
    }
    else if (code == "NFS"){
        return ["Nutrition"];
    }
    else if (code == "PHY" || code== "JPE" || code == "JPH"|| code== "JOP" || code == "IVP"){
        return ["Physics"];
    }
    else if (code == "POL" || code== "JHP" || code == "JPA"|| code== "JPD" || code == "JPP" || code== "JPR" || code == "JPU" || code == "JRA"){
        return ["Political Science"];
    }
    else if (code == "PSY"|| code == "JLP"){
        return ["Psychology", "Science"];
    }
    else if (code == "RLG" || code == "MHB" || code == "JPR"){
        return ["Religion"];
    }
    else if (code == "IMM" || code == ("MIJ")){
        return ["Science"];
    }
    else if (code == "USA"){
        return ["International Studies", "History"];
    }
    else if (code == "SOC"){
        return ["Sociology"];
    }
    else if (code == "SPA"){
        return ["Spanish", "Languages"];
    }
    else if (code == "DRM" || code == "JDC"|| code == "JIA"){
        return ["Theatre"];
    }
    else if (code == "WGS"){
        return ["Womens & Gender Studies", "Women's Studies"];
    }
    else if (code == "BIO" || code == "CSB" || code == "CJH" || code == "LMP" || code == "HAJ" || 
             code == "HMB" || code == "CJH" || code == "JEH" || code == "EHJ" || code == "EEB" || 
             code == "EHJ" || code == "JMB" || code == "JHE"){
        return ["Biology", "Molecular Biosciences","Zoology", "Health Sciences", "Medicine", "Science"];
    }
    else {
        return["Science", "Languages", "History"]
    }
}

/**
* Checks whether a listing professor's department matches the list of departments
* the instructor should be in.
* @param {Array} deptNames - list of possible department Names
* @param {String} listingDept - actual department
* @return {String} listingLink - link to that page, -1 on no match
*/
function checkDept(deptNames, listingDept, listingName, listinglink){
    for (var j=0; j<deptNames.length; j++){
        //Handle Cases where there are two matches but
        if (deptNames[j] == listingDept){
            return listinglink;
        }
    }
    return -1; 
}

/**
* Gets the top 3 tags from a list of all the tags
* @param {Array} tagsList - list of string tags
* @return {Array} top 3 tags
*/
function getTags(tagsList){
    var tags = new Array(3);
    for (var i = 0; i<tagsList.length; i++){
        if (i>2){
            break;
        }
        tags[i] = tagsList[i].innerHTML;
        tags[i] = tags[i].match(/(.*?)<b>\(.*?\)<\/b?/)[1].trim();
    }
    return tags;
}

/*
Gets all the review information from a listing
* @param {String} listingName - name listed on timetable. Key for JSON objects
* @param {Object} profJSON - JSON object that will be populaed with all the information
* regarding every professor
*/
function getReview(profJSON, listingName){
    
    var prof = profJSON[listingName];
    var name = prof[0];
    var link = prof[1];
    //Create an HTTP request and get the ratings
    var xhr = new XMLHttpRequest();
    
    xhr.onload = function() {
        if (xhr.readyState === 4) { //Outputs a DOMString by default
            //Get the text from the page and set up
            //the parser
            var text = xhr.responseText;
            var parser=new DOMParser();
            htmlDoc=parser.parseFromString(text, "text/html");
            
            var reviews = htmlDoc.getElementsByClassName("rating-count");
            //Prof has no reviews, no need to parse data
            //delete them from the JSON object
            if (reviews.length == 0){
                delete profJSON[listingName];
            }
            else{
                //They have some reviews, thus all the information we need.
                reviews = reviews[0].innerHTML.trim()
                var leftBreakdown = htmlDoc.getElementsByClassName("left-breakdown")[0];
                var rating = leftBreakdown.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.innerHTML;
                var hotness = leftBreakdown.firstElementChild.lastElementChild.lastElementChild.firstElementChild.firstElementChild.innerHTML.trim();
                hotness = hotness.match(/<img src="\/assets\/chilis\/(.*?)" width="70">/)[1];
                var quality = leftBreakdown.firstElementChild.lastElementChild.children[1].firstElementChild.innerHTML.trim();
                //All tags regarding the professor
                var tagsList = htmlDoc.getElementsByClassName("tag-box-choosetags");
                //Get only the top 3
                var tags = getTags(tagsList);
                
                var fullReview = [name,link,rating,quality,reviews,hotness,tags];
                profJSON[listingName] = fullReview;
                //Send this to the content page
                var profContent = [listingName, fullReview];
                var request = {todo: profContent};
                chrome.tabs.sendMessage(pageTab, request);
            }
        }
    }
    xhr.open('GET', link, true);
    xhr.send('');
}
/*
Gets the ratings from the page
* @param {String} link - url to professor's review
* @return {Int} rating - number of ratings the professor has
*/
function getRatings(link){
    //Create an HTTP request and get the ratings
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.readyState === 4) { //Outputs a DOMString by default
            //Get the text
            var text = xhr.responseText;
            var parser=new DOMParser();
            //So we can parse it
            htmlDoc=parser.parseFromString(text, "text/html");
            var rating = htmlDoc.getElementsByClassName("rating-count")[0].innerHTML.trim();
            //Get just the number
            rating = rating.match(/(.*) Student Ratings/)[1];
            rating = parseInt(rating, "10");
            return rating;
        }
    }
    xhr.open('GET', link, true);
    xhr.send('');
}
/*
Compare the two professors with matching last names
* and initials with valid departments, and return the one
* with more reviews.
*********Note: Assuming that the one with more reviews is the correct one.
************** This is done because UofT arts sci timetable does not list first and last names.
*************** Only first name initials and last name.
* @param {String} linkA - url to professor 1's review
* @param {String} linkB - url to professor 2's review
* @param {String} nameA - professor 1's name
* @param {String} nameB - professor 2's name
* @return {Array} - name and link of the professor.
*/
function compareRatings(linkA, nameA, linkB, nameB){
    //Compare the ratings between two links
    var ratingA = getRatings(linkA);
    var ratingB = getRatings(linkB);
    if (ratingA >= ratingB){
        return [nameA, linkA];
    }
    else{
        return [nameB, linkB];
    }
}
/*
* Parse the results page, if there is a matching instructor with
* the correct department and information, get the full review
* @param {String} text - text responding to the results page
* @param {String} surNmae - professor's last name
* @param {String} inital - professor's first name initial
* @param {Array} deptNames - list of valid departments
*/
function parseContent(text, surName, initial, deptNames){
    
    //Parse the text
    var parser=new DOMParser();
    htmlDoc=parser.parseFromString(text, "text/html");
    var listings = htmlDoc.getElementsByClassName("listing");
    //Go through all the listing matches and compare the names
    for(var i = 0; i<listings.length; i++){
        //Declareations
        var name = surName +", "+ initial;
        var listingHREF = listings[i].innerHTML;
        var listinglink = "http://www.ratemyprofessors.com/" + listingHREF.match(/ *<a href="(.*)">/)[1];
        var listingInfo = listings[i].firstElementChild.lastElementChild;
        var listingName = listingInfo.firstElementChild.innerHTML.trim();
        var listingDept = listingInfo.lastElementChild.innerHTML;
        //static replace
        listingDept = listingDept.replace("University of Toronto - St. George Campus, ", "");
        
        //If its the only listing and the name matches, it has to be right
        if (listings.length == 1 && listingName.startsWith(name)){
            profJSON[name] = [listingName, listinglink];
        }
        else{
            //Check if the name matches
            if (listingName.startsWith(name)){
                //Remove ''
                var result = checkDept(deptNames, listingDept, listingName, listinglink);
                //No match
                if (result == -1){
                    continue;
                }
                //Check that is a professor with a different name
                if (profJSON[name] && profJSON[name][0] != listingName){
                    var profLink = profJSON[name];
                    var resultList = compareRatings(profLink[1], profLink[0], listinglink, listingName);
                    listinglink = resultList[1];
                    listingName = resultList[0];
                }
                //Doesn't exist already
                profJSON[name] = [listingName, listinglink];
            }
        }
    }
    //Get the review if the prof's rating exists
    if (profJSON[name]){
        var fullReview = getReview(profJSON,name);
    }
}
/*
* Check to see if the generated link results in any matches,
* and if so call a seperate function to handle that.
* @param {String} url - link to a page where the instructor's link would be
* @param {String} surNmae - professor's last name
* @param {String} inital - professor's first name initial
* @param {Array} deptNames - list of valid departments
*/
function getResults(url, surName, initial, deptNames){
    //Make an HTTP request to the page
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.readyState === 4) { //Outputs a DOMString by default
            var text = xhr.responseText;
            var results = text.match(/<div class="result-count">(.*?)<\/div>/)[1];
            if (results != "Your search didn't return any results."){
                //Number of matched profs
                parseContent(text, surName, initial, deptNames);
            }
        }
    }
    xhr.open('GET', url, true);
    xhr.send('');
}
/*
* Check to see whether the page has any courses searched for,
* and if so generate the url to each instructor's name results page.
* @param {Object} domContent - content of the the artsci timetable's page
*/
function doStuffWithDOM(domContent){
    if (domContent.instructors == ""){
        //
    }
    else{
        //Remove trailing whitespace and split
        var instInfo = domContent.instructors.split("\n");
        //Generate the link to each instructors page
        for (var i =0 ; i<instInfo.length; i++){
            var curInfo = instInfo[i];
            if (curInfo == ""){
                instInfo.splice(i,1);
                continue;
            }
            //Seperate deptName and Name
            var curArray = curInfo.split(" ");
            //Seperate surName and inital
            curArray[0] = curArray[0].split(",")
            instInfo[i] = curArray;
            //make the url
            //Need to loop again here
            var surName = curArray[0][0];
            var initial = curArray[0][1];
            var deptNames = courseDecoder(curArray[1]);
            var url = "http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=university+of+toronto+st+george&queryoption=HEADER&query="+surName+"&facetSearch=true"
            //Check to see if there were any matches
            getResults(url, surName, initial, deptNames);
        }
    }
}

//Trigger an even when the pageAction is clicked
chrome.pageAction.onClicked.addListener(function(tab){
    //Reset the JSON object on page action click;
    profJSON = {};
    pageTab = tab.id;
    //Tell the content script to scrape for instructors
    chrome.tabs.sendMessage(tab.id, {todo: "send_inst"}, doStuffWithDOM);
})