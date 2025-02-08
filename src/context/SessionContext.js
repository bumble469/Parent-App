import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

const SessionContext = createContext();
export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const studentIdCookie = Cookies.get('student_id');
    
    // If the cookie does not exist, create it and set session
    if (!studentIdCookie) {
      const newStudentId = '1001'; // Set a default student ID or generate one
      Cookies.set('student_id', newStudentId, { expires: 30, secure: true, sameSite: 'Strict' });
      sessionStorage.setItem('session', newStudentId);
      setSession(newStudentId);
    } else {
      // If the cookie exists, set the session from cookie value
      setSession(studentIdCookie);
      sessionStorage.setItem('session', studentIdCookie);
    }
  }, []);

  useEffect(() => {
    // Update session storage whenever session state changes
    if (session) {
      sessionStorage.setItem('session', session); 
    }
  }, [session]);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};
