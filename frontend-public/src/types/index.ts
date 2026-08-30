export type ListingType = 'SALE' | 'RENT';
export type PropertyType = 'RESIDENCE' | 'LAND' | 'OFFICE';
export type PropertyStatus = 'DRAFT' | 'PUBLISHED' | 'PASSIVE';

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

export interface TenantInfo {
  id: number;
  name: string;
  slug: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  logoUrl?: string;
  aboutText?: string;
  totalProperties: number;
}

export interface PublicLeadPayload {
  propertyId?: number | null;
  fullName: string;
  phone: string;
  email?: string;
  message?: string;
  requestType: ListingType;
  category: PropertyType;
  kvkkConsent: boolean;
}
