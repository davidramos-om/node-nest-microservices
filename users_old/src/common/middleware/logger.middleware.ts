import { Injectable, NestMiddleware } from '@nestjs/common'; 

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
        
    console.log('Request LoggerMiddleware...');
    next();
  }
}

export function logger(req: Request, res: Response, next: Function) {
  console.log(`Request logger...`);
  next();
};