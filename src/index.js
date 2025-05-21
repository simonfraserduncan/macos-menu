const { app, BrowserWindow, Tray, nativeImage, Menu, shell, nativeTheme } = require('electron');
const path = require('node:path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let tray = null;

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // createWindow(); // Commented out to prevent default window

  const mainIconName = 'langflowTemplate.png';
  const mainIconPath = path.join(app.getAppPath(), 'assets', mainIconName);
  let mainTrayImage = nativeImage.createFromPath(mainIconPath);
  mainTrayImage.isTemplateImage = true; // Main tray icon IS a template
  
  tray = new Tray(mainTrayImage);
  tray.setToolTip('Langflow');
  
  // Function to create the context menu
  // This is needed so we can rebuild it when the theme changes
  const createContextMenu = () => {
    const iconSuffix = nativeTheme.shouldUseDarkColors ? '-dark' : '-light';

    // Test for Open Langflow icon
    const openLangflowIconName = `open-langflow${iconSuffix}.png`;
    const openLangflowIconPath = path.join(app.getAppPath(), 'assets', openLangflowIconName);
    const openLangflowImage = nativeImage.createFromPath(openLangflowIconPath);
    // console.log(`Loading icon: ${openLangflowIconPath}`); // Remove this log
    // console.log(`Scale factors for ${openLangflowIconName}:`, openLangflowImage.getScaleFactors()); // Remove this log
    // End Test

    const contextMenuTemplate = [
      {
        label: 'Open Langflow',
        icon: openLangflowImage, // Use the test image
        click: async () => {
          try { await shell.openPath('/Applications/Langflow.app'); } catch (error) { console.error('Failed to open Langflow app:', error); }
        }
      },
      { type: 'separator' },
      { 
        label: 'Send Feedback',
        icon: nativeImage.createFromPath(path.join(app.getAppPath(), 'assets', `send-feedback${iconSuffix}.png`)),
        click: async () => { await shell.openExternal('https://github.com/logspace-ai/langflow/issues'); }
      },
      { 
        label: 'Docs',
        icon: nativeImage.createFromPath(path.join(app.getAppPath(), 'assets', `docs${iconSuffix}.png`)),
        click: async () => { await shell.openExternal('https://docs.langflow.org/'); }
      },
      { type: 'separator' },
      { 
        label: 'Join our Discord',
        icon: nativeImage.createFromPath(path.join(app.getAppPath(), 'assets', `discord${iconSuffix}.png`)),
        click: async () => { await shell.openExternal('https://discord.com/invite/EqksyE2EX9'); }
      },
      { 
        label: 'Follow the repo',
        icon: nativeImage.createFromPath(path.join(app.getAppPath(), 'assets', `github${iconSuffix}.png`)),
        click: async () => { await shell.openExternal('https://github.com/logspace-ai/langflow'); }
      },
      { 
        label: 'Follow on X',
        icon: nativeImage.createFromPath(path.join(app.getAppPath(), 'assets', `x${iconSuffix}.png`)),
        click: async () => { await shell.openExternal('https://x.com/langflow_ai?lang=en'); }
      },
      { type: 'separator' }, 
      {
        label: 'Settings',
        accelerator: 'CommandOrControl+,',
        click: () => {
          console.log('Settings clicked');
        }
      },
      {
        label: 'Check for updates',
        click: () => {
          console.log('Check for updates clicked');
        }
      },
      { type: 'separator' },
      { label: 'Quit', role: 'quit' }
    ];
    const menu = Menu.buildFromTemplate(contextMenuTemplate);
    tray.setContextMenu(menu);
  };

  createContextMenu(); // Initial menu creation

  // Listen for theme changes and update menu icons
  nativeTheme.on('updated', () => {
    createContextMenu();
  });
  
  if (process.platform === 'darwin') {
    app.dock.hide();
  }

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    // if (BrowserWindow.getAllWindows().length === 0) { // Original condition
    //   createWindow();
    // }
    // For a tray app, we might not want to do anything on activate,
    // or open a specific window/menu. For now, let's do nothing if dock is hidden.
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
// This behavior is generally fine for a tray app too.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
