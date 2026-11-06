import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TarefasService } from './tarefas.service.js';

@Controller('tarefas')
export class TarefasController {
  constructor(private readonly service: TarefasService) {}

  @Get()
  listar(@Query('feita') feita?: string) {
    const filtro = feita === undefined ? undefined : feita === 'true';
    return this.service.listar(filtro);
  }

  // precisa vir ANTES de ':id', senão 'resumo' cai no ParseIntPipe (400)
  @Get('resumo')
  resumo() {
    return this.service.resumo();
  }

  @Get(':id')
  buscar(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscar(id);
  }

  @Post()
  criar(@Body() body: { titulo: string }) {
    return this.service.criar(body?.titulo);
  }

  @Patch(':id')
  atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { titulo?: string; feita?: boolean },
  ) {
    return this.service.atualizar(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  remover(@Param('id', ParseIntPipe) id: number) {
    this.service.remover(id);
  }
}
