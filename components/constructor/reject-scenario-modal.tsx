'use client';

import { useState } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Scenario } from '@/lib/data';

interface RejectScenarioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scenario: Scenario;
  onReject?: (comment: string) => void;
  isLoading?: boolean;
}

export function RejectScenarioModal({ 
  open, 
  onOpenChange, 
  scenario, 
  onReject, 
  isLoading 
}: RejectScenarioModalProps) {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleReject = () => {
    if (!comment.trim()) {
      setError('Комментарий обязателен при возврате на доработку');
      return;
    }
    
    setError('');
    onReject?.(comment);
    setComment('');
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setComment('');
      setError('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-destructive" />
            Возврат на доработку
          </DialogTitle>
          <DialogDescription>
            Сценарий "{scenario.name}" будет возвращен аналитику с указанными замечаниями.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Комментарий согласующего *
            </label>
            <Textarea
              placeholder="Укажите причины возврата на доработку и рекомендации по исправлению..."
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                if (error) setError('');
              }}
              className={cn(error && 'border-destructive')}
              rows={4}
              disabled={isLoading}
            />
            {error && (
              <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {error}
              </p>
            )}
          </div>

          <div className="bg-sm-blue/5 border border-sm-blue/20 rounded-lg p-3">
            <p className="text-sm text-sm-blue">
              <strong>Уведомление:</strong> Аналитик получит это замечание и может повторно отправить сценарий на согласование.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            Отмена
          </Button>
          <Button
            className="bg-destructive hover:bg-destructive/90"
            onClick={handleReject}
            disabled={isLoading || !comment.trim()}
          >
            {isLoading ? 'Обработка...' : 'Вернуть на доработку'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
