# TripCast Landing Page Design Brief
## Web Landing Page for Multi-City Weather Forecast Travel App

---

## CRITICAL: Design System Reference
This landing page MUST follow the design system established in `design-system.json`. All colors, typography, spacing, and component styles should align with the mobile app design to maintain brand consistency.

---

## Project Overview
**Product:** TripCast - Multi-city weather forecast app for travelers
**Objective:** Convert visitors into app downloads and trial users
**Target Audience:** Travelers planning multi-destination trips, cruise passengers, business travelers
**Primary CTA:** Download app / Start free trial
**Tone:** Adventurous, trustworthy, modern, welcoming

---

## Design Requirements

### Color Palette (from design-system.json)
- **Primary:** #0D9488 (Teal/Turquoise)
- **Secondary:** #1E3A5F (Deep Navy)
- **Background Light:** #F8F9FA
- **Background White:** #FFFFFF
- **Text Primary:** #1A1A1A
- **Text Secondary:** #6B7280
- **Accent Yellow:** #FDB022
- **Success Green:** #10B981

### Typography
- **Font Family:** SF Pro Display, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- **Headings:** Bold, tight letter-spacing (-0.5px to -2px)
- **Body:** 15-16px, line-height 1.6-1.8
- **Maintain:** Mobile app's visual hierarchy

### Spacing
- **System:** 8px base unit (all spacing multiples of 8)
- **Section padding:** 80px vertical (desktop), 48px (mobile)
- **Container max-width:** 1200px
- **Horizontal padding:** 80px (desktop), 20px (mobile)

### Visual Style
- **Border radius:** 16px for cards, 12px for buttons
- **Shadows:** Soft, layered (same as mobile app)
- **Images:** High-quality travel photography with 16px radius
- **Overlays:** Dark gradients for text legibility on images
- **Icons:** Lucide icons, 24px standard size

---

## Landing Page Structure

---

## SECTION 1: Hero / Above the Fold

### Layout
- **Full viewport height** (min-height: 100vh)
- **2 columns** on desktop (60/40 split)
- **Stacked** on mobile (content first, image second)
- **Background:** White or very subtle gradient (#FFFFFF to #F8F9FA)

### Column 1: Content (Left)
**Vertical centering, left-aligned text**

#### Navigation Bar (Sticky)
- **Height:** 72px
- **Background:** White with subtle shadow on scroll
- **Container:** Max-width 1200px, horizontal padding 80px (desktop) / 20px (mobile)
- **Layout:** Flex, space-between

**Logo (Left):**
- **Logo + Text:** "TripCast"
- **Font size:** 24px
- **Font weight:** 700
- **Color:** #1A1A1A
- **Icon:** Weather + location icon (optional, 28px, #0D9488)

**Navigation Links (Center):**
- **Links:** Features, How It Works, Pricing, FAQ
- **Font size:** 15px
- **Font weight:** 500
- **Color:** #6B7280
- **Hover:** #0D9488
- **Gap:** 32px
- **Display:** Desktop only

**CTA Button (Right):**
- **Text:** "Download App"
- **Background:** #0D9488
- **Color:** #FFFFFF
- **Padding:** 12px 24px
- **Border radius:** 12px
- **Font size:** 15px
- **Font weight:** 600
- **Shadow:** 0px 4px 8px rgba(13, 148, 136, 0.25)

**Mobile Menu Icon:**
- **Display:** Mobile only
- **Icon:** Menu (Lucide)
- **Size:** 24px
- **Color:** #1A1A1A

#### Hero Content
**Padding top:** 120px (to clear fixed nav)

**Eyebrow Text (Optional):**
- **Text:** "🌤️ Weather Planning Made Simple"
- **Font size:** 14px
- **Font weight:** 600
- **Color:** #0D9488
- **Text transform:** Uppercase
- **Letter spacing:** 0.5px
- **Margin bottom:** 16px

**Headline (h1):**
- **Text:** "Track Weather Across Your Entire Journey"
- **Font size:** 56px (desktop) / 36px (mobile)
- **Font weight:** 700
- **Line height:** 1.1
- **Letter spacing:** -1.5px (desktop) / -0.8px (mobile)
- **Color:** #1A1A1A
- **Max width:** 600px
- **Margin bottom:** 24px

**Alternative Headlines:**
- "Never Get Caught in the Rain Again"
- "Weather Forecasts for Every Stop on Your Journey"
- "Multi-City Weather Planning for Smart Travelers"

**Subheadline:**
- **Text:** "The first travel app that tracks weather across multiple destinations on your itinerary—including cruise ports. Plan smarter, pack lighter, travel better."
- **Font size:** 18px (desktop) / 16px (mobile)
- **Font weight:** 400
- **Line height:** 1.6
- **Color:** #6B7280
- **Max width:** 540px
- **Margin bottom:** 40px

**CTA Button Group:**
- **Layout:** Flex row, gap 16px
- **Wrap:** Mobile

**Primary Button:**
- **Text:** "Start Free Trial →" or "Download for iOS"
- **Background:** #0D9488
- **Color:** #FFFFFF
- **Padding:** 16px 32px
- **Border radius:** 12px
- **Font size:** 16px
- **Font weight:** 600
- **Shadow:** 0px 4px 8px rgba(13, 148, 136, 0.25)
- **Hover:** Darken 10%, lift 2px

**Secondary Button:**
- **Text:** "See How It Works" or "Download for Android"
- **Background:** #F5F5F5
- **Color:** #1A1A1A
- **Padding:** 16px 32px
- **Border radius:** 12px
- **Font size:** 16px
- **Font weight:** 600
- **Hover:** Darken background

**Social Proof (Below buttons):**
- **Margin top:** 32px
- **Layout:** Flex row, gap 24px, center aligned

**Avatar Stack:**
- **Avatars:** 4-5 overlapping circles
- **Size:** 40px each
- **Border:** 2px solid white
- **Overlap:** -12px

**Text:**
- **Line 1:** "Join 50,000+ travelers"
- **Font size:** 14px
- **Font weight:** 600
- **Color:** #1A1A1A

- **Line 2:** "⭐⭐⭐⭐⭐ 4.9/5 rating"
- **Font size:** 13px
- **Color:** #6B7280

### Column 2: Visual (Right)
**Vertical centering**

#### Hero Image/Mockup
**Option 1: Phone Mockup**
- **Display:** 3D iPhone mockup showing the app
- **Size:** 600px height (desktop)
- **Position:** Slightly angled (15-20 degrees)
- **Shadow:** Large, soft shadow for depth
- **Screens:** Show home screen or weather detail screen
- **Animation:** Subtle floating animation (up/down 10px, 3s loop)

**Option 2: Multiple Screens**
- **Layout:** 3 phone screens staggered
- **Center screen:** Larger and forward
- **Side screens:** Slightly smaller and back
- **Content:** Different screens (home, forecast, itinerary)

**Option 3: App Screenshot + Background**
- **Background:** Beautiful travel destination image (blurred, 16px radius)
- **Overlay:** Phone mockup with app screenshot
- **Style:** Clean, modern, floating

**Decorative Elements:**
- **Weather icons:** Floating around mockup (sun, cloud, rain)
- **Size:** 40-60px
- **Animation:** Gentle float/rotate
- **Opacity:** 60-80%
- **Colors:** Match brand colors

---

## SECTION 2: Problem Statement / Pain Points

### Layout
- **Background:** #F8F9FA
- **Padding:** 80px vertical (desktop) / 48px (mobile)
- **Container:** Max-width 1200px, centered

### Content
**Text align:** Center

#### Section Label
- **Text:** "The Problem"
- **Font size:** 14px
- **Font weight:** 600
- **Color:** #0D9488
- **Text transform:** Uppercase
- **Letter spacing:** 0.5px
- **Margin bottom:** 16px

#### Headline (h2)
- **Text:** "Planning Multi-City Travel Weather Is Frustrating"
- **Font size:** 40px (desktop) / 28px (mobile)
- **Font weight:** 700
- **Line height:** 1.2
- **Letter spacing:** -0.8px
- **Color:** #1A1A1A
- **Max width:** 700px
- **Margin:** 0 auto 48px

#### Pain Point Cards
- **Layout:** 3 columns (desktop) / 1 column (mobile)
- **Gap:** 24px
- **Max width:** 1000px
- **Margin:** 0 auto

**Each Card:**
- **Background:** #FFFFFF
- **Border radius:** 16px
- **Padding:** 32px 24px
- **Shadow:** 0px 4px 6px rgba(0, 0, 0, 0.07)
- **Hover:** Lift 4px, increase shadow

**Icon (Top):**
- **Type:** Emoji or Lucide icon
- **Size:** 48px
- **Color:** #EF4444 (red/warning color)
- **Background:** rgba(239, 68, 68, 0.1)
- **Padding:** 16px
- **Border radius:** 12px
- **Margin bottom:** 20px

**Title (h3):**
- **Font size:** 18px
- **Font weight:** 600
- **Color:** #1A1A1A
- **Margin bottom:** 12px

**Description:**
- **Font size:** 15px
- **Font weight:** 400
- **Line height:** 1.6
- **Color:** #6B7280

**Pain Point Examples:**
1. **Icon:** 📱
   - **Title:** "Multiple Apps Required"
   - **Description:** "Checking weather for 5 cities means opening 5 different apps or browser tabs"

2. **Icon:** 🚢
   - **Title:** "Cruise Ports Ignored"
   - **Description:** "Travel apps don't recognize port addresses, leaving cruise travelers in the dark"

3. **Icon:** 📅
   - **Title:** "Date Confusion"
   - **Description:** "Juggling forecasts across different dates for each destination is error-prone"

---

## SECTION 3: Solution / Features

### Layout
- **Background:** #FFFFFF
- **Padding:** 80px vertical (desktop) / 48px (mobile)
- **Container:** Max-width 1200px, centered

### Content

#### Section Label + Headline
- **Same style as Section 2**
- **Label:** "The Solution"
- **Headline:** "One App. All Your Destinations. Perfect Forecasts."
- **Subheadline:** "TripCast tracks weather across your entire itinerary automatically"
- **Text align:** Center
- **Margin bottom:** 64px

#### Feature Showcase (Alternating Layout)

**Pattern:** Image/Mockup alternates left-right

##### Feature 1
- **Layout:** 2 columns (50/50)
- **Image:** Left
- **Content:** Right
- **Vertical align:** Center

**Image/Mockup:**
- **Type:** Phone mockup or screenshot
- **Size:** 500px width (desktop)
- **Border radius:** 16px
- **Shadow:** Large soft shadow
- **Content:** Show multi-city itinerary screen

**Content:**
- **Icon Badge:**
  - **Background:** rgba(13, 148, 136, 0.1)
  - **Icon:** Map pin (24px, #0D9488)
  - **Size:** 56px
  - **Border radius:** 12px
  - **Margin bottom:** 20px

- **Title (h3):**
  - **Text:** "Multi-City Itinerary Tracking"
  - **Font size:** 32px (desktop) / 24px (mobile)
  - **Font weight:** 700
  - **Color:** #1A1A1A
  - **Margin bottom:** 16px

- **Description:**
  - **Text:** "Add all your destinations with dates. TripCast automatically tracks weather forecasts for each city, updating as forecasts become available."
  - **Font size:** 16px
  - **Line height:** 1.6
  - **Color:** #6B7280
  - **Margin bottom:** 24px

- **Feature List:**
  - **Layout:** Vertical list
  - **Gap:** 12px

  **Each Item:**
  - **Icon:** Check circle (16px, #10B981)
  - **Text:** Feature bullet
  - **Font size:** 15px
  - **Color:** #1A1A1A
  - **Gap:** 8px

  **Examples:**
  - "Add unlimited destinations"
  - "Automatic forecast updates"
  - "Historical to specific forecast transition"
  - "Cruise port recognition"

##### Feature 2
- **Layout:** 2 columns (50/50)
- **Image:** Right (swap from Feature 1)
- **Content:** Left
- **Same styling as Feature 1**

**Content:**
- **Title:** "10-Day Detailed Forecasts"
- **Description:** "Get comprehensive weather data for each destination: temperature, precipitation, wind, humidity, UV index, and more."
- **Bullets:**
  - "Hour-by-hour forecasts"
  - "Weather alerts and warnings"
  - "Packing recommendations"
  - "Best time to visit suggestions"

##### Feature 3
- **Layout:** 2 columns (50/50)
- **Image:** Left
- **Content:** Right

**Content:**
- **Title:** "Smart Weather Insights"
- **Description:** "AI-powered recommendations help you plan activities and pack appropriately for each destination's weather."
- **Bullets:**
  - "Activity suggestions by weather"
  - "Smart packing lists"
  - "Weather comparison across dates"
  - "Climate trends and patterns"

##### Feature 4
- **Layout:** 2 columns (50/50)
- **Image:** Right
- **Content:** Left

**Content:**
- **Title:** "Share with Travel Companions"
- **Description:** "Traveling with family or friends? Share your itinerary so everyone stays informed about weather conditions."
- **Bullets:**
  - "Collaborative trip planning"
  - "Real-time updates for all members"
  - "Shared packing lists"
  - "Group weather alerts"

---

## SECTION 4: How It Works

### Layout
- **Background:** #F8F9FA
- **Padding:** 80px vertical (desktop) / 48px (mobile)
- **Container:** Max-width 1200px, centered

### Content

#### Section Label + Headline
- **Label:** "How It Works"
- **Headline:** "Weather Planning in 3 Simple Steps"
- **Text align:** Center
- **Margin bottom:** 64px

#### Steps (3 columns / stacked mobile)
- **Layout:** 3 columns equal width
- **Gap:** 32px
- **Max width:** 1000px
- **Margin:** 0 auto

**Each Step Card:**
- **Background:** #FFFFFF
- **Border radius:** 16px
- **Padding:** 40px 32px
- **Text align:** Center
- **Shadow:** 0px 4px 6px rgba(0, 0, 0, 0.07)
- **Hover:** Lift 4px

**Step Number:**
- **Size:** 64px circle
- **Background:** #0D9488
- **Color:** #FFFFFF
- **Font size:** 28px
- **Font weight:** 700
- **Border radius:** Full
- **Margin:** 0 auto 24px
- **Display:** Flex, center aligned

**Icon/Illustration (Alternative to number):**
- **Size:** 80px
- **Style:** Simple, colorful illustration
- **Margin bottom:** 24px

**Title (h3):**
- **Font size:** 20px
- **Font weight:** 600
- **Color:** #1A1A1A
- **Margin bottom:** 12px

**Description:**
- **Font size:** 15px
- **Line height:** 1.6
- **Color:** #6B7280

**Step Examples:**
1. **Title:** "Add Your Destinations"
   - **Description:** "Enter your cities and travel dates. Include cruise ports by name or coordinates."

2. **Title:** "Get Instant Forecasts"
   - **Description:** "TripCast pulls accurate weather data for each location and date automatically."

3. **Title:** "Plan & Pack Smart"
   - **Description:** "Review forecasts, get packing suggestions, and share with your travel group."

**Connector Elements (Desktop only):**
- **Between cards:** Arrow or dashed line
- **Color:** #E5E7EB
- **Style:** Subtle, decorative

---

## SECTION 5: Screenshots Showcase / Gallery

### Layout
- **Background:** #FFFFFF
- **Padding:** 80px vertical (desktop) / 48px (mobile)
- **Container:** Max-width 1400px, centered

### Content

#### Section Label + Headline
- **Label:** "Beautiful & Intuitive"
- **Headline:** "Designed for Travelers, Built for Simplicity"
- **Text align:** Center
- **Margin bottom:** 48px

#### Screenshot Gallery
**Option 1: Carousel**
- **Layout:** Horizontal slider
- **Gap:** 24px
- **Navigation:** Dots below, arrows on sides

**Option 2: Grid**
- **Layout:** 3 columns (desktop) / 1 column (mobile)
- **Gap:** 24px

**Each Screenshot:**
- **Type:** Phone mockup with app screenshot
- **Border radius:** 16px (outer frame: 24px)
- **Shadow:** 0px 10px 15px rgba(0, 0, 0, 0.1)
- **Aspect ratio:** Match phone screen
- **Hover:** Slight lift + zoom

**Screenshots to Include:**
1. Home/Dashboard with current trip
2. Multi-city weather overview
3. 10-day forecast detail
4. Itinerary management
5. Destination search
6. Weather alerts/recommendations

**Caption (Optional):**
- **Text:** Brief description
- **Font size:** 14px
- **Color:** #6B7280
- **Text align:** Center
- **Margin top:** 16px

---

## SECTION 6: Social Proof / Testimonials

### Layout
- **Background:** #F8F9FA
- **Padding:** 80px vertical (desktop) / 48px (mobile)
- **Container:** Max-width 1200px, centered

### Content

#### Section Label + Headline
- **Label:** "Loved by Travelers"
- **Headline:** "Join Thousands Who Plan Smarter"
- **Text align:** Center
- **Margin bottom:** 48px

#### Testimonial Cards
- **Layout:** 3 columns (desktop) / 1 column (mobile)
- **Gap:** 24px

**Each Card:**
- **Background:** #FFFFFF
- **Border radius:** 16px
- **Padding:** 32px 24px
- **Shadow:** 0px 4px 6px rgba(0, 0, 0, 0.07)

**Stars:**
- **Display:** ⭐⭐⭐⭐⭐
- **Size:** 16px
- **Color:** #FDB022
- **Margin bottom:** 16px

**Quote:**
- **Font size:** 16px
- **Font weight:** 400
- **Line height:** 1.6
- **Color:** #1A1A1A
- **Font style:** Italic
- **Margin bottom:** 20px
- **Text:** Testimonial content

**Author Section:**
- **Layout:** Flex row, gap 12px, center aligned

**Avatar:**
- **Size:** 48px
- **Border radius:** Full
- **Image:** User photo

**Author Info:**
- **Name:**
  - Font size: 15px
  - Font weight: 600
  - Color: #1A1A1A

- **Title/Location:**
  - Font size: 13px
  - Color: #6B7280

**Example Testimonials:**
1. "Finally! An app that tracks weather for my entire cruise itinerary. No more guessing what to pack for each port." - Sarah M., Cruise Enthusiast

2. "As a business traveler visiting 3+ cities per week, TripCast saves me hours of weather research. Game changer!" - James L., Consultant

3. "We used TripCast for our European backpacking trip. Having all forecasts in one place made planning so much easier." - Emma & Tom R., Backpackers

---

## SECTION 7: Pricing / Plans (Optional)

### Layout
- **Background:** #FFFFFF
- **Padding:** 80px vertical (desktop) / 48px (mobile)
- **Container:** Max-width 1200px, centered

### Content

#### Section Label + Headline
- **Label:** "Simple Pricing"
- **Headline:** "Start Free, Upgrade Anytime"
- **Text align:** Center
- **Margin bottom:** 48px

#### Pricing Toggle (If applicable)
- **Layout:** Center aligned
- **Toggle:** Monthly / Annual
- **Style:**
  - Background: #F5F5F5
  - Active: #0D9488 background, white text
  - Border radius: 12px
  - Padding: 4px
  - Font size: 14px
  - Font weight: 600
- **Margin bottom:** 40px

#### Pricing Cards
- **Layout:** 2-3 columns (desktop) / 1 column (mobile)
- **Gap:** 24px
- **Max width:** 900px
- **Margin:** 0 auto

**Each Card:**
- **Background:** #FFFFFF
- **Border:** 2px solid #E5E7EB
- **Border radius:** 16px
- **Padding:** 40px 32px
- **Text align:** Center or left

**Popular Badge (if applicable):**
- **Position:** Absolute top
- **Background:** #0D9488
- **Color:** #FFFFFF
- **Padding:** 6px 16px
- **Border radius:** 20px
- **Font size:** 12px
- **Font weight:** 600
- **Text:** "Most Popular"

**Plan Name:**
- **Font size:** 20px
- **Font weight:** 600
- **Color:** #1A1A1A
- **Margin bottom:** 8px

**Price:**
- **Font size:** 48px
- **Font weight:** 700
- **Color:** #1A1A1A
- **Letter spacing:** -1px
- **Margin bottom:** 4px

**Billing Period:**
- **Font size:** 14px
- **Color:** #6B7280
- **Margin bottom:** 24px

**Description:**
- **Font size:** 15px
- **Color:** #6B7280
- **Margin bottom:** 24px

**CTA Button:**
- **Width:** Full
- **Padding:** 14px 24px
- **Border radius:** 12px
- **Font size:** 16px
- **Font weight:** 600
- **Margin bottom:** 24px
- **Primary plan:** #0D9488 background, white text
- **Other plans:** #F5F5F5 background, dark text

**Features List:**
- **Layout:** Vertical list
- **Text align:** Left
- **Gap:** 12px

**Each Feature:**
- **Icon:** Check (16px, #10B981)
- **Text:** Feature name
- **Font size:** 14px
- **Color:** #1A1A1A
- **Gap:** 8px

**Example Plans:**

**Free Plan:**
- Price: $0
- Features:
  - Up to 3 destinations
  - 7-day forecasts
  - Basic weather data
  - Ad-supported

**Pro Plan (Popular):**
- Price: $4.99/month or $39/year
- Features:
  - Unlimited destinations
  - 10-day forecasts
  - Advanced weather insights
  - Cruise port support
  - Weather alerts
  - No ads
  - Priority support

**Family Plan:**
- Price: $7.99/month or $59/year
- Features:
  - Everything in Pro
  - Up to 5 family members
  - Shared itineraries
  - Collaborative planning

---

## SECTION 8: FAQ

### Layout
- **Background:** #F8F9FA
- **Padding:** 80px vertical (desktop) / 48px (mobile)
- **Container:** Max-width 800px, centered

### Content

#### Section Label + Headline
- **Label:** "FAQ"
- **Headline:** "Frequently Asked Questions"
- **Text align:** Center
- **Margin bottom:** 48px

#### FAQ Accordion
- **Layout:** Single column, full width

**Each FAQ Item:**
- **Background:** #FFFFFF
- **Border radius:** 12px
- **Margin bottom:** 16px
- **Shadow:** 0px 2px 4px rgba(0, 0, 0, 0.05)
- **Hover:** Lift slightly

**Question (Accordion Header):**
- **Padding:** 20px 24px
- **Cursor:** Pointer
- **Layout:** Flex, space-between, center aligned

**Question Text:**
- **Font size:** 16px
- **Font weight:** 600
- **Color:** #1A1A1A

**Icon:**
- **Type:** Chevron down (rotates when open)
- **Size:** 20px
- **Color:** #6B7280
- **Transition:** Smooth rotate

**Answer (Accordion Body):**
- **Padding:** 0 24px 20px
- **Display:** Hidden when collapsed
- **Animation:** Smooth expand/collapse

**Answer Text:**
- **Font size:** 15px
- **Line height:** 1.6
- **Color:** #6B7280

**Example FAQs:**
1. "Does TripCast work for cruise itineraries?"
2. "How accurate are the weather forecasts?"
3. "Can I use TripCast offline?"
4. "How do I share my itinerary with travel companions?"
5. "What weather sources does TripCast use?"
6. "Is there a desktop version?"
7. "How far in advance can I see forecasts?"
8. "Can I import itineraries from other apps?"

---

## SECTION 9: Final CTA / Download

### Layout
- **Background:** Gradient (linear-gradient(135deg, #0D9488 0%, #10B981 100%))
- **Padding:** 80px vertical (desktop) / 48px (mobile)
- **Container:** Max-width 900px, centered
- **Text align:** Center
- **Color:** All white text

### Content

#### Icon/Illustration (Optional)
- **Type:** Weather-related icon or app icon
- **Size:** 80px
- **Color:** White
- **Margin bottom:** 24px

#### Headline (h2)
- **Text:** "Start Planning Your Perfect Trip Today"
- **Font size:** 40px (desktop) / 28px (mobile)
- **Font weight:** 700
- **Color:** #FFFFFF
- **Line height:** 1.2
- **Margin bottom:** 16px

#### Subheadline
- **Text:** "Join thousands of travelers who never worry about weather again"
- **Font size:** 18px
- **Color:** rgba(255, 255, 255, 0.9)
- **Margin bottom:** 32px

#### App Store Badges
- **Layout:** Flex row, center aligned, gap 16px
- **Wrap:** Mobile

**Each Badge:**
- **Type:** Standard Apple App Store / Google Play badge
- **Height:** 48px
- **Width:** Auto
- **Hover:** Lift slightly

**Alternative: Custom Buttons**
- **Background:** #FFFFFF
- **Color:** #0D9488
- **Padding:** 16px 32px
- **Border radius:** 12px
- **Font size:** 16px
- **Font weight:** 600
- **Icon:** Apple/Android logo (20px)
- **Gap:** 8px
- **Shadow:** 0px 4px 8px rgba(0, 0, 0, 0.15)

#### Trust Indicators (Below buttons)
- **Margin top:** 24px
- **Font size:** 14px
- **Color:** rgba(255, 255, 255, 0.8)

**Text:**
- "✓ Free 14-day trial"
- "✓ No credit card required"
- "✓ Cancel anytime"

**Layout:** Flex row, gap 24px, center (or vertical stack on mobile)

---

## SECTION 10: Footer

### Layout
- **Background:** #1E3A5F (deep navy)
- **Padding:** 64px vertical, 80px horizontal (desktop) / 40px (mobile)
- **Container:** Max-width 1200px, centered
- **Color:** All white text

### Content Structure

#### Top Section
- **Layout:** 4 columns (desktop) / 1 column (mobile)
- **Gap:** 48px (desktop) / 32px (mobile)

**Column 1: Brand**
- **Logo:** TripCast logo (white version)
- **Size:** 32px height
- **Margin bottom:** 16px

**Tagline:**
- **Text:** "Weather planning for smarter travel"
- **Font size:** 14px
- **Color:** rgba(255, 255, 255, 0.7)
- **Margin bottom:** 20px

**Social Icons:**
- **Layout:** Flex row, gap 12px

**Each Icon:**
- **Size:** 40px circle
- **Background:** rgba(255, 255, 255, 0.1)
- **Icon size:** 20px
- **Color:** #FFFFFF
- **Hover:** Background rgba(255, 255, 255, 0.2)
- **Icons:** Twitter, Instagram, Facebook, LinkedIn

**Column 2: Product**
- **Title:** "Product"
- **Font size:** 16px
- **Font weight:** 600
- **Color:** #FFFFFF
- **Margin bottom:** 16px

**Links:**
- **Font size:** 14px
- **Color:** rgba(255, 255, 255, 0.7)
- **Line height:** 2
- **Hover:** Color #FFFFFF

**Links List:**
- Features
- Pricing
- How It Works
- Screenshots
- Download

**Column 3: Company**
- **Title:** "Company"
- **Same styling as Column 2**

**Links:**
- About Us
- Blog
- Careers
- Press Kit
- Contact

**Column 4: Support**
- **Title:** "Support"
- **Same styling as Column 2**

**Links:**
- Help Center
- FAQ
- Privacy Policy
- Terms of Service
- Cookie Policy

#### Bottom Section
- **Border top:** 1px solid rgba(255, 255, 255, 0.1)
- **Padding top:** 32px
- **Margin top:** 48px
- **Layout:** Flex row, space-between (stack mobile)

**Copyright:**
- **Text:** "© 2024 TripCast. All rights reserved."
- **Font size:** 14px
- **Color:** rgba(255, 255, 255, 0.5)

**Language Selector (Optional):**
- **Text:** "🌐 English"
- **Font size:** 14px
- **Color:** rgba(255, 255, 255, 0.7)
- **Dropdown:** On click

---

## Responsive Behavior

### Breakpoints
- **Mobile:** 0-767px
- **Tablet:** 768px-1023px
- **Desktop:** 1024px+

### Mobile Adaptations
- **Stack all columns** vertically
- **Reduce font sizes** by 20-30%
- **Reduce padding** (40-48px section padding)
- **Horizontal padding:** 20px
- **Touch-friendly targets:** Min 44px
- **Hamburger menu** for navigation
- **Simplified animations**

### Tablet Adaptations
- **2-column grids** where appropriate
- **Medium font sizes**
- **60px section padding**

---

## Animation & Interactions

### Page Load
- **Hero content:** Fade in + slide up (400ms delay)
- **Hero image:** Fade in + slide left (600ms delay)
- **Stagger:** Each section fades in on scroll (intersection observer)

### Hover States
- **Buttons:** Darken 10%, lift 2px, increase shadow
- **Cards:** Lift 4px, increase shadow
- **Images:** Slight zoom (1.02x scale)
- **Links:** Color change + underline

### Scroll Animations
- **Trigger:** When element 20% in viewport
- **Effect:** Fade in + slide up (300ms)
- **Easing:** cubic-bezier(0.4, 0.0, 0.2, 1)
- **Stagger:** 100ms between elements

### Interactive Elements
- **Accordion:** Smooth expand/collapse (250ms)
- **Image carousel:** Smooth slide (350ms)
- **Modal:** Fade in background + scale in content

---

## Performance Optimization

### Images
- **Format:** WebP with JPG fallback
- **Lazy loading:** All images below fold
- **Responsive images:** srcset for different sizes
- **Compression:** Optimize for web

### Code
- **Minify:** CSS and JavaScript
- **Defer:** Non-critical JavaScript
- **Critical CSS:** Inline above-fold styles
- **Font loading:** font-display: swap

### Metrics Targets
- **Lighthouse Score:** 90+ (all categories)
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.5s
- **Cumulative Layout Shift:** < 0.1

---

## SEO Requirements

### Meta Tags
- **Title:** "TripCast - Multi-City Weather Forecasts for Travelers"
- **Description:** "Track weather across your entire travel itinerary. Get accurate forecasts for multiple destinations, including cruise ports. Plan smarter, pack lighter."
- **Keywords:** weather app, travel weather, multi-city forecast, cruise weather, itinerary planning

### Structured Data
- **Schema.org:** SoftwareApplication, AggregateRating, FAQ
- **Open Graph:** For social sharing
- **Twitter Cards:** Summary with large image

### Technical SEO
- **Semantic HTML:** Proper heading hierarchy
- **Alt text:** All images descriptive
- **Mobile-friendly:** Responsive design
- **Fast loading:** Core Web Vitals optimized
- **HTTPS:** Secure connection

---

## Accessibility (WCAG 2.1 AA)

### Requirements
- **Color contrast:** 4.5:1 for normal text, 3:1 for large text
- **Keyboard navigation:** All interactive elements
- **Focus indicators:** Visible on all focusable elements
- **ARIA labels:** Proper labeling for screen readers
- **Alt text:** Descriptive for all images
- **Semantic HTML:** Proper landmark regions
- **Heading hierarchy:** Logical structure
- **Form labels:** Associated with inputs

---

## Conversion Optimization

### Primary Goals
1. App downloads (iOS/Android)
2. Free trial signups
3. Email list growth

### CTA Placement
- **Hero section:** Primary download CTA
- **After features:** Secondary CTA
- **After testimonials:** Social proof CTA
- **Final section:** Strong closing CTA
- **Sticky header:** Always-visible download button

### Trust Elements
- **Social proof:** User count, ratings, testimonials
- **Awards/Recognition:** If applicable
- **Press mentions:** Logo strip of featured publications
- **Security badges:** Privacy-focused messaging
- **Guarantee:** Free trial, no credit card required

### Tracking
- **Analytics:** Google Analytics 4
- **Events:** Button clicks, scroll depth, video plays
- **Heatmaps:** User behavior analysis
- **A/B Testing:** Headline variations, CTA copy

---

## Technical Implementation Notes

### Framework Recommendations
- **React:** For component-based architecture
- **Next.js:** For SSR and better SEO
- **Tailwind CSS:** For rapid styling (matches design system)
- **Framer Motion:** For animations
- **React Icons:** For Lucide icons

### Third-Party Integrations
- **Analytics:** Google Analytics, Mixpanel
- **Email:** Mailchimp or ConvertKit (newsletter)
- **CRM:** For form submissions
- **Live Chat:** Optional support widget

### Hosting
- **Recommendation:** Vercel, Netlify, or AWS Amplify
- **CDN:** Cloudflare for global performance
- **SSL:** Automatic HTTPS

---

## Content Guidelines

### Voice & Tone
- **Friendly** but professional
- **Confident** without being arrogant
- **Helpful** and educational
- **Clear** and concise
- **Adventurous** but trustworthy

### Writing Style
- **Active voice** preferred
- **Short sentences** (15-20 words average)
- **Bullet points** for scanability
- **Action-oriented** CTAs
- **Benefits over features**

### Headline Formulas
- **Problem/Solution:** "Tired of [Problem]? Here's [Solution]"
- **How To:** "How to [Achieve Goal] with [Product]"
- **Direct Benefit:** "[Benefit] for [Target Audience]"
- **Question:** "Ever [Pain Point]?"

---

## Final Deliverables Checklist

- [ ] Fully responsive HTML/CSS/JS
- [ ] All sections implemented
- [ ] Animations functional
- [ ] Forms connected to backend
- [ ] Analytics tracking installed
- [ ] SEO meta tags complete
- [ ] Images optimized
- [ ] Accessibility audit passed
- [ ] Cross-browser tested (Chrome, Safari, Firefox, Edge)
- [ ] Mobile tested (iOS Safari, Android Chrome)
- [ ] Performance optimized (Lighthouse 90+)
- [ ] Legal pages created (Privacy, Terms)

---

## Brand Assets Needed

- **Logo:** SVG, white version for dark backgrounds
- **App Icon:** High resolution (1024x1024)
- **App Screenshots:** All 6-7 key screens
- **Phone Mockups:** 3D renders or flat mockups
- **Travel Photos:** 8-10 high-quality images
- **Weather Icons:** Custom illustrated set
- **Social Media Assets:** OG images, profile pictures

---

This landing page design follows the established TripCast design system while optimizing for conversion and user engagement. The layout is modern, professional, and trust-building, with clear CTAs and social proof throughout.