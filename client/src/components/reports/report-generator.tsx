import { useState } from 'react';
import { FileSpreadsheet, Filter, Printer, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { ExportDataDialog, ExportableDataType } from './export-data';
import { Appointment, MedicalRecord, Reminder, User } from '@shared/schema';

interface ReportGeneratorProps {
  dataType: ExportableDataType;
  data: Appointment[] | MedicalRecord[] | User[] | Reminder[];
  title: string;
  description?: string;
}

export function ReportGenerator({ 
  dataType, 
  data, 
  title, 
  description 
}: ReportGeneratorProps) {
  const [reportType, setReportType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [filteredData, setFilteredData] = useState<any[]>(data);
  
  // Options de rapports en fonction du type de données
  const reportOptions = {
    appointments: [
      { value: 'all', label: 'Tous les rendez-vous' },
      { value: 'upcoming', label: 'Rendez-vous à venir' },
      { value: 'past', label: 'Rendez-vous passés' },
      { value: 'canceled', label: 'Rendez-vous annulés' }
    ],
    records: [
      { value: 'all', label: 'Tous les dossiers' },
      { value: 'recent', label: 'Dossiers récents' },
      { value: 'critical', label: 'Cas critiques' }
    ],
    patients: [
      { value: 'all', label: 'Tous les patients' },
      { value: 'active', label: 'Patients actifs' },
      { value: 'inactive', label: 'Patients inactifs' }
    ],
    reminders: [
      { value: 'all', label: 'Tous les rappels' },
      { value: 'upcoming', label: 'Rappels à venir' },
      { value: 'past', label: 'Rappels passés' },
      { value: 'sent', label: 'Rappels envoyés' }
    ]
  };
  
  // Fonction pour générer et filtrer les données du rapport
  const generateReport = () => {
    setIsGenerating(true);
    
    // Simuler un délai de traitement
    setTimeout(() => {
      let results = [...data];
      
      // Filtrer par type de rapport
      if (reportType !== 'all') {
        if (dataType === 'appointments') {
          const appointments = data as Appointment[];
          if (reportType === 'upcoming') {
            results = appointments.filter(a => new Date(a.datetime) > new Date());
          } else if (reportType === 'past') {
            results = appointments.filter(a => new Date(a.datetime) < new Date());
          } else if (reportType === 'canceled') {
            results = appointments.filter(a => a.status === 'canceled');
          }
        } 
        else if (dataType === 'reminders') {
          const reminders = data as Reminder[];
          if (reportType === 'upcoming') {
            results = reminders.filter(r => new Date(r.datetime) > new Date());
          } else if (reportType === 'past') {
            results = reminders.filter(r => new Date(r.datetime) < new Date());
          } else if (reportType === 'sent') {
            results = reminders.filter(r => r.status === 'sent');
          }
        }
      }
      
      // Filtrer par plage de dates si applicable
      if (dateRange.start || dateRange.end) {
        results = results.filter((item: any) => {
          let itemDate: Date;
          
          if ('datetime' in item) {
            itemDate = new Date(item.datetime);
          } else if ('date' in item) {
            itemDate = new Date(item.date);
          } else if ('createdAt' in item) {
            itemDate = new Date(item.createdAt);
          } else {
            // Si aucune date n'est disponible, conserver l'élément
            return true;
          }
          
          const isAfterStart = !dateRange.start || itemDate >= dateRange.start;
          const isBeforeEnd = !dateRange.end || itemDate <= dateRange.end;
          
          return isAfterStart && isBeforeEnd;
        });
      }
      
      setFilteredData(results);
      setIsGenerating(false);
    }, 600);
  };
  
  // Réinitialiser les filtres
  const resetFilters = () => {
    setReportType('all');
    setDateRange({});
    setFilteredData(data);
  };
  
  // Imprimer le rapport
  const printReport = () => {
    window.print();
  };
  
  return (
    <Card className="print:shadow-none">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="report-type">Type de rapport</Label>
            <Select
              value={reportType}
              onValueChange={setReportType}
            >
              <SelectTrigger id="report-type">
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                {reportOptions[dataType].map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Date de début</Label>
            <DatePicker
              selected={dateRange.start}
              onSelect={(date) => setDateRange(prev => ({ ...prev, start: date }))}
              placeholderText="Sélectionner une date"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Date de fin</Label>
            <DatePicker
              selected={dateRange.end}
              onSelect={(date) => setDateRange(prev => ({ ...prev, end: date }))}
              placeholderText="Sélectionner une date"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Réinitialiser
          </Button>
          <Button
            size="sm"
            onClick={generateReport}
            disabled={isGenerating}
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            Filtrer
          </Button>
        </div>
        
        <div className="bg-accent/30 p-4 rounded-md print:bg-transparent">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Résultats ({filteredData.length})</h3>
            <div className="text-sm text-muted-foreground">
              {dataType === 'appointments' && 'Rendez-vous trouvés'}
              {dataType === 'records' && 'Dossiers trouvés'}
              {dataType === 'patients' && 'Patients trouvés'}
              {dataType === 'reminders' && 'Rappels trouvés'}
            </div>
          </div>
          
          {filteredData.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Aucun résultat ne correspond aux critères sélectionnés
            </div>
          ) : (
            <div className="overflow-x-auto">
              <DataTable data={filteredData} dataType={dataType} />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between print:hidden">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={printReport}
            className="flex items-center gap-1"
          >
            <Printer className="h-4 w-4" />
            Imprimer
          </Button>
          <ExportDataDialog
            dataType={dataType}
            data={filteredData}
            variant="outline"
            buttonText="Exporter"
          />
        </div>
        <div className="text-xs text-muted-foreground">
          Généré le {new Date().toLocaleDateString()} à {new Date().toLocaleTimeString()}
        </div>
      </CardFooter>
    </Card>
  );
}

// Composant de tableau pour afficher les données
function DataTable({ data, dataType }: { data: any[], dataType: ExportableDataType }) {
  // Déterminer les colonnes à afficher selon le type de données
  const getColumns = () => {
    switch (dataType) {
      case 'appointments':
        return ['ID', 'Patient', 'Médecin', 'Date', 'Heure', 'Statut'];
      case 'records':
        return ['ID', 'Patient', 'Date', 'Type', 'Description'];
      case 'patients':
        return ['ID', 'Nom', 'Email', 'Téléphone', 'Adresse'];
      case 'reminders':
        return ['ID', 'Patient', 'Date', 'Heure', 'Message', 'Statut'];
      default:
        return ['ID', 'Nom', 'Description'];
    }
  };
  
  // Extraire les valeurs des données selon le type
  const getRowValues = (item: any) => {
    switch (dataType) {
      case 'appointments':
        const apptDate = new Date(item.datetime);
        return [
          item.id,
          item.patientName || `Patient #${item.patient}`,
          item.doctorName || `Médecin #${item.doctor}`,
          apptDate.toLocaleDateString(),
          apptDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          getStatusLabel(item.status)
        ];
      case 'records':
        return [
          item.id,
          item.patientName || `Patient #${item.patient}`,
          new Date(item.date).toLocaleDateString(),
          item.type || 'Général',
          item.description || 'N/A'
        ];
      case 'patients':
        return [
          item.id,
          item.name || `${item.username || 'Utilisateur'}`,
          item.email || 'N/A',
          item.phone || 'N/A',
          item.address || 'N/A'
        ];
      case 'reminders':
        const reminderDate = new Date(item.datetime);
        return [
          item.id,
          item.patientName || `Patient #${item.patient}`,
          reminderDate.toLocaleDateString(),
          reminderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          item.message || 'N/A',
          getStatusLabel(item.status)
        ];
      default:
        return [item.id, item.name || 'N/A', item.description || 'N/A'];
    }
  };
  
  // Afficher un libellé pour les statuts
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmé';
      case 'pending':
        return 'En attente';
      case 'canceled':
        return 'Annulé';
      case 'completed':
        return 'Terminé';
      case 'sent':
        return 'Envoyé';
      case 'read':
        return 'Lu';
      default:
        return status || 'N/A';
    }
  };
  
  const columns = getColumns();
  
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-muted/50 print:bg-gray-100">
          {columns.map((col, index) => (
            <th key={index} className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, rowIndex) => (
          <tr 
            key={rowIndex} 
            className={`${rowIndex % 2 === 0 ? 'bg-background' : 'bg-muted/20'} print:border-b`}
          >
            {getRowValues(item).map((value, colIndex) => (
              <td key={colIndex} className="px-4 py-2 text-sm">
                {value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}