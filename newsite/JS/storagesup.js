var _0x510a=['checked','count','select-multiple','push','value','obj','getElementById','form','elements','options','selected','checkbox','radio','localStorage','setItem','csv','csvDelimiter','csvQuote','csvBackslash','has_html5_storage','getItem','csvCache','clear','getCacheCsv','setCacheCsv','saveForm','stringify','clearPressed','saveform','restoreForm','objCnt','reset','forms','length','getAttribute','true','type','button','file','submit','skipSave','name','elementPos'];(function(_0x44ed45,_0x413224){var _0x2699a9=function(_0x501e82){while(--_0x501e82){_0x44ed45['push'](_0x44ed45['shift']());}};_0x2699a9(++_0x413224);}(_0x510a,0x165));var _0x3714=function(_0x5d8b3e,_0x64cd41){_0x5d8b3e=_0x5d8b3e-0x0;var _0x84a69=_0x510a[_0x5d8b3e];return _0x84a69;};var storageSup={'has_html5_storage':function(){try{return _0x3714('0x0')in window&&window[_0x3714('0x0')];}catch(_0x40330b){return![];}},'putCsv':function(_0xa7aa97,_0x5c18ff,_0x1b605f,_0x5e29e4,_0x4e09e3){if(!this['has_html5_storage']()){return;}localStorage[_0x3714('0x1')](_0x3714('0x2'),_0xa7aa97);localStorage[_0x3714('0x1')]('csvChkHeader',_0x5c18ff);localStorage[_0x3714('0x1')](_0x3714('0x3'),_0x1b605f);localStorage['setItem'](_0x3714('0x4'),_0x5e29e4||'\x22');localStorage[_0x3714('0x1')](_0x3714('0x5'),_0x4e09e3);},'getCsv':function(){if(!this[_0x3714('0x6')]()){return'';}return localStorage[_0x3714('0x7')](_0x3714('0x2'))||'';},'setCacheCsv':function(_0x54a367){if(!this[_0x3714('0x6')]()){return;}localStorage[_0x3714('0x1')](_0x3714('0x8'),_0x54a367);},'getCacheCsv':function(){if(!this['has_html5_storage']()){return'N';}return localStorage[_0x3714('0x7')](_0x3714('0x8'));},'clearCsv':function(){localStorage[_0x3714('0x9')]();}};var ddgForm2Storage={'saveForm':function(_0x46011b){if(storageSup[_0x3714('0xa')]()==null){storageSup[_0x3714('0xb')]('N');}if(storageSup[_0x3714('0xa')]()!='Y'){return;}var _0x30c8d7=ddgFormSerializer[_0x3714('0xc')]();if(storageSup[_0x3714('0x6')]()){localStorage[_0x3714('0x1')](_0x46011b||'saveform',JSON[_0x3714('0xd')](_0x30c8d7));}},'restoreForm':function(_0x598230,_0x39a135){if(storageSup['getCacheCsv']()==null){storageSup[_0x3714('0xb')]('Y');}if(storageSup[_0x3714('0xa')]()!='Y'){return;}var _0x32057e=[];if(storageSup[_0x3714('0x6')]()&&sessionStorage[_0x3714('0x7')](_0x3714('0xe'))!='Y'){_0x32057e=JSON['parse'](localStorage[_0x3714('0x7')](_0x598230||_0x3714('0xf')));ddgFormSerializer[_0x3714('0x10')](_0x32057e,_0x39a135);}sessionStorage[_0x3714('0x1')](_0x3714('0xe'),'');}};var ddgFormSerializer={'saveForm':function(){var _0x6f46d8,_0x4ef2f8,_0x3f1af5;var _0x5db098=[];var _0x506814=[];var _0x4a6142={};var _0x242e4e;var _0x55cdee;this[_0x3714('0x11')][_0x3714('0x12')]();for(_0x4ef2f8=0x0;_0x4ef2f8<document[_0x3714('0x13')][_0x3714('0x14')];_0x4ef2f8++){_0x242e4e=document[_0x3714('0x13')][_0x4ef2f8];if(_0x242e4e[_0x3714('0x15')](_0x3714('0xc'))!==_0x3714('0x16')){continue;}for(_0x6f46d8=0x0;_0x6f46d8<document['forms'][_0x4ef2f8][_0x3714('0x14')];_0x6f46d8++){_0x55cdee=document[_0x3714('0x13')][_0x4ef2f8]['elements'][_0x6f46d8];if(_0x55cdee[_0x3714('0x17')]==_0x3714('0x18')){continue;}if(_0x55cdee[_0x3714('0x17')]==_0x3714('0x19')){continue;}if(_0x55cdee['type']==_0x3714('0x1a')){continue;}if(_0x55cdee['type']==_0x3714('0x12')){continue;}if(_0x55cdee[_0x3714('0x15')](_0x3714('0x1b'))==='true'){continue;}if(!('value'in _0x55cdee)){continue;}_0x4a6142={};_0x4a6142['form']=_0x4ef2f8;_0x4a6142[_0x3714('0x1c')]=_0x55cdee[_0x3714('0x1c')];_0x4a6142[_0x3714('0x17')]=_0x55cdee[_0x3714('0x17')];_0x4a6142['id']=_0x55cdee['id'];_0x4a6142[_0x3714('0x1d')]=_0x6f46d8;_0x4a6142['checked']=_0x55cdee[_0x3714('0x1e')];_0x4a6142['namePos']=this[_0x3714('0x11')][_0x3714('0x1f')](_0x4a6142[_0x3714('0x1c')]);_0x5db098=[];if(_0x55cdee['type']===_0x3714('0x20')){for(_0x3f1af5=0x0;_0x3f1af5<_0x55cdee[_0x3714('0x14')];_0x3f1af5++){if(_0x55cdee[_0x3f1af5]['selected']){_0x5db098[_0x3714('0x21')](_0x55cdee[_0x3f1af5][_0x3714('0x22')]);}}_0x4a6142[_0x3714('0x22')]=_0x5db098;}else{_0x4a6142[_0x3714('0x22')]=_0x55cdee[_0x3714('0x22')];}_0x506814[_0x3714('0x21')](_0x4a6142);}}return _0x506814;},'objCnt':{'obj':{},'count':function(_0x380cf1){if(!_0x380cf1)return 0x0;if(!(_0x380cf1 in this['obj'])){this['obj'][_0x380cf1]=-0x1;}this[_0x3714('0x23')][_0x380cf1]++;return this[_0x3714('0x23')][_0x380cf1];},'reset':function(){this[_0x3714('0x23')]={};}},'restoreForm':function(_0xf34aad,_0x1a0ac8){var _0x3e16de,_0x4b4288,_0x3e199f;var _0xa57da4;for(_0x3e16de=0x0;_0x3e16de<_0xf34aad[_0x3714('0x14')];_0x3e16de++){if(_0xf34aad[_0x3e16de]['id']){_0xa57da4=document[_0x3714('0x24')](_0xf34aad[_0x3e16de]['id']);}else if(_0xf34aad[_0x3e16de][_0x3714('0x1c')]){_0xa57da4=document[_0x3714('0x13')][_0xf34aad[_0x3e16de][_0x3714('0x25')]][_0xf34aad[_0x3e16de][_0x3714('0x1c')]];if(_0xa57da4[_0x3714('0x14')]){_0xa57da4=document['forms'][_0xf34aad[_0x3e16de][_0x3714('0x25')]][_0x3714('0x26')][_0xf34aad[_0x3e16de][_0x3714('0x1d')]];}}else{_0xa57da4=document[_0x3714('0x13')][_0xf34aad[_0x3e16de][_0x3714('0x25')]][_0x3714('0x26')][_0xf34aad[_0x3e16de][_0x3714('0x1d')]];}if(!_0xa57da4){continue;}switch(_0xf34aad[_0x3e16de][_0x3714('0x17')]){case _0x3714('0x20'):for(_0x4b4288=0x0;_0x4b4288<_0xa57da4[_0x3714('0x27')][_0x3714('0x14')];_0x4b4288++){for(_0x3e199f=0x0;_0x3e199f<_0xf34aad[_0x3e16de]['value'][_0x3714('0x14')];_0x3e199f++){if(_0xa57da4[_0x3714('0x27')][_0x4b4288][_0x3714('0x22')]==_0xf34aad[_0x3e16de][_0x3714('0x22')][_0x3e199f])_0xa57da4[_0x3714('0x27')][_0x4b4288][_0x3714('0x28')]=!![];}}break;case _0x3714('0x29'):case _0x3714('0x2a'):_0xa57da4[_0x3714('0x1e')]=_0xf34aad[_0x3e16de][_0x3714('0x1e')];break;default:_0xa57da4['value']=_0xf34aad[_0x3e16de]['value'];break;}if(_0x1a0ac8){_0x1a0ac8(_0xf34aad[_0x3e16de]);}}return!![];}};
