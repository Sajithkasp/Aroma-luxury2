import React, { useState } from 'react';
import { ContactBlockConfig } from '../../types/store';
import { InlineEditable } from '../common/InlineEditable';
import { Phone, Mail, MapPin, Send, Lock, ChevronUp, ChevronDown, Check } from 'lucide-react';

interface ContactBlockProps {
  config?: ContactBlockConfig;
  isAdmin: boolean;
  onUpdate: (updated: ContactBlockConfig) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onToggleHide?: () => void;
}

const DEFAULT_CONTACT_CONFIG: ContactBlockConfig = {
  visible: true,
  title: 'CONTACT US',
  subtitle: "We'd love to hear from you. Reach out to us for any inquiries or personalized assistance.",
  phone: '+1 (888) 888-8888',
  email: 'hello@auroraluxe.com',
  address: '123 Aurora Lane, New York, NY 10001',
  newsletterTitle: "LET'S STAY IN TOUCH",
  newsletterSubtitle: 'Be the first to know about new arrivals and exclusive offers.',
  showNewsletter: true,
  showContactForm: true,
};

export const ContactBlock: React.FC<ContactBlockProps> = ({
  config = DEFAULT_CONTACT_CONFIG,
  isAdmin,
  onUpdate,
  onMoveUp,
  onMoveDown,
  onToggleHide,
}) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);
  const [subscribedNewsletter, setSubscribedNewsletter] = useState(false);

  if (!config.visible && !isAdmin) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;
    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribedNewsletter(true);
    setTimeout(() => {
      setSubscribedNewsletter(false);
      setNewsletterEmail('');
    }, 4000);
  };

  return (
    <section
      id="contact"
      className={`py-12 sm:py-16 transition-all border-t border-[#ece7dd] ${
        isAdmin ? 'border-2 border-dashed border-blue-400 my-4 rounded-xl p-3 bg-blue-50/15' : ''
      } ${!config.visible ? 'opacity-50' : ''}`}
    >
      {/* Admin Block Header Controls */}
      {isAdmin && (
        <div className="flex items-center justify-between bg-blue-900 text-white px-4 py-2 rounded-lg text-xs mb-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>CONTACT & STAY IN TOUCH BLOCK</span>
            {!config.visible && (
              <span className="bg-rose-500 text-white px-2 py-0.5 rounded text-[10px]">
                Hidden from Customers
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onMoveUp && (
              <button onClick={onMoveUp} className="p-1 hover:bg-blue-800 rounded" title="Move Up">
                <ChevronUp className="w-4 h-4" />
              </button>
            )}
            {onMoveDown && (
              <button onClick={onMoveDown} className="p-1 hover:bg-blue-800 rounded" title="Move Down">
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
            {onToggleHide && (
              <button
                onClick={onToggleHide}
                className="px-2 py-1 bg-blue-800 hover:bg-blue-700 rounded text-[11px]"
              >
                {config.visible ? 'Hide Block' : 'Show Block'}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* DESKTOP VIEW: Split Contact Info (Left) + Send Message Form (Right) */}
        <div className="hidden md:grid md:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column: Contact Us info */}
          <div className="md:col-span-5 space-y-4">
            <h2 className="font-serif text-lg tracking-widest font-bold text-zinc-900 uppercase">
              <InlineEditable
                value={config.title}
                onSave={(val) => onUpdate({ ...config, title: val })}
                isAdmin={isAdmin}
                labelHint="Contact Section Title"
              />
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-sm">
              <InlineEditable
                type="textarea"
                value={config.subtitle}
                onSave={(val) => onUpdate({ ...config, subtitle: val })}
                isAdmin={isAdmin}
                labelHint="Contact Section Subtitle"
              />
            </p>

            <div className="pt-2 space-y-2.5 text-xs text-zinc-700">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#b58d4a] shrink-0" />
                <InlineEditable
                  value={config.phone}
                  onSave={(val) => onUpdate({ ...config, phone: val })}
                  isAdmin={isAdmin}
                  labelHint="Phone Number"
                />
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#b58d4a] shrink-0" />
                <InlineEditable
                  value={config.email}
                  onSave={(val) => onUpdate({ ...config, email: val })}
                  isAdmin={isAdmin}
                  labelHint="Email Address"
                />
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#b58d4a] shrink-0" />
                <InlineEditable
                  value={config.address}
                  onSave={(val) => onUpdate({ ...config, address: val })}
                  isAdmin={isAdmin}
                  labelHint="Physical Address"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Send Message Form */}
          <div className="md:col-span-7">
            {submittedMessage ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-2">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-sm font-bold text-emerald-900">
                  Message Delivered to Concierge
                </h4>
                <p className="text-xs text-emerald-700">
                  Thank you for reaching out. A private concierge advisor will respond to your inquiry shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#dcd6ca] rounded-sm focus:outline-none focus:border-[#b58d4a] transition-colors"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#dcd6ca] rounded-sm focus:outline-none focus:border-[#b58d4a] transition-colors"
                  />
                </div>
                <textarea
                  required
                  rows={3}
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#dcd6ca] rounded-sm focus:outline-none focus:border-[#b58d4a] transition-colors resize-none"
                />
                <div>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#b58d4a] hover:bg-[#9e7939] text-white text-xs font-semibold tracking-widest uppercase rounded-sm transition-all shadow-xs"
                  >
                    SEND MESSAGE
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* MOBILE VIEW: "LET'S STAY IN TOUCH" Newsletter Form (As seen in Screenshot 2) */}
        <div className="md:hidden space-y-3">
          <h2 className="font-serif text-sm tracking-widest font-bold text-zinc-900 uppercase">
            <InlineEditable
              value={config.newsletterTitle || "LET'S STAY IN TOUCH"}
              onSave={(val) => onUpdate({ ...config, newsletterTitle: val })}
              isAdmin={isAdmin}
              labelHint="Newsletter Title"
            />
          </h2>
          <p className="text-xs text-zinc-500">
            <InlineEditable
              value={config.newsletterSubtitle || 'Be the first to know about new arrivals and exclusive offers.'}
              onSave={(val) => onUpdate({ ...config, newsletterSubtitle: val })}
              isAdmin={isAdmin}
              labelHint="Newsletter Subtitle"
            />
          </p>

          {subscribedNewsletter ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-center text-xs text-emerald-800">
              Welcome to the Aurora Luxe inner circle.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-white border border-[#dcd6ca] rounded-sm focus:outline-none focus:border-[#b58d4a]"
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#b58d4a] hover:bg-[#9e7939] text-white text-xs font-semibold tracking-wider uppercase rounded-sm shrink-0"
                >
                  SUBSCRIBE
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                <Lock className="w-3 h-3 text-zinc-400" />
                <span>We respect your privacy</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
