/*
*   1 = Steam
*   2 = GoG
*   3 = Origin
*/
var fs = require("fs");
var proc = require('process');
var recursive = require('recursive-readdir');
var minmat = require('minimatch')
var fileTypes = require('./js/commonFiles.json')
var paths = require('path');
var gui = require('nw.gui');
var count = 0;
var directoriesUsed = []

function openExternalBrowser(link) {
    gui.Shell.openExternal(link);
}

function dirValidifier(dir){
    if (directoriesUsed.indexOf(dir) < 0) {
        directoriesUsed.push(dir);
    }
    else {
        alert("Directory already selected");
        return -1;
    }
}

function getDirContents(number){
    var directory;
    console.log("after dir");
    if (number == 1){
        directory = document.getElementById('steamDir').value;
        if (dirValidifier(directory) < 0) {
            return console.error("Not an appropriate directory");
        }
        var tempArr = directory.split(paths.sep);
        console.log(tempArr);
        lastEle = tempArr[tempArr.length - 1];
        if (lastEle.toLowerCase() != "steamapps"){
            alert("Please select a proper SteamApps directory!");
            document.getElementById('checklist').innerHTML = "";
            return console.error("Not an appropriate directory");
        }
    }
    else if (number == 2) {
        directory = document.getElementById('gogDir').value;
        if (dirValidifier(directory) < 0) {
            return console.error("Not an appropriate directory");
        }
        var tempArr = directory.split(paths.sep);
        console.log(tempArr);
        lastEle = tempArr[tempArr.length - 1];
    }
    console.log("Directory passed to itemParser: "+directory)
    itemParser(directory, number);
}

function itemParser(directory, type){

    var collection = {};
    var games = [];

    recursive(directory, function(err, files){
        if (err) {
            return console.error(err);
        }
        var count = 0;
        var fileChecks = fileTypes['redistFiles'];
        var ind1 = -1;
        //console.log(fileTypes['redistFiles']);
        
        files.forEach(function(file){
            var tmp = file.split(paths.sep);
            if (type == 1) {
                if (ind1 == -1) {
                    if (tmp.indexOf("steamapps") != -1){
                        ind1 = tmp.indexOf("steamapps");
                    }
                    else if (tmp.indexOf("SteamApps") != -1){
                        ind1 = tmp.indexOf("SteamApps");
                    }
                    else if (tmp.indexOf("steamApps") != -1){
                        ind1 = tmp.indexOf("steamApps");
                    }
                    else if (tmp.indexOf("Steamapps") != -1){
                        ind1 = tmp.indexOf("Steamapps");
                    }
                    else if (tmp.indexOf("STEAMAPPS") != -1){
                        ind1 = tmp.indexOf("STEAMAPPS");
                    }
                    console.log("Steam: "+ind1);
                }
                if (tmp[ind1+1] == "common"){
                    if (games.indexOf(tmp[ind1+2]) < 0){
                        games.push(tmp[ind1+2]);
                    }
                }
            }
            else if (type == 2) {
                var tmpDir = directory.split(paths.sep);
                var tmpDir1 = tmpDir[tmpDir.length - 1];
                if (ind1 == -1) {
                    if (tmp.indexOf(tmpDir1) != -1){
                        ind1 = tmp.indexOf(tmpDir1);
                    }
                    console.log("GOG: "+ind1);
                }
                if (games.indexOf(tmp[ind1+1]) < 0){
                    games.push(tmp[ind1+1]);
                }
            }
            else if (type == 3) {
                if (ind1 == -1) {
                    if (tmp.indexOf("steamapps") != -1){
                        ind1 = tmp.indexOf("steamapps");
                    }
                    else if (tmp.indexOf("SteamApps") != -1){
                        ind1 = tmp.indexOf("SteamApps");
                    }
                    else if (tmp.indexOf("steamApps") != -1){
                        ind1 = tmp.indexOf("steamApps");
                    }
                    else if (tmp.indexOf("Steamapps") != -1){
                        ind1 = tmp.indexOf("Steamapps");
                    }
                    else if (tmp.indexOf("STEAMAPPS") != -1){
                        ind1 = tmp.indexOf("STEAMAPPS");
                    }
                    console.log(ind1);
                }
                if (tmp[ind1+1] == "common"){
                    if (games.indexOf(tmp[ind1+2]) < 0){
                        games.push(tmp[ind1+2]);
                    }
                }
            }
        });

        console.log(games);
        games.forEach(function(game){
            collection[game] = []
        });
        //console.log(collection);
        files.forEach(function(file){
            var tmp = file.split(paths.sep);
            fileChecks.forEach(function(item){
                var test = minmat(file, item['pat'], {matchBase: true, nocase: true});
                if (test) {
                    if (type == 1) {
                        collection[tmp[ind1+2]].push(tmp.join(paths.sep));
                    }
                    else if (type == 2) {
                        collection[tmp[ind1+1]].push(tmp.join(paths.sep));
                    }
                }
            });
        });
        console.log(collection);
        HTMLwriter(collection, ind1, type);
    });    
}

function HTMLwriter(dictionary, index, type) {
    //console.log("HERE!");
    for (obj in dictionary) {
        //console.log(obj);
        //dictionary[obj].forEach(function(file){
        //    console.log(file);
        //});
        if (dictionary[obj].length > 0) {
            var indexVal;
            var tmp = document.createElement("div");
            tmp.setAttribute("id", obj);
            tmp.innerHTML = "<h5>"+obj+"</h5>";
            document.getElementById('checklist').appendChild(tmp);
            dictionary[obj].forEach(function(file){
                if (type == 1) {
                    indexVal = index + 2;
                }
                else if (type == 2) {
                    indexVal = index + 1;
                }
                var tmpLine = file.split(paths.sep);
                var toWrite = tmpLine.slice(tmpLine.indexOf(tmpLine[indexVal]) + 1, tmpLine.length).join(paths.sep);
                var tmpEl = document.createElement("div");
                console.log(tmpLine);
                tmpEl.innerHTML = "<p align='right'><input name='selectedItems' type='checkbox' class='filled-in' id='"+file
                +"' checked><label class='radioClass' for='"+count.toString()+"' style='font-size:14px'>"+toWrite
                +" | "+Math.round((fs.statSync(file)["size"] / 1000000.0) * 100) / 100+"MB</label></input></p>";
                document.getElementById(tmpLine[indexVal]).appendChild(tmpEl); //console.log(file);
                count++;
            });
        }
    }
    var tmpEl = document.createElement("button");
    tmpEl.setAttribute("type", "submit");
    tmpEl.setAttribute("value", "submit");
    tmpEl.setAttribute("class", "btn waves-effect waves-light");
    tmpEl.setAttribute("id", "subButton");
    tmpEl.innerHTML = "Submit";
    document.getElementById('checklist').appendChild(tmpEl);
}

// Michael Berkowski @ StackOverflow - https://stackoverflow.com/questions/8563240/how-to-get-all-checked-checkboxes
function checklistSub() {
    var checkboxes = document.getElementsByName("selectedItems");
    var checkboxesChecked = [];
    for (var i=0; i<checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            checkboxesChecked.push(checkboxes[i]);
            console.log(checkboxes[i].getAttribute("id"));
            //var elem = document.getElementsById(checkboxes[i].getAttribute("id"));
            //elem.remove();
            //console.log(elem);
            //fs.unlinkSync(checkboxes[i].getAttribute("id"));
        }
    }
    console.log(checkboxesChecked.length > 0 ? checkboxesChecked : null);
}