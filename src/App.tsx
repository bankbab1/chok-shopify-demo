import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import SectionPage from './pages/SectionPage';
import TopicPage from './pages/TopicPage';
import ResourcesPage from './pages/ResourcesPage';
import HelpPage from './pages/HelpPage';
import PresentationPage from './pages/PresentationPage';
import ExamplesPage from './pages/ExamplesPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="examples" element={<ExamplesPage />} />
        <Route path="present" element={<PresentationPage />} />
        <Route path="present/:slide" element={<PresentationPage />} />
        <Route path=":sectionId" element={<SectionPage />} />
        <Route path=":sectionId/:topicId" element={<TopicPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
