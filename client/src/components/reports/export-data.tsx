import { useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Appointment, MedicalRecord, Reminder, User } from '@shared/schema';

export type ExportableDataType = 'appointments' | 'records' | 'patients' | 'reminders';

interface ExportDataDialogProps {
  dataType: ExportableDataType;
  data: Appointment[] | MedicalRecord[] | User[] | Reminder[];
  variant?: 'default' | 'outline' | 'inline';
  buttonText?: string;
}

// Fonction utilitaire pour convertir les données en CSV
function convertToCSV(data: any[]): string {
  if (!data || data.length === 0) return '';
  
  // Obtenir les en-têtes (noms des colonnes) à partir des clés du premier objet
  const headers = Object.keys(data[0]).filter(key => 
    // Filtrer certains champs qui ne devraient pas être exportés
    !['password', 'id', '__v', 'createdAt', 'updatedAt'].includes(key)
  );
  
  // Ajouter la ligne d'en-tête
  const csvRows = [headers.join(',')];
  
  // Ajouter les lignes de données
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header as keyof typeof row];
      
      // Gérer les types de données spéciaux
      if (value === null || value === undefined) return '';
      if (value instanceof Date) return value.toISOString();
      if (typeof value === 'object') return JSON.stringify(value);
      
      // Échapper les virgules et les guillemets pour le format CSV
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      
      return stringValue;
    });
    
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

// Fonction utilitaire pour convertir les données en JSON
function convertToJSON(data: any[]): string {
  // Créer une copie profonde des données et enlever les champs sensibles
  const sanitizedData = data.map(item => {
    const sanitized = { ...item };
    delete sanitized.password;
    return sanitized;
  });
  
  return JSON.stringify(sanitizedData, null, 2);
}

// Fonction utilitaire pour convertir les données en PDF (simulation)
function preparePDFExport(data: any[], title: string): void {
  // Dans une version réelle, nous utiliseirions une bibliothèque comme jsPDF
  // Mais pour l'instant, nous simulons juste l'exportation
  alert(`La fonctionnalité d'exportation PDF sera bientôt disponible. Données à exporter: ${title} (${data.length} éléments)`);
}

// Fonction utilitaire pour télécharger un fichier
function downloadFile(content: string, fileName: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

export function ExportDataDialog({ 
  dataType, 
  data, 
  variant = 'default',
  buttonText = 'Exporter les données'
}: ExportDataDialogProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [fileFormat, setFileFormat] = useState<'csv' | 'json' | 'pdf'>('csv');
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [open, setOpen] = useState(false);
  
  const dataTypeLabels: Record<ExportableDataType, string> = {
    appointments: 'Rendez-vous',
    records: 'Dossiers médicaux',
    patients: 'Patients',
    reminders: 'Rappels'
  };
  
  const handleExport = async () => {
    if (!data || data.length === 0) {
      toast({
        title: "Aucune donnée à exporter",
        description: "Il n'y a pas de données disponibles pour l'exportation.",
        variant: "destructive"
      });
      return;
    }
    
    setIsExporting(true);
    
    try {
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `telemed_${dataType}_${timestamp}`;
      
      if (fileFormat === 'csv') {
        const csvContent = convertToCSV(data);
        downloadFile(csvContent, `${fileName}.csv`, 'text/csv');
      } else if (fileFormat === 'json') {
        const jsonContent = convertToJSON(data);
        downloadFile(jsonContent, `${fileName}.json`, 'application/json');
      } else if (fileFormat === 'pdf') {
        preparePDFExport(data, dataTypeLabels[dataType]);
        // Dans une version réelle, nous appellerions une fonction pour générer un PDF
      }
      
      toast({
        title: "Exportation réussie",
        description: `Les données ont été exportées au format ${fileFormat.toUpperCase()}.`,
      });
      
      setOpen(false);
    } catch (error) {
      console.error('Erreur lors de l\'exportation:', error);
      toast({
        title: "Erreur d'exportation",
        description: "Une erreur s'est produite lors de l'exportation des données.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Exporter les {dataTypeLabels[dataType].toLowerCase()}</DialogTitle>
          <DialogDescription>
            Choisissez le format d'exportation et les options souhaitées.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="format">Format</Label>
            <Select
              value={fileFormat}
              onValueChange={(value) => setFileFormat(value as 'csv' | 'json' | 'pdf')}
            >
              <SelectTrigger id="format">
                <SelectValue placeholder="Sélectionner un format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV (tableur)</SelectItem>
                <SelectItem value="json">JSON (données)</SelectItem>
                <SelectItem value="pdf">PDF (document)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeHeaders"
              checked={includeHeaders}
              onCheckedChange={(checked) => setIncludeHeaders(checked as boolean)}
            />
            <Label htmlFor="includeHeaders">Inclure les en-têtes</Label>
          </div>
          
          <div className="flex items-center px-4 py-3 border rounded-md bg-muted/50">
            <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Données à exporter</p>
              <p className="text-xs text-muted-foreground">
                {data.length} {dataTypeLabels[dataType].toLowerCase()}
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exportation...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Exporter
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}