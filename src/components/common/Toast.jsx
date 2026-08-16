import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Toast() {
  const { notification } = useAuth();

  if (!notification) return null;

  const isSuccess = notification.type === 'success';
  const isError = notification.type === 'error';
  const isInfo = notification.type === 'info';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border text-sm font-medium ${
        isSuccess ? 'bg-emerald-50 text-emerald-900 border-emerald-200' :
        isError ? 'bg-rose-50 text-rose-900 border-rose-200' :
        'bg-blue-50 text-blue-900 border-blue-200'
      }`}>
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
        {isError && <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />}
        {isInfo && <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />}
        <span>{notification.message}</span>
      </div>
    </div>
  );
}
