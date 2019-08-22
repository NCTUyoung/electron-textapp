const electron = require('electron');
const  {app,BrowserWindow,ipcMain,dialog,Menu} = electron;
const fs = require('fs')
let filePath = undefined
let win
app.on('ready',()=>{
   win = new BrowserWindow({
      webPreferences:{
         nodeIntegration:true
      }
   });
   win.loadFile('index.html');
   console.log('app is ready')
   const menu = Menu.buildFromTemplate(menuTemplate)
   Menu.setApplicationMenu(menu)
});
ipcMain.on('save',(event,text)=>{
   // save the text to a file
   console.log(text)
   if(filePath===undefined){
      dialog.showSaveDialog(win,{defaultPath:'filename.txt'},(fullpath)=>{
         if(fullpath){
            filePath = fullpath
            writeTofile(text)
         }
         else {
            console.log('fullpath is null')
         }
      })
   }else {
      writeTofile(text)
   }


})

function writeTofile(data) {
   fs.writeFile(filePath,data,(err)=>{
      if(err) console.log(('there was an error'),err)
      else {
         console.log('file has been saved')
         win.webContents.send('saved','success')
      }
   })

}
const menuTemplate = [
   {
      label:"File",
      submenu:[
         {
            label: "Save",
            click() {
               console.log('save from menu')
            }
         },
         {
            label:"Save as",
            click() {
               console.log("save as from menu")
            }
         }
      ]
   },
   {
      role:"editMenu"
   }
]