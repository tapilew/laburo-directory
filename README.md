# Laburo Directory

Decentralized Recruitment Platform

## 1. The Problem

Recruitment is broken by noise.

- **Recruiters** waste hours scraping outdated databases (LinkedIn) for candidates who aren't looking.
- **Top Talent** gets spammed by low-quality offers because their contact info is public or sold in bulk.
- **Inefficiency:** There is no direct value transfer. Recruiters pay platform subscriptions, not for the specific data they need _now_.

## 2. The Solution: Laburo Directory

A minimalist, agentic recruitment directory where candidate data is curated by AI and gated by the **x402 protocol**.

- **Agentic Curation:** "Talent Agents" (AI) curate profiles and store them on **Arkiv** with Time-To-Live (TTL), ensuring data is fresh (e.g., "Active for 24h only").
- **Blind Discovery:** Recruiters search for skills (e.g., "Rust Engineer, ZK exp") and see anonymized summaries.
- **x402 Micro-Payments:** To reveal a candidate's contact info, the recruiter streams a micropayment (USDC on Scroll) directly to the agent via **Crossmint**. No subscriptions. Pay-per-lead.

## 3. How It Works (Technical MVP)

- **Frontend:** A single-page "Command Center" for recruiters.
  - _Feature:_ Semantic search bar ("Find me a dev who knows Scroll").
  - _Action:_ "Reveal Contact" button triggers the payment flow.
- **Backend (The Agent):**
  - **Arkiv Integration:** Stores candidate metadata with a strict 1-hour TTL. If a candidate isn't hired or renewed, they vanish. This guarantees "Active" status.
  - **x402 Protocol:** Intercepts requests for sensitive data (email/Telegram). Returns `402 Payment Required` until a transaction is verified on Scroll.
- **Settlement:**
  - **Crossmint:** Embedded wallet handles the USDC payment instantly, removing friction for the recruiter.

## 4. The Hackathon Deliverables Strategy

- **Git Repo:** A monorepo containing the Python FastAPI backend (x402 logic) and the simple React/HTML frontend. Clean, commented code proving the `402` status flow.
- **Brainstorming:** A PDF showing the evolution from "Decentralized Upwork" to this streamlined "Pay-to-Reveal" directory, focusing on minimizing friction for recruiters.
- **Business Model Canvas:**
  - _Value Prop:_ Fresh data guaranteed (TTL). No monthly fees.
  - _Revenue:_ % fee on every unlock (Micro-transaction model).
  - _Customer:_ Tech Recruiters, Headhunters.
- **Data Model (Arkiv):** A JSON schema diagram showing the `Public_Profile` (Skills, Bio) vs. `Private_Data` (Email, Phone) separation, and the `TTL` field usage.
- **Design:** Low-fidelity wireframes of the "Search -> 402 Block -> Pay -> Reveal" user flow. Minimalist aesthetic.
- **Pitch Video (Demo):** A 60-second screen recording:
  1.  Recruiter types "Solidity Dev".
  2.  Clicks "Reveal".
  3.  Browser shows "402 Payment Required".
  4.  Recruiter clicks "Pay with Crossmint".
  5.  Contact info appears instantly.

## 5. Why It Wins

- **Feasibility:** It was built in one afternoon by a single developer, proving the DevX of the stack (Arkiv + Crossmint).
- **Innovation:** It moves away from "Subscriptions" to "Agentic Commerce" (paying an agent for a specific unit of work/data).
- **Arkiv Usage:** Perfect use of **TTL** (Time-To-Live) to solve the "stale data" problem in recruiting.
- **Crossmint Usage:** Demonstrates seamless crypto payments in a B2B workflow.

## 6. Roadmap (Future)

- **Freelancer Portal:** Allow talent to upload their own profiles and set their "Reveal Price".
- **Reputation:** On-chain verification of skills.
- **Auto-Match:** Agents proactively notifying recruiters of new matches.

# Sponsors & Bounties

## DeFi + AI Agents

Herramientas financieras abiertas potenciadas por inteligencia artificial: automatización, agentes onchain y nuevas experiencias financieras programables

En esta categoría, los builders podrán construir herramientas financieras abiertas potenciadas por inteligencia artificial y agentes autónomos.

Esto puede abarcar protocolos DeFi programables, automatización inteligente de estrategias, wallets o bots que operen onchain, análisis predictivo, mecanismos de riesgo dinámico, o nuevas interfaces para interactuar con activos digitales.

Los proyectos deben enfocarse en crear experiencias financieras más accesibles, eficientes y seguras, aprovechando la combinación de Blockchain + AI para habilitar nuevas capacidades que antes no eran posibles.

## Arkiv

### 💰Arkiv- Prize $1500 - Micro Bounties

Desafíos pequeños y enfocados para que más builders experimenten con Arkiv.

Micro Bounties

    ⚡ Mejor uso en tiempo real del stack Arkiv — $300

    ⏳ Mejor uso de expiración de tiempo (TTL) — $300

    📊 Mejor integración con Open Analytics — $300

    💸 Mejor caso de uso DeFi — $300

    🌐 Mejor caso de uso DePIN — $300

Los micro-bounties están diseñados para incentivar experimentos, prototipos y pruebas de concepto que demuestren una funcionalidad específica de forma clara y creativa.

NOTA: Estos premios no son combinables con el track principal.

### 💰Arkiv- Prize $3500 - Track Principal

Crea el proyecto más robusto, sofisticado y técnicamente avanzado usando Arkiv como componente principal

Construí el proyecto más potente, pulido y técnicamente profundo usando Arkiv como componente central.

Buscamos aplicaciones que lleven Arkiv al límite y aporten insights reales sobre la experiencia de desarrollo (DevX).

Premios

🥇 1° Puesto - $2,000

🥈 2° Puesto - $1,000

🥉 3° Puesto - $500

Qué estamos buscando

Un proyecto que use Arkiv de manera profunda y significativa, no solo como un complemento.

Las propuestas ideales deberían:

    Utilizar 2 o más funcionalidades de Arkiv (ej.: CRUD + Query, anotaciones + filtros cross-entity)

    Llevar Arkiv al máximo de sus capacidades:

        Consultas avanzadas

        UX consciente del TTL

        Suscripciones en tiempo real

        Integraciones novedosas vía JSON-RPC

    Entregar feedback accionable para mejorar la DevX:

        Un runbook corto

        Problemas con pasos reproducibles

        Un documento de 1 página con puntos de fricción y sugerencias

    Presentar un demo completamente funcional

Entregables

    Demo público en vivo

    Repositorio público + README (uso, instalación e integración con Arkiv)

    Video demo de 2 a 3 minutos

Criterios de evaluación

    40% Técnica

    30% Producto

    30% Marketing / BD / GTM

Beneficios adicionales

    Mención destacada en las redes de Arkiv y en Builder Spotlight

    Soporte continuo del equipo después del hackathon

    Posible introducción al Golem Ecosystem Fund para futuras oportunidades de financiamiento

## 💰Crossmint - Prize $1500 - Mejor Proyecto integrando Crossmint

Cualquier proyecto que use Crossmint para pagos, custody, onramps o experiencias embedded Web3/Fintech.

Premios

💸 Mejor Proyecto de Fintech / Finanzas -💰$500

Cualquier desarrollo relacionado con fintech, stablecoins, pagos o herramientas financieras. ¡Sé creativo y generá impacto!

🤖 Mejor Caso de Uso en Agentic Commerce -💰$500

Construí flujos de comercio utilizando workflows agentic, x402, APIs de Crossmint o agentes autónomos dentro de una experiencia de compra.

📱 Mejor Experiencia de Usuario (UX) -💰$500

Gana el proyecto con la experiencia más intuitiva, fluida y pulida.Bonus: puntos extra para los proyectos mobile-first.

Requisitos para participar

    Tu proyecto debe utilizar una integración funcional de Crossmint (testnet está perfecto).

    Debe estar completo, operativo y desplegado para que podamos probarlo.

    Los ganadores serán seleccionados según creatividad, calidad de implementación, experiencia de usuario (UX) y uso de Crossmint.

    Integraciones incompletas o con errores pueden quedar descalificadas.

Nota: Si ningún proyecto alcanza el nivel mínimo de calidad, es posible que no se otorgue el premio. ¡Pero realmente queremos entregarlo! Acercate por ayuda, feedback o guía durante el evento, estamos para apoyarte.

## 💰Chroma Labs - Prize $1000 - Mejores proyectos usando Spark A1

Apps que unan diseño + Web3: identidad, branding, composables visuales o templates on-chain.

Premios

🥇 $500 — Best Complete DApp

A la aplicación descentralizada más innovadora y funcional construida usando Spark A1.

🥇 $300 — Most Innovative

Al mejor uso de las herramientas de auditoría de seguridad y análisis de smart contracts.

🥇 $200 — Best Use of Chroma Tools

Al uso más creativo e innovador de servidores MCP (documentación de protocolo, simulación de transacciones, validación de direcciones).
