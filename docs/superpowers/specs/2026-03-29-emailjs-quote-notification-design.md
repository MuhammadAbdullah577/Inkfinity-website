# Email Notification on Quote Submission via EmailJS

## Context

Inkfinity Creation's website has a "Get Quote" form at `/contact` (ContactPage.jsx) where customers submit inquiries. These are saved to the Supabase `contact_inquiries` table and viewable in the admin panel. Currently, the admin has no way to know a new quote arrived without manually checking the dashboard. This design adds a free automated email notification sent to the admin whenever a customer submits a quote.

## Approach

Use **EmailJS** (@emailjs/browser) to send a notification email from the client side immediately after a successful Supabase insert. EmailJS is free for 200 emails/month, requires no backend, and integrates with any email provider (Gmail, Outlook, etc.).

## Files to Modify

| File | Change |
|------|--------|
| `src/hooks/useInquiries.js` | Add EmailJS send call after successful Supabase insert in `createInquiry()` |
| `.env` | Add 3 new environment variables for EmailJS credentials |
| `package.json` | Add `@emailjs/browser` dependency |

## Implementation Details

### 1. Install dependency

```bash
npm install @emailjs/browser
```

### 2. Environment variables (`.env`)

```
VITE_EMAILJS_SERVICE_ID=service_xxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxx
```

### 3. Code change in `src/hooks/useInquiries.js`

In the `createInquiry` function, after the successful Supabase insert, add an EmailJS send call:

```javascript
import emailjs from '@emailjs/browser'

// Inside createInquiry, after successful supabase insert:
try {
  await emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    {
      name: inquiryData.name,
      email: inquiryData.email,
      phone: inquiryData.phone || 'Not provided',
      company: inquiryData.company || 'Not provided',
      product_interest: inquiryData.product_interest || 'Not specified',
      message: inquiryData.message,
      time: new Date().toLocaleString(),
    },
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  )
} catch (emailError) {
  console.error('EmailJS notification failed:', emailError)
  // Don't throw — quote is already saved, email failure is non-critical
}
```

### Error Handling

- EmailJS send is **fire-and-forget** — if it fails, the quote is still saved to Supabase
- Failure is logged to console but does not affect customer experience
- Customer always sees the success message regardless of email delivery

### EmailJS Setup (One-time, done by user)

1. Sign up at emailjs.com (free account)
2. Add an email service (Gmail, Outlook, etc.) — this is the email account that sends notifications
3. Create an email template with these variables: `{{name}}`, `{{email}}`, `{{phone}}`, `{{company}}`, `{{product_interest}}`, `{{message}}`, `{{time}}`
4. Copy Service ID, Template ID, and Public Key into `.env`

### Suggested email template

```
Subject: New Quote Request from {{name}}

You received a new quote request on Inkfinity Creation:

Name: {{name}}
Email: {{email}}
Phone: {{phone}}
Company: {{company}}
Product Interest: {{product_interest}}

Message:
{{message}}

Submitted: {{time}}
```

## Verification

1. Run `npm run dev`
2. Go to `/contact` and submit a test quote
3. Verify the quote appears in admin panel (`/admin/inquiries`)
4. Verify an email is received at the configured admin email address
5. Verify that if EmailJS env vars are missing/wrong, the form still works (quote saves, no crash)
