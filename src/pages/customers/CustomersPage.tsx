import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  ShoppingBag, 
  Crown, 
  Edit2, 
  Trash2, 
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { Customer } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

export const CustomersPage: React.FC = () => {
  const { currentBusiness, customers, orders, addCustomer, updateCustomer, deleteCustomer } = useBusiness();

  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const currency = currentBusiness?.currency_symbol || '$';

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.phone && c.phone.includes(searchTerm))
  );

  const openAddModal = () => {
    setEditingCustomer(null);
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setNotes('');
    setModalOpen(true);
  };

  const openEditModal = (c: Customer) => {
    setEditingCustomer(c);
    setName(c.name);
    setEmail(c.email || '');
    setPhone(c.phone || '');
    setAddress(c.address || '');
    setNotes(c.notes || '');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, {
          name,
          email: email || undefined,
          phone: phone || undefined,
          address: address || undefined,
          notes: notes || undefined,
        });
      } else {
        await addCustomer({
          name,
          email: email || undefined,
          phone: phone || undefined,
          address: address || undefined,
          notes: notes || undefined,
        });
      }
      setSubmitting(false);
      setModalOpen(false);
    } catch (e) {
      console.error(e);
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove customer "${name}"?`)) {
      await deleteCustomer(id);
    }
  };

  // Orders associated with currently viewed customer
  const customerOrders = viewCustomer 
    ? orders.filter(o => o.customer_id === viewCustomer.id || o.customer_name === viewCustomer.name)
    : [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream-50">
            Customer CRM
          </h2>
          <p className="text-xs text-blush-200/70">
            Nurture relationships, track lifetime client spend, and reward repeat buyers
          </p>
        </div>

        <Button
          size="md"
          variant="primary"
          onClick={openAddModal}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Customer
        </Button>
      </div>

      {/* Search Bar */}
      <Card variant="subtle" className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search by client name, email, or phone..."
            leftIcon={<Search className="w-4 h-4" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="text-xs text-blush-300/80">
          Total Registered Clients: <span className="font-bold text-white">{customers.length}</span>
        </div>
      </Card>

      {/* Customer List */}
      {filteredCustomers.length === 0 ? (
        <Card variant="default" className="text-center py-16 space-y-4">
          <Users className="w-12 h-12 text-blush-400/60 mx-auto" />
          <h4 className="text-lg font-serif font-bold text-cream-50">No customers found</h4>
          <p className="text-xs text-blush-200/70 max-w-sm mx-auto">
            {searchTerm 
              ? 'No clients matched your search query.' 
              : 'Add your clients or record a sale to automatically track customer purchase history.'}
          </p>
          <Button size="md" variant="primary" onClick={openAddModal} icon={<Plus className="w-4 h-4" />}>
            Add First Customer
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((c) => {
            const isVip = c.total_orders > 1;

            return (
              <Card key={c.id} variant="default" className="flex flex-col justify-between p-5 group">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-burgundy-700 to-blush-400 flex items-center justify-center font-bold text-white text-sm shadow-md">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-sm text-cream-50 group-hover:text-blush-200 transition-colors">
                          {c.name}
                        </h3>
                        <p className="text-[10px] text-blush-300/60">
                          Added {new Date(c.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {isVip && (
                      <Badge variant="gold" size="sm" icon={<Crown className="w-3 h-3 text-gold-400" />}>
                        VIP Buyer
                      </Badge>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1.5 text-xs text-blush-200/80 mb-4">
                    {c.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-blush-400 shrink-0" />
                        <span className="truncate">{c.email}</span>
                      </div>
                    )}
                    {c.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-blush-400 shrink-0" />
                        <span>{c.phone}</span>
                      </div>
                    )}
                    {c.notes && (
                      <p className="text-[11px] text-blush-300/70 italic line-clamp-2 mt-2 bg-wine-950/40 p-2 rounded-lg border border-wine-800/40">
                        &ldquo;{c.notes}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Customer Purchase Stats */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-wine-950/60 border border-wine-800/50 text-center">
                    <div>
                      <span className="text-[10px] uppercase text-blush-300/60">Orders</span>
                      <p className="font-serif font-bold text-sm text-cream-50 mt-0.5">
                        {c.total_orders}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-blush-300/60">Total Spent</span>
                      <p className="font-serif font-bold text-sm text-emerald-400 mt-0.5">
                        {currency}{c.total_spent.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t border-wine-800/40 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setViewCustomer(c)}
                    className="text-blush-200 hover:text-white font-medium flex items-center gap-1"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Order History
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(c)}
                      title="Edit Customer"
                      className="p-1.5 rounded-lg text-blush-200 hover:text-white hover:bg-wine-900/60 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id, c.name)}
                      title="Delete Customer"
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-red-300 hover:bg-wine-900/60 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Customer Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCustomer ? 'Edit Customer Profile' : 'Add New Customer'}
        subtitle="Keep client details, phone, and personalized gift notes handy"
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Client Full Name *"
            placeholder="e.g. Sophia Laurent"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="client@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <Input
            label="Shipping / Delivery Address"
            placeholder="Street address, City, State, ZIP"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold text-blush-200/90 uppercase tracking-wider mb-2">
              Founder Notes / Preferences
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Loves freshwater pearls; purchased anniversary gift; prefers rose gold packaging..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#18040B]/80 border border-burgundy-700/60 rounded-xl p-3 text-sm text-cream-50 placeholder:text-zinc-500 focus:border-blush-400 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-wine-800/40">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={submitting}
            >
              {editingCustomer ? 'Update Profile' : 'Save Customer'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Customer Purchase History Modal */}
      <Modal
        isOpen={Boolean(viewCustomer)}
        onClose={() => setViewCustomer(null)}
        title={`Purchase History: ${viewCustomer?.name}`}
        subtitle={`Lifetime Spend: ${currency}${viewCustomer?.total_spent.toFixed(2)} (${viewCustomer?.total_orders} orders)`}
        maxWidth="lg"
      >
        <div className="space-y-4">
          {customerOrders.length === 0 ? (
            <p className="text-xs text-blush-200/70 text-center py-8">
              No orders logged for this customer yet.
            </p>
          ) : (
            <div className="divide-y divide-wine-800/40">
              {customerOrders.map((ord) => (
                <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-cream-50">#{ord.order_number}</span>
                      <span className="text-[11px] text-blush-300/70">
                        {new Date(ord.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-blush-200/70 mt-0.5">
                      {ord.items?.map(i => `${i.quantity}x ${i.product_name}`).join(', ') || 'Sale'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-serif font-bold text-cream-50 text-sm">
                      {currency}{ord.total_amount.toFixed(2)}
                    </span>
                    <p className="text-[10px] text-emerald-400">
                      +{currency}{ord.total_profit.toFixed(2)} profit
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
