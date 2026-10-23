import React, { useState } from 'react';
import { CustomerOrder, OrderStatus, Currency, Product } from '../../types/store';
import { formatPrice } from '../../utils/formatters';
import { 
  Search, 
  Filter, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Eye, 
  Printer, 
  Plus, 
  Trash2, 
  ChevronRight,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  User,
  CreditCard,
  Banknote,
  FileText,
  X
} from 'lucide-react';

interface OrderManagementViewProps {
  orders: CustomerOrder[];
  products: Product[];
  currency: Currency;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;
  onDeleteOrder: (orderId: string) => void;
  onAddManualOrder: (order: CustomerOrder) => void;
}

export const OrderManagementView: React.FC<OrderManagementViewProps> = ({
  orders,
  products,
  currency,
  onUpdateOrderStatus,
  onDeleteOrder,
  onAddManualOrder,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingOrder, setViewingOrder] = useState<CustomerOrder | null>(null);
  const [isCreatingManualOrder, setIsCreatingManualOrder] = useState(false);

  // Manual Order Form State
  const [manualCustomer, setManualCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: '',
  });
  const [manualSelectedProduct, setManualSelectedProduct] = useState<string>(products[0]?.id || '');
  const [manualQuantity, setManualQuantity] = useState<number>(1);
  const [manualPaymentMethod, setManualPaymentMethod] = useState<'cod' | 'card'>('cod');

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      order.id.toLowerCase().includes(query) ||
      order.customer.name.toLowerCase().includes(query) ||
      order.customer.phone.includes(query) ||
      order.customer.city.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3" /> Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <Truck className="w-3 h-3" /> Shipped
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3" /> Processing
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
            <CheckCircle2 className="w-3 h-3" /> Confirmed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-800">
            <Package className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  const handlePrintReceipt = (order: CustomerOrder) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 30px; color: #18181b; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e4e4e7; padding-bottom: 20px; }
            .section { margin-top: 24px; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th, td { text-align: left; padding: 10px; border-bottom: 1px solid #f4f4f5; font-size: 14px; }
            th { background-color: #f8fafc; font-weight: 600; }
            .total-row { font-weight: bold; font-size: 16px; border-top: 2px solid #18181b; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 style="margin: 0; font-size: 24px;">ORDER INVOICE</h1>
              <p style="margin: 4px 0 0 0; color: #71717a;">Order ID: <strong>${order.id}</strong></p>
              <p style="margin: 2px 0 0 0; color: #71717a;">Date: ${order.date}</p>
            </div>
            <div style="text-align: right;">
              <h3 style="margin: 0;">AURA STUDIO</h3>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #71717a;">Status: ${order.status.toUpperCase()}</p>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #71717a;">Payment: ${order.paymentMethod.toUpperCase()}</p>
            </div>
          </div>

          <div class="section">
            <h4 style="margin: 0 0 6px 0;">Customer & Delivery Details:</h4>
            <p style="margin: 2px 0; font-size: 14px;"><strong>${order.customer.name}</strong></p>
            <p style="margin: 2px 0; font-size: 14px;">Phone: ${order.customer.phone} | Email: ${order.customer.email}</p>
            <p style="margin: 2px 0; font-size: 14px;">Address: ${order.customer.address}, ${order.customer.city}</p>
            ${order.customer.notes ? `<p style="margin: 2px 0; font-size: 13px; color: #71717a;">Instructions: ${order.customer.notes}</p>` : ''}
          </div>

          <div class="section">
            <table>
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(it => `
                  <tr>
                    <td>${it.product.title}</td>
                    <td>${it.quantity}</td>
                    <td>${formatPrice(it.product.price, currency)}</td>
                    <td>${formatPrice(it.product.price * it.quantity, currency)}</td>
                  </tr>
                `).join('')}
                <tr>
                  <td colspan="3" style="text-align: right;">Subtotal:</td>
                  <td>${formatPrice(order.subtotal, currency)}</td>
                </tr>
                ${order.discount > 0 ? `
                  <tr>
                    <td colspan="3" style="text-align: right; color: #16a34a;">Discount:</td>
                    <td style="color: #16a34a;">-${formatPrice(order.discount, currency)}</td>
                  </tr>
                ` : ''}
                <tr>
                  <td colspan="3" style="text-align: right;">Shipping:</td>
                  <td>${order.shipping === 0 ? 'Free' : formatPrice(order.shipping, currency)}</td>
                </tr>
                <tr class="total-row">
                  <td colspan="3" style="text-align: right;">Total Paid:</td>
                  <td>${formatPrice(order.total, currency)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleCreateManualOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === manualSelectedProduct) || products[0];
    if (!prod) return;

    const subtotal = prod.price * manualQuantity;
    const cogs = (prod.costPrice || prod.price * 0.45) * manualQuantity;
    const shipping = subtotal > 150 ? 0 : 15;
    const total = subtotal + shipping;

    const newOrder: CustomerOrder = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      items: [
        {
          product: prod,
          quantity: manualQuantity,
        },
      ],
      subtotal,
      discount: 0,
      shipping,
      total,
      cogs,
      customer: {
        name: manualCustomer.name || 'Walk-in Customer',
        phone: manualCustomer.phone || '+94 77 000 0000',
        email: manualCustomer.email || 'customer@store.lk',
        address: manualCustomer.address || 'Direct Showroom Store',
        city: manualCustomer.city || 'Colombo',
        notes: manualCustomer.notes,
      },
      paymentMethod: manualPaymentMethod,
      status: 'processing',
    };

    onAddManualOrder(newOrder);
    setIsCreatingManualOrder(false);
    setManualCustomer({ name: '', phone: '', email: '', address: '', city: '', notes: '' });
  };

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    confirmed: orders.filter((o) => o.status === 'confirmed').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-zinc-900">Order Management</h3>
          <p className="text-xs text-zinc-500">
            Track, fulfill, update dispatch status, and print customer invoices.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingManualOrder(true)}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Create Manual Order</span>
        </button>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-zinc-50 p-2.5 rounded-xl border border-zinc-200">
        {/* Status Pills */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs pb-1 md:pb-0">
          {(['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap capitalize flex items-center gap-1.5 ${
                selectedStatus === st
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-900'
              }`}
            >
              <span>{st}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                selectedStatus === st ? 'bg-zinc-700 text-white' : 'bg-zinc-200 text-zinc-700'
              }`}>
                {counts[st]}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, name, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="py-16 text-center bg-zinc-50 rounded-xl border border-zinc-200">
          <Package className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-zinc-800">No orders found</p>
          <p className="text-xs text-zinc-500 mt-1">
            {searchQuery ? `No orders match query "${searchQuery}"` : 'No orders in this status category.'}
          </p>
        </div>
      ) : (
        <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Items Ordered</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status & Action</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50/80 transition-colors">
                    {/* Order ID & Date */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-zinc-900 block">{order.id}</span>
                      <span className="text-[11px] text-zinc-500">{order.date}</span>
                    </td>

                    {/* Customer Info */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-zinc-900 block">{order.customer.name}</span>
                      <span className="text-[11px] text-zinc-500 block">{order.customer.phone}</span>
                      <span className="text-[11px] text-zinc-400 block truncate max-w-[160px]">
                        {order.customer.city}
                      </span>
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-0.5">
                        {order.items.map((it, idx) => (
                          <span key={idx} className="line-clamp-1 text-zinc-700">
                            <strong>{it.quantity}x</strong> {it.product.title}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Payment Method */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {order.paymentMethod === 'cod' ? (
                          <Banknote className="w-3.5 h-3.5 text-amber-600" />
                        ) : (
                          <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                        )}
                        <span className="font-medium uppercase text-[11px] text-zinc-700">
                          {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}
                        </span>
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-4 font-mono font-bold text-zinc-900 tabular-nums">
                      {formatPrice(order.total, currency)}
                    </td>

                    {/* Status Select */}
                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          onUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                        }
                        className={`text-xs font-semibold rounded-lg px-2 py-1 border transition-colors cursor-pointer ${
                          order.status === 'delivered'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : order.status === 'shipped'
                            ? 'bg-blue-50 border-blue-300 text-blue-800'
                            : order.status === 'processing'
                            ? 'bg-amber-50 border-amber-300 text-amber-800'
                            : order.status === 'cancelled'
                            ? 'bg-rose-50 border-rose-300 text-rose-800'
                            : 'bg-zinc-50 border-zinc-300 text-zinc-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingOrder(order)}
                          className="p-1.5 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View order invoice & details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePrintReceipt(order)}
                          className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded transition-colors"
                          title="Print customer receipt"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteOrder(order.id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Delete order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Order Detail Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-zinc-200">
            <div className="px-6 py-4 bg-zinc-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm">Order Details & Invoice: {viewingOrder.id}</h3>
              </div>
              <button
                onClick={() => setViewingOrder(null)}
                className="p-1 text-zinc-400 hover:text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs max-h-[80vh] overflow-y-auto">
              {/* Order Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <div>
                  <span className="text-zinc-500 block text-[11px]">Placed on</span>
                  <span className="font-bold text-zinc-900">{viewingOrder.date}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[11px]">Current Status</span>
                  {getStatusBadge(viewingOrder.status)}
                </div>
                <div>
                  <span className="text-zinc-500 block text-[11px]">Payment Method</span>
                  <span className="font-bold uppercase text-zinc-900">
                    {viewingOrder.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Card Payment'}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[11px]">Total Paid</span>
                  <span className="font-mono font-bold text-sm text-zinc-900 tabular-nums">
                    {formatPrice(viewingOrder.total, currency)}
                  </span>
                </div>
              </div>

              {/* Customer Information Card */}
              <div className="p-4 border border-zinc-200 rounded-xl space-y-2">
                <h4 className="font-bold text-zinc-900 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
                  <User className="w-3.5 h-3.5 text-zinc-500" />
                  Customer Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-700">
                  <p><strong>Name:</strong> {viewingOrder.customer.name}</p>
                  <p><strong>Phone:</strong> {viewingOrder.customer.phone}</p>
                  <p className="sm:col-span-2"><strong>Email:</strong> {viewingOrder.customer.email}</p>
                  <p className="sm:col-span-2"><strong>Address:</strong> {viewingOrder.customer.address}, {viewingOrder.customer.city}</p>
                  {viewingOrder.customer.notes && (
                    <p className="sm:col-span-2 text-zinc-500 italic">
                      <strong>Delivery Instructions:</strong> "{viewingOrder.customer.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <h4 className="font-bold text-zinc-900 uppercase text-[11px] tracking-wider">
                  Line Items ({viewingOrder.items.length})
                </h4>
                <div className="divide-y divide-zinc-100 border border-zinc-200 rounded-xl overflow-hidden">
                  {viewingOrder.items.map((it, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={it.product.image}
                          alt={it.product.title}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 object-cover rounded bg-zinc-100 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-zinc-900">{it.product.title}</p>
                          <p className="text-[11px] text-zinc-500">
                            {it.product.category} {it.selectedSize ? `· Size: ${it.selectedSize}` : ''} {it.selectedColor ? `· Color: ${it.selectedColor}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold tabular-nums">
                          {it.quantity} × {formatPrice(it.product.price, currency)}
                        </span>
                        <span className="block text-[11px] text-zinc-500 tabular-nums">
                          = {formatPrice(it.product.price * it.quantity, currency)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-1.5 text-zinc-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums">{formatPrice(viewingOrder.subtotal, currency)}</span>
                </div>
                {viewingOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount Applied</span>
                    <span className="font-mono tabular-nums">-{formatPrice(viewingOrder.discount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-mono tabular-nums">
                    {viewingOrder.shipping === 0 ? 'Free' : formatPrice(viewingOrder.shipping, currency)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-sm text-zinc-900 pt-2 border-t border-zinc-200">
                  <span>Total</span>
                  <span className="font-mono tabular-nums">{formatPrice(viewingOrder.total, currency)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
              <button
                onClick={() => handlePrintReceipt(viewingOrder)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setViewingOrder(null)}
                className="px-4 py-2 border border-zinc-300 rounded-lg text-xs font-semibold text-zinc-700 hover:bg-zinc-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Manual Order Modal */}
      {isCreatingManualOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-zinc-200">
            <div className="px-6 py-4 bg-zinc-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Create Manual Store Order</h3>
              <button
                onClick={() => setIsCreatingManualOrder(false)}
                className="p-1 text-zinc-400 hover:text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualOrderSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-zinc-700 font-semibold mb-1">Select Product:</label>
                <select
                  value={manualSelectedProduct}
                  onChange={(e) => setManualSelectedProduct(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} - {formatPrice(p.price, currency)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-700 font-semibold mb-1">Quantity:</label>
                <input
                  type="number"
                  min="1"
                  value={manualQuantity}
                  onChange={(e) => setManualQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">Customer Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kasun Fernando"
                    value={manualCustomer.name}
                    onChange={(e) => setManualCustomer({ ...manualCustomer, name: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">Customer Phone:</label>
                  <input
                    type="tel"
                    required
                    placeholder="+94 77 123 4567"
                    value={manualCustomer.phone}
                    onChange={(e) => setManualCustomer({ ...manualCustomer, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-700 font-semibold mb-1">Delivery Address & City:</label>
                <input
                  type="text"
                  required
                  placeholder="Street address, City"
                  value={manualCustomer.address}
                  onChange={(e) => setManualCustomer({ ...manualCustomer, address: e.target.value, city: 'Colombo' })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-semibold mb-1">Payment Method:</label>
                <select
                  value={manualPaymentMethod}
                  onChange={(e) => setManualPaymentMethod(e.target.value as 'cod' | 'card')}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs"
                >
                  <option value="cod">Cash on Delivery (COD)</option>
                  <option value="card">Prepaid Card / Bank Transfer</option>
                </select>
              </div>

              <div className="pt-4 border-t border-zinc-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingManualOrder(false)}
                  className="px-4 py-2 border border-zinc-300 rounded-lg text-zinc-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Save Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
