import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  FileSpreadsheet, 
  FileText, 
  Database, 
  Users,
  Calendar, 
  Bell, 
  ChevronDown,
  ChevronUp
} from 'lucide-react';

import { fetchAppointments, fetchMedicalRecords, fetchPatients, fetchReminders } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExportDataDialog } from '@/components/reports/export-data';
import { ReportGenerator } from '@/components/reports/report-generator';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [expandedSection, setExpandedSection] = useState<string | null>('appointments');
  
  // Récupération des données nécessaires pour les rapports
  const { data: appointments = [], isLoading: isLoadingAppointments } = useQuery({
    queryKey: ['/api/appointments'],
    queryFn: () => fetchAppointments(),
  });
  
  const { data: records = [], isLoading: isLoadingRecords } = useQuery({
    queryKey: ['/api/records'],
    queryFn: () => fetchMedicalRecords(),
  });
  
  const { data: patients = [], isLoading: isLoadingPatients } = useQuery({
    queryKey: ['/api/patients'],
    queryFn: () => fetchPatients(),
  });
  
  const { data: reminders = [], isLoading: isLoadingReminders } = useQuery({
    queryKey: ['/api/reminders'],
    queryFn: () => fetchReminders(),
  });
  
  // Fonction pour basculer l'expansion d'une section
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Rapports et exports</h1>
          <p className="text-muted-foreground">
            Générez et exportez des rapports pour différentes catégories de données
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 print:hidden">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => window.print()}
          >
            <FileText className="h-4 w-4" />
            Imprimer la page
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={() => {
              // Dans une version réelle, on exporterait tout le tableau de bord
              alert('Exporter tout le tableau de bord');
            }}
          >
            <Database className="h-4 w-4" />
            Exporter tout
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full print:hidden">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
          <TabsTrigger value="exports">Exportations</TabsTrigger>
        </TabsList>
        
        {/* Onglet Aperçu */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques des données</CardTitle>
              <CardDescription>
                Vue d'ensemble des données disponibles pour l'exportation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Rendez-vous"
                  count={appointments.length}
                  icon={<Calendar className="h-5 w-5 text-blue-500" />}
                  color="bg-blue-50 dark:bg-blue-950"
                />
                <StatCard
                  title="Dossiers médicaux"
                  count={records.length}
                  icon={<FileText className="h-5 w-5 text-green-500" />}
                  color="bg-green-50 dark:bg-green-950"
                />
                <StatCard
                  title="Patients"
                  count={patients.length}
                  icon={<Users className="h-5 w-5 text-purple-500" />}
                  color="bg-purple-50 dark:bg-purple-950"
                />
                <StatCard
                  title="Rappels"
                  count={reminders.length}
                  icon={<Bell className="h-5 w-5 text-amber-500" />}
                  color="bg-amber-50 dark:bg-amber-950"
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Section Rendez-vous */}
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('appointments')}>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Rendez-vous
                </CardTitle>
                {expandedSection === 'appointments' ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <CardDescription>
                Gérez et exportez les données des rendez-vous
              </CardDescription>
            </CardHeader>
            {expandedSection === 'appointments' && (
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{appointments.length} rendez-vous au total</h3>
                      <p className="text-sm text-muted-foreground">
                        {appointments.filter(a => new Date(a.datetime) > new Date()).length} à venir, 
                        {appointments.filter(a => a.status === 'completed').length} terminés
                      </p>
                    </div>
                    <ExportDataDialog 
                      dataType="appointments"
                      data={appointments}
                      buttonText="Exporter les rendez-vous"
                    />
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-2 text-left text-xs uppercase">ID</th>
                          <th className="px-4 py-2 text-left text-xs uppercase">Patient</th>
                          <th className="px-4 py-2 text-left text-xs uppercase">Date</th>
                          <th className="px-4 py-2 text-left text-xs uppercase">Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.slice(0, 5).map((appointment) => (
                          <tr key={appointment.id} className="border-b">
                            <td className="px-4 py-2 text-sm">{appointment.id}</td>
                            <td className="px-4 py-2 text-sm">{appointment.patientName || `Patient #${appointment.patient}`}</td>
                            <td className="px-4 py-2 text-sm">{new Date(appointment.datetime).toLocaleDateString()}</td>
                            <td className="px-4 py-2 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                appointment.status === 'canceled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {appointment.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
          
          {/* Section Dossiers médicaux */}
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('records')}>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-500" />
                  Dossiers médicaux
                </CardTitle>
                {expandedSection === 'records' ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <CardDescription>
                Gérez et exportez les dossiers médicaux
              </CardDescription>
            </CardHeader>
            {expandedSection === 'records' && (
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{records.length} dossiers médicaux au total</h3>
                      <p className="text-sm text-muted-foreground">
                        Dernière mise à jour: {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <ExportDataDialog 
                      dataType="records"
                      data={records}
                      buttonText="Exporter les dossiers"
                    />
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-2 text-left text-xs uppercase">ID</th>
                          <th className="px-4 py-2 text-left text-xs uppercase">Patient</th>
                          <th className="px-4 py-2 text-left text-xs uppercase">Date</th>
                          <th className="px-4 py-2 text-left text-xs uppercase">Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {records.slice(0, 5).map((record) => (
                          <tr key={record.id} className="border-b">
                            <td className="px-4 py-2 text-sm">{record.id}</td>
                            <td className="px-4 py-2 text-sm">{record.patientName || `Patient #${record.patient}`}</td>
                            <td className="px-4 py-2 text-sm">{new Date(record.date).toLocaleDateString()}</td>
                            <td className="px-4 py-2 text-sm">{record.type || 'Général'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>
        
        {/* Onglet Rapports */}
        <TabsContent value="reports" className="space-y-4">
          <ReportGenerator 
            dataType="appointments"
            data={appointments}
            title="Rapport de rendez-vous"
            description="Générez et filtrez des rapports détaillés sur les rendez-vous"
          />
        </TabsContent>
        
        {/* Onglet Exportations */}
        <TabsContent value="exports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exportation de données</CardTitle>
              <CardDescription>
                Exportez différents types de données dans plusieurs formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ExportCard 
                  title="Rendez-vous"
                  icon={<Calendar className="h-5 w-5 text-blue-500" />}
                  count={appointments.length}
                  dataType="appointments"
                  data={appointments}
                />
                
                <ExportCard 
                  title="Dossiers médicaux"
                  icon={<FileText className="h-5 w-5 text-green-500" />}
                  count={records.length}
                  dataType="records"
                  data={records}
                />
                
                <ExportCard 
                  title="Patients"
                  icon={<Users className="h-5 w-5 text-purple-500" />}
                  count={patients.length}
                  dataType="patients"
                  data={patients}
                />
                
                <ExportCard 
                  title="Rappels"
                  icon={<Bell className="h-5 w-5 text-amber-500" />}
                  count={reminders.length}
                  dataType="reminders"
                  data={reminders}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Version imprimable */}
      <div className="hidden print:block space-y-6">
        <h1 className="text-2xl font-bold">Rapports TELEMED</h1>
        <p className="text-muted-foreground">
          Généré le {new Date().toLocaleDateString()} à {new Date().toLocaleTimeString()}
        </p>
        
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Résumé des rendez-vous</h2>
            <div className="overflow-x-auto">
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left border">ID</th>
                    <th className="px-4 py-2 text-left border">Patient</th>
                    <th className="px-4 py-2 text-left border">Médecin</th>
                    <th className="px-4 py-2 text-left border">Date</th>
                    <th className="px-4 py-2 text-left border">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="border">
                      <td className="px-4 py-2 border text-sm">{appointment.id}</td>
                      <td className="px-4 py-2 border text-sm">{appointment.patientName || `Patient #${appointment.patient}`}</td>
                      <td className="px-4 py-2 border text-sm">{appointment.doctorName || `Médecin #${appointment.doctor}`}</td>
                      <td className="px-4 py-2 border text-sm">{new Date(appointment.datetime).toLocaleDateString()}</td>
                      <td className="px-4 py-2 border text-sm">{appointment.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Résumé des dossiers médicaux</h2>
            <div className="overflow-x-auto">
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left border">ID</th>
                    <th className="px-4 py-2 text-left border">Patient</th>
                    <th className="px-4 py-2 text-left border">Date</th>
                    <th className="px-4 py-2 text-left border">Type</th>
                    <th className="px-4 py-2 text-left border">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id} className="border">
                      <td className="px-4 py-2 border text-sm">{record.id}</td>
                      <td className="px-4 py-2 border text-sm">{record.patientName || `Patient #${record.patient}`}</td>
                      <td className="px-4 py-2 border text-sm">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2 border text-sm">{record.type || 'Général'}</td>
                      <td className="px-4 py-2 border text-sm">{record.description || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Ce rapport est confidentiel et destiné uniquement à un usage interne</p>
          <p>TELEMED © {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}

// Composant de carte statistique
function StatCard({ 
  title, 
  count, 
  icon, 
  color 
}: { 
  title: string; 
  count: number; 
  icon: React.ReactNode; 
  color: string;
}) {
  return (
    <div className={`${color} rounded-lg p-4 border`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{count}</h3>
        </div>
        <div className="p-2 rounded-full bg-background/50">
          {icon}
        </div>
      </div>
    </div>
  );
}

// Composant de carte d'exportation
function ExportCard({ 
  title, 
  icon, 
  count, 
  dataType, 
  data 
}: { 
  title: string; 
  icon: React.ReactNode; 
  count: number;
  dataType: 'appointments' | 'records' | 'patients' | 'reminders';
  data: any[];
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-muted">
              {icon}
            </div>
            <div>
              <h3 className="font-medium">{title}</h3>
              <p className="text-sm text-muted-foreground">{count} éléments</p>
            </div>
          </div>
          <ExportDataDialog 
            dataType={dataType}
            data={data}
            variant="outline"
            buttonText="Exporter"
          />
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
            <span>Formats: CSV, JSON, PDF</span>
          </div>
          <span className="text-muted-foreground">Dernière mise à jour: {new Date().toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}