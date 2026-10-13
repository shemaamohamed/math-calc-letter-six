# UI & Numerology Calculator Constraints

1. Theme & Styling:
   - Always default to and strictly enforce Light Mode. Never implement dark mode or dark backgrounds.
   - Zero-Purple Rule: Never use purple, violet, or fuchsia hues anywhere in styling, icons, gradients, or tokens.
   - Color tokens must be slate grays, crisp white, deep blue primary (#1e40af / #2563eb), and emerald success (#059669 / #10b981).
   - High contrast text and crisp, well-defined borders between sections.

2. Component Order & Structure:
   - Preserve existing screen layout structure and component hierarchy unless explicitly asked to reorganize.
   - Maintain the standard two-column layout on desktop: Input on one side, Results on the other side.
   - Distinct result rows for final slot values with adjacent interactive transfer buttons ("زر انتقال").
   - Prominent summary card for the final 10-digit sum at the bottom.

3. Mathematical Precision:
   - Maintain arbitrary precision using BigInt fractions (no floating point rounding during intermediate calculations).
   - Run 4 iterations (3 hidden in background, 1 visible in UI).
