// Copyright 2013 - 2018 Data Design Group, Inc  All Rights Reserved
function ieReadLocalFile(that,callback,encoding) {
        //alert(that.value);
        if(!that.value)return;
        if(that.value.length<=0)return;
        var request;
        if (window.XMLHttpRequest && false) { // code for IE7+, Firefox, Chrome, Opera, Safari
           request=new XMLHttpRequest();
        }   
        else {// code for IE6, IE5
          request=new ActiveXObject("Msxml2.XMLHTTP"); // Microsoft.XMLHTTP
        }
        var fn=that.value;
        //fn="file:///"+that.value.replace("\\","/");
        request.open('get-2.html', fn, true);
        request.onreadystatechange = function() 
        {
          //alert(request.readystate+":"+request.status);
          if (request.readyState == 4 && (request.status == 200 || request.status==0)) {
              callback(request.responseText);
          }
        }
        request.send();
}
    
function readLocalFile(that,callback,encoding)
{   
    var reader = new FileReader();

    if(that.files && that.files[0]){
	     var reader = new FileReader();
	     reader.onload = function (e) {  
           //document.getElementById(txtTargetName).value=e.target.result;
           callback(e.target.result);
	     };//end onload()
       reader.readAsText(that.files[0],encoding);
    }//
} // readLocaFile

function readExcelFile(event,callback,fn,sheet) {
    var j=0;
    var opts="headers:false";
    if(sheet && sheet!="") {
        opts+=',sheetid:"' + sheet.toJson() + '"';
    }
    if(!fn)fn=document.getElementById('f1').value.split(/[\\\/]/)[document.getElementById('f1').value.split(/[\\\/]/).length-1];
    var ext="XLSX";
    if(fn.split('.').length>1) {
       ext=fn.split('.');
       ext=ext[ext.length-1].toUpperCase(); 
       if(ext==="XLS") ; else ext="XLSX";
    }
    //alert( 'SELECT * FROM ' + ext + '(?,{'+opts+'})');
    alasql('SELECT * FROM ' + ext + '(?,{'+opts+'})',[event],
         function(data){ 
             // data needs to be converted to CSV here.
             //data=JSON.parse(JSON.stringify(data,function(key,value){if(value===null||value===undefined)return "";return value;}));
             //alert(JSON.stringify(data,null,2));
             for(j=0;j<data.length;j++) {
                 if(_.isObject(data[j]) && _.isEmpty(data[j]))data.splice(j,1);          
             }
             alasql('SELECT * INTO CSV(null,{"utf8Bom":false}) FROM ?',[data], 
                      function(data){
                          //alert(data)
                          callback(data.replace(/"undefined"/g,''));
                      }
                   );
         });
}
function loadTextFile(f,callback,event)
{
    var fn=document.getElementById('f1').value.split(/[\\\/]/)[document.getElementById('f1').value.split(/[\\\/]/).length-1];
    var encoding = "";
    var sheetname = "";
    var elm = document.getElementById("txtEncoding");
    var htmlstring = "";
    //alert(fn);alert((fn.endsWith(".xlsx")));
    if (fn.toLowerCase().endsWith(".xlsx") || fn.toLowerCase().endsWith(".xls")) {
        htmlstring = "<input id=\"txtEncoding\" value=\"\" class=\"form-control\" title=\"Enter encoding for input file\" onchange=\"loadTextFile(document.getElementById('f1'),assignText)\">";
        if (elm && elm.nodeName && elm.nodeName.toLowerCase() == "select") {
            // switch to input tag
            if (elm.outerHTML) {
                elm.outerHTML = htmlstring;
            }
            else {
                $("#txtEncoding").replaceWith(htmlstring);
            }
        }
        elm = document.getElementById("txtEncoding");
        if (document && elm && elm.nodeName && elm.nodeName.toLowerCase() === "input") { // add support for sheetname
            sheetname = elm.value;
        }
        if(document && document.getElementById("spanEncoding"))document.getElementById("spanEncoding").innerHTML="SheetName";
        readExcelFile(event,callback,fn,sheetname);
    }
    else {
        if (elm && elm.nodeName && elm.nodeName.toLowerCase() == "input") {
            htmlstring = "<select id=\"txtEncoding\" class=\"form-control\" title=\"Enter encoding for input file\" onchange=\"loadTextFile(document.getElementById('f1'),assignText)\"><option value=\"\" selected=\"selected\">-Default-</option><option value=\"ISO-8859-1\">ISO-8859-1 (Latin No. 1)</option><option value=\"ISO-8859-2\">ISO-8859-2 (Latin No. 2)</option><option value=\"ISO-8859-3\">ISO-8859-3 (Latin No. 3)</option><option value=\"ISO-8859-4\">ISO-8859-4 (Latin No. 4)</option><option value=\"ISO-8859-5\">ISO-8859-5 (Latin/Cyrillic)</option><option value=\"ISO-8859-6\">ISO-8859-6 (Latin/Arabic)</option><option value=\"ISO-8859-7\">ISO-8859-7 (Latin/Greek)</option><option value=\"ISO-8859-8\">ISO-8859-8 (Latin/Hebrew)</option><option value=\"ISO-8859-9\">ISO-8859-9 (Latin No. 5)</option><option value=\"ISO-8859-13\">ISO-8859-13 (Latin No. 7)</option><option value=\"ISO-8859-15\">ISO-8859-15 (Latin No. 9)</option><option value=\"macintosh\">Mac OS Roman</option>\n<option value=\"UTF-8\">UTF-8</option><option value=\"UTF-16\">UTF-16</option><option value=\"UTF-16BE\">UTF-16 (Big-Endian)</option><option value=\"UTF-16LE\">UTF-16 (Little-Endian)</option><option value=\"UTF-32\">UTF-32</option>\n<option value=\"UTF-32BE\">UTF-32 (Big-Endian)</option><option value=\"UTF-32LE\">UTF-32 (Little-Endian)</option>\n<option value=\"windows-1250\">windows-1250 (Win East European)</option><option value=\"windows-1251\">windows-1251 (WinCyrillic)</option><option value=\"windows-1252\">windows-1252 (WinLatin-1)</option><option value=\"windows-1253\">windows-1253 (WinGreek)</option><option value=\"windows-1254\">windows-1254 (Win Turkish)</option><option value=\"windows-1255\">windows-1255 (Win Hebrew)</option><option value=\"windows-1256\">windows-1256 (Win Arabic)</option><option value=\"windows-1257\">windows-1257 (Win Baltic)</option><option value=\"windows-1258\">windows-1257 (Win Vietnamese)</option></select>";
            // switch to select tag
            if (elm.outerHTML) {
                elm.outerHTML = htmlstring;
            }
            else {
                $("#txtEncoding").replaceWith(htmlstring);
            }
        }
        elm = document.getElementById("txtEncoding");
        if (document && elm && elm.nodeName && elm.nodeName.toLowerCase() === "select") {
            encoding = elm.value;
        }
        if(document && document.getElementById("spanEncoding"))document.getElementById("spanEncoding").innerHTML="Encoding";
       (window.FileReader ? readLocalFile(f, callback, encoding) : ieReadLocalFile(f, callback, encoding));
       //(navigator.appName.search('Microsoft') > -1) ? ieReadLocalFile(f, callback, encoding) : readLocalFile(f, callback, encoding);

    }
}