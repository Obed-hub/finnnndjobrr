import { SourceAdapter } from '../types';
import { 
  HimalayasAdapter, 
  JobicyAdapter, 
  RemoteOKAdapter, 
  RemotiveAdapter, 
  ArbeitnowAdapter, 
  WeWorkRemotelyAdapter, 
  WorkingNomadsAdapter 
} from './remoteAdapters';
import { 
  LaborXSourceAdapter, 
  SuperteamEarnAdapter, 
  CryptoJobsListAdapter 
} from './web3Adapters';
import { 
  HotNigerianJobsAdapter, 
  RemoteAfricaAdapter 
} from './africaAdapters';
import { AIWorkSourceAdapter } from './aiWorkAdapters';
import { AdzunaAdapter, JoobleAdapter } from './externalAggregators';

/**
 * Universal Ingestion Adapter Registry
 * All official, live, and verified job source adapters.
 */
export const ALL_SOURCE_ADAPTERS: SourceAdapter[] = [
  // 1. Remote Job Gateways
  HimalayasAdapter,
  JobicyAdapter,
  RemoteOKAdapter,
  RemotiveAdapter,
  ArbeitnowAdapter,
  WeWorkRemotelyAdapter,
  WorkingNomadsAdapter,

  // 2. Web3 & Crypto Bounties / Gigs
  LaborXSourceAdapter,
  SuperteamEarnAdapter,
  CryptoJobsListAdapter,

  // 3. Africa & Nigeria Verified Tech Openings
  HotNigerianJobsAdapter,
  RemoteAfricaAdapter,

  // 4. Frontier AI Work & Data Training Hub
  AIWorkSourceAdapter,

  // 5. External Aggregators (Configurable credentials)
  AdzunaAdapter,
  JoobleAdapter
];

export function getAdapterById(id: string): SourceAdapter | undefined {
  return ALL_SOURCE_ADAPTERS.find(a => a.id === id);
}
