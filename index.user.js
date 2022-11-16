
// ==UserScript==
// @name        Helper for AlloggiatiWeb
// @namespace   marcuson
// @description Helpers for Alloggiati Web.
// @match       https://alloggiatiweb.poliziadistato.it/AlloggiatiWeb/SecurityCODS.aspx
// @version     1.1.0
// @author      marcuson
// @downloadURL https://marcuson.github.io/alloggiatiweb-helpers/index.user.js
// @supportURL  https://github.com/marcuson/alloggiatiweb-helpers/issues
// @homepageURL https://github.com/marcuson/alloggiatiweb-helpers
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM_addStyle
// ==/UserScript==

(function () {
'use strict';

async function getOpts() {
  return await GM.getValue('options', undefined);
}
async function saveOpts(opts) {
  await GM.setValue('options', opts);
}

var css_248z = "";

var styles = {"code":"style-module_code__ds1Ud","error":"style-module_error__ABgWN","warning":"style-module_warning__nASzn","success":"style-module_success__ZG5Xf"};
var stylesheet=".style-module_code__ds1Ud{max-width:100px}.style-module_error__ABgWN{color:red}.style-module_warning__nASzn{color:orange}.style-module_success__ZG5Xf{color:green}";

let panel = undefined;
let panelOptions = undefined;
async function showOptions() {
  if (panel) {
    return;
  }
  panelOptions = await getOpts();
  if (!panelOptions) {
    panelOptions = {
      codes: [['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', '']],
      ocrSpaceApiKey: ''
    };
  }
  panel = VM.getPanel({
    content: VM.m(VM.h("div", null, VM.h("form", null, VM.h("label", {
      for: "ocrspaceapikey"
    }, "OCR space API KEY"), VM.h("input", {
      type: "text",
      name: "ocrspaceapikey",
      onchange: onOcrSpaceApiKeyChange,
      value: panelOptions.ocrSpaceApiKey
    }), VM.h("br", null), VM.h("label", {
      for: "codes"
    }, "Codes (separated by spaces and carriage returns)"), VM.h("br", null), VM.h("input", {
      class: styles.code,
      type: "text",
      name: "code_0_0",
      onchange: onCodeChange,
      value: panelOptions.codes[0][0]
    }), VM.h("input", {
      class: styles.code,
      type: "text",
      name: "code_0_1",
      onchange: onCodeChange,
      value: panelOptions.codes[0][1]
    }), VM.h("input", {
      class: styles.code,
      type: "text",
      name: "code_0_2",
      onchange: onCodeChange,
      value: panelOptions.codes[0][2]
    }), VM.h("input", {
      class: styles.code,
      type: "text",
      name: "code_0_3",
      onchange: onCodeChange,
      value: panelOptions.codes[0][3]
    }), VM.h("br", null), VM.h("input", {
      class: styles.code,
      type: "text",
      name: "code_1_0",
      onchange: onCodeChange,
      value: panelOptions.codes[1][0]
    }), VM.h("input", {
      class: styles.code,
      type: "text",
      name: "code_1_1",
      onchange: onCodeChange,
      value: panelOptions.codes[1][1]
    }), VM.h("input", {
      class: styles.code,
      type: "text",
      name: "code_1_2",
      onchange: onCodeChange,
      value: panelOptions.codes[1][2]
    }), VM.h("input", {
      class: styles.code,
      type: "text",
      name: "code_1_3",
      onchange: onCodeChange,
      value: panelOptions.codes[1][3]
    }), VM.h("br", null), VM.h("input", {
      class: styles.code,
      type: "text",
      name: "code_2_0",
      onchange: onCodeChange,
      value: panelOptions.codes[2][0]
    }), VM.h("input", {
      class: styles.code,
      type: "text",
      name: "code_2_1",
      onchange: onCodeChange,
      value: panelOptions.codes[2][1]
    }), VM.h("input", {
      class: styles.code,
      type: "text",
      name: "code_2_2",
      onchange: onCodeChange,
      value: panelOptions.codes[2][2]
    }), VM.h("input", {
      class: styles.code,
      type: "text",
      name: "code_2_3",
      onchange: onCodeChange,
      value: panelOptions.codes[2][3]
    }), VM.h("br", null), VM.h("input", {
      class: styles.code,
      type: "text",
      name: "code_3_0",
      onchange: onCodeChange,
      value: panelOptions.codes[3][0]
    }), VM.h("input", {
      class: styles.code,
      type: "text",
      name: "code_3_1",
      onchange: onCodeChange,
      value: panelOptions.codes[3][1]
    }), VM.h("input", {
      class: styles.code,
      type: "text",
      name: "code_3_2",
      onchange: onCodeChange,
      value: panelOptions.codes[3][2]
    }), VM.h("input", {
      class: styles.code,
      type: "text",
      name: "code_3_3",
      onchange: onCodeChange,
      value: panelOptions.codes[3][3]
    })), VM.h("button", {
      onclick: onSaveBtnClick
    }, "Save"), VM.h("button", {
      onclick: onCancelBtnClick
    }, "Cancel"))),
    style: [css_248z, stylesheet].join('\n')
  });
  panel.wrapper.style.top = '100px';
  panel.wrapper.style.left = '100px';
  panel.show();
}
function onOcrSpaceApiKeyChange(e) {
  e.preventDefault();
  const inp = e.currentTarget;
  panelOptions.ocrSpaceApiKey = inp.value;
}
function onCodeChange(e) {
  e.preventDefault();
  const inp = e.currentTarget;
  const x = inp.name.substring('code_'.length, 'code_'.length + 1);
  const y = inp.name.substring('code_X_'.length, 'code_X_'.length + 1);
  panelOptions.codes[x][y] = inp.value;
}
function onCancelBtnClick(e) {
  e.preventDefault();
  closePanel();
}
function closePanel() {
  panel.hide();
  panel.dispose();
  panel = undefined;
  panelOptions = undefined;
}
async function onSaveBtnClick(e) {
  e.preventDefault();
  console.debug('Options to save:', panelOptions);
  await saveOpts(panelOptions);
  closePanel();
}

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

function toast(type, msg, options) {
  const clz = styles[type];
  const st = [(options == null ? void 0 : options.style) || '', css_248z, stylesheet].join('\n');
  return VM.showToast(VM.h("div", {
    class: clz
  }, VM.h("p", null, msg)), _extends({}, options, {
    style: st
  }));
}

const BOXES_LENGTH = 8;
const BOXES_LENGTH_HALF = BOXES_LENGTH / 2;

function getBase64ImagePngFromCanvas(canvas) {
  const dataURL = canvas.toDataURL('image/png');
  return dataURL;
}
function getCanvasFromImg(imgElem) {
  const canvas = document.createElement('canvas');
  canvas.width = imgElem.naturalWidth;
  canvas.height = imgElem.naturalHeight;
  canvas.getContext('2d').drawImage(imgElem, 0, 0);
  return canvas;
}
async function ocr(apiKey, base64Img, ocrEngine) {
  const fd = new FormData();
  fd.append('base64Image', base64Img);
  fd.append('language', 'ita');
  fd.append('scale', 'true');
  fd.append('isTable', 'true');
  fd.append('OCREngine', ocrEngine || '2');
  return await fetch('https://api.ocr.space/parse/image', {
    method: 'POST',
    headers: {
      apikey: apiKey
    },
    body: fd
  }).then(res => {
    if (!res.ok) {
      throw new Error(`Error during OCR API call: status code ${res.status}.`);
    }
    return res.json();
  }).then(json => json.ParsedResults && json.ParsedResults.length > 0 ? json.ParsedResults[0] : {
    ParsedText: ''
  }).then(r => r.ParsedText);
}

let showOptionsBtn;
let showCorrectCodeBtn;
let correctCodeMsgDiv;
let msgDiv;
function augmentCodesPage() {
  console.info('CODS page of Alloggiati Web detected, inject to DOM');
  addMsgs();
  addButtons();
}
function addButtons() {
  showCorrectCodeBtn = VM.m(VM.h("button", {
    class: "btn btn-primary btn-block center",
    style: "width:70%;",
    onclick: onShowCorrectCodeBtnClick
  }, "Get correct code"));
  showOptionsBtn = VM.m(VM.h("button", {
    class: "btn btn-primary btn-block center",
    style: "width:70%;",
    onclick: onShowOptionsBtnClick
  }, "Options"));
  const title = document.querySelector('#Titolo');
  title.after(showCorrectCodeBtn);
  title.after(showOptionsBtn);
}
function addMsgs() {
  msgDiv = VM.m(VM.h("div", null));
  correctCodeMsgDiv = VM.m(VM.h("div", null));
  const title = document.querySelector('#Titolo');
  title.after(correctCodeMsgDiv);
  title.after(msgDiv);
}
async function onShowCorrectCodeBtnClick(e) {
  console.debug('Show correct code btn clicked');
  e.preventDefault();
  await showCorrectCode();
}
function onShowOptionsBtnClick(e) {
  console.debug('Show options btn clicked');
  e.preventDefault();
  showOptions();
}
function showMsg(msg, divEl) {
  const actualPar = divEl || msgDiv;
  actualPar.textContent = msg;
}
function getEmptyBoxes() {
  const boxes = document.querySelectorAll('.Seccasella.Secp0');
  console.debug('Found boxes:', boxes);
  if (boxes.length !== BOXES_LENGTH) {
    throw new Error(`Boxes is not of length ${BOXES_LENGTH}!`);
  }
  const emptyBoxes = [];
  boxes.forEach((x, i) => {
    if (x.textContent === 'X') {
      return;
    }
    emptyBoxes.push({
      elem: x,
      boxGroupIdx: Math.floor(i / BOXES_LENGTH_HALF),
      groupElementIdx: i % BOXES_LENGTH_HALF
    });
  });
  return emptyBoxes;
}
async function getGroupIds(options) {
  console.debug('Get groups indexes as base64 image');
  const groupsB64 = getBase64ImagePngFromCanvas(getCanvasFromImg(document.querySelector('img.SecGruppi.pointer')));
  const groupsText = await ocr(options.ocrSpaceApiKey, groupsB64);
  console.debug('Parsed text from groups indexes is:', groupsText);
  return groupsText.toLowerCase().replace(/gruppo/g, '').replace(/\r\n/g, ' ').replace(/\s+/g, ' ').trim().split(' ').map(x => parseInt(x));
}
function getCorrectCode(options, groupIds, emptyBoxes) {
  const codesFlat = options.codes.flatMap(x => x);
  return emptyBoxes.map((x, i) => {
    const codeId = groupIds[x.boxGroupIdx];
    const code = codesFlat[codeId - 1];
    console.debug(`Code for emptyBox with index ${i} (codeId ${codeId}) is ${code}`);
    const digit = code.charAt(x.groupElementIdx);
    console.debug(`Digit for index ${i} is ${digit}`);
    return digit;
  });
}
async function showCorrectCode() {
  const options = await getOpts();
  if (!options) {
    toast('error', 'Configure options first!');
    return;
  }
  try {
    showMsg('Getting group ids...');
    const groupIds = await getGroupIds(options);
    console.info('Group ids are:', groupIds);
    showMsg('Getting empty boxes...');
    const emptyBoxes = getEmptyBoxes();
    console.info('Empty boxes info:', emptyBoxes);
    showMsg('Getting correct code...');
    const correctCode = getCorrectCode(options, groupIds, emptyBoxes);
    console.info('Correct code is:', correctCode);
    showMsg(`Correct code is: ${correctCode.join('')}`, correctCodeMsgDiv);
  } catch (e) {
    /** @type {Error} */
    const err = e;
    showMsg('Error: ' + err.message);
    throw e;
  }
}

// import CSS
document.head.append(VM.m(VM.h("style", null, css_248z)));
document.head.append(VM.m(VM.h("style", null, stylesheet)));

// init app
augmentCodesPage();

})();
