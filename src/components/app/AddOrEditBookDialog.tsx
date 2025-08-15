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
    cover_url: '',
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
        cover_url: book.cover_url || '',
        category: book.category,
      });
    } else {
      setFormData({
        title: '',
        author: '',
        total_pages: 0,
        description: '',
        tags: [],
        cover_url: '',
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
          cover_url: '',
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
    <Button size='sm' variant='outline'>
      <Edit className='w-4 h-4 mr-2' />
      Edit Book
    </Button>
  ) : (
    <Button size='sm'>
      <Plus className='w-4 h-4 mr-2' />
      Add Book
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Book' : 'Add New Book'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update your book information.'
              : 'Add a new book to your learning library.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='title'>Title *</Label>
            <Input
              id='title'
              placeholder='Book title'
              value={formData.title || ''}
              onChange={e => handleInputChange('title', e.target.value)}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='author'>Author</Label>
            <Input
              id='author'
              placeholder='Author name'
              value={formData.author || ''}
              onChange={e => handleInputChange('author', e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='total_pages'>Total Pages *</Label>
            <Input
              id='total_pages'
              type='number'
              min='1'
              placeholder='0'
              value={formData.total_pages || ''}
              onChange={e =>
                handleInputChange('total_pages', parseInt(e.target.value) || 0)
              }
              required
            />
          </div>

          {isEditing && (
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
          )}

          {isEditing && (
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
          )}

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

          <div className='space-y-2'>
            <Label htmlFor='cover_url'>Cover URL</Label>
            <Input
              id='cover_url'
              type='url'
              placeholder='https://example.com/cover.jpg'
              value={formData.cover_url || ''}
              onChange={e => handleInputChange('cover_url', e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type='submit'>
              {isEditing ? 'Update Book' : 'Add Book'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
