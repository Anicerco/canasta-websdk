# Canasta · Singular Web SDK (Native JavaScript) demo

Demo e-commerce site for a fictional LatAm grocery and gifts retailer. It shows a native (no GTM) Singular Web SDK integration that follows the [Native JavaScript Implementation Guide](https://support.singular.net/hc/en-us/articles/41863502734619) and the [recommended e-commerce standard events](https://support.singular.net/hc/en-us/articles/7648172966299). It is not a real store.

Built with React, Vite, MUI and React Router, in Spanish, English and Portuguese. Prices are in MXN.

## Guide steps → code

| Guide step | Where |
|---|---|
| 1. SDK script in `<head>` | `index.html` |
| 2. Init once on page load (sends the only `__PAGE_VISIT__`). This demo does not call `pageVisit()` on SPA route changes, so each page shows only business events | `src/main.jsx`, `src/lib/singular.js` |
| 3. `event` / `conversionEvent` / `revenue` | `src/lib/store.jsx`, pages |
| 4. `login(userId)` / `logout()`, `withCustomUserId` for returning users | `src/lib/store.jsx`, `src/main.jsx` |
| 5. `withEventsDedupEnabled()` + revenue guard by transaction id | `src/lib/singular.js` |
| 7. Web-to-app: the CTA is a real `<a>` whose `href` is replaced on click with `buildWebToAppLink()` (inspect it in DevTools); desktop QR uses the same link. `openApp()` is left commented as an alternative | `src/components/AppDownload.jsx` |
| Banners: `withBannersSupport(new BannersOptions().withWebToAppSupport())`, `showBanner()` once on load, Client Hints headers | `src/lib/singular.js`, `vite.config.js`, `vercel.json` |

Product ID: `com.singularecommerce`.

## Events

| Action | Singular call | Name | Attributes |
|---|---|---|---|
| Page load | `init` | `__PAGE_VISIT__` | — |
| Category page | `event` | `sng_content_view_list` | `sng_attr_content_list`, `sng_attr_content_type` |
| Product page | `event` | `sng_content_view` | `sng_attr_content_type`, `sng_attr_content_id`, `sng_attr_content`, `sng_attr_item_price` |
| Search | `event` | `sng_search` | `sng_attr_content_type`, `sng_attr_search_string` |
| Add to cart | `event` | `sng_add_to_cart` | `sng_attr_content`, `sng_attr_content_type`, `sng_attr_content_id`, `sng_attr_quantity`, `sng_attr_item_price` |
| Favorite | `event` | `sng_add_to_wishlist` | `sng_attr_content`, `sng_attr_content_type`, `sng_attr_content_id` |
| Remove from cart | `event` | `sng_remove_from_cart` (custom) | `sng_attr_content`, `sng_attr_content_type`, `sng_attr_content_id` |
| Cart page | `event` | `sng_view_cart` | `sng_attr_content_list` |
| Coupon (valid or not) | `event` | `sng_coupon_applied` (custom) | `sng_attr_coupon_code`, `sng_attr_valid` |
| Checkout start | `event` | `sng_checkout_initiated` | `sng_attr_content_list`, `sng_attr_payment_info_available`, `sng_attr_quantity`, `sng_attr_item_price` |
| Payment method chosen | `event` | `sng_add_payment_info` | `sng_attr_success` |
| Payment declined (simulated) | `event` | `sng_payment_failure` (custom) | `sng_attr_success`, `sng_attr_item_price` |
| Purchase | `revenue` (MXN) | `sng_ecommerce_purchase` | `sng_attr_content_type`, `sng_attr_content_id`, `sng_attr_content`, `sng_attr_transaction_id`, `sng_attr_quantity`, `sng_attr_coupon_code` |
| First order of the user | `event` | `sng_first_purchase` (custom) | `sng_attr_transaction_id` |
| Sign up | `login` + `conversionEvent` | `sng_complete_registration` | `sng_attr_registration_method` |
| Log in | `login` + `event` | `sng_login` | `sng_attr_success` |
| Log out | `logout` | — | — |

Custom events use the names Singular suggests for this vertical (Coupon Applied, Remove from cart, First Purchase, Payment Failure), in snake_case with the `sng_` prefix to keep one naming convention. Note that `sng_` is also the prefix of Singular standard events.

Only standard `sng_attr_*` attributes are sent. Attribute values sent to Singular are always in English (`sng_attr_content_type` uses category keys such as `fruits_vegetables`, `sng_attr_content` uses the English product name), whatever language the site is shown in. The site language travels as the global property `language`.

The web-to-app passthrough (`_p`) is URL-encoded JSON, as the Singular Links guide shows, for example `{"source":"canasta_web","lang":"en","uid":"cu_…"}`.

Coupons: `BIENVENIDA10` (10%), `FLORES20` (20% on flowers and gifts), `ENVIOGRATIS` (free shipping).

## Notes

- `hideBanner()` in Web SDK v1.4.10 throws when no banner is on screen (for example on desktop, where banners are not shown). The Banners guide asks SPAs to hide and show the banner on each route; this demo only shows it once on load.
- The banner is a fixed element at the top of the page; while it is visible the site adds top padding with its height.
- The "Singular" button opens a debug panel with every SDK call, the Singular Device ID and the Custom User ID.

## Run locally

```bash
npm install
npm run dev
```

Add UTM or Singular `wp*` parameters to the URL (for example `?utm_source=google&utm_campaign=demo`) to see them forwarded in the web-to-app link. Banners only show on mobile browsers.
