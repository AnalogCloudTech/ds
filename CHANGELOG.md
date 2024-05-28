# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [UNRELEASED]

### Added

- Added endpoints to ABO service - these endpoints will enable usage of DS services features without harming the existing endpoints
- Added endpoint parameter to bulk delete all leads
- In ABO, confirm password not needed
- Endpoint to retrieve customer on ABO api
- Add component informations on invoice payload
- status vlidation for getting members data from HS
- In ABO, added a new endpoint to list all coaches with meeting count and phone calls count
- new endpoint for retrieving subscript data
- Offer list pagination in ABO Controller
- Format call cancelled
- Added api key on admin guard to allow requets from ABO
- paginated advanced tripwire sales report results
- add filters by status on RM magazine reports
- add upsell reports with upsell results filtering
- API changes in RM magazine reports
- add Product Handle on subscription request
- add product family on subscription request
- add customer on subscription request

### Changed

- offers list results are now paginated

### Fixed

- Fixed Remove - Disabled Customer Milestone triggers and module
- filter for delete all leads query
- Fixed Problem updating the deal with coaching details
- move endpoint guard to not public in ordering book
- Fixed Book Credits Not Issued Automatically
- Search sales report with customer email fix

### Removed

- Old code with SMS campaign triggers

## [v3.2.3] - 2024-03-28

### Added

- Exposed subscription data on auth
- Added endpoint to get upsell event even with no session active
- Automated tests to replaceTags
- Retry function and automated tests.
- Added endpoint to get count of total emails sent

### Fixed

- Deal association now on hubspot sync actions.
- Removed and Improved Logs on webhooks services.
- Fixed Book Credits not Issued Automatically When a customer is migrated from stripe.
- added proper error handling for the failed place order onboard step
- Fixed Check Creation of Contact Records from Digital Services Integration
- Fixed `findAllPaginated` function that was considering the deleted leads in the total count.
- Fixed Problems about Subscription state change.
- Fixed Error handling renewal success
- Fixed Problems to create Zoom JWT Token
- Fixed Delete Zoom Meetings

## [v3.2.1] - 2024-03-28

### Fixed

- Fixed issue where subscription could be upgraded with no payment status approved in chargify

## [v3.2.0] - 2024-03-08

### Removed

- Removed onboard calendar writer

## [v3.1.21]

### Added

- Added allowed line item ids to environment variables
- Removed email trigger for upgrade plan

### Removed

- Cronjobs and moved logic to endpoints

## [v3.1.16]

### Added

- Linting and formatting validation
- Enhanced pipeline with testing and validations
- Option to skip onboarding steps
- Add coaching details to hubspot deals
- Add Upgrade Plan: Contract Binding
- Add new type for RM accounts
- Added Advance Search for TW Upsell Reports
- Added an endpoint to return the customer subscription
- Added missing property in return of getting deal details
- Auto refund for QA testing emails
- Add Search suggestion and advance search in Onboarding Sales Report
- Added missing property in return of getting deal details
- Auto refund for QA testing emails
- Added separate Dentist credits property in hubspot
- Increase limit to 100 for onboarding sales report suggestion
- Added a new property to offer - freeBooks

### Fixed

- Skip or fix legacy tests to enable ci testing
- Fix regexFilters for Upsell report
- Twillio start up breaking tests
- Fix sorting for upsell report
- Remove usage of undefined variable
- Fix bug where could not decode unicode input
- Skip training webinar step if not available
- Fix issue where customer status could be returned twice
- Fix customer status from clickfunnels
- customer status change together with subscription state
- Fix contracted offer setup
- Fix Offer not allowed package
- Optional keyword for advanced search
- Added HS Terms in Quotation creation
- Fixed line items on Quote Creation
- Fixed and add hs_comment to quote creation
- Fixed Duplicate Member List Deal Created for 1 Subscription

## [v3.1.10]

### Added

- Add date range on onboard sales report filter
- Add Dentist Guide Ordering and Onboarding steps
- Add Paginator for guide orders and thumbnails
- Add generated book metric
- Add Subscription canceled metric
- Add bearer token for call recording download in HS and changed zoom api instead of proxy
- Add guideId as optional parameter in Guide Orders
- Buy More Guide Credits (different pricing from books)
- Add One Time Family product for guide credits
- Added Guide Catalog Endpoint (where guide list is stored)
- Added Landing Page and Read Page in Guide Orders
- Add endpoint for saving guides links and retrieve guide links
- Add endpoint for getting call recording and download using file_URL.
- Added get latest guide order by guideId
- Filter to improve query time in onboard report
- Add Reports for Tripwire Offers
- Added Sort by for upsell reports
- Added TW Upsell export CSV function
- Collector to send logs when books are ordered while trial subscription.
- Leads soft deletes and bulk removal
- Collectors for trial metrics
- Add small change in zoom API URL
- Add remove duplicate payment profile
- Added create data from onboarding with order later

### Changed

- Refactor session next-step to check for steps from database first.
- Conditions applied in "getSubscriptionsFromEmail" Method
- Change revert_on_failure to False, forces trial ending
- Activate Trialing after switching to a new plan
- Change prefix of fields in Guide Orders to "office"
- Remove guideId from Guide Orders
- Change Guide Order Content
- DentistCoach are now assignable to be dentist coach
- Refactored Guide Orders and Session Update on single order
- Disabled coach exclusion
- Add Coaching Selection and Schedule Date string in session if available
- Get Credits filter by type
- Change Guide Order field names
- Reorder Email from Email Campaign
- Fix: Reorder Email from Email Campaign

### Fixed

- Fix no first subscription on get-show-credits-button
- Onboarding problem regarding new function
- Fix onboard report date timezone
- Fix guides controller not exposed
- Guide Order Ticket creation
- Guide Ticket creation wrong email
- Fix guide order ID template
- Fix session populate coach and offer
- Fix undefined summary for guide orders and Fix type for summary
- Add default Credit Type for buying more credits
- Fix guide order summary
- Fix practiceAddress validation
- Fix Thumbnail missing and quantity type
- Fix Holiday sale one-time payment
- Fix proration for non-trialing subscriptions
- Check first for members list before upgrading plans
- Removed always true statement in country selection
- Fix multiplier for guide orders for packet type
- Fix storing of offer and customer object and update sessionType to Upsell

## [v3.0.24]

### Added

- Update email reminders status when failed
- Add Dentist product in HS product type
- Zoom server-O-server app for bearer token generation and provide validation on URL
- Add first Guide Orders to session

### Changed

- Improved logging in monthly magazine generation function

## [v3.0.21] - 2023-10-05

### Added

- Endpoint for updating session with a new coach
- Account Type to offers and customer data

### Changed

- Node version required engine in node package
- Removed unused body properties in update session with new coach

## [v3.0.20] - 2023-10-04

### Fixed

- Fixed issue with `getShowCreditsButton` method in `PaymentChargifyService` when user is not found
- Fixed Steps for onboarding after including Training Webinar back
- Fixed deallocation of components when upgrading to plus plans
- Prevent address update with empty values on hubspot
- Fix missing imports for submitHSForms - `ValidationTransformPipe`
- Fixed Book Credit count increased after account activation in Chargify
- Fixed Book Credit count increased after trial to upgrade in Chargify
- Fixed Chargify Payment Did not Reflect in HubSpot
- Fixed Book Credits and Book Access didn't auto-populate
- Fixed Digital Plus Annual Plan - Book Credit Issue
- 1 Chargify Subscription created 2 Member's List Deals
- Members Deal stage did not update automatically
- Fixed RM Trial Created 2 HS Deals
- Remove Canadian Books Not Added
- Fixed Canadian books not Added
- Fixed No member list deal created from a subscription directly created in chargify
- Fixed Member list deal is Not created from a subscription that directly created in chargify for RM subscription
- Fixed Minor changes

### Added

- Add `hubspotListId` on offers. Enrolling contact to list on hubspot after upsell purchase
- Now upsell and direct sale will activate the customer
- Add new module called "tracking-pixel".
- Added tracking-pixel controller, service
- Created new API endpoint for "Tracking Sales Pixel" with public
- Added feature flag util function for training webinar step on onboarding
- Allow Plus plan upgrades to activate trialing subscriptions
- Add a Deal stage in updatedeal properties
- Add a SubscriptionId in sales report
- Add Submission of HS Forms
- Add Canadian Book packages for Canadaian members

### Changed

- Move condition to send only campaign to active customer to `campaigns` service

## [v3.0.17] 2023-09-24

- Changelogs

## [v2.6.1] - 2023-05-10

### Added

- Add "renewal-success" event
- Add logger in "payment-success" event
- Add an endpoint to update the upsell session with marketing parameters

### Fixed

Fixed book credit issue for "morgatge-premium" service-credit issues
Fixed Investigate issue in "success payment" webhook
Fixed Update deal for canceled members
Fixed wrong cancellation date info in DMP

### Changed

- Handle the book credit from single poin
- Change logger in "payment-success" event
