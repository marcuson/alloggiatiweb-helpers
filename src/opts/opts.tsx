import globalCss from '../style.css';
import styles, { stylesheet } from '../style.module.css';
import { IPanelResult } from '@violentmonkey/ui';
import { exportOpts, getOpts, importOpts, Options, saveOpts } from './options';

const CODE_ROWS = 4;
const CODE_COLS = 4;

let panel: IPanelResult = undefined;
let panelOptions: Options = undefined;

let ocrSpaceApiKeyInput: HTMLInputElement;
// FIXME: Add init based on rows and cols constants
const codeInputs: HTMLInputElement[][] = [[], [], [], []];

export async function showOptions() {
  if (panel) {
    return;
  }

  panelOptions = await getOpts();
  if (!panelOptions) {
    // FIXME: Add init based on rows and cols constants
    panelOptions = {
      codes: [
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
      ],
      ocrSpaceApiKey: '',
    };
  }

  ocrSpaceApiKeyInput = VM.m(
    <input
      type="text"
      name="ocrspaceapikey"
      onchange={onOcrSpaceApiKeyChange}
      value={panelOptions.ocrSpaceApiKey}
    ></input>
  ) as HTMLInputElement;

  const codeInputsFlat = [];

  for (let x = 0; x < CODE_COLS; x++) {
    codeInputsFlat.push(<br></br>);

    for (let y = 0; y < CODE_ROWS; y++) {
      codeInputs[x][y] = VM.m(
        <input
          class={styles.code}
          type="text"
          name={`code_${x}_${y}`}
          onchange={onCodeChange}
          value={panelOptions.codes[x][y]}
        ></input>
      ) as HTMLInputElement;
      codeInputsFlat.push(codeInputs[x][y]);
    }
  }

  panel = VM.getPanel({
    content: VM.m(
      <div>
        <form>
          <label for="ocrspaceapikey">OCR space API KEY</label>
          {ocrSpaceApiKeyInput}
          <br />

          <label for="codes">Codes</label>
          {codeInputsFlat}
        </form>
        <button onclick={onSaveBtnClick}>Save</button>
        <button onclick={onCancelBtnClick}>Cancel</button>
        <hr></hr>
        <button onclick={onExportBtnClick}>Export</button>
        <button onclick={onImportBtnClick}>Import</button>
      </div>
    ),
    style: [globalCss, stylesheet].join('\n'),
  });

  writeOptionsIntoInputs();

  panel.wrapper.style.top = '100px';
  panel.wrapper.style.left = '100px';
  panel.show();
}

function onOcrSpaceApiKeyChange(e: Event) {
  e.preventDefault();
  const inp = e.currentTarget as HTMLInputElement;
  panelOptions.ocrSpaceApiKey = inp.value;
}

function onCodeChange(e: Event) {
  e.preventDefault();
  const inp = e.currentTarget as HTMLInputElement;
  const x = inp.name.substring('code_'.length, 'code_'.length + 1);
  const y = inp.name.substring('code_X_'.length, 'code_X_'.length + 1);
  panelOptions.codes[x][y] = inp.value;
}

function onExportBtnClick(e: Event) {
  e.preventDefault();
  exportOpts(panelOptions);
}

async function onImportBtnClick(e: Event) {
  e.preventDefault();
  panelOptions = await importOpts();
  writeOptionsIntoInputs();
}

function writeOptionsIntoInputs() {
  for (let x = 0; x < CODE_COLS; x++) {
    for (let y = 0; y < CODE_ROWS; y++) {
      codeInputs[x][y].value = panelOptions.codes[x][y];
    }
  }
}

function onCancelBtnClick(e: Event) {
  e.preventDefault();
  closePanel();
}

function closePanel() {
  panel.hide();
  panel.dispose();
  panel = undefined;
  panelOptions = undefined;
}

async function onSaveBtnClick(e: Event) {
  e.preventDefault();
  console.debug('Options to save:', panelOptions);
  await saveOpts(panelOptions);
  closePanel();
}
