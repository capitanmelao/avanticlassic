# Frontend UI/UX Guidelines - Avanticlassic Project

## 🎨 **Design Philosophy**

### **Visual Identity**
- **Elegant Simplicity**: Clean, professional aesthetic befitting classical music
- **Typography-First**: Helvetica font family for readability and sophistication
- **Minimal Color Palette**: Black, white, and subtle grays with classical music imagery
- **Responsive Excellence**: Mobile-first approach with seamless desktop scaling

### **Brand Consistency**
- **Logo**: Avanticlassic wordmark with consistent placement
- **Color Scheme**: Monochromatic with high contrast for accessibility
- **Imagery**: High-quality artist photos and album artwork
- **Tone**: Professional, sophisticated, accessible

---

## 🖥️ **Main Site (Astro) Design Specifications**

### **Layout Structure**
```
Header: Navigation + Language Switcher + Logo
Main Content: Dynamic content area
Footer: Copyright + Social links
```

### **Typography Hierarchy**
- **H1**: 2.5rem (40px) - Page titles
- **H2**: 2rem (32px) - Section headers
- **H3**: 1.5rem (24px) - Subsection headers
- **Body**: 1rem (16px) - Regular text
- **Small**: 0.875rem (14px) - Metadata and captions

### **Component Design Patterns**

#### **Artist Cards**
```css
.artist-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: box-shadow 0.3s ease;
  hover: box-shadow 0 4px 16px rgba(0,0,0,0.15);
}
```

#### **Release Grid**
```css
.release-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
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

## 🔐 **Admin Panel Design Specifications**

### **Design Principles**
- **Functional First**: Prioritize usability over decoration
- **Consistent UI**: Material Design inspired components
- **Clear Hierarchy**: Obvious content organization
- **Efficient Workflow**: Minimal clicks to complete tasks

### **Color Palette**
```css
:root {
  --primary: #3b82f6;      /* Blue - primary actions */
  --secondary: #64748b;    /* Gray - secondary elements */
  --success: #10b981;      /* Green - success states */
  --warning: #f59e0b;      /* Amber - warnings */
  --error: #ef4444;        /* Red - errors */
  --background: #f8fafc;   /* Light gray - page background */
  --surface: #ffffff;      /* White - card backgrounds */
  --text: #1f2937;         /* Dark gray - primary text */
  --text-secondary: #6b7280; /* Medium gray - secondary text */
}
```

### **Layout Structure**
```
Sidebar: Navigation + User info
Header: Page title + Quick actions
Main Content: Forms and data tables
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

#### **Data Tables**
- **Headers**: Sticky positioning, sortable columns
- **Rows**: Alternating background colors, hover states
- **Actions**: Icon buttons for edit/delete
- **Pagination**: Simple prev/next with page numbers

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

### **Navigation Structure**
```
Dashboard
├── Artists
│   ├── All Artists
│   ├── Add New Artist
│   └── Artist Categories
├── Releases
│   ├── All Releases
│   ├── Add New Release
│   └── Release Types
├── Videos
│   ├── All Videos
│   ├── Add New Video
│   └── Video Categories
├── Media
│   ├── Image Library
│   ├── Upload Images
│   └── Media Settings
└── Settings
    ├── Site Settings
    ├── User Profile
    └── Publishing
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

### **Content Management Workflow**
```
1. Sign in with Google OAuth
2. Navigate to content type (Artists/Releases/Videos)
3. Add/Edit content with form validation
4. Upload and crop images with preview
5. Preview changes before publishing
6. Publish to live site with one click
7. Receive confirmation and view live content
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

## 📋 **Implementation Checklist**

### **Main Site Design**
- [ ] Implement responsive grid layouts
- [ ] Add smooth page transitions
- [ ] Optimize image loading and sizing
- [ ] Test on multiple devices and browsers
- [ ] Validate accessibility compliance

### **Admin Panel Design**
- [ ] Create consistent component library
- [ ] Implement form validation and error states
- [ ] Add loading states and progress indicators
- [ ] Test admin workflow end-to-end
- [ ] Optimize for mobile admin usage

### **Cross-Platform Testing**
- [ ] Desktop browsers (Chrome, Firefox, Safari, Edge)
- [ ] Mobile devices (iOS Safari, Android Chrome)
- [ ] Tablet layouts (iPad, Android tablets)
- [ ] Accessibility tools (screen readers, keyboard navigation)
- [ ] Performance testing (Lighthouse, Core Web Vitals)