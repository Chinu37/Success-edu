# Roadmap: TeachLoop-style SaaS

Model: **SaaS**. Each creator gets their own branded school and pays a subscription.
Our own branding and code, built on Academy LMS.

Assumptions (change any of these before Phase 1 starts):
- Each school collects payments with its **own Razorpay keys** (0% revenue share for us).
- Schools live on subdomains (`name.yourdomain.com`); custom domains come later.
- Your own course is the first school, created through the same flow as everyone else.

## Phase 1: Multi-tenant foundation
- `School` model: name, slug, owner, logo, colors, payment keys (encrypted)
- Middleware resolves the school from the subdomain
- Scope courses, categories, purchases and analytics by school
- Replace the global teacher id with "school owner" and optional staff
- Creator onboarding: sign up, create school, open dashboard
- Platform super admin sees all schools, students and revenue

## Phase 2: Creator billing (how you earn)
- Razorpay Subscriptions: monthly, quarterly, annual plans
- 7-day free trial, plan limits, upgrade and cancel
- Webhooks: charged, halted, cancelled (suspend school when unpaid)
- Manual (cash) activation: super admin can activate or extend a creator's plan
  without Razorpay, with amount, note and an audit log
  (until then, the admin adds the creator's id to `NEXT_PUBLIC_TEACHER_ID`)

## Phase 3: Launch your course
- Upload your first course into your school
- Per-school checkout with the school's own Razorpay keys, UPI included
- Refund and invoice basics

## Phase 4: Coaching booking
- Availability, time slots, timezone handling
- Book and pay for 1-on-1 sessions, meeting link per booking
- Reminders, reschedule and cancel

## Phase 5: Email and WhatsApp automation
- Triggers: signup, purchase, abandoned checkout, course completion
- Email templates and sending provider
- WhatsApp Business API (message templates need Meta approval)
- Scheduled jobs and a message queue

## Later
- Communities (posts, points, badges, leaderboard)
- Memberships (subscriptions, drip content, auto-renewal)
- Landing pages, funnels and a simple CRM
- AI tools (script writer, offer generator)
- Mobile app

## Needed from you before Phase 1
- Product name and domain (wildcard DNS for subdomains)
- Hosting choice (Vercel + a MySQL provider is the simplest)
- Razorpay account for your own subscription billing (Phase 2)
