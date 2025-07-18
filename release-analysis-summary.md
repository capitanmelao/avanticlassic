# Avanti Classic Release Analysis Summary

## Current Product Structure Analysis

Based on analysis of 37 releases in the database and their corresponding Shopify shop URLs, here's the actual product structure:

### Product Format Distribution

1. **Hybrid SACD**: 22 releases (59%)
   - Standard price: €16.00
   - Some with bonus DVD: €16.00 (AC014, AC016) or €18.00 (AC009)
   - Examples: AC002, AC003, AC004, AC006, AC007, AC008, etc.

2. **Standard CD**: 6 releases (16%)
   - Single CD price: €14.00 (AC001, AC005, AC011)
   - Multi-CD bonus: €16.00 (AC010 - 1 CD + 1 Bonus CD)
   - Large multi-CD sets: €49.00 (AC028 - 7 CDs)

3. **Multi-CD Sets**: 2 releases (5%)
   - 2 CD: €20.00 (AC018)
   - 7 CD: €55.00 (AC036)

4. **DVD Bonus**: 3 releases (8%)
   - Always included with Hybrid SACD
   - No additional cost for most (AC014, AC016)
   - Slight premium for some (AC009 - €18.00)

5. **Unknown Format**: 7 releases (19%)
   - Recent releases without format indicator in URL
   - Prices vary: €14.00 - €45.00

### Pricing Structure

| Format | Price Range | Most Common |
|--------|-------------|-------------|
| Single CD | €14.00 | €14.00 |
| Hybrid SACD | €15.00 - €18.00 | €16.00 |
| Multi-CD (2 discs) | €20.00 | €20.00 |
| Multi-CD (7 discs) | €45.00 - €55.00 | €55.00 |
| Bonus DVD | No extra cost | Included |

### Key Insights

1. **Primary Format**: Hybrid SACD is the dominant format (59% of releases)
2. **Consistent Pricing**: €16.00 is the standard price for most single-disc releases
3. **No Vinyl**: No vinyl releases found in the current catalog
4. **Multi-disc Logic**: Price scales with number of discs (roughly €7-8 per disc)
5. **DVD Bonus**: Always bundled with SACD, never sold separately
6. **Digital Availability**: All products appear to have digital versions available

### Product Variants Analysis

Each product page shows:
- **Physical Format**: CD or Hybrid SACD
- **Digital Format**: Available for all releases
- **Bonus Content**: DVD included with select releases
- **Multi-disc**: Clearly indicated in product handle (e.g., "2-cd", "7-cd")

### Catalog Number Pattern

- Format: AC### (AC001 - AC037)
- Sequential numbering
- No format indication in catalog number
- All products have Shopify URLs with descriptive handles

### Recommended E-commerce Migration Strategy

Based on this analysis, the migration should create:

1. **Single Product per Release**: Each catalog number = one product
2. **Format as Variants**: 
   - Physical (CD/Hybrid SACD) - primary variant
   - Digital download - secondary variant
3. **Pricing Structure**:
   - Single disc: €14.00 (CD) / €16.00 (Hybrid SACD)
   - Multi-disc: Scale by number of discs
   - DVD bonus: Included, no extra cost
4. **Inventory Management**: Physical vs Digital availability
5. **Product Categories**: By format, artist, or genre

### Technical Implementation

The migration should:
- Create products table with variant support
- Import actual prices from Shopify analysis
- Handle multi-disc releases as single products with higher prices
- Include DVD content as product metadata, not separate SKUs
- Support both physical and digital fulfillment methods

### Missing Information

Some newer releases (AC029-AC037) lack format information in URLs, suggesting:
- Shopify URL structure may have changed
- Need to manually verify formats for recent releases
- May indicate shift in product strategy

This analysis provides the foundation for creating an accurate e-commerce migration that reflects the actual business model rather than assumptions about format variants.