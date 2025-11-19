# Getting Started with [Fastify-CLI](https://www.npmjs.com/package/fastify-cli)
This project was bootstrapped with Fastify-CLI.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

To start the app in dev mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm start`

For production mode

### `npm run test`

Run the test cases.

## Learn More

To learn Fastify, check out the [Fastify documentation](https://fastify.dev/docs/latest/).

## Variáveis de Ambiente Necessárias

Crie um arquivo `.env` e defina:

```
MONGO_URL=mongodb://usuario:senha@host:porta/nomeBanco
OPENAI_API_KEY=chave_da_api_openai   # opcional (se usar OpenAI direto)
GROQ_API_KEY=chave_api_groq          # opcional (usa infra Groq com API OpenAI compatível)
OPENAI_MODEL=gpt-4o-mini             # opcional (default já é gpt-4o-mini)
```

Sem `OPENAI_API_KEY` o sistema ainda funciona, mas gera dados genéricos para risco de profissão e trilhas.

## Geração Dinâmica (Sem Mocks)

Ao chamar `POST /assessment/profession-risk` com body:

```json
{
	"profession": "Nome da Profissão"
}
```

Fluxo:
1. Busca no Mongo (`ProfessionRisk`).
2. Se não existir, consulta a OpenAI para gerar `professionRisk` e um conjunto de `learningPaths` mínimos (upskilling e transição) seguindo o schema.
3. Persiste ambos e retorna o objeto de risco.

As trilhas ficam disponíveis em `GET /learning-paths?targetProfession=...`.

## Endpoints Relevantes
- `POST /assessment/profession-risk` Avalia e (se necessário) cria dados para a profissão.
- `GET /learning-paths` Lista trilhas (filtros: `targetProfession`, `forCurrentProfession`, `level`).
- `GET /recommendations/for-user/:userId` Usa os dados salvos para montar recomendações.
- `POST /chatbot/message` Geração de resposta completa (não streaming).
- `POST /chatbot/message/stream` Resposta em tempo real via Server-Sent Events (SSE).

### Streaming do Chatbot (SSE)
O endpoint `POST /chatbot/message/stream` envia eventos SSE contendo pedaços (tokens) da resposta da IA.

Cada evento é um JSON serializado na linha `data:`. Estrutura típica:
```
data: {"token":"Olá,"}

data: {"token":" tudo"}

data: {"token":" bem?"}

data: {"done":true,"intent":"AI_REPLY"}
```

#### Exemplo com curl
Use `-N` para não fazer buffering:
```bash
curl -N -X POST http://localhost:3000/chatbot/message/stream \
	-H 'Content-Type: application/json' \
	-d '{"message":"Olá, quero saber sobre risco da profissão"}'
```

#### Exemplo Frontend (Fetch API)
```ts
async function streamChat(message: string) {
	const res = await fetch("/chatbot/message/stream", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ message }),
	});

	if (!res.body) throw new Error("Streaming não suportado");
	const reader = res.body.getReader();
	const decoder = new TextDecoder();
	let buffer = "";
	while (true) {
		const { value, done } = await reader.read();
		if (done) break;
		buffer += decoder.decode(value, { stream: true });
		// Quebra por eventos SSE (duas quebras de linha)
		const parts = buffer.split(/\n\n/);
		// Mantém último fragmento incompleto em buffer
		buffer = parts.pop() || "";
		for (const evt of parts) {
			const line = evt.split(/\n/).find((l) => l.startsWith("data:"));
			if (!line) continue;
			const json = line.replace(/^data:\s*/, "");
			try {
				const payload = JSON.parse(json);
				if (payload.token) {
					// Append token à UI
					console.log(payload.token);
				}
				if (payload.done) {
					console.log("Fim do streaming", payload.intent);
				}
			} catch {}
		}
	}
}
```

#### Tratamento de Erros
- Se faltar `message`, retorna evento inicial com `{ error: "message is required" }` e encerra.
- Em quota excedida ou indisponibilidade, envia `intent` apropriado (`QUOTA_EXCEEDED`, `FALLBACK`).

#### Dicas
- SSE usa conexão contínua HTTP: ideal para mostrar resposta incremental ao usuário.
- Para abortar, chame `controller.abort()` se usar AbortController ou feche a aba/conexão.
- Em produção, considere timeout e reconexão automática (já há `retry: 1000`).

## Observações
- Removidos arquivos de mocks em `src/data` (agora tudo é persistido dinamicamente).
- Garantir índice único para profissão e id das trilhas.
- Em caso de falha ou falta de chave OpenAI, cai em fallback genérico controlado.
