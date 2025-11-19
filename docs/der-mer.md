# Modelo Entidade-Relacionamento (MER) e Diagrama Entidade-Relacionamento (DER)

Este documento descreve as entidades principais da aplicação (`renew-api`) e seus relacionamentos conceituais (MER) e lógicos (DER) considerando a implementação atual em MongoDB/Mongoose.

> Observação: A implementação atual não utiliza referências (`ObjectId`) entre coleções; os relacionamentos são implícitos via atributos de texto. Futuras evoluções podem normalizar ou adicionar coleções de junção (ex: matrículas de usuários em trilhas).

---
## 1. MER (Modelo Conceitual)

### Entidades
- **User**: representa usuário do sistema (worker, company, admin).
- **ProfessionRisk**: classificação de risco de uma profissão (LOW | MEDIUM | HIGH) com tendências.
- **LearningPath**: trilha de aprendizado para (re)qualificação em uma profissão alvo, podendo ser para a profissão atual.
- **LearningModule** (subentidade / componente de LearningPath): módulo com título, duração e habilidades desenvolvidas.

### Principais Relacionamentos (Conceituais)
- Um **ProfessionRisk** descreve exatamente 1 profissão (1:1 conceitual entre profissão e seu risco). Na base aparece como atributo único `profession`.
- Um **User** está associado a 0..1 profissão atual → relação conceitual N:1 entre User e ProfessionRisk (muitos usuários podem compartilhar o mesmo registro de risco; se não existir, o risco ainda não foi cadastrado).
- Um **LearningPath** está associado a 1 profissão alvo → relação N:1 entre LearningPath e ProfessionRisk (pelo campo `targetProfession`).
- Um **LearningPath** contém 0..N **LearningModule** (composição forte; módulos não existem fora da trilha).
- O flag `forCurrentProfession` indica se a trilha é de aprofundamento (true) ou de transição (false) para a profissão alvo.

### Diagrama Conceitual (Mermaid)
```mermaid
erDiagram
    User ||--o{ ProfessionRisk : "currentProfession (N:1)"
    LearningPath }o--|| ProfessionRisk : "targetProfession (N:1)"
    LearningPath ||--o{ LearningModule : "composição"

    User {
        string name
        string email
        enum role (worker|company|admin)
        string currentProfession
        string region
        string educationLevel
    }
    ProfessionRisk {
        string profession
        enum riskLevel (LOW|MEDIUM|HIGH)
        string description
        string[] trends
    }
    LearningPath {
        string id
        string title
        string description
        string targetProfession
        boolean forCurrentProfession
        enum level (BEGINNER|INTERMEDIATE|ADVANCED)
    }
    LearningModule {
        string id
        string title
        number durationHours
        string[] skills
        string externalLink
    }
```

---
## 2. DER (Modelo Lógico / Implementação MongoDB)

### Coleções
1. **users** (`UserModel`)
   - `_id` (ObjectId, PK implícita Mongo)
   - `name` (String, obrigatório)
   - `email` (String, obrigatório, único, indexado)
   - `role` (String enum: worker | company | admin, default worker)
   - `passwordHash` (String, opcional)
   - `resetToken` (String, opcional)
   - `resetTokenExpires` (Date, opcional)
   - `currentProfession` (String, opcional) → FK lógica para `professionRisk.profession`
   - `region` (String, opcional)
   - `educationLevel` (String, opcional)
   - `createdAt` / `updatedAt` (Date - timestamps Mongoose)

2. **professionrisks** (`ProfessionRiskModel`)
   - `_id` (ObjectId)
   - `profession` (String, obrigatório, único, indexado) ← chave de negócio
   - `riskLevel` (String enum: LOW | MEDIUM | HIGH)
   - `description` (String)
   - `trends` (Array<String>)
   - `createdAt` / `updatedAt`

3. **learningpaths** (`LearningPathModel`)
   - `_id` (ObjectId)
   - `id` (String, obrigatório, único, indexado) ← identificador de negócio
   - `title` (String)
   - `description` (String)
   - `targetProfession` (String, obrigatório) → FK lógica para `professionRisk.profession`
   - `forCurrentProfession` (Boolean)
   - `level` (String enum: BEGINNER | INTERMEDIATE | ADVANCED)
   - `modules` (Array<Embedded LearningModule>)
   - `createdAt` / `updatedAt`

   Embedded **LearningModule** schema:
   - `id` (String, obrigatório)
   - `title` (String, obrigatório)
   - `durationHours` (Number, obrigatório)
   - `skills` (Array<String>, obrigatório)
   - `externalLink` (String, opcional)

### Cardinalidades (Implementação)
- `users.currentProfession` → não há validação referencial automática; cardinalidade pretendida N:1 (muitos usuários para um registro de risco) ou N:0 (se o risco não cadastrado).
- `learningpaths.targetProfession` → N:1 para professionrisks.
- `learningpaths.modules` → 1:N embutido (documento contém array).

### Diagrama Lógico (Mermaid)
```mermaid
erDiagram
    users ||--o{ professionrisks : "currentProfession -> profession (N:1 lógico)"
    learningpaths }o--|| professionrisks : "targetProfession -> profession (N:1 lógico)"
    learningpaths ||--o{ learningmodules : "embedded"

    users {
        ObjectId _id
        string name
        string email (UNIQUE)
        string role
        string passwordHash
        string resetToken
        date resetTokenExpires
        string currentProfession
        string region
        string educationLevel
        date createdAt
        date updatedAt
    }
    professionrisks {
        ObjectId _id
        string profession (UNIQUE)
        string riskLevel
        string description
        string[] trends
        date createdAt
        date updatedAt
    }
    learningpaths {
        ObjectId _id
        string id (UNIQUE)
        string title
        string description
        string targetProfession
        boolean forCurrentProfession
        string level
        LearningModule[] modules
        date createdAt
        date updatedAt
    }
    learningmodules {
        string id
        string title
        number durationHours
        string[] skills
        string externalLink
    }
```

### Índices
- `users.email` (único + index)
- `professionrisks.profession` (único + index)
- `learningpaths.id` (único + index)
