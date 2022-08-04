import fs, { readFileSync } from "fs";
import path from "path";


const config = {
  saveToFileInterval: 1000,
  storeLogsDays: 14,
};

const LOGDIR = path.join(__dirname, '..', 'logs');

const logBuffer: string[] = [];

export function logg(message: string, source?: string) {
  const dateIsoString = new Date().toISOString();
  const dateString = dateIsoString.split('T')[0] + " " + dateIsoString.split('T')[1].split('.')[0];
  console.log(message);
  logBuffer.push(`${dateString} [${source}]: ${message}\n`);
}

export function initLogWriteFile() {

  //Testing
  /*   setInterval(() => {
      logg(makeRandomString(50), "testing");
    }, 150);
   */
  return setInterval(async () => {

    cleanupOldLogs();

    const todayLogFilepath = LOGDIR + "/" + getTodayLogFilename();
    console.log('Writing logs to file to...', todayLogFilepath);
    for (let index = 0; index < logBuffer.length; index++) {
      const log = logBuffer[index];
      fs.appendFileSync(todayLogFilepath, log);
    }

  }, config.saveToFileInterval);



}

function cleanupOldLogs() {
  const logfiles = fs.readdirSync(LOGDIR);

  logfiles.forEach(logFile => {
    const date = Date.parse(logFile.split('.')[0]);
    const today = Date.parse(getTodayLogFilename().split('.')[0]);

    if (isNaN(date) || today - config.storeLogsDays * 86400000 > date) {

      const filePath = LOGDIR + "/" + logFile;
      fs.unlinkSync(LOGDIR + "/" + logFile);
      console.log(`Removed file: ${filePath}`);
    }


  });
}

function getTodayLogFilename() {
  const now = new Date();
  const monthString = now.getUTCMonth() < 10 ? "0" + (now.getUTCMonth() + 1).toString() : (now.getUTCMonth() + 1).toString();
  const dayString = now.getUTCDate() < 10 ? "0" + now.getUTCDate().toString() : now.getUTCDate().toString();
  const filename = now.getUTCFullYear().toString() + "-" + monthString + "-" + dayString + ".txt";
  return filename;
}


function makeRandomString(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}