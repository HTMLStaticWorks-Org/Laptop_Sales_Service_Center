# Lapserv

A six-page responsive static website prototype using the approved Deep Tech Navy palette.

## Pages
1. `index.html` — Home 1 / Classic
2. `home-2.html` — Home 2 / Premium
3. `about.html` — About Us
4. `laptops.html` — Laptops & Products
5. `services.html` — Services & Repair Tracking
6. `contact.html` — Contact Us

## Brand system
- Primary: Deep Tech Navy `#172554`
- Secondary: Titanium Slate `#64748B`
- Light surface: `#F8FAFC`
- Dark surface: `#0B0F17`
- Headings: Space Grotesk
- Body: Inter

## Run locally
Open `index.html` in a modern browser. No build step is required.

## Included interactions
- Light/Dark theme toggle (saved in browser localStorage)
- LTR/RTL direction toggle (saved in browser localStorage)
- Responsive mobile navigation
- Laptop category and text filtering
- Browser-side contact form validation and demonstration message
- Repair Job ID entry demonstration

## Important production limitations
This ZIP is a frontend prototype. It does not include:
- A live product catalogue, inventory or payment system
- A server-side contact/booking submission service
- A repair-job database or real customer tracking
- Authentication, customer records or administrator tools
- Verified company details, actual prices, warranties or certifications

The repair tracking interaction explicitly identifies itself as a demonstration and does not return customer records. The contact form does not transmit or store submitted data. Connect secure backend services before using these workflows with real customers.

Before launch, replace all placeholder business details and illustrative product information with verified information. Confirm repair capabilities, warranties, parts sourcing, pricing, stock, contact details and service policies. Do not publish unsupported service claims.

## Assets
All illustration assets and the logo are included locally in `assets/images`. Google Fonts are requested from Google Fonts when internet access is available; system fallbacks are defined.
