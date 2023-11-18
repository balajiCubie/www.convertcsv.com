// Copyright 2018 - 2023

//Google Ads and Global Tag 
 (adsbygoogle = window.adsbygoogle || []).push({
    google_ad_client: "ca-pub-2674404638298268",
    enable_page_level_ads: true
  });

  window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'UA-110011798-1');

if(window.cookieconsent) {
// Cookie Consent
  window.addEventListener("load", function () {
      window.cookieconsent.initialise({
        "palette": {
            "popup": {
                "background": "#2C3F4D"
            },
            "button": {
                "background": "#ECF0F1",
            }
        },
        "content": {
            "href": "/PrivacyPolicy.htm"
        }
      })
  });
}

 //Enables Smooth Scroll
$('body').scrollspy({target: ".navbar", offset: 50});

$("#topNav a").on('click', function(event) {
  if (this.hash !== "") {

    event.preventDefault();
    var hash = this.hash;

    $('html, body').animate({
      scrollTop: $(hash).offset().top
    }, 800, function(){

      window.location.hash = hash;

    });

  }

});

//Tool navigation hover effect
$("a.list-group-item").hover(function(){
    $(this).find("i.fa-caret-right").css("color", "#529E66");
    }, function(){
    $(this).find("i.fa-caret-right").css("color", "#176332");
  });

// Handles reading drag drop files
function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.
    if(!files.length)return;
    var fn=files[0].name;
    var reader = new FileReader();  
    reader.onload = function(event) {            
         document.getElementById('txt1').value = event.target.result;
         if (document.getElementById("defaultTabLink")) document.getElementById("defaultTabLink").click();
         if(document.getElementById('btnRun'))document.getElementById('btnRun').click();
         setupSortDD();
    }
    var encoding="";
    if(document.getElementById('txtEncoding') && document.getElementById('txtEncoding').value !="")
       encoding= document.getElementById('txtEncoding').value;
    if (fn.toLowerCase().endsWith(".xlsx") || fn.toLowerCase().endsWith(".xls")) {
        reader.onload = function(event) {
          var data = event.target.result;
          var workbook = XLSX.read(data, { type: 'binary' });
               workbook.SheetNames.forEach(function(sheetName) {
                  // Here is your object
                  var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                  //var json_object = JSON.stringify(XL_row_object);
                  alasql('SELECT * INTO CSV(null,{"utf8Bom":false}) FROM ?',[XL_row_object], 
                      function(data){
                       document.getElementById('txt1').value = data.replace(/"undefined"/g,'');
                       if (document.getElementById("defaultTabLink")) document.getElementById("defaultTabLink").click();
                       if(document.getElementById('btnRun'))document.getElementById('btnRun').click();
                       setupSortDD();
                      }
                   );
       
           });
        }
        reader.readAsBinaryString(files[0]);
    }
    else {
        reader.readAsText(files[0],encoding);
    }
  }

  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
     if (evt.target.id == "file-drop") {
        evt.target.style.border = "3px dashed #176332";
     }
  }

  function handleDragEnter(evt) {
    evt.preventDefault();
    evt.stopPropagation();
     if (evt.target.id == "file-drop") {
        evt.target.style.border = "3px dashed #176332";
        evt.target.style.backgroundColor = "#ECF0F1";
     }
  }

  function handleDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    if ( evt.target.id == "file-drop" ) {
      evt.target.style.border = "2px dashed #283E4A";
      evt.target.style.backgroundColor = "#FAFEFF";
    }
  }

  // Setup the dnd listeners.
  var dropZone = document.getElementById('file-drop');
  if(dropZone) {
     dropZone.addEventListener('dragover', handleDragOver, false);
     dropZone.addEventListener('drop', handleFileSelect, false);
     dropZone.addEventListener('dragenter', handleDragEnter, false)
     dropZone.addEventListener('dragleave', handleDragLeave, false)
  }
  

// Form saving handler 
function loadForm(s)
{
   document.frm1.reset();
   var frms = JSON.parse(s);
   ddgFormSerializer.restoreForm(frms,
           function(fldObj)
           {
               if(fldObj.id==="txt1") {
                   parseAndOptions(CSV);
                   setupSortDD();
               }
           }
        );
     if(typeof assignText === 'function' && document.getElementById("txt1"))assignText(document.getElementById("txt1").value);
}
   
function saveForm()
{
    var url = window.location.pathname;
    var fn = decodeURIComponent(url.substring(url.lastIndexOf('/')+1));
    if(!fn)fn="savedform";
    fn=fn+".json";
    var frms=ddgFormSerializer.saveForm();
    saveOutput(JSON.stringify(frms,null,3),fn,"");
}

// Copy to clipboard 
function copyPaste(id)
{
    document.getElementById(id).select();
    document.execCommand('copy');

    var tooltip =  document.getElementById("clipboardToolTip");
    tooltip.innerHTML = "Copied!"
}

//Resets tool tip text 
function copyComplete() {
   var tooltip = document.getElementById("clipboardToolTip");
   tooltip.innerHTML = "Copy to Clipboard";
}

//Collapsible Option Menus Animation
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
     content.classList.toggle("border-active") 
  });
}

function addLineNumbersToCsv() {
    CSV.addSequence = true;
    parseAndOptions(CSV);
    document.getElementById('txt1').value = CSV.stringify("\n");
    CSV.addSequence = false;
    setupSortDD();
    document.getElementById('btnRun').click();
}
        
// TO DO Hide tool navbar on scroll on small screens 
