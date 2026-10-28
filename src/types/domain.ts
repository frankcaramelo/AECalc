export type CalculationModuleType = 'Científico' | 'Arquitetura' | 'Engenharia';

export type ComplianceStatus = 'CONFORME' | 'ATENÇÃO' | 'INFORMATIVO';

export interface CalculationMetric {
  label: string;
  value: string;
  unit?: string;
  highlight?: boolean;
}

export interface CalculationRecord {
  id: string;
  timestamp: string;
  module: CalculationModuleType;
  category: string;
  title: string;
  projectRef: string;
  author: string;
  inputs: CalculationMetric[];
  outputs: CalculationMetric[];
  formulas: string[];
  normativeRefs: string[];
  complianceStatus: ComplianceStatus;
  complianceNotes: string;
}

export interface NormativeParameter {
  item: string;
  requirement: string;
  formulaOrLimit: string;
  section: string;
}

export interface NormaTechnicalEntry {
  id: string;
  code: string;
  title: string;
  committee: string;
  year: number;
  status: 'Vigente' | 'Revisada';
  domain: 'Arquitetura & Acessibilidade' | 'Estruturas & Fundações' | 'Segurança & Desempenho' | 'Representação & Projetos';
  summary: string;
  parameters: NormativeParameter[];
  updateStrategyNote: string;
}

export interface PythonSourceFile {
  id: string;
  filename: string;
  layer: 'Domain' | 'Application' | 'Infrastructure' | 'Presentation (Tkinter TTK)' | 'Tests (Pytest)';
  description: string;
  linesOfCode: number;
  code: string;
}

export interface DeliverableSection {
  id: number;
  title: string;
  subtitle: string;
  category: 'Engenharia de Requisitos' | 'Arquitetura & Dados' | 'Implementação & Qualidade' | 'Estratégia & Evolução';
  content: string[];
  codeBlock?: string;
  tableData?: {
    headers: string[];
    rows: string[][];
  };
}
