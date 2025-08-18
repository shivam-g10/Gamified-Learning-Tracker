'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface BulkSetupData {
  title: string;
  xp?: number;
  type?: 'topic' | 'project' | 'bonus';
  category: string;
  done?: boolean;
  author?: string;
  total_pages?: number;
  current_page?: number;
  status?: 'backlog' | 'reading' | 'finished' | 'learning';
  description?: string;
  tags?: string[];
  platform?: string;
  url?: string;
  total_units?: number;
  completed_units?: number;
}

export function BulkSetupDialog() {
  const [type, setType] = useState<'quests' | 'books' | 'courses'>('quests');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sampleData, setSampleData] = useState<BulkSetupData[]>([]);

  const handleGetSampleData = async () => {
    try {
      const response = await fetch(`/api/bulk-setup?type=${type}`);
      if (!response.ok) throw new Error('Failed to fetch sample data');
      
      const data = await response.json();
      setSampleData(data.sampleData);
      toast.success(`Loaded ${data.count} sample ${type}`);
    } catch (error) {
      toast.error('Failed to load sample data');
      console.error('Error loading sample data:', error);
    }
  };

  const handleBulkSetup = async () => {
    if (sampleData.length === 0) {
      toast.error('No data to setup. Please load sample data first.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/bulk-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data: sampleData }),
      });

      if (!response.ok) throw new Error('Failed to setup data');
      
      const result = await response.json();
      toast.success(result.message);
      setIsOpen(false);
      setSampleData([]);
      
      // Refresh the page to show new data
      window.location.reload();
    } catch (error) {
      toast.error('Failed to setup data');
      console.error('Error setting up data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'quests': return 'Quests';
      case 'books': return 'Books';
      case 'courses': return 'Courses';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'backlog': return 'bg-gray-500';
      case 'reading':
      case 'learning': return 'bg-blue-500';
      case 'finished': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getQuestTypeColor = (type: string) => {
    switch (type) {
      case 'topic': return 'bg-blue-500';
      case 'project': return 'bg-purple-500';
      case 'bonus': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          🚀 Bulk Setup
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Setup - {getTypeLabel(type)}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Type:</label>
            <Select value={type} onValueChange={(value: 'quests' | 'books' | 'courses') => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quests">Quests</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="courses">Courses</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sample Data Actions */}
          <div className="flex gap-2">
            <Button 
              onClick={handleGetSampleData} 
              variant="outline"
              disabled={isLoading}
            >
              📋 Load Sample Data
            </Button>
            <Button 
              onClick={handleBulkSetup} 
              disabled={sampleData.length === 0 || isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'Setting up...' : '✅ Setup All'}
            </Button>
          </div>

          {/* Sample Data Preview */}
          {sampleData.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Sample {getTypeLabel(type)} ({sampleData.length})
                </h3>
                <Badge variant="secondary">
                  Preview - Click &quot;Setup All&quot; to create
                </Badge>
              </div>
              
              <div className="grid gap-3">
                {sampleData.map((item, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {item.description || 'No description'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-2">
                        {type === 'quests' && (
                          <>
                            <Badge className={getQuestTypeColor(item.type || '')}>
                              {item.type}
                            </Badge>
                            <Badge variant="outline">
                              {item.xp} XP
                            </Badge>
                          </>
                        )}
                        
                        {type === 'books' && (
                          <>
                            <Badge variant="outline">
                              {item.author}
                            </Badge>
                            <Badge variant="outline">
                              {item.total_pages} pages
                            </Badge>
                          </>
                        )}
                        
                        {type === 'courses' && (
                          <>
                            <Badge variant="outline">
                              {item.platform}
                            </Badge>
                            <Badge variant="outline">
                              {item.total_units} units
                            </Badge>
                          </>
                        )}
                        
                        <Badge className={getStatusColor(item.status || 'backlog')}>
                          {item.status || 'backlog'}
                        </Badge>
                        
                        <Badge variant="secondary">
                          {item.category}
                        </Badge>
                        
                        {item.tags && item.tags.length > 0 && (
                          item.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">How to use:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Select the type of items you want to setup</li>
              <li>Click &quot;Load Sample Data&quot; to see what will be created</li>
              <li>Review the sample data (you can modify it if needed)</li>
              <li>Click &quot;Setup All&quot; to create all items at once</li>
              <li><strong>Note:</strong> This will replace all existing items of the selected type</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
