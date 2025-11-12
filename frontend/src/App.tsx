import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import Layout from './components/layout/Layout';
import MapPage from './pages/MapPage';
import AddCityPage from './pages/AddCityPage';
import CityDetailPage from './pages/CityDetailPage';
import CityListPage from './pages/CityListPage';

function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/cities" element={<CityListPage />} />
          <Route path="/cities/add" element={<AddCityPage />} />
          <Route path="/cities/:id" element={<CityDetailPage />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  );
}

export default App;

