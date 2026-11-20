import { PaymentMethod } from '../types';

export interface PaymentInitResult {
  success: boolean;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid';
  transactionId?: string;
}

/**
 * Payment abstraction layer.
 * Currently processes "Cash on Delivery / Pay on UPI after confirmation".
 * Razorpay Checkout SDK can be integrated directly inside this function later
 * without changing CheckoutPage UI logic.
 */
export const processOrderPayment = async (params: {
  amountInr: number;
  method: PaymentMethod;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}): Promise<PaymentInitResult> => {
  if (params.method === 'COD_UPI_CONFIRM') {
    return {
      success: true,
      paymentMethod: 'COD_UPI_CONFIRM',
      paymentStatus: 'pending',
    };
  }

  // Future Razorpay Integration Hook:
  // 1. Create a Razorpay order via backend for params.amountInr * 100 paise
  // 2. Open Razorpay Checkout modal with prefill (customerName, customerEmail, customerPhone)
  // 3. Verify signature and return { success: true, paymentStatus: 'paid', transactionId }
  throw new Error('Online Razorpay payments are coming soon! Please use COD / Pay on UPI.');
};
