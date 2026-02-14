# Encyclopedia Improvements & Analysis

This document outlines the current state, missing features, and planned improvements for the Encyclopedia area of the application.

## Current State Analysis

The Encyclopedia is functional for browsing a list of perfumes and viewing basic details. However, it suffers from several key deficiencies:

### 1. Naming Format Issues
- **Problem**: Perfume names, brands, and other attributes are displayed in "database format" (kebab-case, e.g., `santal-33`, `xerjoff`).
- **Solution**: Implement a `toTitleCase` transformation layer in the data parsing logic to convert these to readable titles (e.g., "Santal 33", "Xerjoff").

### 2. Missing Visual Assets
- **Problem**: The vast majority of perfumes lack images. The CSV data provides Fragrantica URLs but no direct image links, and external scraping is restricted.
- **Solution**: Implement a **Generative Placeholder System**. instead of showing a blank or generic icon, we will generate a unique visual representation for each perfume based on its "Main Accords" (e.g., Citrus -> Yellow/Green gradient, Woody -> Brown/Beige gradient). This ensures every entry has a "cover image" that reflects its olfactive character.

### 3. Missing Data Fields
Based on the CSV schema and UI requirements, the following data is often missing or incomplete for many entries:
- **Detailed Composition**: The CSV only provides basic notes (Top/Middle/Base), not the detailed chemical composition percentages used in the detailed view.
- **History/Trivia**: The "History" and "Trivia" sections are largely empty for bulk-imported data.
- **Performance Metrics**: Sillage and Longevity are often set to 0 or defaults if not present in the source data.
- **Analyzed Description**: The description fields are generic templates rather than specific analysis.

## Planned Improvements

### Implementation Plan
1.  **Data Transformation Layer**: Update `src/lib/perfume-csv.ts` to normalize names and attributes.
2.  **Generative UI Component**: Create `PerfumePlaceholder` to generate accord-based visuals.
3.  **UI Integration**: Update `page.tsx` to utilize these new assets and formatted names.

### Future Suggestions
- **Community Sourcing**: Allow users to contribute missing data (images, history).
- **AI Enrichment**: Use the AI backend to generate descriptions and history based on the notes and brand.
- **Better Filtering**: Add filters for specific notes (e.g., "contains Rose AND Sandalwood").
