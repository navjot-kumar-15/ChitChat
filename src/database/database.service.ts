// src/database/database.service.ts
import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, connect, Mongoose } from 'mongoose';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private mongoose!: Mongoose;
  private connection!: Connection;
  private readonly logger = new Logger(DatabaseService.name);

  constructor() {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.close();
  }

  private async connect(): Promise<void> {
    const dbUrl = process.env.DB_URL;

    if (!dbUrl) {
      this.logger.error('DB_URL is not defined in environment variables!');
      process.exit(1);
    }

    try {
      this.logger.log('Connecting to MongoDB...');

      this.mongoose = await connect(dbUrl, {
        autoIndex: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      this.connection = this.mongoose.connection;

      // Success logs with safe access
      this.logger.log('MongoDB connected successfully!');

      // Safe access to db name (this fixes the TS error)
      const dbName = this.connection.db?.databaseName;
      if (dbName) {
        this.logger.log(`Database: ${dbName}`);
      } else {
        this.logger.log('Database: <default>');
      }

      this.logger.log(`Host: ${this.connection.host}:${this.connection.port}`);

      // Optional event listeners
      this.connection.once('open', () => {
        this.logger.log('MongoDB connection fully opened');
      });

      this.connection.on('error', (err) => {
        this.logger.error('MongoDB connection error:', err.message);
      });

      this.connection.on('disconnected', () => {
        this.logger.warn('MongoDB disconnected');
      });
    } catch (error) {
      this.logger.error(
        'Failed to connect to MongoDB!',
        error instanceof Error ? error.stack : '',
      );
      throw error;
    }
  }

  // Helper to get the raw connection (useful for custom queries or transactions)
  getConnection(): Connection {
    if (!this.connection) {
      throw new Error('Database not connected yet');
    }
    return this.connection;
  }

  async close(): Promise<void> {
    if (this.mongoose) {
      await this.mongoose.disconnect();
      this.logger.log('MongoDB connection closed gracefully');
    }
  }
}
