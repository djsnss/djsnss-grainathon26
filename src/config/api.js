/**
 * API Configuration for Grainathon Backend Integration
 */

// Base API URL stripped of quotes, trailing slashes, and trailing /api
export const API_BASE = (import.meta.env.VITE_API_URL || '')
  .trim()
  .replace(/^["']|["']$/g, '')
  .replace(/\/+$/, '')
  .replace(/\/api$/, '');

// Endpoints for total department scores and committee scores
export const ENDPOINTS = {
  departments: '/api/total',
  committees: '/api/committee'
};

// Polling interval in milliseconds (20 seconds)
export const POLL_INTERVAL_MS = 20000;

// HTTP fetch timeout per endpoint in milliseconds (8 seconds)
export const REQUEST_TIMEOUT_MS = 8000;

// Error fallback strategy: 'zero' = show all 0 on a failed fetch; 'last' = keep last good data
export const ERROR_FALLBACK = 'zero';

// Flag to display committees in data that match nothing in the master list (with a console.warn once)
export const SHOW_UNMATCHED_COMMITTEES = true;
