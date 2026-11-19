import { zip, type Zippable } from 'fflate';

export interface ZipEntry {
  /** Path inside the ZIP, e.g. "02 Products/NovaStep AeroRun/novastep-aerorun-pink-img.jpg". */
  path: string;
  /** URL to fetch the file from (same origin). */
  url: string;
}

/**
 * Builds a ZIP in the browser and triggers a download. Images are already compressed, so
 * entries are stored (level 0) — fast, and the ZIP is about the same size as the files.
 */
export async function downloadZip(zipName: string, entries: ZipEntry[], onProgress?: (done: number, total: number) => void) {
  const files: Zippable = {};
  let done = 0;
  await Promise.all(
    entries.map(async (e) => {
      const res = await fetch(e.url);
      if (!res.ok) throw new Error(`Failed to fetch ${e.url} (${res.status})`);
      files[e.path] = [new Uint8Array(await res.arrayBuffer()), { level: 0 }];
      onProgress?.(++done, entries.length);
    }),
  );
  const data = await new Promise<Uint8Array>((resolve, reject) => zip(files, (err, out) => (err ? reject(err) : resolve(out))));
  const url = URL.createObjectURL(new Blob([data as Uint8Array<ArrayBuffer>], { type: 'application/zip' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = zipName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
