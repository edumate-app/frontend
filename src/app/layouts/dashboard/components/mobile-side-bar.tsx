import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Sidebar } from './side-bar';

export function MobileSidebar({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="left-0 top-0 h-full w-60 max-w-[80vw] translate-x-0 translate-y-0 rounded-none border-r border-l-0 border-y-0 p-0 [&>button]:hidden">
        <Sidebar onNavigate={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
