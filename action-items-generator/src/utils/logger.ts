import winston from 'winston';

const getFileNameAndLineNumber = () => {
  const originalStackTrace = Error.prepareStackTrace;
  const originalStackTraceLimit = Error.stackTraceLimit;

  const ignoreFilePatterns = ['logger.ts', 'logger.js', 'node_modules', 'node:'];
  const isNonBoilerplateLine = (line: NodeJS.CallSite) =>
    line && line.getFileName() && ignoreFilePatterns.every((pattern) => !line.getFileName()!.includes(pattern));

  try {
    // eslint-disable-next-line handle-callback-err
    Error.prepareStackTrace = (err, structuredStackTrace) => structuredStackTrace;
    Error.stackTraceLimit = Infinity; // Temporarily allow infinite stacktrace
    const error = new Error();

    // Cast to CallSite due to overriding the prepareStackTrace
    const currStack = error.stack! as unknown as NodeJS.CallSite[];
    const callSites = currStack.filter(isNonBoilerplateLine);
    if (callSites.length === 0) {
      // bail gracefully: even though we shouldn't get here, we don't want to crash for a log print!
      return null;
    }
    const BASE_DIR_NAME = 'src/';

    const [callSite] = callSites;
    const fullFilePath = callSite.getFileName()!;
    const fileName = fullFilePath.includes(BASE_DIR_NAME)
      ? fullFilePath.substring(fullFilePath.indexOf(BASE_DIR_NAME))
      : fullFilePath;
    return `${fileName}:${callSite.getLineNumber()}`;
  } finally {
    Error.prepareStackTrace = originalStackTrace;
    Error.stackTraceLimit = originalStackTraceLimit;
  }
};

const logFormat = winston.format.printf(
  ({ level, message, label = 'general', timestamp }) =>
    `${timestamp} [${label.toUpperCase()}] [${getFileNameAndLineNumber()}] [${level.toUpperCase()}]: ${message}`
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  format: winston.format.combine(winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss.SSS' }), logFormat),
  defaultMeta: { service: 'backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/backend.log' }),
    new winston.transports.Console(),
  ],
});

// Silence logs when running tests (can comment out if you want to debug tests)
logger.silent = process.env.NODE_ENV === 'test';

// Export a function that receives a module name and returns a child logger for that module
export default (module: string) => logger.child({ label: module });
