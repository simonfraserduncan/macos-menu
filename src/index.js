const { app, BrowserWindow, Tray, nativeImage, Menu, shell } = require('electron');
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

  const iconName = 'langflowTemplate.png';
  const iconPath = path.join(app.getAppPath(), 'assets', iconName);
  let image = nativeImage.createFromPath(iconPath);
  image.isTemplateImage = true;
  
  tray = new Tray(image);
  tray.setToolTip('Langflow');
  
  // Create context menu
  const contextMenuTemplate = [
    {
      label: 'Open Langflow',
      click: async () => {
        try {
          // Attempt to open the Langflow application
          // Assumes Langflow.app is in the standard /Applications directory
          await shell.openPath('/Applications/Langflow.app'); 
        } catch (error) {
          console.error('Failed to open Langflow app:', error);
          // Optionally, notify the user that the app couldn't be found or opened
        }
      }
    },
    { type: 'separator' }, // Separator after Open Langflow
    { 
      label: 'Send Feedback', 
      click: async () => {
        await shell.openExternal('https://github.com/logspace-ai/langflow/issues');
      }
    },
    { 
      label: 'Docs', 
      click: async () => {
        await shell.openExternal('https://docs.langflow.org/');
      }
    },
    { type: 'separator' },
    { 
      label: 'Join our Discord', 
      click: async () => {
        await shell.openExternal('https://discord.gg/langflow'); // Placeholder, verify actual link
      }
    },
    { 
      label: 'Follow the repo', 
      click: async () => {
        await shell.openExternal('https://github.com/logspace-ai/langflow');
      }
    },
    { 
      label: 'Follow on X', 
      click: async () => {
        await shell.openExternal('https://x.com/langflow_org'); // Placeholder, verify actual handle/link
      }
    },
    { type: 'separator' }, // This is the separator before the new group
    {
      label: 'Settings',
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
    { type: 'separator' }, // This is the separator before Quit
    { label: 'Quit', role: 'quit' }
  ];
  const contextMenu = Menu.buildFromTemplate(contextMenuTemplate);
  tray.setContextMenu(contextMenu);
  
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
