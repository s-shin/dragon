/* eslint-disable import/no-extraneous-dependencies, no-console */
import fs from 'fs';
import path from 'path';
import buffer from 'buffer';
import svgicons2svgfont from 'svgicons2svgfont';
import svg2ttf from 'svg2ttf';
import ttf2woff2 from 'ttf2woff2';

const PROJECT_DIR = path.resolve(__dirname, '..');
const ICON_SVG_DIR = path.resolve(PROJECT_DIR, './res/icon/svg');
const ASSETS_DIR = path.resolve(PROJECT_DIR, './assets');
const FONT_DIR = path.join(ASSETS_DIR, 'fonts');

function promisify(fn) {
  return new Promise((resolve, reject) => {
    fn((err, result) => { if (err) { reject(err); } else { resolve(result); } });
  });
}

function makeSvgFont(options) {
  const opts = Object.assign({
    fontName: 'app',
    baseCodepoint: 0x41,
    svgDir: null,
  }, options);
  return new Promise(async (resolve, reject) => {
    const characters = (await promisify(fs.readdir.bind(null, opts.svgDir)))
      .map((basename, i) => ({
        basename,
        path: path.join(opts.svgDir, basename),
        name: path.parse(basename).name,
        codepoint: opts.baseCodepoint + i,
      }));

    const svgStream = svgicons2svgfont({ fontName: opts.fontName, log: () => null });
    {
      let buf = new Buffer(0);
      svgStream.on('data', (chunk) => {
        buf = buffer.Buffer.concat([buf, chunk]);
      });
      svgStream.on('end', () => {
        resolve({ characters, buffer: buf });
      });
      svgStream.on('error', reject);
    }

    characters.forEach((c) => {
      const w = fs.createReadStream(c.path);
      w.metadata = {
        name: c.name,
        unicode: [String.fromCharCode(c.codepoint)],
      };
      svgStream.write(w);
    });

    svgStream.end();
  });
}

async function main() {
  console.log('Make svg font');
  const svg = await makeSvgFont({ svgDir: ICON_SVG_DIR });
  console.log('svg font => ttf');
  const ttf = svg2ttf(svg.buffer.toString(), {});
  const ttfBuf = new Buffer(ttf.buffer);
  console.log('ttf => woff2');
  const woffBuf = ttf2woff2(ttfBuf);
  console.log('Write woff2');
  await promisify(fs.writeFile.bind(null, path.join(FONT_DIR, 'app.woff2'), woffBuf));
  console.log('Write json');
  await promisify(fs.writeFile.bind(null, 'tmp/app.json', JSON.stringify(svg.characters), { encoding: 'utf8' }));
}

main().catch(e => console.error(`${e.message}\n${e.stack}`));
