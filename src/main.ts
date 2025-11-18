import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

class CustomIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, {
      ...options,
      cors: { origin: '*' },
      // Only allow these namespaces
      allowEIO3: true,
    });

    // Optional: reject unknown namespaces
    server.of((name, _auth, fn) => {
      const allowed = ['/chat', '/notification', '/video-call'].includes(name);
      if (!allowed) {
        return fn(new Error('Invalid namespace'), false);
      }
      fn(null, true);
    });

    return server;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });
  app.useWebSocketAdapter(new CustomIoAdapter(app));
  await app.listen(process.env.PORT ?? 3000, () =>
    console.info(`Server is listening on PORT ${process.env.PORT}`),
  );
}
bootstrap();
