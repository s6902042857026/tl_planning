import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Crash caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    try {
      sessionStorage.clear();
      localStorage.removeItem('ttc_session_user');
      localStorage.removeItem('ttc_logged_in_user_v1');
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 font-kanit">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold">ระบบกำลังรีโหลดหรือพบข้อผิดพลาดชั่วคราว</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                ระบบจัดการตัวชี้วัด ฝ่ายยุทธศาสตร์และแผนงาน (TTC Planning)
              </p>
              {this.state.error?.message && (
                <div className="mt-3 p-3 rounded-lg bg-slate-950 text-rose-400 text-xs font-mono text-left overflow-auto max-h-32 border border-slate-800">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>รีเฟรช / ล้างประวัติชั่วคราวและเข้าสู่ระบบใหม่</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
