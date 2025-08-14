import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
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
import { Plus } from 'lucide-react';
import { CreateQuestData } from '../../services';

interface AddQuestDialogProps {
  onSubmit: (data: CreateQuestData) => Promise<void>;
}

export function AddQuestDialog({ onSubmit }: AddQuestDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateQuestData>({
    title: '',
    xp: 50,
    type: 'topic',
    category: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      setFormData({ title: '', xp: 50, type: 'topic', category: '' });
      setOpen(false);
    } catch (error) {
      console.error('Failed to add quest:', error);
    }
  };

  const handleInputChange = (
    field: keyof CreateQuestData,
    value: string | number
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='sm'>
          <Plus className='w-4 h-4 mr-2' />
          Add Quest
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add New Quest</DialogTitle>
          <DialogDescription>
            Create a new learning quest to track your progress.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='title'>Title</Label>
            <Input
              id='title'
              placeholder='Learn topic X'
              value={formData.title}
              onChange={e => handleInputChange('title', e.target.value)}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='xp'>XP</Label>
            <Input
              id='xp'
              type='number'
              min='1'
              value={formData.xp}
              onChange={e =>
                handleInputChange('xp', parseInt(e.target.value) || 1)
              }
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='type'>Type</Label>
            <Select
              value={formData.type}
              onValueChange={value =>
                handleInputChange(
                  'type',
                  value as 'topic' | 'project' | 'bonus'
                )
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='topic'>Topic</SelectItem>
                <SelectItem value='project'>Project</SelectItem>
                <SelectItem value='bonus'>Bonus</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='category'>Category</Label>
            <Input
              id='category'
              placeholder='e.g., Algorithms, Systems, etc.'
              value={formData.category}
              onChange={e => handleInputChange('category', e.target.value)}
              required
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
            <Button type='submit'>Add Quest</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
