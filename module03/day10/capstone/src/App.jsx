import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './screens/Dashboard';
import PatientList from './screens/PatientList';
import PatientDetail from './screens/PatientDetail';
import PrescriptionQueue from './screens/PrescriptionQueue';
import DispenseAudit from './screens/DispenseAudit';
import NotFound from './screens/NotFound';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Five reachable core routes */}
          <Route index element={<Dashboard />} />
          <Route path="patients" element={<PatientList />} />
          <Route path="patients/:id" element={<PatientDetail />} />
          <Route path="prescriptions" element={<PrescriptionQueue />} />
          <Route path="dispense" element={<DispenseAudit />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
