# Security Specification & Threat Model for Findjobber PRO

## 1. Data Invariants
- **Identity Invariant**: A user can only access, create, read, update, or delete data within their own sub-path (`/users/{userId}/**`).
- **Owner Consistency**: In all user sub-resources (`savedJobs`, `applications`, `watchedCompanies`), incoming `userId` must strictly equal `request.auth.uid`.
- **Relational Integrity**: Cross-user tampering is impossible by strictly bounding document paths under `/users/$(request.auth.uid)/`.
- **String Length Limits**: All incoming text payloads have explicit `.size()` boundaries (e.g., max 128 for IDs, 150 for titles, 8000 for cover letters) to eliminate Denial-of-Wallet and resource flooding attacks.

## 2. The "Dirty Dozen" Payloads (Must Return PERMISSION_DENIED)
1. **Cross-User Profile Hijack**: Authenticated User A attempting `setDoc(/users/UserB)` with User A's token.
2. **Anonymous Write Attack**: Unauthenticated client attempting write to `/users/{userId}` without valid auth token.
3. **Ghost Field Poisoning**: Writing a payload with unauthorized root fields or elevated roles.
4. **Denial-of-Wallet Long String**: Injecting a 2MB string into `name` or `cvText`.
5. **ID Path Spoofing**: Attempting path traversal with malicious ID strings like `../otherUser`.
6. **Subcollection Orphan Injection**: Writing `/users/UserA/applications/app1` with `userId = "UserB"`.
7. **Unverified Email Privilege Escalation**: User with `email_verified == false` attempting to overwrite system attributes.
8. **Direct List Query Bypass**: Querying all `/users` root documents without scoping to own UID.
9. **Malicious Enum Injection**: Updating `status` in `applications` with `'hacked_status'`.
10. **Array Flooding**: Inserting an array of 5,000 items into `skills` or `targetRoles`.
11. **Immortal Field Tampering**: Attempting to alter `userId` on existing application records during an update.
12. **Foreign Application Deletion**: Authenticated User A issuing `deleteDoc` on `/users/UserB/applications/app1`.
