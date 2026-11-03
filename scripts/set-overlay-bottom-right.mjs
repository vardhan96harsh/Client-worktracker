import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mainPath = path.resolve(__dirname, '../electron/main.mjs');

let content = fs.readFileSync(mainPath, 'utf8');

// Replace TopRight with BottomRight
content = content.replace(
  /function getTopRightPosition\(width, height\) \{[\s\S]*?function positionOverlayTopRight\(\) \{[\s\S]*?overlayWindow\.setPosition\(pos\.x, pos\.y\);[\s\S]*?\}/,
  `function getBottomRightPosition(width, height) {
  const { workArea } = screen.getPrimaryDisplay();
  return {
    x: workArea.x + workArea.width - width - 16,
    y: workArea.y + workArea.height - height - 16,
  };
}

function positionOverlayBottomRight() {
  if (!overlayWindow || overlayWindow.isDestroyed()) return;
  if (overlayUserMoved) return;
  const [w, h] = overlayWindow.getSize();
  const pos = getBottomRightPosition(w, h);
  overlayWindow.setPosition(pos.x, pos.y);
}`
);

content = content.replace(
  'getTopRightPosition(defaultWidth, defaultHeight)',
  'getBottomRightPosition(defaultWidth, defaultHeight)'
);

content = content.replace(
  'if (!overlayBounds) positionOverlayTopRight();',
  'if (!overlayBounds || isAdminRole(userRole)) positionOverlayBottomRight();'
);

fs.writeFileSync(mainPath, content, 'utf8');
console.log('SUCCESS: main.mjs updated to Bottom-Right overlay positioning!');

