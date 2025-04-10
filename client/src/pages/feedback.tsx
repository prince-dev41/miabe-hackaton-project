import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Star, UserRound, User, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fetchFeedback } from '@/lib/api';
import { Pagination } from '@/components/ui/pagination';

export default function Feedback() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const itemsPerPage = 8;

  // Fetch feedback
  const { data: feedbacks, isLoading } = useQuery({
    queryKey: ['/api/feedbacks'],
    queryFn: fetchFeedback
  });

  // Filter feedback by search query and rating
  const filteredFeedback = feedbacks?.filter(feedback => {
    if (filterRating !== null && feedback.rating !== filterRating) return false;
    
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    
    const patientMatch = feedback.patientName 
      ? feedback.patientName.toLowerCase().includes(searchLower)
      : String(feedback.patient).includes(searchLower);
      
    const doctorMatch = feedback.doctorName
      ? feedback.doctorName.toLowerCase().includes(searchLower)
      : String(feedback.doctor).includes(searchLower);
      
    const commentMatch = feedback.comment.toLowerCase().includes(searchLower);
      
    return patientMatch || doctorMatch || commentMatch;
  }) || [];

  // Pagination
  const totalItems = filteredFeedback.length;
  const paginatedFeedback = filteredFeedback.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            Feedback System
          </CardTitle>
          <div className="mt-3 sm:mt-0 flex items-center space-x-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search feedback..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <Search className="h-4 w-4" />
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge
              variant={filterRating === null ? "default" : "outline"}
              className="cursor-pointer px-3 py-1"
              onClick={() => setFilterRating(null)}
            >
              All Ratings
            </Badge>
            {[5, 4, 3, 2, 1].map(rating => (
              <Badge
                key={rating}
                variant={filterRating === rating ? "default" : "outline"}
                className="cursor-pointer px-3 py-1"
                onClick={() => setFilterRating(rating)}
              >
                {rating} {rating === 1 ? 'Star' : 'Stars'}
              </Badge>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {isLoading ? (
              Array(8).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                      <div className="ml-3">
                        <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="mt-3 flex">
                      {Array(5).fill(0).map((_, i) => (
                        <div key={i} className="h-5 w-5 bg-gray-200 rounded-full mr-1"></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : paginatedFeedback.length > 0 ? (
              paginatedFeedback.map((feedback) => (
                <Card key={feedback.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                        <UserRound className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium">
                          {feedback.doctorName || `Doctor #${feedback.doctor}`}
                        </div>
                        <div className="text-xs text-gray-500">
                          From: {feedback.patientName || `Patient #${feedback.patient}`}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 flex items-start">
                      <MessageSquare className="h-4 w-4 mr-1 mt-0.5 text-gray-400" />
                      {feedback.comment}
                    </p>
                    
                    <div className="flex text-yellow-400">
                      {Array(5).fill(0).map((_, i) => (
                        <Star 
                          key={i} 
                          className="h-4 w-4" 
                          fill={i < feedback.rating ? 'currentColor' : 'none'} 
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">{feedback.rating}/5</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No feedback found matching your filters
              </div>
            )}
          </div>
          
          <Pagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = feedbacks?.filter(feedback => feedback.rating === rating).length || 0;
                const percentage = feedbacks?.length ? Math.round((count / feedbacks.length) * 100) : 0;
                
                return (
                  <div key={rating} className="flex items-center">
                    <div className="flex text-yellow-400 mr-2">
                      {Array(5).fill(0).map((_, i) => (
                        <Star 
                          key={i} 
                          className="h-4 w-4" 
                          fill={i < rating ? 'currentColor' : 'none'} 
                        />
                      ))}
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-yellow-400 h-2.5 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-12 text-right text-sm">
                      {percentage}%
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Rated Doctors</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {feedbacks ? (
              <div className="space-y-4">
                {Array.from(
                  feedbacks.reduce((acc, feedback) => {
                    const doctorId = feedback.doctor;
                    const doctorName = feedback.doctorName || `Doctor #${doctorId}`;
                    
                    if (!acc.has(doctorId)) {
                      acc.set(doctorId, { 
                        id: doctorId, 
                        name: doctorName, 
                        totalRating: 0, 
                        count: 0 
                      });
                    }
                    
                    const doctor = acc.get(doctorId)!;
                    doctor.totalRating += feedback.rating;
                    doctor.count += 1;
                    
                    return acc;
                  }, new Map())
                )
                .map(([_, doctor]) => ({
                  ...doctor,
                  avgRating: doctor.totalRating / doctor.count
                }))
                .sort((a, b) => b.avgRating - a.avgRating)
                .slice(0, 5)
                .map(doctor => (
                  <div key={doctor.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                        <UserRound className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium">{doctor.name}</div>
                        <div className="text-xs text-gray-500">{doctor.count} reviews</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-yellow-400 flex">
                        {Array(5).fill(0).map((_, i) => (
                          <Star 
                            key={i} 
                            className="h-4 w-4" 
                            fill={i < Math.floor(doctor.avgRating) ? 'currentColor' : 'none'} 
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm">{doctor.avgRating.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
