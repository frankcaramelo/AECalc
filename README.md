# ArqEng TechCalc

Plataforma profissional de cálculos técnicos para Arquitetura, Urbanismo e Engenharia Civil com conformidade normativa ABNT/NBR, memoriais de cálculo auditáveis e arquitetura multiplataforma (Python 3.12 Desktop com Tkinter TTK + Web SPA/PWA em React 19 e TypeScript).

---

## Sumário dos 20 Capítulos

- [Capítulo 01: Visão Geral do Sistema](#capítulo-01-visão-geral-do-sistema)
- [Capítulo 02: Levantamento de Requisitos Funcionais (RF)](#capítulo-02-levantamento-de-requisitos-funcionais-rf)
- [Capítulo 03: Levantamento de Requisitos Não Funcionais (RNF)](#capítulo-03-levantamento-de-requisitos-não-funcionais-rnf)
- [Capítulo 04: Casos de Uso Detalhados (UC)](#capítulo-04-casos-de-uso-detalhados-uc)
- [Capítulo 05: Arquitetura da Aplicação (Clean Architecture & SOLID)](#capítulo-05-arquitetura-da-aplicação-clean-architecture--solid)
- [Capítulo 06: Organização Profissional das Pastas](#capítulo-06-organização-profissional-das-pastas)
- [Capítulo 07: Diagrama Textual dos Módulos e Fluxo de Dados](#capítulo-07-diagrama-textual-dos-módulos-e-fluxo-de-dados)
- [Capítulo 08: Tecnologias Recomendadas e Justificativa Técnica](#capítulo-08-tecnologias-recomendadas-e-justificativa-técnica)
- [Capítulo 09: Estrutura de Banco de Dados (Relacional + JSONB)](#capítulo-09-estrutura-de-banco-de-dados-relacional--jsonb)
- [Capítulo 10: Código-Fonte Completo da Primeira Versão (MVP)](#capítulo-10-código-fonte-completo-da-primeira-versão-mvp)
- [Capítulo 11: Testes Automatizados e Garantia de Qualidade](#capítulo-11-testes-automatizados-e-garantia-de-qualidade)
- [Capítulo 12: Documentação de Instalação Multiplataforma](#capítulo-12-documentação-de-instalação-multiplataforma)
- [Capítulo 13: Manual do Usuário — Operação Prática](#capítulo-13-manual-do-usuário--operação-prática)
- [Capítulo 14: Roadmap de Produto (V1, V2 e V3)](#capítulo-14-roadmap-de-produto-v1-v2-e-v3)
- [Capítulo 15: Estratégia para Versão Web e Convergência Desktop-Cloud](#capítulo-15-estratégia-para-versão-web-e-convergência-desktop-cloud)
- [Capítulo 16: Estratégia para Integração BIM (OpenBIM / IFC)](#capítulo-16-estratégia-para-integração-bim-openbim--ifc)
- [Capítulo 17: Estratégia para Integração com Autodesk Revit](#capítulo-17-estratégia-para-integração-com-autodesk-revit)
- [Capítulo 18: Estratégia para Inteligência Artificial Futura](#capítulo-18-estratégia-para-inteligência-artificial-futura)
- [Capítulo 19: Estratégia para Atualização Automática das Normas Técnicas](#capítulo-19-estratégia-para-atualização-automática-das-normas-técnicas)
- [Capítulo 20: Sugestões de Melhorias e Evolução do Produto](#capítulo-20-sugestões-de-melhorias-e-evolução-do-produto)

---

### Capítulo 01: Visão Geral do Sistema
**Subtítulo:** Concepção do produto, posicionamento técnico e proposta de valor para AEC (Arquitetura, Engenharia e Construção)

O **ArqEng TechCalc** é uma plataforma de engenharia de software voltada para cálculos técnicos deterministicamente auditáveis nas áreas de Arquitetura, Urbanismo e Engenharia Civil. Diferente de planilhas eletrônicas descentralizadas — que sofrem com erros silenciosos de fórmulas, ausência de controle de versão normativo e falta de rastreabilidade — a plataforma centraliza motores matemáticos validados segundo as normas vigentes da ABNT.

A arquitetura foi projetada sob o paradigma Multi-Runtime (Desktop Nativo em Python/Tkinter TTK para uso offline em canteiros de obras e escritórios, e Web SPA/PWA responsiva via API RESTful FastAPI + React/TypeScript), compartilhando um único núcleo de regras de negócio (Core Domain) 100% desacoplado da interface gráfica.

Cada operação gera uma memória de cálculo estruturada contendo os parâmetros de entrada, as equações explícitas aplicadas, os fatores de segurança ou perda adotados e o parecer automático de conformidade normativa (NBR 9050, NBR 9077, NBR 6118, NBR 6120, NBR 6492, NBR 13532 e NBR 15575).

---

### Capítulo 02: Levantamento de Requisitos Funcionais (RF)
**Subtítulo:** Especificação formal das capacidades dos 5 módulos do MVP

Os requisitos funcionais foram organizados por domínio de negócio, garantindo rastreabilidade direta entre cada requisito, seu serviço na camada de aplicação e sua suíte de testes automatizados.

| Código | Módulo | Requisito Funcional | Norma / Critério Técnico |
| :--- | :--- | :--- | :--- |
| **RF-01** | Científico | Executar operações aritméticas, potenciação, radiciação, logaritmos (ln, log10, base b) e fatorial. | IEEE 754 / Precisão Decimal |
| **RF-02** | Científico | Executar funções trigonométricas diretas, inversas e hiperbólicas com conversão DEG/RAD/GRAD. | Matemática Aplicada |
| **RF-03** | Arquitetura | Calcular índices urbanísticos: Taxa de Ocupação (TO), Coeficiente de Aproveitamento (CA) e Permeabilidade (IP). | NBR 13532 / Planos Diretores |
| **RF-04** | Arquitetura | Quantificar pisos, porcelanatos, cerâmicas, rodapés, argamassa colante (AC-I/II/III) e rejunte com perda. | NBR 13753 / NBR 14081 |
| **RF-05** | Arquitetura | Calcular pintura (massa, selador, tinta por demãos) e forro de gesso (placas, perfis F530, tirantes). | NBR 13245 / TCPO |
| **RF-06** | Arquitetura | Dimensionar preliminarmente ambientes (área mínima, iluminação 1/6 ou 1/8 e ventilação 1/2). | NBR 15575 / Código de Obras |
| **RF-07** | Engenharia | Dimensionar escadas pela Fórmula de Blondel (2E + P) e validar limites de espelho e piso. | NBR 9050 / NBR 9077 |
| **RF-08** | Engenharia | Calcular rampas acessíveis por faixa de inclinação (5%, 6,25%, 8,33%), patamares e segmentos. | NBR 9050 (Tabela 6) |
| **RF-09** | Engenharia | Calcular telhados (1 a 4 águas), área inclinada real, cumeeira, telhas e madeiramento. | NBR 15575-5 / NBR 7190 |
| **RF-10** | Engenharia | Quantificar volume de concreto, traço (cimento, areia, brita), aço, alvenaria e sapata isolada. | NBR 6118 / NBR 6120 / NBR 6122 |
| **RF-11** | Normas | Consultar catálogo de normas ABNT parametrizadas e permitir cadastro de novas revisões normativas. | ABNT Catálogo Técnico |
| **RF-12** | Relatórios | Registrar histórico de cálculos e exportar Memorial de Cálculo em PDF Técnico A4 e Excel (CSV). | NBR 6492 / ISO 19650 |

---

### Capítulo 03: Levantamento de Requisitos Não Funcionais (RNF)
**Subtítulo:** Qualidade de software, precisão numérica, portabilidade e manutenibilidade

- **RNF-01 (Portabilidade Multiplataforma):** O sistema deve operar nativamente em Windows 10/11, distribuições Linux (Ubuntu/Debian/Fedora), macOS (Intel/Apple Silicon) via Python 3.11+ / Tkinter TTK, além de navegadores Web modernos (Chrome, Edge, Firefox, Safari).
- **RNF-02 (Exatidão e Determinismo Matemático):** Todas as equações de engenharia devem evitar erros de truncamento prematuro, mantendo precisão interna de 64 bits (float64 / Decimal) e arredondamento normativo apenas na camada de apresentação.
- **RNF-03 (Desacoplamento Arquitetural — Clean Architecture):** A camada de Domínio e Aplicação não deve conter nenhuma importação de bibliotecas de UI (Tkinter, React) ou banco de dados, garantindo 100% de testabilidade unitária.
- **RNF-04 (Extensibilidade Normativa Open-Closed Principle):** A atualização de limites normativos (ex.: revisão da NBR 6118 ou NBR 9050) deve ocorrer via atualização de catálogo declarativo (JSON/Banco de Dados) sem necessidade de recompilar ou reescrever o motor de cálculo.
- **RNF-05 (Desempenho e Tempo de Resposta):** Qualquer cálculo individual e renderização de corte esquemático vetorial deve ocorrer em tempo inferior a 16 ms (60 FPS), mesmo em hardware modesto de obra.

---

### Capítulo 04: Casos de Uso Detalhados (UC)
**Subtítulo:** Fluxos principais e alternativos de interação dos atores técnicos

Atores Principais: Arquiteto e Urbanista, Engenheiro Civil, Técnico em Edificações, Estudante de Graduação e Coordenador de Projetos BIM.

| ID | Caso de Uso | Ator Principal | Fluxo Principal e Validação Normativa |
| :--- | :--- | :--- | :--- |
| **UC-01** | Validar Estudo Preliminar Urbanístico | Arquiteto / Urbanista | Informa área do lote, projeção, área total e área verde → Sistema calcula TO, CA e IP → Compara com limites da zona urbana e emite selo de conformidade. |
| **UC-02** | Dimensionar Escada e Rampa de Edifício | Arquiteto / Engenheiro | Informa desnível piso a piso → Sistema calcula número de degraus, ajusta espelho exato, aplica Blondel (2E+P) e gera desenho técnico cotado + validação NBR 9050/9077. |
| **UC-03** | Orçar Revestimentos, Pintura e Gesso | Técnico / Engenheiro | Informa dimensões dos ambientes e especificação da placa → Sistema calcula peças com perda de paginação, dupla colagem AC-III (se peça > 900 cm²), rejunte e rodapé. |
| **UC-04** | Pré-dimensionar Concreto, Aço e Sapata | Engenheiro Civil | Informa geometria estrutural, carga axial (kN) e tensão admissível do solo (MPa) → Sistema calcula volume de concreto, consumo de aço/cimento e base rígida da sapata. |
| **UC-05** | Emitir Memorial de Cálculo Auditável | Todos os Atores | Seleciona cálculos do histórico do projeto → Insere identificação técnica (ART/RRT) → Exporta documento formatado em PDF A4 ou planilha compatível com Excel. |

---

### Capítulo 05: Arquitetura da Aplicação (Clean Architecture & SOLID)
**Subtítulo:** Separação concêntrica de responsabilidades e padrões de projeto GoF aplicados

A solução adota Clean Architecture (Robert C. Martin) combinada com Domain-Driven Design (DDD) tático. As dependências apontam estritamente de fora para dentro: Presentation / Infrastructure → Application (Use Cases) → Domain (Entities & Value Objects).

- **Single Responsibility Principle (SRP):** Cada classe de serviço calcula um único subdomínio coeso (ex.: `StairCalculator`, `UrbanIndicesCalculator`, `ConcreteTakeoffCalculator`).
- **Open/Closed Principle (OCP) & Strategy Pattern:** O motor de validação normativa utiliza o padrão Strategy (`NormativeValidatorStrategy`), permitindo plugar regras da NBR 9050, NBR 9077 ou Códigos de Obras municipais sem alterar o fluxo do caso de uso.
- **Factory Method & Builder Pattern:** Utilizados na construção dos Memoriais de Cálculo (`ReportBuilder`), permitindo exportar o mesmo objeto `CalculationResult` para PDF A4, Excel/CSV ou JSON.
- **Repository Pattern & Dependency Inversion (DIP):** A camada de aplicação depende da abstração `CalculationRepositoryProtocol` (`typing.Protocol`), permitindo alternar transparentemente entre SQLite local (Desktop) e PostgreSQL (Web Cloud).

---

### Capítulo 06: Organização Profissional das Pastas
**Subtítulo:** Estrutura modular Python seguindo padrões PEP 517 / PEP 621 (pyproject.toml)

A organização de diretórios isola claramente o núcleo matemático (core), adaptadores de persistência, geradores de relatórios, interface desktop Tkinter e API Web FastAPI:

```text
arqeng-studio/
├── pyproject.toml                 # Configuração de build, dependências, ruff, mypy e pytest
├── README.md                      # Dossiê completo dos 20 capítulos de arquitetura
├── .env.example                   # Variáveis de ambiente (DB_URL, LOG_LEVEL)
├── data/
│   ├── normas_abnt_catalog.json   # Catálogo versionado de parâmetros ABNT/NBR
│   └── local_history.sqlite3      # Banco local para versão Desktop
├── src/
│   └── arqeng_calc/
│       ├── __init__.py
│       ├── domain/                # Camada 1: Entidades puras e Value Objects
│       │   ├── entities.py
│       │   ├── exceptions.py
│       │   └── unit_conversions.py
│       ├── application/           # Camada 2: Casos de Uso e Motores Matemáticos
│       │   ├── ports.py           # Interfaces (Protocols) de Repositório e Exportação
│       │   ├── scientific_service.py
│       │   ├── architecture_service.py
│       │   ├── engineering_service.py
│       │   └── normative_engine.py
│       ├── infrastructure/        # Camada 3: Persistência, PDF, Excel e JSON
│       │   ├── sqlite_repository.py
│       │   ├── normas_loader.py
│       │   ├── pdf_exporter.py    # ReportLab / WeasyPrint
│       │   └── excel_exporter.py  # OpenPyXL / CSV
│       └── presentation/          # Camada 4: Interfaces Gráficas (Desktop & Web API)
│           ├── desktop_tk/
│           │   ├── app_window.py
│           │   ├── views_scientific.py
│           │   ├── views_architecture.py
│           │   ├── views_engineering.py
│           │   └── canvas_blueprints.py
│           └── web_api/
│               ├── main_fastapi.py
│               └── schemas_pydantic.py
└── tests/                         # Suíte automatizada Pytest (Unitários + Integração)
    ├── unit/
    │   ├── test_scientific.py
    │   ├── test_architecture.py
    │   ├── test_engineering.py
    │   └── test_normas_nbr.py
    └── integration/
        └── test_report_export.py
```

---

### Capítulo 07: Diagrama Textual dos Módulos e Fluxo de Dados
**Subtítulo:** Topologia em camadas e comunicação entre componentes Desktop e Web

O diagrama abaixo ilustra como a interface Desktop (Tkinter TTK) e a interface Web (Browser SPA) consomem exatamente a mesma camada de Aplicação e Domínio:

```text
+-----------------------------------------------------------------------------------+
|                        CAMADA DE APRESENTAÇÃO (UI / CLIENTS)                      |
|  +-------------------------------------+   +-----------------------------------+  |
|  | Desktop GUI (Tkinter + TTK Themes)  |   | Web Browser SPA (React + TS)      |  |
|  | Windows / Linux / macOS             |   | via FastAPI REST / WebAssembly    |  |
|  +------------------+------------------+   +-----------------+-----------------+  |
+---------------------|----------------------------------------|--------------------+
                      | Chamada Direta                         | DTOs JSON (Pydantic)
                      v                                        v
+-----------------------------------------------------------------------------------+
|                        CAMADA DE APLICAÇÃO (USE CASES / SERVICES)                 |
|  +--------------------+  +-----------------------+  +--------------------------+  |
|  | ScientificService  |  | ArchitectureService   |  | EngineeringService       |  |
|  | - Trig / Hyperb    |  | - TO, CA, IP          |  | - Escadas (Blondel)      |  |
|  | - Log / Radiciação |  | - Pisos / Paginação   |  | - Rampas (NBR 9050)      |  |
|  | - Conversão Ângulo |  | - Pintura / Gesso     |  | - Telhados / Concreto    |  |
|  +---------+----------+  +-----------+-----------+  +------------+-------------+  |
|            |                         |                           |                |
|            +-------------------------+---------------------------+                |
|                                      |                                            |
|                                      v                                            |
|                     +---------------------------------+                           |
|                     | NormativeValidationEngine (OCP) |                           |
|                     | NBR 9050 | 9077 | 6118 | 15575  |                           |
|                     +----------------+----------------+                           |
+--------------------------------------|--------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------------+
|                        CAMADA DE DOMÍNIO (PURE ENTITIES)                          |
|     [ CalculationResult ]   [ StairDimensioningResult ]   [ NormaTechnical ]      |
+--------------------------------------|--------------------------------------------+
                                       | Protocols (DIP)
                                       v
+-----------------------------------------------------------------------------------+
|                        CAMADA DE INFRAESTRUTURA (ADAPTERS)                        |
|  [ SQLite / PostgreSQL Repo ]   [ PDF Memorial Exporter ]   [ Excel/CSV Engine ]  |
+-----------------------------------------------------------------------------------+
```

---

### Capítulo 08: Tecnologias Recomendadas e Justificativa Técnica
**Subtítulo:** Seleção criteriosa de bibliotecas Python e Web para máxima longevidade

A escolha da stack prioriza estabilidade em longo prazo, zero custo de licenciamento proprietário e facilidade de distribuição em múltiplos sistemas operacionais:

| Camada / Função | Tecnologia Principal | Alternativa / Complemento | Justificativa Arquitetural |
| :--- | :--- | :--- | :--- |
| **Linguagem Core** | Python 3.12+ | Type Hints + Mypy | Ecossistema científico maduro, tipagem estática gradual e legibilidade exemplar. |
| **UI Desktop Nativa** | Tkinter + TTK (sv-ttk) | ttkbootstrap | Nativo na biblioteca padrão Python, leve, multiplataforma (Win/Linux/macOS) e visual moderno. |
| **API & Backend Web** | FastAPI + Pydantic v2 | Uvicorn ASGI | Validação automática de payloads, geração nativa de OpenAPI/Swagger e altíssima performance. |
| **Frontend Web** | React 19 + TypeScript + Tailwind | Vite + Lucide Icons | Renderização reativa instantânea de cortes técnicos em SVG e tabelas com numerais tabulares. |
| **Banco de Dados** | SQLite 3 (Desktop) / PostgreSQL 16 (Web) | SQLAlchemy 2.0 + Alembic | Transição transparente entre arquivo local monoposto e banco corporativo multiusuário. |
| **Exportação Relatórios** | ReportLab (PDF) + OpenPyXL (Excel) | CSV UTF-8 BOM | Geração programática de memoriais A4 com carimbo ABNT NBR 6492 e planilhas orçamentárias. |
| **Qualidade & Testes** | Pytest + Hypothesis | Ruff (Linter/Formatter) | Testes baseados em propriedades matemáticas garantem ausência de regressões em fórmulas críticas. |

---

### Capítulo 09: Estrutura de Banco de Dados (Relacional + JSONB)
**Subtítulo:** Modelagem híbrida para projetos, memoriais de cálculo e versionamento de normas ABNT

Como cada ferramenta de cálculo possui parâmetros de entrada e saída específicos (ex.: uma escada possui espelho e piso; uma sapata possui carga axial e tensão do solo), a modelagem combina integridade relacional (Projetos, Usuários, Normas) com colunas JSONB tipadas para armazenar o payload exato de entradas e saídas:

```sql
-- DDL PostgreSQL 16 / Compatível com SQLite 3.45+ (JSON)

CREATE TABLE projects (
    id UUID PRIMARY KEY,
    code VARCHAR(32) NOT NULL UNIQUE,
    title VARCHAR(180) NOT NULL,
    client_name VARCHAR(150),
    municipality VARCHAR(100),
    responsible_engineer VARCHAR(150) NOT NULL,
    professional_registry VARCHAR(50) NOT NULL, -- CREA ou CAU
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE abnt_standards (
    id VARCHAR(32) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,           -- Ex: 'ABNT NBR 9050:2020'
    title VARCHAR(255) NOT NULL,
    publication_year SMALLINT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    rules_payload JSONB NOT NULL,               -- Limites parametrizados (ex: max_ramp_slope: 8.33)
    checksum_sha256 VARCHAR(64) NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE calculation_records (
    id VARCHAR(32) PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    module_type VARCHAR(20) NOT NULL,           -- 'Científico', 'Arquitetura', 'Engenharia'
    category VARCHAR(80) NOT NULL,
    title VARCHAR(200) NOT NULL,
    inputs_json JSONB NOT NULL,                 -- Entradas com unidades de medida
    outputs_json JSONB NOT NULL,                -- Resultados calculados
    formulas_applied JSONB NOT NULL,            -- Lista de equações auditáveis
    normative_refs JSONB NOT NULL,              -- Normas verificadas no momento do cálculo
    compliance_status VARCHAR(20) NOT NULL,     -- 'CONFORME', 'ATENÇÃO', 'NÃO CONFORME'
    compliance_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_calc_project_module ON calculation_records(project_id, module_type);
```

---

### Capítulo 10: Código-Fonte Completo da Primeira Versão (MVP)
**Subtítulo:** Implementação modular em Python 3.12 (disponível em `python_desktop_mvp/arqeng_studio_mvp.py` e no leitor interativo da aplicação)

O código-fonte completo do MVP Desktop/Core foi estruturado nos 5 módulos Python disponíveis no repositório:
1. `domain/entities.py`: Entidades imutáveis de domínio e Value Objects com Type Hints estritos (PEP 484).
2. `application/scientific_service.py`: Motor científico de alta precisão (trigonometria, hiperbólicas, logaritmos, radiciação, fatorial e conversão angular).
3. `application/architecture_service.py`: Serviços de Arquitetura e Urbanismo (TO, CA, IP, paginação de porcelanato, argamassa colante AC-III, rejunte, pintura, forro drywall e dimensionamento NBR 15575).
4. `application/engineering_service.py`: Serviços de Engenharia Civil (Fórmula de Blondel NBR 9050/9077, rampas acessíveis Tabela 6, coberturas, concreto armado NBR 6118, cargas NBR 6120, alvenaria e sapata isolada).
5. `presentation/tkinter_app.py`: Interface Gráfica Desktop Multiplataforma utilizando Tkinter + TTK Modern Themes (`sv-ttk`).

Além do código Python para execução local, toda a plataforma Web interativa em execução neste repositório implementa 100% das fórmulas em tempo real nos módulos Científico, Arquitetura, Engenharia, Normas ABNT e Relatórios.

---

### Capítulo 11: Testes Automatizados e Garantia de Qualidade
**Subtítulo:** Estratégia de testes unitários, testes parametrizados e validação de fronteira normativa

Em software de engenharia civil e arquitetura, um erro de arredondamento ou inversão de fator pode comprometer o dimensionamento de uma saída de emergência ou o orçamento de uma obra. Por isso, aplicamos TDD (Test-Driven Development) nas equações normativas:

1. **Testes de Equivalência e Valor Limite (Boundary Value Analysis):** Testam exatamente os limiares das normas (ex.: inclinação de rampa em 5,00%, 5,01%, 6,25%, 8,33% e 8,34% segundo a Tabela 6 da NBR 9050).
2. **Testes de Invariantes Físicas:** Verificam que a área inclinada de um telhado com inclinação > 0% é sempre estritamente maior que sua área de projeção horizontal.
3. **Cobertura Mínima Exigida no CI/CD:** 95% de cobertura de linhas e branches na camada domain e application.

---

### Capítulo 12: Documentação de Instalação Multiplataforma
**Subtítulo:** Guia passo a passo para Windows, Linux, macOS e geração de executável standalone

A instalação do ambiente Python Desktop e a compilação de binários nativos (sem exigir Python instalado no computador do cliente final) seguem o fluxo padronizado abaixo:

```bash
# 1. Clonar o repositório e criar ambiente virtual isolado (Python 3.11 ou 3.12)
git clone https://github.com/org/arqeng-studio.git
cd arqeng-studio
python3 -m venv .venv

# 2. Ativar o ambiente virtual
# No Linux / macOS:
source .venv/bin/activate
# No Windows (PowerShell):
.venv\Scripts\Activate.ps1

# 3. Instalar dependências de produção e desenvolvimento
pip install --upgrade pip
pip install sv-ttk openpyxl reportlab fastapi uvicorn pytest pytest-cov mypy ruff

# 4. Executar a suíte de testes automatizados antes de iniciar
pytest -v

# 5. Iniciar a interface gráfica Desktop (Tkinter TTK)
python -m arqeng_calc.presentation.tkinter_app

# 6. Gerar executável único (.exe no Windows / .app no macOS / AppImage no Linux)
pip install pyinstaller
pyinstaller --noconfirm --onefile --windowed --name "ArqEngStudio" \
    --add-data "data/normas_abnt_catalog.json:data" \
    src/arqeng_calc/presentation/tkinter_app.py
```

---

### Capítulo 13: Manual do Usuário — Operação Prática
**Subtítulo:** Fluxo operacional passo a passo para estudantes, arquitetos e engenheiros

- **Passo 1 — Seleção do Módulo:** Na barra superior ou menu de navegação, escolha entre Módulo Científico, Módulo Arquitetura, Módulo Engenharia, Normas ABNT ou Memorial & Arquitetura.
- **Passo 2 — Entrada Paramétrica Assistida:** Insira as grandezas nas unidades indicadas em cada campo (metros, centímetros, MPa, kN). Os cálculos e os diagramas vetoriais em corte/planta são atualizados instantaneamente.
- **Passo 3 — Verificação de Conformidade ABNT:** Observe o indicador técnico de conformidade (CONFORME ou ATENÇÃO). Caso algum parâmetro viole uma recomendação normativa (ex.: espelho de escada > 18 cm na NBR 9050 ou peça de porcelanato > 900 cm² exigindo argamassa AC-III na NBR 13753), o sistema exibe a justificativa técnica exata.
- **Passo 4 — Registro no Memorial de Cálculo:** Clique em "Registrar no Memorial" em qualquer ferramenta para adicionar o cálculo ao histórico do projeto atual.
- **Passo 5 — Exportação Oficial:** Acesse o módulo "Memorial & Arquitetura", filtre os cálculos do projeto e clique em "Exportar CSV (Excel)" ou "Imprimir / Salvar PDF A4" para gerar o documento técnico pronto para anexar à ART/RRT.

---

### Capítulo 14: Roadmap de Produto (V1, V2 e V3)
**Subtítulo:** Planejamento evolutivo de entregas de valor técnico e comercial

O desenvolvimento evolutivo do produto está dividido em três horizontes estratégicos:

| Versão | Horizonte | Escopo Técnico Principal | Público-Alvo Foco |
| :--- | :--- | :--- | :--- |
| **V1 (MVP Atual)** | Mês 1 a 3 | Módulos Científico, Arquitetura (TO/CA/IP, Pisos, Pintura, Gesso, Ambientes), Engenharia (Escadas, Rampas, Telhados, Concreto, Alvenaria, Sapatas), Catálogo ABNT e Exportação PDF/CSV. | Estudantes, Arquitetos Autônomos e Engenheiros de Obra |
| **V2 (Cloud & Orçamento)** | Mês 4 a 8 | Sincronização em nuvem multiusuário, integração direta com tabelas SINAPI / TCPO para precificação automática de materiais, pré-dimensionamento de vigas isostáticas e reservatórios de água (NBR 5626). | Escritórios de Arquitetura, Construtoras e Orçamentistas |
| **V3 (Ecossistema BIM & IA)** | Mês 9 a 14 | Leitura direta de arquivos IFC 4.3 (IfcOpenShell), plugin nativo dentro do Autodesk Revit (pyRevit), assistente normativo baseado em RAG sobre normas ABNT e legislação urbanística municipal. | Incorporadoras, Coordenadores BIM e Grandes Projetos |

---

### Capítulo 15: Estratégia para Versão Web e Convergência Desktop-Cloud
**Subtítulo:** Arquitetura híbrida Python FastAPI + React/TypeScript e opção Pyodide (WebAssembly)

Para garantir que o código escrito para a versão Desktop Python não precise ser reescrito ao escalar para a Web, adotamos duas frentes complementares:

1. **Backend API-First com FastAPI:** Os serviços Python da camada Application (`ScientificCalculatorService`, `ArchitectureCalculationService`, `EngineeringCalculationService`) são expostos como endpoints RESTful via FastAPI com validação Pydantic v2. O frontend React consome esses endpoints ou executa os cálculos localmente em modo offline-first (PWA).
2. **Execução Client-Side via Pyodide (WebAssembly):** Como a camada de Domínio e Aplicação em Python usa apenas a biblioteca padrão (`math`, `dataclasses`, `enum`, `decimal`), os mesmos módulos `.py` podem rodar diretamente dentro do navegador Web via WebAssembly (Pyodide), garantindo paridade matemática bit-a-bit entre Desktop e Web sem latência de rede.

---

### Capítulo 16: Estratégia para Integração BIM (OpenBIM / IFC)
**Subtítulo:** Extração automatizada de quantitativos QTO (Quantity Take-Off) via IfcOpenShell

Na metodologia BIM (Building Information Modeling — ABNT NBR ISO 19650), o engenheiro não deve redigitar áreas de ambientes ou volumes de pilares manualmente se o modelo federado já existir. A integração OpenBIM em Python utiliza a biblioteca open-source `IfcOpenShell`:

- **Leitura de IfcSpace:** Extrai automaticamente área líquida de piso, perímetro e altura de cada ambiente para alimentar o Módulo de Arquitetura (Porcelanato, Rodapé, Pintura e Forro de Gesso).
- **Leitura de IfcSlab, IfcBeam, IfcColumn e IfcFooting:** Extrai volumes líquidos de concreto e áreas de fôrma diretamente do arquivo `.ifc` para o Módulo de Engenharia.
- **Injeção de Property Sets (Psets):** Grava de volta no arquivo IFC os resultados calculados (ex.: `Pset_ArqEng_Compliance` com o índice de Blondel validado em cada `IfcStairFlight`).

---

### Capítulo 17: Estratégia para Integração com Autodesk Revit
**Subtítulo:** Plugin nativo em Python utilizando pyRevit e Revit API

Como toda a lógica de negócio da plataforma foi desenvolvida em Python modular, a integração com o Autodesk Revit é imediata através do framework pyRevit:

1. **Barra de Ferramentas Customizada (Ribbon Tab "ArqEng Studio"):** Adicionada diretamente na interface do Revit.
2. **Auditoria de Escadas e Rampas em 1 Clique:** O usuário seleciona uma escada ou rampa modelada no Revit; o script captura os parâmetros `BuiltInParameter.STAIRS_ACTUAL_RISER_HEIGHT` e `STAIRS_ACTUAL_TREAD_DEPTH`, envia para `EngineeringCalculationService.calculate_stair()` e destaca em verde ou vermelho os elementos que violam a NBR 9050 ou NBR 9077.
3. **Preenchimento Automático de Tabelas (Schedules):** Os consumos de argamassa colante AC-III, rejunte e aço calculados pelo motor Python são gravados em Shared Parameters do projeto Revit.

---

### Capítulo 18: Estratégia para Inteligência Artificial Futura
**Subtítulo:** Arquitetura híbrida Neuro-Simbólica: LLMs com RAG Normativo + Motor Matemático Determinístico

**Regra de Ouro em Engenharia:** Modelos de linguagem (LLMs) NUNCA devem executar cálculos estruturais ou aritméticos diretamente devido ao risco de alucinação numérica. Nossa arquitetura de IA é estritamente Neuro-Simbólica (Function Calling + RAG):

1. **RAG (Retrieval-Augmented Generation) sobre Normas e Códigos de Obras:** Vetorização semântica de cláusulas normativas e Planos Diretores municipais para responder dúvidas consultivas citando o item e a tabela exata da norma.
2. **Tool Calling Determinístico:** Quando o usuário descreve um problema em linguagem natural, a IA apenas extrai os parâmetros estruturados (JSON) e invoca as funções determinísticas em Python do ArqEng Studio, devolvendo o memorial de cálculo matematicamente exato.

---

### Capítulo 19: Estratégia para Atualização Automática das Normas Técnicas
**Subtítulo:** Desacoplamento de regras normativas (Rule Engine) e sincronização OTA assinada digitalmente

As normas da ABNT passam por revisões periódicas (como a NBR 6118:2023 e NBR 15575:2024). Para evitar que os profissionais utilizem parâmetros defasados:

1. **Catálogo Declarativo Versionado (JSON Schema):** Todos os coeficientes, limites de inclinação, cobrimentos mínimos e pesos específicos ficam armazenados em arquivos de manifesto normativo (`normas_abnt_catalog.json`) fora do código-fonte.
2. **Verificação de Manifesto Remoto (OTA Updates):** Ao iniciar, a aplicação consulta o endpoint de metadados normativos, compara o hash SHA-256 do catálogo local e baixa novas revisões homologadas pelo corpo técnico.
3. **Imutabilidade Histórica de Memoriais:** Cada cálculo salvo no histórico preserva o snapshot exato da versão da norma vigente na data de sua emissão (ex.: NBR 9050:2020), garantindo segurança jurídica para auditorias futuras.

---

### Capítulo 20: Sugestões de Melhorias e Evolução do Produto
**Subtítulo:** Diferenciais competitivos para consolidação como líder de mercado em tecnologia AEC

1. **Modo Canteiro de Obras (PWA Offline + QR Code na Prancha):** Geração automática de um QR Code no carimbo do Memorial PDF que permite ao mestre de obras ou engenheiro residente abrir a memória de cálculo exata daquele elemento no celular.
2. **Biblioteca de Traços Regionais e Insumos Reais:** Cadastro de traços de concreto e argamassa calibrados por região brasileira e integração com catálogos de fabricantes de revestimentos e tintas.
3. **Módulo de Sustentabilidade e Pegada de Carbono (Embodied Carbon):** Cálculo automático das emissões de CO2 equivalente (kgCO2e) associadas ao consumo de cimento, aço e cerâmica de cada estudo preliminar, alinhado às certificações LEED, AQUA-HQE e Selo Casa Azul.
4. **Colaboração em Tempo Real e Assinatura Digital ICP-Brasil:** Fluxo de aprovação técnica onde o autor do cálculo submete o memorial para revisão de um engenheiro sênior com assinatura digital padrão ICP-Brasil.
