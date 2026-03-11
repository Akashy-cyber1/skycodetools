# Phase 2 Implementation Plan - Detailed

## Current State Analysis

### Already Implemented (Phase 1):
1. **Navbar** - Full-featured with dropdown, mobile menu, CTA button
2. **Footer** - Basic structure with brand, quick links, popular tools
3. **ToolCard** - Reusable with icons, animations, color theming
4. **Layout Components** - MainLayout, ToolLayout, PageContainer, Section
5. **Config Files** - navigation.ts, footer.ts, tools.ts, site.ts

### Issues Identified:
1. Navbar missing "Categories" link
2. Footer missing contact info and social/WhatsApp placeholders
3. Navigation config needs "Categories" added
4. Footer needs better organization with contact/social sections

## Implementation Plan

### 1. Update Navigation Config (`frontend/config/navigation.ts`)
- Add "Categories" link to NAV_ITEMS
- Organize items: Home, All Tools, Categories, Blog, About, Contact

### 2. Update Footer Config (`frontend/config/footer.ts`)
- Add contact info section (email, phone, address)
- Add social links section (Twitter, GitHub, LinkedIn, WhatsApp placeholder)
- Organize into proper columns

### 3. Update Navbar Component (`frontend/components/Navbar.tsx`)
- Add Categories link to desktop and mobile menus
- Ensure dropdown works with new structure
- Keep all existing functionality

### 4. Update Footer Component (`frontend/components/Footer.tsx`)
- Add contact info column
- Add social links column with icons
- Add WhatsApp placeholder
- Maintain responsive design
- Use centralized config

### 5. Update ToolCard Component (`frontend/components/ToolCard.tsx`)
- Ensure it's fully reusable
- Add proper TypeScript props documentation
- Keep it flexible for various use cases

### 6. Verify All Pages Work
- Home page
- Tools page
- Individual tool pages
- About page
- Contact page

## Files to Modify:
1. `frontend/config/navigation.ts` - Add Categories link
2. `frontend/config/footer.ts` - Add contact/social sections
3. `frontend/components/Navbar.tsx` - Add Categories to menu
4. `frontend/components/Footer.tsx` - Add contact/social columns

## Files to Verify:
1. All tool pages (merge-pdf, split-pdf, image-compressor, image-to-pdf, background-remover)
2. Home page
3. About page
4. Contact page

## Testing Checklist:
- [ ] Navbar displays all links correctly
- [ ] Mobile menu works with all items
- [ ] Footer displays all columns
- [ ] ToolCard renders correctly
- [ ] All tool pages load without errors
- [ ] Navigation between pages works
- [ ] Responsive design works on mobile

