import React, { useState, useEffect } from 'react';
import { RegistrationDetails } from '../types';
import { buildPaymentReference } from '@/lib/paymentReference';
import { joinWhatsAppRegistrationGroup } from '@/constants/whatsapp';
import { X, CreditCard, Landmark, CheckCircle2, Loader2, ArrowRight, Star, Tag, Smartphone, Copy, Check } from 'lucide-react';

const BANK_DETAILS = {
  banco: 'BanBajío',
  beneficiario: 'Ejecutivos de Ventas y Mercadotecnia de Chihuahua A.C.',
  cuenta: '66323270201',
  clabe: '030150663232702019',
} as const;

function buildBankCopyText(referencia: string): string {
  return [
    `Banco: ${BANK_DETAILS.banco}`,
    `Beneficiario: ${BANK_DETAILS.beneficiario}`,
    `Cuenta: ${BANK_DETAILS.cuenta}`,
    `CLABE: ${BANK_DETAILS.clabe}`,
    `Referencia: ${referencia}`,
  ].join('\n');
}

function isValidPhone(value: string): boolean {
  return value.replace(/\D/g, '').length >= 10;
}

interface RegistrationModalProps {
  modality: 'individual' | 'pareja';
  initialStep?: 1 | 2 | 3;
  prefill?: RegistrationDetails;
  onClose: () => void;
  onSaveProgress: (data: RegistrationDetails) => Promise<void>;
  onSuccess: (data: RegistrationDetails) => void;
}

export default function RegistrationModal({
  modality: initialModality,
  initialStep = 1,
  prefill,
  onClose,
  onSaveProgress,
  onSuccess,
}: RegistrationModalProps) {
  const [modality, setModality] = useState(prefill?.ticketType ?? initialModality);
  const [step, setStep] = useState<1 | 2 | 3>(initialStep);
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [name, setName] = useState(prefill?.name ?? '');
  const [email, setEmail] = useState(prefill?.email ?? '');
  const [phone, setPhone] = useState(prefill?.phone ?? '');
  const [company, setCompany] = useState(prefill?.company ?? '');
  const [city, setCity] = useState(prefill?.city ?? '');
  const [position, setPosition] = useState(prefill?.position ?? '');
  const [badgeRole, setBadgeRole] = useState<'Convencionista' | 'Invitado Especial' | 'Prensa'>(prefill?.badgeRole ?? 'Convencionista');
  
  // Partner Fields if "pareja"
  const [partnerName, setPartnerName] = useState(prefill?.partnerName ?? '');
  const [partnerEmail, setPartnerEmail] = useState(prefill?.partnerEmail ?? '');
  const [partnerPhone, setPartnerPhone] = useState(prefill?.partnerPhone ?? '');

  // Payment simulated values
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wire'>('wire');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const [validationError, setValidationError] = useState<string | null>(null);
  const [copiedAllBankDetails, setCopiedAllBankDetails] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);

  useEffect(() => {
    setModality(initialModality);
  }, [initialModality]);

  useEffect(() => {
    if (!prefill) return;
    if (prefill.name) setName(prefill.name);
    if (prefill.email) setEmail(prefill.email);
    if (prefill.phone) setPhone(prefill.phone);
    if (prefill.company) setCompany(prefill.company);
    if (prefill.city) setCity(prefill.city);
    if (prefill.position) setPosition(prefill.position);
    if (prefill.badgeRole) setBadgeRole(prefill.badgeRole);
    if (prefill.partnerName) setPartnerName(prefill.partnerName);
    if (prefill.partnerEmail) setPartnerEmail(prefill.partnerEmail);
    if (prefill.partnerPhone) setPartnerPhone(prefill.partnerPhone);
    if (prefill.ticketType) setModality(prefill.ticketType);
  }, [prefill]);

  const paymentReference = buildPaymentReference(name, city) || prefill?.ticketId || '';

  const buildPayload = (
    status: RegistrationDetails['status'],
    extras?: Partial<RegistrationDetails>
  ): RegistrationDetails => ({
    ticketId: paymentReference,
    name,
    email,
    phone,
    company,
    city,
    position,
    badgeRole,
    ticketType: modality,
    status,
    partnerName: modality === 'pareja' ? partnerName : undefined,
    partnerEmail: modality === 'pareja' ? partnerEmail : undefined,
    partnerPhone: modality === 'pareja' ? partnerPhone : undefined,
    registeredAt:
      prefill?.registeredAt ||
      new Date().toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      }),
    ...extras,
  });

  const saveToBackend = async (payload: RegistrationDetails) => {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error('No se pudo guardar el registro');
    }
  };

  const handleCopyAllBankDetails = () => {
    navigator.clipboard.writeText(buildBankCopyText(paymentReference));
    setCopiedAllBankDetails(true);
    setTimeout(() => setCopiedAllBankDetails(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      if (file.type.startsWith('image/')) {
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        
        // Compress image using canvas
        const img = new Image();
        img.onload = () => {
          const maxDim = 1000;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
            setFileBase64(compressedBase64);
          }
        };
        img.src = objectUrl;
      } else {
        setPreviewUrl(null);
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setFileBase64(ev.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleUploadAndFinish = async () => {
    if (!ensureContactFields()) return;
    setLoading(true);
    const payload = buildPayload('confirmado', { comprobante: fileBase64 || undefined });

    try {
      await saveToBackend(payload);
      await onSaveProgress(payload);
    } catch (err) {
      console.error('Failed to upload proof and finish:', err);
      setValidationError('No se pudo guardar tu comprobante. Intenta de nuevo.');
      setLoading(false);
      return;
    }

    // Attempt to copy image to clipboard so they can paste it directly in WhatsApp
    if (selectedFile && navigator.clipboard && navigator.clipboard.write && selectedFile.type.startsWith('image/')) {
      navigator.clipboard.write([
        new ClipboardItem({
          [selectedFile.type]: selectedFile
        })
      ]).catch(clipErr => {
        console.warn('Could not copy image to clipboard:', clipErr);
      });
    }

    const fileLink = `${window.location.origin}/api/comprobante?id=${paymentReference}`;
    const textMessage = `¡Hola! Adjunto mi comprobante de pago para la Convención COMEV 2026.\n\n` +
      `• Nombre: ${name}\n` +
      `• Correo: ${email}\n` +
      `• Celular: ${phone}\n` +
      `• Asociación: ${company}\n` +
      `• ID Ticket: ${paymentReference}\n` +
      `• Referencia de pago: ${paymentReference}\n` +
      `• Ver Comprobante: ${fileLink}`;
    
    const whatsappUrl = `https://wa.me/526142278711?text=${encodeURIComponent(textMessage)}`;
    window.open(whatsappUrl, '_blank');

    setLoading(false);
    onSuccess(payload);
  };

  const price = modality === 'individual' ? 4000 : 7500;

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Initial validations
    if (!name.trim() || !email.trim() || !phone.trim() || !company.trim() || !city.trim() || !position.trim()) {
      setValidationError('Todos los campos primarios son obligatorios para generar tu credencial.');
      return;
    }

    if (!email.includes('@')) {
      setValidationError('Por favor ingresa un correo electrónico válido.');
      return;
    }

    if (!isValidPhone(phone)) {
      setValidationError('Ingresa un número de celular válido (mínimo 10 dígitos).');
      return;
    }

    if (modality === 'pareja') {
      if (!partnerName.trim() || !partnerEmail.trim() || !partnerPhone.trim()) {
        setValidationError('La modalidad compartida requiere ingresar los datos del segundo asistente beneficiado.');
        return;
      }
      if (!partnerEmail.includes('@')) {
        setValidationError('Por favor ingresa un correo electrónico válido para tu acompañante.');
        return;
      }
      if (!isValidPhone(partnerPhone)) {
        setValidationError('Ingresa un celular válido para tu acompañante (mínimo 10 dígitos).');
        return;
      }
    }

    // Abrir invite del grupo (mismo gesto del usuario — evita bloqueo de popups)
    joinWhatsAppRegistrationGroup();

    // Pre-register in MongoDB and mark as registered after step 1
    setLoading(true);
    try {
      const payload = buildPayload('pendiente');
      await saveToBackend(payload);
      await onSaveProgress(payload);
      setStep(2);
    } catch (err) {
      console.error('Pre-register failed:', err);
      setValidationError('No se pudo guardar tu registro. Verifica tu conexión e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const ensureContactFields = (): boolean => {
    if (!phone.trim() || !isValidPhone(phone)) {
      setValidationError('Ingresa tu número de celular en el paso 1 antes de continuar.');
      setStep(1);
      return false;
    }
    if (modality === 'pareja' && (!partnerPhone.trim() || !isValidPhone(partnerPhone))) {
      setValidationError('Ingresa el celular de tu acompañante en el paso 1 antes de continuar.');
      setStep(1);
      return false;
    }
    return true;
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ensureContactFields()) return;
    setLoading(true);

    // Save as confirmed in MongoDB after step 2
    try {
      const payload = buildPayload('confirmado');
      await saveToBackend(payload);
      await onSaveProgress(payload);
      setStep(3);
    } catch (err) {
      console.error('Failed to confirm registration:', err);
      setValidationError('No se pudo actualizar tu registro. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-deep-blue/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface-card border-2 border-secondary-orange w-full max-w-[640px] overflow-hidden shrink-0 relative shadow-2xl">
        
        {/* Banner header decoration */}
        <div className="bg-gradient-to-r from-secondary-orange to-accent-orange h-2 w-full" />

        {/* Modal Close */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-white p-1 hover:bg-white/15 cursor-pointer border border-transparent hover:border-surface-variant transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Body */}
        <div className="p-6 md:p-8">
          
          <div className="mb-6">
            <span className="font-mono text-[9px] text-secondary-orange font-bold uppercase tracking-widest block mb-1">
              PROCESO DE INSCRIPCIÓN
            </span>
            <h4 className="font-headline font-black text-2xl text-white uppercase italic">
              Carnet {modality === 'individual' ? 'Individual' : 'Por Pareja'}
            </h4>
            <div className="flex items-center gap-1.5 font-mono text-xs text-on-surface-variant mt-1">
              <span>Costo total:</span>
              <span className="text-secondary-orange font-bold text-sm">${price.toLocaleString('es-MX')} MXN</span>
              <span className="opacity-50">|</span>
              <span className="bg-white/5 px-2 py-0.5 border border-surface-variant uppercase text-[10px]">
                CON ACCESO TOTAL
              </span>
            </div>

            {step === 1 && (
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => { setModality('individual'); setValidationError(null); }}
                  className={`flex-1 py-2.5 px-3 font-mono text-[10px] font-bold uppercase tracking-wider border transition-all ${
                    modality === 'individual'
                      ? 'border-secondary-orange bg-secondary-orange/15 text-white'
                      : 'border-surface-variant text-on-surface-variant hover:border-white/30 hover:text-white'
                  }`}
                >
                  Individual · $4,000
                </button>
                <button
                  type="button"
                  onClick={() => { setModality('pareja'); setValidationError(null); }}
                  className={`flex-1 py-2.5 px-3 font-mono text-[10px] font-bold uppercase tracking-wider border transition-all ${
                    modality === 'pareja'
                      ? 'border-secondary-orange bg-secondary-orange/15 text-white'
                      : 'border-surface-variant text-on-surface-variant hover:border-white/30 hover:text-white'
                  }`}
                >
                  Pareja · $7,500
                </button>
              </div>
            )}
          </div>

          {validationError && (
            <div className="bg-red-950/40 border border-red-500/30 p-3 text-red-300 text-xs font-sans mb-5 leading-relaxed">
              ⚠️ {validationError}
            </div>
          )}

          {step === 1 ? (
            /* STEP 1: ATTENDEE INFORMATION */
            <form onSubmit={handleNextStep} className="space-y-4">
              <p className="font-mono text-[10px] text-on-surface-variant uppercase font-bold tracking-wider pb-1 border-b border-surface-variant">
                👤 DATOS DEL TITULAR
              </p>

              <div>
                <label className="font-mono text-[10px] text-on-surface-variant uppercase block mb-1">Nombre Completo *</label>
                <input 
                  type="text"
                  required
                  placeholder="Ej. Néstor Guerra"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setValidationError(null); }}
                  className="w-full bg-surface-container-lowest border border-surface-variant px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary-orange rounded-none font-sans"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[10px] text-on-surface-variant uppercase block mb-1 font-semibold">Correo Electrónico *</label>
                  <input 
                    type="email"
                    required
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setValidationError(null); }}
                    className="w-full bg-surface-container-lowest border border-surface-variant px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary-orange rounded-none font-sans"
                  />
                </div>

                <div>
                  <label className="font-mono text-[10px] text-on-surface-variant uppercase block mb-1 font-semibold">Celular / WhatsApp *</label>
                  <input 
                    type="tel"
                    required
                    placeholder="614 123 4567"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setValidationError(null); }}
                    className="w-full bg-surface-container-lowest border border-surface-variant px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary-orange rounded-none font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] text-on-surface-variant uppercase block mb-1">Clasificación Carnet *</label>
                <select
                  value={badgeRole}
                  onChange={(e) => setBadgeRole(e.target.value as any)}
                  className="w-full bg-surface-container-lowest border border-surface-variant px-3 py-2 text-xs text-white focus:outline-none focus:border-secondary-orange rounded-none font-mono"
                >
                  <option value="Convencionista">Convencionista</option>
                  <option value="Prensa">Prensa / Reportero</option>
                  <option value="Invitado Especial">Invitado Especial</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[10px] text-on-surface-variant uppercase block mb-1">Asociación / Institución *</label>
                  <input 
                    type="text"
                    required
                    placeholder="Ej. EVM Chihuahua"
                    value={company}
                    onChange={(e) => { setCompany(e.target.value); setValidationError(null); }}
                    className="w-full bg-surface-container-lowest border border-surface-variant px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary-orange rounded-none font-sans"
                  />
                </div>

                <div>
                  <label className="font-mono text-[10px] text-on-surface-variant uppercase block mb-1">Ciudad / Delegación *</label>
                  <input 
                    type="text"
                    required
                    list="evm-cities"
                    placeholder="Ej. Chihuahua"
                    value={city}
                    onChange={(e) => { setCity(e.target.value); setValidationError(null); }}
                    className="w-full bg-surface-container-lowest border border-surface-variant px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary-orange rounded-none font-sans"
                  />
                  <datalist id="evm-cities">
                    <option value="Chihuahua" />
                    <option value="Ciudad Juárez" />
                    <option value="Monterrey" />
                    <option value="Guadalajara" />
                    <option value="Ciudad de México" />
                    <option value="Tijuana" />
                    <option value="Hermosillo" />
                    <option value="Saltillo" />
                    <option value="Torreón" />
                    <option value="León" />
                    <option value="Querétaro" />
                    <option value="Puebla" />
                    <option value="Mérida" />
                    <option value="Cancún" />
                  </datalist>
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] text-on-surface-variant uppercase block mb-1">Cargo / Puesto *</label>
                <input 
                  type="text"
                  required
                  placeholder="Ej. Líder de Operaciones"
                  value={position}
                  onChange={(e) => { setPosition(e.target.value); setValidationError(null); }}
                  className="w-full bg-surface-container-lowest border border-surface-variant px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary-orange rounded-none font-sans"
                />
              </div>

              {/* Partner entries if shared coupon selected */}
              {modality === 'pareja' && (
                <div className="space-y-4 pt-4 border-t border-dashed border-outline-variant/30 mt-6 bg-[#04111d] p-4 font-sans">
                  <p className="font-mono text-[10px] text-secondary-orange font-bold uppercase tracking-wider flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-secondary-orange text-secondary-orange" /> 👥 DATOS DEL ACOMPAÑANTE
                  </p>
                  <p className="text-[11px] text-on-surface-variant leading-tight">
                    La modalidad con precio preferencial por pareja requiere de los datos del segundo asistente beneficiado.
                  </p>
                  
                  <div>
                    <label className="font-mono text-[10px] text-on-surface-variant uppercase block mb-1">Nombre Completo Acompañante *</label>
                    <input 
                      type="text"
                      required
                      placeholder="Ej. Sandra Lozano"
                      value={partnerName}
                      onChange={(e) => { setPartnerName(e.target.value); setValidationError(null); }}
                      className="w-full bg-surface-container-lowest border border-surface-variant/70 px-3 py-1.5 text-sm text-white focus:outline-none focus:border-secondary-orange rounded-none font-sans"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[10px] text-on-surface-variant uppercase block mb-1">Correo Electrónico Acompañante *</label>
                    <input 
                      type="email"
                      required
                      placeholder="sandra@ejemplo.com"
                      value={partnerEmail}
                      onChange={(e) => { setPartnerEmail(e.target.value); setValidationError(null); }}
                      className="w-full bg-surface-container-lowest border border-surface-variant/70 px-3 py-1.5 text-sm text-white focus:outline-none focus:border-secondary-orange rounded-none font-sans"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[10px] text-on-surface-variant uppercase block mb-1">Celular / WhatsApp Acompañante *</label>
                    <input 
                      type="tel"
                      required
                      placeholder="614 987 6543"
                      value={partnerPhone}
                      onChange={(e) => { setPartnerPhone(e.target.value); setValidationError(null); }}
                      className="w-full bg-surface-container-lowest border border-surface-variant/70 px-3 py-1.5 text-sm text-white focus:outline-none focus:border-secondary-orange rounded-none font-sans"
                    />
                  </div>
                </div>
              )}

              <button 
                type="submit"
                id="btn-next-checkout"
                disabled={loading}
                className="w-full bg-secondary-orange hover:bg-white disabled:bg-surface-variant disabled:text-on-surface-variant text-deep-blue font-mono text-xs font-bold leading-none tracking-widest py-4 transition-all uppercase flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> GUARDANDO...
                  </>
                ) : (
                  <>
                    Continuar al Pago <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : step === 2 ? (
            /* STEP 2: BILLING & PAYMENT */
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <p className="font-mono text-[10px] text-on-surface-variant uppercase font-bold tracking-wider pb-1 border-b border-surface-variant">
                💳 INFORMACIÓN DE PAGO
              </p>

              {/* Payment Methods tabs - Ocultos temporalmente */}
              {/* 
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { setPaymentMethod('card'); setValidationError(null); }}
                  className={`py-3 border font-mono text-xs flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'card' 
                      ? 'border-secondary-orange bg-[#ff9900]/10 text-white font-bold' 
                      : 'border-surface-variant text-on-surface-variant'
                  }`}
                >
                  <CreditCard className="w-4 h-4" /> Tarjeta de Crédito
                </button>
                <button
                  type="button"
                  onClick={() => { setPaymentMethod('wire'); setValidationError(null); }}
                  className={`py-3 border font-mono text-xs flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'wire' 
                      ? 'border-secondary-orange bg-[#ff9900]/10 text-white font-bold' 
                      : 'border-surface-variant text-on-surface-variant'
                  }`}
                >
                  <Landmark className="w-4 h-4" /> Transferencia SPEI
                </button>
              </div>
              */}

              {/* 
              {paymentMethod === 'card' ? (
                // Card Input form
                <div className="space-y-3">
                  <div>
                    <label className="font-mono text-[10px] text-on-surface-variant uppercase block mb-1">Número de Tarjeta *</label>
                    <input 
                      type="text"
                      maxLength={19}
                      placeholder="4000 1234 5678 9010"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/[^\d ]/g, ''))}
                      className="w-full bg-surface-container-lowest border border-surface-variant px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary-orange rounded-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono text-[10px] text-on-surface-variant uppercase block mb-1">Vencimiento *</label>
                      <input 
                        type="text"
                        maxLength={5}
                        placeholder="MM/AA"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full bg-surface-container-lowest border border-surface-variant px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary-orange rounded-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[10px] text-on-surface-variant uppercase block mb-1">CVC / Código *</label>
                      <input 
                        type="password"
                        maxLength={4}
                        placeholder="•••"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-surface-container-lowest border border-surface-variant px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary-orange rounded-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              ) : (
              */}
                {/* Bank Wire instructions */}
                <div className="bg-[#030e1a] border border-surface-variant p-4 space-y-3 font-sans text-xs text-on-surface-variant">
                  <div className="flex items-center justify-between border-b border-surface-variant/40 pb-2">
                    <p className="font-mono text-[10px] text-white font-bold uppercase">🏦 Datos bancarios oficiales</p>
                    <button
                      type="button"
                      onClick={handleCopyAllBankDetails}
                      className="text-emerald-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer font-mono text-[9px] uppercase tracking-wider font-bold"
                      title="Copiar datos bancarios"
                    >
                      {copiedAllBankDetails ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400 animate-fadeIn" /> ¡Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copiar Datos
                        </>
                      )}
                    </button>
                  </div>
                  <p>Realiza tu transferencia SPEI y envía tu comprobante al WhatsApp 6142278711 o en la sección de Inscripciones:</p>
                  <p className="text-[10px] text-secondary-orange/90 font-mono">
                    Tu referencia usa tu apellido y ciudad (ej. CMV-GUER-CHIH) — siempre será la misma si vuelves a registrarte con los mismos datos.
                  </p>
                  <div className="space-y-1.5 p-2.5 bg-black/60 border border-surface-variant font-mono text-[11px] text-emerald-400">
                    <div>Banco: <span className="text-white">{BANK_DETAILS.banco}</span></div>
                    <div className="md:whitespace-nowrap">Beneficiario: <span className="text-white">{BANK_DETAILS.beneficiario}</span></div>
                    <div>Cuenta: <span className="text-white">{BANK_DETAILS.cuenta}</span></div>
                    <div>CLABE: <span className="text-white">{BANK_DETAILS.clabe}</span></div>
                    <div>Referencia: <span className="text-yellow-400 font-bold">{paymentReference}</span></div>
                  </div>
                  <p className="text-[10px] italic">Al dar clic en Comprobante de Inscripción, podrás cargar tu comprobante de pago o tomar una foto.</p>
                </div>
              {/* 
              )}
              */}

              {/* Order recap */}
              <div className="bg-[#030e1a] border border-surface-variant p-4 font-mono text-[11px] text-on-surface-variant space-y-1 mt-6">
                <div className="flex justify-between">
                  <span>FOLIO / REFERENCIA:</span>
                  <span className="text-yellow-400 font-bold">{paymentReference}</span>
                </div>
                <div className="flex justify-between">
                  <span>MODALIDAD:</span>
                  <span className="text-white uppercase">{modality}</span>
                </div>
                <div className="flex justify-between">
                  <span>CARGO DE ACCESO:</span>
                  <span className="text-white">${price.toLocaleString('es-MX')} MXN</span>
                </div>
                <div className="flex justify-between text-secondary-orange font-bold text-xs pt-1 border-t border-surface-variant/40 mt-1">
                  <span>TOTAL A PAGAR:</span>
                  <span>${price.toLocaleString('es-MX')} MXN</span>
                </div>
              </div>

              {/* Action trigger */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 border border-white text-white font-mono text-xs font-bold leading-none tracking-widest py-4 transition-all uppercase hover:bg-white/5 text-center"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  id="btn-process-payment"
                  className="w-2/3 bg-secondary-orange hover:bg-white disabled:bg-surface-variant disabled:text-on-surface-variant text-deep-blue font-mono text-xs font-bold leading-none tracking-widest py-4 transition-all uppercase flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-deep-blue" /> PROCESANDO...
                    </>
                  ) : (
                    <>
                      Comprobante de Inscripción <CheckCircle2 className="w-4 h-4 text-deep-blue" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* STEP 3: FILE UPLOAD & WHATSAPP SEND */
            <div className="space-y-5">
              <p className="font-mono text-[10px] text-on-surface-variant uppercase font-bold tracking-wider pb-1 border-b border-surface-variant">
                📁 COMPROBANTE DE INSCRIPCIÓN
              </p>
              
              <p className="font-sans text-xs md:text-sm text-on-surface-variant leading-relaxed">
                Por favor, carga tu comprobante de transferencia SPEI (imagen o PDF) o toma una foto directamente desde tu celular.
              </p>

              {/* Upload Dropzone */}
              <label className="border-2 border-dashed border-surface-variant hover:border-secondary-orange bg-[#030e1a]/80 p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors text-center relative group">
                <input 
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {selectedFile ? (
                  <div className="space-y-3 w-full flex flex-col items-center">
                    {previewUrl ? (
                      <div className="relative w-full max-w-[180px] h-32 border border-surface-variant overflow-hidden bg-black/40 flex items-center justify-center">
                        <img 
                          src={previewUrl} 
                          alt="Vista previa del comprobante" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <p className="text-white text-xs font-bold font-mono line-clamp-1 max-w-[280px]">
                        {selectedFile.name}
                      </p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <span className="text-[10px] text-secondary-orange font-mono underline hover:text-white block mt-1 cursor-pointer">
                      Cambiar archivo
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-on-surface-variant group-hover:text-secondary-orange transition-colors">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold uppercase tracking-wider">
                        Seleccionar Archivo / Tomar Foto
                      </p>
                      <p className="text-[10px] text-on-surface-variant mt-1">
                        Formatos soportados: JPG, PNG, PDF (Máx. 5MB)
                      </p>
                    </div>
                  </>
                )}
              </label>

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 border border-white text-white font-mono text-xs font-bold leading-none tracking-widest py-4 transition-all uppercase hover:bg-white/5 text-center"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={handleUploadAndFinish}
                  disabled={!selectedFile || loading}
                  className="w-2/3 bg-secondary-orange hover:bg-white disabled:bg-surface-variant disabled:text-on-surface-variant disabled:cursor-not-allowed text-deep-blue font-mono text-xs font-bold leading-none tracking-widest py-4 transition-all uppercase flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-deep-blue" /> PROCESANDO...
                    </>
                  ) : (
                    <>
                      Enviar y Finalizar <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center border-t border-surface-variant/40 pt-4">
            <p className="font-sans text-[11px] text-on-surface-variant/80 flex items-center justify-center gap-1">
              🔒 Formulario avalado por el comité nacional de EVM Chihuahua, 2026.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
