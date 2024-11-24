import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  Building2,
  MapPin
} from 'lucide-react';
import { Company, Headquarter } from "../types/Setting";
import GeneralSettings from "../components/Settings/GeneralSettings";
import CompanySection from "../components/Settings/CompanySection";
import HeadquarterSection from "../components/Settings/HeadquarterSection";
import { useAuth } from "../contexts/AuthContext";
import { settingsService } from "../services/settings";

const menuItems = [
  { id: 'general', label: 'Configuración General', icon: SettingsIcon },
  { id: 'companies', label: 'Gestión de Empresas', icon: Building2 },
  { id: 'headquarters', label: 'Gestión de Sedes', icon: MapPin },
];

const initialSettings = {
  orderEndTime: '20:00',
};

const initialCompany: Company = {
  name: '',
  state: 'Activo'
};

const initialHeadquarter: Headquarter = {
  name: '',
  state: 'Activo'
};

export default function Settings() {
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState(initialSettings);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [headquarters, setHeadquarters] = useState<Headquarter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newCompany, setNewCompany] = useState<Company>(initialCompany);
  const [newHeadquarter, setNewHeadquarter] = useState<Headquarter>(initialHeadquarter);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (userRole !== 'admin') {
      navigate('/');
      return;
    }

    loadData();
  }, [isAuthenticated, userRole, navigate]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [companiesData, headquartersData] = await Promise.all([
        settingsService.getCompanies(),
        settingsService.getHeadquarters()
      ]);
      setCompanies(Array.isArray(companiesData) ? companiesData : []);
      setHeadquarters(Array.isArray(headquartersData) ? headquartersData : []);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Error al cargar los datos. Por favor, intente nuevamente.');
      setCompanies([]);
      setHeadquarters([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await settingsService.updateCutoffTime(settings.orderEndTime);
      alert('Configuración actualizada exitosamente');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Error al actualizar la configuración');
    }
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.name.trim()) {
      alert('Por favor ingrese un nombre de empresa válido');
      return;
    }
    try {
      await settingsService.createCompany(newCompany);
      setNewCompany(initialCompany);
      loadData();
      alert('Empresa creada exitosamente');
    } catch (error) {
      console.error('Error creating company:', error);
      alert('Error al crear la empresa');
    }
  };

  const handleHeadquarterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHeadquarter.name.trim()) {
      alert('Por favor ingrese un nombre de sede válido');
      return;
    }
    try {
      await settingsService.createHeadquarter(newHeadquarter);
      setNewHeadquarter(initialHeadquarter);
      loadData();
      alert('Sede creada exitosamente');
    } catch (error) {
      console.error('Error creating headquarter:', error);
      alert('Error al crear la sede');
    }
  };

  const handleUpdateCompany = async (id: number, name: string) => {
    if (!name.trim()) {
      alert('Por favor ingrese un nombre válido');
      return;
    }
    try {
      const company = companies.find(c => c.id === id);
      if (company) {
        await settingsService.updateCompany(id, { ...company, name });
        loadData();
        alert('Empresa actualizada exitosamente');
      }
    } catch (error) {
      console.error('Error updating company:', error);
      alert('Error al actualizar la empresa');
    }
  };

  const handleUpdateHeadquarter = async (id: number, name: string) => {
    if (!name.trim()) {
      alert('Por favor ingrese un nombre válido');
      return;
    }
    try {
      const headquarter = headquarters.find(h => h.id === id);
      if (headquarter) {
        await settingsService.updateHeadquarter(id, { ...headquarter, name });
        loadData();
        alert('Sede actualizada exitosamente');
      }
    } catch (error) {
      console.error('Error updating headquarter:', error);
      alert('Error al actualizar la sede');
    }
  };

  const toggleCompanyState = async (company: Company) => {
    if (!company.id) return;
    try {
      await settingsService.updateCompany(company.id, {
        ...company,
        state: company.state === 'Activo' ? 'Inactivo' : 'Activo'
      });
      loadData();
    } catch (error) {
      console.error('Error updating company:', error);
      alert('Error al actualizar la empresa');
    }
  };

  const toggleHeadquarterState = async (headquarter: Headquarter) => {
    if (!headquarter.id) return;
    try {
      await settingsService.updateHeadquarter(headquarter.id, {
        ...headquarter,
        state: headquarter.state === 'Activo' ? 'Inactivo' : 'Activo'
      });
      loadData();
    } catch (error) {
      console.error('Error updating headquarter:', error);
      alert('Error al actualizar la sede');
    }
  };

  if (!isAuthenticated || userRole !== 'admin') {
    return null;
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full lg:w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit">
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                      <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`w-full flex items-center space-x-3 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                              activeTab === item.id
                                  ? 'bg-indigo-50 text-indigo-600'
                                  : 'text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                {error && (
                    <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
                      {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                    </div>
                ) : (
                    <>
                      {activeTab === 'general' && (
                          <GeneralSettings
                              orderEndTime={settings.orderEndTime}
                              onTimeChange={(time) => setSettings({ ...settings, orderEndTime: time })}
                              onSubmit={handleGeneralSubmit}
                          />
                      )}

                      {activeTab === 'companies' && (
                          <CompanySection
                              companies={companies}
                              newCompany={newCompany}
                              onNewCompanyChange={setNewCompany}
                              onSubmit={handleCompanySubmit}
                              onToggleState={toggleCompanyState}
                              onUpdateCompany={handleUpdateCompany}
                          />
                      )}

                      {activeTab === 'headquarters' && (
                          <HeadquarterSection
                              headquarters={headquarters}
                              newHeadquarter={newHeadquarter}
                              onNewHeadquarterChange={setNewHeadquarter}
                              onSubmit={handleHeadquarterSubmit}
                              onToggleState={toggleHeadquarterState}
                              onUpdateHeadquarter={handleUpdateHeadquarter}
                          />
                      )}
                    </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}