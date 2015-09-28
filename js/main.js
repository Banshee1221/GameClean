var fs = require("fs");
var proc = require('process');
var recursive = require('recursive-readdir');
var minmat = require('minimatch')
var fileTypes = require('./js/commonFiles.json')
var paths = require('path');

function getDirContents(number){
    var directory = document.getElementById('steamDir').value;
    console.log("after dir");
    if (number == 1){
        var tempArr = directory.split(paths.sep);
        console.log(tempArr);
        lastEle = tempArr[tempArr.length - 1];
        if (lastEle.toLowerCase() != "steamapps"){
            alert("Please select a proper SteamApps directory!");
            document.getElementById('checklist').innerHTML = "";
            return console.error("Not an appropriate directory");
        }
        console.log("Directory passed to itemParser: "+directory)
        itemParser(directory);
    }
};

function itemParser(directory){
    //console.error(directory);
    var games = [];
    recursive(directory, function(err, files){
        if (err) {
            return console.error(err);
        }
        var count = 0;
        var fileChecks = fileTypes['redistFiles'];
        var ind1 = -1;
        console.log(fileTypes['redistFiles']);
        files.forEach(function(file){
            var tmp = file.split(paths.sep);
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
        });
        games.forEach(function(game){
            var tmp = document.createElement("div");
            tmp.setAttribute("id", game);
            tmp.innerHTML = "<h4>"+game+"</h4>";
            document.getElementById('checklist').appendChild(tmp);
        });
        files.forEach(function(file){
            var tmp = file.split(paths.sep);
            var toWrite = tmp.slice(tmp.indexOf(tmp[ind1+2]) + 1, tmp.length).join(paths.sep);
            //console.log(toWrite);
            fileChecks.forEach(function(item){
                var test = minmat(file, item['pat'], {matchBase: true, nocase: true});
                if (test) {
                    var tmpEl = document.createElement("div");
                    tmpEl.innerHTML = "<p align='right'><input type='checkbox' id='"+count.toString()+"' checked><label class='radioClass' for='"+count.toString()+"'>"+toWrite+"</label></input></p>";
                    document.getElementById(tmp[ind1+2]).appendChild(tmpEl); //console.log(file);
                    count++;
                }
            });
        });
        console.log(games);
    });
};
