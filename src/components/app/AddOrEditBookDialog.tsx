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
import { CreateBookData, UpdateBookData } from '../../services';
import type { Book } from '../../lib/types';

interface AddOrEditBookDialogProps {
  book?: Book | null;
  onSubmit: (data: CreateBookData | UpdateBookData) => Promise<void>;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddOrEditBookDialog({
  book,
  onSubmit,
  trigger,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: AddOrEditBookDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use external state if provided, otherwise use internal state
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;

  const [formData, setFormData] = useState<CreateBookData | UpdateBookData>({
    title: '',
    author: '',
    total_pages: 0,
    category: '',
    description: '',
    tags: [],
  });

  const isEditing = !!book;

  // Update form data when editing
  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author || '',
        total_pages: book.total_pages,
        current_page: book.current_page,
        status: book.status,
        description: book.description || '',
        tags: book.tags || [],

        category: book.category,
      });
    } else {
      setFormData({
        title: '',
        author: '',
        total_pages: 0,
        description: '',
        tags: [],
        category: '',
      });
    }
  }, [book]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      if (!isEditing) {
        setFormData({
          title: '',
          author: '',
          total_pages: 0,
          description: '',
          tags: [],
          category: '',
        });
      }
      setOpen(false);
    } catch (error) {
      console.error(`Failed to ${isEditing ? 'update' : 'add'} book:`, error);
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
      Edit Book
    </Button>
  ) : (
    <Button size='sm' className='hidden'>
      <Plus className='w-4 h-4 mr-2' />
      Add Book
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className='sm:max-w-[500px] max-h-[85vh] flex flex-col'>
        <DialogHeader className='flex-shrink-0'>
          <DialogTitle>{isEditing ? 'Edit Book' : 'Add New Book'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update your book information.'
              : 'Add a new book to your learning library.'}
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
                placeholder='Book title'
                value={formData.title || ''}
                onChange={e => handleInputChange('title', e.target.value)}
                required
                className='h-9'
              />
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-1.5'>
                <Label htmlFor='author' className='text-sm'>
                  Author
                </Label>
                <Input
                  id='author'
                  placeholder='Author name'
                  value={formData.author || ''}
                  onChange={e => handleInputChange('author', e.target.value)}
                  className='h-9'
                />
              </div>

              <div className='space-y-1.5'>
                <Label htmlFor='total_pages' className='text-sm'>
                  Total Pages *
                </Label>
                <Input
                  id='total_pages'
                  type='number'
                  min='1'
                  placeholder='0'
                  value={formData.total_pages || ''}
                  onChange={e =>
                    handleInputChange(
                      'total_pages',
                      parseInt(e.target.value) || 0
                    )
                  }
                  required
                  className='h-9'
                />
              </div>
            </div>
          </div>

          {/* Progress & Status (Editing Only) */}
          {isEditing && (
            <div className='space-y-4'>
              <h4 className='text-sm font-medium text-muted-foreground border-b pb-2'>
                Progress & Status
              </h4>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='current_page'>Current Page</Label>
                  <Input
                    id='current_page'
                    type='number'
                    min='0'
                    max={formData.total_pages || 0}
                    placeholder='0'
                    value={(formData as UpdateBookData).current_page || ''}
                    onChange={e =>
                      handleInputChange(
                        'current_page',
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='status'>Status</Label>
                  <Select
                    value={(formData as UpdateBookData).status || 'backlog'}
                    onValueChange={value =>
                      handleInputChange(
                        'status',
                        value as 'backlog' | 'reading' | 'finished'
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='backlog'>Backlog</SelectItem>
                      <SelectItem value='reading'>Reading</SelectItem>
                      <SelectItem value='finished'>Finished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className='space-y-4'>
            <h4 className='text-sm font-medium text-muted-foreground border-b pb-2'>
              Additional Information
            </h4>

            <div className='space-y-2'>
              <Label htmlFor='category'>Category *</Label>
              <Input
                id='category'
                placeholder='e.g., Programming, Fiction, Science, etc.'
                value={formData.category || ''}
                onChange={e => handleInputChange('category', e.target.value)}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                placeholder='Brief description of the book'
                value={formData.description || ''}
                onChange={e => handleInputChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='tags'>Tags</Label>
              <Input
                id='tags'
                placeholder='tag1, tag2, tag3 (comma-separated)'
                value={formData.tags?.join(', ') || ''}
                onChange={e => handleTagsChange(e.target.value)}
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
              {isEditing ? 'Update Book' : 'Add Book'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
