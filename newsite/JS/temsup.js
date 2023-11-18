// Copyright 2013-2020 Data Design Group, Inc.


// Generate a sequence, used by csvFromTem
function SeqObj(n) {
    this.n = n - 1 || 0;
    this.nInit = this.n;
    this.next = function () { return ++this.n; };
    this.curr = function () { return this.n; };
    this.reset = function () { this.n = this.nInit; };
}

// javascript-obfuscator:disable
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
        try { eval("var h" + (k + 1) + "=CSV.arHeaderRow[" + k + "]"); } catch (e) { }
        try { eval("var H" + (k + 1) + "=CSV.arHeaderRow[" + k + "].toUpperCase()"); } catch (e) { }
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
    var rn = (rownum || 0) + 1;
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
    if (tem.trim() === "") return tem;
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
        if (cmd && lines[j] !== "") {
            // expand variable and push
            t.push(temGetVal(CSV, lines[j], rownum, seq, temOptions));
            cmd = false;
        }
        else if (lines[j] === "") {
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

// javascript-obfuscator:enable
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
