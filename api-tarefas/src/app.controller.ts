import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('status')
  status() {
    return { status: 'ok', horario: new Date() };
  }

  @Get('saudacao/:nome')
  saudacao(@Param('nome') nome: string) {
    return `Olá, Julião!`;
  }
}