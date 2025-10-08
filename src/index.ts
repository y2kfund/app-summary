// src/index.ts
import Summary from './views/Summary.vue'

// Named export
export { Summary }

// Default export (optional)
export default Summary

// Props interface
export interface SummaryProps {
  showHeaderLink?: boolean  // Whether to show the header as a router-link (for use in dashboard with routing)
  userId?: string | null    // Current user ID for access control
}
