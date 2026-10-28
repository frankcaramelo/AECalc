import { NormaTechnicalEntry, CalculationRecord } from '../types/domain';

export const INITIAL_NORMAS_ABNT: NormaTechnicalEntry[] = [
  {
    id: 'nbr-9050',
    code: 'ABNT NBR 9050:2020',
    title: 'Acessibilidade a edificações, mobiliário, espaços e equipamentos urbanos',
    committee: 'ABNT/CB-040 Acessibilidade',
    year: 2020,
    status: 'Vigente',
    domain: 'Arquitetura & Acessibilidade',
    summary:
      'Estabelece critérios e parâmetros técnicos a serem observados quanto ao projeto, construção, instalação e adaptação do meio urbano e rural, e de edificações às condições de acessibilidade.',
    parameters: [
      {
        item: 'Inclinação máxima de rampa (h ≤ 0,80 m)',
        requirement: 'Desnível máximo de 0,80 m por segmento, até 15 segmentos',
        formulaOrLimit: '6,25% < i ≤ 8,33% (1:12)',
        section: 'Seção 6.6.2.1 - Tabela 6'
      },
      {
        item: 'Inclinação intermediária de rampa (h ≤ 1,00 m)',
        requirement: 'Desnível máximo de 1,00 m por segmento, sem limite de segmentos',
        formulaOrLimit: '5,00% < i ≤ 6,25% (1:16)',
        section: 'Seção 6.6.2.1 - Tabela 6'
      },
      {
        item: 'Inclinação suave de rampa (h ≤ 1,50 m)',
        requirement: 'Desnível máximo de 1,50 m por segmento, sem limite de segmentos',
        formulaOrLimit: 'i ≤ 5,00% (1:20)',
        section: 'Seção 6.6.2.1 - Tabela 6'
      },
      {
        item: 'Dimensionamento de degraus em escadas',
        requirement: 'Espelho (e) entre 0,16 m e 0,18 m; Piso (p) entre 0,28 m e 0,32 m',
        formulaOrLimit: '0,63 m ≤ 2e + p ≤ 0,65 m',
        section: 'Seção 6.8.2'
      },
      {
        item: 'Módulo de referência (M.R.) e giro 360°',
        requirement: 'Projeção 0,80 m × 1,20 m; área de manobra para rotação 360° em sanitários',
        formulaOrLimit: 'Diâmetro livre Ø ≥ 1,50 m',
        section: 'Seção 4.2 / 4.3.2'
      },
      {
        item: 'Vão livre mínimo de portas',
        requirement: 'Largura livre mínima de passagem em portas de sanitários e ambientes',
        formulaOrLimit: 'Vão livre ≥ 0,80 m (folha ≥ 0,82 m)',
        section: 'Seção 6.11.2.4'
      }
    ],
    updateStrategyNote: 'Parametrização via arquivo JSON/YAML versionado (schema v2020.1) com injeção de dependência no motor de validação.'
  },
  {
    id: 'nbr-9077',
    code: 'ABNT NBR 9077:2001',
    title: 'Saídas de emergência em edifícios',
    committee: 'ABNT/CB-024 Segurança contra Incêndio',
    year: 2001,
    status: 'Vigente',
    domain: 'Segurança & Desempenho',
    summary:
      'Fixa as condições exigíveis que as edificações devem possuir a fim de que sua população possa abandoná-las, em caso de incêndio, completamente protegida em sua integridade física.',
    parameters: [
      {
        item: 'Unidade de passagem (UP) e largura mínima',
        requirement: '1 UP = 0,55 m; Largura mínima em rotas de fuga padrão = 2 UP',
        formulaOrLimit: 'N = P / (C × 0,55) ≥ 1,20 m',
        section: 'Seção 4.4.1'
      },
      {
        item: 'Fórmula de Blondel para escadas de emergência',
        requirement: 'Relação obrigatória entre altura do espelho (h) e largura do degrau (b)',
        formulaOrLimit: '0,63 m ≤ 2h + b ≤ 0,64 m (0,16 ≤ h ≤ 0,18 m)',
        section: 'Seção 4.7.3.1'
      },
      {
        item: 'Altura máxima entre patamares',
        requirement: 'Lanço máximo contínuo sem patamar intermediário de descanso',
        formulaOrLimit: 'H_lanço ≤ 3,20 m (ou 3,00 m conforme IT CB)',
        section: 'Seção 4.7.5'
      },
      {
        item: 'Altura mínima de guarda-corpos',
        requirement: 'Proteção contra quedas em escadas, varandas e mezaninos',
        formulaOrLimit: 'h_guarda ≥ 1,05 m (escadas internas 0,92 m)',
        section: 'Seção 4.8.1'
      }
    ],
    updateStrategyNote: 'Permite sobreposição de parâmetros regionais das Instruções Técnicas (IT) dos Corpos de Bombeiros Estaduais.'
  },
  {
    id: 'nbr-6120',
    code: 'ABNT NBR 6120:2019',
    title: 'Ações para o cálculo de estruturas de edificações',
    committee: 'ABNT/CB-002 Construção Civil',
    year: 2019,
    status: 'Revisada',
    domain: 'Estruturas & Fundações',
    summary:
      'Estabelece os valores de pesos específicos de materiais de construção e as cargas variáveis (sobrecargas de utilização) mínimas para o projeto estrutural de edificações.',
    parameters: [
      {
        item: 'Peso específico do concreto armado',
        requirement: 'Concreto com armadura usual para cálculo de peso próprio',
        formulaOrLimit: 'γ_conc = 25,0 kN/m³ (2.500 kgf/m³)',
        section: 'Tabela 1'
      },
      {
        item: 'Alvenaria de blocos cerâmicos vazados',
        requirement: 'Peso específico aparente médio incluindo revestimento argamassado',
        formulaOrLimit: 'γ_alv = 13,0 a 14,0 kN/m³',
        section: 'Tabela 2'
      },
      {
        item: 'Sobrecarga em edifícios residenciais (dormitórios/salas)',
        requirement: 'Carga variável vertical uniformemente distribuída em pisos residenciais',
        formulaOrLimit: 'q = 1,5 kN/m² (150 kgf/m²)',
        section: 'Tabela 10'
      },
      {
        item: 'Sobrecarga em escritórios, áreas comerciais e escadas',
        requirement: 'Carga variável para salas de uso geral, corredores e escadas coletivas',
        formulaOrLimit: 'q = 2,5 a 3,0 kN/m²',
        section: 'Tabela 10'
      }
    ],
    updateStrategyNote: 'Tabelas de densidade de materiais e sobrecargas de ocupação mantidas em catálogo estruturado atualizável.'
  },
  {
    id: 'nbr-6118',
    code: 'ABNT NBR 6118:2023',
    title: 'Projeto de estruturas de concreto — Procedimento',
    committee: 'ABNT/CB-002 Construção Civil',
    year: 2023,
    status: 'Vigente',
    domain: 'Estruturas & Fundações',
    summary:
      'Estabelece os requisitos básicos exigíveis para o projeto de estruturas de concreto simples, armado e protendido, incluindo classes de agressividade ambiental (CAA) e estados-limites.',
    parameters: [
      {
        item: 'Cobrimento nominal (CAA II — Urbana)',
        requirement: 'Proteção da armadura em ambiente urbano moderado',
        formulaOrLimit: 'Laje: 25 mm | Viga/Pilar: 30 mm | Solo: 30 mm',
        section: 'Tabela 7.2'
      },
      {
        item: 'Classe mínima de resistência do concreto (CAA II)',
        requirement: 'Concreto armado em classe de agressividade ambiental II',
        formulaOrLimit: 'f_ck ≥ 25 MPa (C25) e relação a/c ≤ 0,60',
        section: 'Tabela 7.1'
      },
      {
        item: 'Dimensão mínima de pilares e vigas',
        requirement: 'Seção transversal mínima permitida para elementos estruturais',
        formulaOrLimit: 'Pilar: b ≥ 19 cm (14 cm c/ γ_n) | Viga: b_w ≥ 12 cm',
        section: 'Seção 13.2.2 / 13.2.3'
      },
      {
        item: 'Espessura mínima de lajes maciças',
        requirement: 'Altura útil mínima conforme utilização da laje',
        formulaOrLimit: 'Cobertura: 7 cm | Piso: 8 cm | Garagem/Balanço: 10 cm',
        section: 'Seção 13.2.4.1'
      }
    ],
    updateStrategyNote: 'Versão 2023 sincronizada com coeficientes γ_n para pilares esbeltos e matriz de durabilidade CAA I a IV.'
  },
  {
    id: 'nbr-6492',
    code: 'ABNT NBR 6492:2021',
    title: 'Documentação técnica para projetos arquitetônicos e urbanísticos — Requisitos',
    committee: 'ABNT/CB-002 Construção Civil',
    year: 2021,
    status: 'Revisada',
    domain: 'Representação & Projetos',
    summary:
      'Estabelece os requisitos para representação gráfica e documentação técnica de projetos arquitetônicos e urbanísticos em meios físicos e digitais (incluindo diretrizes compatíveis com BIM).',
    parameters: [
      {
        item: 'Escalas usuais para Planta Baixa e Cortes',
        requirement: 'Representação de projeto executivo e projeto legal',
        formulaOrLimit: '1:50 (Executivo) | 1:100 (Legal/Anteprojeto)',
        section: 'Seção 5.3'
      },
      {
        item: 'Escalas para Detalhamento e Ampliações',
        requirement: 'Áreas molhadas, marcenaria, esquadrias e encontros construtivos',
        formulaOrLimit: '1:25, 1:20, 1:10, 1:5, 1:2',
        section: 'Seção 5.3'
      },
      {
        item: 'Altura do plano secante horizontal (Planta Baixa)',
        requirement: 'Plano horizontal imaginário que secciona o pavimento',
        formulaOrLimit: 'h ≈ 1,50 m acima do piso acabado',
        section: 'Seção 4.18'
      }
    ],
    updateStrategyNote: 'Suporte a templates de carimbo técnico A0–A4 e metadados compatíveis com ISO 19650 (BIM).'
  },
  {
    id: 'nbr-13532',
    code: 'ABNT NBR 13532:1995 / NBR 16636',
    title: 'Elaboração de projetos de edificações — Arquitetura',
    committee: 'ABNT/CB-002 Construção Civil',
    year: 2017,
    status: 'Vigente',
    domain: 'Representação & Projetos',
    summary:
      'Fixa as etapas sequenciais da elaboração de projetos de arquitetura de edificações (LV, PN, EP, AP, PL, PB, PE) e coordenação multidisciplinar com projetos complementares.',
    parameters: [
      {
        item: 'Fase 1: Levantamento (LV) e Programa de Necessidades (PN)',
        requirement: 'Dados topográficos, legislação urbanística (TO, CA, IP) e matriz de ambientes',
        formulaOrLimit: 'Validação preliminar de índices do lote',
        section: 'Seção 4.2 / 4.3'
      },
      {
        item: 'Fase 2: Estudo Preliminar (EP) e Anteprojeto (AP)',
        requirement: 'Concepção volumétrica, pré-dimensionamento estrutural e estimativa de custos',
        formulaOrLimit: 'Tolerância de áreas ±5%',
        section: 'Seção 4.4 / 4.5'
      },
      {
        item: 'Fase 3: Projeto Executivo (PE)',
        requirement: 'Quantitativos exatos de materiais, paginação de revestimentos e memoriais',
        formulaOrLimit: 'Precisão de quantitativos para orçamento executivo',
        section: 'Seção 4.7'
      }
    ],
    updateStrategyNote: 'Integrado com o fluxo da série ABNT NBR 16636-1 e NBR 16636-2 para fases de projeto.'
  },
  {
    id: 'nbr-15575',
    code: 'ABNT NBR 15575:2024',
    title: 'Edificações habitacionais — Desempenho (Partes 1 a 6)',
    committee: 'ABNT/CB-002 Construção Civil',
    year: 2024,
    status: 'Vigente',
    domain: 'Segurança & Desempenho',
    summary:
      'Estabelece os requisitos e critérios de desempenho (estrutural, segurança contra incêndio, estanqueidade, térmico, acústico, lumínico e durabilidade/VUP) para edificações habitacionais.',
    parameters: [
      {
        item: 'Vida Útil de Projeto Mínima (VUP — Estrutura e Fundações)',
        requirement: 'Nível Mínimo (M), Intermediário (I) e Superior (S)',
        formulaOrLimit: 'M ≥ 50 anos | I ≥ 63 anos | S ≥ 75 anos',
        section: 'Parte 1 - Tabela 7'
      },
      {
        item: 'Pé-direito mínimo em ambientes habitacionais',
        requirement: 'Altura livre entre piso acabado e teto',
        formulaOrLimit: 'h_pd ≥ 2,50 m (vestíbulos/banheiros ≥ 2,30 m)',
        section: 'Parte 1 - Funcionalidade'
      },
      {
        item: 'Desempenho acústico de vedações internas entre unidades',
        requirement: 'Diferença padronizada de nível ponderada (D_nT,w) entre apartamentos',
        formulaOrLimit: 'Dormitório/Dormitório: D_nT,w ≥ 45 dB',
        section: 'Parte 4 - Tabela E.1'
      },
      {
        item: 'Transmitância térmica de coberturas (Zonas 1 a 8)',
        requirement: 'Limite de transmitância térmica (U) para conforto no verão',
        formulaOrLimit: 'U ≤ 1,5 a 2,3 W/(m²·K) conforme absortância α',
        section: 'Parte 5 - Desempenho Térmico'
      }
    ],
    updateStrategyNote: 'Atualizado com as emendas de desempenho térmico e lumínico da NBR 15575:2021/2024.'
  }
];

export const INITIAL_CALCULATION_RECORDS: CalculationRecord[] = [
  {
    id: 'CALC-2026-001',
    timestamp: '28/10/2026 09:15',
    module: 'Arquitetura',
    category: 'Índices Urbanísticos',
    title: 'Estudo de Viabilidade Legal — Edifício Residencial Aurora',
    projectRef: 'PRJ-AURORA-EP01',
    author: 'Arq. Urb. Mariana Vasconcelos (CAU A148920-4)',
    inputs: [
      { label: 'Área do Lote', value: '600.00', unit: 'm²' },
      { label: 'Projeção da Edificação', value: '330.00', unit: 'm²' },
      { label: 'Área Construída Computável', value: '1680.00', unit: 'm²' },
      { label: 'Área Permeável Ajardinada', value: '132.00', unit: 'm²' }
    ],
    outputs: [
      { label: 'Taxa de Ocupação (TO)', value: '55.00', unit: '%', highlight: true },
      { label: 'Coeficiente de Aproveitamento (CA)', value: '2.80', unit: 'x', highlight: true },
      { label: 'Índice de Permeabilidade (IP)', value: '22.00', unit: '%', highlight: true }
    ],
    formulas: [
      'TO = (A_projecao / A_lote) × 100 = (330 / 600) × 100 = 55,00%',
      'CA = A_construida_comp / A_lote = 1680 / 600 = 2,80',
      'IP = (A_permeavel / A_lote) × 100 = (132 / 600) × 100 = 22,00%'
    ],
    normativeRefs: ['ABNT NBR 13532', 'ABNT NBR 6492:2021', 'Plano Diretor Municipal (ZM-3)'],
    complianceStatus: 'CONFORME',
    complianceNotes: 'TO ≤ 60%, CA ≤ 3,00 e IP ≥ 20% atendem integralmente os parâmetros urbanísticos da Zona Mista 3.'
  },
  {
    id: 'CALC-2026-002',
    timestamp: '28/10/2026 10:02',
    module: 'Engenharia',
    category: 'Escadas e Circulação Vertical',
    title: 'Escada Enclausurada Principal — Pavimento Tipo (H = 2,88 m)',
    projectRef: 'PRJ-AURORA-PE04',
    author: 'Eng. Civil Ricardo Albuquerque (CREA 5068912340)',
    inputs: [
      { label: 'Desnível Piso a Piso (H)', value: '288.00', unit: 'cm' },
      { label: 'Espelho Desejado (E_alvo)', value: '18.00', unit: 'cm' },
      { label: 'Piso Adotado (P)', value: '28.00', unit: 'cm' },
      { label: 'Largura Livre da Escada', value: '1.20', unit: 'm' }
    ],
    outputs: [
      { label: 'Número de Espelhos (n)', value: '16', unit: 'degraus', highlight: true },
      { label: 'Espelho Real (E)', value: '18.00', unit: 'cm', highlight: true },
      { label: 'Índice de Blondel (2E + P)', value: '64.00', unit: 'cm', highlight: true },
      { label: 'Comprimento Horizontal Total', value: '5.40', unit: 'm' }
    ],
    formulas: [
      'n = ceil(H / E_alvo) = 288 / 18 = 16 espelhos (15 pisos)',
      'E_real = H / n = 288 / 16 = 18,00 cm',
      'Blondel: 2E + P = 2(18,00) + 28,00 = 64,00 cm (Intervalo ideal: 63 a 64 cm)',
      'C_total = (n - 1) × P + L_patamar = 15 × 0,28 + 1,20 = 5,40 m'
    ],
    normativeRefs: ['ABNT NBR 9050:2020 (Seção 6.8.2)', 'ABNT NBR 9077:2001 (Seção 4.7.3)'],
    complianceStatus: 'CONFORME',
    complianceNotes: 'Fórmula de Blondel exata (64,00 cm), espelho de 18,00 cm e piso de 28,00 cm em conformidade com NBR 9050 e NBR 9077.'
  },
  {
    id: 'CALC-2026-003',
    timestamp: '28/10/2026 10:40',
    module: 'Engenharia',
    category: 'Concreto, Aço e Fundações',
    title: 'Quantitativo Estrutural e Sapata S4 — Eixo B3',
    projectRef: 'PRJ-AURORA-EST02',
    author: 'Eng. Civil Ricardo Albuquerque (CREA 5068912340)',
    inputs: [
      { label: 'Volume de Concreto C30', value: '18.50', unit: 'm³' },
      { label: 'Taxa Média de Armadura', value: '95.00', unit: 'kg/m³' },
      { label: 'Carga Axial Característica (N_k)', value: '650.00', unit: 'kN' },
      { label: 'Tensão Admissível do Solo (σ_adm)', value: '0.25', unit: 'MPa' }
    ],
    outputs: [
      { label: 'Consumo Total de Aço CA-50/60', value: '1757.50', unit: 'kg', highlight: true },
      { label: 'Cimento CP-II (Sacos 50 kg)', value: '129.50', unit: 'sacos' },
      { label: 'Área Mínima da Sapata (A_base)', value: '2.73', unit: 'm²', highlight: true },
      { label: 'Dimensão Adotada da Sapata', value: '1.65 × 1.65', unit: 'm' }
    ],
    formulas: [
      'M_aco = V_concreto × Taxa = 18,50 × 95,00 = 1.757,50 kg',
      'A_sapata = (1,05 × N_k) / (σ_adm × 1000) = (1,05 × 650) / 250 = 2,73 m²',
      'L_sapata = sqrt(2,73) = 1,65 m'
    ],
    normativeRefs: ['ABNT NBR 6118:2023', 'ABNT NBR 6122:2022', 'ABNT NBR 6120:2019'],
    complianceStatus: 'CONFORME',
    complianceNotes: 'Concreto C30 adequado para CAA II. Sapata quadrada de 1,65 × 1,65 m com h = 55 cm satisfaz critério de rigidez.'
  },
  {
    id: 'CALC-2026-004',
    timestamp: '28/10/2026 11:12',
    module: 'Arquitetura',
    category: 'Revestimentos e Paginação',
    title: 'Paginação de Porcelanato Retificado 90×90 cm — Pavimento Térreo',
    projectRef: 'PRJ-AURORA-PE09',
    author: 'Arq. Urb. Mariana Vasconcelos (CAU A148920-4)',
    inputs: [
      { label: 'Área Líquida de Piso', value: '142.00', unit: 'm²' },
      { label: 'Dimensão da Peça', value: '90 × 90', unit: 'cm' },
      { label: 'Junta de Assentamento', value: '2.0', unit: 'mm' },
      { label: 'Fator de Perda (Paginação Reta)', value: '10.0', unit: '%' }
    ],
    outputs: [
      { label: 'Área Total com Perda', value: '156.20', unit: 'm²', highlight: true },
      { label: 'Quantidade de Peças (90×90)', value: '193', unit: 'peças', highlight: true },
      { label: 'Argamassa Colante AC-III', value: '55', unit: 'sacos 20kg' },
      { label: 'Rejunte Flexível', value: '49.80', unit: 'kg' }
    ],
    formulas: [
      'A_total = A_liquida × (1 + Perda/100) = 142,00 × 1,10 = 156,20 m²',
      'N_pecas = ceil(156,20 / 0,81) = 193 unidades',
      'Argamassa AC-III (dupla colagem 7,0 kg/m²) = 156,20 × 7,0 = 1.093,4 kg (55 sacos 20kg)'
    ],
    normativeRefs: ['ABNT NBR 13753', 'ABNT NBR 14081', 'ABNT NBR 15575-3'],
    complianceStatus: 'CONFORME',
    complianceNotes: 'Peças com área > 900 cm² exigem dupla colagem com argamassa colante AC-III conforme NBR 13753.'
  }
];
