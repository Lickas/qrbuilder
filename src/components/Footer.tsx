import { useTranslation } from 'react-i18next';
import { BmcButton } from './BmcButton';

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
          style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s ease' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.34 6-1.53 6-6.76a5.2 5.2 0 0 0-1.5-3.78c.15-.45.65-1.78-.15-3.72 0 0-1.2-.38-3.9 1.45a13.38 13.38 0 0 0-7 0C4.6 2.11 3.4 2.49 3.4 2.49c-.8 1.94-.3 3.27-.15 3.72A5.2 5.2 0 0 0 1.75 10c0 5.23 3 6.42 6 6.76a4.8 4.8 0 0 0-1 3.24v4"></path>
            <path d="M8 22v-4"></path>
          </svg>
          <span>Open Source</span>
        </a>

        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--border-color)' }} />
        
        <a 
          href="mailto:hello@leandroxws.dev?subject=ReviewQR%20Feedback"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s ease' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <span>Bugs & Suggestions</span>
        </a>
      </div>
      
      <BmcButton />
    </footer>
  );
}
