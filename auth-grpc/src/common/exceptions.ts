import { HttpStatus } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";


export function GrpcExc(msg: string, status: HttpStatus = HttpStatus.FAILED_DEPENDENCY)
{
    const exception = new RpcException({ message: msg, status: status, code: status });
    return exception;
}