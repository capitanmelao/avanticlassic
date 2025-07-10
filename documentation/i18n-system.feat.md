# Internationalization System Feature Specification

## Overview

The internationalization (i18n) system provides multilingual support for the Avanticlassic website, supporting English, French, and German languages through a custom-built translation framework.

## Feature Description

### Core Functionality
- **Language Detection**: Automatic language routing based on URL structure
- **Translation Management**: JSON-based translation files with nested key structure
- **Template Integration**: Seamless translation function integration in Eta templates
- **URL Generation**: Language-aware URL generation for all content types

### Supported Languages
- **English (en)**: Primary language and fallback
- **French (fr)**: Secondary language for French-speaking audience
- **German (de)**: Secondary language for German-speaking audience

## Technical Architecture

### Translation Service Implementation
```typescript
class TranslationService {
  private translations: NestedObject = {};
  public langs: string[] = ['en', 'fr', 'de'];
  
  async loadTranslations(): Promise<void>
  translate(lang: string, key: string): string
  private getNestedValue(obj: any, path: string): string
}
```

### Translation File Structure
```json
{
  "menu": {
    "ourArtists": "Our Artists",
    "releases": "Releases",
    "videos": "Videos",
    "about": "About"
  },
  "artists": {
    "searchArtist": "Search artist",
    "1": {
      "description": "Artist biography content..."
    }
  },
  "releases": {
    "1": {
      "title": "Release title",
      "description": "Release description..."
    }
  }
}
```

### Template Integration
```html
<!-- Navigation menu translation -->
<a href="/<%=it.lang%>/artists.html">
  <%= it.translate('menu.ourArtists') %>
</a>

<!-- Dynamic content translation -->
<p><%= it.translate(`artists.${artist.id}.description`) %></p>
```

## URL Structure Design

### Language-First Routing
- **Homepage**: `/{lang}/`
- **Artists**: `/{lang}/artists.html`
- **Artist Detail**: `/{lang}/artists/{artist-url}.html`
- **Releases**: `/{lang}/releases.html`
- **Release Detail**: `/{lang}/releases/{release-url}.html`
- **Videos**: `/{lang}/videos.html`
- **About**: `/{lang}/about.html`

### Language Selector Component
```html
<select onchange="changeLanguage(this.value)">
  <option value="en" <%= it.lang === 'en' ? 'selected' : '' %>>EN</option>
  <option value="fr" <%= it.lang === 'fr' ? 'selected' : '' %>>FR</option>
  <option value="de" <%= it.lang === 'de' ? 'selected' : '' %>>DE</option>
</select>
```

## Content Management Workflow

### Adding New Translations
1. **Update Translation Files**: Add new keys to all language files
2. **Maintain Key Consistency**: Ensure identical key structure across languages
3. **Nested Organization**: Use dot notation for hierarchical content
4. **Rebuild Site**: Generate new static pages with updated translations

### Translation Key Conventions
- **Menu Items**: `menu.{itemName}`
- **Page Content**: `{pageName}.{contentKey}`
- **Dynamic Content**: `{contentType}.{id}.{field}`
- **Common Elements**: `common.{elementName}`

## SEO and Accessibility

### SEO Optimization
- **hreflang Tags**: Automatic generation for language alternatives
- **Language Declaration**: Proper HTML lang attribute setting
- **URL Structure**: Clean, language-aware URLs
- **Content Duplication**: Avoid duplicate content penalties

### Accessibility Features
- **Language Switching**: Keyboard-accessible language selector
- **Screen Reader Support**: Proper ARIA labels for language elements
- **Content Direction**: Support for RTL languages (future enhancement)

## Implementation Details

### Build Process Integration
```typescript
// In RenderService.renderAllPages()
await Promise.all(TranslationService.instance.langs.map(async (lang) => {
  const html = this.eta.render(templatePath, {
    translate: (key: string) => TranslationService.instance.translate(lang, key),
    lang: lang,
    langs: TranslationService.instance.langs,
    // ... other context
  });
}));
```

### Error Handling
- **Missing Keys**: Fallback to key name if translation not found
- **Missing Languages**: Fallback to English if language not available
- **Malformed JSON**: Graceful degradation with error logging

## Testing Strategy

### Translation Coverage
- **Key Completeness**: Verify all keys exist in all languages
- **Content Accuracy**: Validate translation quality
- **URL Generation**: Test language-aware routing
- **Template Rendering**: Ensure all translations appear correctly

### Test Cases
1. **Language Switching**: Verify language selector functionality
2. **URL Routing**: Test all language-specific URLs
3. **Content Rendering**: Validate translated content display
4. **Error Handling**: Test missing key scenarios
5. **SEO Tags**: Verify hreflang and meta tag generation

## Performance Considerations

### Loading Optimization
- **Eager Loading**: All translations loaded at build time
- **Memory Efficiency**: Singleton pattern for translation service
- **Build Performance**: Parallel processing for language variants

### Caching Strategy
- **Static Generation**: Pre-rendered HTML for all languages
- **CDN Optimization**: Language-specific caching headers
- **Browser Caching**: Long-term caching for translation assets

## Future Enhancements

### Potential Improvements
1. **Dynamic Language Detection**: Browser language preference detection
2. **Translation Management Interface**: Web-based translation editor
3. **Content Validation**: Automated translation completeness checking
4. **Right-to-Left Support**: Enhanced RTL language support
5. **Translation Memory**: Reuse translations across similar content

### Scalability Considerations
- **Additional Languages**: Easy addition of new languages
- **Content Volume**: Efficient handling of large translation files
- **Build Performance**: Optimization for sites with many languages

## Migration Notes

### From Angular i18n
- **Simplified Structure**: No complex Angular i18n setup required
- **JSON-Based**: Human-readable translation files
- **Build Integration**: Seamless static generation process
- **SEO Benefits**: Pre-rendered multilingual content

### Compatibility
- **Browser Support**: Works in all modern browsers
- **Fallback Strategy**: Graceful degradation for unsupported scenarios
- **Development Experience**: Simple translation workflow for developers