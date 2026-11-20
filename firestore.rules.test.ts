/**
 * Payload-First Security Rule Verification Matrix for Milletly.
 * Maps each of the 12 adversarial payloads in security_spec.md to the
 * exact Firestore rule gate that enforces PERMISSION_DENIED.
 */

export interface AdversarialTestCase {
  id: number;
  name: string;
  collection: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  expectedResult: 'PERMISSION_DENIED';
  enforcingGate: string;
}

export const DIRTY_DOZEN_CASES: AdversarialTestCase[] = [
  {
    id: 1,
    name: 'Role Escalation on User Create',
    collection: 'users',
    operation: 'create',
    expectedResult: 'PERMISSION_DENIED',
    enforcingGate: "incoming().role == 'customer'",
  },
  {
    id: 2,
    name: 'Role Escalation on User Update',
    collection: 'users',
    operation: 'update',
    expectedResult: 'PERMISSION_DENIED',
    enforcingGate: "incoming().role == existing().role && affectedKeys().hasOnly(['name','phone','address','city','pincode','photoURL'])",
  },
  {
    id: 3,
    name: 'Shadow Field Injection on User',
    collection: 'users',
    operation: 'create',
    expectedResult: 'PERMISSION_DENIED',
    enforcingGate: 'isValidUser(incoming()) keys().hasOnly(...)',
  },
  {
    id: 4,
    name: 'Unverified Admin Email Spoof',
    collection: 'products',
    operation: 'create',
    expectedResult: 'PERMISSION_DENIED',
    enforcingGate: 'isAdmin() requires request.auth.token.email_verified == true',
  },
  {
    id: 5,
    name: 'Non-Owner PII Read',
    collection: 'orders',
    operation: 'get',
    expectedResult: 'PERMISSION_DENIED',
    enforcingGate: 'existing().userId == request.auth.uid || isAdmin()',
  },
  {
    id: 6,
    name: 'Blanket Order List Scraping',
    collection: 'orders',
    operation: 'list',
    expectedResult: 'PERMISSION_DENIED',
    enforcingGate: 'allow list: if (isSignedIn() && existing().userId == request.auth.uid) || isAdmin()',
  },
  {
    id: 7,
    name: 'Order Status Shortcutting',
    collection: 'orders',
    operation: 'create',
    expectedResult: 'PERMISSION_DENIED',
    enforcingGate: "incoming().status == 'Placed'",
  },
  {
    id: 8,
    name: 'Order Identity Spoofing',
    collection: 'orders',
    operation: 'create',
    expectedResult: 'PERMISSION_DENIED',
    enforcingGate: 'incoming().userId == request.auth.uid',
  },
  {
    id: 9,
    name: 'Immutable Timestamp Tampering',
    collection: 'orders',
    operation: 'create',
    expectedResult: 'PERMISSION_DENIED',
    enforcingGate: 'incoming().createdAt == request.time',
  },
  {
    id: 10,
    name: 'ID Poisoning',
    collection: 'contactMessages',
    operation: 'create',
    expectedResult: 'PERMISSION_DENIED',
    enforcingGate: "isValidId(messageId) checks size <= 128 && matches('^[a-zA-Z0-9_\\\\-]+$')",
  },
  {
    id: 11,
    name: 'Array Exhaustion on Cart',
    collection: 'carts',
    operation: 'create',
    expectedResult: 'PERMISSION_DENIED',
    enforcingGate: 'isValidCart(incoming()) checks data.items.size() <= 30',
  },
  {
    id: 12,
    name: 'Public Contact Message Read',
    collection: 'contactMessages',
    operation: 'list',
    expectedResult: 'PERMISSION_DENIED',
    enforcingGate: 'allow list: if isAdmin()',
  },
];
