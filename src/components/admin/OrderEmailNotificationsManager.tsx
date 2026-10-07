import React, { useState, useEffect } from 'react';
import { emailNotificationService, DEFAULT_NOTIFICATION_EMAIL } from '../../services/emailNotificationService';
import { Mail, Plus, Trash2, CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';

export const OrderEmailNotificationsManager: React.FC = () => {
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Firestore settings/email_notifications belgesini canlı dinle (real-time onSnapshot)
  useEffect(() => {
    setLoading(true);
    const unsubscribe = emailNotificationService.subscribeToEmailRecipients((updatedEmails) => {
      setEmails(updatedEmails);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const clean = newEmail.trim().toLowerCase();
    if (!clean) return;

    setIsSubmitting(true);
    try {
      const updated = await emailNotificationService.addRecipient(clean);
      setEmails(updated);
      setNewEmail('');
      setFeedback({
        type: 'success',
        message: `"${clean}" adresi bildirim listesine başarıyla eklendi.`,
      });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.message || 'E-posta eklenirken bir hata oluştu.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveEmail = async (emailToRemove: string) => {
    if (emails.length <= 1 && emailToRemove === DEFAULT_NOTIFICATION_EMAIL) {
      if (!window.confirm('Bu son bildirim adresi. Silmek istediğinize emin misiniz?')) {
        return;
      }
    }

    setIsSubmitting(true);
    setFeedback(null);
    try {
      const updated = await emailNotificationService.removeRecipient(emailToRemove);
      setEmails(updated);
      setFeedback({
        type: 'success',
        message: `"${emailToRemove}" adresi bildirim listesinden kaldırıldı.`,
      });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.message || 'E-posta silinirken bir hata oluştu.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-[#C58B38] border border-amber-200">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span>Bildirim Alıcı e-Postaları (Maksimum 5 Adet)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  {emails.length} / 5
                </span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Firebase Cloud Function (sendOrderEmail) ve sistem e-posta bildirimlerinin otomatik iletileceği yetkili adresler.
              </p>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAddEmail} className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="email"
            placeholder="yeni-eposta@firma.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            disabled={emails.length >= 5 || isSubmitting}
            className="px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C58B38] w-full sm:w-64 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={emails.length >= 5 || !newEmail.trim() || isSubmitting}
            className="px-4 py-2 rounded-xl bg-[#C58B38] hover:bg-[#b0792b] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            <span>Ekle</span>
          </button>
        </form>
      </div>

      {/* Feedback Messages */}
      {feedback && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Email Pills List */}
      <div>
        {loading ? (
          <div className="flex items-center gap-2 py-3 text-xs text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin text-[#C58B38]" />
            <span>Alıcı listesi canlı yükleniyor...</span>
          </div>
        ) : emails.length > 0 ? (
          <div className="flex flex-wrap gap-2.5 pt-1">
            {emails.map((email) => {
              const isDefault = email.toLowerCase() === DEFAULT_NOTIFICATION_EMAIL.toLowerCase();

              return (
                <div
                  key={email}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 shadow-xs hover:border-gray-300 transition-colors"
                >
                  <Send className="w-3 h-3 text-[#C58B38]" />
                  <span className="font-mono font-medium">{email}</span>
                  {isDefault && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                      Varsayılan
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(email)}
                    disabled={isSubmitting}
                    className="p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors cursor-pointer ml-1"
                    title={`"${email}" adresini listeden sil`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-xs text-gray-500 italic py-2">
            Henüz alıcı e-posta adresi eklenmemiş. Yukarıdaki alandan ekleyebilirsiniz.
          </div>
        )}
      </div>
    </div>
  );
};
