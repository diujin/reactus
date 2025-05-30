//node
import path from 'node:path';
//modules
import tailwindcss from '@tailwindcss/vite';
//reactus
import { build } from 'reactus';

async function develop() {
  const cwd = process.cwd();
  const engine = build({
    cwd,
    plugins: [ tailwindcss() ],
    //path where to save assets (css, images, etc)
    assetPath: path.join(cwd, 'public/assets'),
    //path where to save and load (live) the client scripts (js)
    clientPath: path.join(cwd, 'public/client'),
    //path where to save and load (live) the server script (js)
    pagePath: path.join(cwd, '.build/pages')
  });
  
  await engine.set('@/pages/home');
  await engine.set('@/pages/about');
  await engine.set('reactus-with-plugin/pages/how');
  await engine.set('reactus-with-plugin/pages/contact');

  const responses = [
    ...await engine.buildAllClients(),
    ...await engine.buildAllAssets(),
    ...await engine.buildAllPages()
  ].map(response => {
    const results = response.results;
    if (typeof results?.contents === 'string') {
      results.contents = results.contents.substring(0, 100) + ' ...';
    }
    return results;
  });

  //console.log(responses);
  //fix for unused variable :)
  if (responses.length) return;
}

develop().catch(e => {
  console.error(e);
  process.exit(1);
});