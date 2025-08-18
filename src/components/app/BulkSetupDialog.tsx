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
import { BulkSetupService } from '@/services/bulk-setup-service';
import { BulkSetupAPI } from '@/lib/api/bulk-setup-api';
import type { BulkSetupData } from '@/lib/api-types';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function BulkSetupDialog() {
  const [type, setType] = useState<'quests' | 'books' | 'courses'>('quests');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [csvData, setCsvData] = useState<BulkSetupData[]>([]);
  const [csvFileName, setCsvFileName] = useState<string>('');
  const [replaceMode, setReplaceMode] = useState<boolean>(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadCsvTemplate = () => {
    const { content: csvContent, filename } =
      BulkSetupService.generateCsvTemplate(type);
    BulkSetupService.downloadFile(csvContent, filename);
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

    reader.onload = async e => {
      try {
        const csvText = e.target?.result as string;

        // Parse CSV data using service
        const parseResult = BulkSetupService.parseCsvData(csvText);
        if (parseResult._tag === 'Failure') {
          toast.error(parseResult.error);
          return;
        }

        // Validate data using service
        const validationResult = BulkSetupService.validateBulkSetupData(
          parseResult.data,
          type
        );
        if (validationResult._tag === 'Failure') {
          toast.error(validationResult.error);
          return;
        }

        const validation = validationResult.data;
        setValidationErrors(validation.errors);
        setValidationWarnings(validation.warnings);

        if (!validation.valid) {
          toast.error(
            `CSV validation failed with ${validation.errors.length} errors`
          );
          return;
        }

        setCsvData(parseResult.data);
        if (validation.warnings.length > 0) {
          toast.warning(
            `Loaded ${parseResult.data.length} items with ${validation.warnings.length} warnings`
          );
        } else {
          toast.success(
            `Loaded ${parseResult.data.length} items from ${file.name}`
          );
        }
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
      const result = await BulkSetupAPI.bulkSetup(type, csvData, replaceMode);

      if (result._tag === 'Failure') {
        toast.error(result.error);
        return;
      }

      toast.success(result.data.message);
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

  const handleReset = () => {
    setCsvData([]);
    setCsvFileName('');
    setType('quests');
    setReplaceMode(true);
    setValidationErrors([]);
    setValidationWarnings([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('Form reset successfully');
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

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form when dialog is closed
      setCsvData([]);
      setCsvFileName('');
      setType('quests');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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

              {/* Validation Results */}
              {(validationErrors.length > 0 ||
                validationWarnings.length > 0) && (
                <div className='space-y-3'>
                  {validationErrors.length > 0 && (
                    <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
                      <h4 className='font-medium text-red-800 mb-2 flex items-center gap-2'>
                        <svg
                          className='w-4 h-4'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                          />
                        </svg>
                        Validation Errors ({validationErrors.length})
                      </h4>
                      <ul className='text-sm text-red-700 space-y-1'>
                        {validationErrors.map((error, index) => (
                          <li key={index} className='flex items-start gap-2'>
                            <span className='text-red-500 mt-0.5'>•</span>
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {validationWarnings.length > 0 && (
                    <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-3'>
                      <h4 className='font-medium text-yellow-800 mb-2 flex items-center gap-2'>
                        <svg
                          className='w-4 h-4'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                          />
                        </svg>
                        Validation Warnings ({validationWarnings.length})
                      </h4>
                      <ul className='text-sm text-yellow-700 space-y-1'>
                        {validationWarnings.map((warning, index) => (
                          <li key={index} className='flex items-start gap-2'>
                            <span className='text-yellow-500 mt-0.5'>•</span>
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className='space-y-4'>
                {/* Replace toggle with checkbox */}
                <div className='flex items-center gap-3 text-sm'>
                  <label className='font-medium'>Replace existing data:</label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className='flex items-center gap-2'>
                          <Checkbox
                            checked={replaceMode}
                            onCheckedChange={checked =>
                              setReplaceMode(checked === true)
                            }
                            className='data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600'
                          />
                          <span
                            className={
                              replaceMode
                                ? 'text-red-600 font-medium'
                                : 'text-green-600 font-medium'
                            }
                          >
                            {replaceMode ? 'Replace All' : 'Append'}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className='max-w-xs'>
                          {replaceMode
                            ? '⚠️ This will DELETE all existing items of this type before adding new ones. This action is irreversible!'
                            : '✅ New items will be added without affecting existing data.'}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Action buttons */}
                <div className='flex gap-3'>
                  <Button
                    onClick={handleBulkSetup}
                    disabled={isLoading}
                    className='flex-1 bg-green-600 hover:bg-green-700'
                  >
                    {isLoading
                      ? 'Setting up...'
                      : `✅ Setup All ${csvData.length} ${type}`}
                  </Button>

                  <Button
                    onClick={handleReset}
                    variant='outline'
                    className='px-6 text-orange-600 hover:text-orange-700 hover:bg-orange-50'
                  >
                    <svg
                      className='w-4 h-4 mr-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                      />
                    </svg>
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className='bg-blue-50 p-4 rounded-lg'>
            <h4 className='font-semibold text-blue-900 mb-2'>How to use:</h4>
            <ol className='text-sm text-blue-800 space-y-1 list-decimal list-inside'>
              <li>Select the type of items you want to setup</li>
              <li>Download the CSV template to see all available columns</li>
              <li>
                Fill in your data - only title and category are required for
                books/courses
              </li>
              <li>Upload your CSV file</li>
              <li>Review the preview and click &quot;Setup All&quot;</li>
            </ol>
          </div>

          {/* CSV Format Help */}
          <div className='bg-gray-50 p-4 rounded-lg'>
            <h4 className='font-semibold text-gray-900 mb-2'>CSV Format:</h4>
            <div className='text-sm text-gray-700 space-y-2'>
              {type === 'quests' && (
                <div>
                  <strong>Required columns:</strong> title, xp, type, category
                  <br />
                  <strong>Optional columns:</strong> done
                  <br />
                  <strong>Type values:</strong> topic, project, bonus
                  <br />
                  <strong>XP values:</strong> Any non-negative number
                  <br />
                  <strong>Example:</strong> Learn React Hooks,100,topic,Frontend
                  Development,false
                  <br />
                  <strong>Note:</strong> All columns are available in the
                  template - only title, xp, type, and category are required
                </div>
              )}
              {type === 'books' && (
                <div>
                  <strong>Required columns:</strong> title, category
                  <br />
                  <strong>Optional columns:</strong> author, description,
                  total_pages, current_page, status, tags
                  <br />
                  <strong>Status values:</strong> backlog, reading, finished
                  <br />
                  <strong>Tags format:</strong> &quot;tag1,tag2,tag3&quot;
                  (comma-separated)
                  <br />
                  <strong>Example:</strong> Clean Code,Software
                  Engineering,Robert C. Martin,A handbook of agile software
                  craftsmanship,464,0,backlog,&quot;programming,clean-code&quot;
                  <br />
                  <strong>Note:</strong> All columns are available in the
                  template - only title and category are required
                </div>
              )}
              {type === 'courses' && (
                <div>
                  <strong>Required columns:</strong> title, category
                  <br />
                  <strong>Optional columns:</strong> platform, url, description,
                  total_units, completed_units, status, tags
                  <br />
                  <strong>Status values:</strong> backlog, learning, finished
                  <br />
                  <strong>Tags format:</strong> &quot;tag1,tag2,tag3&quot;
                  (comma-separated)
                  <br />
                  <strong>Example:</strong> Complete React Developer,Frontend
                  Development,Udemy,https://udemy.com/react-complete-guide,Learn
                  React from scratch to advanced
                  concepts,20,0,backlog,&quot;react,javascript,frontend&quot;
                  <br />
                  <strong>Note:</strong> All columns are available in the
                  template - only title and category are required
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
