import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Plus, Edit } from 'lucide-react';
import { CreateCourseData, UpdateCourseData } from '../../services';
import type { Course } from '../../lib/types';

interface AddOrEditCourseDialogProps {
  course?: Course | null;
  onSubmit: (data: CreateCourseData | UpdateCourseData) => Promise<void>;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddOrEditCourseDialog({
  course,
  onSubmit,
  trigger,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: AddOrEditCourseDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use external state if provided, otherwise use internal state
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;

  const [formData, setFormData] = useState<CreateCourseData | UpdateCourseData>(
    {
      title: '',
      platform: '',
      url: '',
      total_units: 0,
      description: '',
      category: '',
      tags: [],
    }
  );

  const isEditing = !!course;

  // Update form data when editing
  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        platform: course.platform || '',
        url: course.url || '',
        total_units: course.total_units,
        completed_units: course.completed_units,
        status: course.status,
        description: course.description || '',
        category: course.category,
        tags: course.tags || [],
      });
    } else {
      setFormData({
        title: '',
        platform: '',
        url: '',
        total_units: 0,
        description: '',
        tags: [],
      });
    }
  }, [course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      if (!isEditing) {
        setFormData({
          title: '',
          platform: '',
          url: '',
          total_units: 0,
          description: '',
          category: '',
          tags: [],
        });
      }
      setOpen(false);
    } catch (error) {
      console.error(`Failed to ${isEditing ? 'update' : 'add'} course:`, error);
    }
  };

  const handleInputChange = (
    field: string,
    value: string | number | string[]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagsChange = (value: string) => {
    const tags = value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    setFormData(prev => ({ ...prev, tags }));
  };

  const defaultTrigger = isEditing ? (
    <Button size='sm' variant='outline' className='hidden'>
      <Edit className='w-4 h-4 mr-2' />
      Edit Course
    </Button>
  ) : (
    <Button size='sm' className='hidden'>
      <Plus className='w-4 h-4 mr-2' />
      Add Course
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className='sm:max-w-[500px] max-h-[85vh] flex flex-col'>
        <DialogHeader className='flex-shrink-0'>
          <DialogTitle>
            {isEditing ? 'Edit Course' : 'Add New Course'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update your course information.'
              : 'Add a new course to your learning library.'}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className='flex-1 overflow-y-auto space-y-3 px-1'
        >
          {/* Basic Information */}
          <div className='space-y-3'>
            <h4 className='text-sm font-medium text-muted-foreground border-b pb-1'>
              Basic Information
            </h4>

            <div className='space-y-1.5'>
              <Label htmlFor='title' className='text-sm'>
                Title *
              </Label>
              <Input
                id='title'
                placeholder='Course title'
                value={formData.title || ''}
                onChange={e => handleInputChange('title', e.target.value)}
                required
                className='h-9'
              />
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-1.5'>
                <Label htmlFor='platform' className='text-sm'>
                  Platform
                </Label>
                <Input
                  id='platform'
                  placeholder='e.g., Udemy, Coursera'
                  value={formData.platform || ''}
                  onChange={e => handleInputChange('platform', e.target.value)}
                  className='h-9'
                />
              </div>

              <div className='space-y-1.5'>
                <Label htmlFor='category' className='text-sm'>
                  Category *
                </Label>
                <Input
                  id='category'
                  placeholder='e.g., Programming'
                  value={formData.category || ''}
                  onChange={e => handleInputChange('category', e.target.value)}
                  required
                  className='h-9'
                />
              </div>
            </div>

            <div className='space-y-1.5'>
              <Label htmlFor='url' className='text-sm'>
                Course URL
              </Label>
              <Input
                id='url'
                type='url'
                placeholder='https://example.com/course'
                value={formData.url || ''}
                onChange={e => handleInputChange('url', e.target.value)}
                className='h-9'
              />
            </div>

            <div className='space-y-1.5'>
              <Label htmlFor='total_units' className='text-sm'>
                Total Units *
              </Label>
              <Input
                id='total_units'
                type='number'
                min='1'
                placeholder='0'
                value={formData.total_units || ''}
                onChange={e =>
                  handleInputChange(
                    'total_units',
                    parseInt(e.target.value) || 0
                  )
                }
                required
                className='h-9'
              />
            </div>
          </div>

          {/* Progress & Status (Editing Only) */}
          {isEditing && (
            <div className='space-y-3'>
              <h4 className='text-sm font-medium text-muted-foreground border-b pb-1'>
                Progress & Status
              </h4>

              <div className='grid grid-cols-2 gap-3'>
                <div className='space-y-1.5'>
                  <Label htmlFor='completed_units' className='text-sm'>
                    Completed Units
                  </Label>
                  <Input
                    id='completed_units'
                    type='number'
                    min='0'
                    max={formData.total_units || 0}
                    placeholder='0'
                    value={(formData as UpdateCourseData).completed_units || ''}
                    onChange={e =>
                      handleInputChange(
                        'completed_units',
                        parseInt(e.target.value) || 0
                      )
                    }
                    className='h-9'
                  />
                </div>

                <div className='space-y-1.5'>
                  <Label htmlFor='status' className='text-sm'>
                    Status
                  </Label>
                  <Select
                    value={(formData as UpdateCourseData).status || 'backlog'}
                    onValueChange={value =>
                      handleInputChange(
                        'status',
                        value as 'backlog' | 'learning' | 'finished'
                      )
                    }
                  >
                    <SelectTrigger className='h-9'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='backlog'>Backlog</SelectItem>
                      <SelectItem value='learning'>Learning</SelectItem>
                      <SelectItem value='finished'>Finished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className='space-y-3'>
            <h4 className='text-sm font-medium text-muted-foreground border-b pb-1'>
              Additional Information
            </h4>

            <div className='space-y-1.5'>
              <Label htmlFor='description' className='text-sm'>
                Description
              </Label>
              <Textarea
                id='description'
                placeholder='Brief description of the course'
                value={formData.description || ''}
                onChange={e => handleInputChange('description', e.target.value)}
                rows={2}
                className='min-h-[60px]'
              />
            </div>

            <div className='space-y-1.5'>
              <Label htmlFor='tags' className='text-sm'>
                Tags
              </Label>
              <Input
                id='tags'
                placeholder='tag1, tag2, tag3 (comma-separated)'
                value={formData.tags?.join(', ') || ''}
                onChange={e => handleTagsChange(e.target.value)}
                className='h-9'
              />
            </div>
          </div>

          <DialogFooter className='flex-shrink-0 pt-3 border-t bg-background mt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              className='bg-primary hover:bg-primary/90 text-primary-foreground'
            >
              {isEditing ? 'Update Course' : 'Add Course'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
