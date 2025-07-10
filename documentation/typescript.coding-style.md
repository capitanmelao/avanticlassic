# TypeScript Coding Style Guide

## Overview

This document establishes coding standards for the Avanticlassic project, focusing on TypeScript/JavaScript for the SSG system and maintaining consistency with the existing codebase architecture.

## File Organization

### Directory Structure
```
src/
├── services/           # Core business logic
├── models/            # Type definitions and interfaces
├── utils/             # Utility functions
├── templates/         # Template-related code
└── tests/             # Test files
```

### File Naming
- **Services**: `{name}.service.ts`
- **Models**: `{name}.model.ts`
- **Utilities**: `{name}.util.ts`
- **Tests**: `{name}.test.ts`
- **Components**: `{name}.component.ts`

## TypeScript Style

### Type Definitions
```typescript
// Use interfaces for object shapes
interface Artist {
  id: number;
  url: string;
  name: string;
  facebook?: string;
}

// Use type aliases for unions and primitives
type Language = 'en' | 'fr' | 'de';
type SortOrder = 'asc' | 'desc';

// Use generic constraints when appropriate
interface Repository<T extends { id: number }> {
  findById(id: number): T | undefined;
  findAll(): T[];
}
```

### Class Structure
```typescript
export class DataService {
  // Private static instance for singleton
  static #instance: DataService;
  
  // Public properties first
  public data: NestedObject = {};
  
  // Private properties
  private initialized = false;
  
  // Constructor
  private constructor() {
    // Private constructor for singleton
  }
  
  // Static methods
  public static get instance(): DataService {
    if (!DataService.#instance) {
      DataService.#instance = new DataService();
    }
    return DataService.#instance;
  }
  
  // Public methods
  public async loadData(): Promise<void> {
    // Implementation
  }
  
  // Private methods
  private validateData(data: unknown): boolean {
    // Implementation
  }
}
```

### Method Signatures
```typescript
// Use explicit return types for public methods
public async loadData(): Promise<void> {
  // Implementation
}

// Use arrow functions for simple utilities
const formatUrl = (text: string): string => 
  text.toLowerCase().replace(/\s+/g, '-');

// Use function declarations for complex logic
function processComplexData(data: ComplexType): ProcessedType {
  // Complex implementation
}
```

## Naming Conventions

### Variables and Functions
- **camelCase**: For variables, functions, and methods
- **PascalCase**: For classes, interfaces, and types
- **UPPER_SNAKE_CASE**: For constants

```typescript
// Variables
const artistData = await loadArtists();
const currentLanguage = 'en';

// Functions
function parseTracklist(markdown: string): TracklistItem[] {
  // Implementation
}

// Classes
class RenderService {
  // Implementation
}

// Interfaces
interface ArtistData {
  // Properties
}

// Constants
const DEFAULT_LANGUAGE = 'en';
const MAX_ITEMS_PER_PAGE = 12;
```

### File and Directory Names
- **kebab-case**: For file and directory names
- **Descriptive**: Clear indication of purpose

```
data-service.ts
render-service.ts
artist-data.model.ts
translation-tree.model.ts
```

## Code Structure

### Import Organization
```typescript
// External library imports first
import { Eta } from "@eta-dev/eta";
import { join } from "@std/path";

// Internal imports grouped by type
import { DataService } from "./data.service.ts";
import { TranslationService } from "./translation.service.ts";

// Type-only imports
import type { Artist, Release } from "../models/index.ts";
```

### Export Organization
```typescript
// Named exports preferred
export { DataService } from "./data.service.ts";
export { RenderService } from "./render.service.ts";

// Default exports only when single primary export
export default class ApiClient {
  // Implementation
}
```

## Error Handling

### Exception Handling
```typescript
// Use specific error types
class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Handle errors gracefully
public async loadData(): Promise<void> {
  try {
    const data = await this.fetchData();
    this.validateData(data);
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error(`Validation failed for field: ${error.field}`);
      throw error;
    }
    
    console.error('Unexpected error loading data:', error);
    throw new Error('Failed to load data');
  }
}
```

### Validation Patterns
```typescript
// Use type guards for runtime validation
function isArtist(obj: unknown): obj is Artist {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as Artist).id === 'number' &&
    typeof (obj as Artist).name === 'string'
  );
}

// Use assertion functions for required validation
function assertIsArtist(obj: unknown): asserts obj is Artist {
  if (!isArtist(obj)) {
    throw new ValidationError('Invalid artist data', 'artist');
  }
}
```

## Async/Await Patterns

### Promise Handling
```typescript
// Use async/await over Promise chains
public async renderAllPages(): Promise<void> {
  await this.init();
  
  const pages = await this.getPages();
  const languages = this.getLanguages();
  
  // Process in parallel when possible
  await Promise.all(
    languages.map(async (lang) => {
      await Promise.all(
        pages.map(page => this.renderPage(page, lang))
      );
    })
  );
}
```

### Error Propagation
```typescript
// Let errors bubble up with context
public async renderPage(page: string, lang: string): Promise<void> {
  try {
    const content = await this.loadContent(page, lang);
    await this.writeFile(content);
  } catch (error) {
    throw new Error(`Failed to render page ${page} for language ${lang}: ${error.message}`);
  }
}
```

## Documentation Standards

### JSDoc Comments
```typescript
/**
 * Renders a single page for all supported languages
 * @param pageName - The name of the page template to render
 * @returns Promise that resolves when all language versions are rendered
 * @throws {Error} When template is not found or rendering fails
 */
public async renderPage(pageName: string): Promise<void> {
  // Implementation
}

/**
 * Artist data model representing a classical music performer
 */
interface Artist {
  /** Unique identifier for the artist */
  id: number;
  /** URL-friendly slug for the artist */
  url: string;
  /** Display name of the artist */
  name: string;
  /** Optional Facebook profile URL */
  facebook?: string;
}
```

### Code Comments
```typescript
// Use comments for complex business logic
public async processTracklist(markdown: string): Promise<TracklistItem[]> {
  // Convert markdown table to structured data
  // Expected format: | Track | Title | Duration |
  const lines = markdown.split('\n');
  
  // Skip header and separator rows
  const dataLines = lines.slice(2);
  
  return dataLines.map(line => this.parseTrackLine(line));
}

// Avoid obvious comments
const artists = await this.loadArtists(); // ❌ Don't do this
```

## Testing Standards

### Test Structure
```typescript
import { assertEquals, assertThrows } from "@std/testing/asserts";
import { DataService } from "../services/data.service.ts";

Deno.test("DataService - loadData", async () => {
  // Arrange
  const service = DataService.instance;
  
  // Act
  await service.loadData();
  
  // Assert
  assertEquals(typeof service.data, 'object');
  assertEquals(service.data.artists.length > 0, true);
});

Deno.test("DataService - handles invalid data", async () => {
  // Arrange
  const service = DataService.instance;
  
  // Act & Assert
  await assertThrows(
    async () => await service.loadInvalidData(),
    Error,
    "Invalid data format"
  );
});
```

### Test Naming
- **Descriptive**: Clear description of what is being tested
- **Structure**: `ClassName - methodName - scenario`
- **Behavior**: Focus on behavior, not implementation

## Performance Considerations

### Efficient Patterns
```typescript
// Use Set for unique collections
const uniqueArtistIds = new Set(releases.flatMap(r => r.artists));

// Use Map for key-value lookups
const artistMap = new Map(artists.map(a => [a.id, a]));

// Avoid unnecessary iterations
const featuredArtists = artists.filter(a => a.featured);
const sortedFeatured = featuredArtists.sort((a, b) => a.name.localeCompare(b.name));
```

### Memory Management
```typescript
// Clean up resources
public async cleanup(): Promise<void> {
  this.data = {};
  this.cache.clear();
}

// Use weak references for cached data when appropriate
private cache = new WeakMap<object, ProcessedData>();
```

## Security Considerations

### Input Validation
```typescript
// Validate all external input
public validateArtistData(data: unknown): Artist {
  if (!isArtist(data)) {
    throw new ValidationError('Invalid artist data');
  }
  
  // Sanitize string inputs
  return {
    ...data,
    name: this.sanitizeString(data.name),
    facebook: data.facebook ? this.sanitizeUrl(data.facebook) : undefined
  };
}
```

### Safe Operations
```typescript
// Use safe property access
const artistName = artist?.name ?? 'Unknown Artist';

// Validate URLs before use
private isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
```

## Consistency Guidelines

### Follow Existing Patterns
- Maintain consistency with Baptiste's architectural decisions
- Use singleton pattern for services as established
- Follow existing file organization structure
- Maintain compatibility with current build process

### Code Style Enforcement
- Use Deno's built-in formatter: `deno fmt`
- Use Deno's built-in linter: `deno lint`
- Configure IDE to match project style settings
- Run checks before committing changes

## Migration Guidelines

### Refactoring Existing Code
- Maintain backward compatibility
- Add types gradually to existing JavaScript
- Document any breaking changes
- Test thoroughly after refactoring

### Adding New Features
- Follow established patterns
- Add appropriate type definitions
- Include comprehensive tests
- Document public APIs