// ==UserScript==
// @name        SubsetFont
// @namespace   w3c
// @description Generate subsetted fonts to support charmod
// @version     1
// @include     *
// @grant       none
// ==/UserScript==

// author = addison@lab126.com

var text = document.body.innerHTML;

var charsToGet = [];
var request = '';

var re = new RegExp("[\u0100-\uffff]", 'g');

var unique = 0;

var m;
while ((m = re.exec(text)) !== null) {
  var item = m[0];
  if (charsToGet.length === 0 || charsToGet.indexOf(item) < 0) {
    charsToGet.push(item);
    request = request + item;
    unique++;
  }
}


//alert(re.test(text) + ' ' + re + ' ' + text.substring(0,100));

var mypanel = document.getElementsByClassName('subsetFont')[0];
  
if (!mypanel) {
  mypanel = document.createElement('div');
}
mypanel.innerHTML = '';
  
mypanel.setAttribute('id', 'subsetFont');
mypanel.setAttribute('class', "subsetFont");
mypanel.style.position = 'fixed';
mypanel.style.bottom   = 0;
mypanel.style.right    = 0;
mypanel.style.overflow = 'auto';
mypanel.style.inset    = '0 0 0 10px';
mypanel.style.zIndex   = '1001'; // make it appear in front of most things

var pre = document.createElement('pre');
pre.appendChild(document.createTextNode('count: ' + unique));
mypanel.appendChild(pre);
pre = document.createElement('pre');
pre.appendChild(document.createTextNode(request));
mypanel.appendChild(pre);

document.body.appendChild(mypanel);