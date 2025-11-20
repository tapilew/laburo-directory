`# Architectural Specification for Arkiv: The Decentralized Data Substrate of the Laburo Staked Recruitment Ecosystem1. Executive SummaryThe contemporary digital recruitment landscape faces a systemic crisis of signal-to-noise ratio, characterized by an overwhelming influx of low-intent applications and the proliferation of fraudulent professional identities. The Laburo project proposes a fundamental remediation of this failure through the introduction of a decentralized, staked recruitment directory. By mandating financial "skin-in-the-game"—cryptographic token staking—Laburo economically aligns the incentives of candidates and recruiters.This report details the exhaustive architectural specification for Arkiv, the decentralized database layer underpinning Laburo. Following the specifics of Golem's Arkiv L3 architecture, this system leverages JSON-based schema definitions rather than traditional SQL DDL to create a verifiable and privacy-preserving database infrastructure. The following analysis synthesizes the operational mechanics of Golem’s "DB-Chains," the Entity-Relationship (E/R) models, and the JSON implementations required for deployment.2. The Signal-to-Noise Crisis and the Decentralized ImperativeThe fundamental inefficiency of modern recruitment platforms lies in the zero-cost nature of application submission. Laburo’s "Staked Recruitment" model introduces friction—specifically, a financial stake denominated in ETH—which acts as a quality filter. A candidate must lock capital to remain visible, signaling high intent.2.1 The Data Sovereignty ChallengeImplementing this economic logic requires a database that respects the temporal nature of the stake. When a user stakes funds for 30 days, their data persistence must be inextricably linked to that financial commitment. Traditional centralized databases (AWS RDS) introduce trust assumptions, while static decentralized storage (IPFS) lacks queryability.Arkiv L3 addresses this by treating the database as a programmable, schema-defined service. By defining entities via JSON schemas with native ttl_field properties, Arkiv automates the lifecycle of data. When a stake expires, the underlying data layer respects the TTL and invalidates the record without centralized intervention.3. Golem Network Architecture: From Compute to DataTo rigorously define the Arkiv schema, one must first comprehend the computational substrate upon which it operates. The Golem Network facilitates the negotiation between Requestors (Laburo) and Providers (nodes offering resources).3.1 DB-Chains (Layer 3) and JSON SchemasThe Arkiv innovation introduces DB-Chains—modular, permissionless databases that function as Layer 3 protocols. Unlike traditional SQL databases where structure is defined via CREATE TABLE commands, Arkiv DB-Chains utilize a declarative JSON Schema submitted via the Arkiv SDK.Declarative Definition: Schemas are defined in JSON, specifying fields, types, and validation rules (e.g., regex for wallet addresses).Native Indexing: Fields marked indexed: true in the JSON definition are automatically optimized for query performance by the Golem provider.Automatic TTL: Expiration logic is handled at the protocol level by binding a timestamp field (e.g., expires_at) to the entity's time-to-live logic.4. Data Modeling Strategy: The Arkiv Entities SchemaThe design of the Arkiv schema balances normalization (reducing redundancy) with denormalization (optimizing for read-heavy query patterns).4.1 Visual Entity-Relationship (E/R) DiagramThe following diagram illustrates the relationships between the staked profiles, their private contact data, and the audit trail.mermaiderDiagramPublicProfile ||--|| PrivateContact : "has (1:1)"PublicProfile ||--|{ AuditEvent : "has (1:N)"PublicProfile {
    uint256 profile_id PK
    string wallet_address "Unique Owner"
    string role
    array skills "JSON tags"
    decimal stake_amount "Signal Strength"
    timestamp expires_at "TTL Field"
}

PrivateContact {
    uint256 profile_id FK
    string email "Gated/Encrypted"
    string telegram "Gated/Encrypted"
}

AuditEvent {
    uuid event_id PK
    uint256 profile_id FK
    enum type "UNLOCK | FLAG"
    string recruiter_wallet
    string tx_hash "Payment Proof"
    timestamp expires_at "TTL Field"
}

### 4.2 Conceptual Data Model (SQL Reference)

While Arkiv uses JSON for implementation, we maintain a SQL-based conceptual model for documentation rigor and to define strict relationship semantics.

*   **Identity:** `PublicProfile` is the parent entity.
*   **Privacy:** `PrivateContact` is a weak entity dependent on the profile.
*   **Audit:** `AuditEvent` is an append-only log.

*Note: This SQL is for logical reference only. Implementation uses the JSON in Section 5.*

```sql
-- CONCEPTUAL REFERENCE ONLY
CREATE TABLE PublicProfile (
    profile_id BIGINT PRIMARY KEY,
    wallet_address VARCHAR(42) UNIQUE, -- 1:1 constraint
    stake_amount DECIMAL(36, 18),
    expires_at TIMESTAMP -- Drives TTL
);

CREATE TABLE PrivateContact (
    profile_id BIGINT REFERENCES PublicProfile(profile_id),
    email VARCHAR(255)
);
```
5. Arkiv Implementation: JSON Schema DeliverableThe following JSON object constitutes the actual deployable code for the Laburo DB-Chain. This schema must be submitted to the Arkiv network via the SDK to instantiate the database.5.1 arkiv-schema.json
```
JSON{
  "entities":{40}$"
          }
        },
        {
          "name": "role",
          "type": "string",
          "maxLength": 100,
          "indexed": true
        },
        {
          "name": "skills",
          "type": "array",
          "items": {
            "type": "string"
          },
          "indexed": true
        },
        {
          "name": "summary",
          "type": "string",
          "maxLength": 500
        },
        {
          "name": "stake_amount",
          "type": "decimal",
          "precision": 18,
          "indexed": true
        },
        {
          "name": "created_at",
          "type": "timestamp"
        },
        {
          "name": "expires_at",
          "type": "timestamp",
          "indexed": true
        }
      ],
      "ttl_field": "expires_at"
    },
    {
      "name": "PrivateContact",
      "description": "Sensitive contact info. Only retrievable via x402 payment verification.",
      "fields": [
        {
          "name": "profile_id",
          "type": "uint256",
          "indexed": true,
          "foreignKey": {
            "entity": "PublicProfile",
            "field": "profile_id"
          }
        },
        {
          "name": "email",
          "type": "string"
        },
        {
          "name": "telegram",
          "type": "string"
        }
      ]
    },
    {
      "name": "AuditEvent",
      "description": "Immutable log of profile unlocks and flags.",
      "fields": [
        {
          "name": "event_id",
          "type": "uuid",
          "primary": true,
          "indexed": true
        },
        {
          "name": "profile_id",
          "type": "uint256",
          "indexed": true,
          "foreignKey": {
            "entity": "PublicProfile",
            "field": "profile_id"
          }
        },
        {
          "name": "type",
          "type": "enum",
          "values": ["UNLOCK", "FLAG"]
        },
        {
          "name": "recruiter_wallet",
          "type": "string",
          "indexed": true
        },
        {
          "name": "tx_hash",
          "type": "string",
          "unique": true
        },
        {
          "name": "evidence_url",
          "type": "string"
        },
        {
          "name": "created_at",
          "type": "timestamp"
        },
        {
          "name": "expires_at",
          "type": "timestamp"
        }
      ],
      "ttl_field": "expires_at"
    }
  ]
}
```
5.2 Schema Implementation NotesNative Types: We map Solidity types (uint256) directly in Arkiv to ensure seamless data consistency between the Smart Contract (GigRegistry) and the Database.Validation: The wallet_address field uses regex validation at the schema level to prevent malformed data ingestion.Declarative TTL: The property "ttl_field": "expires_at" on PublicProfile instructs the Arkiv node to auto-prune records. This replaces the need for cron jobs or complex stored procedures.Foreign Keys: The foreignKey object explicitly links PrivateContact to PublicProfile. In Arkiv's document-relational model, this ensures integrity when querying across entities.6. Interface Design: JSON-RPC and HTTP FlowThe interaction between the Laburo backend and Arkiv is mediated via JSON-RPC, sending structured payloads defined by the schema above.6.1 The "Unlock" Transaction FlowThe most complex interaction is the profile unlock, bridging the Blockchain, Backend, and Arkiv DB.Step 1: Payment (Layer 1/2)The Recruiter's client calls unlockProfile(profileId) on the GigRegistry contract.Step 2: x402 Gateway & Audit LoggingThe Backend detects the payment or receives the payment proof via the x402 protocol. It then constructs a JSON-RPC call to Arkiv to log the event:
```
JSON// JSON-RPC Request to Arkiv
{
  "jsonrpc": "2.0",
  "method": "arkiv_insert",
  "params": {
    "entity": "AuditEvent",
    "data": {
      "event_id": "uuid-generated-v4...",
      "profile_id": 101,
      "type": "UNLOCK",
      "recruiter_wallet": "0x123...",
      "tx_hash": "0xabc...",
      "expires_at": "2026-01-01T00:00:00Z"
    }
  },
  "id": 1
}
Step 3: Data RetrievalUpon successful audit logging, the backend requests the private contact data:JSON// JSON-RPC Request to Arkiv
{
  "jsonrpc": "2.0",
  "method": "arkiv_find",
  "params": {
    "entity": "PrivateContact",
    "query": {
      "profile_id": 101
    }
  },
  "id": 2
}
```
7. Security & EncryptionDespite the structured schema, Arkiv nodes are ultimately run by third-party Providers.Application-Layer Encryption: The email and telegram fields in PrivateContact must be stored as ciphertexts.Flow: The frontend encrypts these fields using a project-wide public key or a split-key mechanism before submission. The backend (or the recruiter's client) decrypts them only after the x402 payment validates the access rights.8. ConclusionThe Arkiv JSON Schema (v1) provides the definitive contract for the Laburo data layer. By moving from imperative SQL DDL to declarative JSON definitions, we leverage Arkiv's native capabilities for:Auto-Indexing: Optimizing skill-based searches (indexed: true).Auto-Expiration: Enforcing "skin-in-the-game" via ttl_field.Type Safety: Aligning database types (uint256, address) with the Ethereum logic.This schema is ready for immediate ingestion by the Arkiv SDK to provision the Laburo DB-Chain.
