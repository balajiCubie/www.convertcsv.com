// This function depends on moments.js

function detCsvDateFormat(CSV) {
    var i, j, k;
    var v;
    var fmts = ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY/MM/DD", "MM/DD/YY", "DD/MM/YY", "MM-DD-YYYY", "DD-MM-YYYY", "YYYY-MM-DD", "MM-DD-YY", "DD-MM-YY", "MMM DD YYYY", "DD MMM YYYY", "DD MMM YY"];
    var fmtc = [];
    for (i = 0; i < fmts.length; i++) fmtc.push(0); // counts
    CSV.dateformat = [];
    for (k = 0; k < CSV.maxColumnsFound; k++) CSV.dateformat.push("");
    for (k = 0; k < CSV.maxColumnsFound; k++) {
        if (CSV.statsCnt[k] && CSV.statsCnt[k].fieldType === "D") {
            //alert("detCsvDateFormat: checking date format at " + k);
            for (j = 0; j < CSV.table.length; j++) { // for each row
                v = CSV.table[j][k] || "";
                for (i = 0; i < fmts.length; i++) {
                    //alert("date=" + v + ",format=" + fmts[i]);
                    if(moment(v,fmts[i],true).isValid()) fmtc[i]++;
                }
            }
            //alert(JSON.stringify(fmtc));
            // find index of largest count
            var max = fmtc[0];
            var maxIndex = 0;

            for (i = 1; i < fmtc.length; i++) {
                if (fmtc[i] > max) {
                    maxIndex = i;
                    max = fmtc[i];
                }
            }
            if (max > 0) { // one of the formats matched
                CSV.dateformat[k] = fmts[maxIndex];
            }
        } // date found
    }
    //alert(JSON.stringify(CSV.dateformat));
}