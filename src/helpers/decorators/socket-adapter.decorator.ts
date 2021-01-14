import { createParamDecorator, ExecutionContext } from "@nestjs/common"


export const SocketAdapter = createParamDecorator(
    (context: ExecutionContext) => {
        const client = context.switchToWs().getClient();
        console.log(client);
        return client.adapter;
    }
)