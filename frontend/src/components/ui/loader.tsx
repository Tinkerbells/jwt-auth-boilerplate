import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const Loader = ({ className }: { className?: string }) => {
  return (
    <Loader2
      className={cn('my-28 h-8 w-8 text-primary/60 animate-spin', className)}
    />
  );
};

export default Loader;
