# Prompts iniciales

Prompts utilizados con Claude Code para resolver el ejercicio "Creando endpoints de LTI".

## Prompt 1 — Enunciado del ejercicio

```
tengo este ejercicio llamado creando endpoint de LTI, te dejo la descripcion del mismo abajo
conjuntamente con las paginas web del curso y del github con el repo de ejemplo a usar:

✍️ Creando endpoints de LTI
Tu misión en este ejercicio es crear dos nuevos endpoints que nos permitirán manipular la
lista de candidatos de una aplicación en una interfaz tipo kanban.

GET /positions/:id/candidates
Este endpoint recogerá todos los candidatos en proceso para una determinada posición, es
decir, todas las aplicaciones para un determinado positionID. Debe proporcionar:
- Nombre completo del candidato (de la tabla candidate).
- current_interview_step: en qué fase del proceso está el candidato (de la tabla application).
- La puntuación media del candidato (promedio de los scores de sus interviews).

PUT /candidates/:id/stage
Este endpoint actualizará la etapa del candidato movido.

https://training.lidr.co/posts/ai4devs-202607-creando-endpoints-de-lti
https://github.com/LIDR-academy/ai4devs-backend-202607-seniors

guiame paso a paso
```

## Prompt 2 — Aclaración sobre el flujo de entrega con Git

```
consulta no tenemos que hacer un fork y clone
```

Esto llevó a corregir el plan: como no había permisos de escritura sobre el repositorio
original de LIDR-academy, era necesario hacer fork a la cuenta personal, clonar el fork, y
más adelante abrir el pull request desde el fork hacia el repo original.

## Prompt 3 — Confirmación del fork y continuación

```
listo el fork, te paso la url: https://github.com/AlejandroNicolaide/ai4devs-backend-202607-seniors
vamos paso por paso
```

## Decisiones de diseño tomadas durante la implementación

- **`GET /positions/:id/candidates`**: se consulta la tabla `Application` filtrando por
  `positionId`, incluyendo el `Candidate` relacionado y sus `Interview` (solo el campo
  `score`). El promedio se calcula ignorando entrevistas sin `score` (null); si el
  candidato no tiene ninguna entrevista con score, se devuelve `averageScore: null` en
  lugar de `0`, para no confundir "sin evaluar" con "evaluado con 0".

- **`PUT /candidates/:id/stage`**: dado que un mismo candidato puede tener varias
  `Application` (una por cada posición a la que se postuló), el `:id` de la ruta identifica
  al candidato, y el body recibe `applicationId` (qué proceso concreto se mueve) e
  `interviewStep` (nueva fase). El servicio valida que la `Application` indicada pertenezca
  realmente al candidato del `:id`, devolviendo un error 400 si no es así.

- Ambos endpoints siguen el patrón de capas ya existente en el proyecto
  (`routes` → `presentation/controllers` → `application/services` → Prisma), en lugar de
  introducir un patrón nuevo.

## Verificación

Se probaron ambos endpoints de punta a punta contra una base de datos Postgres local
(levantada con `docker compose`, migrada con `prisma migrate deploy` y poblada con el
`prisma/seed.ts` del propio repo), confirmando:

- `GET /positions/1/candidates` devuelve nombre completo, `currentInterviewStep` y
  `averageScore` (incluyendo `null` para candidatos sin entrevistas).
- `PUT /candidates/:id/stage` actualiza correctamente `currentInterviewStep` en la
  `Application` indicada, y rechaza la operación si el `applicationId` no pertenece al
  candidato del `:id`.
