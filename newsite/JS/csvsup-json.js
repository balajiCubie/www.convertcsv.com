// Copyright 2013 - 2020 Data Design Group, Inc  All Rights Reserved


// javascript-obfuscator:disable
function csv2jsonObj(hdr, v, options) {
    var t = [];
    var p = [];
    var o = {};
    var firstArray = true;
    var j, k;

    function delete_null_properties(test, recurse) {
        var i;
        for (var i in test) {
            if (test[i] === null || test[i] === "" || (typeof test[i] === 'object' && _.isEmpty(test[i]))) {
                delete test[i];
            } else if (recurse && typeof test[i] === 'object') {
                delete_null_properties(test[i], recurse);
            }
        }
        if (_.isArray(test)) {
            for (i = 0; i < test.length; i++) {
                if (test[i] === undefined) { test.splice(i, 1); i--; }
            }
        }
        if (typeof test === 'object' && _.isEmpty(test)) {
            delete test;
        }
    }

    for (j = 0; j < hdr.length; j++) {
        if (isNaN(hdr[j].split("../index.html")[0]) || !Number.isInteger(hdr[j].split("../index.html")[0] * 1)) {
            firstArray = false;
        }
    }
    if (firstArray) { o = []; }
    //alert("firstarray="+firstArray);
    for (j = 0; j < hdr.length; j++) {
        p = hdr[j].split("../index.html");
        s = "o";
        //if (p.length == 1 && !firstArray)o[hdr[j]] = v[j];
        for (k = 0; k < p.length; k++) {
            t = [];
            s = s + '["' + p[k].replace("\\", "\\\\").replace('"', '\\"') + '"]';
            if ((k < p.length - 1) && !isNaN(p[k + 1]) && Number.isInteger(p[k + 1] * 1)) {
                eval("if (typeof " + s + "==\"undefined\")" + s + "=[]");
            }
            else if (k < p.length - 1) {
                eval("if (typeof " + s + "==\"undefined\")" + s + "={}");
            }
            if (k == p.length - 1) {
                eval(s + "=v[j]");
                //alert("assign:" + s + " to " + v[j]+",o="+JSON.stringify(o));
            }
        }
    }
    if (options.skipEmpty) {
        delete_null_properties(o, true);
    }
    //alert("Returning " + JSON.stringify(o));
    var spacing = (options.mongoDbMode || options.lineMode) ? 0 : 3;
    return JSON.stringify(o, null, spacing);
}

