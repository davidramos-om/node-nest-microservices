
import {
    ExceptionFilter,
    HttpException,
    NotFoundException,
    BadRequestException,
    HttpStatus,
    ArgumentsHost,
    Catch,
    Logger,
} from '@nestjs/common';
  
export class NotItemFound extends NotFoundException
{
    constructor(id: string, name: string)
    {
        const msg = `The ${name} : ID ${id} not found`;
        super(msg);
    }    
}
 
export class ParamRequired extends BadRequestException
{
    constructor(action: string)
    {
        const msg = `Not all required parameters have been set for the action : ${action}`;
        super(msg);
    }    
}
 
@Catch()
export class HttpExceptionFilter implements ExceptionFilter
{
    catch(exception: HttpException, host: ArgumentsHost)
    {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorResponse = {
            code: status,
            timestamp: new Date().toLocaleDateString(),
            path: request.url,
            method: request.method,
            message:
                status !== HttpStatus.INTERNAL_SERVER_ERROR
                    ? exception.message || null
                    : 'Internal server error',
        };

        Logger.error(
            `${request.method} ${request.url}`,
            exception.stack,
            'HttpExceptionFilter',
        );

        response.status(status).json(errorResponse);
    }
}