import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Plus, User, Eye, Edit, BarChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchPatients } from '@/lib/api';

export default function Patients() {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch patients (users with is_patient=true)
  const { data: patients, isLoading } = useQuery({
    queryKey: ['/api/patients'],
    queryFn: fetchPatients
  });

  // Filter patients by search query
  const filteredPatients = patients?.filter(patient => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    
    return (
      patient.username.toLowerCase().includes(searchLower) ||
      patient.email.toLowerCase().includes(searchLower)
    );
  }) || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card>
          <CardHeader className="border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-500" />
              Patients
            </CardTitle>
            <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <Search className="h-4 w-4" />
                </div>
              </div>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" /> Ajouter un patient
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dossier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dernier RDV
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4 whitespace-nowrap"><div className="h-10 bg-gray-200 rounded w-full"></div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="h-6 bg-gray-200 rounded w-16"></div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="h-8 bg-gray-200 rounded w-20"></div></td>
                      </tr>
                    ))
                  ) : filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                              <User className="h-5 w-5" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{patient.username}</div>
                              <div className="text-sm text-gray-500">ID: #{patient.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                          {patient.recordCount || 0} records
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient.lastAppointment ? new Date(patient.lastAppointment).toLocaleDateString() : 'No appointments'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-900" title="Edit">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900" title="View Profile">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        Aucun patient trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Card>
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-blue-500" />
              Statistiques
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Patients par groupe d'age</h3>
              <div className="h-48 bg-gray-50 rounded-md p-4 flex items-end space-x-2">
                <div className="flex-1 flex flex-col items-center">
                  <div className="bg-blue-500 w-full rounded-t-md" style={{ height: '30%' }}></div>
                  <span className="text-xs mt-1">0-18</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="bg-blue-500 w-full rounded-t-md" style={{ height: '60%' }}></div>
                  <span className="text-xs mt-1">19-35</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="bg-blue-500 w-full rounded-t-md" style={{ height: '85%' }}></div>
                  <span className="text-xs mt-1">36-50</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="bg-blue-500 w-full rounded-t-md" style={{ height: '50%' }}></div>
                  <span className="text-xs mt-1">51-65</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="bg-blue-500 w-full rounded-t-md" style={{ height: '40%' }}></div>
                  <span className="text-xs mt-1">65+</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Actifs vs. Patients inactifs</h3>
              <div className="bg-gray-50 rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium">Actifs</span>
                  <span className="text-xs font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
                
                <div className="flex items-center justify-between mb-2 mt-4">
                  <span className="text-xs font-medium">Inactifs</span>
                  <span className="text-xs font-medium">15%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
