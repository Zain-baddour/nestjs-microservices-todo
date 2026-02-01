import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const taskClient = ClientProxyFactory.create({
  transport: Transport.TCP,
  options: {
    host: process.env.TASK_SERVICE_HOST || 'localhost',
    port: parseInt(process.env.TASK_SERVICE_PORT || '3002'), // Task Service port
  },
});