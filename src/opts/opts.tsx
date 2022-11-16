import globalCss from '../style.css';
import styles, { stylesheet } from '../style.module.css';
import { IPanelResult } from '@violentmonkey/ui';
import { getOpts, Options, saveOpts } from './options';

let panel: IPanelResult = undefined;
let panelOptions: Options = undefined;

export async function showOptions() {
  if (panel) {
    return;
  }

  panelOptions = await getOpts();
  if (!panelOptions) {
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

  panel = VM.getPanel({
    content: VM.m(
      <div>
        <form>
          <label for="ocrspaceapikey">OCR space API KEY</label>
          <input
            type="text"
            name="ocrspaceapikey"
            onchange={onOcrSpaceApiKeyChange}
            value={panelOptions.ocrSpaceApiKey}
          ></input>
          <br />

          <label for="codes">
            Codes (separated by spaces and carriage returns)
          </label>
          <br />
          <input
            class={styles.code}
            type="text"
            name="code_0_0"
            onchange={onCodeChange}
            value={panelOptions.codes[0][0]}
          ></input>
          <input
            class={styles.code}
            type="text"
            name="code_0_1"
            onchange={onCodeChange}
            value={panelOptions.codes[0][1]}
          ></input>
          <input
            class={styles.code}
            type="text"
            name="code_0_2"
            onchange={onCodeChange}
            value={panelOptions.codes[0][2]}
          ></input>
          <input
            class={styles.code}
            type="text"
            name="code_0_3"
            onchange={onCodeChange}
            value={panelOptions.codes[0][3]}
          ></input>
          <br />
          <input
            class={styles.code}
            type="text"
            name="code_1_0"
            onchange={onCodeChange}
            value={panelOptions.codes[1][0]}
          ></input>
          <input
            class={styles.code}
            type="text"
            name="code_1_1"
            onchange={onCodeChange}
            value={panelOptions.codes[1][1]}
          ></input>

          <input
            class={styles.code}
            type="text"
            name="code_1_2"
            onchange={onCodeChange}
            value={panelOptions.codes[1][2]}
          ></input>
          <input
            class={styles.code}
            type="text"
            name="code_1_3"
            onchange={onCodeChange}
            value={panelOptions.codes[1][3]}
          ></input>
          <br />
          <input
            class={styles.code}
            type="text"
            name="code_2_0"
            onchange={onCodeChange}
            value={panelOptions.codes[2][0]}
          ></input>
          <input
            class={styles.code}
            type="text"
            name="code_2_1"
            onchange={onCodeChange}
            value={panelOptions.codes[2][1]}
          ></input>
          <input
            class={styles.code}
            type="text"
            name="code_2_2"
            onchange={onCodeChange}
            value={panelOptions.codes[2][2]}
          ></input>
          <input
            class={styles.code}
            type="text"
            name="code_2_3"
            onchange={onCodeChange}
            value={panelOptions.codes[2][3]}
          ></input>
          <br />
          <input
            class={styles.code}
            type="text"
            name="code_3_0"
            onchange={onCodeChange}
            value={panelOptions.codes[3][0]}
          ></input>
          <input
            class={styles.code}
            type="text"
            name="code_3_1"
            onchange={onCodeChange}
            value={panelOptions.codes[3][1]}
          ></input>
          <input
            class={styles.code}
            type="text"
            name="code_3_2"
            onchange={onCodeChange}
            value={panelOptions.codes[3][2]}
          ></input>
          <input
            class={styles.code}
            type="text"
            name="code_3_3"
            onchange={onCodeChange}
            value={panelOptions.codes[3][3]}
          ></input>
        </form>
        <button onclick={onSaveBtnClick}>Save</button>
        <button onclick={onCancelBtnClick}>Cancel</button>
      </div>
    ),
    style: [globalCss, stylesheet].join('\n'),
  });

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
