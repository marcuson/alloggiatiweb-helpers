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
