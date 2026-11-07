import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTranslation } from 'react-i18next';

interface HindiLanguageNoticeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToUrdu: () => void;
}

export default function HindiLanguageNotice({ open, onOpenChange, onSwitchToUrdu }: HindiLanguageNoticeProps) {
  const { t } = useTranslation();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('languageNotice.title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('languageNotice.message')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('languageNotice.dismiss')}</AlertDialogCancel>
          <AlertDialogAction onClick={onSwitchToUrdu}>{t('languageNotice.switchToUrdu')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}