// ==UserScript==
// @name        SubsetFont
// @namespace   w3c
// @description Generate subsetted fonts to support charmod
// @version     1
// @include     *
// @grant       none
// ==/UserScript==

// author = addison@amazon.com

var text = document.body.innerHTML;

var charsToGet = [];
var request = '';

var re = new RegExp("([\u0100-\ud7ff\ue000-\uffff]|[\ud800-\udbff][\udc00-\udfff])", 'g');

var unique = 0;

var m;
while ((m = re.exec(text)) !== null) {
  var item = m[0];
  if (charsToGet.length === 0 || charsToGet.indexOf(item) < 0) {
    charsToGet.push(item);
    unique++;
  }
}
charsToGet.sort();

for (var i = 0; i < charsToGet.length; i++) {
	request = request + charsToGet[i];
}

var mypanel = document.getElementsByClassName('subsetFont')[0];
  
if (!mypanel) {
  mypanel = document.createElement('div');
}
mypanel.innerHTML = '';
  
mypanel.setAttribute('id', 'subsetFont');
mypanel.setAttribute('class', "subsetFont");
mypanel.style.position   = 'fixed';
mypanel.style.bottom     = 0;
mypanel.style.right      = 0;
mypanel.style.background = 'white';
mypanel.style.border     = '1px solid black';
mypanel.style.overflow   = 'auto';
mypanel.style.inset      = '0 0 0 10px';
mypanel.style.zIndex     = '1001'; // make it appear in front of most things

var pre = document.createElement('pre');
pre.appendChild(document.createTextNode('count: ' + unique));
mypanel.appendChild(pre);
pre = document.createElement('pre');
pre.appendChild(document.createTextNode(request));
mypanel.appendChild(pre);

document.body.appendChild(mypanel);
