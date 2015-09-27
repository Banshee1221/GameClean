var fs = require("fs");
var proc = require('process');
var recursive = require('recursive-readdir');

function getDirContents(number){
    var directory = document.getElementById('steamDir').value;
    console.error("after dir");
    if (number == 1){
         var tempArr;
        if (proc.platform == "linux"){
            console.log("Got Linux!");
            tempArr = directory.split("/");
        }
        console.log(tempArr);
        lastEle = tempArr[tempArr.length - 1];
        if (lastEle != "SteamApps" && lastEle != "steamapps" && lastEle != "steamApps" && lastEle != "Steamapps"){
            alert("Please select a proper SteamApps directory!");
            return console.error("Not an appropriate directory");
        }
        itemParser(directory);
    }
};

function itemParser(directory){
    //console.error(directory);
    recursive(directory, function(err, files){
        if (err) {
            return console.error(err);
        }
        var count = 0
        files.forEach(function(file){
            var tmp = document.createElement("div");
            tmp.innerHTML = "<p><input type='checkbox' id='"+count.toString()+"'><label class='radioClass' for='"+count.toString()+"'>"+file+"</label></input></p>"
            /*var tmp1 = tmp.appendChild(document.createElement("P"));
            var tmp2 = tmp1.appendChild(document.createElement("input"));
            tmp2.setAttribute("class", "with-gap");
            tmp2.setAttribute("name", "group");
            tmp2.setAttribute("type", "radio");
            tmp2.setAttribute("id", count.toString())
            var tmp3 = tmp2.appendChild(document.createElement("label"));
            tmp3.setAttribute("for", count.toString())
            tmp3.innerHTML = file;*/
            document.getElementById('contentsOf').appendChild(tmp); //console.log(file);
            count++;
            //console.error('<div>'+file+'</div>');
        });
        //document.getElementById('contentsOf').appendChild('<div>'+file+'</div>');
    });
};
