import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Tarefa } from './tarefa.interface.js';

@Injectable()
export class TarefasService {
  private tarefas: Tarefa[] = [];
  private proximoId = 1;

  listar(feita?: boolean) {
    if (feita === undefined) return this.tarefas;
    return this.tarefas.filter((t) => t.feita === feita);
  }

  resumo() {
    const total = this.tarefas.length;
    const feitas = this.tarefas.filter((t) => t.feita).length;
    return { total, feitas, pendentes: total - feitas };
  }

  buscar(id: number) {
    const t = this.tarefas.find((t) => t.id === id);
    if (!t) throw new NotFoundException(`Tarefa ${id} não existe`);
    return t;
  }

  criar(titulo: string) {
    if (typeof titulo !== 'string' || titulo.trim() === '') {
      throw new BadRequestException('O título é obrigatório');
    }
    const t: Tarefa = { id: this.proximoId++, titulo: titulo.trim(), feita: false };
    this.tarefas.push(t);
    return t;
  }

  atualizar(id: number, dados: { titulo?: string; feita?: boolean }) {
    if (dados.titulo !== undefined && dados.titulo.trim() === '') {
      throw new BadRequestException('O título não pode ficar vazio');
    }
    return Object.assign(this.buscar(id), dados);
  }

  remover(id: number) {
    this.buscar(id); // 404 se não existir
    this.tarefas = this.tarefas.filter((t) => t.id !== id);
  }
}
