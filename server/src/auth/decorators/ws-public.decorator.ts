import { SetMetadata } from '@nestjs/common';

export const WS_PUBLIC_KEY = 'ws_is_public';

export const WsPublic = () => SetMetadata(WS_PUBLIC_KEY, true);
