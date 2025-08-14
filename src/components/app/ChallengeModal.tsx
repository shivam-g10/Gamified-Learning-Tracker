import { useState } from 'react';
import { Quest } from '../../lib/types';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Badge } from '../ui/badge';

interface ChallengeModalProps {
  quest: Quest | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (quest: Quest) => void;
}

export function ChallengeModal({
  quest,
  isOpen,
  onClose,
  onAccept,
}: ChallengeModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!quest) return null;

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await onAccept(quest);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-center'>
          <DialogTitle className='flex items-center justify-center gap-3 text-xl font-bold'>
            <span className='text-2xl'>🎲</span>
            Random Challenge
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          {/* Challenge Title - More Prominent */}
          <div className='text-center'>
            <h3 className='text-xl font-bold text-foreground leading-tight'>
              {quest.title}
            </h3>
          </div>

          {/* Quest Metadata - Better Organized */}
          <div className='flex items-center justify-center gap-3 flex-wrap'>
            <Badge
              variant='outline'
              className='border-primary/30 text-primary bg-primary/10 px-3 py-1 text-sm font-medium'
            >
              {quest.category}
            </Badge>
            <Badge
              variant='outline'
              className='border-accent/30 text-accent bg-accent/10 px-3 py-1 text-sm font-medium'
            >
              {quest.type}
            </Badge>
            <Badge
              variant='default'
              className='bg-secondary text-secondary-foreground px-3 py-1 text-sm font-medium shadow-sm'
            >
              +{quest.xp} XP
            </Badge>
          </div>

          {/* Challenge Description - More Engaging */}
          <div className='text-center space-y-3'>
            <div className='text-lg font-medium text-foreground'>
              Ready to take on this challenge?
            </div>
            <div className='text-sm text-muted-foreground leading-relaxed max-w-md mx-auto'>
              Adding this quest to your focus will help you prioritize your
              learning and track your progress more effectively.
            </div>
          </div>
        </div>

        <DialogFooter className='gap-3 pt-4'>
          <Button
            variant='outline'
            onClick={onClose}
            disabled={isLoading}
            className='px-6 py-2 text-base font-medium border-2 hover:bg-muted/50 hover:border-muted-foreground/50 transition-all duration-200'
          >
            Decline
          </Button>
          <Button
            onClick={handleAccept}
            disabled={isLoading}
            className='px-6 py-2 text-base font-medium bg-primary hover:bg-primary/90 active:bg-primary/80 shadow-lg shadow-primary/20 transition-all duration-200'
          >
            {isLoading ? 'Adding...' : 'Accept Challenge'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
