import fs, { readFileSync } from "fs";
import path from "path";


const config = {
  saveToFileInterval: 1000,
  storeLogsDays: 14,
};

const LOGDIR = path.join(__dirname, '..', 'logs');

const logBuffer = [];

export function logg(source: string, message: string) {
  const date = new Date();
  console.log(message);

}

export function initLogWriteFile() {
  return setInterval(() => {

    cleanupOldLogs();
    const todayLogFilename = getTodayLogFilename();

    console.log('Writing logs to file to...', todayLogFilename);
  }, config.saveToFileInterval);
}

function cleanupOldLogs() {
  const logfiles = fs.readdirSync(LOGDIR);

  logfiles.forEach(logFile => {
    const date = Date.parse(logFile.split('.')[0]);
    const today = Date.parse(getTodayLogFilename().split('.')[0]);

    if (isNaN(date) || today - config.storeLogsDays * 86400000 > date) {
      fs.unlinkSync(LOGDIR + "/" + logFile);
    }

  });
}

function getTodayLogFilename() {
  const now = new Date();
  const monthString = now.getUTCMonth() < 10 ? "0" + now.getUTCMonth().toString() : now.getUTCMonth().toString();
  const dayString = now.getUTCDate() < 10 ? "0" + now.getUTCDate().toString() : now.getUTCDate().toString();
  return now.getUTCFullYear().toString() + "-" + monthString + "-" + dayString + ".txt";
}