import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

const SessionContext = createContext();
export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState({ studentId: null, parentId: null });

  useEffect(() => {
    let studentId = Cookies.get('student_id');
    let parentId = Cookies.get('parent_id');

    if (!studentId || !parentId) {
      // Set default values if cookies are missing
      studentId = '1001';
      parentId = '1';
      Cookies.set('student_id', studentId, { expires: 30, secure: true, sameSite: 'Strict' });
      Cookies.set('parent_id', parentId, { expires: 30, secure: true, sameSite: 'Strict' });
    }

    // Ensure values are stored as numbers
    const parsedSession = {
      studentId: parseInt(studentId, 10),
      parentId: parseInt(parentId, 10),
    };

    setSession(parsedSession);
    sessionStorage.setItem('session', JSON.stringify(parsedSession));
  }, []);

  useEffect(() => {
    // Update sessionStorage only if session state changes
    if (session.studentId !== null && session.parentId !== null) {
      sessionStorage.setItem('session', JSON.stringify(session));
    }
  }, [session]);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};