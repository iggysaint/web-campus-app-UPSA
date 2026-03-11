
export const logger = {
  info: (message: string, data?: any) => {
    console.log(`%c[INFO] ${new Date().toISOString()}: ${message}`, 'color: #0088CC', data || '');
  },
  error: (message: string, error?: any) => {
    console.error(`%c[ERROR] ${new Date().toISOString()}: ${message}`, 'color: #EF4444', error || '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`%c[WARN] ${new Date().toISOString()}: ${message}`, 'color: #F59E0B', data || '');
  }
};
