import React, { useState } from 'react';
import { CartItem, Currency, CustomerOrder, PaymentMethodConfig } from '../../types/store';
import { formatPrice } from '../../utils/formatters';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Banknote, 
  Building,
  Zap,
  ArrowRight, 
  PackageCheck,
  Sparkles,
  Info
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  appliedDiscountPercent: number;
  paymentMethods?: PaymentMethodConfig[];
  onOrderPlaced: (order: CustomerOrder) => void;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  appliedDiscountPercent,
  paymentMethods,
  onOrderPlaced,
  onClearCart,
}) => {
  const activeMethods = (paymentMethods || []).filter((p) => p.enabled);
  const defaultMethod = activeMethods[0]?.name || 'Cash on Delivery (COD)';

  const [step, setStep] = useState<'details' | 'success'>('details');
  const [selectedMethodName, setSelectedMethodName] = useState<string>(defaultMethod);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<CustomerOrder | null>(null);

  const [formData, setFormData] = useState({
    name: 'Sajith Perera',
    email: 'sajith@example.com',
    phone: '+94 77 123 4567',
    address: '42 Lotus Road, Cinnamon Gardens',
    city: 'Colombo 07',
    notes: 'Please call before delivery',
  });

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = appliedDiscountPercent > 0 ? (subtotal * appliedDiscountPercent) / 100 : 0;
  const freeShippingThreshold = currency === 'Rs.' || currency === 'LKR' ? 15000 : 150;
  const shipping = subtotal >= freeShippingThreshold ? 0 : (currency === 'Rs.' || currency === 'LKR' ? 650 : 15);
  const total = Math.max(0, subtotal - discountAmount + shipping);

  // Find currently selected method config
  const currentMethodConfig = activeMethods.find((m) => m.name === selectedMethodName) || activeMethods[0];

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const order: CustomerOrder = {
        id: newOrderId,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        items: [...items],
        subtotal,
        discount: discountAmount,
        shipping,
        total,
        customer: { ...formData },
        paymentMethod: selectedMethodName,
        status: 'confirmed',
      };

      setConfirmedOrder(order);
      onOrderPlaced(order);
      onClearCart();
      setIsSubmitting(false);
      setStep('success');

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback
      }
    }, 600);
  };

  const renderPaymentIcon = (type: string) => {
    switch (type) {
      case 'card': return <CreditCard className="w-4 h-4" />;
      case 'bank_transfer': return <Building className="w-4 h-4" />;
      case 'bnpl': return <Zap className="w-4 h-4" />;
      default: return <Banknote className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-zinc-200">
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm tracking-wide">
              {step === 'details' ? 'Secure Express Checkout' : 'Order Confirmed!'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 'details' ? (
          <form onSubmit={handleSubmitOrder} className="p-6 space-y-6">
            {/* Quick Cart Summary Pill */}
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-between text-xs">
              <span className="text-zinc-600">
                Total for <strong>{items.reduce((acc, it) => acc + it.quantity, 0)} items</strong>
              </span>
              <span className="font-bold text-zinc-900 text-sm tabular-nums">
                {formatPrice(total, currency)}
              </span>
            </div>

            {/* Delivery Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-zinc-600" />
                Delivery Information (Sri Lanka & Global)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-zinc-600 mb-1 font-medium">Recipient Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                    placeholder="e.g. Sajith Perera"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 mb-1 font-medium">Contact Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                    placeholder="e.g. +94 77 123 4567"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-zinc-600 mb-1 font-medium">Email Address (for receipt)</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                    placeholder="e.g. sajith@example.com"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-zinc-600 mb-1 font-medium">Delivery Address</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                    placeholder="House number, Street, Area"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 mb-1 font-medium">City / District</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                    placeholder="e.g. Colombo 07, Kandy, Galle"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 mb-1 font-medium">Delivery Note (Optional)</label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                    placeholder="Gate code, landmark, calling instructions..."
                  />
                </div>
              </div>
            </div>

            {/* DYNAMIC PAYMENT METHODS SELECTOR (USER REQUIREMENT) */}
            {/* "Thawa payement method add karanna wenas karanna puluwan wenna one." */}
            <div className="space-y-3 pt-2 border-t border-zinc-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-zinc-600" />
                Select Payment Method
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeMethods.map((method) => {
                  const isSelected = selectedMethodName === method.name;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedMethodName(method.name)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-zinc-950 bg-zinc-950 text-white shadow-sm'
                          : 'border-zinc-200 hover:border-zinc-400 bg-white text-zinc-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {renderPaymentIcon(method.type)}
                        <span className="font-bold text-xs">{method.name}</span>
                      </div>
                      <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        {method.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Instructions Callout if payment method requires bank deposit or instructions */}
              {currentMethodConfig?.instructions && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2 animate-slide-down">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block mb-0.5">Payment Instructions:</strong>
                    <span>{currentMethodConfig.instructions}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Action Button */}
            <div className="pt-4 border-t border-zinc-200 flex items-center justify-between gap-4">
              <div className="text-xs text-zinc-500">
                <span>By placing this order you agree to store policies</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-zinc-950 text-white font-semibold text-xs rounded-xl hover:bg-zinc-800 transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <span>Confirm & Place Order ({formatPrice(total, currency)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Success Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-zinc-900 mb-1">
                Order #{confirmedOrder?.id} Placed Successfully!
              </h4>
              <p className="text-xs text-zinc-600 max-w-md mx-auto">
                Thank you, <strong>{confirmedOrder?.customer.name}</strong>. A receipt has been dispatched to{' '}
                <strong>{confirmedOrder?.customer.email}</strong>.
              </p>
            </div>

            {/* Order Details Receipt Box */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-xs text-left max-w-md mx-auto space-y-2">
              <div className="flex justify-between text-zinc-600">
                <span>Order Date</span>
                <span className="font-medium text-zinc-900">{confirmedOrder?.date}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Delivery Address</span>
                <span className="font-medium text-zinc-900 text-right">
                  {confirmedOrder?.customer.address}, {confirmedOrder?.customer.city}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Payment Method</span>
                <span className="font-medium text-zinc-900">
                  {confirmedOrder?.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between text-zinc-900 font-bold pt-2 border-t border-zinc-200">
                <span>Total Amount Due / Paid</span>
                <span className="tabular-nums font-mono">{formatPrice(confirmedOrder?.total || 0, currency)}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-zinc-900 text-white text-xs font-semibold rounded-xl hover:bg-zinc-800 transition-colors"
            >
              Back to Storefront
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
