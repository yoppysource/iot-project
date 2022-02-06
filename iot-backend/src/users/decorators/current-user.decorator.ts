import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  // Execution context == request랑 같다 하지만, http, websocket등 다른 형식도 지원하고 있기 때문에 그렇게 표현함
  // data는 decorator에 넣은 인풋, never -> this value is never gonna use
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  },
);
