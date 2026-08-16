import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' && 
  supabaseAnonKey !== 'your-anon-key'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Utility to check connection status
 */
export async function testSupabaseConnection() {
  if (!supabase) {
    return {
      connected: false,
      mode: 'local_storage',
      message: 'ใช้งานโหมดข้อมูลจำลองในเครื่อง (LocalStorage Mode) - ใส่ค่า VITE_SUPABASE_URL และ VITE_SUPABASE_ANON_KEY ใน .env.local เพื่อเชื่อมต่อฐานข้อมูลจริง'
    };
  }

  try {
    const { data, error } = await supabase.from('kpis').select('id').limit(1);
    if (error) throw error;
    return {
      connected: true,
      mode: 'supabase_live',
      message: 'เชื่อมต่อฐานข้อมูล Supabase สำเร็จเรียบร้อย'
    };
  } catch (err) {
    return {
      connected: false,
      mode: 'supabase_error',
      message: `ไม่สามารถเชื่อมต่อ Supabase: ${err.message}`
    };
  }
}
