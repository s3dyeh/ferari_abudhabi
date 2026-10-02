// Run against the local Chromium session launched by agent-browser.
// node scripts/verify-browser.mjs <CDP websocket URL> [app URL]
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const endpoint = new URL(process.argv[2]);
const appUrl = process.argv[3] || 'http://127.0.0.1:4200/';
const pages = await fetch(`http://${endpoint.host}/json/list`).then((r) => r.json());
const target = pages.find((page) => page.type === 'page' && page.url.startsWith(appUrl));
if (!target) throw new Error('Open the app with agent-browser first.');
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve) => socket.addEventListener('open', resolve, { once: true }));
let nextId = 0;
const pending = new Map();
const errors = [];
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === 'Runtime.exceptionThrown')
    errors.push(message.params.exceptionDetails.text);
  const callback = pending.get(message.id);
  if (callback) {
    pending.delete(message.id);
    message.error
      ? callback.reject(new Error(JSON.stringify(message.error)))
      : callback.resolve(message.result);
  }
});
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.exceptionDetails)
    throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
}
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function until(expression) {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await evaluate(expression)) return;
    await sleep(100);
  }
  throw new Error(`Timed out: ${expression}`);
}
async function key(key, modifiers = 0) {
  const windowsVirtualKeyCode = key === 'Escape' ? 27 : key === 'Tab' ? 9 : 0;
  await send('Input.dispatchKeyEvent', {
    type: 'keyDown',
    key,
    code: key,
    modifiers,
    windowsVirtualKeyCode,
  });
  await send('Input.dispatchKeyEvent', {
    type: 'keyUp',
    key,
    code: key,
    modifiers,
    windowsVirtualKeyCode,
  });
}
const checks = [];
function check(name, result) {
  checks.push({ name, passed: !!result });
  if (!result) throw new Error(`Failed: ${name}`);
}
const output = resolve('artifacts/verification');
await mkdir(output, { recursive: true });
async function screenshot(name) {
  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  await writeFile(resolve(output, `${name}.png`), Buffer.from(data, 'base64'));
}

try {
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Emulation.setTimezoneOverride', { timezoneId: 'America/Los_Angeles' });
  await send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-color-scheme', value: 'light' }],
  });
  await send('Page.navigate', { url: appUrl });
  await until(`document.querySelector('.view-switch button:last-child')?.disabled === false`);
  check(
    'Detailed car is deferred until the ride is requested',
    await evaluate(
      `performance.getEntriesByType('resource').every(resource => !resource.name.endsWith('/rb6.glb'))`,
    ),
  );
  check(
    'Clock stays in Amman in a Los Angeles browser',
    await evaluate(
      `(() => { const actual=document.querySelector('app-amman-clock time').textContent.trim(); const expected=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Amman',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).format(new Date()); const seconds=t=>t.split(':').reduce((total,part)=>total*60+Number(part),0); const difference=Math.abs(seconds(actual)-seconds(expected)); return Math.min(difference,86400-difference)<=2; })()`,
    ),
  );

  for (const [name, width, height] of [
    ['desktop', 1440, 900],
    ['tablet', 768, 1024],
    ['mobile', 390, 844],
    ['small-mobile', 320, 568],
    ['landscape', 844, 390],
    ['zoom-equivalent', 720, 450],
  ]) {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await evaluate(`document.querySelector('.view-switch button:first-child').click()`);
    await sleep(750);
    check(
      `${name}: no horizontal overflow`,
      await evaluate('document.documentElement.scrollWidth <= innerWidth'),
    );
    check(
      `${name}: sun and controls remain in viewport`,
      await evaluate(
        `Array.from(document.querySelectorAll('main button')).every(b=>{const r=b.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth+1&&r.top>=0&&r.bottom<=innerHeight+1;})`,
      ),
    );
    await screenshot(name);
    if (width <= 600 || (width <= 900 && height <= 600)) {
      const initialTop = await evaluate(
        `document.querySelector('app-sun-button').getBoundingClientRect().top`,
      );
      await evaluate(`document.querySelector('.view-switch button:last-child').click()`);
      await sleep(100);
      const intermediateTop = await evaluate(
        `document.querySelector('app-sun-button').getBoundingClientRect().top`,
      );
      await sleep(700);
      const finalTop = await evaluate(
        `document.querySelector('app-sun-button').getBoundingClientRect().top`,
      );
      check(
        `${name}: sun moves smoothly upwards`,
        intermediateTop < initialTop && intermediateTop > finalTop,
      );
      check(
        `${name}: ride sun sits below clock`,
        await evaluate(
          `(() => { const sun=document.querySelector('app-sun-button').getBoundingClientRect(); const clock=document.querySelector('app-amman-clock').getBoundingClientRect(); return sun.top >= clock.bottom && Math.abs(sun.right-clock.right)<2; })()`,
        ),
      );
      await screenshot(`${name}-ride`);
    }
    await evaluate(`document.querySelector('app-sun-button button').click()`);
    await sleep(500);
    check(
      `${name}: native modal opens`,
      await evaluate(`document.querySelector('dialog').matches(':modal')`),
    );
    check(
      `${name}: overlay has no horizontal overflow`,
      await evaluate(
        `document.querySelector('.portfolio-scroll').scrollWidth <= document.querySelector('.portfolio-scroll').clientWidth`,
      ),
    );
    await screenshot(`${name}-portfolio`);
    await evaluate(`document.querySelector('.close-button').focus()`);
    await key('Tab', 8);
    check(
      `${name}: backward tab stays inside dialog`,
      await evaluate(`document.querySelector('dialog').contains(document.activeElement)`),
    );
    await key('Tab');
    check(
      `${name}: forward tab returns to close`,
      await evaluate(`document.activeElement.classList.contains('close-button')`),
    );
    await key('Escape');
    await sleep(150);
    check(
      `${name}: Escape returns focus to sun`,
      await evaluate(
        `!document.querySelector('dialog').open && document.activeElement === document.querySelector('app-sun-button button')`,
      ),
    );
  }

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await evaluate(`document.querySelector('.view-switch button:last-child').click()`);
  await sleep(1000);
  check(
    'Ride mode activates',
    await evaluate(`document.querySelector('main').classList.contains('riding')`),
  );
  await screenshot('ride');
  await evaluate(`document.querySelector('.view-switch button:first-child').click()`);
  check(
    'Overview returns without manual pause controls',
    await evaluate(
      `!document.querySelector('main').classList.contains('riding') && !document.querySelector('.pause-control,.precision-control')`,
    ),
  );

  await send('Emulation.setEmulatedMedia', {
    features: [
      { name: 'prefers-reduced-motion', value: 'reduce' },
      { name: 'prefers-color-scheme', value: 'dark' },
    ],
  });
  await send('Page.navigate', { url: appUrl });
  await until(`document.querySelector('.view-switch button:last-child')?.disabled === false`);
  check(
    'Reduced motion removes sun transition',
    await evaluate(
      `getComputedStyle(document.querySelector('app-sun-button')).transitionDuration==='0s'`,
    ),
  );
  await evaluate(`document.querySelector('app-sun-button button').click()`);
  check(
    'Reduced motion removes reveal animation',
    await evaluate(`getComputedStyle(document.querySelector('dialog')).animationName==='none'`),
  );
  await screenshot('dark-portfolio');
  for (let imageIndex = 0; imageIndex < 4; imageIndex++) {
    await evaluate(
      `document.querySelectorAll('.project-image img')[${imageIndex}].scrollIntoView({block:'center'})`,
    );
    await until(
      `document.querySelectorAll('.project-image img')[${imageIndex}].complete && document.querySelectorAll('.project-image img')[${imageIndex}].naturalWidth>0`,
    );
  }
  check('All project previews load', true);
  check(
    'Close control stays visible while scrolling project details',
    await evaluate(
      `document.querySelector('.close-button').getBoundingClientRect().top >= 0 && document.querySelector('dialog').scrollTop === 0`,
    ),
  );
  await screenshot('project-details');
  await key('Escape');

  await evaluate(
    `document.querySelector('canvas').dispatchEvent(new Event('webglcontextlost',{cancelable:true}))`,
  );
  check(
    'Renderer failure shows fallback',
    await evaluate(`!!document.querySelector('.scene-notice')`),
  );
  await evaluate(`document.querySelector('app-sun-button button').click()`);
  check(
    'Portfolio remains available after renderer failure',
    await evaluate(`document.querySelector('dialog').open`),
  );
  check('No uncaught browser errors', errors.length === 0);
  console.log(JSON.stringify({ passed: checks.length, checks, errors }, null, 2));
} finally {
  await writeFile(resolve(output, 'report.json'), JSON.stringify({ checks, errors }, null, 2));
  await send('Emulation.setTimezoneOverride', { timezoneId: '' });
  await send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-color-scheme', value: 'light' }],
  });
  await send('Page.navigate', { url: appUrl });
  socket.close();
}
