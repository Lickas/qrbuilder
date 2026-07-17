import { useTranslation } from 'react-i18next';
import { BmcButton } from './BmcButton';
import { Github } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="footer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', marginTop: 'auto', padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <p style={{ margin: 0, color: 'var(--text-muted)' }}>{t('madeWithLove')}</p>
        
        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--border-color)' }} />
        
        <a 
          href="https://github.com/Lickas/qrbuilder" 
          target="_blank" 
          rel="noreferrer" 
          style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <Github size={18} />
          <span>Open Source on GitHub</span>
        </a>
      </div>
      
      <BmcButton />
    </footer>
  );
}
