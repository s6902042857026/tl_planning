import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../data/mockData';
import { DEPARTMENTS } from '../data/kpiStructure';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Local storage cache for persistence (null by default -> must login first)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ttc_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse auth user', e);
      }
    }
    return null; // Require login first
  });

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tvMode, setTvMode] = useState(false);
  const [activeFiscalYear, setActiveFiscalYear] = useState('2568');
  const [notification, setNotification] = useState(null);

  // Synchronize with Supabase Auth session if configured
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session: initialSession } } = await supabase.auth.getSession();
          if (mounted && initialSession) {
            setSession(initialSession);
            await fetchUserProfile(initialSession.user);
          }
        } catch (err) {
          console.warn('Supabase getSession error:', err);
        }

        // Listen to Auth State Changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          if (!mounted) return;
          setSession(currentSession);
          if (currentSession?.user) {
            await fetchUserProfile(currentSession.user);
          } else if (event === 'SIGNED_OUT') {
            // Check if local demo user is active or clear
            const saved = localStorage.getItem('ttc_auth_user');
            if (!saved) setCurrentUser(null);
          }
        });

        if (mounted) setLoading(false);
        return () => subscription.unsubscribe();
      } else {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // Save current user in localStorage whenever updated
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ttc_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ttc_auth_user');
    }
  }, [currentUser]);

  // Fetch or upsert user profile from Supabase user_profiles table
  const fetchUserProfile = async (authUser) => {
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (data) {
        const dept = DEPARTMENTS.find(d => d.id === data.department_id);
        const mappedUser = {
          id: data.id,
          name: data.full_name || authUser.email.split('@')[0],
          email: authUser.email,
          role: data.role || 'user',
          departmentId: data.department_id || 'dept_elec',
          departmentName: dept?.name || data.department_id || 'แผนกวิชาช่างไฟฟ้ากำลัง',
          position: data.position || 'ครูผู้สอน / เจ้าหน้าที่',
          avatar: data.avatar_url || ''
        };
        setCurrentUser(mappedUser);
      } else {
        // Build from metadata if not in user_profiles yet
        const meta = authUser.user_metadata || {};
        const dept = DEPARTMENTS.find(d => d.id === (meta.department_id || 'dept_elec'));
        const newUser = {
          id: authUser.id,
          name: meta.full_name || authUser.email.split('@')[0],
          email: authUser.email,
          role: meta.role || 'user',
          departmentId: meta.department_id || 'dept_elec',
          departmentName: dept?.name || 'แผนกวิชาช่างไฟฟ้ากำลัง',
          position: meta.position || 'ครูผู้สอน / เจ้าหน้าที่',
          avatar: ''
        };
        setCurrentUser(newUser);

        // Auto insert into user_profiles
        await supabase.from('user_profiles').upsert({
          id: authUser.id,
          email: authUser.email,
          full_name: newUser.name,
          role: newUser.role,
          department_id: newUser.departmentId,
          position: newUser.position
        });
      }
    } catch (e) {
      console.error('Error fetching user profile:', e);
    }
  };

  /**
   * เข้าสู่ระบบด้วย Email/Username & Password
   */
  const login = async ({ email, password }) => {
    const inputIdentifier = email.trim().toLowerCase();
    
    // Convert common usernames to mock email if no domain provided
    let normalizedEmail = inputIdentifier;
    if (!inputIdentifier.includes('@')) {
      if (inputIdentifier === 'admin' || inputIdentifier === 'admin.plan') {
        normalizedEmail = 'admin.plan@ttc.ac.th';
      } else if (inputIdentifier === 'director' || inputIdentifier === 'executive') {
        normalizedEmail = 'director@ttc.ac.th';
      } else if (inputIdentifier === 'somkid' || inputIdentifier === 'user') {
        normalizedEmail = 'somkid@ttc.ac.th';
      } else {
        normalizedEmail = `${inputIdentifier}@ttc.ac.th`;
      }
    }

    // 1. If Supabase is configured, use Supabase Auth
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password
      });

      if (!error && data?.user) {
        setSession(data.session);
        await fetchUserProfile(data.user);
        showToast(`เข้าสู่ระบบสำเร็จ ยินดีต้อนรับ ${data.user.email}`, 'success');
        return data.user;
      }

      // If Supabase authentication fails, check local accounts fallback
      console.warn('Supabase auth attempt message:', error?.message);
    }

    // 2. Local Fallback Mode (Check mock users & registered users)
    const localUsers = JSON.parse(localStorage.getItem('ttc_registered_users') || '[]');
    const allUsers = [...INITIAL_USERS, ...localUsers];
    const found = allUsers.find(u => 
      u.email.toLowerCase() === normalizedEmail || 
      u.email.toLowerCase() === inputIdentifier ||
      (u.name && u.name.toLowerCase().includes(inputIdentifier))
    );

    if (!found) {
      throw new Error('อีเมล/ชื่อผู้ใช้ หรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบหรือสมัครสมาชิกใหม่');
    }

    setCurrentUser(found);
    showToast(`เข้าสู่ระบบสำเร็จ: ${found.name} (${getRoleLabel(found.role)})`, 'success');
    return found;
  };

  /**
   * สมัครสมาชิกใหม่ (Register)
   */
  const register = async ({ email, password, fullName, role = 'user', departmentId = 'dept_elec', position = 'ครูผู้สอน' }) => {
    const dept = DEPARTMENTS.find(d => d.id === departmentId);
    const deptName = dept?.name || 'แผนกวิชาช่างไฟฟ้ากำลัง';

    // 1. If Supabase is configured, sign up via Supabase Auth
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName,
            role,
            department_id: departmentId,
            position
          }
        }
      });

      if (error) {
        throw new Error(error.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
      }

      if (data.user) {
        // Upsert into public.user_profiles
        try {
          await supabase.from('user_profiles').upsert({
            id: data.user.id,
            email: email.trim(),
            full_name: fullName,
            role,
            department_id: departmentId,
            position
          });
        } catch (dbErr) {
          console.warn('Profile upsert warning:', dbErr);
        }

        const newUser = {
          id: data.user.id,
          name: fullName,
          email: email.trim(),
          role,
          departmentId,
          departmentName: deptName,
          position,
          avatar: ''
        };
        setCurrentUser(newUser);
        setSession(data.session);
        showToast('สมัครสมาชิกสำเร็จและเข้าสู่ระบบเรียบร้อยแล้ว', 'success');
        return newUser;
      }
    }

    // 2. Local Fallback Mode
    const newUser = {
      id: `usr_reg_${Date.now()}`,
      name: fullName,
      email: email.trim(),
      role,
      departmentId,
      departmentName: deptName,
      position,
      avatar: ''
    };

    const localUsers = JSON.parse(localStorage.getItem('ttc_registered_users') || '[]');
    const existing = localUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      throw new Error('อีเมลนี้ถูกใช้งานแล้วในระบบ');
    }

    localUsers.push(newUser);
    localStorage.setItem('ttc_registered_users', JSON.stringify(localUsers));
    setCurrentUser(newUser);
    showToast(`สมัครสมาชิกสำเร็จ! ยินดีต้อนรับ ${fullName}`, 'success');
    return newUser;
  };

  /**
   * เปลี่ยนรหัสผ่าน (Update Password in Supabase & Local)
   */
  const updatePassword = async (newPassword) => {
    if (!newPassword || newPassword.length < 6) {
      throw new Error('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw new Error(error.message || 'ไม่สามารถอัปเดตรหัสผ่านได้');
      }

      showToast('อัปเดตรหัสผ่านขึ้น Supabase สำเร็จเรียบร้อย', 'success');
      return data;
    }

    // Local mode simulation
    showToast('อัปเดตรหัสผ่านใหม่เรียบร้อยแล้ว (Local Mode)', 'success');
    return true;
  };

  /**
   * ออกจากระบบ (Logout)
   */
  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('SignOut error:', e);
      }
    }
    setSession(null);
    setCurrentUser(null);
    localStorage.removeItem('ttc_auth_user');
    showToast('ออกจากระบบเรียบร้อยแล้ว', 'info');
  };

  /**
   * Fast Demo Login (1-Click Switcher)
   */
  const fastDemoLogin = (role) => {
    const userMatch = INITIAL_USERS.find(u => u.role === role) || {
      id: `usr_${role}_custom`,
      name: role === 'admin' ? 'นายอนุชา พัฒนากูล' : role === 'executive' ? 'ดร.ชาญชัย ชาญวิทย์' : 'อ.สมคิด วิริยะจิตต์',
      email: role === 'admin' ? 'admin.plan@ttc.ac.th' : role === 'executive' ? 'director@ttc.ac.th' : 'somkid@ttc.ac.th',
      role,
      departmentId: role === 'user' ? 'dept_elec' : 'dept_plan',
      departmentName: role === 'user' ? 'แผนกวิชาช่างไฟฟ้ากำลัง' : 'งานพัฒนายุทธศาสตร์และแผนงาน',
      position: role === 'admin' ? 'หัวหน้างานพัฒนายุทธศาสตร์ แผนงาน และงบประมาณ' : role === 'executive' ? 'ผู้อำนวยการวิทยาลัยเทคนิค' : 'ครูชำนาญการพิเศษ',
      avatar: INITIAL_USERS.find(u => u.role === role)?.avatar || ''
    };
    setCurrentUser(userMatch);
    showToast(`เข้าสู่ระบบโหมดทดสอบ: ${getRoleLabel(role)}`, 'success');
  };

  const switchRole = (role) => {
    fastDemoLogin(role);
  };

  const setDepartment = (deptId) => {
    const dept = DEPARTMENTS.find(d => d.id === deptId);
    if (dept) {
      setCurrentUser(prev => ({
        ...prev,
        departmentId: dept.id,
        departmentName: dept.name
      }));
      showToast(`เปลี่ยนแผนกวิชาเป็น: ${dept.name}`, 'info');
    }
  };

  const showToast = (message, type = 'success') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'เจ้าหน้าที่ฝ่ายยุทธศาสตร์ฯ (Admin)';
      case 'executive': return 'ผู้บริหารสถานศึกษา (Executive)';
      default: return 'ผู้ใช้งานทั่วไป (ครู / แผนก / บุคลากร)';
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      setCurrentUser,
      session,
      loading,
      isAuthenticated: Boolean(currentUser),
      login,
      register,
      updatePassword,
      logout,
      fastDemoLogin,
      switchRole,
      setDepartment,
      tvMode,
      setTvMode,
      toggleTvMode: () => setTvMode(prev => !prev),
      activeFiscalYear,
      setActiveFiscalYear,
      notification,
      showToast,
      getRoleLabel,
      isSupabaseConfigured
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
