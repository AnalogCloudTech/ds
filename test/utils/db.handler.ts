import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      const mongo = await MongoMemoryServer.create();
      const mongoUri = mongo.getUri();
      return {
        uri: mongoUri,
        ...options,
      };
    },
  });

export const closeInMongodConnection = async () => {
  if (mongod) await mongod.stop({ doCleanup: true });
};

export const startMongoDb = async () => {
  if (!mongod) mongod = await MongoMemoryServer.create();
  await mongod.start();
};
