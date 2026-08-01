'use client';

import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import AccountSection from '@/components/account/AccountSection';

const inputClass =
  'h-11 w-full rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/30 focus:ring-2 focus:ring-white/10';
const labelClass = 'mb-2 block text-sm font-medium text-zinc-300';

function FormActions({ onCancel, onSave }: { onCancel: () => void; onSave: () => void }) {
  return (
    <div className="mt-5 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-xl border border-sky-400/40 bg-transparent px-5 py-2.5 text-sm font-semibold text-sky-300 transition-colors hover:bg-sky-500/10"
      >
        İptal
      </button>
      <button
        type="button"
        onClick={onSave}
        className="rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-zinc-950 transition-opacity hover:opacity-90"
      >
        Kaydet
      </button>
    </div>
  );
}

export default function AccountBillingPage() {
  const [currency, setCurrency] = useState('TRY');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showBillingForm, setShowBillingForm] = useState(false);
  const [showTaxId, setShowTaxId] = useState(false);
  const [showCompany, setShowCompany] = useState(false);

  const [cardNumber, setCardNumber] = useState('');
  const [expCvc, setExpCvc] = useState('');
  const [cardCountry, setCardCountry] = useState('TR');
  const [cardPostal, setCardPostal] = useState('');

  const [businessName, setBusinessName] = useState('');
  const [street1, setStreet1] = useState('');
  const [street2, setStreet2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [billingCountry, setBillingCountry] = useState('TR');
  const [billingPostal, setBillingPostal] = useState('');

  const [taxId, setTaxId] = useState('');
  const [companyTitle, setCompanyTitle] = useState('');

  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Ödeme & faturalama
      </h1>

      <div className="mt-10">
        <AccountSection
          title="Ödeme yöntemleri"
          description="Ödeme yöntemlerinizi ekleyin, düzenleyin veya silin."
        >
          {!showPaymentForm ? (
            <button
              type="button"
              onClick={() => setShowPaymentForm(true)}
              className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              + Yeni ödeme yöntemi ekle
            </button>
          ) : (
            <div className="max-w-xl space-y-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
              <div>
                <label htmlFor="card-number" className={labelClass}>
                  Kart numarası
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative flex-1">
                    <CreditCard
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                      aria-hidden
                    />
                    <input
                      id="card-number"
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Kart numarası"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    value={expCvc}
                    onChange={(e) => setExpCvc(e.target.value)}
                    placeholder="SKT / CVC"
                    className={`${inputClass} sm:w-36`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="card-country" className={labelClass}>
                  Ülke veya bölge
                </label>
                <select
                  id="card-country"
                  value={cardCountry}
                  onChange={(e) => setCardCountry(e.target.value)}
                  className={`${inputClass} bg-zinc-950`}
                >
                  <option value="TR">Türkiye</option>
                  <option value="US">United States</option>
                  <option value="DE">Germany</option>
                  <option value="GB">United Kingdom</option>
                </select>
              </div>

              <div>
                <label htmlFor="card-postal" className={labelClass}>
                  Posta kodu
                </label>
                <input
                  id="card-postal"
                  type="text"
                  value={cardPostal}
                  onChange={(e) => setCardPostal(e.target.value)}
                  placeholder="Posta kodu"
                  className={inputClass}
                />
              </div>

              <FormActions
                onCancel={() => {
                  setShowPaymentForm(false);
                  setCardNumber('');
                  setExpCvc('');
                  setCardPostal('');
                }}
                onSave={() => setShowPaymentForm(false)}
              />
            </div>
          )}
        </AccountSection>

        <AccountSection
          title="Fatura bilgileri"
          description="Varsayılan fatura bilgilerinizi güncelleyin veya silin."
        >
          {!showBillingForm ? (
            <button
              type="button"
              onClick={() => setShowBillingForm(true)}
              className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              + Fatura bilgisi ekle
            </button>
          ) : (
            <div className="max-w-xl space-y-4">
              <div>
                <label htmlFor="business-name" className={labelClass}>
                  İşletme adı <span className="font-normal text-zinc-500">(opsiyonel)</span>
                </label>
                <input
                  id="business-name"
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className={inputClass}
                />
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
                  İşletme adı faturalarınızda görünür; aşağıda veya ödeme sırasında farklı bir vergi
                  mükellefi belirtmedikçe.
                </p>
              </div>

              <div>
                <label htmlFor="street-1" className={labelClass}>
                  Sokak adresi <span className="font-normal text-zinc-500">(opsiyonel)</span>
                </label>
                <input
                  id="street-1"
                  type="text"
                  value={street1}
                  onChange={(e) => setStreet1(e.target.value)}
                  className={inputClass}
                />
                <input
                  id="street-2"
                  type="text"
                  value={street2}
                  onChange={(e) => setStreet2(e.target.value)}
                  className={`${inputClass} mt-2`}
                  aria-label="Sokak adresi satır 2"
                />
              </div>

              <div>
                <label htmlFor="city" className={labelClass}>
                  Şehir <span className="font-normal text-zinc-500">(opsiyonel)</span>
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="state" className={labelClass}>
                  İl / eyalet <span className="font-normal text-zinc-500">(opsiyonel)</span>
                </label>
                <input
                  id="state"
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="billing-country" className={labelClass}>
                  Ülke veya bölge
                </label>
                <select
                  id="billing-country"
                  value={billingCountry}
                  onChange={(e) => setBillingCountry(e.target.value)}
                  className={`${inputClass} bg-zinc-950`}
                >
                  <option value="TR">Türkiye</option>
                  <option value="US">United States</option>
                  <option value="DE">Germany</option>
                  <option value="GB">United Kingdom</option>
                </select>
              </div>

              <div>
                <label htmlFor="billing-postal" className={labelClass}>
                  Posta kodu
                </label>
                <input
                  id="billing-postal"
                  type="text"
                  value={billingPostal}
                  onChange={(e) => setBillingPostal(e.target.value)}
                  className={inputClass}
                />
              </div>

              <FormActions
                onCancel={() => setShowBillingForm(false)}
                onSave={() => setShowBillingForm(false)}
              />
            </div>
          )}
        </AccountSection>

        <AccountSection
          title="Para birimi"
          description="Blacknook Marketplace genelinde fiyatlar için tercih ettiğiniz para birimini seçin. Seçiminiz otomatik kaydedilir."
        >
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className={`${inputClass} max-w-md bg-zinc-950`}
          >
            <option value="TRY">🇹🇷 TRY (₺)</option>
            <option value="USD">🇺🇸 USD ($)</option>
            <option value="EUR">🇪🇺 EUR (€)</option>
          </select>
        </AccountSection>

        <AccountSection
          title="Vergi bilgileri"
          description="İşletme adına mı satın alıyorsunuz? Aşağıdan vergi numarası (VKN / VAT) veya şirket unvanı ekleyebilirsiniz."
        >
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowTaxId((v) => !v)}
              className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              + Vergi numarası ekle
            </button>
            <button
              type="button"
              onClick={() => setShowCompany((v) => !v)}
              className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-zinc-100 transition-colors hover:bg-white/[0.08]"
            >
              + Şirket unvanı ekle
            </button>
          </div>

          {showTaxId ? (
            <div className="mt-4 max-w-md">
              <label htmlFor="tax-id" className={labelClass}>
                Vergi numarası (VKN / VAT)
              </label>
              <input
                id="tax-id"
                type="text"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                className={inputClass}
                placeholder="XXXXXXXXXX"
              />
            </div>
          ) : null}

          {showCompany ? (
            <div className="mt-4 max-w-md">
              <label htmlFor="company-title" className={labelClass}>
                Şirket unvanı
              </label>
              <input
                id="company-title"
                type="text"
                value={companyTitle}
                onChange={(e) => setCompanyTitle(e.target.value)}
                className={inputClass}
              />
            </div>
          ) : null}

          <p className="mt-4 text-xs leading-relaxed text-zinc-500">
            Vergi muafiyeti için{' '}
            <a
              href="mailto:contact@blacknook.com"
              className="text-sky-400 transition-colors hover:text-sky-300"
            >
              contact@blacknook.com
            </a>{' '}
            adresine yazın.
          </p>
        </AccountSection>
      </div>
    </div>
  );
}
