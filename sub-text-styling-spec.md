# IZHUB Sub-Text Styling Implementation - Requirements Specification

## Overview
Implement consistent IZHUB text styling for all sub-text elements across the OpenFlows website based on the provided `.izhub-hero-heading-copy` style example.

## Current State Analysis

### Design System
From examining the codebase, the website uses a comprehensive IZHUB design system with:
- **Font Families**: 
  - `--font-landing-display` (Phonic) for display/hero text
  - `--font-app-sans` (Inter) for body text
  - `--font-mono` for code/technical text
- **Typography Scale**: Comprehensive font size tokens (`--font-size-xs` to `--font-size-hero`)
- **Animation**: `izhub-hero-fade-slide-down` already defined in global.css
- **Color Palette**: Complete IZHUB color tokens (parchment, ink, aubergine, graphite, etc.)

### Current Sub-Text Patterns Found
1. **Hero Component**: `.sub` class with:
   - `font-family: var(--font-landing-display)`
   - `font-weight: 400`
   - `animation: 0.5s cubic-bezier(0.191, 0.703, 0.704, 0.952) 60ms both izhub-hero-fade-slide-down`
   - `font-size: clamp(1.25rem, 2vw, 1.75rem)`
   - `color: var(--color-ink)` with `opacity: 0.7`

2. **Other Components**: Various `.sub` and `.subtitle` classes with:
   - `font-size: var(--font-size-base)` or `18px`
   - `color: var(--color-graphite)`
   - Missing IZHUB font family and animation

3. **Page-level Styles**: Multiple pages have `.sub` classes with inconsistent styling

## Detailed Requirements

### 1. Core IZHUB Sub-Text Style Definition
Create consistent CSS classes with these exact specifications:

**Primary IZHUB Sub-Text (`.izhub-sub-text`)**:
- `font-family: var(--font-landing-display)` (Phonic)
- `animation: 0.5s cubic-bezier(.191, .703, .704, .952) 60ms both izhub-hero-fade-slide-down`
- `font-weight: 400` (matches current Hero `.sub` class)
- `color: var(--color-ink)` with `opacity: 0.7` (for subtle contrast)
- `font-size: clamp(1.25rem, 2vw, 1.75rem)` (responsive scaling)
- `line-height: 1.3`
- `letter-spacing: 0` (no additional tracking)
- `text-wrap: balance`

**Secondary IZHUB Sub-Text (`.izhub-sub-text-secondary`)**:
- Same as primary but with `color: var(--color-graphite)` for less prominent text
- No opacity adjustment

**Muted IZHUB Sub-Text (`.izhub-sub-text-muted`)**:
- Same as primary but with `color: var(--color-graphite)` and `opacity: 0.5`
- For disabled or tertiary text

### 2. Target Elements Analysis
Based on code examination, these elements need IZHUB styling:

**Component-Level Sub-Texts**:
1. `src/organisms/Hero/Hero.jsx` - `.sub` class ✓ (already has partial IZHUB styling)
2. `src/organisms/FlowVisual/FlowVisual.jsx` - `.subtitle` class
3. `src/organisms/GetStartedBanner/GetStartedBanner.jsx` - `.sub` class
4. `src/organisms/FlowDiagram/FlowDiagram.jsx` - `.subtitle` class
5. `src/organisms/IntegrationsGrid/IntegrationsGrid.module.css` - `.subtitle` class

**Page-Level Sub-Texts**:
1. `src/pages/blog/Blog.module.css` - `.sub` class
2. `src/pages/demos/Demos.module.css` - `.sub` class
3. `src/pages/Developer.module.css` - `.sub` class
4. `src/pages/developers/Developers.module.css` - `.sub` class
5. `src/pages/About.module.css` - Various text classes

**Additional Text Elements**:
- Card descriptions
- Feature descriptions
- Form helper text
- Any paragraph elements that serve as secondary text

### 3. Implementation Strategy

**Phase 1: Core Style Definitions**
1. Add new IZHUB sub-text classes to `src/styles/global.css`
2. Define the three variants (primary, secondary, muted)
3. Ensure responsive behavior matches IZHUB design principles

**Phase 2: Component Updates**
1. Update Hero component to use full IZHUB styling (currently missing some properties)
2. Update FlowVisual, GetStartedBanner, FlowDiagram components
3. Update IntegrationsGrid and other organism components

**Phase 3: Page-Level Updates**
1. Update all page-level `.sub` classes to use IZHUB styling
2. Ensure consistency across blog, demos, developer pages
3. Update About page text styling

**Phase 4: Global Consistency**
1. Create utility classes for easy adoption
2. Update documentation for future component development
3. Verify no visual regressions

### 4. Design System Integration Requirements
- Use existing IZHUB design tokens exclusively
- Maintain the IZHUB animation timing and easing
- Follow IZHUB typography scale for responsive sizing
- Use IZHUB color palette appropriately
- Ensure all animations use the defined cubic-bezier curve

### 5. Technical Implementation Details

**Files to Modify**:
1. `src/styles/global.css` - Add new IZHUB sub-text classes
2. `src/organisms/Hero/Hero.module.css` - Enhance existing `.sub` class
3. `src/organisms/FlowVisual/FlowVisual.module.css` - Update `.subtitle`
4. `src/organisms/GetStartedBanner/GetStartedBanner.module.css` - Update `.sub`
5. `src/organisms/FlowDiagram/FlowDiagram.module.css` - Update `.subtitle`
6. `src/organisms/IntegrationsGrid/IntegrationsGrid.module.css` - Update `.subtitle`
7. All page-level CSS files with `.sub` classes

**CSS Classes to Create**:
1. `.izhub-sub-text` - Primary variant
2. `.izhub-sub-text-secondary` - Secondary variant (graphite color)
3. `.izhub-sub-text-muted` - Muted variant (graphite with opacity)
4. Utility classes for different font sizes if needed

### 6. Success Criteria
1. **Consistency**: All sub-text elements use identical IZHUB styling
2. **Animation**: All sub-texts have the fade-slide-down animation with 60ms delay
3. **Typography**: Font family, weight, and sizing follow IZHUB design system
4. **Responsiveness**: All text scales appropriately across breakpoints
5. **Accessibility**: Sufficient color contrast and readable text sizes
6. **Performance**: Animations are smooth and non-blocking
7. **Maintainability**: Easy to add new sub-text elements with consistent styling

### 7. Testing Plan
1. Visual regression testing across all pages
2. Responsive testing at breakpoints: 320px, 768px, 1024px, 1280px
3. Animation performance testing
4. Accessibility testing (contrast ratios, screen readers)
5. Cross-browser testing (Chrome, Firefox, Safari)

## Implementation Priority
1. First: Hero component (already partially implemented)
2. Second: Key organism components (FlowVisual, GetStartedBanner)
3. Third: Page-level sub-texts
4. Fourth: Additional components and edge cases

## Timeline Estimate
- Requirements Analysis: Complete ✓
- Core Style Implementation: 1-2 hours
- Component Updates: 2-3 hours
- Testing and Refinement: 1-2 hours
- Total: 4-7 hours

Ready to proceed with implementation.