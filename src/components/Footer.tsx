import { useTranslation } from 'react-i18next';
import { BmcButton } from './BmcButton';

export function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="footer">
      <p>{t('madeWithLove')}</p>
      <BmcButton />
    </footer>
  );
}
