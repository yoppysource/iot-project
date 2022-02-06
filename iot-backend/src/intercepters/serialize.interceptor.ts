import {
  CallHandler,
  ClassSerializerInterceptor,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';

interface ClassConstrutor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstrutor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
// request -> middlewares -> guards -> interceptor(context) -> Request Handler -> interceptor(next)
class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstrutor) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: any) => {
        console.log(data);
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
