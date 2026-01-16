import fs from 'fs';
import path from 'path';
import userAuthCheck from './middleware/authCheck.js';

// Simple test to check if middleware is working
const testMiddleware = (req, res, next) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    cookies: req.cookies,
    headers: req.headers.authorization,
    method: req.method,
    url: req.url
  };
  
  fs.appendFileSync(path.join(process.cwd(), 'middleware-test.log'), JSON.stringify(logEntry) + '\n');
  console.log('Middleware test log:', logEntry);
  
  // Call the actual middleware
  userAuthCheck(req, res, next);
};

export default testMiddleware;
