import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { LeadsPage } from './pages/LeadsPage';
import { ContactsPage } from './pages/ContactsPage';
import { SettingsPage } from './pages/SettingsPage';
import { SalesWarRoomPage } from './pages/SalesWarRoomPage';
import { CalendarPage } from './pages/CalendarPage';
import { FieldOpsPage } from './pages/FieldOpsPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { JobsPage } from './pages/JobsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="war-room" element={<SalesWarRoomPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="field-ops" element={<FieldOpsPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
