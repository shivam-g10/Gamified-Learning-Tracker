import { useState } from 'react';
import { ChallengeItem } from '../../services/challenge-service';
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
  challenge: ChallengeItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (challenge: ChallengeItem) => void;
}

export function ChallengeModal({
  challenge,
  isOpen,
  onClose,
  onAccept,
}: ChallengeModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!challenge) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quest':
        return '⚔️';
      case 'book':
        return '📚';
      case 'course':
        return '🎓';
      default:
        return '🎯';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'quest':
        return 'Quest';
      case 'book':
        return 'Book';
      case 'course':
        return 'Course';
      default:
        return 'Challenge';
    }
  };

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await onAccept(challenge);
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
          {/* Challenge Type Badge */}
          <div className='text-center'>
            <Badge
              variant='outline'
              className='border-primary/30 text-primary bg-primary/10 px-3 py-1 text-sm font-medium'
            >
              {getTypeIcon(challenge.type)} {getTypeLabel(challenge.type)}
            </Badge>
          </div>

          {/* Challenge Title - More Prominent */}
          <div className='text-center'>
            <h3 className='text-xl font-bold text-foreground leading-tight'>
              {challenge.title}
            </h3>
          </div>

          {/* Challenge Metadata - Better Organized */}
          <div className='flex items-center justify-center gap-3 flex-wrap'>
            <Badge
              variant='outline'
              className='border-accent/30 text-accent bg-accent/10 px-3 py-1 text-sm font-medium'
            >
              {challenge.category}
            </Badge>
            <Badge
              variant='default'
              className='bg-secondary text-secondary-foreground px-3 py-1 text-sm font-medium shadow-sm'
            >
              +{challenge.xp} XP
            </Badge>
          </div>

          {/* Challenge Description - More Engaging */}
          <div className='text-center space-y-3'>
            <div className='text-lg font-medium text-foreground'>
              Ready to take on this challenge?
            </div>
            <div className='text-sm text-muted-foreground leading-relaxed max-w-md mx-auto'>
              Adding this {challenge.type} to your focus will help you
              prioritize your learning and track your progress more effectively.
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
