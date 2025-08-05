import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Subnet calculation utilities
export interface SubnetResult {
  clase: string;
  mascaraOriginal: string;
  nroBitsPrestados: number;
  nroSubredes: number;
  nroSubredesUtilizables: number;
  nroIPsPorSubRed: number;
  nroIPsConfigurablesPorSubRed: number;
  newMascara: string;
  salto: number;
  subredesSolicitadas: number;
}

export function getIPClass(ip: string): string {
  const firstOctet = parseInt(ip.split('.')[0]);
  if (firstOctet >= 1 && firstOctet <= 126) return 'A';
  if (firstOctet >= 128 && firstOctet <= 191) return 'B';
  if (firstOctet >= 192 && firstOctet <= 223) return 'C';
  return 'Unknown';
}

export function getDefaultMask(ipClass: string): string {
  switch (ipClass) {
    case 'A': return '255.0.0.0';
    case 'B': return '255.255.0.0';
    case 'C': return '255.255.255.0';
    default: return '255.255.255.0';
  }
}

export function maskToCIDR(mask: string): number {
  return mask.split('.').reduce((cidr, octet) => {
    return cidr + parseInt(octet).toString(2).split('1').length - 1;
  }, 0);
}

export function cidrToMask(cidr: number): string {
  const mask = [];
  for (let i = 0; i < 4; i++) {
    const bits = Math.min(8, Math.max(0, cidr - i * 8));
    mask.push(256 - Math.pow(2, 8 - bits));
  }
  return mask.join('.');
}

export function calculateSubnets(ip: string, mask: string, desiredSubnets: number): SubnetResult {
  const ipClass = getIPClass(ip);
  const originalMask = mask;
  const originalCIDR = maskToCIDR(mask);
  
  // Calculate required subnet bits
  const requiredBits = Math.ceil(Math.log2(desiredSubnets));
  const newCIDR = originalCIDR + requiredBits;
  const newMask = cidrToMask(newCIDR);
  
  // Calculate host bits
  const hostBits = 32 - newCIDR;
  const totalSubnets = Math.pow(2, requiredBits);
  const usableSubnets = totalSubnets - 2; // Subtract network and broadcast
  const hostsPerSubnet = Math.pow(2, hostBits);
  const usableHostsPerSubnet = hostsPerSubnet - 2; // Subtract network and broadcast
  
  // Calculate jump (increment between subnets)
  const jump = Math.pow(2, hostBits);
  
  return {
    clase: ipClass,
    mascaraOriginal: originalMask,
    nroBitsPrestados: requiredBits,
    nroSubredes: totalSubnets,
    nroSubredesUtilizables: Math.max(0, usableSubnets),
    nroIPsPorSubRed: hostsPerSubnet,
    nroIPsConfigurablesPorSubRed: Math.max(0, usableHostsPerSubnet),
    newMascara: newMask,
    salto: jump,
    subredesSolicitadas: desiredSubnets
  };
}

export function isValidIP(ip: string): boolean {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  
  return parts.every(part => {
    const num = parseInt(part);
    return !isNaN(num) && num >= 0 && num <= 255;
  });
}

export function isValidMask(mask: string): boolean {
  if (!isValidIP(mask)) return false;
  
  const binary = mask.split('.').map(octet => 
    parseInt(octet).toString(2).padStart(8, '0')
  ).join('');
  
  // Check if mask has contiguous 1s followed by contiguous 0s
  const match = binary.match(/^1*0*$/);
  return match !== null;
}
