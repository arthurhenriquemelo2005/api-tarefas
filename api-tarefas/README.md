# api-tarefas

API REST de tarefas em NestJS (CRUD em memória) — Aula 4, Módulo IV · Tascom Academy.

## Como rodar
```bash
npm install
npm run start:dev      # http://localhost:3000
npm test               # unitário
npm run test:e2e       # testa todas as rotas
```
A porta pode ser trocada com a variável `PORT`.

## Rotas
| Verbo | Rota | Ação | Sucesso |
| --- | --- | --- | --- |
| GET | /tarefas | Lista todas (`?feita=true` filtra) | 200 |
| GET | /tarefas/resumo | total, feitas e pendentes | 200 |
| GET | /tarefas/:id | Busca uma (404 se não existe) | 200 |
| POST | /tarefas | Cria `{ "titulo": "..." }` (400 se vazio) | 201 |
| PATCH | /tarefas/:id | Atualiza `{ titulo?, feita? }` | 200 |
| DELETE | /tarefas/:id | Remove | 204 |
| GET | /status | `{ status: "ok", horario }` | 200 |
| GET | /saudacao/:nome | Saudação | 200 |

> Os dados vivem na memória: reiniciar o servidor zera as tarefas.
