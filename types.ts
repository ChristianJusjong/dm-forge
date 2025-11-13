// ==========================================
// TYPESCRIPT TYPE DEFINITIONS
// Comprehensive types for Dungeon Master Forge
// ==========================================

// ==========================================
// CORE CAMPAIGN TYPES
// ==========================================

export interface Campaign {
  code: string;
  name: string;
  createdAt: number;
  lastPlayed?: number;
  settings: CampaignSettings;
  party: Character[];
  sessions: Session[];
  partyConfirmed?: boolean;
  syncVersion?: number;
  deviceId?: string;
  userId?: string;
  lastSync?: number;
  sharedWith?: string[];
}

export interface CampaignSettings {
  difficultyLevel: 'easy' | 'normal' | 'hard' | 'deadly';
  restType: 'short' | 'long';
  autoRoll?: boolean;
  useMilliseconds?: boolean;
  theme?: 'default' | 'dark' | 'light';
  soundEnabled?: boolean;
  notificationsEnabled?: boolean;
}

export interface CampaignCode {
  code: string;
  timestamp: number;
  checksum?: string;
}

// ==========================================
// CHARACTER TYPES
// ==========================================

export interface Character {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  hp: number;
  maxHp: number;
  ac: number;
  proficiencyBonus: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  speed?: number;
  initiative?: number;
  conditions?: Condition[];
  equipment?: Equipment[];
  spells?: Spell[];
  features?: Feature[];
  notes?: string;
  imageUrl?: string;
}

export interface Condition {
  name: string;
  description: string;
  duration?: number;
  source?: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'item';
  equipped: boolean;
  quantity: number;
  description?: string;
  weight?: number;
  value?: number;
}

export interface Spell {
  id: string;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  prepared?: boolean;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  source: string;
  uses?: number;
  maxUses?: number;
}

// ==========================================
// COMBAT & INITIATIVE TYPES
// ==========================================

export interface Combatant {
  id: string;
  name: string;
  initiative: number;
  hp: number;
  maxHp: number;
  ac: number;
  type: 'player' | 'monster' | 'npc';
  conditions?: Condition[];
  notes?: string;
  characterId?: string;
  monsterId?: string;
  imageUrl?: string;
}

export interface InitiativeTracker {
  combatants: Combatant[];
  currentIndex: number;
  round: number;
  isActive: boolean;
  startTime?: number;
}

export interface CombatAction {
  type: 'damage' | 'heal' | 'condition' | 'death' | 'revive';
  targetId: string;
  value?: number;
  condition?: string;
  timestamp: number;
  description: string;
}

// ==========================================
// SESSION TYPES
// ==========================================

export interface Session {
  id: string;
  sessionNumber: number;
  date: number;
  duration?: number;
  title?: string;
  summary: string;
  encounters: Encounter[];
  notes: SessionNote[];
  xpAwarded?: number;
  treasureFound?: Treasure[];
  questsCompleted?: string[];
  questsStarted?: string[];
  npcsMetId?: string[];
  locationsVisited?: string[];
}

export interface SessionNote {
  id: string;
  timestamp: number;
  content: string;
  type: 'general' | 'important' | 'combat' | 'roleplay' | 'loot';
  tags?: string[];
  author?: string;
}

export interface Treasure {
  id: string;
  name: string;
  type: 'gold' | 'item' | 'magic' | 'art' | 'gem';
  value: number;
  quantity: number;
  description?: string;
  claimed?: boolean;
  claimedBy?: string;
}

// ==========================================
// ENCOUNTER TYPES
// ==========================================

export interface Encounter {
  id: string;
  name: string;
  description?: string;
  monsters: Monster[];
  difficulty: 'trivial' | 'easy' | 'medium' | 'hard' | 'deadly';
  xpValue: number;
  treasureValue?: number;
  location?: string;
  startTime?: number;
  endTime?: number;
  outcome?: 'victory' | 'defeat' | 'fled' | 'negotiated';
  casualties?: string[];
}

export interface Monster {
  id: string;
  name: string;
  cr: number;
  hp: number;
  maxHp: number;
  ac: number;
  type: string;
  size: 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'gargantuan';
  alignment?: string;
  speed?: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  skills?: string[];
  resistances?: string[];
  immunities?: string[];
  vulnerabilities?: string[];
  senses?: string[];
  languages?: string[];
  abilities?: MonsterAbility[];
  actions?: MonsterAction[];
  legendaryActions?: MonsterAction[];
  xpValue: number;
  count?: number;
}

export interface MonsterAbility {
  name: string;
  description: string;
}

export interface MonsterAction {
  name: string;
  description: string;
  attackBonus?: number;
  damage?: string;
  range?: string;
  recharge?: string;
}

// ==========================================
// VALIDATION TYPES
// ==========================================

export interface ValidationResult<T = any> {
  valid: boolean;
  errors: string[];
  sanitized: T;
  warnings?: string[];
}

export interface ValidationSchema {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: any[];
  properties?: Record<string, ValidationSchema>;
  items?: ValidationSchema;
  custom?: (value: any) => boolean;
}

// ==========================================
// STORAGE & SYNC TYPES
// ==========================================

export interface StorageUsage {
  totalSize: number;
  sizeKB: number;
  sizeMB: number;
  usagePercent: number;
  itemCount: number;
  largestItems: StorageItem[];
}

export interface StorageItem {
  key: string;
  size: number;
  sizeKB: number;
  type: string;
}

export interface SyncStatus {
  enabled: boolean;
  authenticated: boolean;
  userId: string | null;
  email: string | null;
  isAnonymous: boolean;
  pendingSyncs: number;
  activeListeners: number;
}

export interface PendingSync {
  type: 'campaign' | 'session' | 'character';
  code: string;
  data: any;
  timestamp: number;
  retries?: number;
}

export interface CloudSyncConfig {
  autoSync: boolean;
  syncInterval: number;
  conflictResolution: 'newest' | 'manual' | 'merge';
  offlineQueue: boolean;
  maxQueueSize: number;
}

// ==========================================
// FIREBASE TYPES
// ==========================================

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export interface FirebaseUser {
  uid: string;
  email: string | null;
  isAnonymous: boolean;
  displayName?: string | null;
  photoURL?: string | null;
}

export interface AuthResult {
  success: boolean;
  user?: FirebaseUser;
  error?: string;
}

// ==========================================
// UTILITY TYPES
// ==========================================

export interface SafeParseResult<T> {
  success: boolean;
  data: T | null;
  error?: string;
}

export interface ExportData {
  version: string;
  exportDate: number;
  campaigns: Campaign[];
  format: 'json' | 'csv' | 'pdf';
}

export interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  errors: string[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: number;
  duration?: number;
  action?: NotificationAction;
}

export interface NotificationAction {
  label: string;
  callback: () => void;
}

// ==========================================
// PERFORMANCE TYPES
// ==========================================

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  modules: Record<string, number>;
  cacheHits: number;
  cacheMisses: number;
}

export interface ModuleConfig {
  path: string;
  strategy: 'immediate' | 'idle' | 'visible' | 'interaction';
  priority?: 'high' | 'medium' | 'low';
}

export interface LazyLoadConfig {
  modulesConfig: Record<string, ModuleConfig>;
  enableAnalytics?: boolean;
  logPerformance?: boolean;
}

// ==========================================
// PWA TYPES
// ==========================================

export interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export interface PWAInstallState {
  canInstall: boolean;
  isInstalled: boolean;
  lastDismissed: number | null;
  hasBeenPrompted: boolean;
}

// ==========================================
// DICE ROLLING TYPES
// ==========================================

export interface DiceRoll {
  formula: string;
  result: number;
  rolls: number[];
  modifier: number;
  timestamp: number;
  type?: 'attack' | 'damage' | 'skill' | 'save' | 'initiative';
  critical?: boolean;
}

export interface DiceNotation {
  count: number;
  sides: number;
  modifier?: number;
  advantage?: boolean;
  disadvantage?: boolean;
}

// ==========================================
// ANALYTICS TYPES
// ==========================================

export interface AnalyticsEvent {
  name: string;
  category: string;
  label?: string;
  value?: number;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}

// ==========================================
// ERROR TYPES
// ==========================================

export interface AppError {
  code: string;
  message: string;
  timestamp: number;
  stack?: string;
  userId?: string;
  context?: Record<string, any>;
}

export type ErrorHandler = (error: AppError) => void;

// ==========================================
// GLOBAL WINDOW EXTENSIONS
// ==========================================

declare global {
  interface Window {
    // Storage utilities
    safeLocalStorageGet: <T>(key: string, fallback: T) => T;
    safeLocalStorageSet: (key: string, value: any) => boolean;
    safeLocalStorageRemove: (key: string) => boolean;
    safeJSONParse: <T>(jsonString: string | null | undefined, fallback: T) => T;
    safeJSONStringify: (data: any, fallback?: string) => string;
    safeLocalStorageGetString: (key: string, fallback?: string) => string;
    safeLocalStorageSetString: (key: string, value: string) => boolean;
    isLocalStorageAvailable: () => boolean;
    getAllLocalStorageKeys: (prefix?: string) => string[];
    clearLocalStorageByPrefix: (prefix: string) => number;
    getStorageUsage: () => StorageUsage;

    // Campaign management
    createCampaign: (name: string) => Campaign;
    loadCampaign: (code: string) => Campaign | null;
    saveCampaign: (campaign: Campaign) => boolean;
    deleteCampaign: (code: string) => boolean;
    updateCampaignUI?: () => void;

    // Cloud sync
    initializeCloudSync: () => Promise<boolean>;
    syncCampaignToCloud: (code: string, data: Campaign) => Promise<boolean>;
    loadCampaignFromCloud: (code: string) => Promise<Campaign | null>;
    deleteCampaignFromCloud: (code: string) => Promise<boolean>;
    getUserCampaignsFromCloud: () => Promise<Campaign[]>;
    enableCloudSync: () => Promise<boolean>;
    disableCloudSync: () => void;
    isCloudSyncEnabled: () => boolean;
    getSyncStatus: () => SyncStatus;

    // Authentication
    signInWithEmail: (email: string, password: string) => Promise<AuthResult>;
    createAccount: (email: string, password: string) => Promise<AuthResult>;
    signOut: () => Promise<AuthResult>;

    // Firebase
    initializeFirebase: () => any;
    getFirebaseDB: () => any;
    getFirebaseAuth: () => any;
    getFirebaseStorage: () => any;
    isFirebaseConfigured: () => boolean;

    // Performance
    initSmartLoader: (config: LazyLoadConfig) => void;
    getPerformanceMetrics: () => PerformanceMetrics;

    // Notifications
    showSyncNotification?: (message: string, type: string) => void;
    showNotification?: (notification: Notification) => void;

    // PWA Install
    deferredPrompt?: BeforeInstallPromptEvent | null;
  }
}

// ==========================================
// TYPE GUARDS
// ==========================================

export function isCampaign(obj: any): obj is Campaign {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.code === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.createdAt === 'number' &&
    Array.isArray(obj.party) &&
    Array.isArray(obj.sessions)
  );
}

export function isCharacter(obj: any): obj is Character {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.level === 'number' &&
    typeof obj.hp === 'number' &&
    typeof obj.maxHp === 'number' &&
    typeof obj.ac === 'number'
  );
}

export function isValidationResult(obj: any): obj is ValidationResult {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.valid === 'boolean' &&
    Array.isArray(obj.errors)
  );
}

// ==========================================
// UTILITY TYPE ALIASES
// ==========================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

// Export all types as default for convenience
export default {
  // This allows: import types from './types' and types.Campaign
};
