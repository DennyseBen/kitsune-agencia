# Tarefa: Kitsune Agency - Setup e Deploy (Firebase & GitHub)

## Origem da Demanda
O usuário quer configurar a infraestrutura do projeto atual (que está em HTML puro), integrando com:
1. **Firebase** (Criado: `kitsune-agencia`)
2. **GitHub**
3. **Domínio Personalizado** (`kitsune.onoticial.com.br`)

## Plano de Execução (Fases)

### Fase 1: Análise & Arquitetura (Atual)
- [x] Analisar o HTML atual `kitsune_agency_completo.html`.
- [x] Mapear necessidade de backend: **Mandatório**. Como o código usa a API da Anthropic, precisamos esconder a API_KEY em um ambiente servidor (Node.js ou Next.js) para segurança.
- [ ] Definir estrutura: Manter em HTML estático com servidor Express OR migrar para Next.js (recomendado para Firebase + Vercel).

### Fase 2: Configuração Firebase (Próximo)
- [ ] O usuário precisa fornecer o objeto `firebaseConfig` gerado no console.
- [ ] Criar o projeto base (Next.js ou Node.js) no diretório.
- [ ] Adicionar o SDK do Firebase (`npm install firebase`) e configurar as chaves seguras (arquivos `.env`).

### Fase 3: GitHub & Versionamento
- [ ] Inicializar o repositório git local (`git init`).
- [ ] Criar repositório correspondente usando a CLI do GitHub (`gh repo create`) ou solicitando o link remoto para o usuário.
- [ ] Fazer o primeiro commit (`git commit -m "feat: kitsune agency base structure"`).
- [ ] Push para o GitHub.

### Fase 4: Deploy & Domínio
- [ ] Fazer o Push para a Vercel ou Firebase Hosting (Vercel é preferível para Next.js / fácil integração de domínios).
- [ ] Configurar a variável de ambiente `ANTHROPIC_API_KEY` na hospedagem.
- [ ] Adicionar e verificar o domínio `kitsune.onoticial.com.br` no painel de hospedagem.

## Próximo Passo Bloqueante
- Receber o `firebaseConfig` do Firebase Console.
- Decidir se migraremos a UI do HTML para React (Next.js), ou se apenas envolveremos o HTML existente num app Node/Next de arquivo estático + rota de API (para proteger a chave Anthropic).
