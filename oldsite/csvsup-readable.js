// Copyright 2013 - 2018 Data Design Group, Inc  All Rights Reserved
// Use https://javascriptobfuscator.com/Javascript-Obfuscator.aspx to objuscate code and copy to csvsup.js
// Also https://www.daftlogic.com/projects-online-javascript-obfuscator.htm
// Copyright Data Design Group, Inc 2010-2016 All Rights Reserved.
//var j,k,i;var mye=eval;var myhid=true;
//mye(function(p,a,c,k,e,d)...


/* Generate a sequence, used by csvFromTem */
function SeqObj(n) {
    this.n = n - 1 || 0;
    this.nInit = this.n;
    this.next = function () { return ++this.n; };
    this.curr = function () { return this.n; };
    this.reset = function () { this.n = this.nInit; };
}

// Primary purpose of this is to evaluate a query in form for one row
function queryGetVal(CSV, s, rownum) {
    if(!CSV){return;}
    var j, k;

    for (k = 0; k < CSV.maxColumnsFound; k++) { //for each column init
        eval("var f" + (k + 1) + "=''");
        eval("var F" + (k + 1) + "=''");
        eval("var h" + (k + 1) + "=''");
        eval("var H" + (k + 1) + "=''");
    }
    for (k = 0; k < CSV.arHeaderRow.length; k++) { //for each header column
        eval("var h" + (k + 1) + "=CSV.arHeaderRow[" + k + "]");
        eval("var H" + (k + 1) + "=CSV.arHeaderRow[" + k + "].toUpperCase()");
        try { eval("var " + CSV.arHeaderRow[k] + "=CSV.arHeaderRow[" + k + "]"); } catch (e) { }

    }
    if (rownum >= 0) {
        for (k = 0; k < CSV.table[rownum].length; k++) { //for each column in row rownum
            eval("var f" + (k + 1) + "=CSV.table[" + rownum + "][" + k + "]");
            eval("var F" + (k + 1) + "=CSV.table[" + rownum + "][" + k + "].toUpperCase()");
            try { eval("var " + CSV.arHeaderRow[k] + "=CSV.table[" + rownum + "][" + k + "]"); } catch (e) { }
        }
    }

    try {
        return eval(s);
    }
    catch (e) {
        return true;
    }
}

// Used by temHandler
function temGetVal(CSV, s, rownum, seq, options) {
    if(!CSV){return;}
    var j, k;
    var rn = rownum + 1;
    var nr = CSV.table.length;
    var nh = CSV.arHeaderRow.length;
    var nf = 0;
    var br = "\n";
    var lb = "{";
    var rb = "}";
    var tab = "    ";
    var v = "";

    options = options || {};
    for (k = 0; k < CSV.maxColumnsFound; k++) { //for each column init
        eval("var f" + (k + 1) + "=''");
        eval("var F" + (k + 1) + "=''");
        eval("var h" + (k + 1) + "=''");
        eval("var H" + (k + 1) + "=''");
    }
    for (k = 0; k < CSV.arHeaderRow.length; k++) { //for each header column
        eval("var h" + (k + 1) + "=CSV.arHeaderRow[k]");
        eval("var H" + (k + 1) + "=CSV.arHeaderRow[k].toUpperCase()");
        // Look at global options
        if (options.global && options.global.length > 0) {
            eval("h" + (k + 1) + "=h" + (k + 1) + "." + options.global.join('.'));
            eval("H" + (k + 1) + "=H" + (k + 1) + "." + options.global.join('.'));
        }
    }
    if (rownum >= 0) {
        //alert("options=" + JSON.stringify(options,null,4));
        for (k = 0; k < CSV.table[rownum].length; k++) { //for each column
            eval("var f" + (k + 1) + "=CSV.table[rownum][k]");
            eval("var F" + (k + 1) + "=CSV.table[rownum][k].toUpperCase()");
            try { eval("var " + CSV.arHeaderRow[k] + "=CSV.table[rownum][k]"); } catch (e) { }

            v = doTransformations(eval("f" + (k + 1)), k, CSV);
            eval("f" + (k + 1) + "=v");
            v = doTransformations(eval("F" + (k + 1)), k, CSV);
            eval("F" + (k + 1) + "=v");
            // Look at field options
            if (("f" + (k + 1)) in options) {
                eval("f" + (k + 1) + "=f" + (k + 1) + "." + options["f" + (k + 1)].join('.'));
                eval("F" + (k + 1) + "=F" + (k + 1) + "." + options["F" + (k + 1)].join('.'));
            }
            // Look at global options
            if (options.global && options.global.length > 0) {
                eval("f" + (k + 1) + "=f" + (k + 1) + "." + options.global.join('.'));
                eval("F" + (k + 1) + "=F" + (k + 1) + "." + options.global.join('.'));
            }
        }
    }
    nf = (rownum >= 0) ? CSV.table[rownum].length : 0;

    var a = s.split('.');
    var b;
    for (j = 0; j < a.length; j++) {
        b = a[j].trim().split('(');
        // What in the heck is the intent here. I wrote this ?????
        if (b[0].trim().toLowerCase() == 'csv' && b.length > 1 && b[1].trim() === ')') {
            a[j] = "csv(" + CSV.quote.enclose('"', '\\') + "," + CSV.quote.enclose('"', '\\') + ")";
        }
    }
    try {
        //alert("eval() string=" + a.join(".")+",f1="+f1 + ", returning "+eval(a.join('.')));
        return eval(a.join('.'));
    }
    catch (e) {
        return "";
    }
}
// Used by csvFromTem
function temHandler(CSV, tem, rownum, seq, temOptions) {
    if(!CSV){return;}
    if (tem.trim() == "") return tem;
    //var tem = "{h1}:{f1}{br}{h2.toLowerCase()}:{F2}";
    // Is the next line really necessary or desired?
    tem = tem.replace(/\{\s/gm, "{lb} ").replace(/\{$/gm, "{lb}").replace(/\s\}/gm, " {rb}").replace(/^\}/gm, "{rb}");
    tem = tem.split(/\r\n|\r|\n/).join("{br}");

    // TO DO: Limit { variables to { followed by non-whitespace,  i.e. /\{[^\s]/
    var a = tem.replace(/\{/g, "{\n").split(/\{|\}/);
    var s = a.join("\n");
    var j = 0;
    var cmd = false;
    lines = s.split("\n");
    var t = [];
    while (j < lines.length) {
        if (cmd && lines[j] != "") {
            // expand variable and push
            t.push(temGetVal(CSV, lines[j], rownum, seq, temOptions));
            cmd = false;
        }
        else if (lines[j] == "") {
            cmd = true;
        }
        else {
            t.push(lines[j]);
        }
        j++;
    }
    //alert("returning " + t.join(''));
    return t.join("");
}

// Generate String from template
function csvFromTem(CSV, temHead, tem, temBetween, temFoot, temCond, temOptions) {
    var j;
    var v;
    if(!CSV){return;}
    var s = "";
    //alert(tem);
    var seqobj = new SeqObj();
    s += temHandler(CSV, temHead, -1, 0);
    for (j = 0; j < CSV.table.length; j++) {
        v = temHandler(CSV, temCond, j, j, null); // check conditional
        if (v.toString().left(5) == "false") continue;
        s += temHandler(CSV, tem, j, seqobj.next(), temOptions);
        if (j != CSV.table.length - 1) s += temHandler(CSV, temBetween, j, seqobj.curr());
    }
    s += temHandler(CSV, temFoot, -1, seqobj.curr(), temOptions);
    return s;
}

// wrap an array of values with html table tags
function csvToTable(CSV, addHeaderIfMissing, addLineNumbers, addSummary, options) {
    var j, k, coltag;
    var s = '<table class="table table-bordered table-hover table-condensed">\n';
    var a = [];
    var x = 0;
    var v = "";
    var sumFields = [];
    if(!CSV){return;}
    options = options || {};
    a = getFldPosArr(CSV);
    for (k = 0; k < CSV.maxColumnsFound; k++) sumFields.push(0); // max length of columns
    if (CSV.isFirstRowHeader || addHeaderIfMissing) {
        s += "<thead><tr>";
        if (addLineNumbers) s += "<th>#</th>";
        for (x = 0; x < a.length; x++) { //for each header column
            k = a[x] - 1;
            if (k > CSV.arHeaderRow.length) v = "FIELD" + k;
            else v = CSV.arHeaderRow[k];
            s += '<th title="Field #' + (k + 1) + '">' + v.toHtml().replace(/\r\n|\r|\n/g, "<br/>") + "</th>\n";
        }
        s += "</tr></thead>\n";
    }
    s += "<tbody>";
    for (j = 0; j < CSV.table.length; j++) {
        //alert("in csvToTable, continuing.... v=" + v);
        s += "<tr"; // j is zero-based but we assume first row is 1
        if (options && 'attr1' in options) {
            if (options.attr1 != "" && options.attr1Row === "") s += " " + options.attr1;
            else if (options.attr1 != "" && options.attr1Row === "E" && (j % 2)) s += " " + options.attr1;
            else if (options.attr1 != "" && options.attr1Row === "O" && !(j % 2)) s += " " + options.attr1;
            if (options.attr2 != "" && options.attr2Row === "") s += " " + options.attr2;
            else if (options.attr2 != "" && options.attr2Row === "E" && (j % 2)) s += " " + options.attr2;
            else if (options.attr2 != "" && options.attr2Row === "O" && !(j % 2)) s += " " + options.attr2;
        }
        s += '>\n';
        if (addLineNumbers) s += "<td>" + (j + 1) + "</td>\n";
        for (x = 0; x < a.length; x++) { //for each column
            k = a[x] - 1;
            if (k >= CSV.table[j].length) v = " ";
            else v = CSV.table[j][k];
            v = doTransformations(v, k, CSV);
            if (CSV.statsCnt[k] && (CSV.statsCnt[k].fieldType == "N" || CSV.statsCnt[k].fieldType == "I")) {
                s += "<td align=\"right\">" + v + "</td>\n";
                sumFields[k] += 1 * v;
            }
            else if (v != "" && 'dateOutFormat' in options && options.dateOutFormat != "" && CSV.statsCnt[k] && CSV.statsCnt[k].fieldType == "D") {
                try {
                    var v = moment(v, CSV.dateformat[k]).format(options.dateOutFormat);
                } catch (e) { ; }
                s += "<td>" + v.toHtml().replace(/\r\n|\n|\r/g, "<br/>");
                s += "</td>\n";
            }
            else {
                if (v == "") v = " ";
                s += "<td>" + v.toHtml().replace(/\r\n|\n|\r/g, "<br/>");
                s += "</td>\n";
            }
        }
        s += "</tr>\n";
    }
    s += "</tbody>";
    if (addSummary) {
        s += "<tfoot><tr>";
        if (addLineNumbers) s += "<th>Sum</th>";
        for (x = 0; x < a.length; x++) { //for each column
            k = a[x] - 1;
            if (CSV.statsCnt[k] && (CSV.statsCnt[k].fieldType == "N" || CSV.statsCnt[k].fieldType == "I")) {
                s += "<th align=\"right\">" + sumFields[k].toFixed(CSV.statsCnt[k].fieldDecs) + "</th>\n";
            }
            else {
                s += "<th>&nbsp;</th>";
            }
        }
        s += "</tr></tfoot>\n";

    }
    s += "</table>";
    return s;
}
// wrap an array of values with html table tags but with 2 columns of header/value
function csvToTableHeaderValue(CSV, addHeaderIfMissing, addLineNumbers, addSummary, options) {
    var j, k, coltag;
    var s = "<table class=\"table table-bordered table-hover table-condensed\">\n";
    var a = [];
    var x = 0;
    var v = "";
    if(!CSV){return;}
    a = getFldPosArr(CSV);
    if (CSV.isFirstRowHeader || addHeaderIfMissing) {
        s += "<thead><tr><th>Field</th><th>Value</th></tr></thead>";
    }
    s += "<tbody>";
    for (j = 0; j < CSV.table.length; j++) {
        //alert("in csvToTable, continuing.... v=" + v);

        for (x = 0; x < a.length; x++) { //for each column display the header/value
            s += "<tr>";
            if (x == 0 && addLineNumbers) {
                s += "<th>Record #</th><th>" + (j + 1) + "</th></tr><tr>\n";
            }
            //header column
            k = a[x] - 1;
            if (k > CSV.arHeaderRow.length) v = "FIELD" + k;
            else v = CSV.arHeaderRow[k];
            s += '<th title="Field #' + (k + 1) + '">' + v.toHtml().replace(/\r\n|\r|\n/g, "<br/>") + "</th>\n";

            k = a[x] - 1;
            if (k >= CSV.table[j].length) v = " ";
            else v = CSV.table[j][k];
            v = doTransformations(v, k, CSV);
            if (CSV.statsCnt[k] && (CSV.statsCnt[k].fieldType == "N" || CSV.statsCnt[k].fieldType == "I")) {
                s += "<td align=\"right\">" + v.toFixed(CSV.statsCnt[k].fieldDecs) + "</td>\n";
            }
            else if (v != "" && 'dateOutFormat' in options && options.dateOutFormat != "" && CSV.statsCnt[k] && CSV.statsCnt[k].fieldType == "D") {
                try {
                    var v = moment(v, CSV.dateformat[k]).format(options.dateOutFormat);
                } catch (e) { ; }
                s += "<td>" + v.toHtml().replace(/\r\n|\n|\r/g, "<br/>");
                s += "</td>\n";
            }
            else {
                if (v == "") v = " ";
                s += "<td>" + v.toHtml().replace(/\r\n|\n|\r/g, "<br/>") + "</td>\n";
            }
            s += "</tr>\n";
        }
        s += "";
    }
    s += "</tbody>";
    s += "</table>";
    return s;
}
// wrap an array of values with mediWiki markup
function csvToWikiTable(CSV, addHeaderIfMissing, addLineNumbers, addSummary) {
    var j, k, coltag;
    var s = '{| class="wikitable sortable"\n';
    var a = [];
    var x = 0;
    var v = "";
    var sumFields = [];
    if(!CSV){return;}
    a = getFldPosArr(CSV);
    for (k = 0; k < CSV.maxColumnsFound; k++) sumFields.push(0); // max length of columns
    if (CSV.isFirstRowHeader || addHeaderIfMissing) {
        s += "|-\n"; // new row
        if (addLineNumbers) s += "! #\n";
        for (x = 0; x < a.length; x++) { //for each header column
            k = a[x] - 1;
            if (k > CSV.arHeaderRow.length) v = "FIELD" + k;
            else v = CSV.arHeaderRow[k];
            s += '! ' + v.toHtml().replace(/\r\n|\r|\n/g, "<br/>") + "\n";
        }
        // s+="\n";
    }
    //s+="<tbody>";   // the body
    for (j = 0; j < CSV.table.length; j++) {
        //alert("in csvToTable, continuing.... v=" + v);
        s += "|-\n";
        if (addLineNumbers) s += "! " + (j + 1) + "\n";
        for (x = 0; x < a.length; x++) { //for each column
            k = a[x] - 1;
            if (k >= CSV.table[j].length) v = " ";
            else v = CSV.table[j][k];
            v = doTransformations(v, k, CSV);
            if (x > 0) s += " |";
            if (CSV.statsCnt[k] && (CSV.statsCnt[k].fieldType == "N" || CSV.statsCnt[k].fieldType == "I")) {
                //s+='| style="text-align:right;" | '+v.toFixed(CSV.statsCnt[k].fieldDecs)+"\n";
                s += '| ' + v.toFixed(CSV.statsCnt[k].fieldDecs);
                sumFields[k] += 1 * v;
            }
            else {
                if (v == "") v = " ";
                s += "| " + v.toHtml().replace(/\r\n|\n|\r/g, "<br/>").replace(/\|/g, "<nowiki>|</nowiki>");
            }
        }
        s += "\n"; // end of row
    } // for
    s += "";
    if (addSummary) {
        s += "|-\n"; // table footer
        if (addLineNumbers) s += "! Sum\n";
        for (x = 0; x < a.length; x++) { //for each column
            k = a[x] - 1;
            if (CSV.statsCnt[k] && (CSV.statsCnt[k].fieldType == "N" || CSV.statsCnt[k].fieldType == "I")) {
                s += "! " + sumFields[k].toFixed(CSV.statsCnt[k].fieldDecs) + "\n";
            }
            else {
                s += "! \n";
            }
        }
        //s+="\n";
    }
    s += "|}"; // end of table
    return s;
}
// wrap an array of values with XML tags
function csvToXml(CSV, topName, rowName) {
    var j = 0, k, col;
    var hdr;
    var topLevel = topName || "ROWSET";
    var rowLevel = rowName || "ROW";
    var s = "<?xml version=\"1.0\"?>\n<" + topLevel + ">\n";
    var a = [];
    var x = 0;
    var v = "";
    var h = "";
    if(!CSV){return;}
    a = getFldPosArr(CSV);
    if (CSV.table.length === 0) return s + "</" + topLevel + ">";
    hdr = getCsvHeader(CSV);
    for (j = 0; j < CSV.table.length; j++) {
        s += "<" + rowLevel + ">\n";
        for (x = 0; x < a.length; x++) {
            k = a[x] - 1;
            if (k >= CSV.table[j].length) v = "";
            else v = CSV.table[j][k] + "";
            v = doTransformations(v, k, CSV);

            if (k >= hdr.length) h = "FIELD" + k;
            else h = hdr[k].replace(/[:~\/\\;?$@%=\[\]+='"`|()*\^&<>]/, "-");
            s += "<" + h.replace(/\s+/g, '_') + ">" + v.toXml() + "</" + h.replace(/\s+/g, '_') + ">\n";
        }
        s += "</" + rowLevel + ">\n";
    }
    s += "</" + topLevel + ">";
    return s;
}
function csvToXmlProperties(CSV, topName, rowName, options) {
    var j = 0, k, col;
    var hdr;
    var topLevel = topName || "ROWSET";
    var rowLevel = rowName || "ROW";
    option = options || {};
    var s = "<?xml version=\"1.0\"?>\n<" + topLevel + ">\n";
    var a = [];
    var x = 0;
    var v = "";
    var h = "";
    if(!CSV){return;}
    a = getFldPosArr(CSV);
    if (CSV.table.length === 0) return s + "</" + topLevel + ">";
    hdr = getCsvHeader(CSV);
    for (j = 0; j < CSV.table.length; j++) {
        s += "<" + rowLevel;
        for (x = 0; x < a.length; x++) {
            k = a[x] - 1;
            if (k >= CSV.table[j].length) v = "";
            else v = CSV.table[j][k];
            if (options.skipEmpty && (v === null || v === undefined || v === "")) { continue; }

            v = doTransformations(v, k, CSV);
            if (k >= hdr.length) h = "FIELD" + k;
            else h = hdr[k].replace(/[:~\/\\;?$@%=\[\]+='"`|()*\^&<>]/, "-");
            s += " " + h.replace(/\s+/g, '_') + '="' + (v + "").toXml() + '"';
        }
        s += "></" + rowLevel + ">\n";
    }
    s += "</" + topLevel + ">";
    return s;
}
// wrap an array of values with JSON
function csvToJSON(CSV, options) {
    var j = 0, k, kp, col;
    var hdr;
    var s = "";
    var a = [];
    var x = 0;
    var v = "";
    var h = "";
    var emptyIsNull = false;
    var fldcnt = 0;

    if (options.isKeyed) options.mongoDbMode = false;
    if(!CSV){return;}
    a = getFldPosArr(CSV);
    hdr = getCsvHeader(CSV);
    var yep = false;
    var firstArray = true;

    if (CSV.table.length === 0) {
        if (options.mongoDbMode) return "";
        if (options.isKeyed) return "{}";
        return "[]";
    }

    if (options.tryToObject) {
        for (j = 0; j < hdr.length; j++) {
            if (hdr[j].indexOf("../index.html") >= 0) { yep = true; break; }
            if (isNaN(hdr[j].split("../index.html")[0]) || !Number.isInteger(hdr[j].split("../index.html")[0] * 1)) firstArray = false;
        }
        if (firstArray) yep = true;
        if (yep) return csvToJSONSpecial(CSV, options);
    }
    if (!options.mongoDbMode) s = "[" + "\n";

    for (j = 0; j < CSV.table.length; j++) // for each data row
    {

        if (!options.mongoDbMode) s += " ";
        s += "{";
        if (!options.mongoDbMode) s += "\n";

        fldcnt = 0;
        for (x = 0; x < a.length; x++) {   // for each column
            k = a[x] - 1;
            emptyIsNull = document.getElementById("chknull" + (k + 1)) && document.getElementById("chknull" + (k + 1)).checked;

            if (k >= CSV.table[j].length) v = "";
            else v = CSV.table[j][k];

            if (v == "" && options.skipEmpty) { continue; }
            s += (fldcnt > 0 ? ',' + (options.mongoDbMode ? '' : '\n') : '');
            if (k >= hdr.length || !hdr[k] || hdr[k] == "") { h = "FIELD" + (x + 1); }
            else { h = hdr[k]; }
            if (!options.mongoDbMode) s += "  ";
            s += ' "' + h.toJson() + '": '; // field name
            v = doTransformations(v, k, CSV);
            // if numeric then don't wrap in double quotes
            if (!options.forceWrap && (CSV.statsCnt[k] && (CSV.statsCnt[k].fieldType == "N" || CSV.statsCnt[k].fieldType == "I" || CSV.statsCnt[k].fieldType == "B") || (options.autoNum && v.isNumeric()))) {
                if (v.trim() != "") {
                    v = v.toNumber() + ""; // NOTE - this removes padding of zeros for decimals... i.e. 2 decimals - 2.300 but is okay for 2.34555
                    //        presentation doesn't matter in JSON so this is okay.
                    if (v.left(1) == getDecimalChar()) v = "0" + v;
                    if (v.left(2) == "-" + getDecimalChar()) v = "-0" + v.substr(1);
                    s += v; // See if this works with $ signs.
                }
                else
                    s += 'null';
            }
            else if (!options.forceWrap && CSV.statsCnt[k] && (CSV.statsCnt[k].fieldType == "L")) {
                if (v.trim() != "") {
                    s += v.toLocaleLowerCase();
                }
                else {
                    s += 'null';
                }
            }
            else {

                if ((emptyIsNull && v == "") || (options.nullIsNull && (v.toUpperCase() == "NULL" || v === "\\N")))
                    s += "null";
                else
                    s += '"' + v.toJson() + '"';
            }
            fldcnt++;
        }
        if (!options.mongoDbMode) s += "\n";
        s += " }";
        if (j < CSV.table.length - 1 && !options.mongoDbMode) s += ",";
        s += "\n";
    }
    if (!options.mongoDbMode) s += "]";

    if (!options.mongoDbMode && options.isKeyed) {
        // convert into keyed object
        kp = 1;
        if (document.getElementById("txtKeyNum")) {
            kp = document.getElementById("txtKeyNum").value || "1";
            if (isNaN(kp)) kp = 1; else kp = +kp;
            if (kp < 1) kp = 1;
        }
        kp = kp - 1;

        a = JSON.parse(s);
        s = "";
        var newa = {};
        var kn = hdr[kp];
        var dups = false;
        for (i = 0; i < 2; i++) { //twice
            newa = {};
            for (j = 0; j < a.length; j++) {

                if (kp >= CSV.table[j].length) keyvalue = "";
                else keyvalue = CSV.table[j][kp];
                keyvalue = doTransformations(keyvalue, kp, CSV);

                if (kn in a[j]) {
                    delete a[j][kn];
                }
                if (keyvalue in newa) { // already in there, push it
                    if (i == 0) {
                        dups = true;
                        break;
                    }
                    newa[keyvalue].push(a[j]);
                }
                else {
                    switch (dups) {
                        case false: newa[keyvalue] = a[j]; break; // object
                        case true: newa[keyvalue] = [a[j]]; break; // array.
                    }
                }
            } // for each row
            if (i == 0 && !dups) break;
        } // twice
        return JSON.stringify(newa, null, 3);
    } // keyed JSON - associative array

    return s;
}
function csv2jsonObj(hdr, v, options) {
    var t = [];
    var p = [];
    var o = {};
    var firstArray = true;

    function delete_null_properties(test, recurse) {
        var i;
        for (var i in test) {
            if (test[i] === null || test[i] === "") {
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
    var spacing = (options.mongoDbMode) ? 0 : 3;
    return JSON.stringify(o, null, spacing);
}
// wrap an array of values with JSON reconstructing objects as indicated in header.
function csvToJSONSpecial(CSV, options) {
    var j = 0, k, col;
    var hdr;
    var s = "[\n";
    var a = [];
    var x = 0;
    var v = "";
    var h = "";
    var t = "{\n";
    var cur = "";
    var emptyIsNull = false;
    var kp;
    var keyvalue;

    if (options.mongoDbMode) s = "";
    if(!CSV){return;}
    a = getFldPosArr(CSV);
    if (CSV.table.length === 0) {
        if (options.mongoDbMode) return "";
        return s + "]";
    }
    hdr = getCsvHeader(CSV);

    for (j = 0; j < CSV.table.length; j++)  // for each record
    {

        s += " ";
        cur = "[";
        for (x = 0; x < a.length; x++) { // for each field
            k = a[x] - 1;
            emptyIsNull = document.getElementById("chknull" + (k + 1)) && document.getElementById("chknull" + (k + 1)).checked;

            if (k >= CSV.table[j].length) v = "";
            else v = CSV.table[j][k];
            v = doTransformations(v, k, CSV);

            if (!options.forceWrap && (CSV.statsCnt[k] && (CSV.statsCnt[k].fieldType == "N" || CSV.statsCnt[k].fieldType == "I" || CSV.statsCnt[k].fieldType == "B") || (options.autoNum && v.isNumeric()))) {
                if (v.rtrim() != "") {
                    v = v.toNumber() + "";
                    if (v.left(1) == getDecimalChar()) v = "0" + v;
                    if (v.left(2) == "-" + getDecimalChar()) v = "-0" + v.substr(1);
                    cur += v;
                }
                else
                    cur += 'null';
            }
            else if (!options.forceWrap && CSV.statsCnt[k] && (CSV.statsCnt[k].fieldType == "L")) {
                if (v != "") {
                    cur += v.toLocaleLowerCase(); // See if this works with $ signs.
                }
                else {
                    cur += 'null';
                }
            }
            else {
                if ((emptyIsNull && v == "") || (options.nullIsNull && (v.toUpperCase() == "NULL" || v === "\\N")))
                    cur += "null";
                else
                    cur += '"' + v.toJson() + '"';
            }
            cur += (x < a.length - 1 ? ',' : '');
        } // for each field
        cur += "]";
        s += csv2jsonObj(hdr, JSON.parse(cur), options);
        //alert(JSON.stringify(hdr));
        //alert(cur);
        if (j < CSV.table.length - 1 && !options.mongoDbMode) s += ",";
        s += "\n";
    } // for each record
    if (!options.mongoDbMode) s += "]";

    if (!options.mongoDbMode && options.isKeyed) {
        // convert into keyed object
        kp = 1;
        if (document.getElementById("txtKeyNum")) {
            kp = document.getElementById("txtKeyNum").value || "1";
            if (isNaN(kp)) kp = 1; else kp = +kp;
            if (kp < 1) kp = 1;
        }
        kp = kp - 1;

        a = JSON.parse(s);
        s = "";
        var newa = {};
        var kn = hdr[kp];
        var dups = false;
        for (i = 0; i < 2; i++) { //twice
            newa = {};
            for (j = 0; j < a.length; j++) {

                if (kp >= CSV.table[j].length) keyvalue = "";
                else keyvalue = CSV.table[j][kp];
                keyvalue = doTransformations(keyvalue, kp, CSV);

                if (kn in a[j]) {
                    delete a[j][kn];
                }
                if (keyvalue in newa) { // already in there, push it
                    if (i == 0) {
                        dups = true;
                        break;
                    }
                    newa[keyvalue].push(a[j]);
                }
                else {
                    switch (dups) {
                        case false: newa[keyvalue] = a[j]; break; // object
                        case true: newa[keyvalue] = [a[j]]; break; // array.
                    }
                }
            } // for each row
            if (i == 0 && !dups) break;
        } // twice
        return JSON.stringify(newa, null, 3);
    } // keyed JSON - associative array
    return s;
}
// wrap an array of values with JSON in array format
function csvToJSONArray(CSV, options) {
    var j = 0, k, col;
    var hdr;
    var s = "[\n";
    var a = [];
    var x = 0;
    var v = "";
    var h = "";
    var t = "{\n";
    var emptyIsNull = false;

    if(!CSV){return;}
    a = getFldPosArr(CSV);
    if (CSV.table.length === 0) return s + "]";
    hdr = getCsvHeader(CSV);
    if (options.useFieldsData) {
        t += "  \"" + (options.fldPropName || "fields") + "\": [";
        for (x = 0; x < a.length; x++) { // for each header
            k = a[x] - 1;
            if (k >= hdr.length) h = "FIELD" + k;
            else h = hdr[k];
            if (x > 0) t += ", ";
            t += h.enclose('"');
        }
        t += "],\n";
        t += "  \"" + (options.dataPropName || "data") + "\": ";
    }
    for (j = 0; j < CSV.table.length; j++)  // for each record
    {
        if (a.length > 1) {
            s += "  [";
        }
        for (x = 0; x < a.length; x++) { // for each field
            k = a[x] - 1;
            emptyIsNull = document.getElementById("chknull" + (k + 1)) && document.getElementById("chknull" + (k + 1)).checked;

            if (k >= CSV.table[j].length) v = "";
            else v = CSV.table[j][k];
            //if (k >= hdr.length) h = "FIELD"+k;
            //else h = hdr[k];
            v = doTransformations(v, k, CSV);

            if (!options.forceWrap && CSV.statsCnt[k] && (CSV.statsCnt[k].fieldType == "N" || CSV.statsCnt[k].fieldType == "I" || CSV.statsCnt[k].fieldType == "B")) {
                if (v.trim() != "") {
                    v = v.toNumber() + "";
                    if (v.left(1) == getDecimalChar()) v = "0" + v;
                    if (v.left(2) == "-" + getDecimalChar()) v = "-0" + v.substr(1);
                    s += v;
                }
                else
                    s += 'null';
            }
            else if (!options.forceWrap && CSV.statsCnt[k] && (CSV.statsCnt[k].fieldType == "L")) {
                if (v.trim() != "") {
                    s += v.toLocaleLowerCase();
                }
                else {
                    s += 'null';
                }
            }
            else {
                if ((emptyIsNull && v == "") || (options.nullIsNull && (v.toUpperCase() == "NULL" || v === "\\N")))
                    s += "null";
                else
                    s += '"' + v.toJson() + '"';
            }
            s += (x < a.length - 1 ? ',' : '');
        } // for each field
        if (a.length > 1) {
            s += "  ]";
        }
        if (j < CSV.table.length - 1) s += ",";
        s += "\n";
    } // for each record
    s += "]";
    if (options.useFieldsData) {
        s = t + s + "\n}";
    }
    return s;
}
// wrap an array of values with JSON - field:[v1,v2,...]
function csvToJSONColumnArray(CSV, options) {
    var j = 0, k, col;
    var hdr;
    var s = "{\n";
    var a = [];
    var x = 0;
    var v = "";
    var h = "";
    var emptyIsNull = false;

    if(!CSV){return;}
    a = getFldPosArr(CSV);
    if (CSV.table.length === 0) return s + "]";
    hdr = getCsvHeader(CSV);
    for (x = 0; x < a.length; x++) // for each column
    {
        k = a[x] - 1;
        emptyIsNull = document.getElementById("chknull" + (k + 1)) && document.getElementById("chknull" + (k + 1)).checked;

        if (x >= hdr.length) h = "FIELD" + k;
        else h = hdr[k];
        s += '   "' + h + '":[';
        var crow = 0;
        for (j = 0; j < CSV.table.length; j++) {

            crow++;
            s += (crow > 1 ? ',' : '');
            if (x >= CSV.table[j].length) v = "";
            else v = CSV.table[j][k];
            v = doTransformations(v, k, CSV);

            if (!options.forceWrap && CSV.statsCnt[k] && (CSV.statsCnt[k].fieldType == "N" || CSV.statsCnt[k].fieldType == "I" || CSV.statsCnt[k].fieldType == "B")) {
                if (v.trim() != "") {
                    v = v.toNumber() + "";
                    if (v.left(1) == getDecimalChar()) v = "0" + v;
                    if (v.left(2) == "-" + getDecimalChar()) v = "-0" + v.substr(1);
                    s += v;
                }
                else
                    s += 'null';
            }
            else if (!options.forceWrap && CSV.statsCnt[k] && (CSV.statsCnt[k].fieldType == "L")) {
                if (v.trim() != "") {
                    s += v.toLocaleLowerCase();
                }
                else {
                    s += 'null';
                }
            }
            else {
                if ((emptyIsNull && v == "") || (options.nullIsNull && (v.toUpperCase() == "NULL" || v === "\\N")))
                    s += "null";
                else
                    s += '"' + v.toJson() + '"';
            }
            //s+= (crow<CSV.table.length?',':'');
        }
        s += "]";
        if (x < a.length - 1) s += ",";
        s += "\n";
    }
    s += "}";
    return s;
}

// Convert JSON to CSV
function jsonToCsv(objArray, delimiter, bIncludeHeaders, bQuotes, noMultiLines) {
    var array;
    var str = '';
    var line = '';
    var i, j;
    var index;
    var value;
    var columns = [];

    try { array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray; }
    catch (e) { if (objArray.charAt(0) === "[" || objArray.charAt(0) === "{") array = eval("array=" + objArray); else throw e; }

    if (!_.isObject(array) || array == null || _.isEmpty(array)) { // simple value or null or empty object
        line = "";
        str = "";
        if (bIncludeHeaders) {
            value = 'Field1';
            if (bQuotes) line = '"' + value.replace(/"/g, '""') + '"' + delimiter;
            else line = value.toCsv(delimiter, '"');
            str += line + '\n';
        }
        if (!(array && _.isObject(array) && _.isEmpty(array))) {
            if (array == null) value = ""; else value = array + "";
            if (noMultiLines) value = value.replace(/\r\n|\r|\n/g, ' ');
            str += (bQuotes ? '"' : "") + ("" + value).toCsv(delimiter, '"') + (bQuotes ? '"' : "") + '\n';
        }
        return str;
    }
    var depth = getJsonLevel(array);
    // If an Array - handle it separately  [1,2,3]
    if ((depth == 2) && (_.isArray(array))) {
        if (bIncludeHeaders) {
            value = 'Field1';
            if (bQuotes) line += '"' + value.replace(/"/g, '""') + '"' + delimiter;
            else line += value.toCsv(delimiter, '"');
            str += line + '\n';
        }
        for (i = 0; i < array.length; i++) {
            var line = '';
            value = array[i];
            if (value == null) value = ""; else value += "";
            if (noMultiLines) value = value.replace(/\r\n|\r|\n/g, ' ');
            line += (bQuotes ? '"' : "") + ("" + value).toCsv(delimiter, '"') + (bQuotes ? '"' : "");
            str += line + '\n';
        }
        return str;
    }
    // If an Array of Arrays with just 2 level of arrays - handle it separately [ [1,2,3],[4,5,6] ]
    if ((depth == 3) && (_.isArray(array)) && (_.every(_.values(array), _.isArray))) {
        if (bIncludeHeaders) {
            // NOTE - I need to change this to determine columns at the end and readjust arrays to include maximum columns
            var head = array[0]; // header based on 1st array entry
            for (index in array[0]) {
                value = 'Field' + (index * 1 + 1);
                columns.push(value);
                if (bQuotes) line += '"' + value.replace(/"/g, '""') + '"' + delimiter;
                else line += value.toCsv(delimiter, '"') + delimiter;
            }
            line = line.slice(0, -1);
            str += line + '\n';
        }
        else {  // need this to know # of fields
            for (index in array[0]) columns.push(index); // # of columns based on first array entry
        }
        for (i = 0; i < array.length; i++) { // for each array entry
            var line = '';
            for (j = 0; j < columns.length; j++) { // for each column
                value = array[i][j];
                if (value == null) value = ""; else value += "";
                if (noMultiLines) value = value.replace(/\r\n|\r|\n/g, ' ');
                line += ("" + value).toCsv(delimiter, '"', '"', bQuotes) + delimiter;
            }

            line = line.slice(0, -1 * delimiter.length);
            str += line + '\n';
        }
        return str;
    } // 2 levels of arrays

    for (; ;) {
        // convert an object with 1 property with value of array to just an array (drop property)
        if (_.isObject(array)
            && !(_.isArray(array))
            && _.keys(array).length == 1
            && (_.isObject(_.values(array)[0])
                || (_.isArray(_.values(array)[0])
                    && _.isObject(_.values(array)[0][0]))
            )) {
            array = _.values(array)[0];
        }
        else break;
    }

    if (_.isArray(array) == false && _.isObject(array) == true) {
        array = JSON.flatten(array);
        array = JSON.parse('[' + JSON.stringify(array) + ']');
    }

    //  begin
    for (i = 0; i < array.length; i++) {
        for (j = 0; j < columns.length; j++) {
            value = array[i][columns[j]];
            if (_.isArray(value) == false && _.isObject(value) == true) {
                if (columns[j] in array[i]) array[i][columns[j]] = JSON.flatten(value);
            }
        }
    }
    // end

    if (_.isObject(array[0]) && _.every(_.values(array), _.isObject)) {
        if (bIncludeHeaders) {
            var head = array[0];
            if (bQuotes) {
                for (index in array[0]) {
                    value = index + "";
                    columns.push(value);
                    line += '"' + value.replace(/"/g, '""') + '"' + delimiter;
                }
            } else {
                for (index in array[0]) {
                    value = index + "";
                    columns.push(value);
                    line += value.toCsv(delimiter, '"') + delimiter;
                }
            }
            line = line.slice(0, -1);
            str += line + '\n';
        }
        else {  // need this to know # of fields
            for (index in array[0]) columns.push(index);
        }
    }
    if (columns.length === 0 && _.isArray(array) == true) {
        str = "";
        if (bIncludeHeaders) {
            value = 'Field1';
            if (bQuotes) line += '"' + value.replace(/"/g, '""') + '"' + delimiter;
            else line += value.toCsv(delimiter, '"');
            str += line + '\n';
        }
        for (i = 0; i < array.length; i++) {
            var line = '';
            value = array[i];
            if (value == null) value = "";
            else value += "";
            if ((value + "").substring(0, 15) == "[object Object]") value = JSON.valueArray(array[i]).slice(0, -1);
            if (noMultiLines) value = value.replace(/\r\n|\r|\n/g, ' ');
            line += (bQuotes ? '"' : "") + ("" + value).toCsv(delimiter, '"') + (bQuotes ? '"' : "");
            str += line + '\n';
        }
        return str;
    }

    for (i = 0; i < array.length; i++) { // for each array entry
        var line = '';
        if (bQuotes) {
            for (j = 0; j < columns.length; j++) {
                value = array[i][columns[j]];
                if ((value + "").substring(0, 15) == "[object Object]") value = JSON.valueArray(array[i][columns[j]]).slice(0, -1);
                if (value == null) value = ""; else value += "";
                if (noMultiLines) value = value.replace(/\r\n|\r|\n/g, ' ');
                line += '"' + value.replace(/"/g, '""') + '"' + delimiter;
            }
        } else {
            for (j = 0; j < columns.length; j++) {
                value = array[i][columns[j]];
                if ((value + "").substring(0, 15) == "[object Object]") value = JSON.valueArray(array[i][columns[j]]).slice(0, -1);
                if (value == null) value = ""; else value += "";
                if (noMultiLines) value = value.replace(/\r\n|\r|\n/g, ' ');
                line += ("" + value).toCsv(delimiter, '"') + delimiter;
            }
        }

        line = line.slice(0, -1 * delimiter.length);
        str += line + '\n';
    }
    return str;
}

// produce fixed width lines from an array of values, optionally wrap with ascii table
function csvToFixed(CSV, options) {
    var j = 0;
    var k;
    var col;
    var d;
    var s = "";
    var a = [];
    var x = 0;
    var v = "";
    var ruler = "";
    var ruler10 = "";
    if(!CSV){return;}
    a = getFldPosArr(CSV);
    var centerAdjust = false;
    var rightAdjust = false;
    if (typeof options.addsep === 'undefined' || options.addsep == null) options.addsep = " ";
    if (options.addTable && (options.addsep === "" || options.addsep === " ")) options.addsep = "|";
    if (!options) options = {};
    if (CSV.table.length === 0) return s;
    var hdr = getCsvHeader(CSV);
    var stats = getCsvColLength(CSV) || [];
    var linewidth = 0;
    var rulerSize = 0;
    var rulerdash = "";
    if (options.addTable) {
        for (x = 0; x < a.length; x++) {  // what is width of all fields
            k = a[x] - 1;
            if (CSV.isFirstRowHeader && hdr[k] && hdr[k].length > stats[k]) stats[k] = hdr[k].length;
            linewidth += stats[k] + 1;
        }
        if (options.addLineNumbers) linewidth += ("" + CSV.table.length).length + 1;
        s += "+".rpad(linewidth, "-") + "+\n";
        if (CSV.isFirstRowHeader) {
            s += options.addsep;
            if (options.addLineNumbers) s += "#".rpad(("" + CSV.table.length).length) + options.addsep;
            for (x = 0; x < a.length; x++) { // output header
                k = a[x] - 1;
                if (x > 0) s += options.addsep;
                if (k >= hdr.length) v = "";
                else v = hdr[k].replace(/\r\n|\r|\n/g, ' ');
                s += v.rpad(stats[k]);
            }
            s += options.addsep + "\n";
            s += "+".rpad(linewidth, "-") + "+\n";
        }
    }
    var crow = 0;
    for (j = 0; j < CSV.table.length; j++) // for each line
    {
        crow++;
        if (options.addTable) s += options.addsep;
        if (options.addLineNumbers) s += ("" + crow).rpad(("" + CSV.table.length).length) + options.addsep;

        for (x = 0; x < a.length; x++) {
            k = a[x] - 1;
            if (x > 0) s += options.addsep;
            if (k >= CSV.table[j].length) v = "";
            else v = CSV.table[j][k];
            if (options.nullIsEmpty && (v.toUpperCase() == "NULL" || v === "\\N")) v = "";
            rightAdjust = false;
            centerAdjust = false;

            v = doTransformations(v, k, CSV);
            if (document.getElementById("chkrjust" + (k + 1))) if (document.getElementById("chkrjust" + (k + 1)).checked) rightAdjust = true;
            if (document.getElementById("chkcjust" + (k + 1))) if (document.getElementById("chkcjust" + (k + 1)).checked) centerAdjust = true;
            if (centerAdjust) s += v.replace(/\r\n|\r|\n/g, ' ').cjust(stats[k]);
            else if (rightAdjust) s += v.replace(/\r\n|\r|\n/g, ' ').rjust(stats[k]);
            else s += v.replace(/\r\n|\r|\n/g, ' ').rpad(stats[k]);
            //window.alert(s+",padding="+stats[k]);
        }
        var z;
        if (!options.addTable && options.addRuler && crow == 1) {
            for (z = 1; z <= s.length; z++) {
                ruler += ("" + z).right(1);
            }
            if (s.length >= 10) {
                for (z = 1, x = 10; x <= s.length; x += 10, z++) {
                    ruler10 += "         " + ("" + z).right(1);
                }
                ruler10 = ruler10.rpad(ruler.length);
                ruler = ruler10 + "\n" + ruler;
            }
        }
        if (options.addTable) s += options.addsep;
        s += "\n";
        if (options.addTable && options.addLineSep) s += "+".rpad(linewidth, "-") + "+\n";
    }
    if (options.addTable && !options.addLineSep) s += "+".rpad(linewidth, "-") + "+\n";
    if (options.addRuler && !options.addTable) {
        a = ruler.split("\n");
        rulerdash = a[a.length-1].replace(/[12346789]/g, "-").replace(/0/g, '|').replace(/5/g, '+');
        s = ruler + "\n" + rulerdash + "\n" + s;
    }
    return s;
}
// Fixed Width to CSV
function fixedToCsv(input, fieldDef, delimiter, bIncludeHeaders, bQuotes, nowrap, notrim) {
    var fa = fieldDef.split('|') || []; // the field definition array pos,length,heading
    var str = '';
    var line = '';
    var fld = [];
    var header = "";
    var array = input.split(/\n|\r|\r\n/gmi);  // each input line
    var i, j;

    if (array[array.length - 1] == "") array.pop();

    if (bIncludeHeaders) {
        for (i = 0; i < fa.length; i++) {
            fld = fa[i].split(',');
            if (fld.length > 2) header = fld[2]; else header = "F" + (i + 1);
            if (bQuotes) {
                str += '"' + header.replace(/"/g, '""') + '"' + delimiter;
            }
            else {
                str += header.toCsv(delimiter, '"') + delimiter;
            }
        }
        str = str.slice(0, -1 * delimiter.length) + "\n";
    } // include csv header
    var p = 0;
    var len = 0;
    var head = "";
    for (i = 0; i < array.length; i++) {  // each line
        line = "";
        if (array[i] == "") continue;
        for (j = 0; j < fa.length; j++) {
            fld = fa[j].split(',') || [];
            if (fld.length > 0) p = fld[0] - 1; else p = 0;
            if (fld.length > 1) len = fld[1]; else len = 0;
            if (fld.length > 2) head = fld[2]; else head = "f" + (j + 1);
            //if (bQuotes) line += '"' + value.replace(/"/g, '""') + '"' + delimiter;
            if (notrim) value = array[i].substr(p, len); else value = array[i].substr(p, len).trim();
            if (value == null) value = ""; else value += "";
            if (bQuotes) {
                line += '"' + ("" + value).replace(/"/g, '""') + '"' + delimiter;
            }
            else if (nowrap) {
                line += ("" + value) + delimiter;
            }
            else {
                line += ("" + value).toCsv(delimiter, '"') + delimiter;
            }
        }
        line = line.slice(0, -1 * delimiter.length); // remove the last delimiter
        str += line + '\n';
    }
    return str;
}

// convert array of values to multi-line data
function csvToMulti(CSV, sep, addFieldName, addFieldNameSep, addLineAfterField, addXSpaces, noMultiLines, bQuotes, csvFormat, nullIsNull) {
    var j = 0, k, col;
    var hdr;
    var s = "";
    var a = [];
    var x = 0;
    var v = "";
    var fheader = "";

    addXSpaces = addXSpaces || "0";
    if (isNaN("0" + addXSpaces)) addXSpaces = "0";
    a = getFldPosArr(CSV);
    if(!CSV){return;}
    addFieldNameSep = addFieldNameSep || '';
    if (CSV.table.length === 0) return s;
    hdr = getCsvHeader(CSV);
    for (j = 0; j < CSV.table.length; j++) // each row
    {

        for (x = 0; x < a.length; x++) {
            fheader = "";
            k = a[x] - 1;
            if (k >= CSV.table[j].length) {
                v = "";
            }
            else {
                v = CSV.table[j][k] + "";
                if (v && noMultiLines) v = v.replace(/\r\n|\r|\n/g, ' ');
            }
            if (v && nullIsNull) v = v.replace(/^null$/gmi, '');
            v = doTransformations(v, k, CSV);
            if (csvFormat) {
                v = v.toCsv(sep, CSV.outputQuote, CSV.outputQuote, bQuotes);
            }

            if (addFieldName) {
                if (csvFormat) {
                    if (k >= CSV.arHeaderRow.length) {
                        fheader = ("".rpad(addXSpaces) + "Field-" + (k + 1)).toCsv(sep, CSV.outputQuote, CSV.outputQuote, bQuotes) + addFieldNameSep;
                    }
                    else {
                        fheader = ("".rpad(addXSpaces) + CSV.arHeaderRow[k].replace(/\r\n|\r|\n/g, ' ')).toCsv(sep, CSV.outputQuote, CSV.outputQuote, bQuotes) + addFieldNameSep;
                    }
                }
                else {
                    if (k >= CSV.arHeaderRow.length) {
                        fheader = "".rpad(addXSpaces) + "Field-" + (k + 1) + addFieldNameSep;
                    }
                    else {
                        fheader = "".rpad(addXSpaces) + CSV.arHeaderRow[k].replace(/\r\n|\r|\n/g, ' ') + addFieldNameSep;
                    }
                }
            }
            s += fheader + v + "\n";
            if (addLineAfterField) s += "\n";
        }
        if (!csvFormat) s += sep + "\n";
    }
    return s;
}
// convert array of values to google Earth KML format
// https://developers.google.com/kml/documentation/kml_tut
// http://econym.org.uk/gmap/kml.htm
function csvToKml(CSV, nameCol, descCol, latCol, longCol, altCol, descCol2) {
    var j = 0, k, col;
    var hdr;
    var desc2 = "";
    var altitude = "";
    var s = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
    s += "<kml xmlns=\"http://earth.google.com/kml/2.0\">\n";
    s += "<Document>\n";
    if(!CSV){return;}
    if (CSV.table.length === 0) return s + "</Document></kml>";
    hdr = getCsvHeader(CSV);
    if (descCol2.trim() == "" || isNaN(descCol2) || (descCol2 * 1 < 1 || descCol2 * 1 > CSV.table[0].length)) {
        descCol2 = "";
    }
    for (j = 0; j < CSV.table.length; j++) {
        s += "<Placemark>\n";
        desc2 = "";
        // <name></name><description></description><Point><coordinates>-74.0,40.7,0</coordinates></Point>
        for (k = 0; k < CSV.table[j].length; k++) { // for each column
            if (k >= hdr.length) break;//test this.
            if (!isNaN(latCol) && k == (latCol - 1)) continue;
            if (!isNaN(longCol) && k == (longCol - 1)) continue;
            if (!isNaN(altCol) && k == (altCol - 1)) continue;
            if (!isNaN(nameCol) && k == (nameCol - 1)) hdr[k] = "name";
            else if (!isNaN(descCol) && k == (descCol - 1)) {
                hdr[k] = "description";
                if (descCol2 != "") desc2 = " " + CSV.table[j][descCol2 - 1];
                //alert(descCol2);
            }
            else continue;
            v = CSV.table[j][k] ? CSV.table[j][k] : "";
            v = doTransformations(v, k, CSV);

            s += "<" + hdr[k] + ">" + v.toHtml() + desc2.toHtml() + "</" + hdr[k] + ">\n";
        }
        if (!isNaN(latCol) && !isNaN(longCol) && latCol.length > 0 && longCol.length > 0 && latCol * 1 <= CSV.table[j].length
            && longCol * 1 <= CSV.table[j].length && CSV.table[j][latCol * 1 - 1] && CSV.table[j][longCol * 1 - 1]) {
            if (altCol != "" && !isNaN(altCol) && altCol * 1 <= CSV.table[j].length && CSV.table[j][altCol * 1 - 1]) {
                altitude = doTransformations(CSV.table[j][altCol * 1 - 1], altCol * 1 - 1, CSV);
            }
            else altitude = "0";
            s += "<Point><coordinates>";
            s += doTransformations(CSV.table[j][longCol - 1], longCol - 1, CSV) + "," + doTransformations(CSV.table[j][latCol - 1], latCol - 1, CSV) + "," + altitude;
            s += "</coordinates></Point>\n";
        }
        s += "</Placemark>\n";
    }
    s += "</Document>\n</kml>";
    return s;
}

function csvToCsv(CSV, options) {
    if(!CSV){return;}
    if (CSV.table.length === 0) return "";
    if (!options) options = {};
    var delimiter = options.delimiter;
    var headingSpecified = options.headingSpecified;
    var excelForceMode = options.excelForceMode;
    var defaultHeader = options.defaultHeader;
    var noMultiLines = options.noMultiLines;
    var bQuotes = options.bQuotes;
    var nullIsNull = options.nullIsNull;
    var neverEnclose = options.neverEnclose;
    var j = 0, k, col;
    var hdr;
    var s = "";
    var a = [];
    var x = 0;
    var v;
    a = getFldPosArr(CSV);
    if (headingSpecified || defaultHeader) {
        hdr = getCsvHeader(CSV);
        for (x = 0; x < a.length; x++) {
            j = a[x] - 1;
            if (x > 0) s += delimiter;
            s += (j >= hdr.length ? "" : hdr[j]).toCsv(delimiter, CSV.outputQuote, CSV.outputQuote);
        }
        if (s != "") s += "\n";
    }
    for (j = 0; j < CSV.table.length; j++) {

        for (x = 0; x < a.length; x++) {
            k = a[x] - 1;
            v = CSV.table[j][k] ? CSV.table[j][k] : "";
            if (v && nullIsNull) v = v.replace(/^null$/gmi, '');
            if (v && noMultiLines) v = v.replace(/\r\n|\r|\n/g, ' ');
            v = doTransformations(v, k, CSV);
            if (v != "" && 'dateOutFormat' in options && options.dateOutFormat != "" && CSV.statsCnt[k] && CSV.statsCnt[k].fieldType == "D") {
                var vv = v;
                try {
                    var v = moment(v, CSV.dateformat[k]).format(options.dateOutFormat);
                } catch (e) { v = vv; }
            }
            if (excelForceMode && v != "") {
                if (v.indexOf(',') < 0 && v.indexOf('\n') < 0 && v.indexOf('\r') < 0) {
                    s += "=" + v.toCsv(delimiter, CSV.outputQuote, CSV.outputQuote, true);
                }
                else {
                    // s += '"="' + v.toCsv(delimiter, CSV.outputQuote,CSV.outputQuote,true) + '""';
                    s += ('=' + v.toCsv(delimiter, CSV.outputQuote, CSV.outputQuote, true)).toCsv(delimiter, CSV.outputQuote, CSV.outputQuote, true);
                }
            }
            else if (!bQuotes && CSV.statsCnt[k] && (CSV.statsCnt[k].fieldType == "N" || CSV.statsCnt[k].fieldType == "I")) {
                if (v)
                    s += v;
                else
                    s += '';
            }
            else {
                if (neverEnclose)
                    s += v.toCsv(delimiter, "", "", false);
                else
                    s += v.toCsv(delimiter, CSV.outputQuote, CSV.outputQuote, bQuotes);
            }
            s += (x < a.length - 1 ? delimiter : '');
        }
        s += "\n";
    }
    return s;
    //return CSV.stringify(CSV.table);
}

function transposeCsv(CSV, delimiter, headingSpecified, excelForceMode, defaultHeader, noMultiLines, bQuotes) {
    if(!CSV){return;}
    if (CSV.table.length === 0) return "";
    var j = 0, k, col;
    var hdr;
    var s = "";
    var a = [];
    var x = 0;
    var v;
    a = getFldPosArr(CSV);

    //for (j = 0; j < CSV.table.length; j++) {
    for (x = 0; x < a.length; x++) { // each column

        if (headingSpecified || defaultHeader) {
            hdr = getCsvHeader(CSV);
            j = a[x] - 1;
            s += (hdr[j]).toCsv(delimiter, CSV.outputQuote);
            if (CSV.table.length > 0) s += delimiter;
        }
        //for (x = 0; x < a.length; x++) {
        for (j = 0; j < CSV.table.length; j++) {

            k = a[x] - 1;
            v = CSV.table[j][k] ? CSV.table[j][k] : "";
            if (v && noMultiLines) v = v.replace(/\r\n|\r|\n/g, ' ');
            v = doTransformations(v, k, CSV);

            if (excelForceMode && v != "") {
                if (v.indexOf(',') < 0) {
                    s += "=" + v.toCsv(delimiter, CSV.outputQuote, CSV.outputQuote, excelForceMode);
                }
                else {
                    s += '"="' + v.toCsv(delimiter, CSV.outputQuote, CSV.outputQuote, excelForceMode) + '""';
                }
            }
            else if (!bQuotes && CSV.statsCnt[k] && (CSV.statsCnt[k].fieldType == "N" || CSV.statsCnt[k].fieldType == "I")) {
                if (v)
                    s += v;
                else
                    s += '';
            }
            else {
                s += v.toCsv(delimiter, CSV.outputQuote, CSV.outputQuote, bQuotes);
            }
            s += (j < CSV.table.length - 1 ? delimiter : '');
        }
        s += "\n";
    }
    return s;
    //return CSV.stringify(CSV.table);
}
function getCsvColLength(CSV) {
    var j = 0, k = 0;
    var n = 0;
    var d = 0;
    var stats = new Array();
    if(!CSV){return;}
    if (CSV.table.length === 0) return stats;
    for (k = 0; k < CSV.maxColumnsFound; k++) stats.push(0); // max length of columns
    for (j = 0; j < CSV.table.length; j++) // for each row
    {
        for (k = 0; k < stats.length; k++) {// for each column
            if (k >= CSV.table[j].length) continue;
            if (CSV.table[j][k].length > stats[k]) stats[k] = CSV.table[j][k].length;
            if (document.getElementById('fdecimals' + (k + 1))) {
                d = document.getElementById('fdecimals' + (k + 1)).value;
                if (CSV.statsCnt[k] && (CSV.statsCnt[k].fieldType == "N" || CSV.statsCnt[k].fieldType == "I" || CSV.statsCnt[k].fieldType == "B")) {
                    if (isNaN(d)) d = 0; else d = d * 1;
                    if (CSV.table[j][k].trim() != "") {
                        n = (CSV.table[j][k].toNumber().toFixed(d) + "").length;
                        if (n > stats[k]) stats[k] = n;
                    }
                }
                else if (d.trim() != "" && CSV.statsCnt[k] && CSV.table[j][k].trim() != "" && (CSV.statsCnt[k].fieldType == "D" || (CSV.statsCnt[k].dateCnt - CSV.statsCnt[k].emptyCnt) / CSV.dataRowsFound >= 0.9)) {
                    try {
                        var vv = (moment(CSV.table[j][k], CSV.dateformat[k]).format(d));
                        var n = vv.length;
                        if (n > stats[k]) stats[k] = n;
                    } catch (e) { ; }
                }
            }
            if (document.getElementById('fpadsize' + (k + 1))) {
                n = document.getElementById('fpadsize' + (k + 1)).value;
                if (isNaN(n)) n = 0; else n = n * 1;
                //if (n > stats[k])
                if (n > 0) stats[k] = n;
            }
        }
    }
    return stats;
}
function isSqlKeywords() {
    return ["ACTION", "ADD", "AFTER", "ALL", "ALTER", "ANALYZE", "AND", "AS", "ASC", "ATTACH", "AUTOINCREMENT", "BEFORE", "BEGIN", "BETWEEN", "BY", "CASCADE", "CASE", "CAST", "CHECK", "COLLATE", "COLUMN", "COMMIT", "CONFLICT", "CONSTRAINT", "CREATE", "CROSS", "CURRENT_DATE", "CURRENT_TIME", "CURRENT_TIMESTAMP", "DATABASE", "DEFAULT", "DEFERRABLE", "DEFERRED", "DELETE", "DESC", "DETACH", "DISTINCT", "DROP", "EACH", "ELSE", "END", "ESCAPE", "EXCEPT", "EXCLUSIVE", "EXISTS", "EXPLAIN", "FAIL", "FOR", "FOREIGN", "FROM", "FULL", "GLOB", "GROUP", "HAVING", "IF", "IGNORE", "IMMEDIATE", "IN", "INDEX", "INDEXED", "INITIALLY", "INNER", "INSERT", "INSTEAD", "INTERSECT", "INTO", "IS", "ISNULL", "JOIN", "KEY", "LEFT", "LIKE", "LIMIT", "MATCH", "NATURAL", "NO", "NOT", "NOTNULL", "NULL", "OF", "OFFSET", "ON", "OR", "ORDER", "OUTER", "PLAN", "PRAGMA", "PRIMARY", "QUERY", "RAISE", "RECURSIVE", "REFERENCES", "REGEXP", "REINDEX", "RELEASE", "RENAME", "REPLACE", "RESTRICT", "RIGHT", "ROLLBACK", "ROW", "SAVEPOINT", "SELECT", "SET", "SUM", "SYSDATE", "TABLE", "TEMP", "TEMPORARY", "THEN", "TO", "TRANSACTION", "TRIGGER", "UNION", "UNIQUE", "UPDATE", "USING", "VACUUM", "VALUES", "VIEW", "VIRTUAL", "WHEN", "WHERE", "WITH", "WITHOUT"];
}
function csvToSql(CSV, operation, options) {
    var j = 0, k, i, col, n, m, d, row, cnt = 0;
    var hdr;
    var s = "";
    var tp = "";
    var seqtype = "";
    var v = "";
    var tem = "";// template
    var cv = "";
    var incl = [];
    var usrhdr = [];
    var fsize = [];
    var fdec = [];
    var freq = [];
    var temValuesSet = false;
    var where = "";
    var keys = [];
    var keycnt = 0;
    var fldpad = 0;
    var useNullForEmpty = false;
    var batch = 0;
    var includeCnt = 0;
    var includeNotKeyCnt = 0;
    if(!CSV){return;}
    //if (CSV.table.length===0) return s; // Return if no records passed.....
    operation = operation || "I";
    options.newlines = options.newlines || false;
    if (!("dualNeeded" in options)) options.dualNeeded = false;
    if (!("batchSize" in options) || options.batchSize.trim() == "" || isNaN(options.batchSize)) options.batchSize = Number.MAX_VALUE;
    if (!("useTerseValuesSize" in options) || options.useTerseValuesSize.trim() == "" || isNaN(options.useTerseValuesSize)) options.useTerseValuesSize = Number.MAX_VALUE;
    if (!options.useTerseValues) options.useTerseValuesSize = "";
    hdr = getCsvHeader(CSV);
    for (k = 0; k < hdr.length; k++) {
        usrhdr[k] = hdr[k].replace(/\s+/g, '_');
        if (usrhdr[k].length > fldpad) fldpad = usrhdr[k].length;
        keys[k] = false;
        fsize[k] = fdec[k] = "";
        if (document.getElementById("fkey" + (k + 1))) if (document.getElementById("fkey" + (k + 1)).checked) { keycnt++; keys[k] = true; }
        // actually, I need to replace any character that is not a valid column name (not just space)
        if (document.getElementById("fname" + (k + 1))) usrhdr[k] = document.getElementById("fname" + (k + 1)).value.replace(/\s+/g, '_');
        if (document.getElementById("freq" + (k + 1))) freq[k] = (document.getElementById("freq" + (k + 1))).checked;
        if (document.getElementById("fsize" + (k + 1))) {
            fsize[k] = document.getElementById("fsize" + (k + 1)).value.trim();
            if (!isNaN(fsize[k])) fsize[k] *= 1; else fsize[k] = 30;
            if (fsize[k] < 1) fsize[k] = "";
        }
        else
            fsize[k] = 30;
        if (document.getElementById("fdec" + (k + 1))) {
            fdec[k] = document.getElementById("fdec" + (k + 1)).value.trim();
            if (!isNaN(fdec[k])) {
                fdec[k] *= 1;
                if (fdec[k] < 0) fdec[k] = "";
            }
            else {
                fdec[k] = "";
            }
        }
        if (document.getElementById("finc" + (k + 1))) {
            if (document.getElementById("finc" + (k + 1)).checked) {
                incl[k] = true;
                includeCnt++;
            }
            else {
                incl[k] = false;
            }
        }
        else {
            incl[k] = true;
            includeCnt++;
        }
    }
    if (hdr.length === 0) return "";
    if (includeCnt == 0 && operation == "S") return ""; // no included fields
    if (options.tableName.indexOf(' ') > 0 && options.tableName.charAt(0) != "[" && options.tableName.charAt(0) != "`") options.tableName = '"' + options.tableName + '"';
    if (options.dropTable) s += "DROP " + (operation === "S" ? "VIEW " : "TABLE ") + (options.dropExists ? "IF EXISTS " : "") + options.tableName + ";\n";
    if (options.createTable && operation != "S") {
        var savnewlines = options.newlines;
        options.newlines = true;
        s += "CREATE TABLE " + (options.createNotExists ? "IF NOT EXISTS " : "") + options.tableName + "(";
        if (options.newlines) s += "\n";
        for (n = k = 0; k < hdr.length; k++ , n++) {
            //For the CREATE, include all columns. Check incl[k] for DATA only
            if (options.newlines && n > 0) s += "\n";
            if (n > 0) s += "  ,"; else s += "   ";
            s += usrhdr[k].rpad(fldpad);
            tp = "VC";
            if (k < CSV.statsCnt.length) tp = CSV.statsCnt[k].fieldType;
            if (document.getElementById("ftype" + (k + 1))) { // override
                tp = document.getElementById("ftype" + (k + 1)).value;
            }
            switch (tp) {
                case "B":
                    s += " BIT ";
                    break;
                case "L":
                    s += " BOOLEAN ";
                    break;
                case "NR":
                case "N":
                    if (tp == "N") s += " NUMERIC"; else s += " NUMBER";
                    if (CSV.statsCnt.length > 0) {
                        m = CSV.statsCnt[k].fieldPrec + CSV.statsCnt[k].fieldDecs;
                        d = CSV.statsCnt[k].fieldDecs;
                    }
                    else {
                        m = 0;
                        d = fdec[k] ? fdec[k] : 0;
                    }
                    if (fsize[k] && fsize[k] > m) m = fsize[k];
                    //if(fdec[k] && fdec[k]>d)d=fdec[k]; // both m and d would have to be adjusted... to do
                    if (m != "") s += "(" + m + "," + d + ")"; else s += " ";
                    break;
                case "BI":
                    s += " BIGINT ";
                    break;
                case "IT":
                    s += " INT ";
                    break;
                case "I":  // Though Oracle takes a size, most dbms do not
                    s += " INTEGER ";
                    break;
                case "M":
                    s += "MONEY";
                    break;
                case "S":
                    s += " SERIAL ";
                    break;
                case "D":
                    s += " DATE ";
                    break;
                case "DT":
                    s += " DATETIME ";
                    break;
                case "NVC":
                    s += " NVARCHAR(" + fsize[k] + ")";
                    break;
                case "VC":
                    s += " VARCHAR(" + fsize[k] + ")";
                    break;
                case "VCC":
                    s += " VARCHAR2(" + fsize[k] + ")";
                    break;
                case "NC":
                    s += " NCHAR(" + fsize[k] + ")";
                    break;
                default:
                    s += " CHAR(" + fsize[k] + ")";
                    break;
            }
            if (freq[k]) s += " NOT NULL";
            if (keys[k] && keycnt == 1) {
                s += " PRIMARY KEY";
                if (tp == "N" || tp == "NR" || tp == "I" || tp == "IT" || tp == "BI") {
                    if (document.getElementById('selAutoIncrement')) {
                        s += " " + document.getElementById('selAutoIncrement').value;
                    }
                }
            }
        }
        if (keycnt > 1) {
            if (options.newlines) s += "\n";
            s += "  ,PRIMARY KEY(";
            for (x = 0; x < keys.length; x++) {
                if (keys[x]) {
                    s += ((x > 0) ? "," : "") + usrhdr[x];
                }
            }
            s += ")";
        }
        if (options.newlines) s += "\n";
        s += ");\n";
        options.newlines = savnewlines;
        // if (CSV.table.length===0) return s; // Return if no records passed.....
    } // CREATE TABLE
    else if (options.createTable && operation === "S") { // CREATE VIEW
        //if (CSV.table.length===0) return ""; // Return if no records passed.....
        s += "CREATE ";
        if (options.insertAfterText.trim() != "") s += " " + options.insertAfterText.trim();
        s += "VIEW " + (options.createNotExists ? "IF NOT EXISTS " : "") + options.tableName + "(";

        if (options.newlines) s += "\n";
        for (n = k = 0; k < hdr.length; k++) {
            if (!incl[k]) continue;
            if (n > 0) s += ",";
            s += usrhdr[k];
            if (options.newlines) s += "\n";
            n++;
        }
        s += ") AS\n";
    } // CREATE VIEW
    if (includeCnt == 0) return s; // no included fields
    //if (CSV.table.length===0) return s; // Return if no records passed.....
    switch (operation) {
        case "I":  // INSERT
            cnt = row = 0;
            for (j = 0; j < (CSV.table.length ? CSV.table.length : 1); j++) {

                row++;
                cnt++;
                if (row == 1 || !options.useTerseValues || cnt > options.useTerseValuesSize * 1) {
                    cnt = 1;
                    s += options.useReplace ? "REPLACE" : "INSERT";
                    if (options.insertAfterText.trim() != "") s += " " + options.insertAfterText.trim();
                    s += " INTO " + options.tableName + "(";

                    if (options.newlines) s += "\n";
                    for (n = k = 0; k < hdr.length; k++) {
                        if (!incl[k]) continue;
                        if (n > 0) s += ",";
                        s += usrhdr[k];
                        if (options.newlines) s += "\n";
                        n++;
                    }
                    s += ") VALUES" + (!options.useTerseValues ? "" : "\n") + " (";
                    if (CSV.table.length === 0) {
                        for (n = k = 0; k < hdr.length; k++) {
                            if (!incl[k]) continue;
                            if (n > 0) s += ",";
                            s += "?";
                            if (options.newlines) s += "\n";
                            n++;
                        }
                        return s + ");";
                    }
                }
                else {
                    s += ",(";
                }
                if (options.newlines) s += "\n";
                for (n = k = 0; k < hdr.length; k++) {
                    //alert('insert' + k)
                    if (!incl[k]) continue;
                    if (CSV.table.length === 0) tp = "VC";// Return if no records passed.....
                    else tp = CSV.statsCnt[k].fieldType;
                    if (k >= CSV.table[j].length) {
                        v = "";
                    }
                    else {
                        v = CSV.table[j][k];
                    }
                    useNullForEmpty = false;
                    if (document.getElementById("ftype" + (k + 1))) { tp = document.getElementById("ftype" + (k + 1)).value; }
                    if (document.getElementById("ftem" + (k + 1))) tem = document.getElementById("ftem" + (k + 1)).value;
                    if (document.getElementById("ftrim" + (k + 1))) if (document.getElementById("ftrim" + (k + 1)).checked) v = v.trim();
                    if (document.getElementById("chkupper" + (k + 1))) if (document.getElementById("chkupper" + (k + 1)).checked) v = v.toUpperCase();
                    if (document.getElementById("chklower" + (k + 1))) if (document.getElementById("chklower" + (k + 1)).checked) v = v.toLowerCase();
                    if (document.getElementById("chknull" + (k + 1))) if (document.getElementById("chknull" + (k + 1)).checked) useNullForEmpty = true;
                    if (n > 0) s += ",";
                    if (tem != "") {
                        if (tp === 'N' || tp === "NR" || tp === 'I' || tp === "IT" || tp === "S" || tp === "D" || tp === "DT" || tp === "BI" || tp === "M" || tp === "L") {
                            if (v == "") s += tem.replace("{f}", 'NULL');
                            else if (tp == "D" || tp == "DT") s += tem.replace("{f}", "'" + v.toSql() + "'");
                            else s += tem.replace("{f}", v.toSql());
                        }
                        else {
                            s += tem.replace("{f}", "'" + v.toSql() + "'");
                        }
                    }
                    else {
                        switch (tp) {
                            case "B":
                            case "L":
                            case "NR":
                            case "M":
                            case "S":
                            case "N":
                            case "BI":
                            case "IT":
                            case "I": if ((v.trim() === "") || ((v.toUpperCase() == "NULL" || v === "\\N") && options.useNullAsNull)) s += "NULL"; else s += v.toSql();
                                break;
                            case "DT":
                            case "D":
                                if ((v === "") || ((v.toUpperCase() == "NULL" || v === "\\N") && options.useNullAsNull)) s += "NULL";
                                else {
                                    if (options && options.dateOutFormat && options.dateOutFormat != "") {
                                        try {
                                            var vv = v;
                                            var v = moment(v, CSV.dateformat[k]).format(options.dateOutFormat);
                                        } catch (e) { v = vv; }
                                    }
                                    s += "'" + v.toSql() + "'";
                                }
                                break;
                            default:
                                if ((v.toUpperCase() == "NULL" || v === "\\N") && options.useNullAsNull) { s += "NULL"; }
                                else if (v == "" && useNullForEmpty) { s += "NULL"; }
                                else if (tp === 'NC' || tp === 'NVC') { s += "N'" + v.toSql() + "'"; }
                                else { s += "'" + v.toSql() + "'"; }
                                break;
                        }
                    } // else
                    if (options.newlines) s += "\n";
                    n++;
                } // each column
                if (!options.useTerseValues || j == CSV.table.length - 1 || cnt >= options.useTerseValuesSize * 1) {
                    s += ");\n";
                } else {
                    s += ")\n";
                }
            } // big for
            break;
        case "U": // Update
            temValuesSet = false;
            for (j = 0; j < (CSV.table.length ? CSV.table.length : 1); j++) // for each row
            {

                where = "";
                s += "UPDATE";
                if (options.insertAfterText.trim() != "") s += " " + options.insertAfterText.trim();
                s += " " + options.tableName + " SET ";
                if (options.newlines) s += "\n";
                for (k = 0; k < hdr.length; k++) { // set where
                    if (keys[k]) where += (where != "" ? " AND " : "") + usrhdr[k] + "= {f" + k + "}";
                }
                if (where === "") where = usrhdr[0] + "= {f0}"; // missing keys, default 1st column
                for (n = k = 0; k < hdr.length; k++) { // each column
                    if (incl[k]) {
                        if (n > 0) s += ",";
                        s += usrhdr[k] + " = ";
                        n++;
                    }
                    if (CSV.table.length === 0) tp = "VC";// Return if no records passed.....
                    else tp = CSV.statsCnt[k].fieldType;
                    if (CSV.table.length === 0) v = "?";
                    else if (k >= CSV.table[j].length) v = "";
                    else v = CSV.table[j][k];
                    useNullForEmpty = false;
                    if (document.getElementById("ftype" + (k + 1))) tp = document.getElementById("ftype" + (k + 1)).value;
                    if (document.getElementById("ftem" + (k + 1))) tem = document.getElementById("ftem" + (k + 1)).value;
                    if (document.getElementById("ftrim" + (k + 1))) if (document.getElementById("ftrim" + (k + 1)).checked) v = v.trim();
                    if (document.getElementById("chkupper" + (k + 1))) if (document.getElementById("chkupper" + (k + 1)).checked) v = v.toUpperCase();
                    if (document.getElementById("chklower" + (k + 1))) if (document.getElementById("chklower" + (k + 1)).checked) v = v.toLowerCase();
                    if (document.getElementById("chknull" + (k + 1))) if (document.getElementById("chknull" + (k + 1)).checked) useNullForEmpty = true;

                    if (tem != "") {
                        if (tp === 'N' || tp === "NR" || tp === 'I' || tp === "IT" || tp === "S" || tp === "D" || tp === "DT" || tp === "BI" || tp === "M" || tp === "L") {
                            if (v == "") s += tem.replace("{f}", 'NULL');
                            else if (tp == "D" || tp == "DT") s += tem.replace("{f}", "'" + v.toSql() + "'");
                            else s += tem.replace("{f}", v.toSql());
                        }
                        else {
                            s += tem.replace("{f}", "'" + v.toSql() + "'");
                        }
                        temValuesSet = true;
                    }
                    //else {
                    switch (tp) {
                        case "B":
                        case "L":
                        case "NR":
                        case "N":
                            if (!temValuesSet && incl[k]) {
                                if ((v === "") || ((v.toUpperCase() == "NULL" || v === "\\N") && options.useNullAsNull)) s += "NULL";
                                else if (CSV.table.length === 0) s += v;
                                else s += v.toSql();
                            }
                            if (CSV.table.length === 0) where = where.replace("{f" + k + "}", v);
                            else where = where.replace("{f" + k + "}", v.toSql());
                            break;
                        case "BI":
                        case "IT":
                        case "I":
                            if (!temValuesSet && incl[k]) {
                                if ((v === "") || ((v.toUpperCase() == "NULL" || v === "\\N") && options.useNullAsNull)) s += "NULL";
                                else if (CSV.table.length === 0) s += v;
                                else s += v.toSql();
                            }
                            if (CSV.table.length === 0) where = where.replace("{f" + k + "}", v);
                            else where = where.replace("{f" + k + "}", v.toSql());
                            break;
                        case "D":
                            if (!temValuesSet && incl[k]) {
                                if ((v === "") || ((v.toUpperCase() == "NULL" || v === "\\N") && options.useNullAsNull)) s += "NULL";
                                else if (CSV.table.length === 0) s += v;
                                else {
                                    if (options && options.dateOutFormat && options.dateOutFormat != "") {
                                        try {
                                            var vv = v;
                                            var v = moment(v, CSV.dateformat[k]).format(options.dateOutFormat);
                                        } catch (e) { v = vv; }
                                    }
                                    s += "'" + v.toSql() + "'";
                                }
                            }
                            if (CSV.table.length === 0) where = where.replace("{f" + k + "}", v);
                            else where = where.replace("{f" + k + "}", "'" + v.toSql() + "'");
                            break;
                        default:
                            if (!temValuesSet && incl[k]) {
                                if ((v.toUpperCase() == "NULL" || v === "\\N") && options.useNullAsNull) { s += "NULL"; }
                                else if (v == "" && useNullForEmpty) { s += "NULL"; }
                                else if (tp === 'NC' || tp === 'NVC') { s += "N'" + v.toSql() + "'"; }
                                else if (CSV.table.length === 0) s += v;
                                else { s += "'" + v.toSql() + "'"; }
                            }
                            if (tp === 'NC' || tp === 'NVC') where = where.replace("{f" + k + "}", "N'" + v.toSql() + "'");
                            else if (CSV.table.length === 0) where = where.replace("{f" + k + "}", v);
                            else where = where.replace("{f" + k + "}", "'" + v.toSql() + "'");
                            break;
                    }
                    //} // else
                    if (incl[k]) {
                        if (options.newlines) s += "\n";
                        n++;
                    }
                } // each column
                s += " WHERE " + where;
                // determine the keys and use those in where clause
                s += ";\n";
            } // big for case update
            break;
        case "D":  // DELETE
            for (j = 0; j < (CSV.table.length ? CSV.table.length : 1); j++) // for each row
            {

                where = "";
                s += "DELETE FROM " + options.tableName;
                if (options.newlines) s += "\n";
                // determine the keys and use those in where clause
                for (k = 0; k < usrhdr.length; k++) { // set where, zero based here
                    if (keys[k]) where += (where != "" ? " AND " : "") + usrhdr[k] + "= {f" + k + "}";
                }
                if (where === "") where = usrhdr[0] + "= {f0}"; // missing keys, default 1st column
                for (n = k = 0; k < hdr.length; k++) { // each column
                    n++;
                    if (CSV.table.length === 0) tp = "VC";// Return if no records passed.....
                    else tp = CSV.statsCnt[k].fieldType;
                    if (CSV.table.length === 0) v = "?";
                    else if (k >= CSV.table[j].length) v = "";
                    else v = CSV.table[j][k];
                    //alert("v=" + v+" ,s="+s);
                    if (document.getElementById("ftype" + (k + 1))) tp = document.getElementById("ftype" + (k + 1)).value;
                    if (document.getElementById("ftem" + (k + 1))) tem = document.getElementById("ftem" + (k + 1)).value;
                    if (document.getElementById("ftrim" + (k + 1))) if (document.getElementById("ftrim" + (k + 1)).checked) v = v.trim();
                    if (document.getElementById("chkupper" + (k + 1))) if (document.getElementById("chkupper" + (k + 1)).checked) v = v.toUpperCase();
                    if (document.getElementById("chklower" + (k + 1))) if (document.getElementById("chklower" + (k + 1)).checked) v = v.toLowerCase();
                    //if (tem != "") {
                    // s += tem.replace("{f}", v.toSql());
                    //alert("tem found with v=" + v.toSql() + "s="+s);
                    //}
                    switch (tp) {
                        case "B":
                        case "L":
                        case "NR":
                        case "N":
                        case "BI":
                        case "IT":
                        case "M":
                        case "S":
                        case "I":
                            if (CSV.table.length === 0) where = where.replace("{f" + k + "}", v);
                            else where = where.replace("{f" + k + "}", v.toSql());
                            break;
                        default:
                            if (tp === 'NC' || tp === 'NVC') where = where.replace("{f" + k + "}", "N'" + v.toSql() + "'");
                            else if (CSV.table.length === 0) where = where.replace("{f" + k + "}", v);
                            else where = where.replace("{f" + k + "}", "'" + v.toSql() + "'");
                            break;
                    } // switch
                    if (options.newlines) s += "\n";
                    n++;
                } // each column
                s += " WHERE " + where;
                s += ";\n";
            } // for each row
            break;
        case "M": // MERGE
            row = batch = 0;
            //if(options.createTable)options.batchSize=Number.MAX_VALUE;
            for (j = 0; j < (CSV.table.length ? CSV.table.length : 1); j++) {

                batch++;
                row++;
                if (row === 1 || batch == options.batchSize) {
                    s += "MERGE INTO " + options.tableName + " t\nUSING (\n";
                    where = "ON (";
                    // determine the keys and use those in where clause
                    for (i = k = 0; k < usrhdr.length; k++) { // set where, zero based here
                        if (keys[k]) {
                            where += (i > 0 ? " AND " : " ") + "t." + usrhdr[k] + "= s." + usrhdr[k];
                            i++;
                        }
                    }
                    if (where === "ON (") { // missing keys, default 1st column
                        where += "t." + usrhdr[0] + "= s." + usrhdr[0];
                        keys.push(usrhdr[0]);
                    }
                    where += " )";
                }
                else {
                    if (options.createTable || batch < options.batchSize) s += "UNION ALL\n";
                }
                if (options.newlines) s += "\n";
                s += "SELECT ";
                for (includeNotKeyCnt = k = 0; k < hdr.length; k++) { // For each field
                    if (incl[k] && !keys[k]) includeNotKeyCnt++; // count # of columns in update
                }
                for (n = k = 0; k < hdr.length; k++) { // For each field
                    if (!incl[k] && !keys[k]) continue; // we need the keys.
                    if (CSV.table.length === 0) tp = "VC";// Return if no records passed.....
                    else tp = CSV.statsCnt[k].fieldType;
                    if (CSV.table.length === 0) v = "?";
                    else if (k >= CSV.table[j].length) v = "";
                    else v = CSV.table[j][k];
                    useNullForEmpty = false;
                    if (document.getElementById("ftype" + (k + 1))) { tp = document.getElementById("ftype" + (k + 1)).value; }
                    if (document.getElementById("ftem" + (k + 1))) tem = document.getElementById("ftem" + (k + 1)).value;
                    if (document.getElementById("ftrim" + (k + 1))) { if (document.getElementById("ftrim" + (k + 1)).checked) v = v.trim(); }
                    if (document.getElementById("chkupper" + (k + 1))) { if (document.getElementById("chkupper" + (k + 1)).checked) v = v.toUpperCase(); }
                    if (document.getElementById("chklower" + (k + 1))) { if (document.getElementById("chklower" + (k + 1)).checked) v = v.toLowerCase(); }
                    if (document.getElementById("chknull" + (k + 1))) { if (document.getElementById("chknull" + (k + 1)).checked) useNullForEmpty = true; }
                    if (n > 0) s += ",";
                    if (tem != "") {
                        if (tp == 'N' || tp == "NR" || tp == 'I' || tp == "IT" || tp == "S" || tp == "D" || tp == "DT" || tp == "BI" || tp == "M" || tp === "L") {
                            if (v == "") s += tem.replace("{f}", 'NULL');
                            else if (tp == "D" || tp == "DT") s += tem.replace("{f}", "'" + v.toSql() + "'");
                            else if (CSV.table.length === 0) s += tmp.replace("{f}", v);
                            else s += tem.replace("{f}", v.toSql());
                        }
                        else {
                            if (CSV.table.length === 0) s += tmp.replace("{f}", v);
                            else s += tem.replace("{f}", "'" + v.toSql() + "'");
                        }
                    }
                    else {
                        switch (tp) {
                            case "B":
                            case "L":
                            case "NR":
                            case "M":
                            case "S":
                            case "N":
                            case "BI":
                            case "IT":
                            case "I":
                                if ((v.trim() === "") || ((v.toUpperCase() == "NULL" || v === "\\N") && options.useNullAsNull)) s += "NULL";
                                else if (CSV.table.length === 0) s += v;
                                else s += v.toSql();
                                break;
                            case "DT":
                            case "D":
                                if ((v === "") || ((v.toUpperCase() == "NULL" || v === "\\N") && options.useNullAsNull)) s += "NULL";
                                else if (CSV.table.length === 0) s += v;
                                else {
                                    if (options && options.dateOutFormat && options.dateOutFormat != "") {
                                        try {
                                            var vv = v;
                                            var v = moment(v, CSV.dateformat[k]).format(options.dateOutFormat);
                                        } catch (e) { v = vv; }
                                    }
                                    s += "'" + v.toSql() + "'";
                                }
                                break;
                            default:
                                if ((v.toUpperCase() == "NULL" || v === "\\N") && options.useNullAsNull) { s += "NULL"; }
                                else if (v == "" && useNullForEmpty) { s += "NULL"; }
                                else if (tp === 'NC' || tp === 'NVC') { s += "N'" + v.toSql() + "'"; }
                                else if (CSV.table.length === 0) s += v;
                                else { s += "'" + v.toSql() + "'"; }
                                break;
                        }
                        // I need to alias the 1st row
                        if (row === 1) {
                            s += " AS " + usrhdr[k];
                        }
                    } // else
                    if (options.newlines) s += "\n";
                    n++;
                } // each column
                if (options.dualNeeded) {
                    s += " FROM " + (options.dualTableName || "myView");
                }
                if (j == CSV.table.length - 1 || batch == options.batchSize || CSV.table.length === 0) {
                    s += "\n) s\n";
                    s += where;
                    if (includeNotKeyCnt > 0) {
                        s += "\n  WHEN MATCHED THEN \n     UPDATE SET ";
                        for (n = k = 0; k < usrhdr.length; k++) { // set where, zero based here
                            if (!keys[k] && incl[k]) {
                                s += (n > 0 ? ", " : " ") + "t." + usrhdr[k] + "=s." + usrhdr[k];
                                n++;
                            }
                        }
                    }
                    s += "\n  WHEN NOT MATCHED THEN\n     INSERT(";
                    for (n = k = 0; k < usrhdr.length; k++) { // set where, zero based here
                        if (keys[k] || incl[k]) { s += (n > 0 ? ", " : " ") + "" + usrhdr[k]; n++; } // does not like prefix
                    }
                    s += ")\n     VALUES(";
                    for (n = k = 0; k < usrhdr.length; k++) { // set where, zero based here
                        if (keys[k] || incl[k]) { s += (n > 0 ? ", " : " ") + "s." + usrhdr[k]; n++; }
                    }
                    s += ")\n;\n";
                } else {
                    s += "\n";
                }
                if (batch == options.batchSize) {
                    batch = 0;
                }
                if (CSV.table.length === 0) break;
            } // big for
            break;
        case "S": // SELECT
            row = batch = 0;
            if (options.createTable) options.batchSize = Number.MAX_VALUE;
            for (j = 0; j < (CSV.table.length ? CSV.table.length : 1); j++) {

                batch++;
                row++;
                if (row > 1) {
                    if (options.createTable || batch < options.batchSize) s += "UNION ALL\n";
                }
                if (options.newlines) s += "\n";
                s += "SELECT ";
                for (n = k = 0; k < hdr.length; k++) { // For each field
                    if (!incl[k]) continue;
                    if (CSV.table.length === 0) tp = "VC";// Return if no records passed.....
                    else tp = CSV.statsCnt[k].fieldType;
                    if (CSV.table.length === 0) v = "";
                    else if (k >= CSV.table[j].length) {
                        v = "";
                    }
                    else {
                        v = CSV.table[j][k];
                    }
                    useNullForEmpty = false;
                    if (document.getElementById("ftype" + (k + 1))) { tp = document.getElementById("ftype" + (k + 1)).value; }
                    if (document.getElementById("ftem" + (k + 1))) tem = document.getElementById("ftem" + (k + 1)).value;
                    if (document.getElementById("ftrim" + (k + 1))) { if (document.getElementById("ftrim" + (k + 1)).checked) v = v.trim(); }
                    if (document.getElementById("chkupper" + (k + 1))) { if (document.getElementById("chkupper" + (k + 1)).checked) v = v.toUpperCase(); }
                    if (document.getElementById("chklower" + (k + 1))) { if (document.getElementById("chklower" + (k + 1)).checked) v = v.toLowerCase(); }
                    if (document.getElementById("chknull" + (k + 1))) { if (document.getElementById("chknull" + (k + 1)).checked) useNullForEmpty = true; }
                    if (n > 0) s += ",";
                    if (tem != "") {
                        if (CSV.table.length === 0) s += tem.replace("{f}", '?');
                        else if (tp === 'N' || tp === "NR" || tp === 'I' || tp === "IT" || tp === "S" || tp === "D" || tp === "DT" || tp === "BI" || tp === "M" || tp === "L") {
                            if (v == "") s += tem.replace("{f}", 'NULL');
                            else if (tp == "D" || tp == "DT") s += tem.replace("{f}", "'" + v.toSql() + "'");
                            else s += tem.replace("{f}", v.toSql());
                        }
                        else {
                            s += tem.replace("{f}", "'" + v.toSql() + "'");
                        }
                    }
                    else {
                        switch (tp) {
                            case "B":
                            case "L":
                            case "NR":
                            case "M":
                            case "S":
                            case "N":
                            case "BI":
                            case "IT":
                            case "I":
                                if (CSV.table.length === 0) s += "?";
                                else if ((v.trim() === "") || ((v.toUpperCase() == "NULL" || v === "\\N") && options.useNullAsNull)) s += "NULL"; else s += v.toSql();
                                break;
                            case "DT":
                            case "D":
                                if (CSV.table.length === 0) s += "?";
                                else if ((v === "") || ((v.toUpperCase() == "NULL" || v === "\\N") && options.useNullAsNull)) s += "NULL";
                                else {
                                    if (options && options.dateOutFormat && options.dateOutFormat != "") {
                                        try {
                                            var vv = v;
                                            var v = moment(v, CSV.dateformat[k]).format(options.dateOutFormat);
                                        } catch (e) { v = vv; }
                                    }
                                    s += "'" + v.toSql() + "'";
                                }
                                break;
                            default:
                                if (CSV.table.length === 0) s += "?";
                                else if ((v.toUpperCase() == "NULL" || v === "\\N") && options.useNullAsNull) { s += "NULL"; }
                                else if (v == "" && useNullForEmpty) { s += "NULL"; }
                                else if (tp === 'NC' || tp === 'NVC') { s += "N'" + v.toSql() + "'"; }
                                else { s += "'" + v.toSql() + "'"; }
                                break;
                        }
                    } // else
                    if (options.newlines) s += "\n";
                    n++;
                    if (row === 1) {
                        s += " AS " + usrhdr[k];
                    }
                } // each column
                if (options.dualNeeded && !(CSV.table.length === 0 && !options.createTable)) {
                    s += " FROM " + (options.dualTableName || "myView");
                }
                if (j == CSV.table.length - 1 || batch == options.batchSize || CSV.table.length === 0) {
                    s += ";\n";
                } else {
                    s += "\n";
                }
                if (batch == options.batchSize) batch = 0;
            } // big for

            // a hack for now
            if (CSV.table.length === 0 && !options.createTable) {
                s = s.replace(/\?\sAS\s/mgi, " ").rtrim();
                if (s.endsWith(";")) s = s.slice(0, -1);
                s += "\nFROM " + (options.tableName || "mytable") + ";";
            }
            break;
    } // switch
    if (CSV.table.length === 0) {
        ;
    }
    return s;
}
function geoJsonToCsv(geo, delimiter, bIncludeHeaders, bQuotes, noMultiLines) {
    var j, k, p;
    var s = "";
    var value = "";
    var cols = {};
    var colArray = ["latitude", "longitude", "altitude", "geometry"];
    var obj = {};
    var t = "";
    if (typeof geo === "string") {
        try {
            geo = JSON.parse(geo);
        }
        catch (e) {
            geo = eval("geo=" + geo);
        }
    }
    var colnum = 0;
    if (geo.type === "Feature") {
        geo = { "type": "FeatureCollection", "features": [geo] };
    }
    if (geo.type === "FeatureCollection") {
        for (j = 0; j < geo.features.length; j++) {
            if (geo.features[j].geometry.type === "Point") {
                if (!("latitude" in cols)) cols["latitude"] = ++colnum;
                if (!("longitude" in cols)) cols["longitude"] = ++colnum;
                if (!("altitude" in cols)) cols["altitude"] = ++colnum;
            }
            else if (!("coordinates" in cols)) {
                cols["coordinates"] = ++colnum;
                colArray.push("coordinates");
            }
        }
        for (j = 0; j < geo.features.length; j++) {
            for (p in geo.features[j].properties) {
                if (!(p in cols)) { cols[p] = ++colnum; colArray.push(p); }
            }
        }
        if (bIncludeHeaders) {
            for (j = 0; j < colArray.length; j++) {
                t += colArray[j].toCsv(delimiter, '"', '"', bQuotes) + delimiter;
            }
            t = t.slice(0, -1 * delimiter.length) + "\n";
        }
        for (j = 0; j < geo.features.length; j++) { // for each feature
            if ("latitude" in cols) { // mandatory
                if (geo.features[j].geometry && geo.features[j].geometry.type
                    && geo.features[j].geometry.coordinates && geo.features[j].geometry.coordinates.length >= 2
                    && geo.features[j].geometry.type === "Point") {
                    s += (bQuotes ? '"' : "") + geo.features[j].geometry.coordinates[1] + (bQuotes ? '"' : "") + delimiter;
                    s += (bQuotes ? '"' : "") + geo.features[j].geometry.coordinates[0] + (bQuotes ? '"' : "") + delimiter;
                    if (geo.features[j].geometry.coordinates.length > 2) {
                        s += (bQuotes ? '"' : "") + geo.features[j].geometry.coordinates[2] + (bQuotes ? '"' : "") + delimiter;
                    }
                    else s += (bQuotes ? '""' : "") + delimiter;
                }
                else {
                    s += (bQuotes ? '""' : "") + delimiter;
                    s += (bQuotes ? '""' : "") + delimiter;
                    s += (bQuotes ? '""' : "") + delimiter;
                }
            }
            else {
                s += (bQuotes ? '""' : "") + delimiter;
                s += (bQuotes ? '""' : "") + delimiter;
                s += (bQuotes ? '""' : "") + delimiter;
            }
            //geo.features[j].geometry.type
            if (geo.features[j].geometry.type) {
                value = geo.features[j].geometry.type;
                s += ("" + value).toCsv(delimiter, '"', '"', bQuotes) + delimiter;
            }
            else {
                s += (bQuotes ? '""' : "") + delimiter;
            }

            if ("coordinates" in cols) {  // optional
                if (geo.features[j].geometry.type != "Point") {
                    value = geo.features[j].geometry.coordinates;
                    if ((value + "").substring(0, 15) == "[object Object]") value = JSON.valueArray(value).slice(0, -1);
                    s += ("" + value).toCsv(delimiter, '"', '"', bQuotes) + delimiter;
                }
                else {
                    s += (bQuotes ? '""' : "") + delimiter;
                }
            }

            // Now convert the rest of the values.
            for (k = 0; k < colArray.length; k++) {
                p = colArray[k];
                if (p == "latitude" || p === "longitude" || p === "altitude" || p === "coordinates" || p == "geometry") {
                    continue;
                }
                if (p in geo.features[j].properties) {
                    value = geo.features[j].properties[p];
                    if (value == null) value = "";
                    if ((value + "").substring(0, 15) == "[object Object]") value = JSON.valueArray(value).slice(0, -1);
                    if (noMultiLines) value = (value + "").replace(/\r\n|\r|\n/g, ' ');
                    s += (value + "").toCsv(delimiter, '"', '"', bQuotes) + delimiter;
                }
                else {
                    s += (bQuotes ? '""' : "") + delimiter;
                }
            }
            s = s.slice(0, -1 * delimiter.length) + "\n";
        }
    }

    return t + s;
}

function htmlEscape(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    //.replace(/ /g, '&nbsp;');
}
function getCsvHeader(CSV) {
    var k;
    var hdr = new Array();
    if(!CSV){return;}
    if (!CSV) alert('Missing CSV');
    if (!CSV.arHeaderRow) alert('Missing arHeaderRow');
    var big = CSV.arHeaderRow.length;
    if (big < CSV.maxColumnsFound) big = CSV.maxColumnsFound;

    for (k = 0; k < big; k++) {
        if (!CSV.arHeaderRow[k]) CSV.arHeaderRow.push("FIELD" + (k + 1));
        hdr.push(CSV.arHeaderRow[k]);
        if (CSV.headerToUpper) {
            CSV.arHeaderRow[k] = CSV.arHeaderRow[k].toUpperCase();
            hdr[hdr.length - 1] = hdr[hdr.length - 1].toUpperCase();
            //alert('ok in upper it done');
        }
        else if (CSV.headerToLower) {
            CSV.arHeaderRow[k] = CSV.arHeaderRow[k].toLowerCase();
            hdr[hdr.length - 1] = hdr[hdr.length - 1].toLowerCase();
        }
    }
    //alert("hdr=" + hdr);
    return hdr;
}

function sqlOptions(CSV) {
    //alert('in sqlOptions');
    if(!CSV){return;}
    var stats = getCsvColLength(CSV);
    var hdr = getCsvHeader(CSV);
    var s = '<table class="table table-bordered table-hover table-condensed">\n<tr>\n<th>Col #</th>';
    s += "<th>Field Name</th>";
    s += "<th>Data Type</th><th>Max Size</th>";
    s += "<th title='# of decimals'>#<br/>Dec</th>";
    s += "<th>Key</th><th>Include<br/><input type=\"checkbox\" checked onclick=\"setCheckboxes('finc',this.checked)\"/></th>";
    s += "<th>Required<br/><input type=\"checkbox\" onclick=\"setCheckboxes('freq',this.checked)\"/></th>";
    s += "<th>Trim<br/><input type=\"checkbox\" checked onclick=\"setCheckboxes('ftrim',this.checked)\"/></th>";
    s += "<th>Upper<br/><input type=\"checkbox\" onclick=\"setCheckboxes('chkupper',this.checked);if(this.checked)setCheckboxes('chklower',false)\"/></th>";
    s += "<th>Lower<br/><input type=\"checkbox\" onclick=\"setCheckboxes('chklower',this.checked);if(this.checked)setCheckboxes('chkupper',false)\"/></th>";
    s += "<th title=\"Use keyword NULL\">Use NULL for Empty Field<br/><input type=\"checkbox\" checked onclick=\"setCheckboxes('chknull',this.checked)\"/></th>";
    s += "<th title=\"Modify output by using {f} for field value. Ex: {f}+100\">Template<br/>({f}=field)<br/>Ex: {f}+100</th></tr>";
    var template = "<tr><td>{#}</td>";
    template += "<td><input type=text id=\"fname{#}\" size=\"15\" value=\"{FIELDNAME{#}}\" title=\"{FTITLE{#}}\"></td>\n";
    template += "<td><select id=\"ftype{#}\" title=\"Choose data type of column\" >";
    template += "<option value=\"VC\" {VC{#}}>VarChar</option>";
    template += "<option value=\"NVC\" {VC{#}}>NVarChar</option>";
    template += "<option value=\"VCC\" {VCC{#}}>VarChar2</option>";
    template += "<option value=\"C\" {C{#}}>Char</option>";
    template += "<option value=\"NC\" {C{#}}>NChar</option>";
    template += "<option value=\"NR\" {NR{#}}>Number</option>";
    template += "<option value=\"N\" {N{#}}>Numeric</option>";
    template += "<option value=\"IT\" {IT{#}}>Int</option>";
    template += "<option value=\"I\" {I{#}}>Integer</option>";
    template += "<option value=\"BI\" {I{#}}>BigInt</option>";
    template += "<option value=\"D\" {D{#}}>Date</option>";
    template += "<option value=\"DT\" {DT{#}}>Date Time</option>";
    template += "<option value=\"B\" {B{#}}>Bit(0,1)</option>";
    template += "<option value=\"L\" {L{#}}>Boolean</option>";
    template += "<option value=\"M\" {M{#}}>Money</option>";
    template += "<option value=\"S\" {S{#}}>Serial</option>";
    template += "</select>\n</td><td><input id=\"fsize{#}\"size=4 maxlength=4 value=\"{FIELDSIZE{#}}\"></td>\n";
    template += "<td><input id=\"fdec{#}\"size=2 maxlength=2 value=\"{DECSIZE{#}}\" readonly></td>";
    template += "<td><input type=checkbox id=\"fkey{#}\"  value=\"Y\" ></td>\n";
    template += "<td><input type=checkbox id=\"finc{#}\"  value=\"Y\" checked></td>\n";
    template += "<td><input type=checkbox id=\"freq{#}\"  value=\"Y\" ></td>\n";
    template += "<td><input type=checkbox id=\"ftrim{#}\" value=\"Y\" checked></td>\n";
    template += "<td><input type=checkbox id=\"chkupper{#}\"  value=\"Y\" onclick=\"if(this.checked)document.getElementById('chklower{#}').checked=false\"></td>\n";
    template += "<td><input type=checkbox id=\"chklower{#}\"  value=\"Y\" onclick=\"if(this.checked)document.getElementById('chkupper{#}').checked=false\"></td>\n";
    template += "<td><input type=checkbox id=\"chknull{#}\" value=\"Y\" checked></td>\n";
    template += "<td><input type=\"text\" id=\"ftem{#}\" value=\"\" size=\"15\" maxlength=\"200\"></td>";
    template += "</tr>";
    var j;
    //alert('in options, hdr length='+hdr.length);
    for (j = 0; j < hdr.length; j++) // for each column
    {
        s += template.replace(/\{#\}/g, "" + (j + 1))
            .replace("{FIELDNAME" + (j + 1) + "}", hdr[j].replace(/[@+<>"'?.,-\/#!$%\^&*;:{}=\-`~()\[\]\\|]/g, "").replace(/\s+/g, "_").replace(/_+/g, "_"))
            .replace("{FIELDSIZE" + (j + 1) + "}", (stats.length > 0 && stats[j]) != 0 ? stats[j] : 30)
            ;
        if (CSV.statsCnt.length == 0) {
            s = s.replace("{VC" + (j + 1) + "}", "selected");
            s = s.replace("{FTITLE" + (j + 1) + "}", "Type: Varchar,Counts: Total Records: " + CSV.table.length + ",Empty Records: 0");
            s = s.replace("{DECSIZE" + (j + 1) + "}", "");
            continue;
        }
        if (CSV.statsCnt[j].fieldType === "N") { s = s.replace("{DECSIZE" + (j + 1) + "}", CSV.statsCnt[j].fieldDecs); } else { s = s.replace("{DECSIZE" + (j + 1) + "}", ""); }
        s = s.replace("{FTITLE" + (j + 1) + "}", "Type:" + CSV.statsCnt[j].fieldType + ",Counts: Total Records: " + CSV.table.length + ",Empty Records:" + CSV.statsCnt[j].emptyCnt);
        if (CSV.statsCnt[j].fieldType === "VC") { s = s.replace("{VC" + (j + 1) + "}", "selected"); }
        else if (CSV.statsCnt[j].fieldType === "VCC") { s = s.replace("{VCC" + (j + 1) + "}", "selected"); }
        else if (CSV.statsCnt[j].fieldType === "C") { s = s.replace("{C" + (j + 1) + "}", "selected"); }
        else if (CSV.statsCnt[j].fieldType === "N") { s = s.replace("{N" + (j + 1) + "}", "selected"); }
        else if (CSV.statsCnt[j].fieldType === "I") { s = s.replace("{I" + (j + 1) + "}", "selected"); }
        else if (CSV.statsCnt[j].fieldType === "B") { s = s.replace("{B" + (j + 1) + "}", "selected"); }
        //else if(CSV.statsCnt[j].fieldType==="L" ){s=s.replace("{L"+(j+1)+"}","selected");}// let it be VC, they can override
        else if (CSV.statsCnt[j].fieldType === "D") { s = s.replace("{D" + (j + 1) + "}", "selected"); }
        else if (CSV.statsCnt[j].fieldType === "S") { s = s.replace("{S" + (j + 1) + "}", "selected"); }
        else if (CSV.statsCnt[j].fieldType === "M") { s = s.replace("{M" + (j + 1) + "}", "selected"); }
    }
    //alert(s);
    s += "</table>";
    return s;
}
function setOptions(CSV) {
    var j;
    //fname
    //ftype
    //fsize
    //finc
    //freq
    //ftrim
    //chkupper
    //chklower
    //chknull
    //ftem
    // alert('setOptions:beginning');
    if(!CSV){return;}
    var hdr = getCsvHeader(CSV);
    if (document.getElementById('fkey1')) document.getElementById('fkey1').checked = true;
    if (document.getElementById('freq1')) document.getElementById('freq1').checked = true;
    for (j = 0; j < hdr.length; j++) // for each column
    {
        if (!document.getElementById('fname' + (j + 1))) continue;
        document.getElementById('fname' + (j + 1)).value = hdr[j].replace(/[@+<>"'?.,-\/#!$%\^&*;:{}=\-`~()\[\]\\|]/g, "").replace(/\s+/g, "_").replace(/_+/g, "_");
        if (!document.getElementById('ftype' + (j + 1))) continue;
        if (!CSV.statsCnt[j]) continue;
        if (CSV.statsCnt[j].emptyCnt === 0) document.getElementById('freq' + (j + 1)).checked = true;
        //document.getElementById('ftype'+(j+1)).value=CSV.statsCnt[j].fieldType;
        //document.getElementById('ftype'+(j+1)).title="Type:"+CSV.statsCnt[j].fieldType+",Counts: Total: " +CSV.table.length +",Int: " +CSV.statsCnt[j].intCnt+" ,Numeric:"+CSV.statsCnt[j].realCnt+",Bit:"+CSV.statsCnt[j].bitCnt+",Date:"+CSV.statsCnt[j].dateCnt+",Empty:"+CSV.statsCnt[j].emptyCnt;

    }
    //alert('at end of setOptions')
}
function minOptions(CSV) {
    var inJsonForm = (document && document.getElementById("chkNullJson"));
    if(!CSV){return;}
    //var stats=getCsvColLength(CSV);
    var hdr = getCsvHeader(CSV);
    var s = '<table class="table table-bordered table-hover table-condensed">\n<tr>\n<th>Col #</th><th>Field</th>';
    s += "<th>Trim Left<br/><input type=\"checkbox\" onclick=\"setCheckboxes('ftriml',this.checked)\"/></th>";
    s += "<th>Trim Right<br/><input type=\"checkbox\" onclick=\"setCheckboxes('ftrimr',this.checked)\"/></th>";
    s += "<th>Upper<br/><input type=\"checkbox\" onclick=\"setCheckboxes('chkupper',this.checked);if(this.checked){setCheckboxes('chklower',false);setCheckboxes('chkProper',false);}\"/></th>";
    s += "<th>Lower<br/><input type=\"checkbox\" onclick=\"setCheckboxes('chklower',this.checked);if(this.checked){setCheckboxes('chkupper',false);setCheckboxes('chkProper',false);}\"/></th>";
    s += "<th title=\"1st letter of word capitalized the rest not\">Proper Case<br/><input type=\"checkbox\" onclick=\"setCheckboxes('chkProper',this.checked);if(this.checked){setCheckboxes('chkupper',false);setCheckboxes('chklower',false);}\"/></th>";
    s += "<th>Remove Punctuation<br/><input type=\"checkbox\" onclick=\"setCheckboxes('chkpunct',this.checked)\"/></th>";
    s += "<th>Crunch Spaces<br/><input type=\"checkbox\" onclick=\"setCheckboxes('chkcrunch',this.checked)\"/></th>";
    if (inJsonForm) {
        s += "<th>Use null for Empty Field<br/><input type=\"checkbox\" onclick=\"setCheckboxes('chknull',this.checked)\"/></th>\n";
    }
    s += "<th># Decimals or Date Format</th>\n";

    s += "</tr>";
    var template = "<tr><td>{#}</td>";
    template += "<td>{FIELDNAME{#}}</td>\n";
    template += "<td><input type=checkbox id=\"ftriml{#}\" value=\"Y\" title=\"Trim Left\"></td>\n";
    template += "<td><input type=checkbox id=\"ftrimr{#}\" value=\"Y\" title=\"Trim Right\"></td>\n";
    template += "<td><input type=checkbox id=\"chkupper{#}\"  value=\"Y\" onclick=\"if(this.checked){document.getElementById('chkProper{#}').checked=document.getElementById('chklower{#}').checked=false}\"></td>\n";
    template += "<td><input type=checkbox id=\"chklower{#}\"  value=\"Y\" onclick=\"if(this.checked){document.getElementById('chkProper{#}').checked=document.getElementById('chkupper{#}').checked=false}\"></td>\n";
    template += "<td><input type=checkbox id=\"chkProper{#}\" value=\"Y\" onclick=\"if(this.checked){document.getElementById('chklower{#}').checked=document.getElementById('chkupper{#}').checked=false}\"></td>\n";
    template += "<td><input type=checkbox id=\"chkpunct{#}\"  value=\"Y\" title=\"Remove punctuation\"></td>\n";
    template += "<td><input type=checkbox id=\"chkcrunch{#}\" value=\"Y\" title=\"Replace 2 or more spaces with 1\"></td>\n";
    if (inJsonForm) {
        template += "<td><input type=checkbox id=\"chknull{#}\" value=\"Y\" title=\"Use null instead of empty string\"></td>\n";
    }
    template += "<td><input type=\"text\" size=\"10\" id=\"fdecimals{#}\"  value=\"\"  title=\"Specify # of decimal places or output date format\"></td>\n";

    template += "</tr>";
    var j;
    for (j = 0; j < hdr.length; j++) // for each column
    {
        s += template.replace(/\{#\}/g, "" + (j + 1)).replace("{FIELDNAME" + (j + 1) + "}", hdr[j].replace(/\s+/g, "_"));
    }
    s += "</table>";
    return s;
}
function flatOptions(CSV) {
    if(!CSV){return;}
    var stats = getCsvColLength(CSV);
    //var stats=getCsvColLength(CSV);
    var hdr = getCsvHeader(CSV);
    //var s="<table>\n<tr>\n<th>Col #</th><th>Field Name</th><th>Include</th><th>Trim</th><th>Pad Size</th><th>Decimals</th>";
    var s = '<table class="table table-bordered table-hover table-condensed">\n<tr>\n<th>Col #</th><th>Field Name</th>';
    s += "<th>Trim<br/><input type=\"checkbox\" onclick=\"setCheckboxes('ftrim',this.checked)\"/></th><th>Pad Size</th><th># Decimals or Date Format</th>";
    s += "<th>Upper<br/><input type=\"checkbox\" onclick=\"setCheckboxes('chkupper',this.checked);if(this.checked){setCheckboxes('chklower',false);}\"/></th>";
    s += "<th>Lower<br/><input type=\"checkbox\" onclick=\"setCheckboxes('chklower',this.checked);if(this.checked){setCheckboxes('chkupper',false);}\"/></th>";
    s += "<th>Right<br/>Justify<br/><input type=\"checkbox\" onclick=\"setCheckboxes('chkrjust',this.checked);if(this.checked){setCheckboxes('chkcjust',false);}\"/></th>";
    s += "<th>Center<br/>Justify<br/><input type=\"checkbox\" onclick=\"setCheckboxes('chkcjust',this.checked);if(this.checked){setCheckboxes('chkrjust',false);}\"/></th></tr>";
    var template = "<tr><td>{#}</td>";
    template += "<td>{FIELDNAME{#}}</td>\n";
    //template += "<td><input type=checkbox id=\"finc{#}\"  value=\"Y\" checked></td>\n";
    template += "<td><input type=checkbox id=\"ftrim{#}\" value=\"Y\" ></td>\n";
    template += "<td><input type=text id=\"fpadsize{#}\" size=3 maxlength=3 value=\"{FIELDSIZE{#}}\" ></td>\n";
    template += "<td><input type=text id=\"fdecimals{#}\" size=10 value=\"\" ></td>\n";
    template += "<td><input type=checkbox id=\"chkupper{#}\"  value=\"Y\" onclick=\"if(this.checked)document.getElementById('chklower{#}').checked=false\"></td>\n";
    template += "<td><input type=checkbox id=\"chklower{#}\"  value=\"Y\" onclick=\"if(this.checked)document.getElementById('chkupper{#}').checked=false\"></td>\n";
    template += "<td><input type=checkbox id=\"chkrjust{#}\"  value=\"Y\" onclick=\"if(this.checked)document.getElementById('chkcjust{#}').checked=false\"></td>\n";
    template += "<td><input type=checkbox id=\"chkcjust{#}\"  value=\"Y\" onclick=\"if(this.checked)document.getElementById('chkrjust{#}').checked=false\"></td>\n";
    template += "</tr>";
    var j;
    //alert('in options, hdr length='+hdr.length);
    for (j = 0; j < hdr.length; j++) // for each column
    {
        s += template.replace(/\{#\}/g, "" + (j + 1)).replace("{FIELDNAME" + (j + 1) + "}", hdr[j].replace(/\s+/g, "_"))
            .replace("{FIELDSIZE" + (j + 1) + "}", (stats.length > 0 && stats[j]) != 0 ? stats[j] : "");
    }
    //alert(s);
    s += "</table>";
    return s;
}
function parseAndOptions(CSV, forceOptions) {
    var s;
    var j;
    var datefound = 0;
    //alert('in parseAndOptions');
    if(!CSV){return;}
    if (document.getElementById('txtRowLimit')) CSV.limit = document.getElementById('txtRowLimit').value;
    if (document.getElementById('txtSkipLimit')) CSV.skip = document.getElementById('txtSkipLimit').value;
    if (document.getElementById('chkHeader')) CSV.isFirstRowHeader = document.getElementById('chkHeader').checked;
    if (document.getElementById('chkHeaderUpper')) CSV.headerToUpper = document.getElementById('chkHeaderUpper').checked;
    if (document.getElementById('chkHeaderLower')) CSV.headerToLower = document.getElementById('chkHeaderLower').checked;
    //alert('*******upper'+CSV.headerToUpper + ", lower:" + CSV.headerToLower);
    if (document.getElementById('txt1')) {
        CSV.parse(document.getElementById('txt1').value);
        if (false && CSV.detectedQuote != CSV.quote) { // We can do this for auto-detect of quote
            CSV.quote = CSV.detectedQuote;
            CSV.parse(document.getElementById('txt1').value);
            if (document.getElementById("chkInputQuote"))
                document.getElementById("chkInputQuote").checked = CSV.detectedQuote === "'";
            forceOptions = true;
        }
        for (j = 0; j < CSV.maxColumnsFound; j++) if (CSV.statsCnt[j] && CSV.statsCnt[j].fieldType === "D") datefound++;
        if (detCsvDateFormat && datefound > 0) {
            detCsvDateFormat(CSV);
        }
        else CSV.dateformat = undefined;
    }
    //alert('in parseAndOptions 44444, prevCols='+CSV.prevColumnsFound+",max="+CSV.maxColumnsFound);
    if (document.getElementById('divOptions') && (CSV.prevColumnsFound != CSV.maxColumnsFound || forceOptions)) {
        document.getElementById('divOptions').innerHTML = sqlOptions(CSV);
        setOptions(CSV);
        CSV.prevColumnsFound = CSV.maxColumnsFound;
    }
    if (document.getElementById('divFlatOptions') && (CSV.prevColumnsFound != CSV.maxColumnsFound || forceOptions)) {
        document.getElementById('divFlatOptions').innerHTML = flatOptions(CSV);
        //if(setFlatOptions)setFlatOptions(CSV);
        CSV.prevColumnsFound = CSV.maxColumnsFound;
    }
    if (document.getElementById('divMinOptions') && (CSV.prevColumnsFound != CSV.maxColumnsFound || forceOptions)) {
        document.getElementById('divMinOptions').innerHTML = minOptions(CSV);
        CSV.prevColumnsFound = CSV.maxColumnsFound;
    }
    if (document.getElementById("divInputCounts")) {
        document.getElementById("divInputCounts").innerHTML = "Input Records- Header: "
            + (((CSV.arHeaderRow.length == 0) && (CSV.isFirstRowHeader)) ? "missing" : CSV.isFirstRowHeader + (CSV.isFirstRowHeader ? " &nbsp; Header Fields: " + CSV.headerColumns : ""))
            + "\n<br/>Data: "
            + " Separator: " + (CSV.delimiter == "\t" ? "Tab" : CSV.delimiter == " " ? "Space" : CSV.delimiter || " ") + " &nbsp; &nbsp; "
            + " Fields: " + CSV.maxColumnsFound + " &nbsp; &nbsp; "
            + " Records: " + (CSV.dataRowsFound <= 0 ? "0" : CSV.dataRowsFound);

        // Let's check the header to see if it really looks like a header
        // Even though there is a check for empty header here actually it is already defaults to "Field{#}"
        if (CSV.isFirstRowHeader) {
            for (j = 0; j < CSV.arHeaderRow.length; j++) {
                if (CSV.arHeaderRow[j].isNumeric() || CSV.arHeaderRow[j] == "") {
                    document.getElementById("divInputCounts").innerHTML += "<br/><b>WARNING</b> - Are you sure your First row is column names?";
                    break;
                }
            }
        }
        for (j = 0; j < CSV.headerErrors.length; j++) {
            document.getElementById("divInputCounts").innerHTML += "<br/><b>WARNING</b> - Heading column # " + CSV.headerErrors[j].field + " is empty.";
        }
        if (CSV.skipEmptyRowCnt > 0) {
            document.getElementById("divInputCounts").innerHTML += "<br/><b>WARNING</b> - Empty lines skipped: " + CSV.skipEmptyRowCnt;
        }
        if (CSV.isFirstRowHeader && CSV.headerImbalance && CSV.dataRowsFound > 0) {
            document.getElementById("divInputCounts").innerHTML += "<br/><b>WARNING</b> - Your column header has " + CSV.headerColumns + " columns but these lines do not: " + CSV.headerImbalanceRows;
        }
        else if (CSV.fieldImbalance) {
            document.getElementById("divInputCounts").innerHTML += "<br/><b>WARNING</b> - Your first line has " + CSV.maxColumnsFound + " columns but these lines do not: " + CSV.fieldImbalanceRows;
        }
        if (CSV.quote != CSV.detectedQuote) {
            document.getElementById("divInputCounts").innerHTML += "<br/><b>WARNING</b> - Are you sure your Quoting Character setting is correct? <small>(See Input Options)</small>";
        }
        for (j = 0; j < CSV.statsCnt.length; j++) {
            if (CSV.statsCnt[j] && (CSV.statsCnt[j].fieldType != "D" && (CSV.statsCnt[j].dateCnt - CSV.statsCnt[j].emptyCnt) / CSV.dataRowsFound >= 0.9)) {
                document.getElementById("divInputCounts").innerHTML += "<br/><b>WARNING</b> - Field: " + (CSV.arHeaderRow[j] || (j + 1)) + " appears to be a DATE yet it has non-date values";
            }
        }
        var bad;
        var cnt = 0;
        var msg = ["",
            "Spaces before quoting character"
            , "Data after quoting character"
            , "Missing end Quoting character"
        ];
        for (bad in CSV.relaxedInfo) {
            cnt++;
            if (cnt > 5) {
                document.getElementById("divInputCounts").innerHTML += "<br/>...";
                break;
            }
            document.getElementById("divInputCounts").innerHTML += "<br/><b>WARNING</b> - " + msg[CSV.relaxedInfo[bad].error] + " at line: " + bad + ", Column:" + CSV.relaxedInfo[bad].column;
        }
    }
}
/*
function determineBadLines()
{
    var j,k;
    var countStats = [];
    var found=false;
    if(CSV.isFirstRowHeader)return;
    for (j=0;j<CSV.dataRowsFound;j++) {
        found=false;
        for(k=0;k<countStats.length;k++) {
            if(countStats[k].fields===CSV.table[j].length){
                countStats[k].fieldCount++;
                break;
            }
        }
        if(!found)countStats.push({fields:CSV.table[j].length,fieldCount:1});
    }
    countStats.sort(function(x,y){return x.fieldCount-y.fieldCount});
    //alert(countStats);
}
*/
function clearAll() {
    var appendMode = false;
    if (document.getElementById('chkAppend')) appendMode = document.getElementById('chkAppend').checked;
    if (document.getElementById('sepAuto')) document.getElementById('sepAuto').checked = true;
    if (CSV) { CSV.delimiter = ","; CSV.autodetect = true; CSV.quote = '"'; CSV.outputQuote = '"'; CSV.maxColumnsFound = 0; }
    if (document.getElementById('txt1')) document.getElementById('txt1').value = "";
    if (!appendMode) if (document.getElementById('txta')) document.getElementById('txta').value = "";
    if (document.getElementById('txtCols')) document.getElementById('txtCols').value = "";
    if (document.getElementById('chkHeader')) document.getElementById('chkHeader').checked = true;
    if (document.getElementById('chkHeaderUpper')) document.getElementById('chkHeaderUpper').checked = false;
    if (document.getElementById('chkHeaderLower')) document.getElementById('chkHeaderLower').checked = false;
    if (!appendMode) if (document.getElementById('diva')) document.getElementById('diva').innerHTML = ""; /* output */
    if (document.getElementById('divOptions')) document.getElementById('divOptions').innerHTML = "";
    if (document.getElementById('divFlatOptions')) document.getElementById('divFlatOptions').innerHTML = "";
    if (document.getElementById('divMinOptions')) document.getElementById('divMinOptions').innerHTML = "";
    if (document.getElementById('chkInputQuote')) document.getElementById('chkInputQuote').checked = false;
    if (document.getElementById('chkOutputQuote')) document.getElementById('chkOutputQuote').checked = false;
    if (document.getElementById('chkIgnoreDoubleQuote')) document.getElementById('chkIgnoreDoubleQuote').checked = false;
    if (document.getElementById('chkDecodeLiterals')) document.getElementById('chkDecodeLiterals').checked = false;
    parseAndOptions();
    setupSortDD();
}

function getUserOptions(colpos) {

}
function radiovalue(radioObj) {
    var j;
    if (!radioObj)
        return "";
    var radioLength = radioObj.length;
    if (radioLength == undefined)
        if (radioObj.checked) {
            return radioObj.value;
        } else {
            return "";
        }
    for (var i = 0; i < radioLength; i++) {
        if (radioObj[i].checked) {
            return radioObj[i].value;
        }
    }
    return "";
}
function setRadioValue(radioObj, newValue) {
    if (!radioObj)
        return;
    var radioLength = radioObj.length;
    if (radioLength == undefined) {
        radioObj.checked = (radioObj.value == newValue.toString());
        return;
    }
    newValue = (newValue || "") + "";
    if (newValue === "\t") newValue = "\\t";
    for (var i = 0; i < radioLength; i++) {
        radioObj[i].checked = false;
        if (radioObj[i].value == newValue) {
            radioObj[i].checked = true;
        }
    }
}
function sortStr() {
    var ddFld;
    var a, d, j, s, t;
    s = "";
    //alert('in sortStr');
    for (j = 1; j <= 4; j++) {
        ddFld = document.getElementById('selSortFld' + j);
        if (!ddFld) continue;
        d = document.getElementById('selSortFld' + j).value;
        if (d == "") continue;
        t = document.getElementById('selSortType' + j).value;
        a = document.getElementById('selSortAsc' + j).value;
        if (j > 1) s += ",";
        s += t + d + a;
    }
    //alert("s=" + s);
    CSV.setSortFlds(s);
    CSV.mySortNeeded = true;
    //alert(s);
    return s;
}
function setupSortDD() {
    var dd;
    var j, k, o;
    //alert("setupsortdd");
    for (j = 1; j <= 4; j++) {
        dd = document.getElementById('selSortFld' + j);
        if (!dd) continue;
        if (dd.options.length - 1 == CSV.maxColumnsFound) break;
        dd.options.length = 1;
        dd.selectedIndex = 0;
        for (k = 1; k <= CSV.maxColumnsFound; k++) {
            o = document.createElement("option");
            o.text = o.value = "" + k;
            dd.options.add(o);
        }
    }
    //alert("setupsortdd before sortstr()");
    sortStr();
    if (typeof (csvCreateQueryUI) == typeof (Function)) csvCreateQueryUI();
    if (document.getElementById("btnColsReset")) document.getElementById("btnColsReset").click();
}

function getFldPosArr(CSV) {
    var a = [];
    var i, j;
    if(!CSV){return;}
    if (CSV.displayPoss != "") {
        a = CSV.displayPoss.split(",");
        for (i = 0; i < a.length; i++) { // If non-numeric and a header, substitute the position
            a[i] = (a[i] + "").trim();
            if (isNaN(a[i]) && a[i] > " ") {
                for (j = 0; j < CSV.arHeaderRow.length; j++) {
                    if ((a[i] + "").toUpperCase() == CSV.arHeaderRow[j].toUpperCase()) a[i] = j + 1;
                }
            }
        }
        for (i = a.length - 1; i >= 0; i--) {
            if (isNaN(a[i]) || a[i] < 1 || a[i] > CSV.maxColumnsFound) {
                a.splice(i, 1); // remove entry
            }
        }
    }
    if (a.length == 0) {
        for (i = 0; i < CSV.maxColumnsFound; i++) {
            a[a.length] = i + 1;
        }
    }
    if (a.length == 0) { // If heading but no data
        for (i = 0; i < CSV.arHeaderRow.length; i++)
            a[a.length] = i + 1;
    }
    //alert(a);
    return a;
}
function flattenSqlJson(data) {
    var j;
    var newo = [];
    for (j = 0; j < data.length; j++) {
        var rec = {};
        for (k = 0; k < data[j].length; k++) {
            rec[data[j][k].column] = data[j][k].value;
        }
        newo[j] = rec;
    }
    return newo;
}
function getExampleCsv() {
    var s =
        "id,name,amount,Remark\n" +
        "1,\"Johnson, Smith, and Jones Co.\",345.33,Pays on time\n" +
        "2,\"Sam \"\"Mad Dog\"\" Smith\",993.44,\n" +
        "3,\"Barney & Company\",0,\"Great to work with\n" +
        "and always pays with cash.\"\n" +
        "4,Johnson's Automotive,2344,\n";
    return s;
}
function getExampleCsvJson() {
    var s =
        "id,name/first,name/last,rating/0,rating/1,rating/2\n" +
        "1,Dan,Jones,8,7,9\n" +
        "2,Bill,Barner,7,6,5\n" +
        "3,Joe,Smoe,4,3,\n";
    return s;
}
function getExampleXml(n) {
    n = (n || 1) - 1;
    var s = "<?xml version=\"1.0\"?>\n" +
        "<ROWSET>\n" +
        "<ROW>\n" +
        "<id>1</id>\n" +
        "<name>Johnson, Smith, and Jones Co.</name>\n" +
        "<amount>345.33</amount>\n" +
        "<Remark>Pays on time</Remark>\n" +
        "</ROW>\n" +
        "<ROW>\n" +
        "<id>2</id>\n" +
        "<name>Sam &quot;Mad Dog&quot; Smith</name>\n" +
        "<amount>993.44</amount>\n" +
        "<Remark></Remark>\n" +
        "</ROW>\n" +
        "<ROW>\n" +
        "<id>3</id>\n" +
        "<name>Barney &amp; Company</name>\n" +
        "<amount>0</amount>\n" +
        "<Remark>Great to work with\n" +
        "and always pays with cash.</Remark>\n" +
        "</ROW>\n" +
        "<ROW>\n" +
        "<id>4</id>\n" +
        "<name>Johnson&apos;s Automotive</name>\n" +
        "<amount>2344</amount>\n" +
        "<Remark></Remark>\n" +
        "</ROW>\n" +
        "</ROWSET>";
    return s;
}
function getExampleJson(n) {
    n = (n || 1) - 1;
    var s = [
        "[\n" +
        "  {\n" +
        "    \"id\":1," +
        "    \"name\":\"Johnson, Smith, and Jones Co.\",\n" +
        "    \"amount\":345.33," +
        "    \"Remark\":\"Pays on time\"\n" +
        "  },\n" +
        "  {\n" +
        "    \"id\":2," +
        "    \"name\":\"Sam \\\"Mad Dog\\\" Smith\",\n" +
        "    \"amount\":993.44," +
        "    \"Remark\":\"\"\n" +
        "  },\n" +
        "  {\n" +
        "    \"id\":3," +
        "    \"name\":\"Barney & Company\",\n" +
        "    \"amount\":0," +
        "    \"Remark\":\"Great to work with\\nand always pays with cash.\"\n" +
        "  },\n" +
        "  {\n" +
        "    \"id\":4," +
        "    \"name\":\"Johnson's Automotive\",\n" +
        "    \"amount\":2344," +
        "    \"Remark\":\"\"\n" +
        "  }\n" +
        "]\n",

        "{ \"data\" : [\n" +
        "  {" +
        "    \"id\":1," +
        "    \"name\":\"Johnson, Smith, and Jones Co.\"" +
        "  },\n" +
        "  {" +
        "    \"id\":2," +
        "    \"name\":\"Sam \\\"Mad Dog\\\" Smith\"" +
        "  },\n" +
        "  {" +
        "    \"id\":3," +
        "    \"name\":\"Barney & Company\"" +
        "  },\n" +
        "  {" +
        "    \"id\":4," +
        "    \"name\":\"Johnson's Automotive\"" +
        "  }\n" +
        "] }\n",

        "{ \"race\" : \n" +
        " { \"entries\" : [\n" +
        "  {" +
        "    \"id\":11," +
        "    \"name\":\"Johnson, Smith, and Jones Co.\"" +
        "  },\n" +
        "  {" +
        "    \"id\":22," +
        "    \"name\":\"Sam \\\"Mad Dog\\\" Smith\"" +
        "  },\n" +
        "  {" +
        "    \"id\":33," +
        "    \"name\":\"Barney & Company\"" +
        "  },\n" +
        "  {" +
        "    \"id\":44," +
        "    \"name\":\"Johnson's Automotive\"" +
        "  }\n" +
        "] }\n}\n",

        "{\n" +
        "    \"id\":1," +
        "    \"name\":\"Johnson, Smith, and Jones Co.\"," +
        "    \"amount\":345.33," +
        "    \"Remark\":\"Pays on time\"\n" +
        "}\n",

        "[\n" +
        "    [" +
        "      1," +
        "      \"Johnson, Smith, and Jones Co.\"," +
        "      345.33" +
        "    ],\n" +
        "    [" +
        "      99," +
        "      \"Acme Food Inc.\"," +
        "      2993.55" +
        "    ]\n" +
        "]"
    ]
        ;
    return s[n];
}
function getExampleKml() {
    var s =
        "National Park,$ Obligated,State,Latitude,Longitude\n" +
        "Abraham Lincoln Birthplace NHS,\"$34,584\",KY,37.6116333423,-85.6442940021\n" +
        "Acadia,\"$102,631\",ME,44.3593807753,-68.2397319808\n" +
        "Andersonville,\"$65,133\",GA,32.197905290823,-84.1302615685733\n" +
        "Andrew Johnson ,\"$17,949\",TN,36.1562449930463,-82.8370902853041\n" +
        "Antietam,\"$54,743\",MD,39.462381614,-77.7359854016\n" +
        "Appomattox Court House,\"$12,651\",VA,37.3826448073,-78.8027430409\n" +
        "Assateague Island,\"$51,921\",MD,38.0556022623662,-75.2453836072023\n" +
        "Big Bend,\"$535,983\",TX,29.0103562389,-103.311115521\n" +
        "Big South Fork National River and Recreation Area,\"$3,009\",\"TN, KY\",36.3837375235,-84.6743069824\n";
    return s;
}
function getExampleFlat() {
    var s =
        "1     Johnson, Smith, and Jones Co.  345.33     Pays on time                  \n" +
        "2     Sam \"Mad Dog\" Smith            993.44              \n" +
        "3     Barney & Company               0          Great to work with and always pays with cash.      \n" +
        "4     Johnson's Automotive           2344        \n";
    return s;
}
function getExampleGeoJson(n) {
    var s = "{ \n    \"type\": \"FeatureCollection\",\n    \"features\": [\n      { \"type\": \"Feature\",\n        \"geometry\": {\"type\": \"Point\", \"coordinates\": [-75.343, 39.984]},\n        \"properties\": { \n          \"name\": \"Location A\",\n          \"category\": \"Store\"\n        }\n      },\n      { \"type\": \"Feature\",\n        \"geometry\": {\"type\": \"Point\", \"coordinates\": [-80.24, 40.12]},\n        \"properties\": { \n          \"name\": \"Location B\",\n          \"category\": \"House\"\n        }\n      },\n      { \"type\": \"Feature\",\n        \"geometry\": {\"type\": \"Point\", \"coordinates\": [ -77.2, 41.427]},\n        \"properties\": { \n          \"name\": \"Location C\",\n          \"category\": \"Office\"\n        }\n      }\n    ]\n  }";
    return s;
}
function loadScript(url) {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.id = "dynScriptTemp";
    s.src = url;
    document.getElementsByTagName("head")[0].appendChild(s);
}
// remove by this
//var script = document.getElementById("dynScriptTemp");
//if(script)script.parentElement.removeChild(script);
function loadScriptAndRun(url) {
    if (!url.startsWith('?')) { url = '?' + url; }
    loadScript("http://www.convertcsv.com/cgi-bin/url-to-json.php" + url);
}
function loadDataAndRun(data) {
    document.getElementById('txt1').value = data.html.join("\n");
    document.getElementById('btnRun').click();
}
function loadURL(url) {
    if (url.trim() == "") { alert("Missing URL"); return false; }
    loadScriptAndRun("?callback=loadDataAndRun&url=" + encodeURIComponent(url));
}
// Prettify JSON string and return string
function prettyJSON(text, step) {

    var step = step ? step : 3;

    if (typeof JSON === 'undefined') return text;
    try {
        if (typeof text === "string") return JSON.stringify(JSON.parse(text), null, step);
        if (typeof text === "object") return JSON.stringify(text, null, step);
    }
    catch (e) { }
    return text; // text is not string nor object
}
// Return how many levels of JSON (1 or more)
// Outstanding question : Is [] 1 level or 2? also {} - we return 1
function getJsonLevel(o) {
    if (typeof o === "string") { o = JSON.parse(o); }
    var s = JSON.stringify(o, null, "\t").split(/\r\n|\n|\r/gm);
    var level = 0;
    var j, a;
    for (j = 0; j < s.length; j++) {
        if (s[j].charAt(0) != "\t") continue;
        a = s[j].match(/\t+/gm);
        if (a[0].length > level) level = a[0].length;
    }
    return level + 1;
}
// requires filesave.js from http://eligrey.com
function saveOutput(text, fn, doctype) {
    // doctype text = "text/plain;charset=utf-8"
    var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    saveAs(blob, fn, true);
}
function saveExcel(id, resetCsv) {
    // save to excel
    var fn = "convertcsv";
    var old = {};
    if (resetCsv) {
        old.autodetect = CSV.autodetect;
        old.isFirstRowHeader = CSV.isFirstRowHeader;
        old.quote = CSV.quote;
        old.delimiter = CSV.delimiter;
        old.table = CSV.table.slice(0);
    }
    if (document.getElementById("fn")) { fn = document.getElementById("fn").value; }
    CSV.autodetect = true;
    CSV.isFirstRowHeader = false;
    CSV.quote = '"';
    if (document.getElementById("frm1") && document.getElementById("outSepComma")) {
        CSV.delimiter = radiovalue(document.frm1.outsep) || ",";
        if (CSV.delimiter === "o") {
            CSV.delimiter = document.getElementById("outSepOtherVal").value;
        }
        CSV.autodetect = false;
    }
    if (document.getElementById("chkOutputQuote")) {
        if (document.getElementById("chkOutputQuote").checked) { CSV.quote = "'"; }
    }
    if (document.getElementById(id)) {
        CSV.parse(document.getElementById(id).value);
    }
    else { CSV.parse(id) }

    alasql('SELECT * INTO XLSX("' + fn + '.xlsx",{headers:false}) FROM ?', [CSV.table]);
    if (resetCsv) {
        CSV.autodetect = old.autodetect;
        CSV.isFirstRowHeader = old.isFirstRowHeader;
        CSV.quote = old.quote;
        CSV.delimiter = old.delimiter;
        CSV.table = old.table.slice(0);
        CSV.parse(CSV.stringify());
    }
    return false;
}
function saveFile(text, ext) {
    var eol = "\r\n";
    if (ext === null) ext = "";
    if (ext != "") ext = "." + ext; // give option to not have extension
    var fn = document.getElementById('fn').value.trim();
    if (fn == "") { fn = document.getElementById('fn').value = "convertcsv"; }
    if (document.getElementById("eol")) eol = document.getElementById("eol").value || eol;
    if (eol == "LF") eol = "\n";
    if (eol == "CRLF") eol = "\r\n";
    var v = text.replace(/\r\n|\r|\n/gm, eol); // standardize eol
    saveOutput(v, fn + ext, null);
}

function loadCsv() {
    var delimiter = "";
    var q = "";
    var bs = 0;
    var acc = "";
    var idq = "";
    if (!storageSup.has_html5_storage()) return;
    if (storageSup.getCacheCsv() == null) storageSup.setCacheCsv("N");
    if (storageSup.getCacheCsv() != "Y") return;
    if (document.getElementById('txt1') && sessionStorage.getItem("clearPressed") != "Y") {
        if (document.getElementById("chkHeader")) {
            document.getElementById("chkHeader").checked = localStorage.getItem("csvChkHeader") == "Y";
            delimiter = localStorage.getItem("csvDelimiter");
            setRadioValue(document.forms["frm1"].sep, delimiter);
            q = localStorage.getItem("csvQuote");
            bs = localStorage.getItem("csvBackslash");
            acc = localStorage.getItem("chkReplaceAccents");
            idq = localStorage.getItem("chkIgnoreDoubleQuote");

            CSV.autodetect = true;
            if (delimiter && delimiter != "") {
                CSV.autodetect = false;
                CSV.delimiter = delimiter;
            }
            if (q && q != "") {
                CSV.quote = q;
                if (document.getElementById("chkInputQuote")) {
                    document.getElementById("chkInputQuote").checked = (q === "'");
                }
            }
            if (idq && idq != "") {
                if (document.getElementById("chkIgnoreDoubleQuote")) {
                    CSV.ignoreQuote = (idq == "Y");
                    document.getElementById("chkIgnoreDoubleQuote").checked = CSV.ignoreQuote;
                }
            }
            if (acc && acc != "") {
                if (document.getElementById("chkReplaceAccents")) {
                    document.getElementById("chkReplaceAccents").checked = (acc === "Y");
                }
            }
            CSV.decodeBackslashLiterals = false;
            if (bs != "") {
                CSV.decodeBackslashLiterals = (bs === "Y");
                if (document.getElementById("chkDecodeLiterals")) {
                    document.getElementById("chkDecodeLiterals").checked = CSV.decodeBackslashLiterals;
                }
            }
            // csvBackslash
        }
        assignText(storageSup.getCsv());
    }
    sessionStorage.setItem("clearPressed", "");
}

function saveCsv() {
    var q = CSV.quote || '"';
    var bs = "N";
    if (!storageSup.has_html5_storage()) return;
    if (document.getElementById("chkReplaceAccents")) localStorage.setItem("chkReplaceAccents", (document.getElementById("chkReplaceAccents").checked) ? "Y" : "");
    if (document.getElementById("chkIgnoreDoubleQuote")) localStorage.setItem("chkIgnoreDoubleQuote", (document.getElementById("chkIgnoreDoubleQuote").checked) ? "Y" : "");
    if (document.getElementById("chkDecodeLiterals")) bs = document.getElementById("chkDecodeLiterals").checked;
    if (document.getElementById('txt1')) {
        if (document.getElementById('txt1').value != getExampleCsv() && document.getElementById('txt1').value.length > 0) {
            storageSup.putCsv(document.getElementById('txt1').value, document.getElementById("chkHeader").checked ? "Y" : "N"
                , radiovalue(document.forms["frm1"].sep), q, bs ? "Y" : "N");
        }
    }
}
function clearPage() {
    if (storageSup && storageSup.has_html5_storage()) { sessionStorage.setItem("clearPressed", "Y"); }
    window.location.reload(true);
}

function doTransformations(v, k, CSV) {
    var d;
    if (document.getElementById("ftrim" + (k + 1))) if (document.getElementById("ftrim" + (k + 1)).checked) v = v.trim();
    if (document.getElementById("ftriml" + (k + 1))) if (document.getElementById("ftriml" + (k + 1)).checked) v = v.ltrim();
    if (document.getElementById("ftrimr" + (k + 1))) if (document.getElementById("ftrimr" + (k + 1)).checked) v = v.rtrim();
    if (document.getElementById("chkupper" + (k + 1))) if (document.getElementById("chkupper" + (k + 1)).checked) v = v.toUpperCase();
    if (document.getElementById("chklower" + (k + 1))) if (document.getElementById("chklower" + (k + 1)).checked) v = v.toLowerCase();
    if (document.getElementById("chkProper" + (k + 1))) if (document.getElementById("chkProper" + (k + 1)).checked) v = v.toProperCase();
    if (document.getElementById("chkpunct" + (k + 1))) if (document.getElementById("chkpunct" + (k + 1)).checked) {
        if (CSV.statsCnt[k]) {
            if (CSV.statsCnt[k].fieldType != "N" && CSV.statsCnt[k].fieldType != "I") v = v.removePunctuation();
        }
        else {
            v = v.removePunctuation();
        }
    }
    if (document.getElementById("chkcrunch" + (k + 1))) if (document.getElementById("chkcrunch" + (k + 1)).checked) v = v.crunch();
    if (document.getElementById("fdecimals" + (k + 1))) {
        if (document.getElementById("fdecimals" + (k + 1)).value != "") {
            d = document.getElementById('fdecimals' + (k + 1)).value;
            if (CSV.statsCnt[k] && (CSV.statsCnt[k].fieldType == "N" || CSV.statsCnt[k].fieldType == "I" || CSV.statsCnt[k].fieldType == "B")) {
                if (isNaN(d)) d = 0; else d = d * 1;
                if (v.trim() != "") {
                    v = (v.toNumber().toFixed(d) + "");
                }
            }
            else if (v.trim() != "" && CSV.statsCnt[k] && (CSV.statsCnt[k].fieldType == "D" || (CSV.statsCnt[k].dateCnt - CSV.statsCnt[k].emptyCnt) / CSV.dataRowsFound >= 0.9)) {
                var vv = v;
                try {
                    d = d.toUpperCase();
                    var v = moment(v, CSV.dateformat[k]).format(d);
                } catch (e) { v = vv; }
            }
        }
    }
    return v;
}

function setOutputSingleQuote(on) {
    CSV.outputQuote = on ? "'" : '"';
}
function setInputSingleQuote(on) {
    CSV.quote = on ? "'" : '"';
    parseAndOptions(CSV, true);
}
function setCheckboxes(name, tf) {
    var j;
    var fld;
    for (j = 0; j < CSV.maxColumnsFound; j++) // for each column
    {
        fld = document.getElementById(name + (j + 1));
        if (!fld) continue;
        fld.checked = tf; // boolean
    }
}