# Copilot Instructions

Purpose
- Repository: new-siva-studio-services — Serverless Node.js (Node 20) TypeScript backend for AWS Lambda.
- Role: act as a concise, helpful pair-programmer and make small, well-tested changes.

Quick start
```bash
npm ci
npm test
npm run lint
npm run build   # runs tsc --noEmit
npm run deploy  # serverless deploy
```

Key details
- Default AWS region: `ap-south-1` (check [serverless.yml](serverless.yml), [src/config/index.ts](src/config/index.ts), and [.env.example](.env.example)).
- Tests live under `tests/` (unit and integration).
- Response envelope: success responses use `{ success: true, data: ... }`, errors use `{ success: false, message: ... }` (see `src/utils/response.ts`).

Files of interest
- [serverless.yml](serverless.yml) — provider & region
- [src/config/index.ts](src/config/index.ts) — runtime config and `AWS_REGION` fallback
- [.env.example](.env.example) — example environment variables
- [README.md](README.md) — documentation and example endpoint
- [src/handlers/hello.ts](src/handlers/hello.ts) — example handler
- [src/services/helloService.ts](src/services/helloService.ts) — example service
- [src/utils/response.ts](src/utils/response.ts) — response helpers
- [tests/](tests/) — unit and integration tests

Model & Sample JSON
- Location: `src/models/` — put TypeScript model/type files here. One file per logical API or Lambda (e.g., `hello.ts`).
- Naming: Use PascalCase with `Request` / `Response` suffix for interfaces. Examples: `HelloRequest`, `HelloResponse`.
- Exports: Export interfaces and shared types as named exports from the model file.
- Rule: Use types/interfaces for every object, array, payload, response, and shared structure. Avoid `any`.
- Usage requirement: All `src/handlers/`, `src/services/`, and `tests/` must import and use these types in function signatures and fixtures.
- Sample fixtures location: `samples/lambda/<function-name>/` — include `request.json` and `response.json` (e.g., `samples/lambda/hello/request.json`).
- Tests: Unit and integration tests should import the sample JSON fixtures and use them as typed inputs/expected outputs.
- Tooling: `tsconfig.json` should enable `resolveJsonModule` (already enabled) so tests can import JSON directly.

Examples

- Example model file (`src/models/hello.ts`):
```ts
export interface HelloRequest {
	name: string;
	age?: number;
}

export interface HelloResponse {
	message: string;
	code?: number;
}
```

- Example handler signature (use model types):
```ts
import { HelloRequest, HelloResponse } from '../models/hello';

export const handler = async (event: HelloRequest): Promise<HelloResponse> => {
	return { message: `Hello, ${event.name}`, code: 200 };
};
```

- Example sample JSON files (place under `samples/lambda/hello/`)

samples/lambda/hello/request.json
```json
{
	"name": "Alice",
	"age": 30
}
```

samples/lambda/hello/response.json
```json
{
	"message": "Hello, Alice",
	"code": 200
}
```

- Example Jest test using fixtures:
```ts
import requestFixture from '../../../samples/lambda/hello/request.json';
import responseFixture from '../../../samples/lambda/hello/response.json';
import { handler } from '../../../src/handlers/hello';
import { HelloRequest, HelloResponse } from '../../../src/models/hello';

test('hello handler returns expected response', async () => {
	const res = await handler(requestFixture as HelloRequest);
	expect(res).toEqual(responseFixture as HelloResponse);
});
```

Workflow alignment
- When changing a handler's contract: update `src/models/<name>.ts`, add/update `samples/lambda/<function-name>/` fixtures, and update tests to use those fixtures.
- PR checklist: types updated, sample JSON added/updated, tests updated and passing, README/API docs updated if public contract changed.

Editing rules (unchanged)
- Make minimal, focused changes. Avoid reformatting unrelated files.
- Do not add license headers or unrelated files without asking.
- Prefer small, test-backed commits.
- If you change defaults (for example AWS region), update `README.md` and `.env.example`.

Workflow preferences (unchanged)
- Before multi-step tasks, add or update a todo via `manage_todo_list` and include all tasks.
- Send a brief one-line preamble before running tool operations.
- Provide a short progress update after 3–5 tool calls or after making multiple edits.
- Use `apply_patch` for file edits and run `npm test` locally after changes.

When unsure (unchanged)
- Ask one concise clarifying question rather than making broad assumptions.
- Do not push breaking changes or large refactors without explicit approval.

That's it — ask the user for the next step when finished.
