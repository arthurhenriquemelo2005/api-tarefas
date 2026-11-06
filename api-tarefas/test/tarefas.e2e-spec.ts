import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';

describe('API de tarefas (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    await app.init();
  });
  afterEach(() => app.close());

  const http = () => request(app.getHttpServer());

  it('POST /tarefas -> 201', async () => {
    const r = await http().post('/tarefas').send({ titulo: 'Estudar NestJS' }).expect(201);
    expect(r.body).toEqual({ id: 1, titulo: 'Estudar NestJS', feita: false });
  });

  it('GET /tarefas -> 200 lista', async () => {
    await http().post('/tarefas').send({ titulo: 'a' });
    const r = await http().get('/tarefas').expect(200);
    expect(r.body).toHaveLength(1);
  });

  it('GET /tarefas/:id -> 200 e 404', async () => {
    await http().post('/tarefas').send({ titulo: 'a' });
    await http().get('/tarefas/1').expect(200);
    await http().get('/tarefas/99').expect(404);
    await http().get('/tarefas/abc').expect(400);
  });

  it('PATCH /tarefas/:id -> 200 e 404', async () => {
    await http().post('/tarefas').send({ titulo: 'a' });
    const r = await http().patch('/tarefas/1').send({ feita: true }).expect(200);
    expect(r.body.feita).toBe(true);
    await http().patch('/tarefas/99').send({ feita: true }).expect(404);
  });

  it('DELETE /tarefas/:id -> 204 e depois 404', async () => {
    await http().post('/tarefas').send({ titulo: 'a' });
    await http().delete('/tarefas/1').expect(204);
    await http().get('/tarefas/1').expect(404);
    await http().delete('/tarefas/1').expect(404);
  });

  it('desafio: filtro ?feita=true', async () => {
    await http().post('/tarefas').send({ titulo: 'a' });
    await http().post('/tarefas').send({ titulo: 'b' });
    await http().patch('/tarefas/2').send({ feita: true });
    const r = await http().get('/tarefas?feita=true').expect(200);
    expect(r.body).toHaveLength(1);
    expect(r.body[0].id).toBe(2);
  });

  it('desafio: GET /tarefas/resumo (antes de :id)', async () => {
    await http().post('/tarefas').send({ titulo: 'a' });
    await http().post('/tarefas').send({ titulo: 'b' });
    await http().patch('/tarefas/1').send({ feita: true });
    const r = await http().get('/tarefas/resumo').expect(200);
    expect(r.body).toEqual({ total: 2, feitas: 1, pendentes: 1 });
  });

  it('desafio: título vazio -> 400', async () => {
    await http().post('/tarefas').send({ titulo: '' }).expect(400);
    await http().post('/tarefas').send({}).expect(400);
  });

  it('exercício 1: /status e /saudacao/:nome', async () => {
    const s = await http().get('/status').expect(200);
    expect(s.body.status).toBe('ok');
    const g = await http().get('/saudacao/Ana').expect(200);
    expect(g.text).toBe('Olá, Ana!');
  });
});
