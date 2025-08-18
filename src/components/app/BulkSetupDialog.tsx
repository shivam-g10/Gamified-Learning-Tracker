'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { Download, Upload, FileText } from 'lucide-react';

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

interface CsvRow {
  [key: string]: string | number | boolean | string[];
}

function parseCsvRow(headers: string[], values: string[]): BulkSetupData {
  const item: CsvRow = {};
  
  headers.forEach((header, index) => {
    let value = values[index] || '';
    
    // Handle quoted values (e.g., "programming,clean-code")
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    
    // Parse specific fields
    if (header === 'xp' || header === 'total_pages' || header === 'current_page' || header === 'total_units' || header === 'completed_units') {
      item[header] = parseInt(value) || 0;
    } else if (header === 'done') {
      item[header] = value.toLowerCase() === 'true';
    } else if (header === 'tags') {
      item[header] = value ? value.split(',').map(t => t.trim()) : [];
    } else {
      item[header] = value;
    }
  });
  
  // Ensure required fields have defaults
  const result: BulkSetupData = {
    title: item.title as string || 'Untitled',
    category: item.category as string || 'Uncategorized',
    ...item
  };
  
  return result;
}

export function BulkSetupDialog() {
  const [type, setType] = useState<'quests' | 'books' | 'courses'>('quests');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [csvData, setCsvData] = useState<BulkSetupData[]>([]);
  const [csvFileName, setCsvFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadCsvTemplate = () => {
    let csvContent = '';
    let filename = '';

    switch (type) {
      case 'quests':
        csvContent = 'title,xp,type,category,done,description\nLearn React Hooks,100,topic,Frontend Development,false,Learn the basics of React hooks\nBuild a Todo App,150,project,Frontend Development,false,Create a simple todo application\nMaster TypeScript,200,topic,Programming Languages,false,Learn TypeScript fundamentals';
        filename = 'quests_template.csv';
        break;
      case 'books':
        csvContent = 'title,author,total_pages,current_page,status,category,description,tags\nClean Code,Robert C. Martin,464,0,backlog,Software Engineering,A handbook of agile software craftsmanship,"programming,clean-code,best-practices"\nDesign Patterns,Erich Gamma et al.,416,0,backlog,Software Engineering,Elements of Reusable Object-Oriented Software,"design-patterns,object-oriented,architecture"';
        filename = 'books_template.csv';
        break;
      case 'courses':
        csvContent = 'title,platform,url,total_units,completed_units,status,category,description,tags\nComplete React Developer,Udemy,https://udemy.com/react-complete-guide,20,0,backlog,Frontend Development,Learn React from scratch to advanced concepts,"react,javascript,frontend"\nNode.js Complete Guide,Udemy,https://udemy.com/nodejs-complete-guide,25,0,backlog,Backend Development,Master Node.js backend development,"nodejs,javascript,backend"';
        filename = 'courses_template.csv';
        break;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Downloaded ${filename}`);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setCsvFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        const data: BulkSetupData[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.trim());
            const item = parseCsvRow(headers, values);
            data.push(item);
          }
        }
        
        setCsvData(data);
        toast.success(`Loaded ${data.length} items from ${file.name}`);
      } catch (error) {
        toast.error('Failed to parse CSV file');
        console.error('CSV parsing error:', error);
      }
    };
    
    reader.readAsText(file);
  };

  const handleBulkSetup = async () => {
    if (csvData.length === 0) {
      toast.error('No data to setup. Please upload a CSV file first.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/bulk-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data: csvData }),
      });

      if (!response.ok) throw new Error('Failed to setup data');
      
      const result = await response.json();
      toast.success(result.message);
      setIsOpen(false);
      setCsvData([]);
      setCsvFileName('');
      
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
      case 'quests':
        return 'Quests';
      case 'books':
        return 'Books';
      case 'courses':
        return 'Courses';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'backlog':
        return 'bg-gray-500';
      case 'reading':
      case 'learning':
        return 'bg-blue-500';
      case 'finished':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getQuestTypeColor = (type: string) => {
    switch (type) {
      case 'topic':
        return 'bg-blue-500';
      case 'project':
        return 'bg-purple-500';
      case 'bonus':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          📊 Bulk Setup
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Bulk Setup - {getTypeLabel(type)}</DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Type Selection */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Select Type:</label>
            <Select
              value={type}
              onValueChange={(value: 'quests' | 'books' | 'courses') =>
                setType(value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='quests'>Quests</SelectItem>
                <SelectItem value='books'>Books</SelectItem>
                <SelectItem value='courses'>Courses</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* CSV Actions */}
          <div className='space-y-4'>
            <div className='flex gap-2'>
              <Button
                onClick={downloadCsvTemplate}
                variant='outline'
                size='sm'
                className='flex items-center gap-2'
              >
                <Download className='w-4 h-4' />
                Download Template
              </Button>
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant='outline'
                size='sm'
                className='flex items-center gap-2'
              >
                <Upload className='w-4 h-4' />
                Upload CSV
              </Button>
              
              <input
                ref={fileInputRef}
                type='file'
                accept='.csv'
                onChange={handleFileUpload}
                className='hidden'
              />
            </div>

            {csvFileName && (
              <div className='flex items-center gap-2 text-sm text-green-600'>
                <FileText className='w-4 h-4' />
                <span>Loaded: {csvFileName}</span>
                <Badge variant='secondary'>{csvData.length} items</Badge>
              </div>
            )}
          </div>

          {/* CSV Data Preview */}
          {csvData.length > 0 && (
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-semibold'>
                  CSV Data Preview ({csvData.length})
                </h3>
                <Badge variant='secondary'>
                  Preview - Click &quot;Setup All&quot; to create
                </Badge>
              </div>

              <div className='grid gap-3'>
                {csvData.slice(0, 5).map((item, index) => (
                  <Card key={index} className='border-l-4 border-l-blue-500'>
                    <CardHeader className='pb-2'>
                      <CardTitle className='text-base'>{item.title}</CardTitle>
                      <CardDescription className='text-sm'>
                        {item.description || 'No description'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='pt-0'>
                      <div className='flex flex-wrap gap-2'>
                        {type === 'quests' && (
                          <>
                            <Badge
                              className={getQuestTypeColor(item.type || '')}
                            >
                              {item.type}
                            </Badge>
                            <Badge variant='outline'>{item.xp} XP</Badge>
                          </>
                        )}

                        {type === 'books' && (
                          <>
                            <Badge variant='outline'>{item.author}</Badge>
                            <Badge variant='outline'>
                              {item.total_pages} pages
                            </Badge>
                          </>
                        )}

                        {type === 'courses' && (
                          <>
                            <Badge variant='outline'>{item.platform}</Badge>
                            <Badge variant='outline'>
                              {item.total_units} units
                            </Badge>
                          </>
                        )}

                        <Badge
                          className={getStatusColor(item.status || 'backlog')}
                        >
                          {item.status || 'backlog'}
                        </Badge>

                        <Badge variant='secondary'>{item.category}</Badge>

                        {item.tags &&
                          item.tags.length > 0 &&
                          item.tags.map((tag, tagIndex) => (
                            <Badge
                              key={tagIndex}
                              variant='outline'
                              className='text-xs'
                            >
                              #{tag}
                            </Badge>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {csvData.length > 5 && (
                  <div className='text-center text-sm text-muted-foreground py-2'>
                    ... and {csvData.length - 5} more items
                  </div>
                )}
              </div>

              <Button
                onClick={handleBulkSetup}
                disabled={isLoading}
                className='w-full bg-green-600 hover:bg-green-700'
              >
                {isLoading ? 'Setting up...' : `✅ Setup All ${csvData.length} ${type}`}
              </Button>
            </div>
          )}

          {/* Instructions */}
          <div className='bg-blue-50 p-4 rounded-lg'>
            <h4 className='font-semibold text-blue-900 mb-2'>How to use:</h4>
            <ol className='text-sm text-blue-800 space-y-1 list-decimal list-inside'>
              <li>Select the type of items you want to setup</li>
              <li>
                Download the CSV template to see the required format
              </li>
              <li>Fill in your data following the template format</li>
              <li>Upload your CSV file</li>
              <li>Review the preview and click &quot;Setup All&quot;</li>
              <li>
                <strong>Note:</strong> This will replace all existing items of
                the selected type
              </li>
            </ol>
          </div>

          {/* CSV Format Help */}
          <div className='bg-gray-50 p-4 rounded-lg'>
            <h4 className='font-semibold text-gray-900 mb-2'>CSV Format:</h4>
            <div className='text-sm text-gray-700 space-y-2'>
              {type === 'quests' && (
                <div>
                  <strong>Required columns:</strong> title, xp, type, category<br />
                  <strong>Optional columns:</strong> done, description<br />
                  <strong>Type values:</strong> topic, project, bonus<br />
                  <strong>Done values:</strong> true, false
                </div>
              )}
              {type === 'books' && (
                <div>
                  <strong>Required columns:</strong> title, category<br />
                  <strong>Optional columns:</strong> author, total_pages, current_page, status, description, tags<br />
                  <strong>Status values:</strong> backlog, reading, finished<br />
                  <strong>Tags format:</strong> &quot;tag1,tag2,tag3&quot; (comma-separated)
                </div>
              )}
              {type === 'courses' && (
                <div>
                  <strong>Required columns:</strong> title, category<br />
                  <strong>Optional columns:</strong> platform, url, total_units, completed_units, status, description, tags<br />
                  <strong>Status values:</strong> backlog, learning, finished<br />
                  <strong>Tags format:</strong> &quot;tag1,tag2,tag3&quot; (comma-separated)
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
