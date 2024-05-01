// import { NextFunction, Request, Response } from 'express';
// import AppError from '../Utils/appError';

// export const requireUser = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//   const tgInitData = req.headers['tg-init-data']
//   const urlParams = new URLSearchParams(telegramInitData);

//   const hash = urlParams.get('hash');
//   urlParams.delete('hash');
//   urlParams.sort();

//   let dataCheckString = '';
//   for (const [key, value] of urlParams.entries()) {
//       dataCheckString += `${key}=${value}\n`;
//   }
//   dataCheckString = dataCheckString.slice(0, -1);

//   const secret = crypto.createHmac('sha256', 'WebAppData').update(process.env.API_TOKEN ?? '');
//   const calculatedHash = crypto.createHmac('sha256', secret.digest()).update(dataCheckString).digest('hex');

//   return calculatedHash === hash;
    
//   } catch (err: any) {
//     next(err);
//   }
// };
