import { AccessTokenGuard } from "./access-token.guard";
import { IsPublicGuard } from "./is-public.guard";
import { RefreshTokenGuard } from "./refresh-token.guard";

export const TokenAuthGuards = [IsPublicGuard, RefreshTokenGuard, AccessTokenGuard];