import { getOpts, Options } from '../opts/options';
import { showOptions } from '../opts/opts';
import { toast } from '../toast/toast';
import { BOXES_LENGTH, BOXES_LENGTH_HALF } from './const';
import { EmptyBox } from './empty-box';
import {
  getBase64ImagePngFromCanvas,
  getCanvasFromImg,
  ocr,
} from './img-utils';

let showOptionsBtn: HTMLButtonElement;
let showCorrectCodeBtn: HTMLButtonElement;
let correctCodeMsgDiv: HTMLDivElement;
let msgDiv: HTMLDivElement;

export function augmentCodesPage() {
  console.info('CODS page of Alloggiati Web detected, inject to DOM');
  addMsgs();
  addButtons();
}

function addButtons() {
  showCorrectCodeBtn = VM.m(
    <button
      class="btn btn-primary btn-block center"
      style="width:70%;"
      onclick={onShowCorrectCodeBtnClick}
    >
      Get correct code
    </button>
  ) as HTMLButtonElement;

  showOptionsBtn = VM.m(
    <button
      class="btn btn-primary btn-block center"
      style="width:70%;"
      onclick={onShowOptionsBtnClick}
    >
      Options
    </button>
  ) as HTMLButtonElement;

  const title = document.querySelector('#Titolo');
  title.after(showCorrectCodeBtn);
  title.after(showOptionsBtn);
}

function addMsgs() {
  msgDiv = VM.m(<div></div>) as HTMLDivElement;
  correctCodeMsgDiv = VM.m(<div></div>) as HTMLDivElement;
  const title = document.querySelector('#Titolo');
  title.after(correctCodeMsgDiv);
  title.after(msgDiv);
}

async function onShowCorrectCodeBtnClick(e: Event) {
  console.debug('Show correct code btn clicked');
  e.preventDefault();
  await showCorrectCode();
}

function onShowOptionsBtnClick(e: Event) {
  console.debug('Show options btn clicked');
  e.preventDefault();
  showOptions();
}

function showMsg(msg: string, divEl?: HTMLDivElement) {
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
      groupElementIdx: i % BOXES_LENGTH_HALF,
    });
  });

  return emptyBoxes;
}

async function getGroupIds(options: Options): Promise<number[]> {
  console.debug('Get groups indexes as base64 image');
  const groupsB64 = getBase64ImagePngFromCanvas(
    getCanvasFromImg(document.querySelector('img.SecGruppi.pointer'))
  );

  const groupsText = await ocr(options.ocrSpaceApiKey, groupsB64);
  console.debug('Parsed text from groups indexes is:', groupsText);

  return groupsText
    .toLowerCase()
    .replace(/gruppo/g, '')
    .replace(/\r\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((x) => parseInt(x));
}

function getCorrectCode(
  options: Options,
  groupIds: number[],
  emptyBoxes: EmptyBox[]
) {
  const codesFlat = options.codes.flatMap((x) => x);
  return emptyBoxes.map((x, i) => {
    const codeId = groupIds[x.boxGroupIdx];
    const code = codesFlat[codeId - 1];
    console.debug(
      `Code for emptyBox with index ${i} (codeId ${codeId}) is ${code}`
    );
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
