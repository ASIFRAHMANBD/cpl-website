// Global error handling for production stability
// Prevents uncaught exceptions and rejections from crashing the server

import { NextApiRequest, NextApiResponse } from 'next';

// Global error handlers
process.on('uncaughtException', (error: Error) => {
  console.error('🛑 UNCAUGHT EXCEPTION - Keeping process alive:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
  // Don't exit in production - let the process manager handle restarts
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('⚠️ UNHANDLED REJECTION - Keeping process alive:', {
    reason: reason,
    promise: promise,
    timestamp: new Date().toISOString()
  });
});

// API error handler middleware
export function withErrorHandler(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error: any) {
      console.error('API Error:', {
        url: req.url,
        method: req.method,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      
      res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'production' 
          ? 'Something went wrong' 
          : error.message
      });
    }
  };
}

// Safe JSON parsing with error handling
export function safeJsonParse(str: string): any {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.error('JSON Parse Error:', error);
    return null;
  }
}

// Safe number conversion with NaN handling
export function safeToNumber(value: any): number {
  const num = Number(value);
  return Number.isNaN(num) ? 0 : num;
}

// Validate and sanitize input
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>\"\']/g, '');
}