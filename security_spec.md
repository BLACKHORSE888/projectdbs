# Milletly Firestore Security Specification (Phase 0)

## 1. Data Invariants
1. A `users/{userId}` document can only be created by the verified owner (`request.auth.uid == userId`) with `role == "customer"`, and users can never self-promote to `"admin"`.
2. `carts/{userId}` can only be read or written by the authenticated owner (`request.auth.uid == userId`), bounded to `items.size() <= 30`.
3. `products/{productId}` is publicly readable (`get`, `list`), while `create`, `update`, and `delete` are strictly restricted to verified admins.
4. `orders/{orderId}` can only be created by a verified signed-in user where `userId == request.auth.uid`, `status == "Placed"`, and `createdAt == request.time`. Users can only `get` or `list` their own orders (`resource.data.userId == request.auth.uid`). Only admins can update order status or read all orders.
5. `trialRequests/{requestId}` can only be created by a verified signed-in user where `userId == request.auth.uid` and `status == "Pending"`. Only the owner or an admin can read them; only admins can update fulfillment status.
6. `surveys/{surveyId}` can be created by verified signed-in users with `userId == request.auth.uid`; only admins can read, update, or delete survey responses.
7. `contactMessages/{messageId}` and `subscribers/{subscriberId}` can be created with validated bounded fields (`createdAt == request.time`), while `read`, `update`, and `delete` are strictly admin-only to prevent PII scraping.

## 2. The "Dirty Dozen" Adversarial Payloads
All 12 payloads below MUST evaluate to `PERMISSION_DENIED`:
1. **Role Escalation on User Create**: Authenticated customer creates `/users/{uid}` with `{ "role": "admin" }`.
2. **Role Escalation on User Update**: Authenticated customer updates `/users/{uid}` changing `role` from `"customer"` to `"admin"`.
3. **Shadow Field Injection on User**: Authenticated customer creates `/users/{uid}` with extra field `{ "isVerified": true }`.
4. **Unverified Admin Email Spoof**: Signed-in user with admin email in token but `email_verified: false` attempts to create `/products/test`.
5. **Non-Owner PII Read**: Authenticated User A attempts `get(/users/userB)` or `get(/orders/orderBelongingToUserB)`.
6. **Blanket Order List Scraping**: Authenticated User A runs `list(/orders)` without matching `userId == request.auth.uid`.
7. **Order Status Shortcutting**: Authenticated User A creates `/orders/o1` with `status: "Delivered"` instead of `"Placed"`.
8. **Order Identity Spoofing**: Authenticated User A creates `/orders/o2` with `userId: "userB"`.
9. **Immutable Timestamp Tampering**: User creates `/orders/o3` with backdated client `createdAt` instead of `request.time`.
10. **ID Poisoning**: User attempts `create(/contactMessages/${"a".repeat(200)})` or invalid characters `../admin`.
11. **Array Exhaustion**: User writes `/carts/{uid}` with 100 items exceeding the 30-item cap.
12. **Public Contact Message Read**: Unauthenticated or non-admin user attempts `list(/contactMessages)` or `list(/subscribers)`.
