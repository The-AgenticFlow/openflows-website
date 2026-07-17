# IZHUB Sub-Text Styling - Design Specification

## Core Design Principles
Based on the IZHUB design system and the provided `.izhub-hero-heading-copy` example:

1. **Typography**: Use `--font-landing-display` (Phonic) for all sub-texts
2. **Animation**: Apply `izhub-hero-fade-slide-down` with 60ms delay
3. **Weight**: Regular (400) font weight for readability
4. **Color Hierarchy**: Use opacity and color tokens for visual hierarchy
5. **Responsive**: Scale appropriately across all breakpoints

## CSS Class Definitions

### Animation Definition (Already exists in global.css)
```css
@keyframes izhub-hero-fade-slide-down {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Primary IZHUB Sub-Text (`.izhub-sub-text`)
```css
.izhub-sub-text {
  /* Typography */
  font-family: var(--font-landing-display);
  font-weight: 400;
  font-size: clamp(1.25rem, 2vw, 1.75rem); /* ~20-28px responsive */
  line-height: 1.3;
  letter-spacing: 0;
  text-wrap: balance;
  
  /* Color */
  color: var(--color-ink);
  opacity: 0.7; /* Subtle contrast for secondary text */
  
  /* Animation */
  animation: 0.5s cubic-bezier(0.191, 0.703, 0.704, 0.952) 60ms both izhub-hero-fade-slide-down;
  
  /* Spacing */
  margin-bottom: var(--space-4);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .izhub-sub-text {
    font-size: clamp(1.125rem, 3vw, 1.5rem);
    line-height: 1.4;
  }
}

@media (max-width: 480px) {
  .izhub-sub-text {
    font-size: 1.125rem; /* 18px */
    line-height: 1.5;
  }
}
```

### Secondary IZHUB Sub-Text (`.izhub-sub-text-secondary`)
```css
.izhub-sub-text-secondary {
  /* Inherit all properties from primary */
  font-family: var(--font-landing-display);
  font-weight: 400;
  font-size: clamp(1.125rem, 1.75vw, 1.5rem); /* ~18-24px */
  line-height: 1.4;
  letter-spacing: 0;
  text-wrap: balance;
  
  /* Different color for hierarchy */
  color: var(--color-graphite);
  opacity: 1; /* Full opacity for better readability */
  
  /* Animation */
  animation: 0.5s cubic-bezier(0.191, 0.703, 0.704, 0.952) 60ms both izhub-hero-fade-slide-down;
  
  /* Spacing */
  margin-bottom: var(--space-3);
}
```

### Muted IZHUB Sub-Text (`.izhub-sub-text-muted`)
```css
.izhub-sub-text-muted {
  /* Inherit all properties from primary */
  font-family: var(--font-landing-display);
  font-weight: 400;
  font-size: var(--font-size-base); /* 17px */
  line-height: 1.5;
  letter-spacing: 0;
  
  /* Muted appearance */
  color: var(--color-graphite);
  opacity: 0.5;
  
  /* Animation */
  animation: 0.5s cubic-bezier(0.191, 0.703, 0.704, 0.952) 60ms both izhub-hero-fade-slide-down;
  
  /* Smaller spacing */
  margin-bottom: var(--space-2);
}
```

### Small IZHUB Sub-Text (`.izhub-sub-text-sm`)
```css
.izhub-sub-text-sm {
  /* Smaller variant */
  font-family: var(--font-landing-display);
  font-weight: 400;
  font-size: var(--font-size-sm); /* 15px */
  line-height: 1.428;
  letter-spacing: 0;
  
  /* Color */
  color: var(--color-graphite);
  opacity: 0.7;
  
  /* Animation */
  animation: 0.5s cubic-bezier(0.191, 0.703, 0.704, 0.952) 60ms both izhub-hero-fade-slide-down;
  
  /* Minimal spacing */
  margin-bottom: var(--space-2);
}
```

## Implementation Plan

### Phase 1: Add Classes to Global CSS
Add the above class definitions to `src/styles/global.css` in the appropriate section (likely after the existing typography styles).

### Phase 2: Update Hero Component
Current `.sub` class in `Hero.module.css` needs enhancement:
```css
/* Current */
.sub {
  font-family: var(--font-landing-display);
  font-weight: 400;
  font-size: clamp(1.25rem, 2vw, 1.75rem);
  line-height: 1.3;
  letter-spacing: 0;
  color: var(--color-ink);
  opacity: 0.7;
  max-width: 760px;
  text-wrap: balance;
  animation: 0.5s cubic-bezier(0.191, 0.703, 0.704, 0.952) 60ms both izhub-hero-fade-slide-down;
}

/* Enhanced - Add margin and ensure consistency */
.sub {
  /* Keep all existing properties */
  margin-bottom: var(--space-6); /* Add proper spacing */
  
  /* Ensure it matches the global class */
  composes: izhub-sub-text; /* If CSS modules support composition */
}
```

### Phase 3: Update Other Components
For each component with `.subtitle` or `.sub` classes:

1. **FlowVisual** - Update `.subtitle` to use `izhub-sub-text-secondary`
2. **GetStartedBanner** - Update `.sub` to use `izhub-sub-text`
3. **FlowDiagram** - Update `.subtitle` to use `izhub-sub-text-secondary`
4. **IntegrationsGrid** - Update `.subtitle` to use `izhub-sub-text-secondary`

### Phase 4: Update Page-Level Styles
For each page with `.sub` classes, update to use appropriate IZHUB classes:

1. **Blog** - `.sub` → `izhub-sub-text-secondary`
2. **Demos** - `.sub` → `izhub-sub-text-secondary`
3. **Developer** - `.sub` → `izhub-sub-text-secondary`
4. **Developers** - `.sub` → `izhub-sub-text-secondary`
5. **About** - Review all text classes and apply IZHUB styling

## Migration Strategy

### Option A: CSS Composition (Preferred)
If CSS modules support composition:
```css
.sub {
  composes: izhub-sub-text from global;
  /* Component-specific overrides if needed */
  max-width: 760px;
}
```

### Option B: Direct Class Usage
Update JSX to use the global class directly:
```jsx
// From:
<p className={styles.sub}>Text</p>

// To:
<p className="izhub-sub-text">Text</p>
```

### Option C: Hybrid Approach
Keep component classes but extend global styles:
```css
.sub {
  /* All IZHUB properties */
  font-family: var(--font-landing-display);
  font-weight: 400;
  /* ... etc ... */
  animation: 0.5s cubic-bezier(0.191, 0.703, 0.704, 0.952) 60ms both izhub-hero-fade-slide-down;
  
  /* Component-specific additions */
  max-width: 760px;
}
```

## Testing Checklist

### Visual Testing
- [ ] Hero sub-text matches IZHUB styling exactly
- [ ] All component sub-texts are consistent
- [ ] Color hierarchy is visually clear
- [ ] Animations trigger correctly
- [ ] Responsive scaling works at all breakpoints

### Technical Testing
- [ ] CSS classes are properly defined in global.css
- [ ] No conflicts with existing styles
- [ ] Animation performance is smooth
- [ ] Font loading works correctly
- [ ] Print styles are not affected

### Accessibility Testing
- [ ] Color contrast meets WCAG standards
- [ ] Text remains readable when zoomed
- [ ] Screen readers can access the text
- [ ] Animation doesn't cause motion sickness

## Implementation Notes

1. **Font Loading**: Ensure Phonic font is properly loaded for `--font-landing-display`
2. **Animation Performance**: The cubic-bezier curve should ensure smooth animation
3. **Fallback Fonts**: The font stack should have appropriate fallbacks
4. **Browser Support**: Test in all supported browsers
5. **Performance Impact**: Minimal impact expected as we're reusing existing animations

## Success Metrics

1. **Consistency Score**: 100% of sub-texts use IZHUB styling
2. **Performance Score**: No degradation in page load or animation performance
3. **Accessibility Score**: All sub-texts meet WCAG AA contrast requirements
4. **Responsive Score**: Proper scaling across all defined breakpoints

Ready for implementation.