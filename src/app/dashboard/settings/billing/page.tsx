"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CreditCard, User2, Crown, Package, Truck, HardDrive, Activity, Download, ChevronDown, Check } from "lucide-react";
import { Modal } from "@/components/dashboard/Modal";
import { Field, TextInput, PrimaryButton, SecondaryButton } from "@/components/dashboard/FormControls";
import { useToast } from "@/components/dashboard/Toast";
import { api, exportToCsv } from "@/lib/client";
import { isEmail, isCardNumber, isExpiry, isCvc } from "@/lib/validate";

// Plan quotas (the denominators shown on each usage card). The numerators for
// Orders Processed and Shipments are computed from real /api endpoints below;
// Storage and API Requests have no backing data so they are shown as plan
// limits rather than invented usage figures.
const ORDERS_QUOTA = 5000;
const SHIPMENTS_QUOTA = 5000;
const STORAGE_QUOTA = 2000;
const API_QUOTA = 250000;

const invoices = [
  { id: "INV-2025-0518", date: "May 18, 2025", amount: "$299.00" },
  { id: "INV-2025-0418", date: "Apr 18, 2025", amount: "$299.00" },
  { id: "INV-2025-0318", date: "Mar 18, 2025", amount: "$299.00" },
  { id: "INV-2025-0218", date: "Feb 18, 2025", amount: "$299.00" },
  { id: "INV-2025-0118", date: "Jan 18, 2025", amount: "$299.00" },
  { id: "INV-2024-1218", date: "Dec 18, 2024", amount: "$299.00" },
  { id: "INV-2024-1118", date: "Nov 18, 2024", amount: "$299.00" },
  { id: "INV-2024-1018", date: "Oct 18, 2024", amount: "$299.00" },
  { id: "INV-2024-0918", date: "Sep 18, 2024", amount: "$199.00" },
  { id: "INV-2024-0818", date: "Aug 18, 2024", amount: "$199.00" },
  { id: "INV-2024-0718", date: "Jul 18, 2024", amount: "$199.00" },
  { id: "INV-2024-0618", date: "Jun 18, 2024", amount: "$199.00" },
];

const VISIBLE_INVOICES = 5;

const plans = [
  { name: "Starter", price: 99, blurb: "Up to 1,000 orders/month, 1 warehouse, email support." },
  { name: "Professional", price: 299, blurb: "Up to 5,000 orders/month, 5 warehouses, priority support." },
  { name: "Enterprise", price: 799, blurb: "Unlimited orders, unlimited warehouses, dedicated CSM." },
];

type PayErrors = { cardName?: string; cardNumber?: string; cardExpiry?: string; cardCvc?: string };

type CardSummary = { brand: string; last4: string; expires: string };
type BillingContact = { name: string; email: string; phone: string };
type BillingState = {
  currentPlan: string;
  cardSummary: CardSummary;
  contact: BillingContact;
  // KV fields seeded server-side; preserved through round-trips.
  plan?: string;
  seats?: number;
  billingCycle?: string;
  autoRenew?: boolean;
};

export default function BillingPage() {
  const { toast } = useToast();
  const [usagePeriod, setUsagePeriod] = useState("This Month");
  // Holds server-only KV fields so a partial PUT does not drop them.
  const extraRef = useRef<Partial<BillingState>>({});

  // Live usage counts pulled from the real orders/shipments endpoints; null
  // until loaded so the cards can show an honest "—" placeholder.
  const [ordersUsed, setOrdersUsed] = useState<number | null>(null);
  const [shipmentsUsed, setShipmentsUsed] = useState<number | null>(null);

  // Current plan / plan change modal
  const [currentPlan, setCurrentPlan] = useState("Professional");
  const [planOpen, setPlanOpen] = useState(false);
  const [planChoice, setPlanChoice] = useState(currentPlan);
  const currentPlanInfo = plans.find((p) => p.name === currentPlan) ?? plans[1];

  // Payment method modal
  const [payOpen, setPayOpen] = useState(false);
  const [cardName, setCardName] = useState("Sarah Johnson");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [payErrors, setPayErrors] = useState<PayErrors>({});
  const [cardSummary, setCardSummary] = useState({ brand: "Visa", last4: "4242", expires: "04/2027" });

  // Billing contact modal
  const [contactOpen, setContactOpen] = useState(false);
  const [contactName, setContactName] = useState("Sarah Johnson");
  const [contactEmail, setContactEmail] = useState("sarah.johnson@fulfillmesh.com");
  const [contactPhone, setContactPhone] = useState("+1 (555) 123-4567");
  const [contactErrors, setContactErrors] = useState<{ name?: string; email?: string }>({});
  const [contact, setContact] = useState({ name: "Sarah Johnson", email: "sarah.johnson@fulfillmesh.com", phone: "+1 (555) 123-4567" });

  // Invoice list expansion
  const [showAllInvoices, setShowAllInvoices] = useState(false);
  const visibleInvoices = showAllInvoices ? invoices : invoices.slice(0, VISIBLE_INVOICES);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const all = await api.get<Record<string, unknown>>("/api/settings");
        if (!alive) return;
        const section = all.billing as Partial<BillingState> | undefined;
        if (!section || typeof section !== "object") return;
        const { currentPlan: cp, cardSummary: cs, contact: c, ...rest } = section;
        extraRef.current = rest;
        if (typeof cp === "string" && plans.some((p) => p.name === cp)) setCurrentPlan(cp);
        if (cs && typeof cs === "object") setCardSummary({ brand: cs.brand ?? "Card", last4: cs.last4 ?? "", expires: cs.expires ?? "" });
        if (c && typeof c === "object") setContact({ name: c.name ?? "", email: c.email ?? "", phone: c.phone ?? "" });
      } catch {
        if (alive) toast("Failed to load billing settings", "error");
      }
    })();
    return () => { alive = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch real order and shipment counts so "Orders Processed" and "Shipments"
  // reflect the account's actual volume against the plan quota.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [ord, ship] = await Promise.all([
          api.get<{ total: number }>("/api/orders"),
          api.get<{ total: number }>("/api/shipments"),
        ]);
        if (!alive) return;
        setOrdersUsed(ord.total);
        setShipmentsUsed(ship.total);
      } catch {
        if (alive) toast("Failed to load usage data", "error");
      }
    })();
    return () => { alive = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Build the usage cards. Orders/Shipments use the real counts above; Storage
  // and API Requests have no backing data, so they are presented as the plan's
  // limits ("Plan limit") with no fake progress instead of invented usage.
  const usage = useMemo(() => {
    const ratio = (used: number, quota: number) => Math.min(100, Math.round((used / quota) * 100));
    return [
      {
        label: "Orders Processed",
        value: ordersUsed === null ? "—" : ordersUsed.toLocaleString(),
        of: `of ${ORDERS_QUOTA.toLocaleString()}`,
        pct: ordersUsed === null ? null : ratio(ordersUsed, ORDERS_QUOTA),
        icon: Package,
      },
      {
        label: "Shipments",
        value: shipmentsUsed === null ? "—" : shipmentsUsed.toLocaleString(),
        of: `of ${SHIPMENTS_QUOTA.toLocaleString()}`,
        pct: shipmentsUsed === null ? null : ratio(shipmentsUsed, SHIPMENTS_QUOTA),
        icon: Truck,
      },
      {
        label: "Storage Used",
        value: STORAGE_QUOTA.toLocaleString(),
        of: "units — plan limit",
        pct: null,
        icon: HardDrive,
      },
      {
        label: "API Requests",
        value: API_QUOTA.toLocaleString(),
        of: "requests / mo — plan limit",
        pct: null,
        icon: Activity,
      },
    ];
  }, [ordersUsed, shipmentsUsed]);

  // Persist the billing section, preserving any server-only KV fields.
  const persistBilling = (patch: Partial<BillingState>) => {
    const payload: BillingState = {
      currentPlan,
      cardSummary,
      contact,
      ...extraRef.current,
      ...patch,
    };
    api.put("/api/settings", { billing: payload }).catch(() => toast("Failed to save billing settings", "error"));
  };

  const handleSavePayment = () => {
    const errors: PayErrors = {};
    if (!cardName.trim()) errors.cardName = "Name on card is required";
    if (!cardNumber.trim()) errors.cardNumber = "Card number is required";
    else if (!isCardNumber(cardNumber)) errors.cardNumber = "Enter a valid card number (13-19 digits)";
    if (!cardExpiry.trim()) errors.cardExpiry = "Expiry is required";
    else if (!isExpiry(cardExpiry)) errors.cardExpiry = "Use MM/YY format with a future date";
    if (cardCvc.trim() && !isCvc(cardCvc)) errors.cardCvc = "CVC must be 3-4 digits";
    setPayErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast("Please fix the highlighted fields", "error");
      return;
    }
    const digits = cardNumber.replace(/[\s-]/g, "");
    const nextCard: CardSummary = {
      brand: digits.startsWith("4") ? "Visa" : digits.startsWith("5") ? "Mastercard" : "Card",
      last4: digits.slice(-4),
      expires: cardExpiry.trim(),
    };
    setCardSummary(nextCard);
    setPayOpen(false);
    setCardNumber("");
    setCardExpiry("");
    setCardCvc("");
    persistBilling({ cardSummary: nextCard });
    toast("Payment method updated");
  };

  const handleSaveContact = () => {
    const errors: { name?: string; email?: string } = {};
    if (!contactName.trim()) errors.name = "Name is required";
    if (!contactEmail.trim()) errors.email = "Email is required";
    else if (!isEmail(contactEmail)) errors.email = "Enter a valid email address";
    setContactErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast("Please fix the highlighted fields", "error");
      return;
    }
    const nextContact: BillingContact = { name: contactName.trim(), email: contactEmail.trim(), phone: contactPhone.trim() };
    setContact(nextContact);
    setContactOpen(false);
    persistBilling({ contact: nextContact });
    toast("Billing contact updated");
  };

  const handleChangePlan = () => {
    if (planChoice === currentPlan) {
      setPlanOpen(false);
      return;
    }
    setCurrentPlan(planChoice);
    setPlanOpen(false);
    persistBilling({ currentPlan: planChoice, plan: planChoice });
    toast(`Plan changed to ${planChoice}`);
  };

  const downloadInvoice = (id: string) => {
    const inv = invoices.find((i) => i.id === id);
    if (!inv) return;
    exportToCsv(`${id}.csv`, [inv], [
      { key: "id", header: "Invoice #" },
      { key: "date", header: "Issue Date" },
      { key: "amount", header: "Amount" },
    ]);
    toast(`Downloaded ${id}`);
  };

  const exportAll = () => {
    exportToCsv("invoices.csv", invoices, [
      { key: "id", header: "Invoice #" },
      { key: "date", header: "Issue Date" },
      { key: "amount", header: "Amount" },
    ]);
    toast(`Exported ${invoices.length} invoices to CSV`);
  };

  return (
    <div>
      <h2 className="text-[20px] font-semibold text-text-primary">Billing &amp; Subscription</h2>
      <p className="text-[14px] text-text-body mt-1">
        Manage your account and subscription settings
      </p>

      {/* Top 3 cards */}
      <div className="grid grid-cols-3 gap-5 mt-6">
        {/* Current Plan */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center gap-2 text-[14px] font-medium text-[#6B7280]">
            <Crown className="w-5 h-5 text-[#F59E0B]" />
            Current Plan
          </div>
          <p className="text-[18px] font-bold text-[#1F2937] mt-3">{currentPlanInfo.name}</p>
          <p className="text-[16px] font-semibold text-[#1F2937]">${currentPlanInfo.price} / month</p>
          <div className="border-t border-[#E5E7EB] mt-3 pt-3 space-y-2">
            <div className="flex items-center justify-between text-[14px]">
              <span className="text-[#6B7280]">Billing Cycle</span>
              <span className="text-[#1F2937] font-semibold">Monthly</span>
            </div>
            <div className="flex items-center justify-between text-[14px]">
              <span className="text-[#6B7280]">Renewal Date</span>
              <span className="text-[#1F2937] font-semibold">June 18, 2025</span>
            </div>
          </div>
          <button
            onClick={() => { setPlanChoice(currentPlan); setPlanOpen(true); }}
            className="w-full mt-4 py-2 text-[14px] font-medium text-[#374151] bg-[#F3F4F6] border border-[#D1D5DB] rounded-md hover:bg-[#E5E7EB] transition-colors"
          >
            View Plan
          </button>
        </div>

        {/* Payment Method */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center gap-2 text-[14px] font-medium text-[#6B7280]">
            <CreditCard className="w-5 h-5 text-[#4F46E5]" />
            Payment Method
          </div>
          <div className="flex items-center gap-3 mt-3">
            <div className="w-12 h-8 rounded bg-[#1E3A8A] flex items-center justify-center text-white text-[11px] font-bold italic tracking-wide">
              {cardSummary.brand.toUpperCase().slice(0, 4)}
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#1F2937]">{cardSummary.brand} ending in {cardSummary.last4}</p>
              <p className="text-[13px] text-[#6B7280]">Expires {cardSummary.expires}</p>
            </div>
          </div>
          <button
            onClick={() => setPayOpen(true)}
            className="w-full mt-[52px] py-2 text-[14px] font-medium text-white bg-[#3B82F6] rounded-md hover:bg-[#2563EB] transition-colors"
          >
            Update Payment Method
          </button>
        </div>

        {/* Billing Contact */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center gap-2 text-[14px] font-medium text-[#6B7280]">
            <User2 className="w-5 h-5 text-[#10B981]" />
            Billing Contact
          </div>
          <div className="mt-3 text-[14px] leading-[20px]">
            <p className="font-semibold text-[#1F2937]">{contact.name}</p>
            <p className="text-[#6B7280]">{contact.email}</p>
            <p className="text-[#6B7280]">{contact.phone}</p>
            <p className="font-semibold text-[#1F2937] mt-2">FulfillMesh Co.</p>
            <p className="text-[#6B7280]">123 Logistics Way</p>
            <p className="text-[#6B7280]">Suite 400</p>
            <p className="text-[#6B7280]">Austin, TX 78701</p>
            <p className="text-[#6B7280]">United States</p>
          </div>
          <button
            onClick={() => {
              setContactName(contact.name);
              setContactEmail(contact.email);
              setContactPhone(contact.phone);
              setContactErrors({});
              setContactOpen(true);
            }}
            className="w-full mt-3 py-2 text-[14px] font-medium text-[#374151] bg-[#F3F4F6] border border-[#D1D5DB] rounded-md hover:bg-[#E5E7EB] transition-colors"
          >
            Edit Contact
          </button>
        </div>
      </div>

      {/* Usage Overview */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-semibold text-[#1F2937]">Usage Overview</h3>
          <div className="relative">
            <select
              value={usagePeriod}
              onChange={(e) => setUsagePeriod(e.target.value)}
              aria-label="Usage period"
              className="appearance-none pl-3 pr-8 py-1.5 bg-[#F9FAFB] border border-[#D1D5DB] rounded-md text-[14px] text-[#6B7280] font-medium focus:outline-none focus:ring-2 focus:ring-action-blue/20 focus:border-action-blue"
            >
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4">
          {usage.map((u) => {
            const Icon = u.icon;
            return (
              <div key={u.label} className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#6B7280]">
                  <Icon className="w-5 h-5 text-[#6366F1]" />
                  {u.label}
                </div>
                <p className="text-[28px] font-bold text-[#1F2937] mt-2">{u.value}</p>
                <p className="text-[14px] text-[#6B7280]">{u.of}</p>
                {u.pct === null ? (
                  <div className="flex items-center gap-2 mt-3 h-[20px]">
                    <span className="text-[12px] font-medium text-[#9CA3AF]">Included in plan</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex-1 h-[6px] bg-[#E5E7EB] rounded-full overflow-hidden">
                      <div className="h-full bg-[#6366F1] rounded-full" style={{ width: `${u.pct}%` }} />
                    </div>
                    <span className="text-[14px] font-medium text-[#6B7280]">{u.pct}%</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoice History */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-semibold text-[#1F2937]">Invoice History</h3>
          <button
            onClick={exportAll}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#3B82F6] hover:text-[#2563EB] hover:underline"
          >
            <Download className="w-3.5 h-3.5" />
            Export all (CSV)
          </button>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <th className="text-left text-[14px] font-semibold text-[#374151] px-5 py-3">Invoice #</th>
                <th className="text-left text-[14px] font-semibold text-[#374151] px-5 py-3">Issue Date</th>
                <th className="text-left text-[14px] font-semibold text-[#374151] px-5 py-3">Amount</th>
                <th className="text-left text-[14px] font-semibold text-[#374151] px-5 py-3">Status</th>
                <th className="text-right text-[14px] font-semibold text-[#374151] px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleInvoices.map((inv) => (
                <tr key={inv.id} className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F9FAFB]/50 transition-colors">
                  <td className="px-5 py-3 text-[14px] font-medium text-[#1F2937] font-mono">{inv.id}</td>
                  <td className="px-5 py-3 text-[14px] text-[#6B7280]">{inv.date}</td>
                  <td className="px-5 py-3 text-[14px] font-medium text-[#1F2937]">{inv.amount}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex px-2 py-0.5 bg-[#10B981] text-white text-[12px] font-medium rounded">Paid</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => downloadInvoice(inv.id)}
                      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#3B82F6] hover:text-[#2563EB] hover:underline transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-center py-3 border-t border-[#E5E7EB]">
            <button
              onClick={() => setShowAllInvoices((v) => !v)}
              className="text-[14px] font-medium text-[#3B82F6] hover:text-[#2563EB] hover:underline"
            >
              {showAllInvoices
                ? "Show Recent Invoices"
                : `View All Invoices (${invoices.length}) →`}
            </button>
          </div>
        </div>
      </div>

      {/* Change Plan Modal */}
      <Modal
        open={planOpen}
        onClose={() => setPlanOpen(false)}
        title="Your Plan"
        description="Compare plans and switch at any time. Changes take effect on your next billing cycle."
        footer={
          <>
            <SecondaryButton onClick={() => setPlanOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={handleChangePlan} disabled={planChoice === currentPlan}>
              {planChoice === currentPlan ? "Current plan" : `Switch to ${planChoice}`}
            </PrimaryButton>
          </>
        }
      >
        <div className="space-y-3">
          {plans.map((p) => {
            const selected = planChoice === p.name;
            const isCurrent = currentPlan === p.name;
            return (
              <button
                key={p.name}
                onClick={() => setPlanChoice(p.name)}
                className={`w-full text-left rounded-lg border p-4 transition-colors ${
                  selected ? "border-[#3B82F6] bg-[#EFF6FF]" : "border-[#E5E7EB] hover:border-[#93C5FD]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold text-[#1F2937]">{p.name}</span>
                    {isCurrent && (
                      <span className="inline-flex px-2 py-0.5 bg-[#10B981]/10 text-[#10B981] text-[11px] font-medium rounded">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-[#1F2937]">${p.price}/mo</span>
                    {selected && <Check className="w-4 h-4 text-[#3B82F6]" />}
                  </div>
                </div>
                <p className="text-[12px] text-[#6B7280] mt-1">{p.blurb}</p>
              </button>
            );
          })}
        </div>
      </Modal>

      {/* Update Payment Method Modal */}
      <Modal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        title="Update Payment Method"
        description="Your card details are encrypted and stored securely."
        footer={
          <>
            <SecondaryButton onClick={() => setPayOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={handleSavePayment}>Save Card</PrimaryButton>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Name on card" required error={payErrors.cardName}>
              <TextInput
                value={cardName}
                onChange={(e) => { setCardName(e.target.value); setPayErrors((p) => ({ ...p, cardName: undefined })); }}
                placeholder="Sarah Johnson"
              />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="Card number" required error={payErrors.cardNumber}>
              <TextInput
                value={cardNumber}
                onChange={(e) => { setCardNumber(e.target.value); setPayErrors((p) => ({ ...p, cardNumber: undefined })); }}
                placeholder="4242 4242 4242 4242"
                inputMode="numeric"
              />
            </Field>
          </div>
          <Field label="Expiry" required error={payErrors.cardExpiry}>
            <TextInput
              value={cardExpiry}
              onChange={(e) => { setCardExpiry(e.target.value); setPayErrors((p) => ({ ...p, cardExpiry: undefined })); }}
              placeholder="MM/YY"
            />
          </Field>
          <Field label="CVC" error={payErrors.cardCvc}>
            <TextInput
              value={cardCvc}
              onChange={(e) => { setCardCvc(e.target.value); setPayErrors((p) => ({ ...p, cardCvc: undefined })); }}
              placeholder="123"
              inputMode="numeric"
            />
          </Field>
        </div>
      </Modal>

      {/* Edit Billing Contact Modal */}
      <Modal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        title="Edit Billing Contact"
        footer={
          <>
            <SecondaryButton onClick={() => setContactOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={handleSaveContact}>Save Contact</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Full name" required error={contactErrors.name}>
            <TextInput
              value={contactName}
              onChange={(e) => { setContactName(e.target.value); setContactErrors((p) => ({ ...p, name: undefined })); }}
            />
          </Field>
          <Field label="Email" required error={contactErrors.email}>
            <TextInput
              type="email"
              value={contactEmail}
              onChange={(e) => { setContactEmail(e.target.value); setContactErrors((p) => ({ ...p, email: undefined })); }}
            />
          </Field>
          <Field label="Phone">
            <TextInput value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
