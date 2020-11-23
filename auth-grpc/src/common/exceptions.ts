import { HttpException, HttpStatus } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";


export function GrpcExc(msg: string, status: HttpStatus = HttpStatus.FAILED_DEPENDENCY): RpcException
{
    const exception = new RpcException({ message: msg, status: status, code: status });
    return exception;
}

export function HttpExc(msg: string, status: HttpStatus = HttpStatus.FAILED_DEPENDENCY): HttpException
{
    const exception = new HttpException(msg, status);
    return exception;
}

export function Exc(grpc: boolean, msg: string, status: HttpStatus = HttpStatus.FAILED_DEPENDENCY)
{
    if (grpc)
        return GrpcExc(msg, status);
    else
        return HttpExc(msg, status);
}