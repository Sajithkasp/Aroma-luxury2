import React, { useState } from 'react';
import { CustomerOrder, ManualExpense, ExpenseCategory, Currency, Product } from '../../types/store';
import { formatPrice } from '../../utils/formatters';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Plus, 
  Trash2, 
  Receipt, 
  PieChart, 
  Calendar, 
  Tag, 
  Download, 
  AlertCircle,
  CheckCircle2,
  Package,
  Truck,
  Sparkles
} from 'lucide-react';

interface PnLReportViewProps {
  orders: CustomerOrder[];
  products: Product[];
  expenses: ManualExpense[];
  currency: Currency;
  onAddExpense: (expense: ManualExpense) => void;
  onDeleteExpense: (id: string) => void;
}

export const PnLReportView: React.FC<PnLReportViewProps> = ({
  orders,
  products,
  expenses,
  currency,
  onAddExpense,
  onDeleteExpense,
}) => {
  // New Expense Form State
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('marketing');
  const [expenseDate, setExpenseDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [expenseNotes, setExpenseNotes] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Calculate Financials from Valid/Non-cancelled orders
  const validOrders = orders.filter((o) => o.status !== 'cancelled');

  const grossSales = validOrders.reduce((sum, o) => sum + o.subtotal, 0);
  const totalDiscounts = validOrders.reduce((sum, o) => sum + (o.discount || 0), 0);
  const shippingCollected = validOrders.reduce((sum, o) => sum + (o.shipping || 0), 0);
  const netRevenue = grossSales - totalDiscounts + shippingCollected;

  // Calculate COGS: if order has explicit cogs recorded, use it; otherwise compute from product costPrice (or 40% default)
  const totalCogs = validOrders.reduce((sum, o) => {
    if (o.cogs && o.cogs > 0) return sum + o.cogs;
    const orderItemsCogs = o.items.reduce((itemSum, item) => {
      const matchedProd = products.find((p) => p.id === item.product.id) || item.product;
      const unitCost = matchedProd.costPrice !== undefined ? matchedProd.costPrice : matchedProd.price * 0.45;
      return itemSum + unitCost * item.quantity;
    }, 0);
    return sum + orderItemsCogs;
  }, 0);

  const grossProfit = netRevenue - totalCogs;
  const grossMarginPercent = netRevenue > 0 ? (grossProfit / netRevenue) * 100 : 0;

  // Calculate Operating Expenses (Manual Costs)
  const totalOperatingExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Net Profit
  const netProfit = grossProfit - totalOperatingExpenses;
  const netMarginPercent = netRevenue > 0 ? (netProfit / netRevenue) * 100 : 0;

  // Expenses grouped by category
  const expensesByCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(expenseAmount);
    if (!expenseTitle.trim() || isNaN(amountNum) || amountNum <= 0) return;

    const newExpense: ManualExpense = {
      id: `exp-${Date.now()}`,
      title: expenseTitle.trim(),
      amount: amountNum,
      category: expenseCategory,
      date: expenseDate || new Date().toISOString().slice(0, 10),
      notes: expenseNotes.trim() || undefined,
    };

    onAddExpense(newExpense);
    setExpenseTitle('');
    setExpenseAmount('');
    setExpenseNotes('');
  };

  const handleQuickAdd = (title: string, amount: number, category: ExpenseCategory) => {
    const newExpense: ManualExpense = {
      id: `exp-${Date.now()}`,
      title,
      amount,
      category,
      date: new Date().toISOString().slice(0, 10),
      notes: 'Quick preset entry',
    };
    onAddExpense(newExpense);
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['PROFIT & LOSS FINANCIAL REPORT'],
      ['Store Currency', currency],
      ['Generated On', new Date().toLocaleString()],
      [],
      ['REVENUE METRICS', 'AMOUNT'],
      ['Gross Merchandise Value (GMV)', grossSales],
      ['Customer Promo Discounts Given', -totalDiscounts],
      ['Shipping Collected', shippingCollected],
      ['Total Net Revenue', netRevenue],
      [],
      ['COST OF GOODS SOLD (COGS)', 'AMOUNT'],
      ['Direct Product Production/Purchase Costs', totalCogs],
      ['GROSS PROFIT', grossProfit],
      ['Gross Margin %', `${grossMarginPercent.toFixed(1)}%`],
      [],
      ['MANUAL OPERATING EXPENSES', 'AMOUNT'],
      ...expenses.map((e) => [`${e.title} (${e.category}) - ${e.date}`, e.amount]),
      ['Total Operating Expenses', totalOperatingExpenses],
      [],
      ['NET PROFIT', netProfit],
      ['Net Margin %', `${netMarginPercent.toFixed(1)}%`],
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pnl-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredExpenses = filterCategory === 'all'
    ? expenses
    : expenses.filter((e) => e.category === filterCategory);

  const getCategoryLabel = (cat: ExpenseCategory) => {
    switch (cat) {
      case 'marketing': return 'Marketing & Ads';
      case 'packaging': return 'Packaging & Boxes';
      case 'shipping': return 'Shipping & Logistics';
      case 'operations': return 'Operations & Rent';
      case 'salaries': return 'Staff & Freelancers';
      case 'inventory': return 'Inventory Stock';
      case 'software': return 'Software & Tools';
      default: return 'Other Expense';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header and Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-zinc-900">Profit & Loss (P&L) Report</h3>
          <p className="text-xs text-zinc-500">
            Real-time financial performance statement tracking revenues, product costs, and operational expenses.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export P&L (CSV)</span>
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Net Revenue */}
        <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Net Revenue</span>
            <DollarSign className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-xl font-mono font-bold text-zinc-900 tabular-nums">
            {formatPrice(netRevenue, currency)}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">
            From {validOrders.length} valid orders
          </p>
        </div>

        {/* Cost of Goods Sold */}
        <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Cost of Goods (COGS)</span>
            <Package className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-xl font-mono font-bold text-zinc-900 tabular-nums">
            {formatPrice(totalCogs, currency)}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">
            Product materials & manufacturing
          </p>
        </div>

        {/* Gross Profit & Margin */}
        <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Gross Profit</span>
            <span className={`text-[11px] font-bold px-1.5 py-0.2 rounded ${
              grossMarginPercent >= 40 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}>
              {grossMarginPercent.toFixed(1)}% Margin
            </span>
          </div>
          <div className="text-xl font-mono font-bold text-zinc-900 tabular-nums">
            {formatPrice(grossProfit, currency)}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">
            Revenue minus product costs
          </p>
        </div>

        {/* Net Profit (Bottom line) */}
        <div className={`p-4 rounded-xl border shadow-xs ${
          netProfit >= 0 ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
        }`}>
          <div className="flex items-center justify-between text-zinc-700 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Net Profit (Bottom Line)</span>
            {netProfit >= 0 ? (
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-rose-600" />
            )}
          </div>
          <div className={`text-xl font-mono font-bold tabular-nums ${
            netProfit >= 0 ? 'text-emerald-800' : 'text-rose-800'
          }`}>
            {formatPrice(netProfit, currency)}
          </div>
          <p className="text-[11px] text-zinc-600 mt-1 flex items-center justify-between">
            <span>Net Margin: <strong>{netMarginPercent.toFixed(1)}%</strong></span>
            <span className={`font-semibold ${netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {netProfit >= 0 ? 'Profitable' : 'Deficit'}
            </span>
          </p>
        </div>
      </div>

      {/* SECTION 2: MANUAL COST ENTRY (USER EXPLICIT REQUIREMENT) */}
      {/* "Thawa pnl ekata add karanna manual cost enter karanna thanak" */}
      <div className="bg-white border-2 border-dashed border-blue-400/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-blue-100">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-600" />
            <div>
              <h4 className="text-sm font-bold text-zinc-900">
                Manual Cost / Expense Entry
              </h4>
              <p className="text-xs text-zinc-500">
                Enter your marketing, shipping, packaging, and operating costs. They instantly calculate into the P&L Net Profit!
              </p>
            </div>
          </div>
          <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[10px]">
            Live Sync to P&L
          </span>
        </div>

        {/* Quick Add Presets */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-zinc-500 font-medium">Quick Presets:</span>
          <button
            type="button"
            onClick={() => handleQuickAdd('Facebook / Meta Ad Boost', 50, 'marketing')}
            className="px-2.5 py-1 bg-zinc-100 hover:bg-blue-50 hover:text-blue-700 border border-zinc-200 rounded-md transition-colors"
          >
            + {currency}50 Meta Ads
          </button>
          <button
            type="button"
            onClick={() => handleQuickAdd('Courier Pickup & Dispatch Batch', 35, 'shipping')}
            className="px-2.5 py-1 bg-zinc-100 hover:bg-blue-50 hover:text-blue-700 border border-zinc-200 rounded-md transition-colors"
          >
            + {currency}35 Courier Delivery
          </button>
          <button
            type="button"
            onClick={() => handleQuickAdd('100 Custom Kraft Packing Boxes', 45, 'packaging')}
            className="px-2.5 py-1 bg-zinc-100 hover:bg-blue-50 hover:text-blue-700 border border-zinc-200 rounded-md transition-colors"
          >
            + {currency}45 Packaging Boxes
          </button>
          <button
            type="button"
            onClick={() => handleQuickAdd('Shop / Warehouse Storage Rent', 100, 'operations')}
            className="px-2.5 py-1 bg-zinc-100 hover:bg-blue-50 hover:text-blue-700 border border-zinc-200 rounded-md transition-colors"
          >
            + {currency}100 Rent / Storage
          </button>
        </div>

        {/* Custom Cost Form */}
        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs pt-2">
          {/* Description */}
          <div className="sm:col-span-4">
            <label className="block text-zinc-700 font-medium mb-1">Expense Title / Description</label>
            <input
              type="text"
              required
              placeholder="e.g. Google Search Ads, Packaging Boxes, Office Rent"
              value={expenseTitle}
              onChange={(e) => setExpenseTitle(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Amount */}
          <div className="sm:col-span-2">
            <label className="block text-zinc-700 font-medium mb-1">Amount ({currency})</label>
            <input
              type="number"
              step="any"
              min="0.01"
              required
              placeholder="0.00"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />
          </div>

          {/* Category */}
          <div className="sm:col-span-3">
            <label className="block text-zinc-700 font-medium mb-1">Cost Category</label>
            <select
              value={expenseCategory}
              onChange={(e) => setExpenseCategory(e.target.value as ExpenseCategory)}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="marketing">Marketing & Advertising</option>
              <option value="packaging">Packaging & Materials</option>
              <option value="shipping">Shipping & Logistics</option>
              <option value="operations">Operations & Rent</option>
              <option value="salaries">Staff & Labor</option>
              <option value="inventory">Inventory & Materials</option>
              <option value="software">Software & Hosting</option>
              <option value="other">Other Operating Expense</option>
            </select>
          </div>

          {/* Date */}
          <div className="sm:col-span-2">
            <label className="block text-zinc-700 font-medium mb-1">Date</label>
            <input
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-1 flex items-end">
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm flex items-center justify-center transition-colors"
              title="Add this cost to P&L"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 3: Itemized Manual Expenses Table */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs space-y-3 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200">
          <div>
            <h4 className="text-sm font-bold text-zinc-900">
              Manual Operating Expenses ({expenses.length})
            </h4>
            <span className="text-xs text-zinc-500">
              Total Recorded Operating Cost: <strong>{formatPrice(totalOperatingExpenses, currency)}</strong>
            </span>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-zinc-500">Filter:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2.5 py-1 text-xs border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-700"
            >
              <option value="all">All Categories</option>
              <option value="marketing">Marketing</option>
              <option value="packaging">Packaging</option>
              <option value="shipping">Shipping</option>
              <option value="operations">Operations</option>
              <option value="salaries">Staff</option>
              <option value="inventory">Inventory</option>
              <option value="software">Software</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-400">
            No expenses recorded in this category. Use the form above to add your costs.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Expense Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Notes</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-zinc-600 text-[11px] whitespace-nowrap">
                      {exp.date}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-zinc-900">
                      {exp.title}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-700">
                        {getCategoryLabel(exp.category)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-zinc-500 text-[11px] max-w-[200px] truncate">
                      {exp.notes || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-zinc-900 tabular-nums">
                      {formatPrice(exp.amount, currency)}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onDeleteExpense(exp.id)}
                        className="p-1 text-zinc-400 hover:text-rose-600 transition-colors rounded"
                        title="Delete expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 4: Formal Income Statement (P&L Breakdown) */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-zinc-900 border-b border-zinc-200 pb-3 flex items-center justify-between">
          <span>Itemized Profit & Loss Income Statement</span>
          <span className="text-xs font-normal text-zinc-500">Standard Retail GAAP Summary</span>
        </h4>

        <div className="space-y-4 text-xs">
          {/* 1. Revenues */}
          <div>
            <div className="font-bold text-zinc-900 uppercase text-[11px] tracking-wider mb-2 flex items-center justify-between">
              <span>1. Revenues & Inflows</span>
              <span className="tabular-nums font-mono text-zinc-900">{formatPrice(netRevenue, currency)}</span>
            </div>
            <div className="pl-4 space-y-1.5 text-zinc-600 border-l-2 border-zinc-200">
              <div className="flex justify-between">
                <span>Gross Merchandise Sales (GMV)</span>
                <span className="font-mono tabular-nums">{formatPrice(grossSales, currency)}</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>Less: Customer Promo & Coupon Discounts</span>
                <span className="font-mono tabular-nums">-{formatPrice(totalDiscounts, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Customer Shipping Collected</span>
                <span className="font-mono tabular-nums">{formatPrice(shippingCollected, currency)}</span>
              </div>
              <div className="flex justify-between font-semibold text-zinc-900 pt-1 border-t border-zinc-100">
                <span>Net Inflows</span>
                <span className="font-mono tabular-nums">{formatPrice(netRevenue, currency)}</span>
              </div>
            </div>
          </div>

          {/* 2. Cost of Goods Sold */}
          <div>
            <div className="font-bold text-zinc-900 uppercase text-[11px] tracking-wider mb-2 flex items-center justify-between">
              <span>2. Cost of Sales (COGS)</span>
              <span className="tabular-nums font-mono text-zinc-900">-{formatPrice(totalCogs, currency)}</span>
            </div>
            <div className="pl-4 space-y-1.5 text-zinc-600 border-l-2 border-zinc-200">
              <div className="flex justify-between">
                <span>Direct Product Manufacturing / Inventory Cost</span>
                <span className="font-mono tabular-nums">-{formatPrice(totalCogs, currency)}</span>
              </div>
              <div className="flex justify-between font-bold text-zinc-900 pt-1 border-t border-zinc-100">
                <span>Gross Trading Profit</span>
                <span className="font-mono tabular-nums text-emerald-700">{formatPrice(grossProfit, currency)} ({grossMarginPercent.toFixed(1)}%)</span>
              </div>
            </div>
          </div>

          {/* 3. Operating Expenses */}
          <div>
            <div className="font-bold text-zinc-900 uppercase text-[11px] tracking-wider mb-2 flex items-center justify-between">
              <span>3. Operating Expenses (Manual Costs)</span>
              <span className="tabular-nums font-mono text-zinc-900">-{formatPrice(totalOperatingExpenses, currency)}</span>
            </div>
            <div className="pl-4 space-y-1.5 text-zinc-600 border-l-2 border-zinc-200">
              {Object.entries(expensesByCategory).map(([cat, amt]) => (
                <div key={cat} className="flex justify-between">
                  <span>{getCategoryLabel(cat as ExpenseCategory)}</span>
                  <span className="font-mono tabular-nums">-{formatPrice(amt, currency)}</span>
                </div>
              ))}
              {expenses.length === 0 && (
                <div className="text-zinc-400 italic">No manual operating expenses entered yet.</div>
              )}
              <div className="flex justify-between font-semibold text-zinc-900 pt-1 border-t border-zinc-100">
                <span>Total Operating Overheads</span>
                <span className="font-mono tabular-nums">-{formatPrice(totalOperatingExpenses, currency)}</span>
              </div>
            </div>
          </div>

          {/* 4. Bottom Line Net Profit */}
          <div className={`p-4 rounded-xl flex items-center justify-between text-sm font-bold ${
            netProfit >= 0 ? 'bg-emerald-50 text-emerald-950 border border-emerald-300' : 'bg-rose-50 text-rose-950 border border-rose-300'
          }`}>
            <div>
              <span className="block text-base">Net Operating Income / Net Profit</span>
              <span className="text-xs font-normal text-zinc-600">Bottom-line earnings after all costs and expenses</span>
            </div>
            <div className="text-right">
              <span className="text-xl font-mono tabular-nums block">{formatPrice(netProfit, currency)}</span>
              <span className="text-xs font-semibold">{netMarginPercent.toFixed(1)}% Net Margin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
