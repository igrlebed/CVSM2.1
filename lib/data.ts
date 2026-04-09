// Domain data for Цифровая модель ВСМ

export type ProjectType = 'vsm' | 'sm' | 'international' | 'in-progress';

// Scenario types for Constructor
export type ScenarioStatus = 
  | 'draft' 
  | 'validation-error' 
  | 'ready-for-review' 
  | 'needs-revision'
  | 'approved' 
  | 'published' 
  | 'archived';

export interface Scenario {
  id: string;
  name: string;
  status: ScenarioStatus;
  isBase: boolean;
  description?: string;
  projectIds: string[];
  networkLength: number;
  totalInvestment: number;
  gdpEffect: number;
  passengerFlow: number;
  population: number;
  rollingStock: number;
  author: string;
  createdAt: string;
  lastModified: string;
  version: number;
  validationIssues?: string[];
  hasUnsavedChanges?: boolean;
  publishedVisibility?: 'approved' | 'in-development' | 'experimental';
  
  // Review workflow metadata
  submittedAt?: string;
  submittedBy?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewComment?: string;
}

export interface ScenarioVersion {
  id: string;
  scenarioId: string;
  version: number;
  date: string;
  author: string;
  comment: string;
  status: ScenarioStatus;
}

export const scenarios: Scenario[] = [
  {
    id: 'base',
    name: 'Базовый',
    status: 'published',
    isBase: true,
    description: 'Официальный базовый сценарий развития сети ВСМ до 2050 года',
    projectIds: ['msk-spb', 'msk-ryazan', 'msk-ekb', 'msk-belgorod', 'msk-yaroslavl', 'msk-adler', 'msk-kazan', 'msk-nnov'],
    networkLength: 6168,
    totalInvestment: 12400,
    gdpEffect: 9900,
    passengerFlow: 92.9,
    population: 149.9,
    rollingStock: 230,
    author: 'Система',
    createdAt: '2024-01-01',
    lastModified: '2026-03-15',
    version: 12,
    publishedVisibility: 'approved',
  },
  {
    id: 'alt-1',
    name: 'Альтернатива 1',
    status: 'ready-for-review',
    isBase: false,
    description: 'Ускоренная реализация с приоритетом Москва-Казань',
    projectIds: ['msk-spb', 'msk-ryazan', 'msk-kazan', 'msk-nnov', 'msk-belgorod'],
    networkLength: 4720,
    totalInvestment: 8450,
    gdpEffect: 6800,
    passengerFlow: 68.4,
    population: 98.2,
    rollingStock: 156,
    author: 'Иванов А.С.',
    createdAt: '2026-02-10',
    lastModified: '2026-03-28',
    version: 5,
    submittedAt: '2026-04-09T10:00:00Z',
    submittedBy: 'Иванов А.С.',
  },
  {
    id: 'alt-2',
    name: 'Альтернатива 2',
    status: 'draft',
    isBase: false,
    description: 'Фокус на южном направлении',
    projectIds: ['msk-spb', 'msk-adler', 'msk-belgorod'],
    networkLength: 2875,
    totalInvestment: 5340,
    gdpEffect: 4630,
    passengerFlow: 47.7,
    population: 72.8,
    rollingStock: 112,
    author: 'Петрова Е.В.',
    createdAt: '2026-03-01',
    lastModified: '2026-04-02',
    version: 2,
    hasUnsavedChanges: true,
  },
  {
    id: 'archived-scenario',
    name: 'Архивный сценарий',
    status: 'archived',
    isBase: false,
    description: 'Устаревший сценарий 2024 года',
    projectIds: ['msk-spb', 'msk-ryazan'],
    networkLength: 875,
    totalInvestment: 1800,
    gdpEffect: 2270,
    passengerFlow: 31.7,
    population: 35.2,
    rollingStock: 54,
    author: 'Сидоров К.М.',
    createdAt: '2024-06-15',
    lastModified: '2024-12-01',
    version: 8,
  },
  {
    id: 'draft-1',
    name: 'Черновик',
    status: 'validation-error',
    isBase: false,
    description: 'Новый сценарий в разработке',
    projectIds: ['msk-spb', 'msk-ekb', 'msk-minsk'],
    networkLength: 3129,
    totalInvestment: 7190,
    gdpEffect: 5940,
    passengerFlow: 48.7,
    population: 84.7,
    rollingStock: 124,
    author: 'Козлов Д.А.',
    createdAt: '2026-03-20',
    lastModified: '2026-04-05',
    version: 1,
    validationIssues: [
      'Не указан источник данных для проекта Москва – Минск',
      'Пересечение сроков реализации проектов',
      'Недостаточный парк подвижного состава',
    ],
    hasUnsavedChanges: true,
  },
];

export const scenarioVersions: ScenarioVersion[] = [
  { id: 'v-base-12', scenarioId: 'base', version: 12, date: '2026-03-15', author: 'Система', comment: 'Обновление данных по проекту МСК-СПБ', status: 'published' },
  { id: 'v-base-11', scenarioId: 'base', version: 11, date: '2026-02-28', author: 'Система', comment: 'Корректировка инвестиций', status: 'published' },
  { id: 'v-base-10', scenarioId: 'base', version: 10, date: '2026-01-15', author: 'Система', comment: 'Добавлен проект МСК-Н.Новгород', status: 'published' },
  { id: 'v-alt1-5', scenarioId: 'alt-1', version: 5, date: '2026-03-28', author: 'Иванов А.С.', comment: 'Готов к рассмотрению', status: 'ready-for-review' },
  { id: 'v-alt1-4', scenarioId: 'alt-1', version: 4, date: '2026-03-20', author: 'Иванов А.С.', comment: 'Исправлены ошибки валидации', status: 'draft' },
];

export function getScenarioStatusLabel(status: ScenarioStatus): string {
  switch (status) {
    case 'draft': return 'Черновик';
    case 'validation-error': return 'Ошибки валидации';
    case 'ready-for-review': return 'Готов к рассмотрению';
    case 'needs-revision': return 'Требуется доработка';
    case 'approved': return 'Одобрен';
    case 'published': return 'Опубликован';
    case 'archived': return 'Архивный';
  }
}

// Archive types
export type ArchiveItemType = 'scenario' | 'export' | 'decision';

export interface ArchiveItem {
  id: string;
  type: ArchiveItemType;
  name: string;
  description?: string;
  archivedAt: string;
  archivedBy: string;
  originalCreatedAt: string;
  size?: string;
  canRestore: boolean;
}

export const archiveItems: ArchiveItem[] = [
  { id: 'arch-1', type: 'scenario', name: 'Архивный сценарий', description: 'Устаревший сценарий 2024 года', archivedAt: '2024-12-01', archivedBy: 'Сидоров К.М.', originalCreatedAt: '2024-06-15', canRestore: true },
  { id: 'arch-2', type: 'export', name: 'Отчёт Q3 2025', description: 'Квартальный отчёт по сети ВСМ', archivedAt: '2025-10-15', archivedBy: 'Система', originalCreatedAt: '2025-09-30', size: '4.2 МБ', canRestore: false },
  { id: 'arch-3', type: 'decision', name: 'Решение №142', description: 'Утверждение маршрута МСК-Рязань', archivedAt: '2025-08-20', archivedBy: 'Петрова Е.В.', originalCreatedAt: '2025-08-01', canRestore: true },
  { id: 'arch-4', type: 'export', name: 'Сравнение сценариев v2', description: 'Сравнительный анализ альтернатив', archivedAt: '2025-11-10', archivedBy: 'Иванов А.С.', originalCreatedAt: '2025-11-05', size: '2.8 МБ', canRestore: false },
  { id: 'arch-5', type: 'scenario', name: 'Тестовый сценарий', description: 'Пробный расчёт модели', archivedAt: '2025-06-01', archivedBy: 'Козлов Д.А.', originalCreatedAt: '2025-05-15', canRestore: true },
];

// Export types
export type ExportEntityType = 'project' | 'project-comparison' | 'scenario' | 'scenario-comparison' | 'executive-summary' | 'map' | 'ranking';
export type ExportFormat = 'xlsx' | 'docx' | 'pdf' | 'pptx';
export type ExportStatus = 'queued' | 'in-progress' | 'ready' | 'failed';

export interface ExportJob {
  id: string;
  entityType: ExportEntityType;
  entityName: string;
  format: ExportFormat;
  status: ExportStatus;
  createdAt: string;
  completedAt?: string;
  size?: string;
  progress?: number;
  error?: string;
}

export const recentExports: ExportJob[] = [
  { id: 'exp-1', entityType: 'scenario', entityName: 'Базовый сценарий', format: 'xlsx', status: 'ready', createdAt: '2026-04-05 14:30', completedAt: '2026-04-05 14:32', size: '1.8 МБ' },
  { id: 'exp-2', entityType: 'project-comparison', entityName: 'Сравнение: МСК-СПБ, МСК-Казань', format: 'pdf', status: 'ready', createdAt: '2026-04-05 12:15', completedAt: '2026-04-05 12:16', size: '3.2 МБ' },
  { id: 'exp-3', entityType: 'executive-summary', entityName: 'Executive Summary Q1 2026', format: 'pptx', status: 'in-progress', createdAt: '2026-04-05 16:00', progress: 65 },
  { id: 'exp-4', entityType: 'map', entityName: 'Карта сети 2050', format: 'pdf', status: 'queued', createdAt: '2026-04-05 16:05' },
  { id: 'exp-5', entityType: 'ranking', entityName: 'Ранжирование проектов', format: 'xlsx', status: 'failed', createdAt: '2026-04-04 10:00', error: 'Недостаточно данных для формирования отчёта' },
];

export function getExportEntityTypeLabel(type: ExportEntityType): string {
  switch (type) {
    case 'project': return 'Проект';
    case 'project-comparison': return 'Сравнение проектов';
    case 'scenario': return 'Сценарий';
    case 'scenario-comparison': return 'Сравнение сценариев';
    case 'executive-summary': return 'Executive Summary';
    case 'map': return 'Карта';
    case 'ranking': return 'Ранжирование';
  }
}

export function getExportStatusLabel(status: ExportStatus): string {
  switch (status) {
    case 'queued': return 'В очереди';
    case 'in-progress': return 'Формируется';
    case 'ready': return 'Готов';
    case 'failed': return 'Ошибка';
  }
}

export type ProjectStatus = 
  | 'approved' 
  | 'in-progress' 
  | 'in-development' 
  | 'experimental' 
  | 'archived' 
  | 'international';

export interface RouteProject {
  id: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  length: number; // km
  gdpEffect: number; // млрд ₽
  investment: number; // млрд ₽
  passengerFlow: number; // млн чел/год
  population: number; // млн чел
  rollingStock: number; // составов
  startYear: number;
  endYear: number;
  stages?: {
    name: string;
    year: number;
    length: number;
  }[];
  coordinates: {
    start: [number, number];
    end: [number, number];
    via?: [number, number][];
  };
  // Extended fields for Projects workspace
  isInternational?: boolean;
  isStaged?: boolean;
  scenarios?: string[];
  dataSource?: string;
  lastUpdated?: string;
  hasMissingData?: boolean;
  // Traffic and technical
  trainsPerDay?: number;
  maxSpeed?: number;
  stops?: number;
  bridges?: number;
  tunnels?: number;
  viaducts?: number;
  // Investment breakdown
  infraInvestment?: number;
  rollingStockInvestment?: number;
  // Social effects
  jobsCreated?: number;
  taxRevenue?: number;
  accessibilityImprovement?: number;
}

export const projects: RouteProject[] = [
  {
    id: 'msk-spb',
    name: 'Москва – Санкт-Петербург',
    type: 'in-progress',
    status: 'in-progress',
    length: 679,
    gdpEffect: 1850,
    investment: 1420,
    passengerFlow: 23.5,
    population: 28.4,
    rollingStock: 42,
    startYear: 2024,
    endYear: 2028,
    coordinates: { start: [55.7558, 37.6173], end: [59.9343, 30.3351] },
    isInternational: false,
    isStaged: false,
    scenarios: ['Базовый', 'Оптимистичный'],
    dataSource: 'ОАО «РЖД»',
    lastUpdated: '2026-03-15',
    hasMissingData: false,
    trainsPerDay: 48,
    maxSpeed: 400,
    stops: 4,
    bridges: 12,
    tunnels: 2,
    viaducts: 8,
    infraInvestment: 1120,
    rollingStockInvestment: 300,
    jobsCreated: 45000,
    taxRevenue: 280,
    accessibilityImprovement: 34,
  },
  {
    id: 'msk-ryazan',
    name: 'Москва – Рязань',
    type: 'vsm',
    status: 'approved',
    length: 196,
    gdpEffect: 420,
    investment: 380,
    passengerFlow: 8.2,
    population: 6.8,
    rollingStock: 12,
    startYear: 2030,
    endYear: 2033,
    coordinates: { start: [55.7558, 37.6173], end: [54.6269, 39.6916] },
    isInternational: false,
    isStaged: false,
    scenarios: ['Базовый'],
    dataSource: 'Минтранс',
    lastUpdated: '2026-02-28',
    hasMissingData: false,
    trainsPerDay: 24,
    maxSpeed: 350,
    stops: 2,
    bridges: 4,
    tunnels: 0,
    viaducts: 3,
    infraInvestment: 310,
    rollingStockInvestment: 70,
    jobsCreated: 12000,
    taxRevenue: 65,
    accessibilityImprovement: 18,
  },
  {
    id: 'msk-ekb',
    name: 'Москва – Екатеринбург',
    type: 'vsm',
    status: 'in-development',
    length: 1775,
    gdpEffect: 3200,
    investment: 4850,
    passengerFlow: 18.4,
    population: 42.1,
    rollingStock: 64,
    startYear: 2032,
    endYear: 2038,
    stages: [
      { name: 'Москва – Казань', year: 2035, length: 770 },
      { name: 'Казань – Екатеринбург', year: 2038, length: 1005 },
    ],
    coordinates: { start: [55.7558, 37.6173], end: [56.8389, 60.6057], via: [[55.7879, 49.1233]] },
    isInternational: false,
    isStaged: true,
    scenarios: ['Базовый', 'Оптимистичный', 'Консервативный'],
    dataSource: 'ОАО «РЖД»',
    lastUpdated: '2026-03-20',
    hasMissingData: false,
    trainsPerDay: 36,
    maxSpeed: 400,
    stops: 8,
    bridges: 28,
    tunnels: 4,
    viaducts: 18,
    infraInvestment: 4200,
    rollingStockInvestment: 650,
    jobsCreated: 125000,
    taxRevenue: 520,
    accessibilityImprovement: 48,
  },
  {
    id: 'msk-minsk',
    name: 'Москва – Минск',
    type: 'international',
    status: 'international',
    length: 675,
    gdpEffect: 890,
    investment: 920,
    passengerFlow: 6.8,
    population: 14.2,
    rollingStock: 18,
    startYear: 2034,
    endYear: 2039,
    coordinates: { start: [55.7558, 37.6173], end: [53.9045, 27.5615] },
    isInternational: true,
    isStaged: false,
    scenarios: ['Международный базовый'],
    dataSource: 'Совместная комиссия',
    lastUpdated: '2026-01-10',
    hasMissingData: true,
    trainsPerDay: 16,
    maxSpeed: 350,
    stops: 3,
    bridges: 8,
    tunnels: 1,
    viaducts: 5,
    infraInvestment: 780,
    rollingStockInvestment: 140,
    jobsCreated: 28000,
    taxRevenue: 95,
    accessibilityImprovement: 22,
  },
  {
    id: 'msk-belgorod',
    name: 'Москва – Белгород',
    type: 'vsm',
    status: 'approved',
    length: 654,
    gdpEffect: 680,
    investment: 720,
    passengerFlow: 9.4,
    population: 11.8,
    rollingStock: 22,
    startYear: 2031,
    endYear: 2036,
    coordinates: { start: [55.7558, 37.6173], end: [50.5997, 36.5875] },
    isInternational: false,
    isStaged: false,
    scenarios: ['Базовый', 'Консервативный'],
    dataSource: 'Минтранс',
    lastUpdated: '2026-03-01',
    hasMissingData: false,
    trainsPerDay: 28,
    maxSpeed: 350,
    stops: 5,
    bridges: 10,
    tunnels: 0,
    viaducts: 6,
    infraInvestment: 580,
    rollingStockInvestment: 140,
    jobsCreated: 22000,
    taxRevenue: 110,
    accessibilityImprovement: 26,
  },
  {
    id: 'msk-bryansk',
    name: 'Москва – Брянск',
    type: 'sm',
    status: 'experimental',
    length: 382,
    gdpEffect: 340,
    investment: 480,
    passengerFlow: 4.2,
    population: 5.6,
    rollingStock: 10,
    startYear: 2036,
    endYear: 2042,
    coordinates: { start: [55.7558, 37.6173], end: [53.2521, 34.3717] },
    isInternational: false,
    isStaged: false,
    scenarios: ['Экспериментальный'],
    dataSource: 'НИИ транспорта',
    lastUpdated: '2025-12-15',
    hasMissingData: true,
    trainsPerDay: 12,
    maxSpeed: 250,
    stops: 3,
    bridges: 5,
    tunnels: 0,
    viaducts: 2,
    infraInvestment: 420,
    rollingStockInvestment: 60,
    jobsCreated: 8000,
    taxRevenue: 42,
    accessibilityImprovement: 12,
  },
  {
    id: 'msk-yaroslavl',
    name: 'Москва – Ярославль',
    type: 'vsm',
    status: 'in-development',
    length: 265,
    gdpEffect: 520,
    investment: 420,
    passengerFlow: 7.6,
    population: 8.4,
    rollingStock: 14,
    startYear: 2033,
    endYear: 2037,
    coordinates: { start: [55.7558, 37.6173], end: [57.6261, 39.8845] },
    isInternational: false,
    isStaged: false,
    scenarios: ['Базовый'],
    dataSource: 'ОАО «РЖД»',
    lastUpdated: '2026-02-20',
    hasMissingData: false,
    trainsPerDay: 20,
    maxSpeed: 350,
    stops: 3,
    bridges: 6,
    tunnels: 1,
    viaducts: 4,
    infraInvestment: 350,
    rollingStockInvestment: 70,
    jobsCreated: 15000,
    taxRevenue: 78,
    accessibilityImprovement: 20,
  },
  {
    id: 'msk-adler',
    name: 'Москва – Адлер',
    type: 'vsm',
    status: 'approved',
    length: 1542,
    gdpEffect: 2100,
    investment: 3200,
    passengerFlow: 14.8,
    population: 32.6,
    rollingStock: 48,
    startYear: 2034,
    endYear: 2042,
    coordinates: { start: [55.7558, 37.6173], end: [43.4285, 39.9267] },
    isInternational: false,
    isStaged: true,
    stages: [
      { name: 'Москва – Воронеж', year: 2037, length: 520 },
      { name: 'Воронеж – Ростов', year: 2039, length: 560 },
      { name: 'Ростов – Адлер', year: 2042, length: 462 },
    ],
    scenarios: ['Базовый', 'Туристический'],
    dataSource: 'ОАО «РЖД»',
    lastUpdated: '2026-03-18',
    hasMissingData: false,
    trainsPerDay: 32,
    maxSpeed: 350,
    stops: 12,
    bridges: 35,
    tunnels: 8,
    viaducts: 22,
    infraInvestment: 2750,
    rollingStockInvestment: 450,
    jobsCreated: 85000,
    taxRevenue: 340,
    accessibilityImprovement: 42,
  },
  {
    id: 'msk-kazan',
    name: 'Москва – Казань',
    type: 'vsm',
    status: 'in-development',
    length: 770,
    gdpEffect: 1450,
    investment: 1850,
    passengerFlow: 12.2,
    population: 22.5,
    rollingStock: 28,
    startYear: 2030,
    endYear: 2035,
    coordinates: { start: [55.7558, 37.6173], end: [55.7879, 49.1233] },
    isInternational: false,
    isStaged: false,
    scenarios: ['Базовый', 'Оптимистичный'],
    dataSource: 'ОАО «РЖД»',
    lastUpdated: '2026-03-12',
    hasMissingData: false,
    trainsPerDay: 28,
    maxSpeed: 400,
    stops: 5,
    bridges: 18,
    tunnels: 2,
    viaducts: 12,
    infraInvestment: 1600,
    rollingStockInvestment: 250,
    jobsCreated: 52000,
    taxRevenue: 185,
    accessibilityImprovement: 32,
  },
  {
    id: 'msk-nnov',
    name: 'Москва – Нижний Новгород',
    type: 'vsm',
    status: 'approved',
    length: 442,
    gdpEffect: 780,
    investment: 620,
    passengerFlow: 11.8,
    population: 15.2,
    rollingStock: 18,
    startYear: 2029,
    endYear: 2033,
    coordinates: { start: [55.7558, 37.6173], end: [56.3269, 43.9365] },
    isInternational: false,
    isStaged: false,
    scenarios: ['Базовый'],
    dataSource: 'Минтранс',
    lastUpdated: '2026-02-25',
    hasMissingData: false,
    trainsPerDay: 32,
    maxSpeed: 400,
    stops: 3,
    bridges: 8,
    tunnels: 1,
    viaducts: 6,
    infraInvestment: 520,
    rollingStockInvestment: 100,
    jobsCreated: 25000,
    taxRevenue: 120,
    accessibilityImprovement: 28,
  },
  {
    id: 'spb-helsinki',
    name: 'Санкт-Петербург – Хельсинки',
    type: 'international',
    status: 'experimental',
    length: 388,
    gdpEffect: 420,
    investment: 580,
    passengerFlow: 4.5,
    population: 8.2,
    rollingStock: 10,
    startYear: 2038,
    endYear: 2044,
    coordinates: { start: [59.9343, 30.3351], end: [60.1699, 24.9384] },
    isInternational: true,
    isStaged: false,
    scenarios: ['Международный базовый'],
    dataSource: 'Совместная комиссия',
    lastUpdated: '2025-11-20',
    hasMissingData: true,
    trainsPerDay: 8,
    maxSpeed: 300,
    stops: 2,
    bridges: 6,
    tunnels: 0,
    viaducts: 4,
    infraInvestment: 520,
    rollingStockInvestment: 60,
    jobsCreated: 12000,
    taxRevenue: 55,
    accessibilityImprovement: 15,
  },
  {
    id: 'archived-tver',
    name: 'Москва – Тверь (архив)',
    type: 'sm',
    status: 'archived',
    length: 167,
    gdpEffect: 180,
    investment: 220,
    passengerFlow: 3.2,
    population: 4.1,
    rollingStock: 6,
    startYear: 2028,
    endYear: 2031,
    coordinates: { start: [55.7558, 37.6173], end: [56.8587, 35.9176] },
    isInternational: false,
    isStaged: false,
    scenarios: ['Архивный'],
    dataSource: 'Архив',
    lastUpdated: '2024-06-15',
    hasMissingData: true,
    trainsPerDay: 16,
    maxSpeed: 200,
    stops: 2,
    bridges: 3,
    tunnels: 0,
    viaducts: 1,
    infraInvestment: 190,
    rollingStockInvestment: 30,
    jobsCreated: 5000,
    taxRevenue: 22,
    accessibilityImprovement: 8,
  },
];

export const kpiData = {
  gdpGrowth: {
    value: 9.9,
    unit: 'трлн ₽',
    label: 'Прирост ВВП',
    description: 'Суммарный эффект к 2050 году',
  },
  investment: {
    value: 12.4,
    unit: 'трлн ₽',
    label: 'Потребный объём инвестиций',
    description: 'Общий объём капитальных вложений',
  },
  passengerFlow: {
    value: 92.9,
    unit: 'млн чел/год',
    label: 'Пассажиропоток',
    description: 'Прогнозный годовой пассажиропоток',
  },
  population: {
    value: 149.9,
    unit: 'млн чел',
    label: 'Численность населения',
    description: 'Население территорий тяготения',
  },
  networkLength: {
    value: 6168,
    unit: 'км',
    label: 'Протяжённость сети',
    description: 'Общая протяжённость линий',
  },
  rollingStock: {
    value: 230,
    unit: 'составов',
    label: 'Потребный парк',
    description: 'Необходимое количество поездов',
  },
};

export const timelineYears = [2028, 2030, 2032, 2035, 2038, 2040, 2045, 2050];

export const mapLayers = [
  { id: 'length', label: 'Протяжённость маршрута', unit: 'км' },
  { id: 'gdp', label: 'Эффект на ВВП', unit: 'млрд ₽' },
  { id: 'investment', label: 'Объём инвестиций', unit: 'млрд ₽' },
  { id: 'rollingStock', label: 'Потребность в подвижном составе', unit: 'составов' },
  { id: 'population', label: 'Охват населения', unit: 'млн чел' },
  { id: 'passengerFlow', label: 'Пассажиропоток', unit: 'млн чел/год' },
];

export const statusFilters = [
  { id: 'approved', label: 'Утверждён', color: 'bg-emerald-500' },
  { id: 'in-progress', label: 'В реализации', color: 'bg-implementation-green' },
  { id: 'in-development', label: 'В разработке', color: 'bg-amber-500' },
  { id: 'experimental', label: 'Экспериментальный', color: 'bg-purple-500' },
  { id: 'archived', label: 'Архивный', color: 'bg-gray-400' },
  { id: 'international', label: 'Международный', color: 'bg-international-yellow' },
];

export const comparePresets = [
  {
    id: 'top-gdp',
    label: 'Топ-3 по эффекту на ВВП',
    projectIds: ['msk-ekb', 'msk-adler', 'msk-spb'],
  },
  {
    id: 'shortest-build',
    label: 'Ближайший ввод в эксплуатацию',
    projectIds: ['msk-spb', 'msk-ryazan', 'msk-belgorod'],
  },
  {
    id: 'international',
    label: 'Международные проекты',
    projectIds: ['msk-minsk'],
  },
];

export function getProjectsByYear(year: number): RouteProject[] {
  return projects.filter(p => {
    // Special handling for Москва – Екатеринбург staged project
    if (p.id === 'msk-ekb') {
      if (year >= 2038) return true;
      if (year >= 2035) return true; // Show as partial (to Kazan only)
      return false;
    }
    return p.endYear <= year;
  });
}

export function getProjectTypeLabel(type: ProjectType): string {
  switch (type) {
    case 'vsm': return 'ВСМ';
    case 'sm': return 'СМ';
    case 'international': return 'Международный';
    case 'in-progress': return 'В реализации';
  }
}

export function getProjectStatusLabel(status: ProjectStatus): string {
  switch (status) {
    case 'approved': return 'Утверждён';
    case 'in-progress': return 'В реализации';
    case 'in-development': return 'В разработке';
    case 'experimental': return 'Экспериментальный';
    case 'archived': return 'Архивный';
    case 'international': return 'Международный';
  }
}

// Ranking criteria groups
export interface RankingCriterion {
  id: string;
  label: string;
  description: string;
  weight: number;
  enabled: boolean;
}

export interface RankingGroup {
  id: string;
  label: string;
  enabled: boolean;
  weight: number;
  criteria: RankingCriterion[];
}

export const defaultRankingGroups: RankingGroup[] = [
  {
    id: 'transport',
    label: 'Транспортные критерии',
    enabled: true,
    weight: 30,
    criteria: [
      { id: 'passenger-flow', label: 'Пассажиропоток', description: 'Прогнозный годовой пассажиропоток', weight: 40, enabled: true },
      { id: 'trains-per-day', label: 'Размеры движения', description: 'Количество поездов в сутки', weight: 30, enabled: true },
      { id: 'population-coverage', label: 'Охват населения', description: 'Население территорий тяготения', weight: 30, enabled: true },
    ],
  },
  {
    id: 'capacity',
    label: 'Дополнительная пропускная способность',
    enabled: true,
    weight: 20,
    criteria: [
      { id: 'route-length', label: 'Протяжённость', description: 'Длина маршрута', weight: 50, enabled: true },
      { id: 'max-speed', label: 'Максимальная скорость', description: 'Проектная скорость движения', weight: 50, enabled: true },
    ],
  },
  {
    id: 'capital',
    label: 'Критерии капиталоёмкости',
    enabled: true,
    weight: 25,
    criteria: [
      { id: 'total-investment', label: 'Общие инвестиции', description: 'Суммарный объём капвложений', weight: 40, enabled: true },
      { id: 'infra-investment', label: 'Инвестиции в инфраструктуру', description: 'Капвложения в инфраструктуру', weight: 30, enabled: true },
      { id: 'rolling-stock-investment', label: 'Инвестиции в подвижной состав', description: 'Капвложения в поезда', weight: 30, enabled: true },
    ],
  },
  {
    id: 'benefits',
    label: 'Критерии сравнения затрат и выгод',
    enabled: true,
    weight: 25,
    criteria: [
      { id: 'gdp-effect', label: 'Эффект на ВВП', description: 'Прирост ВВП от проекта', weight: 35, enabled: true },
      { id: 'jobs-created', label: 'Создание рабочих мест', description: 'Количество созданных рабочих мест', weight: 25, enabled: true },
      { id: 'tax-revenue', label: 'Налоговые поступления', description: 'Ожидаемые налоговые поступления', weight: 20, enabled: true },
      { id: 'accessibility', label: 'Повышение доступности', description: 'Улучшение транспортной доступности', weight: 20, enabled: true },
    ],
  },
];

// Comparison metric groups
export const comparisonMetricGroups = [
  {
    id: 'overview',
    label: 'Обзор',
    metrics: [
      { id: 'type', label: 'Тип проекта' },
      { id: 'status', label: 'Статус' },
      { id: 'startYear', label: 'Год начала' },
      { id: 'endYear', label: 'Год завершения' },
      { id: 'length', label: 'Протяжённость', unit: 'км' },
    ],
  },
  {
    id: 'passenger',
    label: 'Пассажиропоток',
    metrics: [
      { id: 'passengerFlow', label: 'Годовой пассажиропоток', unit: 'млн чел/год' },
      { id: 'trainsPerDay', label: 'Поездов в сутки', unit: 'пар' },
    ],
  },
  {
    id: 'socioeconomic',
    label: 'Социально-экономические эффекты',
    metrics: [
      { id: 'gdpEffect', label: 'Вклад в ВВП', unit: 'млрд ₽' },
      { id: 'jobsCreated', label: 'Рабочие места', unit: 'чел' },
      { id: 'taxRevenue', label: 'Налоговые поступления', unit: 'млрд ₽' },
      { id: 'accessibilityImprovement', label: 'Рост доступности', unit: '%' },
    ],
  },
  {
    id: 'investment',
    label: 'Инвестиции',
    metrics: [
      { id: 'investment', label: 'Общий объём', unit: 'млрд ₽' },
      { id: 'infraInvestment', label: 'Инфраструктура', unit: 'млрд ₽' },
      { id: 'rollingStockInvestment', label: 'Подвижной состав', unit: 'млрд ₽' },
    ],
  },
  {
    id: 'traffic',
    label: 'Размеры движения',
    metrics: [
      { id: 'trainsPerDay', label: 'Поездов в сутки', unit: 'пар' },
      { id: 'rollingStock', label: 'Потребный парк', unit: 'составов' },
    ],
  },
  {
    id: 'population',
    label: 'Охват населения',
    metrics: [
      { id: 'population', label: 'Численность населения', unit: 'млн чел' },
      { id: 'stops', label: 'Количество остановок', unit: 'шт' },
    ],
  },
  {
    id: 'technical',
    label: 'Технические параметры',
    metrics: [
      { id: 'length', label: 'Протяжённость', unit: 'км' },
      { id: 'maxSpeed', label: 'Максимальная скорость', unit: 'км/ч' },
      { id: 'stops', label: 'Остановки', unit: 'шт' },
      { id: 'bridges', label: 'Мосты', unit: 'шт' },
      { id: 'tunnels', label: 'Тоннели', unit: 'шт' },
      { id: 'viaducts', label: 'Эстакады', unit: 'шт' },
    ],
  },
];
