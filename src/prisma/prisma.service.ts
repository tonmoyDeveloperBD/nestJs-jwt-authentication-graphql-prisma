// src/prisma/prisma.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService {
    public prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async onModuleDestroy() {
        await this.prisma.$disconnect();
    }
}
