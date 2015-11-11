/*
*
*   GameClean is a program intended to remove unecessary common
*   redistributables that are packaged with video games.
*   Copyright (C) 2015  Eugene de Beste, debeste.eugene@gmail.com
*
*   This program is free software: you can redistribute it and/or modify
*   it under the terms of the GNU General Public License as published by
*   the Free Software Foundation, either version 3 of the License, or
*   (at your option) any later version.
*
*   This program is distributed in the hope that it will be useful,
*   but WITHOUT ANY WARRANTY; without even the implied warranty of
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*   GNU General Public License for more details.
*
*   You should have received a copy of the GNU General Public License
*   along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
*
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
var fileChecks = fileTypes['redistFiles'];
var collection = {};
var totalFileSize = 0;

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
            directoriesUsed = [];
            collection = {};
            totalFileSize = 0;
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

    var games = [];
    var ignorer = false;
    var breaker = false;

    recursive(directory, function(err, files){
        if (err) {
            return console.error(err);
        }
        else if (breaker) {
            return console.error("There is an issue with the Steam Directory");
        }
        var count = 0;
        var ind1 = -1;
        //console.log(fileTypes['redistFiles']);
        
        files.forEach(function(file){
            var tmp = file.toLowerCase().split(paths.sep);
            var stringTmp;

            if (type == 1) {
                if (ind1 == -1) {
                    if (tmp.indexOf("steamapps") != -1){
                        ind1 = tmp.indexOf("steamapps");
                    }
                    else {
                        breaker = true;
                    }
                    console.log("Steam: "+ind1+" | out of: "+tmp);
                }
                stringTmp = tmp[ind1+2];
                if (tmp[ind1+1] != "common"){
                    return;
                }
                else {
                    //console.log(tmp.slice(0, ind1+3));
                    if (games.indexOf(stringTmp) < 0){
                        games.push(stringTmp);
                    }
                }

                if (!(stringTmp in collection)) {
                    collection[stringTmp] = [];
                }

                matcher(file, stringTmp, tmp);
            }

            // else if (type == 2) {
            //     var tmpDir = directory.split(paths.sep);
            //     var tmpDir1 = tmpDir[tmpDir.length - 1];
            //     if (ind1 == -1) {
            //         if (tmp.indexOf(tmpDir1) != -1){
            //             ind1 = tmp.indexOf(tmpDir1);
            //         }
            //         console.log("GOG: "+ind1);
            //     }
            //     if (games.indexOf(tmp[ind1+1]) < 0){
            //         games.push(tmp[ind1+1]);
            //     }
            // }
            // else if (type == 3) {
            //     console.log("On ORIGIN");
            //     if (ind1 == -1) {
            //         if (tmp.indexOf("steamapps") != -1){
            //             ind1 = tmp.indexOf("steamapps");
            //         }
            //         else if (tmp.indexOf("SteamApps") != -1){
            //             ind1 = tmp.indexOf("SteamApps");
            //         }
            //         else if (tmp.indexOf("steamApps") != -1){
            //             ind1 = tmp.indexOf("steamApps");
            //         }
            //         else if (tmp.indexOf("Steamapps") != -1){
            //             ind1 = tmp.indexOf("Steamapps");
            //         }
            //         else if (tmp.indexOf("STEAMAPPS") != -1){
            //             ind1 = tmp.indexOf("STEAMAPPS");
            //         }
            //         console.log(ind1);
            //     }
            //     if (tmp[ind1+1] == "common"){
            //         if (games.indexOf(tmp[ind1+2]) < 0){
            //             games.push(tmp[ind1+2]);
            //         }
            //     }


            // }
        });

        console.log(games);
        console.log(collection);
        // games.forEach(function(game){
        //     var tmpArr = game.split(paths.sep);
        //     var tmpStr = tmpArr[ind1+2];
        //     if (!(tmpStr in collection)) {
        //         collection[tmpStr] = [];
        //     }
        // });
        // console.log(collection);
        // files.forEach(function(file){
        //     var tmp = file.split(paths.sep);
        //     fileChecks.forEach(function(item){
        //         var test = minmat(file, item['pat'], {matchBase: true, nocase: true});
        //         if (test) {
        //             if (type == 1) {
        //                 console.log(tmp[ind1]);
        //                 console.log(tmp[ind1+1]);
        //                 console.log(tmp[ind1+2]);
        //                 collection[tmp[ind1+2]].push(tmp.join(paths.sep));
        //             }
        //             else if (type == 2) {
        //                 collection[tmp[ind1+1]].push(tmp.join(paths.sep));
        //             }
        //         }
        //     });
        // });
        //console.log(collection);
        HTMLwriter(collection, ind1, type);
    });    
}

function matcher(file, gameStr, gameDirArr) {
    fileChecks.forEach(function(item){
        if (minmat(file, item['pat'], {matchBase: true, nocase: true})) {
            collection[gameStr].push(gameDirArr.join(paths.sep));
        }
    });
}

function HTMLwriter(dictionary, index, type) {
    document.getElementById('checklist').innerHTML = '';
    //console.log("HERE!");
    for (obj in dictionary) {
        console.log(obj);
        //dictionary[obj].forEach(function(file){
        //    console.log(file);
        //});
        if (dictionary[obj].length > 0) {
            var indexVal;
            var tmp = document.createElement("div");
            tmp.setAttribute("id", obj);
            tmp.innerHTML = "<h5 id='head-"+obj.toString()+"'>"+obj.toUpperCase()+"</h5>";
            document.getElementById('checklist').appendChild(tmp);
            var fileSizeTotal = 0;
            dictionary[obj].forEach(function(file){
                var fileSize = Math.round((fs.statSync(file)["size"] / 1000000.0) * 100) / 100;
                var tmpLine = file.split(paths.sep);
                if (type == 1) {
                    indexVal = tmpLine.indexOf("steamapps") + 2;
                }
                else if (type == 2) {
                    indexVal = tmp[ind1 + 1];
                }
                var toWrite = tmpLine.slice(tmpLine.indexOf(tmpLine[indexVal]) + 1, tmpLine.length).join(paths.sep);
                var tmpEl = document.createElement("div");
                console.log(tmpLine);
                tmpEl.innerHTML = "<p><input name='selectedItems' type='checkbox' class='filled-in' id='"+file
                +"' checked='checked' /><label class='radioClass' for='"+file+"' style='font-size:14px'>"+toWrite
                +" | "+fileSize+"MB</label></p>";
                document.getElementById(tmpLine[indexVal]).appendChild(tmpEl); //console.log(file);
                fileSizeTotal += fileSize;
                count++;
            });
            document.getElementById("head-"+obj.toString()).innerHTML = "<h5 id="+obj+">"+obj.toUpperCase()+" | TOTAL: "+Math.round(fileSizeTotal * 100) / 100+"MB</h5>";
            totalFileSize += fileSizeTotal;
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
            fs.unlinkSync(checkboxes[i].getAttribute("id"));
        }
    }
    console.log(checkboxesChecked.length > 0 ? checkboxesChecked : null);
}