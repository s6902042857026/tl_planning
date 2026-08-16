import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../data/mockData';
import { DEPARTMENTS } from '../data/kpiStructure';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ttc_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse auth user', e);
      }
    }
    return INITIAL_USERS[0]; // Default to general user
  });

  const [tvMode, setTvMode] = useState(false);
  const [activeFiscalYear, setActiveFiscalYear] = useState('2568');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    localStorage.setItem('ttc_auth_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const switchRole = (role) => {
    const userMatch = INITIAL_USERS.find(u => u.role === role) || {
      id: `usr_${role}_custom`,
      name: role === 'admin' ? 'เจ้าหน้าที่ฝ่ายแผนงาน' : role === 'executive' ? 'ท่านผู้อำนวยการ' : 'ครูผู้สอน / เจ้าหน้าที่',
      email: `${role}@ttc.ac.th`,
      role,
      departmentId: role === 'user' ? 'dept_elec' : 'dept_plan',
      departmentName: role === 'user' ? 'แผนกวิชาช่างไฟฟ้ากำลัง' : 'งานพัฒนายุทธศาสตร์และแผนงาน',
      position: role === 'admin' ? 'เจ้าหน้าที่ยุทธศาสตร์ฯ' : role === 'executive' ? 'ผู้บริหารสถานศึกษา' : 'ผู้รายงานตัวชี้วัด',
      avatar: INITIAL_USERS.find(u => u.role === role)?.avatar || ''
    };
    setCurrentUser(userMatch);
    showToast(`สลับบทบาทเป็น: ${getRoleLabel(role)} เรียบร้อยแล้ว`, 'info');
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
      default: return 'ผู้ใช้งานทั่วไป (ครู / แผนก / นักเรียน)';
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      setCurrentUser,
      switchRole,
      setDepartment,
      tvMode,
      setTvMode,
      toggleTvMode: () => setTvMode(prev => !prev),
      activeFiscalYear,
      setActiveFiscalYear,
      notification,
      showToast,
      getRoleLabel
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
