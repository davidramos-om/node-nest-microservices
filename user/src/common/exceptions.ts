import { ExceptionFilter, Catch, ArgumentsHost, HttpException, RpcExceptionFilter } from '@nestjs/common';
import { RpcException, BaseRpcExceptionFilter } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

export class GrpcExceptionFilter extends BaseRpcExceptionFilter implements RpcExceptionFilter
{
    catch(exception: RpcException, host: ArgumentsHost): Observable<unknown>
    {
        if (exception instanceof RpcException)
        {
            return throwError({ status: 6 })
        }
        return super.catch(exception, host);
    }
}