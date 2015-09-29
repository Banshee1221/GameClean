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

function getDirContents(number){
    var directory;
    console.log("after dir");
    if (number == 1){
        directory = document.getElementById('steamDir').value;
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
        var count = 0;
        var tmp = document.createElement("div");
        tmp.setAttribute("id", obj);
        tmp.innerHTML = "<h4>"+obj+"</h4>";
        document.getElementById('checklist').appendChild(tmp);
        dictionary[obj].forEach(function(file){
            var tmpLine = file.split(paths.sep);
            var toWrite;
            if (type == 1) {
                toWrite = tmpLine.slice(tmpLine.indexOf(tmpLine[index+2]) + 1, tmpLine.length).join(paths.sep);
            }
            else if (type == 2) {
                toWrite = tmpLine.slice(tmpLine.indexOf(tmpLine[index+1]) + 1, tmpLine.length).join(paths.sep);
            }
            var tmpEl = document.createElement("div");
            console.log(tmpLine);
            tmpEl.innerHTML = "<p align='right'><input type='checkbox' id='"+count.toString()+"' checked><label class='radioClass' for='"+count.toString()+"'>"+toWrite+" | "+fs.statSync(file)["size"] / 1000000.0+"</label></input></p>";
            if (type == 1) {
                document.getElementById(tmpLine[index+2]).appendChild(tmpEl); //console.log(file);
            }
            else if (type == 2) {
                document.getElementById(tmpLine[index+1]).appendChild(tmpEl); //console.log(file);
            }
            count++;
        });
    }
}

