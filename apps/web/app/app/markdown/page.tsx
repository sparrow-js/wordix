"use client";
import { useState } from "react";
import Markdown from "react-markdown";

export default function MarkdownPage() {
  const [markdown, setMarkdown] = useState(`


Provide an image and output a detailed description based on the image content, adhering to the following guidelines and examples provided.

# Steps

1. **Image Analysis**:

   - Describe the navigation elements, layout components, content sections, interactive controls, color schemes, and grid/layout structure seen in the image.

2. **Development Planning**:

   - Outline the project structure, key features, state management, routes, component architecture, and responsive breakpoints based on the image.

3. Ensure the content is comprehensive and covers all necessary components and features without directly providing specific code.

# Output Format

- The output should be a structured webpage description encompassing analysis and planning details.

# Examples

**Example 1**

**Input**: image

**Output**:

Create detailed components with these requirements:

- Use 'use client' directive for client-side components
- Style with Tailwind CSS utility classes for responsive design
- Use Lucide React for icons (from lucide-react package). Do NOT use other UI libraries unless requested
- Use stock photos from picsum.photos where appropriate, only valid URLs you know exist
- Configure next.config.js image remotePatterns to enable stock photos from picsum.photos
- Create root layout.tsx page that wraps necessary navigation items to all pages
- MUST implement the navigation elements items in their rightful place i.e. Left sidebar, Top header
- Accurately implement necessary grid layouts
- Follow proper import practices:
  
  - Use @/ path aliases
  - Keep component imports organized
  - Update current src/app/page.tsx with new comprehensive code
  - Don't forget root route (page.tsx) handling
  - You MUST complete the entire prompt before stopping

AI Development Platform Landing Page with Announcement Banner

&lt;image_analysis&gt;

1. Navigation Elements:

   - Top banner with financing announcement
   - Main header navigation with: Docs, Pricing, Careers, About us, Use cases
   - Right-aligned CTAs: Sign in, Try for free

2. Layout Components:

   - Full-width announcement banner (height: 60px)
   - Header container (height: 80px)
   - Hero section (height: \~80vh)
   - Logo container (width: 150px)
   - Navigation spacing: 32px between items

3. Content Sections:

   - Announcement banner with close button
   - Main navigation header
   - Hero section with:
     
     - Technical/Non-technical toggle
     - Main headline
     - Subheadline
     - Dual CTA buttons
     - Background image with forest/mist scene

4. Interactive Controls:

   - Toggle switch for technical/non-technical view
   - "Try for free" primary button
   - "Book a demo" secondary button
   - "Go to announcement" link
   - Close (X) button for banner
   - Navigation links

5. Colors:

   - Primary Green: #90EE90 (AI highlight)
   - Black: #000000 (background)
   - White: #FFFFFF (text)
   - Gray: #F5F5F5 (secondary buttons)
   - Transparent overlay on hero image

6. Grid/Layout Structure:

   - 12-column grid system
   - Max-width container: 1280px
   - Padding: 24px (mobile), 48px (desktop)
   - Responsive breakpoints at 768px, 1024px

&lt;development_planning&gt;

1. Project Structure:

   \`\`\`
   src/
   ├── components/
   │   ├── layout/
   │   │   ├── AnnouncementBanner
   │   │   ├── Header
   │   │   └── Hero
   │   ├── features/
   │   │   ├── TechnicalToggle
   │   │   └── CTAButtons
   │   └── shared/
   ├── assets/
   ├── styles/
   ├── hooks/
   └── utils/
   \`\`\`

2. Key Features:

   - Announcement banner management
   - Technical/Non-technical content toggle
   - Responsive navigation
   - Hero section with dynamic content
   - CTA tracking and analytics

3. State Management:

\`\`\`typescript
   interface AppState {
   ├── ui: {
   │   ├── isTechnicalMode: boolean
   │   ├── isAnnouncementVisible: boolean
   │   └── currentBreakpoint: string
   ├── }
   ├── user: {
   │   ├── isAuthenticated: boolean
   │   └── preferences: UserPreferences
   ├── };
}
\`\`\`

4. Routes:

   \`\`\`typescript
const routes = [
   ├── '/',
   ├── '/docs/*',
   ├── '/pricing',
   ├── '/careers',
   ├── '/about',
   └── '/use-cases/*'
   ];
\`\`\`

5. Component Architecture:

   - AnnouncementBanner (dismissible)
   - MainNavigation (responsive)
   - HeroSection (dynamic content)
   - TechnicalToggle (state-managed)
   - CTAButtons (tracking-enabled)

6. Responsive Breakpoints:

   \`\`\`scss
   $breakpoints: (
   ├── 'mobile': 320px,
   ├── 'tablet': 768px,
   ├── 'desktop': 1024px,
   └── 'wide': 1280px
   )
\`\`\`

(Real examples are expected to be more detailed based on the actual image provided.)

<span mention="" referenceid="beaf62a8-ff2f-408d-a067-261c3555b07a"
type = "image";
path = "";
data-type="mention">
</span>

<span generation="" id="55a748a1-dd1d-495a-9276-923db82d39bc" label="new_generation" temperature="0.6" model="gpt-4o" type="short" stopbefore=",,," data-type="generation"></span>
    `);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1 border rounded-lg p-4 overflow-auto h-[calc(100vh-200px)]">
          <Markdown className="prose lg:prose-xl">{markdown}</Markdown>
        </div>
      </div>
    </div>
  );
}
