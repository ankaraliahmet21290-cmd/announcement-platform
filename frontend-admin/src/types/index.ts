export type Role = 'SUPER_ADMIN' | 'OFFICE_ADMIN' | 'AGENT';
export type TenantStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED';
export type ListingType = 'SALE' | 'RENT';
export type PropertyType = 'RESIDENCE' | 'LAND' | 'OFFICE';
export type PropertyStatus = 'DRAFT' | 'PUBLISHED' | 'PASSIVE';
export type LeadStatus = 'NEW' | 'CONTACTED' | 'APPOINTMENT' | 'CLOSED';
export type LeadSource = 'WEB_FORM' | 'MANUAL';

export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  whatsapp?: string;
  role: Role;
  photoUrl?: string;
  tenantId?: number;
  tenantName?: string;
  tenantSlug?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: number;
  email: string;
  fullName: string;
  role: Role;
  tenantId?: number;
  tenantSlug?: string;
  tenantName?: string;
}

export interface PropertyImageDto {
  id?: number;
  url: string;
  sortOrder?: number;
}

export interface PropertySummary {
  id: number;
  title: string;
  listingType: ListingType;
  propertyType: PropertyType;
  price: number;
  currency: string;
  city: string;
  district: string;
  neighborhood?: string;
  grossArea?: number;
  netArea?: number;
  roomCount?: string;
  status: PropertyStatus;
  viewCount: number;
  coverImage?: string;
  agentId?: number;
  agentName?: string;
  createdAt: string;
}

export interface PropertyDetail {
  id: number;
  tenantId: number;
  tenantName: string;
  tenantSlug: string;
  tenantPhone?: string;
  tenantWhatsapp?: string;
  agentId?: number;
  agentName?: string;
  agentEmail?: string;
  agentPhone?: string;
  agentWhatsapp?: string;
  agentPhotoUrl?: string;
  title: string;
  description: string;
  listingType: ListingType;
  propertyType: PropertyType;
  price: number;
  currency: string;
  city: string;
  district: string;
  neighborhood?: string;
  grossArea?: number;
  netArea?: number;
  roomCount?: string;
  buildingAge?: string;
  floor?: string;
  totalFloors?: number;
  heatingType?: string;
  deedStatus?: string;
  usageStatus?: string;
  facade?: string;
  suitableForLoan: boolean;
  furnished: boolean;
  hasElevator: boolean;
  hasBalcony: boolean;
  hasParking: boolean;
  inSite: boolean;
  bathroomCount?: number;
  latitude?: number;
  longitude?: number;
  eidsReference?: string;
  eidsExpiryDate?: string;
  status: PropertyStatus;
  viewCount: number;
  images: PropertyImageDto[];
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: number;
  tenantId: number;
  propertyId?: number;
  propertyTitle?: string;
  assignedAgentId?: number;
  assignedAgentName?: string;
  fullName: string;
  phone: string;
  email?: string;
  message?: string;
  requestType: ListingType;
  category: PropertyType;
  source: LeadSource;
  status: LeadStatus;
  kvkkConsent: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Agent {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  role: Role;
  photoUrl?: string;
  active: boolean;
  assignedPropertiesCount: number;
  assignedLeadsCount: number;
  createdAt: string;
}

export interface Tenant {
  id: number;
  name: string;
  slug: string;
  customDomain?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  logoUrl?: string;
  aboutText?: string;
  status: TenantStatus;
  planName: string;
  totalProperties: number;
  totalLeads: number;
  totalAgents: number;
  createdAt: string;
}

export interface DashboardSummary {
  role: Role;
  totalTenants?: number;
  activeTenants?: number;
  platformTotalProperties?: number;
  platformTotalLeads?: number;
  platformTotalAgents?: number;
  tenantList?: Tenant[];

  totalProperties?: number;
  publishedProperties?: number;
  draftProperties?: number;
  passiveProperties?: number;
  totalLeads?: number;
  newLeads?: number;
  contactedLeads?: number;
  closedLeads?: number;
  totalAgents?: number;
  propertiesByType?: Record<string, number>;
  recentLeads?: Lead[];

  myAssignedPropertiesCount?: number;
  myAssignedLeadsCount?: number;
  myNewLeadsCount?: number;
  myRecentLeads?: Lead[];
  myProperties?: PropertySummary[];
}
