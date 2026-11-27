import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Globe,
  Layers,
  Lock,
  Monitor,
  Package,
  Plus,
  RefreshCw,
  RotateCcw,
  Send,
  Shield,
  ShoppingBag,
  Smartphone,
  Tablet,
  Trash2,
  X,
} from 'lucide-react';
import { GlassRefraction } from './GlassRefraction';

export interface LiveProjectMeta {
  id: string;
  index: string;
  category: string;
  year: string;
  title: string;
  subtitle: string;
  stack: string;
  slides: {
    src: string;
    alt: string;
    caption: string;
  }[];
}

const EDITORIAL_EASE = [0.16, 1, 0.3, 1] as const;

/* -------------------------------------------------------------------------- */
/* 01. Seraphim Commerce — Interactive Storefront & Stock-Locked Checkout     */
/* -------------------------------------------------------------------------- */
function SeraphimCommerceLive() {
  const [category, setCategory] = useState<'All' | 'Apparel' | 'Objects' | 'Editions'>('All');
  const [view, setView] = useState<'store' | 'checkout' | 'admin'>('store');
  const [stock, setStock] = useState<Record<string, number>>({
    'sc-1': 5,
    'sc-2': 3,
    'sc-3': 8,
    'sc-4': 2,
  });
  const [cart, setCart] = useState<Record<string, number>>({ 'sc-1': 1 });
  const [orderPlaced, setOrderPlaced] = useState<string | null>(null);

  const products = [
    { id: 'sc-1', name: 'Obsidian Wool Overcoat', cat: 'Apparel' as const, price: 240, sku: 'SR-014' },
    { id: 'sc-2', name: 'Monolith Ceramic Vessel', cat: 'Objects' as const, price: 85, sku: 'SR-029' },
    { id: 'sc-3', name: 'Editorial Grid Monograph', cat: 'Editions' as const, price: 48, sku: 'SR-042' },
    { id: 'sc-4', name: 'Brushed Steel Desk Lamp', cat: 'Objects' as const, price: 165, sku: 'SR-058' },
  ];

  const visibleProducts =
    category === 'All' ? products : products.filter((p) => p.cat === category);

  const totalItems = Object.values(cart).reduce((sum, q) => sum + q, 0);
  const subtotal = products.reduce((sum, p) => sum + (cart[p.id] ?? 0) * p.price, 0);

  const addToCart = (id: string) => {
    if ((stock[id] ?? 0) <= 0) return;
    setOrderPlaced(null);
    setStock((prev) => ({ ...prev, [id]: prev[id] - 1 }));
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    if ((cart[id] ?? 0) <= 0) return;
    setCart((prev) => {
      const next = { ...prev, [id]: prev[id] - 1 };
      if (next[id] <= 0) delete next[id];
      return next;
    });
    setStock((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const completeCheckout = () => {
    if (totalItems === 0) return;
    setOrderPlaced(`#SC-${Math.floor(1000 + Math.random() * 9000)}`);
    setCart({});
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-3 dark:border-white/10">
        <div className="flex items-center gap-2">
          <span className="font-display text-sm font-bold tracking-tight">SERAPHIM ATELIER</span>
          <span className="rounded-full bg-[#880021]/10 px-2 py-0.5 text-[11px] font-semibold text-[#880021] dark:bg-[#d43b5c]/15 dark:text-[#d43b5c]">
            Live Stock Lock
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {(['store', 'checkout', 'admin'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setView(tab)}
              className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
                view === tab
                  ? 'bg-[#880021] text-white dark:bg-[#d43b5c]'
                  : 'bg-black/5 text-black/70 hover:bg-black/10 dark:bg-white/10 dark:text-white/75'
              }`}
            >
              {tab === 'checkout' ? `Bag (${totalItems})` : tab === 'admin' ? 'Inventory' : 'Storefront'}
            </button>
          ))}
        </div>
      </div>

      {view === 'store' && (
        <>
          <div className="flex flex-wrap gap-1.5">
            {(['All', 'Apparel', 'Objects', 'Editions'] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`cursor-pointer rounded-full px-3 py-1 text-xs transition-colors ${
                  category === c
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'border border-black/15 text-black/70 dark:border-white/15 dark:text-white/70'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {visibleProducts.map((p) => {
              const remaining = stock[p.id] ?? 0;
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-black/[0.02] p-3.5 dark:border-white/12 dark:bg-white/[0.03]"
                >
                  <div>
                    <p className="text-[11px] font-medium text-black/50 dark:text-white/50">
                      {p.sku} · {p.cat}
                    </p>
                    <p className="font-display text-sm font-semibold">{p.name}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs">
                      <span className="font-bold text-[#880021] dark:text-[#d43b5c]">${p.price}</span>
                      <span className={remaining === 0 ? 'text-red-500' : 'text-black/55 dark:text-white/55'}>
                        {remaining === 0 ? 'Out of stock' : `${remaining} in stock`}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={remaining === 0}
                    onClick={() => addToCart(p.id)}
                    className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full bg-[#880021] px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#d43b5c]"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Add
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {view === 'checkout' && (
        <div className="space-y-3 rounded-xl border border-black/10 p-4 dark:border-white/12">
          {orderPlaced ? (
            <div className="flex flex-col items-center py-6 text-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              <p className="mt-2 font-display text-base font-bold">Order Confirmed ({orderPlaced})</p>
              <p className="mt-1 text-xs text-black/60 dark:text-white/60">
                MySQL inventory rows committed with transactional stock lock.
              </p>
            </div>
          ) : totalItems === 0 ? (
            <p className="py-6 text-center text-xs text-black/60 dark:text-white/60">
              Your bag is empty. Add items from the Storefront tab.
            </p>
          ) : (
            <>
              {products
                .filter((p) => (cart[p.id] ?? 0) > 0)
                .map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-black/55 dark:text-white/55">
                        Qty: {cart[p.id]} × ${p.price}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">${(cart[p.id] ?? 0) * p.price}</span>
                      <button
                        type="button"
                        onClick={() => removeFromCart(p.id)}
                        className="cursor-pointer rounded-full border border-black/15 px-2 py-0.5 text-xs hover:border-red-500 hover:text-red-500 dark:border-white/20"
                      >
                        −1
                      </button>
                    </div>
                  </div>
                ))}
              <div className="flex items-center justify-between border-t border-black/10 pt-3 dark:border-white/10">
                <span className="text-sm font-bold">Total: ${subtotal}</span>
                <button
                  type="button"
                  onClick={completeCheckout}
                  className="cursor-pointer rounded-full bg-[#880021] px-4 py-1.5 text-xs font-semibold text-white dark:bg-[#d43b5c]"
                >
                  Place Order
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {view === 'admin' && (
        <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/12">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/[0.04] dark:bg-white/[0.05]">
              <tr>
                <th className="px-3 py-2">SKU</th>
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Available</th>
                <th className="px-3 py-2">Restock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-black/10 dark:border-white/10">
                  <td className="px-3 py-2 font-mono">{p.sku}</td>
                  <td className="px-3 py-2 font-medium">{p.name}</td>
                  <td className="px-3 py-2 tabular-nums">{stock[p.id]} units</td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => setStock((prev) => ({ ...prev, [p.id]: prev[p.id] + 5 }))}
                      className="cursor-pointer rounded-full border border-black/15 px-2.5 py-0.5 hover:border-[#880021] dark:border-white/20"
                    >
                      +5 Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 02. Nexus Operations Suite — Role-Based Billing & Milestone Portal         */
/* -------------------------------------------------------------------------- */
function NexusOperationsLive() {
  const [role, setRole] = useState<'Finance Lead' | 'Ops Manager' | 'Client'>('Finance Lead');
  const [invoices, setInvoices] = useState([
    { id: 'INV-881', client: 'Kestrel Logistics', milestone: 'API Gateway v2', amount: 4200, status: 'Paid' as 'Paid' | 'Pending' },
    { id: 'INV-882', client: 'Verve Health', milestone: 'RBAC Auth Audit', amount: 2850, status: 'Pending' as 'Paid' | 'Pending' },
    { id: 'INV-883', client: 'Solstice Studio', milestone: 'CMS Migration', amount: 1950, status: 'Pending' as 'Paid' | 'Pending' },
  ]);
  const [newMilestone, setNewMilestone] = useState('');
  const [newAmount, setNewAmount] = useState('1500');

  const toggleStatus = (id: string) => {
    if (role === 'Client') return;
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, status: inv.status === 'Paid' ? 'Pending' : 'Paid' } : inv
      )
    );
  };

  const addInvoice = () => {
    if (!newMilestone.trim() || role !== 'Finance Lead') return;
    const amt = Math.max(100, Number(newAmount) || 1200);
    setInvoices((prev) => [
      {
        id: `INV-${884 + prev.length}`,
        client: 'Enterprise Partner',
        milestone: newMilestone.trim(),
        amount: amt,
        status: 'Pending',
      },
      ...prev,
    ]);
    setNewMilestone('');
  };

  const totalPaid = invoices.filter((i) => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 pb-3 dark:border-white/10">
        <div className="flex items-center gap-2 text-xs">
          <Shield className="h-4 w-4 text-[#880021] dark:text-[#d43b5c]" />
          <span className="font-semibold">Active Role:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(['Finance Lead', 'Ops Manager', 'Client'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition ${
                role === r
                  ? 'bg-[#880021] text-white dark:bg-[#d43b5c]'
                  : 'bg-black/5 text-black/70 dark:bg-white/10 dark:text-white/75'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5 text-xs">
        <div className="rounded-xl border border-black/10 p-3 dark:border-white/12">
          <p className="text-black/55 dark:text-white/55">Settled Revenue</p>
          <p className="mt-1 font-display text-lg font-bold text-emerald-600 dark:text-emerald-400">
            ${totalPaid.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-black/10 p-3 dark:border-white/12">
          <p className="text-black/55 dark:text-white/55">Permissions</p>
          <p className="mt-1 font-display text-sm font-bold">
            {role === 'Finance Lead' ? 'Full Write + Export' : role === 'Ops Manager' ? 'Approve Milestones' : 'Read-Only Portal'}
          </p>
        </div>
        <div className="rounded-xl border border-black/10 p-3 dark:border-white/12">
          <p className="text-black/55 dark:text-white/55">Active Invoices</p>
          <p className="mt-1 font-display text-lg font-bold">{invoices.length}</p>
        </div>
      </div>

      {role === 'Finance Lead' && (
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            value={newMilestone}
            onChange={(e) => setNewMilestone(e.target.value)}
            placeholder="New billing milestone..."
            className="glass-input min-w-[160px] flex-1 rounded-full px-3 py-1.5 text-xs"
          />
          <input
            type="number"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            className="glass-input w-24 rounded-full px-3 py-1.5 text-xs"
          />
          <button
            type="button"
            onClick={addInvoice}
            className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-[#880021] px-3.5 py-1.5 text-xs font-semibold text-white dark:bg-[#d43b5c]"
          >
            <Plus className="h-3.5 w-3.5" /> Issue
          </button>
        </div>
      )}

      <div className="space-y-2">
        {invoices.map((inv) => (
          <div
            key={inv.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-black/10 px-3.5 py-2.5 text-xs dark:border-white/12"
          >
            <div>
              <p className="font-semibold">
                <span className="font-mono text-[#880021] dark:text-[#d43b5c]">{inv.id}</span> · {inv.milestone}
              </p>
              <p className="text-black/55 dark:text-white/55">{inv.client}</p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="font-bold tabular-nums">${inv.amount.toLocaleString()}</span>
              <button
                type="button"
                disabled={role === 'Client'}
                onClick={() => toggleStatus(inv.id)}
                title={role === 'Client' ? 'Client role is read-only' : 'Toggle payment status'}
                className={`cursor-pointer rounded-full px-2.5 py-1 text-[11px] font-semibold disabled:cursor-not-allowed ${
                  inv.status === 'Paid'
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                    : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                }`}
              >
                {inv.status}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 03. Aura Editorial CMS — Live Manuscript Editor & Draft Snapshots          */
/* -------------------------------------------------------------------------- */
function AuraCmsLive() {
  const [title, setTitle] = useState('Designing Resilient Monoliths');
  const [body, setBody] = useState(
    'Thoughtful architecture balances server-rendered clarity with fast static edge caching. Every manuscript snapshot stays indexed for instant rollback.'
  );
  const [snapshots, setSnapshots] = useState([
    { id: 'v1.2', label: 'Published · 10:15 AM', title: 'Designing Resilient Monoliths', body: 'Thoughtful architecture balances server-rendered clarity with fast static edge caching.' },
  ]);
  const [tab, setTab] = useState<'split' | 'media'>('split');

  const saveSnapshot = () => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSnapshots((prev) => [
      { id: `v1.${prev.length + 2}`, label: `Snapshot · ${time}`, title, body },
      ...prev,
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 pb-3 dark:border-white/10">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#880021] dark:text-[#d43b5c]" />
          <span className="text-xs font-semibold">Manuscript Studio</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTab(tab === 'split' ? 'media' : 'split')}
            className="cursor-pointer rounded-full border border-black/15 px-3 py-1 text-xs dark:border-white/20"
          >
            {tab === 'split' ? 'Media Library' : 'Back to Editor'}
          </button>
          <button
            type="button"
            onClick={saveSnapshot}
            className="cursor-pointer rounded-full bg-[#880021] px-3 py-1 text-xs font-semibold text-white dark:bg-[#d43b5c]"
          >
            Save Draft Snapshot
          </button>
        </div>
      </div>

      {tab === 'split' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2.5">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-black/55 dark:text-white/55">
              Headline
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="glass-input w-full rounded-xl px-3 py-2 text-xs"
            />
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-black/55 dark:text-white/55">
              Manuscript Body
            </label>
            <textarea
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="glass-input w-full rounded-xl px-3 py-2 text-xs leading-relaxed"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {snapshots.map((snap) => (
                <button
                  key={snap.id}
                  type="button"
                  onClick={() => {
                    setTitle(snap.title);
                    setBody(snap.body);
                  }}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-black/5 px-2.5 py-1 text-[11px] hover:bg-black/10 dark:bg-white/10"
                >
                  <RotateCcw className="h-3 w-3" /> {snap.id} ({snap.label})
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/12 dark:bg-white/[0.03]">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#880021] dark:text-[#d43b5c]">
              Live Static-Cached Preview
            </p>
            <h4 className="mt-2 font-serif text-2xl font-bold italic leading-tight">{title || 'Untitled Draft'}</h4>
            <p className="mt-3 text-xs leading-relaxed text-black/75 dark:text-white/75">{body}</p>
            <p className="mt-4 text-[11px] text-black/45 dark:text-white/45">
              Word count: {body.trim() ? body.trim().split(/\s+/).length : 0} · Route cached in 14ms
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 text-xs">
          {[
            { name: 'hero-atelier.webp', size: '142 KB', dim: '1600×900' },
            { name: 'studio-desk.webp', size: '98 KB', dim: '1200×800' },
            { name: 'editorial-type.webp', size: '76 KB', dim: '1080×1080' },
          ].map((asset) => (
            <button
              key={asset.name}
              type="button"
              onClick={() => {
                setBody((b) => `${b}\n[Embedded Media: ${asset.name} (${asset.dim})]`);
                setTab('split');
              }}
              className="cursor-pointer rounded-xl border border-black/10 p-3 text-left transition hover:border-[#880021] dark:border-white/12 dark:hover:border-[#d43b5c]"
            >
              <p className="font-semibold">{asset.name}</p>
              <p className="mt-1 text-black/55 dark:text-white/55">
                {asset.dim} · {asset.size}
              </p>
              <span className="mt-2 inline-block text-[11px] font-semibold text-[#880021] dark:text-[#d43b5c]">
                + Insert into article
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 04. Pulse Booking Directory — Conflict-Free Slot Scheduler                 */
/* -------------------------------------------------------------------------- */
function PulseSchedulerLive() {
  const [specialist, setSpecialist] = useState('Dr. Tariq — System Architecture');
  const [bookedSlots, setBookedSlots] = useState<string[]>(['10:30 AM', '02:00 PM']);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [clientName, setClientName] = useState('');
  const [bookings, setBookings] = useState([
    { slot: '10:30 AM', name: 'Amina Raza', specialist: 'Dr. Tariq — System Architecture' },
    { slot: '02:00 PM', name: 'Faisal Khan', specialist: 'Dr. Tariq — System Architecture' },
  ]);

  const allSlots = ['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '03:30 PM', '05:00 PM'];

  const confirmBooking = () => {
    if (!selectedSlot || !clientName.trim()) return;
    if (bookedSlots.includes(selectedSlot)) return;
    setBookedSlots((prev) => [...prev, selectedSlot]);
    setBookings((prev) => [...prev, { slot: selectedSlot, name: clientName.trim(), specialist }]);
    setSelectedSlot(null);
    setClientName('');
  };

  const cancelBooking = (slot: string) => {
    setBookedSlots((prev) => prev.filter((s) => s !== slot));
    setBookings((prev) => prev.filter((b) => b.slot !== slot));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 pb-3 dark:border-white/10">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <Calendar className="h-4 w-4 text-[#880021] dark:text-[#d43b5c]" />
          Conflict-Free Slot Engine
        </div>
        <select
          value={specialist}
          onChange={(e) => setSpecialist(e.target.value)}
          className="glass-input rounded-full px-3 py-1 text-xs"
        >
          <option>Dr. Tariq — System Architecture</option>
          <option>Sana Malik — Product Strategy</option>
          <option>Hamza Ali — Security Audit</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {allSlots.map((slot) => {
          const isBooked = bookedSlots.includes(slot);
          const isPicked = selectedSlot === slot;
          return (
            <button
              key={slot}
              type="button"
              disabled={isBooked}
              onClick={() => setSelectedSlot(slot)}
              className={`cursor-pointer rounded-xl border px-2 py-2 text-xs font-medium transition ${
                isBooked
                  ? 'cursor-not-allowed border-black/10 bg-black/5 text-black/35 line-through dark:border-white/10 dark:bg-white/5 dark:text-white/30'
                  : isPicked
                  ? 'border-[#880021] bg-[#880021] text-white dark:border-[#d43b5c] dark:bg-[#d43b5c]'
                  : 'border-black/15 hover:border-[#880021] dark:border-white/15 dark:hover:border-[#d43b5c]'
              }`}
            >
              {slot}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder={selectedSlot ? `Client name for ${selectedSlot}...` : 'Select an available time slot above'}
          className="glass-input min-w-[180px] flex-1 rounded-full px-3.5 py-1.5 text-xs"
        />
        <button
          type="button"
          disabled={!selectedSlot || !clientName.trim()}
          onClick={confirmBooking}
          className="cursor-pointer rounded-full bg-[#880021] px-4 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#d43b5c]"
        >
          Reserve Slot
        </button>
      </div>

      <div className="space-y-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-black/55 dark:text-white/55">
          Confirmed Schedule ({bookings.length})
        </p>
        {bookings.map((b) => (
          <div
            key={b.slot}
            className="flex items-center justify-between rounded-xl border border-black/10 px-3 py-2 text-xs dark:border-white/12"
          >
            <span>
              <strong className="text-[#880021] dark:text-[#d43b5c]">{b.slot}</strong> · {b.name}
            </span>
            <button
              type="button"
              onClick={() => cancelBooking(b.slot)}
              className="cursor-pointer text-[11px] text-black/55 hover:text-red-500 dark:text-white/55"
            >
              Release
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 05. Vespera Inventory Cloud — Multi-Warehouse Stock & Transfer Ledger      */
/* -------------------------------------------------------------------------- */
function VesperaInventoryLive() {
  const [skus, setSkus] = useState([
    { code: 'SKU-401', name: 'Thermal Label Rolls', karachi: 42, lahore: 12, threshold: 15 },
    { code: 'SKU-409', name: 'Barcode Handheld Unit', karachi: 18, lahore: 26, threshold: 10 },
    { code: 'SKU-415', name: 'RFID Pallet Tags (100x)', karachi: 9, lahore: 31, threshold: 15 },
  ]);
  const [selectedCode, setSelectedCode] = useState('SKU-401');
  const [qty, setQty] = useState(5);
  const [logs, setLogs] = useState<string[]>([
    'Batch #TR-902: Transferred 10× SKU-409 from Karachi → Lahore',
  ]);

  const transferKarachiToLahore = () => {
    const target = skus.find((s) => s.code === selectedCode);
    if (!target || target.karachi < qty || qty <= 0) return;
    setSkus((prev) =>
      prev.map((s) =>
        s.code === selectedCode
          ? { ...s, karachi: s.karachi - qty, lahore: s.lahore + qty }
          : s
      )
    );
    setLogs((prev) => [
      `Batch #TR-${903 + prev.length}: Transferred ${qty}× ${selectedCode} (Karachi → Lahore)`,
      ...prev.slice(0, 3),
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 pb-3 dark:border-white/10">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <Package className="h-4 w-4 text-[#880021] dark:text-[#d43b5c]" />
          Atomic Inter-Warehouse Transfer
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCode}
            onChange={(e) => setSelectedCode(e.target.value)}
            className="glass-input rounded-full px-3 py-1 text-xs"
          >
            {skus.map((s) => (
              <option key={s.code} value={s.code}>
                {s.code}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            max={20}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            className="glass-input w-16 rounded-full px-2.5 py-1 text-xs"
          />
          <button
            type="button"
            onClick={transferKarachiToLahore}
            className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-[#880021] px-3 py-1 text-xs font-semibold text-white dark:bg-[#d43b5c]"
          >
            Karachi <ArrowRight className="h-3 w-3" /> Lahore
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {skus.map((s) => {
          const lowK = s.karachi < s.threshold;
          const lowL = s.lahore < s.threshold;
          return (
            <div
              key={s.code}
              className="grid grid-cols-1 items-center gap-2 rounded-xl border border-black/10 p-3 text-xs dark:border-white/12 sm:grid-cols-4"
            >
              <div>
                <p className="font-mono font-bold text-[#880021] dark:text-[#d43b5c]">{s.code}</p>
                <p className="font-medium">{s.name}</p>
              </div>
              <div>
                <span className="text-black/55 dark:text-white/55">Karachi: </span>
                <strong>{s.karachi}</strong>
                {lowK && <span className="ml-1.5 text-[10px] font-bold text-amber-500">LOW</span>}
              </div>
              <div>
                <span className="text-black/55 dark:text-white/55">Lahore: </span>
                <strong>{s.lahore}</strong>
                {lowL && <span className="ml-1.5 text-[10px] font-bold text-amber-500">LOW</span>}
              </div>
              <div className="text-black/55 dark:text-white/55">Threshold: {s.threshold}</div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl bg-black/[0.03] p-3 text-[11px] dark:bg-white/[0.04]">
        <p className="mb-1 font-semibold uppercase tracking-wider text-black/50 dark:text-white/50">
          SQL Transfer Audit Log
        </p>
        {logs.map((log, i) => (
          <p key={i} className="font-mono text-black/75 dark:text-white/75">
            • {log}
          </p>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 06. Kinetix Client Portal — SLA Ticketing & Escalation Workspace           */
/* -------------------------------------------------------------------------- */
function KinetixPortalLive() {
  const [tickets, setTickets] = useState([
    {
      id: 'TK-410',
      subject: 'Webhook signature timeout on EU node',
      priority: 'Critical',
      slaMinutes: 18,
      status: 'Open' as 'Open' | 'Resolved',
      messages: ['Client: Seeing intermittent 504s on /hooks/stripe.', 'Engineer: Inspecting connection pool limits.'],
    },
    {
      id: 'TK-411',
      subject: 'Export monthly SLA PDF compliance summary',
      priority: 'Normal',
      slaMinutes: 94,
      status: 'Open' as 'Open' | 'Resolved',
      messages: ['Client: Need Q1 PDF export enabled for audit role.'],
    },
  ]);
  const [activeId, setActiveId] = useState('TK-410');
  const [reply, setReply] = useState('');

  const activeTicket = tickets.find((t) => t.id === activeId) ?? tickets[0];

  const sendReply = () => {
    if (!reply.trim()) return;
    setTickets((prev) =>
      prev.map((t) =>
        t.id === activeTicket.id
          ? { ...t, messages: [...t.messages, `You: ${reply.trim()}`] }
          : t
      )
    );
    setReply('');
  };

  const toggleResolve = (id: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === 'Open' ? 'Resolved' : 'Open' } : t
      )
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
      <div className="space-y-2 md:col-span-2">
        {tickets.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveId(t.id)}
            className={`w-full cursor-pointer rounded-xl border p-3 text-left text-xs transition ${
              activeTicket.id === t.id
                ? 'border-[#880021] bg-[#880021]/8 dark:border-[#d43b5c] dark:bg-[#d43b5c]/12'
                : 'border-black/10 dark:border-white/12'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-[#880021] dark:text-[#d43b5c]">{t.id}</span>
              <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400">
                <Clock className="h-3 w-3" /> {t.slaMinutes}m SLA
              </span>
            </div>
            <p className="mt-1 font-semibold">{t.subject}</p>
            <span className="mt-1.5 inline-block text-[11px] text-black/55 dark:text-white/55">
              {t.priority} · {t.status}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col justify-between rounded-xl border border-black/10 p-3.5 text-xs dark:border-white/12 md:col-span-3">
        <div>
          <div className="flex items-center justify-between gap-2 border-b border-black/10 pb-2.5 dark:border-white/10">
            <span className="font-semibold">{activeTicket.subject}</span>
            <button
              type="button"
              onClick={() => toggleResolve(activeTicket.id)}
              className="cursor-pointer rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300"
            >
              {activeTicket.status === 'Open' ? 'Mark Resolved' : 'Reopen'}
            </button>
          </div>
          <div className="my-3 max-h-32 space-y-2 overflow-y-auto">
            {activeTicket.messages.map((m, idx) => (
              <div key={idx} className="rounded-lg bg-black/[0.04] px-3 py-2 dark:bg-white/[0.05]">
                {m}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write resolution update..."
            className="glass-input flex-1 rounded-full px-3 py-1.5 text-xs"
          />
          <button
            type="button"
            onClick={sendReply}
            className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-[#880021] px-3 py-1.5 font-semibold text-white dark:bg-[#d43b5c]"
          >
            <Send className="h-3 w-3" /> Send
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 07. Solstice Lookbook — CSS Grid & Editorial Exhibition Showcase           */
/* -------------------------------------------------------------------------- */
function SolsticeLookbookLive() {
  const [layout, setLayout] = useState<'asymmetric' | 'columns'>('asymmetric');
  const [filter, setFilter] = useState<'All' | 'Pavilion' | 'Brutalist'>('All');
  const [selectedPlate, setSelectedPlate] = useState('Plate 01 · Glass Courtyard');

  const plates = [
    { id: 'Plate 01 · Glass Courtyard', cat: 'Pavilion', year: '2026', city: 'Kyoto', span: 'sm:col-span-2' },
    { id: 'Plate 02 · Concrete Monolith', cat: 'Brutalist', year: '2025', city: 'Zurich', span: 'sm:col-span-1' },
    { id: 'Plate 03 · Travertine Hall', cat: 'Pavilion', year: '2026', city: 'Lisbon', span: 'sm:col-span-1' },
    { id: 'Plate 04 · Cantilever Terrace', cat: 'Brutalist', year: '2024', city: 'Oslo', span: 'sm:col-span-2' },
  ];

  const visible = filter === 'All' ? plates : plates.filter((p) => p.cat === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 pb-3 dark:border-white/10">
        <div className="flex gap-1.5">
          {(['All', 'Pavilion', 'Brutalist'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium ${
                filter === f
                  ? 'bg-[#880021] text-white dark:bg-[#d43b5c]'
                  : 'bg-black/5 text-black/70 dark:bg-white/10 dark:text-white/75'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setLayout(layout === 'asymmetric' ? 'columns' : 'asymmetric')}
          className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-black/15 px-3 py-1 text-xs dark:border-white/20"
        >
          <Layers className="h-3.5 w-3.5" />
          Grid: {layout === 'asymmetric' ? 'Asymmetric' : 'Uniform'}
        </button>
      </div>

      <div className={`grid gap-3 ${layout === 'asymmetric' ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
        {visible.map((plate) => (
          <button
            key={plate.id}
            type="button"
            onClick={() => setSelectedPlate(plate.id)}
            className={`cursor-pointer rounded-xl border p-4 text-left transition ${
              layout === 'asymmetric' ? plate.span : ''
            } ${
              selectedPlate === plate.id
                ? 'border-[#880021] bg-[#880021]/8 dark:border-[#d43b5c] dark:bg-[#d43b5c]/12'
                : 'border-black/10 bg-black/[0.02] dark:border-white/12 dark:bg-white/[0.03]'
            }`}
          >
            <p className="text-[11px] font-medium text-black/55 dark:text-white/55">
              {plate.cat} · {plate.city} · {plate.year}
            </p>
            <p className="mt-1 font-serif text-lg font-semibold italic">{plate.id}</p>
          </button>
        ))}
      </div>

      <p className="text-xs text-black/65 dark:text-white/65">
        Active Exhibition Plate: <strong className="text-[#880021] dark:text-[#d43b5c]">{selectedPlate}</strong>
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 08. Meridian Design System — Breakpoint Previewer & Scope Estimator        */
/* -------------------------------------------------------------------------- */
function MeridianSystemLive() {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [pages, setPages] = useState(5);
  const [features, setFeatures] = useState<Record<string, boolean>>({
    auth: true,
    cms: false,
    payments: true,
    analytics: false,
  });

  const featurePricing = [
    { key: 'auth', label: 'Role-Based Auth', price: 450, hrs: 12 },
    { key: 'cms', label: 'Custom CMS', price: 650, hrs: 18 },
    { key: 'payments', label: 'Checkout Gateway', price: 550, hrs: 14 },
    { key: 'analytics', label: 'Telemetry Charts', price: 400, hrs: 10 },
  ];

  const totalCost =
    pages * 140 +
    featurePricing.reduce((sum, f) => sum + (features[f.key] ? f.price : 0), 0);
  const totalHours =
    pages * 4 +
    featurePricing.reduce((sum, f) => sum + (features[f.key] ? f.hrs : 0), 0);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="space-y-3 rounded-xl border border-black/10 p-3.5 dark:border-white/12">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold">Bootstrap 12-Col Grid</span>
          <div className="flex gap-1">
            {([
              { id: 'desktop', Icon: Monitor },
              { id: 'tablet', Icon: Tablet },
              { id: 'mobile', Icon: Smartphone },
            ] as const).map(({ id, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setDevice(id)}
                className={`cursor-pointer rounded-full p-1.5 ${
                  device === id
                    ? 'bg-[#880021] text-white dark:bg-[#d43b5c]'
                    : 'bg-black/5 dark:bg-white/10'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        </div>

        <div
          className={`mx-auto grid gap-1.5 rounded-lg border border-dashed border-black/20 p-2.5 transition-all dark:border-white/20 ${
            device === 'desktop'
              ? 'w-full grid-cols-6'
              : device === 'tablet'
              ? 'w-4/5 grid-cols-4'
              : 'w-1/2 grid-cols-2'
          }`}
        >
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded bg-[#880021]/15 py-3 text-center text-[10px] font-bold text-[#880021] dark:bg-[#d43b5c]/20 dark:text-[#d43b5c]"
            >
              col-{idx + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-black/10 p-3.5 text-xs dark:border-white/12">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Live Scope Estimator</span>
          <span className="font-mono font-bold text-[#880021] dark:text-[#d43b5c]">
            ${totalCost.toLocaleString()} · {totalHours}h
          </span>
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-black/60 dark:text-white/60">
            <span>Responsive Pages</span>
            <span>{pages} pages</span>
          </div>
          <input
            type="range"
            min={1}
            max={15}
            value={pages}
            onChange={(e) => setPages(Number(e.target.value))}
            className="mt-1 w-full accent-[#880021] dark:accent-[#d43b5c]"
          />
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {featurePricing.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFeatures((prev) => ({ ...prev, [f.key]: !prev[f.key] }))}
              className={`flex cursor-pointer items-center justify-between rounded-lg border px-2.5 py-1.5 text-left text-[11px] ${
                features[f.key]
                  ? 'border-[#880021] bg-[#880021]/10 font-semibold dark:border-[#d43b5c] dark:bg-[#d43b5c]/15'
                  : 'border-black/10 dark:border-white/12'
              }`}
            >
              <span>{f.label}</span>
              {features[f.key] && <Check className="h-3 w-3 text-[#880021] dark:text-[#d43b5c]" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 09. Vanguard Finance Ledger — Double-Entry Accounting & Journal Form       */
/* -------------------------------------------------------------------------- */
function VanguardLedgerLive() {
  const [entries, setEntries] = useState([
    { id: 'JE-101', desc: 'Client Retainer Settlement', type: 'Income' as 'Income' | 'Expense', amount: 4500 },
    { id: 'JE-102', desc: 'Cloud MySQL Cluster Hosting', type: 'Expense' as 'Income' | 'Expense', amount: 640 },
    { id: 'JE-103', desc: 'Design System License', type: 'Income' as 'Income' | 'Expense', amount: 1850 },
  ]);
  const [desc, setDesc] = useState('');
  const [type, setType] = useState<'Income' | 'Expense'>('Income');
  const [amount, setAmount] = useState('950');

  const income = entries.filter((e) => e.type === 'Income').reduce((s, e) => s + e.amount, 0);
  const expense = entries.filter((e) => e.type === 'Expense').reduce((s, e) => s + e.amount, 0);
  const net = income - expense;

  const postEntry = () => {
    if (!desc.trim()) return;
    const val = Math.max(10, Number(amount) || 100);
    setEntries((prev) => [
      { id: `JE-${104 + prev.length}`, desc: desc.trim(), type, amount: val },
      ...prev,
    ]);
    setDesc('');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2.5 text-xs">
        <div className="rounded-xl border border-black/10 p-3 dark:border-white/12">
          <p className="text-black/55 dark:text-white/55">Total Income</p>
          <p className="mt-1 font-display text-base font-bold text-emerald-600 dark:text-emerald-400">
            +${income.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-black/10 p-3 dark:border-white/12">
          <p className="text-black/55 dark:text-white/55">Total Expenses</p>
          <p className="mt-1 font-display text-base font-bold text-rose-600 dark:text-rose-400">
            −${expense.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-black/10 p-3 dark:border-white/12">
          <p className="text-black/55 dark:text-white/55">Net Balance</p>
          <p className="mt-1 font-display text-base font-bold">${net.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Journal entry description..."
          className="glass-input min-w-[160px] flex-1 rounded-full px-3.5 py-1.5 text-xs"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'Income' | 'Expense')}
          className="glass-input rounded-full px-3 py-1.5 text-xs"
        >
          <option value="Income">Credit (Income)</option>
          <option value="Expense">Debit (Expense)</option>
        </select>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="glass-input w-24 rounded-full px-3 py-1.5 text-xs"
        />
        <button
          type="button"
          onClick={postEntry}
          className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-[#880021] px-3.5 py-1.5 text-xs font-semibold text-white dark:bg-[#d43b5c]"
        >
          <DollarSign className="h-3.5 w-3.5" /> Post Entry
        </button>
      </div>

      <div className="space-y-1.5">
        {entries.map((e) => (
          <div
            key={e.id}
            className="flex items-center justify-between rounded-xl border border-black/10 px-3.5 py-2 text-xs dark:border-white/12"
          >
            <span>
              <strong className="font-mono text-[#880021] dark:text-[#d43b5c]">{e.id}</strong> · {e.desc}
            </span>
            <span
              className={`font-bold tabular-nums ${
                e.type === 'Income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {e.type === 'Income' ? '+' : '−'}${e.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 10. Aegis Auth & Telemetry — Active JWT Sessions & Gateway Burst Tester    */
/* -------------------------------------------------------------------------- */
function AegisTelemetryLive() {
  const [sessions, setSessions] = useState([
    { id: 'sess-1', device: 'MacBook Pro · macOS', ip: '192.168.14.8', latency: '24ms' },
    { id: 'sess-2', device: 'iPhone 15 Pro · iOS 18', ip: '104.22.91.14', latency: '38ms' },
    { id: 'sess-3', device: 'Linux Worker · Docker', ip: '172.16.0.44', latency: '11ms' },
  ]);
  const [rps, setRps] = useState(1420);
  const [avgLatency, setAvgLatency] = useState(31);
  const [auditEvents, setAuditEvents] = useState<string[]>([
    '200 OK · GET /api/v1/sessions (18ms)',
  ]);

  const revokeSession = (id: string, device: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    setAuditEvents((prev) => [`REVOKED JWT · ${device} terminated`, ...prev.slice(0, 3)]);
  };

  const simulateBurst = () => {
    const nextRps = Math.floor(1800 + Math.random() * 1400);
    const nextLat = Math.floor(19 + Math.random() * 24);
    setRps(nextRps);
    setAvgLatency(nextLat);
    setAuditEvents((prev) => [
      `200 OK · Burst test (${nextRps} req/s · ${nextLat}ms avg)`,
      ...prev.slice(0, 3),
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 pb-3 dark:border-white/10">
        <div className="flex items-center gap-3 text-xs">
          <span>
            Throughput: <strong className="text-[#880021] dark:text-[#d43b5c]">{rps} rps</strong>
          </span>
          <span>
            Gateway Latency: <strong className="text-emerald-600 dark:text-emerald-400">{avgLatency}ms</strong>
          </span>
        </div>
        <button
          type="button"
          onClick={simulateBurst}
          className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-[#880021] px-3 py-1 text-xs font-semibold text-white dark:bg-[#d43b5c]"
        >
          <RefreshCw className="h-3 w-3" /> Simulate Traffic Burst
        </button>
      </div>

      <div className="space-y-2">
        {sessions.length === 0 ? (
          <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
            <AlertTriangle className="h-4 w-4" />
            All active JWT sessions revoked. Zero open tokens remaining.
          </div>
        ) : (
          sessions.map((s) => (
            <div
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-black/10 px-3.5 py-2.5 text-xs dark:border-white/12"
            >
              <div>
                <p className="font-semibold">{s.device}</p>
                <p className="font-mono text-[11px] text-black/55 dark:text-white/55">
                  IP {s.ip} · {s.latency}
                </p>
              </div>
              <button
                type="button"
                onClick={() => revokeSession(s.id, s.device)}
                className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-rose-500/35 px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-500/10 dark:text-rose-400"
              >
                <Trash2 className="h-3 w-3" /> Revoke
              </button>
            </div>
          ))
        )}
      </div>

      <div className="rounded-xl bg-black/[0.03] p-3 text-[11px] dark:bg-white/[0.04]">
        <p className="mb-1 font-semibold uppercase tracking-wider text-black/50 dark:text-white/50">
          Middleware Audit Stream
        </p>
        {auditEvents.map((ev, i) => (
          <p key={i} className="font-mono text-black/75 dark:text-white/75">
            • {ev}
          </p>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Live Experience Renderer + Browser Sandbox Modal                           */
/* -------------------------------------------------------------------------- */
function renderInteractiveExperience(projectId: string) {
  switch (projectId) {
    case 'seraphim-commerce':
      return <SeraphimCommerceLive />;
    case 'nexus-operations':
      return <NexusOperationsLive />;
    case 'aura-cms':
      return <AuraCmsLive />;
    case 'pulse-scheduler':
      return <PulseSchedulerLive />;
    case 'vespera-inventory':
      return <VesperaInventoryLive />;
    case 'kinetix-portal':
      return <KinetixPortalLive />;
    case 'solstice-lookbook':
      return <SolsticeLookbookLive />;
    case 'meridian-agency':
      return <MeridianSystemLive />;
    case 'vanguard-ledger':
      return <VanguardLedgerLive />;
    case 'aegis-telemetry':
      return <AegisTelemetryLive />;
    default:
      return null;
  }
}

export function ProjectLiveExperienceModal({
  project,
  onClose,
}: {
  project: LiveProjectMeta | null;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'interactive' | 'screens'>('interactive');
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);

  useEffect(() => {
    if (!project) return;
    setActiveTab('interactive');
    setSelectedSlideIndex(0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm sm:p-6"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="live-experience-title"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
            onClick={(e) => e.stopPropagation()}
            className="glass-surface relative max-h-[90dvh] w-full max-w-4xl overflow-y-auto overflow-x-hidden rounded-2xl p-5 text-[#000000] dark:text-[#ffffff] sm:p-7"
          >
            <GlassRefraction />

            {/* Modal Header */}
            <div className="relative z-10 mb-5 flex items-start justify-between gap-4 border-b border-black/15 pb-4 dark:border-white/20">
              <div>
                <div className="flex flex-wrap items-center gap-2 font-display text-xs text-black/60 dark:text-white/65">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-semibold text-emerald-700 dark:text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Live Interactive Preview
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-bold tabular-nums text-[#880021] dark:text-[#d43b5c]">
                    {project.index}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{project.category}</span>
                </div>
                <h3
                  id="live-experience-title"
                  className="mt-1.5 font-display text-2xl font-bold tracking-[-0.03em] sm:text-3xl"
                >
                  {project.title}
                </h3>
                <p className="mt-0.5 font-serif text-base italic text-[#880021] dark:text-[#d43b5c] sm:text-lg">
                  {project.subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close live experience"
                className="liquid-glass-btn inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] dark:focus-visible:ring-[#d43b5c]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Simulated Browser Chrome */}
            <div className="relative z-10 overflow-hidden rounded-xl border border-black/15 bg-white/85 shadow-sm dark:border-white/20 dark:bg-[#0b0b0e]/90">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 bg-black/[0.03] px-3.5 py-2.5 dark:border-white/12 dark:bg-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-black/10 bg-white/80 px-3 py-1 text-[11px] text-black/65 dark:border-white/15 dark:bg-black/40 dark:text-white/70">
                    <Lock className="h-3 w-3 text-emerald-500" />
                    <Globe className="h-3 w-3 opacity-60" />
                    <span className="font-mono">https://live.ashal.dev/{project.id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 rounded-full bg-black/5 p-0.5 dark:bg-white/10">
                  <button
                    type="button"
                    onClick={() => setActiveTab('interactive')}
                    className={`cursor-pointer rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                      activeTab === 'interactive'
                        ? 'bg-[#880021] text-white dark:bg-[#d43b5c]'
                        : 'text-black/70 dark:text-white/70'
                    }`}
                  >
                    Interactive Sandbox
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('screens')}
                    className={`cursor-pointer rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                      activeTab === 'screens'
                        ? 'bg-[#880021] text-white dark:bg-[#d43b5c]'
                        : 'text-black/70 dark:text-white/70'
                    }`}
                  >
                    Screens ({project.slides.length})
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                {activeTab === 'interactive' ? (
                  renderInteractiveExperience(project.id)
                ) : (
                  <div className="space-y-3">
                    <div className="aspect-video w-full overflow-hidden rounded-lg border border-black/10 bg-black dark:border-white/15">
                      {project.slides[selectedSlideIndex] && (
                        <img
                          src={project.slides[selectedSlideIndex].src}
                          alt={project.slides[selectedSlideIndex].alt}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-medium text-black/70 dark:text-white/75">
                        {project.slides[selectedSlideIndex]?.caption}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {project.slides.map((slide, idx) => (
                          <button
                            key={slide.caption}
                            type="button"
                            onClick={() => setSelectedSlideIndex(idx)}
                            className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition ${
                              selectedSlideIndex === idx
                                ? 'bg-[#880021] text-white dark:bg-[#d43b5c]'
                                : 'bg-black/5 text-black/70 dark:bg-white/10 dark:text-white/75'
                            }`}
                          >
                            0{idx + 1} · {slide.caption}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="relative z-10 mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-black/60 dark:text-white/60">
              <span>Built with: {project.stack}</span>
              <span>Click inside the sandbox above to test live features</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
