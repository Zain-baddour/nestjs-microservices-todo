import { ClientProxyFactory, Transport } from '@nestjs/microservices';


export const userClient = ClientProxyFactory.create({
  transport: Transport.TCP,
  options: {
    host: process.env.USER_SERVICE_HOST || 'localhost',
    port: parseInt(process.env.USER_SERVICE_PORT || '3001'),
  },
});