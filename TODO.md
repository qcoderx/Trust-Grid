# Trust-Grid Frontend Development Plan

## Overview
Build two Next.js applications for Trust-Grid: Citizen App (mobile-first, "Neon-Minimalism" aesthetic) and Org Admin Dashboard (desktop-focused, "Professional Dark Mode" aesthetic). Implement production-ready code with React Query, Tailwind CSS, and accessibility features.

## Citizen App (citizen-app)
- **Aesthetic:** Neon-Minimalism - Clean white/dark-mode with Trust-Accent Blue (#1C64F2)
- **Typography:** Inter, mobile-optimized
- **Framework:** Next.js 14+ App Router
- **Styling:** Tailwind CSS + custom utilities
- **State:** React Query for API interactions and 3-second polling
- **Accessibility:** Headless UI/Radix UI components

### Components to Build
1. **Login Page**
   - Magic Link/Biometric mock-up
   - Single email/ID input
   - Subtle security animation

2. **Dashboard (Transparency Log)**
   - Activity Feed Card UI
   - Vertical scrollable list
   - Cards with icons (shield for Consent, paper for Policy)
   - Status colors: Trust-Accent Blue for Approved, Orange for Denied
   - Micro-animations for new entries

3. **Consent Modal**
   - Full-screen, focused modal
   - Animated data flow graphic
   - Approve (Trust-Accent Blue) and Deny (ghost) buttons
   - Scale animation on appearance
   - Focus trapped, aria-modal=true

## Org Admin Dashboard (org-dashboard)
- **Aesthetic:** Professional Dark Mode - Charcoal (#111827) with Action Teal (#14B8A6)
- **Typography:** Inter, desktop-optimized
- **Framework:** Next.js 14+ App Router
- **Styling:** Tailwind CSS + custom utilities
- **State:** React Query for API interactions
- **Accessibility:** Headless UI/Radix UI components

### Components to Build
1. **Layout & Navigation**
   - Fixed left sidebar
   - Clean icons and labels
   - Sections: Policy, Credentials, Log

2. **Policy Management**
   - Code editor aesthetic for textarea
   - Monospaced font, line numbers, syntax highlighting mock-up
   - Save button with loading spinner and success notification

3. **API Credentials**
   - Masked API key by default
   - Show/Hide eye icon
   - Copy to clipboard button with feedback

4. **Compliance Log**
   - High-density data grid/table
   - Fixed headers, striped rows
   - Status badges: Teal (approved), Red (denied), Yellow (pending)
   - Filter/sort sidebar
   - Virtualization for performance

## Shared Technical Requirements
- **Performance:** Core Web Vitals optimization, hardware-accelerated animations
- **API Integration:** Mock API calls initially, integrate with Trust-Grid API endpoints
- **Testing:** Minimal tests for critical paths
- **Deployment:** Ready for demo flow

## Development Steps
1. Create citizen-app and org-dashboard directories
2. Initialize Next.js projects with required dependencies
3. Set up Tailwind CSS with custom color palettes
4. Implement shared utilities and components
5. Build Citizen App pages/components
6. Build Org Dashboard pages/components
7. Integrate React Query for API state management
8. Add accessibility features and testing
9. Optimize for performance and demo flow
