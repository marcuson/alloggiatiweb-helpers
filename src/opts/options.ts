import { downloadObjectAsJson } from '../utils/download-utils';
import { askFileToRead } from '../utils/file-utils';

export interface Options {
  ocrSpaceApiKey: string;
  codes: string[][];
}

export async function getOpts(): Promise<Options> {
  return (await GM.getValue('options', undefined)) as Options;
}

export async function saveOpts(opts: Options) {
  await GM.setValue('options', opts);
}

export function exportOpts(opts: Options): void {
  downloadObjectAsJson(opts, 'alloggiatiweb-options');
}

export async function importOpts(): Promise<Options> {
  const optsStr = await askFileToRead();
  const opts = JSON.parse(optsStr) as Options;
  return opts;
}
