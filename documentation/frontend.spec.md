# Frontend UI/UX Guidelines - Avanticlassic Project

## 🎨 **Design Philosophy**

### **Visual Identity**
- **Elegant Simplicity**: Clean, professional aesthetic befitting classical music
- **Typography-First**: Playfair Display font family for enhanced classical music aesthetic
- **Minimal Color Palette**: Black, white, and subtle grays with classical music imagery
- **Responsive Excellence**: Mobile-first approach with seamless desktop scaling

### **Brand Consistency**
- **Logo**: Avanticlassic wordmark with consistent placement
- **Color Scheme**: Monochromatic with high contrast for accessibility
- **Imagery**: High-quality artist photos and album artwork
- **Tone**: Professional, sophisticated, accessible

---

## 🖥️ **Main Site (Next.js) Design Specifications - UPDATED**

### **Layout Structure**
```
Hero Section: Video background with intro.mp4 (muted, hover sound control)
Header: Navigation + Language Switcher + Logo
Main Content: Dynamic content area with enhanced UX
Footer: Copyright + Social links
```

### **Typography Hierarchy**
- **H1**: 2.5rem (40px) - Page titles
- **H2**: 2rem (32px) - Section headers
- **H3**: 1.5rem (24px) - Subsection headers
- **Body**: 1rem (16px) - Regular text
- **Small**: 0.875rem (14px) - Metadata and captions

### **Component Design Patterns**

#### **Artist Cards - ENHANCED**
```css
.artist-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: box-shadow 0.3s ease;
  hover: box-shadow 0 4px 16px rgba(0,0,0,0.15);
  /* Artist pictures 100% larger - enhanced visual impact */
  .artist-image {
    height: 400px; /* Increased from 200px */
    width: 100%;
    object-fit: cover;
  }
}
```

#### **Release Grid - ENHANCED**
```css
.release-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
  /* Release cards same size as artist cards for consistency */
  .release-card {
    aspect-ratio: 1;
    min-height: 400px;
  }
}
```

#### **Navigation Menu**
- **Desktop**: Horizontal navigation with hover states
- **Mobile**: Hamburger menu with slide-out drawer
- **Language Switcher**: Flag icons with language codes

### **Responsive Breakpoints**
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

---

## 🔐 **Admin Panel Design Specifications - PRODUCTION READY**

### **Design Principles**
- **Functional First**: Prioritize usability over decoration
- **Consistent UI**: Material Design inspired components
- **Clear Hierarchy**: Obvious content organization
- **Efficient Workflow**: Minimal clicks to complete tasks

### **Color Palette - BLACK & WHITE THEME**
```css
:root {
  --primary: #000000;      /* Black - primary actions and text */
  --secondary: #6b7280;    /* Gray - secondary elements */
  --success: #10b981;      /* Green - success states */
  --warning: #f59e0b;      /* Amber - warnings */
  --error: #ef4444;        /* Red - errors */
  --background: #ffffff;   /* White - page background */
  --surface: #ffffff;      /* White - card backgrounds */
  --text: #000000;         /* Black - primary text */
  --text-secondary: #6b7280; /* Gray - secondary text */
  --border: #e5e7eb;       /* Light gray - borders */
}
```

### **Layout Structure - MOBILE RESPONSIVE**
```
Sidebar: Mobile-collapsible navigation + User info + Role-based menu visibility
Header: Page title + Quick actions + Mobile menu toggle
Main Content: Forms, data tables, and drag-and-drop interfaces
Toast: Notifications and alerts
```

### **Component Library**

#### **Buttons**
- **Primary**: Blue background, white text
- **Secondary**: Gray border, gray text
- **Danger**: Red background, white text
- **Ghost**: Transparent background, colored text

#### **Form Elements**
- **Input Fields**: Border radius 6px, focus ring
- **Textareas**: Auto-resize for content
- **File Upload**: Drag-and-drop zone with preview
- **Select Dropdowns**: Searchable with keyboard navigation

#### **Data Tables - WITH DRAG-AND-DROP**
- **Headers**: Sticky positioning, sortable columns
- **Rows**: Alternating background colors, hover states
- **Drag Handles**: Three-dot icons in first column for reordering
- **Actions**: Icon buttons for edit/delete
- **Pagination**: Simple prev/next with page numbers
- **Real-time Updates**: Visual feedback during drag operations

#### **Cards**
```css
.admin-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
```

### **Navigation Structure - TWO-TIER ACCESS CONTROL**
```
Dashboard
├── Artists (Company Admin + Super Admin)
│   ├── All Artists
│   ├── Add New Artist
│   └── Edit Artist Profiles
├── Releases (Company Admin + Super Admin) 
│   ├── All Releases with Drag-and-Drop Ordering
│   ├── Add New Release
│   └── Edit Release Details
├── Videos (Company Admin + Super Admin)
│   ├── All Videos with YouTube Integration
│   ├── Add New Video
│   └── Edit Video Metadata
├── Playlists (Company Admin + Super Admin)
│   ├── "By Artist" and "By Composer" Categories
│   ├── Add New Playlist
│   └── Edit Playlist Links
├── Reviews (Company Admin + Super Admin)
│   ├── 5-Star Rating System
│   ├── Add New Review
│   └── Edit Review Content
├── Distributors (Company Admin + Super Admin)
│   ├── Global Distributor Network
│   ├── Add New Distributor
│   └── Edit Contact Information
├── Users (Super Admin Only)
│   ├── Manage Admin Accounts
│   ├── Create Company Admin
│   └── Role Assignment
└── Settings (Super Admin Only)
    ├── Site Configuration
    ├── Social Media Links
    ├── Email Settings
    └── Advanced Options
```

---

## 📱 **Mobile Responsiveness**

### **Main Site Mobile Optimizations**
- **Touch-Friendly**: Minimum 44px touch targets
- **Readable Text**: 16px minimum font size
- **Optimized Images**: Responsive images with srcset
- **Fast Loading**: Critical CSS inlined, lazy loading

### **Admin Panel Mobile Adaptations**
- **Collapsible Sidebar**: Hidden by default on mobile
- **Touch-Optimized Forms**: Larger inputs and buttons
- **Swipe Actions**: Swipe to edit/delete on touch devices
- **Simplified Tables**: Horizontal scroll or card layout

---

## 🎯 **User Experience Guidelines**

### **Main Site UX Principles**
1. **Content Discovery**: Easy browsing of artists and releases
2. **Language Accessibility**: Seamless language switching
3. **Performance**: <2s load times on all devices
4. **Navigation**: Intuitive menu structure with breadcrumbs

### **Admin Panel UX Principles**
1. **Efficiency**: Complete tasks in minimal steps
2. **Error Prevention**: Clear validation and confirmation dialogs
3. **Progress Feedback**: Loading states and success messages
4. **Data Safety**: Auto-save drafts and confirmation for destructive actions

### **Content Management Workflow - ENHANCED**
```
1. Sign in with Google OAuth (Auth.js v5)
2. Navigate to content type based on role permissions
3. Add/Edit content with form validation
4. Use drag-and-drop for release ordering (NEW)
5. Upload and crop images with preview
6. Automatic database sync for ordering changes
7. Immediate reflection on main site
8. Audit logging for all administrative actions
```

---

## 🖼️ **Image Management Guidelines**

### **Image Requirements**
- **Artists**: 800px, 1125px, 1500px widths
- **Releases**: 400px standard, 1200px high-res
- **Carousel**: 1920px wide, optimized for hero display
- **Format**: JPEG for photos, PNG for graphics with transparency

### **Upload Experience**
1. **Drag & Drop Zone**: Visual feedback on hover/drop
2. **Image Preview**: Instant preview with crop controls
3. **Optimization**: Automatic compression and format conversion
4. **Progress Indicators**: Upload progress and processing status
5. **Error Handling**: Clear messages for unsupported formats

---

## 🔍 **Accessibility Standards**

### **WCAG 2.1 AA Compliance**
- **Color Contrast**: 4.5:1 for normal text, 3:1 for large text
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Readers**: Semantic HTML with proper ARIA labels
- **Focus Indicators**: Visible focus rings on all interactive elements

### **Implementation Requirements**
- **Alt Text**: Descriptive alt text for all images
- **Headings**: Proper heading hierarchy (H1 → H2 → H3)
- **Form Labels**: Associated labels for all form controls
- **Error Messages**: Clear, descriptive error messages

---

## 📊 **Performance Standards**

### **Main Site Performance Targets**
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1
- **Time to Interactive**: <3s

### **Admin Panel Performance Targets**
- **Page Load**: <2s on 3G connection
- **Form Submission**: <1s response time
- **Image Upload**: Progress indicators for >2s uploads
- **Navigation**: <200ms transition animations

---

## 🎨 **Animation and Transitions**

### **Main Site Animations**
```css
.fade-in {
  animation: fadeIn 0.6s ease-out;
}

.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}
```

### **Admin Panel Interactions**
- **Page Transitions**: 200ms ease-out
- **Button Hover**: 150ms color/shadow changes
- **Form Validation**: Smooth error message appearance
- **Loading States**: Skeleton screens and spinners

---

## 🎼 **Content Presentation Guidelines**

### **Artist Profile Layout**
1. **Hero Section**: Large artist photo with name overlay
2. **Biography**: Rich text with proper typography
3. **Discography**: Grid of related releases
4. **Related Content**: Videos and additional information

### **Release Detail Layout**
1. **Album Artwork**: High-resolution cover image
2. **Release Information**: Title, artist, year, label details
3. **Track Listing**: Numbered list with track titles and durations
4. **Purchase Links**: Streaming and purchase options

### **Video Gallery Layout**
1. **Thumbnail Grid**: Responsive grid with play overlays
2. **Video Player**: Embedded YouTube player with responsive sizing
3. **Video Information**: Title, artist, description
4. **Related Videos**: Suggestions based on artist or genre

---

## 🚀 **Future Enhancement Considerations**

### **Advanced Features**
- **Dark Mode**: Toggle for admin panel users
- **Advanced Search**: Full-text search across all content
- **Content Scheduling**: Publish content at specific times
- **Analytics Dashboard**: Content performance metrics

### **Progressive Web App Features**
- **Offline Capability**: Cached content for offline viewing
- **Push Notifications**: Admin notifications for content updates
- **Install Prompt**: Add to home screen functionality
- **Background Sync**: Queue admin actions when offline

---

## 📋 **Implementation Checklist - UPDATED STATUS**

### **Main Site Design - COMPLETED ✅**
- ✅ Implement responsive grid layouts
- ✅ Add smooth page transitions  
- ✅ Optimize image loading and sizing
- ✅ Test on multiple devices and browsers
- ✅ Validate accessibility compliance
- ✅ **NEW**: Video hero section with intro.mp4
- ✅ **NEW**: Playfair Display typography
- ✅ **NEW**: Enhanced artist photos (100% larger)
- ✅ **NEW**: Consistent card sizing

### **Admin Panel Design - PRODUCTION READY ✅**
- ✅ Create consistent component library
- ✅ Implement form validation and error states
- ✅ Add loading states and progress indicators
- ✅ Test admin workflow end-to-end
- ✅ Optimize for mobile admin usage
- ✅ **NEW**: Drag-and-drop ordering interface
- ✅ **NEW**: Two-tier role-based navigation
- ✅ **NEW**: Black & white professional theme
- ✅ **NEW**: Real-time database synchronization

### **Cross-Platform Testing - VERIFIED ✅**
- ✅ Desktop browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile devices (iOS Safari, Android Chrome)
- ✅ Tablet layouts (iPad, Android tablets)
- ✅ Accessibility tools (screen readers, keyboard navigation)
- ✅ Performance testing (Lighthouse, Core Web Vitals)
- ✅ **NEW**: Drag-and-drop touch support on mobile/tablet
- ✅ **NEW**: Role-based access control testing

## 🎯 **Session Handover Notes**

### **Ready for Next Session:**
- All UI/UX guidelines reflect current production state
- Drag-and-drop interface documented with @dnd-kit implementation
- Two-tier admin architecture visual patterns established
- Black & white theme with professional aesthetic completed
- Main site enhanced UX (video hero, larger photos, consistent sizing) documented

### **Key Design Decisions Made:**
1. **Typography**: Migrated from Helvetica to Playfair Display for classical music aesthetic
2. **Admin Theme**: Black & white professional theme for clean content management
3. **Interaction Design**: Drag-and-drop with three-dot handles and visual feedback
4. **Responsive Design**: Mobile-first with collapsible sidebar and touch-friendly interactions
5. **Role-Based UI**: Dynamic navigation hiding based on user permissions