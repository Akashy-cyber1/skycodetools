# Phase 2 UI Refactor - Manual Test Checklist

## 1. Desktop Navbar Checks (≥1024px viewport)

| # | Checkpoint | Pass/Fail |
|---|------------|-----------|
| 1.1 | Navbar fixed at top with blur backdrop | [ ] |
| 1.2 | Logo displays with gradient icon "SkyCode Tools" | [ ] |
| 1.3 | All nav items visible: Home, Tools, About, Contact | [ ] |
| 1.4 | "Explore Tools" CTA button visible and styled | [ ] |
| 1.5 | Tools dropdown opens on hover/click | [ ] |
| 1.6 | Dropdown shows all 5 tools with icons | [ ] |
| 1.7 | Dropdown shows "View All Tools →" link | [ ] |
| 1.8 | Navbar background is dark (#030712) with border | [ ] |
| 1.9 | No horizontal scrollbar appears | [ ] |

---

## 2. Mobile Navbar Checks (<768px viewport)

| # | Checkpoint | Pass/Fail |
|---|------------|-----------|
| 2.1 | Hamburger menu icon visible (right side) | [ ] |
| 2.2 | Desktop nav items hidden | [ ] |
| 2.3 | Tapping hamburger opens mobile menu | [ ] |
| 2.4 | Mobile menu slides down with animation | [ ] |
| 2.5 | All nav items listed vertically | [ ] |
| 2.6 | Tools section shows all 5 tools | [ ] |
| 2.7 | "Explore Tools" button at bottom of menu | [ ] |
| 2.8 | Menu closes when item clicked | [ ] |
| 2.9 | X icon appears to close menu | [ ] |

---

## 3. Footer Checks

| # | Checkpoint | Pass/Fail |
|---|------------|-----------|
| 3.1 | Footer background is #030712 | [ ] |
| 3.2 | Top border visible (#1e293b) | [ ] |
| 3.3 | Brand column shows logo + description | [ ] |
| 3.4 | "Quick Links" column has 4 links | [ ] |
| 3.5 | "Popular Tools" column has 5 tool links | [ ] |
| 3.6 | All footer links have hover state (blue-400) | [ ] |
| 3.7 | Bottom bar shows copyright with current year | [ ] |
| 3.8 | Footer is responsive (stacks on mobile) | [ ] |

---

## 4. Homepage & Listing Page Checks

### Homepage (/)
| # | Checkpoint | Pass/Fail |
|---|------------|-----------|
| 4.1 | Hero section fills ~90vh | [ ] |
| 4.2 | Gradient background animated | [ ] |
| 4.3 | "Trusted by 10,000+ users" badge visible | [ ] |
| 4.4 | Main title: "All-in-One Free Online Tools" | [ ] |
| 4.5 | CTA buttons: "Explore Tools" + "Learn More" | [ ] |
| 4.6 | Trust indicators: Secure, Instant, No Install | [ ] |
| 4.7 | Feature cards section (5 cards) | [ ] |
| 4.8 | Tool grid section (6 tools) | [ ] |

### Tools Listing (/tools)
| # | Checkpoint | Pass/Fail |
|---|------------|-----------|
| 4.9 | Page title: "Our Tools" | [ ] |
| 4.10 | Subtitle about free online tools | [ ] |
| 4.11 | All 5 tools displayed in grid | [ ] |
| 4.12 | Tool cards show: icon, title, description, CTA | [ ] |
| 4.13 | Cards have hover animation (lift up) | [ ] |
| 4.14 | Grid responsive: 1→2→3 columns | [ ] |

---

## 5. Component Reuse Checks

### PageContainer Component
| # | Checkpoint | Pass/Fail |
|---|------------|-----------|
| 5.1 | Wraps content with max-w-7xl | [ ] |
| 5.2 | Proper padding (px-4 sm:px-6 lg:px-8) | [ ] |
| 5.3 | Background variants work | [ ] |
| 5.4 | noPadding prop removes padding | [ ] |
| 5.5 | fullWidth removes max constraint | [ ] |

### Section Component
| # | Checkpoint | Pass/Fail |
|---|------------|-----------|
| 5.6 | padding variants (none/small/medium/large) | [ ] |
| 5.7 | background variants (default/dark/gradient/card) | [ ] |
| 5.8 | animate prop adds entrance animation | [ ] |
| 5.9 | delay prop works correctly | [ ] |

### ToolGridSection Component
| # | Checkpoint | Pass/Fail |
|---|------------|-----------|
| 5.10 | title and description render | [ ] |
| 5.11 | showFilters=true shows category tabs | [ ] |
| 5.12 | Clicking category filters tools | [ ] |
| 5.13 | columns prop changes grid layout | [ ] |
| 5.14 | limit prop restricts number of tools | [ ] |

### FeatureSection Component
| # | Checkpoint | Pass/Fail |
|---|------------|-----------|
| 5.15 | Features array renders all items | [ ] |
| 5.16 | Icons display with gradient background | [ ] |
| 5.17 | columns prop adjusts layout | [ ] |
| 5.18 | Hover animation works | [ ] |

### ToolUploadArea Component
| # | Checkpoint | Pass/Fail |
|---|------------|-----------|
| 5.19 | Drag-and-drop zone renders | [ ] |
| 5.20 | Click opens file picker | [ ] |
| 5.21 | File validation works (type/size) | [ ] |
| 5.22 | Error messages display correctly | [ ] |
| 5.23 | File previews show for images | [ ] |
| 5.24 | Remove individual file works | [ ] |
| 5.25 | Clear all button works | [ ] |
| 5.26 | Progress bar shows during processing | [ ] |
| 5.27 | isProcessing disables interaction | [ ] |

### ToolFeatureList Component
| # | Checkpoint | Pass/Fail |
|---|------------|-----------|
| 5.28 | String array converts to features | [ ] |
| 5.29 | columns prop changes layout | [ ] |
| 5.30 | large prop increases card size | [ ] |
| 5.31 | Icons display correctly | [ ] |

---

## 6. Visual Regression Risks

### High Risk Areas
| Risk | Mitigation |
|------|------------|
| Gradient animations may stutter | Test on mid-range devices |
| Mobile menu z-index conflicts | Verify above all page content |
| Tool card hover states | Check pointer-events not blocked |
| Upload area drop feedback | Ensure drop zone highlight visible |

### Medium Risk Areas
| Risk | Mitigation |
|------|------------|
| Backdrop blur performance | Test on mobile Safari/Chrome |
| Framer motion layout shifts | Add layoutId where needed |
| Dark theme contrast | Verify WCAG AA for text |

### Low Risk Areas
| Risk | Mitigation |
|------|------------|
| Font loading (FOUT) | Already using system fonts fallback |
| Icon rendering | Lucide icons are consistent |

---

## Browser Testing Matrix

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome | [ ] | [ ] |
| Firefox | [ ] | [ ] |
| Safari | [ ] | [ ] |
| Edge | [ ] | [ ] |

---

## Test Execution Order

1. **Desktop Chrome** - Full test first
2. **Mobile Chrome** - Responsive checks
3. **Other browsers** - Spot check
4. **Edge cases** - Empty states, errors

---

## Quick Validation Commands

```bash
# Start dev server
cd frontend && npm run dev

# Check TypeScript errors
cd frontend && npx tsc --noEmit

# Build check
cd frontend && npm run build
