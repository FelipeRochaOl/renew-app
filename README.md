# 🧭 **Contexto do Projeto – RenovarApp**

O **RenovarApp** é uma plataforma inovadora de **requalificação profissional inteligente**, criada para ajudar trabalhadores de diferentes áreas a se prepararem para as transformações do mercado de trabalho impulsionadas por inteligência artificial, automação, digitalização e novos modelos produtivos.

Em um cenário onde profissões estão sendo rapidamente modificadas ou substituídas, muitas pessoas **não sabem como se preparar**, **quais habilidades desenvolver** ou **como fazer uma transição de carreira segura**. O RenovarApp surge para resolver exatamente esse problema.

A plataforma utiliza **IA preditiva**, análise de mercado e trilhas personalizadas de aprendizado para orientar o usuário passo a passo, mostrando:

* se sua profissão está em risco de automação,
* quais mudanças estão acontecendo no setor,
* quais habilidades continuarão relevantes,
* quais trilhas de requalificação são ideais para seu perfil,
* como realizar uma transição de carreira de forma acessível e sem medo,
* e quais cursos gratuitos/práticos ele pode fazer imediatamente.

---

# 🎯 **Objetivo do RenovarApp**

Criar um sistema acessível, empático e inteligente que:

1. **Avalia o risco da profissão atual** do usuário.
2. **Explica o que está mudando no mercado** de forma clara e acolhedora.
3. **Gera trilhas personalizadas** de requalificação e transição de carreira.
4. **Sugere cursos, módulos e capacitações** relevantes.
5. **Ajuda o usuário a construir um novo caminho profissional**, seja dentro da própria área ou migrando para outra.
6. Futuramente, conecta trabalhadores a **vagas compatíveis com sua nova formação**.

---

# 👤 **Exemplo de uso**

Um segurança de shopping abre o app e:

1. Responde algumas perguntas simples sobre profissão, escolaridade e região.
2. O sistema analisa a profissão “Segurança de Shopping”.
3. A IA identifica que existe **médio/alto risco** devido a tecnologias de monitoramento remoto e IA.
4. O RenovarApp apresenta **duas rotas**:

   * seguir na área com cursos de atualização (CFTV, segurança eletrônica);
   * iniciar transição de carreira para áreas relacionadas (monitoramento remoto, operador de sistemas, suporte técnico básico).
5. Ele escolhe um caminho e recebe uma **trilha personalizada**, com módulos e recomendações práticas.

---

# 🧠 **Tecnologias utilizadas**

### **Backend (API)**

* Node.js
* Fastify
* TypeScript
* MongoDB
* Contêiner com Docker

### **App Mobile**

* React Native
* Expo
* Navegação modular com React Navigation
* Consumo da API Fastify

### **Infraestrutura**

* Docker + Docker Compose
* Containers para API, app e banco MongoDB

---

# 🏗️ **Arquitetura de funcionamento (resumo)**

1. O usuário cria um perfil no aplicativo.
2. A API recebe as informações e identifica a profissão atual.
3. Um módulo interno de IA preditiva (mock ou real) avalia:

   * risco da profissão,
   * tendências de mercado,
   * oportunidades de atualização ou transição.
4. A API retorna para o app:

   * nível de risco,
   * explicação humana sobre o cenário,
   * trilhas recomendadas com cursos.
5. O app exibe:

   * tela de resultado da avaliação,
   * trilhas de aprendizado,
   * módulos com instruções e próximo passo.

---

# 🚀 **Propósito Social do RenovarApp**

O projeto tem um foco claro em **inclusão, acessibilidade e empregabilidade**, ajudando pessoas que estão:

* com medo das mudanças tecnológicas,
* sem orientação sobre desenvolvimento de carreira,
* querendo melhorar de vida,
* buscando uma transição de carreira segura,
* em áreas vulneráveis à automação.

---

# 🪧 **Resumo curto**

> RenovarApp é uma plataforma de requalificação profissional com IA que ajuda trabalhadores a entender o risco da sua profissão, descobrir novas oportunidades e seguir trilhas personalizadas de aprendizado para garantir sua empregabilidade no futuro do trabalho.

---

# **Como executar**
Preencha o .env da api e do app (se necessário trocar o localhost e a porta)
Criar uma conta no ngroq para teste da IA

Para rodar no IOS:
```sh
docker compose up -d
cd renew-app
npm run ios
```

Para rodar no Android:
```sh
docker compose up -d
cd renew-app
npm run android
```

Não esquecer de abrir o emulador.