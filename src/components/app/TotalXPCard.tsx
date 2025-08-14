import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';

interface TotalXPCardProps {
  totalXp: number;
  previousXp?: number;
}

export function TotalXPCard({ totalXp, previousXp = 0 }: TotalXPCardProps) {
  const [displayXp, setDisplayXp] = useState(totalXp);
  const [showGain, setShowGain] = useState(false);
  const [gainAmount, setGainAmount] = useState(0);

  // Animate XP count-up
  useEffect(() => {
    if (totalXp !== previousXp) {
      const gain = totalXp - previousXp;
      if (gain > 0) {
        setGainAmount(gain);
        setShowGain(true);
        setTimeout(() => setShowGain(false), 400);
      }

      // Animate the count-up
      const startXp = previousXp;
      const endXp = totalXp;
      const duration = 300;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentXp = Math.floor(startXp + (endXp - startXp) * progress);

        setDisplayXp(currentXp);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [totalXp, previousXp]);

  return (
    <Card className='bg-card border-border relative overflow-hidden'>
      <CardContent className='p-4'>
        <div>
          <div className='text-sm text-muted-foreground mb-1'>Total XP</div>
          <div className='text-2xl font-bold text-foreground count-up-tick'>
            {displayXp}
          </div>
          <div className='text-xs text-muted-foreground'>{totalXp} / ∞ XP</div>
        </div>

        {/* XP gain indicator */}
        {showGain && (
          <div className='absolute top-2 right-2 xp-float'>
            <div className='bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full font-medium'>
              +{gainAmount} XP
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
