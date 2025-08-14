import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { CreateQuestData } from '../../services';

interface AddQuestFormProps {
  onSubmit: (data: CreateQuestData) => Promise<void>;
}

export function AddQuestForm({ onSubmit }: AddQuestFormProps) {
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data: CreateQuestData = {
        title: String(formData.get('title') || ''),
        xp: Number(formData.get('xp') || 0),
        type: String(formData.get('type') || 'topic') as
          | 'topic'
          | 'project'
          | 'bonus',
        category: String(formData.get('category') || 'General'),
      };

      await onSubmit(data);
      e.currentTarget.reset();
    } catch (error) {
      console.error('Failed to add quest:', error);
      // In a real app, you'd show a user-friendly error message
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='grid grid-cols-1 md:grid-cols-5 gap-4'
    >
      <div className='space-y-2'>
        <Label className='text-sm text-neutral-300 font-medium'>Title</Label>
        <Input name='title' required placeholder='Learn topic X' />
      </div>

      <div className='space-y-2'>
        <Label className='text-sm text-neutral-300 font-medium'>XP</Label>
        <Input name='xp' type='number' min={0} required defaultValue={50} />
      </div>

      <div className='space-y-2'>
        <Label className='text-sm text-neutral-300 font-medium'>Type</Label>
        <Select name='type' defaultValue='topic'>
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
        <Label className='text-sm text-neutral-300 font-medium'>Category</Label>
        <Input name='category' placeholder='Algorithms' />
      </div>

      <div className='flex items-end'>
        <Button disabled={pending} type='submit' className='w-full'>
          {pending ? 'Adding...' : 'Add Quest'}
        </Button>
      </div>
    </form>
  );
}
