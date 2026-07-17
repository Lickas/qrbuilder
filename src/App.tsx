import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import { toPng, toBlob } from 'html-to-image';
import { Download, Copy, Moon, Sun, Upload, X, Heart } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { Footer } from './components/Footer';
import { BmcButton } from './components/BmcButton';
import './i18n';

type FrameStyle = 'minimal' | 'bold' | 'gradient' | 'elegant' | 'playful';
type FontFamily = 'inter' | 'serif' | 'mono' | 'cursive' | 'rounded';

const FONT_MAP: Record<FontFamily, string> = {
  inter: "'Inter', sans-serif",
  serif: "'Times New Roman', 'Georgia', serif",
  mono: "'Courier New', 'Consolas', monospace",
  cursive: "'Segoe Script', 'Brush Script MT', cursive",
  rounded: "'Nunito', 'Inter', sans-serif",
};

/* ── Inline SVG Components ─────────────────────── */

const GoogleLogo = ({ size = 28 }: { size?: number }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} style={{ flexShrink: 0 }}>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const Stars = ({ color = '#FBBC05', size = 20 }: { color?: string; size?: number }) => (
  <div style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
    {[...Array(5)].map((_, i) => (
      <svg key={i} viewBox="0 0 24 24" width={size} height={size} fill={color}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ))}
  </div>
);

const GoogleMapsPin = ({ size = 32, color = '#EA4335' }: { size?: number; color?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color} style={{ flexShrink: 0 }}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
  </svg>
);

/* ── Support Modal ─────────────────────── */

function SupportModal({ onClose, onDownload }: { onClose: () => void; onDownload: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="modal-icon">
          <Heart size={32} color="#ef4444" fill="#ef4444" />
        </div>
        
        <h3 className="modal-title">{t('supportModal.title')}</h3>
        
        <p className="modal-text">{t('supportModal.line1')}</p>
        <p className="modal-text">{t('supportModal.line2')}</p>
        <p className="modal-text modal-highlight">{t('supportModal.line3')}</p>
        <p className="modal-text modal-dim">{t('supportModal.line4')}</p>

        <div className="modal-actions">
          <BmcButton />
          <button className="btn btn-ghost" onClick={onDownload}>
            {t('supportModal.close')}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main App ─────────────────────── */

function App() {
  const { t, i18n } = useTranslation();
  const [url, setUrl] = useState('https://g.page/r/.../review');
  const [qrColor, setQrColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [themeColor, setThemeColor] = useState('#3b82f6');
  const [frameStyle, setFrameStyle] = useState<FrameStyle>('minimal');

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [qrSize, setQrSize] = useState(200);
  const [cornerRadius, setCornerRadius] = useState(16);
  const [logo, setLogo] = useState<{src: string, width: number, height: number} | null>(null);
  const [logoScale, setLogoScale] = useState(25);
  const [showStars, setShowStars] = useState(true);
  const [textAlign, setTextAlign] = useState<'left'|'center'|'right'>('center');
  const [titleColor, setTitleColor] = useState('');
  const [qrBlockRadius, setQrBlockRadius] = useState(8);

  const [customTitle, setCustomTitle] = useState('');
  const [customSubtitle, setCustomSubtitle] = useState('');
  const [qrPadding, setQrPadding] = useState(16);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('H');

  const [starColor, setStarColor] = useState('#FBBC05');
  const [fontFamily, setFontFamily] = useState<FontFamily>('inter');

  const [showModal, setShowModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'download' | 'copy' | null>(null);

  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        const img = new Image();
        img.onload = () => {
          setLogo({ src, width: img.width, height: img.height });
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    }
  };

  const executeDownload = useCallback(async () => {
    if (qrRef.current) {
      try {
        const dataUrl = await toPng(qrRef.current, { cacheBust: true, pixelRatio: 3 });
        const link = document.createElement('a');
        link.download = 'google-review-qr.png';
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to generate image', err);
        toast.error('Failed to generate image');
      }
    }
  }, []);

  const executeCopy = useCallback(async () => {
    if (qrRef.current) {
      try {
        const blob = await toBlob(qrRef.current, { cacheBust: true, pixelRatio: 3 });
        if (blob) {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          toast.success(t('copySuccess'));
        }
      } catch (err) {
        console.error('Failed to copy image', err);
        toast.error('Failed to copy. Try downloading instead.');
      }
    }
  }, [t]);

  const handleDownload = () => {
    setPendingAction('download');
    setShowModal(true);
  };

  const handleCopy = () => {
    setPendingAction('copy');
    setShowModal(true);
  };

  const handleModalConfirmDownload = () => {
    setShowModal(false);
    if (pendingAction === 'copy') {
      executeCopy();
    } else {
      executeDownload();
    }
    setPendingAction(null);
  };

  const qrCodeProps = {
    value: url,
    size: qrSize,
    fgColor: qrColor,
    bgColor: "transparent",
    level: logo ? 'H' : errorLevel, // Always force High correction when logo is present
    includeMargin: false,
    imageSettings: logo ? {
      src: logo.src,
      height: logo.height >= logo.width ? (qrSize * (logoScale / 100)) : ((logo.height / logo.width) * qrSize * (logoScale / 100)),
      width: logo.width >= logo.height ? (qrSize * (logoScale / 100)) : ((logo.width / logo.height) * qrSize * (logoScale / 100)),
      excavate: true,
    } : undefined
  };

  const displayTitle = customTitle.trim() !== '' ? customTitle : t('frameText');
  const displaySubtitle = customSubtitle.trim() !== '' ? customSubtitle : t('scanMe');
  const frameFontStyle: React.CSSProperties = { fontFamily: FONT_MAP[fontFamily], textAlign };

  const QRCodeBlock = () => (
    <div style={{ padding: `${qrPadding}px`, backgroundColor: bgColor, borderRadius: `${qrBlockRadius}px` }}>
      <QRCodeSVG {...qrCodeProps as any} />
    </div>
  );

  const renderFrame = () => {
    switch (frameStyle) {
      case 'bold':
        return (
          <div className="frame-base frame-bold" style={{ borderColor: themeColor, backgroundColor: bgColor, borderRadius: `${cornerRadius}px`, ...frameFontStyle }}>
            <div className="google-badge">
              <GoogleLogo size={24} />
              {showStars && <Stars size={18} color={starColor} />}
            </div>
            <div className="frame-title" style={{ color: titleColor || themeColor }}>{displayTitle}</div>
            <QRCodeBlock />
            <div className="frame-subtitle" style={{ color: themeColor }}>
              <GoogleMapsPin size={18} color={themeColor} />
              {displaySubtitle}
            </div>
          </div>
        );
      case 'gradient':
        return (
          <div className="frame-base frame-gradient" style={{ background: `linear-gradient(135deg, ${themeColor}, #a78bfa)`, borderRadius: `${Math.max(cornerRadius, 24)}px` }}>
            <div className="frame-gradient-inner" style={{ backgroundColor: bgColor, borderRadius: `${Math.max(cornerRadius - 8, 8)}px`, ...frameFontStyle }}>
              <div className="google-badge">
                <GoogleLogo size={24} />
                {showStars && <Stars size={18} color={starColor} />}
              </div>
              <div className="frame-title" style={{ color: titleColor || themeColor }}>{displayTitle}</div>
              <QRCodeBlock />
              <div className="frame-subtitle" style={{ color: '#64748b' }}>
                <GoogleMapsPin size={18} color="#64748b" />
                {displaySubtitle}
              </div>
            </div>
          </div>
        );
      case 'elegant':
        return (
          <div className="frame-base frame-elegant" style={{ backgroundColor: bgColor, borderRadius: `${cornerRadius}px`, ...frameFontStyle }}>
            <div className="google-badge">
              <GoogleLogo size={22} />
              {showStars && <Stars size={16} color={starColor} />}
            </div>
            <div className="frame-title" style={{ color: titleColor || '#d4af37' }}>{displayTitle}</div>
            <QRCodeBlock />
            <div className="frame-subtitle" style={{ color: '#64748b' }}>
              <GoogleMapsPin size={18} color="#d4af37" />
              {displaySubtitle}
            </div>
          </div>
        );
      case 'playful':
        return (
          <div className="frame-base frame-playful" style={{ borderColor: themeColor, backgroundColor: bgColor, borderRadius: `${Math.max(cornerRadius, 30)}px`, ...frameFontStyle }}>
            <div className="google-badge playful-badge">
              <GoogleLogo size={28} />
              {showStars && <Stars size={22} color={starColor} />}
            </div>
            <div className="frame-title" style={{ color: titleColor || themeColor }}>{displayTitle}</div>
            <QRCodeBlock />
            <div className="frame-subtitle" style={{ color: '#64748b' }}>
              <GoogleMapsPin size={20} color={themeColor} />
              {displaySubtitle}
            </div>
          </div>
        );
      case 'minimal':
      default:
        return (
          <div className="frame-base frame-minimal" style={{ backgroundColor: bgColor, borderRadius: `${cornerRadius}px`, ...frameFontStyle }}>
            <div className="google-badge">
              <GoogleLogo size={24} />
              {showStars && <Stars size={18} color={starColor} />}
            </div>
            <div className="frame-title" style={{ color: titleColor || themeColor }}>{displayTitle}</div>
            <QRCodeBlock />
            <div className="frame-subtitle" style={{ color: '#64748b' }}>
              <GoogleMapsPin size={18} color="#64748b" />
              {displaySubtitle}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      <Toaster position="top-center" />

      {showModal && (
        <SupportModal
          onClose={handleModalConfirmDownload}
          onDownload={handleModalConfirmDownload}
        />
      )}

      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <header className="header">
        <h1>{t('title')}</h1>
        <p>{t('subtitle')}</p>
      </header>

      <main className="main-content">
        {/* Customization Panel */}
        <div className="panel">
          <h2 className="section-title">{t('customization')}</h2>

          <div className="form-group">
            <label>{t('googleMapsLink')}</label>
            <input
              type="text"
              className="form-control"
              placeholder={t('linkPlaceholder')}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>{t('uploadLogo')}</label>
            <div className="file-upload-wrapper">
              <div className="file-btn">
                <Upload size={18} />
                <span>{logo ? 'Logo Selected ✓' : 'Choose an image'}</span>
              </div>
              <input type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={handleLogoUpload} />
            </div>
          </div>
          
          {logo && (
            <div className="form-group">
              <label style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                <span>{t('logoScale')}</span>
                <span style={{color: 'var(--primary)'}}>{logoScale}%</span>
              </label>
              <input type="range" min="10" max="40" step="1" value={logoScale} onChange={(e) => setLogoScale(parseInt(e.target.value))} />
            </div>
          )}

          <div className="grid-2">
            <div className="form-group">
              <label>{t('qrColor')}</label>
              <input type="color" className="form-control" value={qrColor} onChange={(e) => setQrColor(e.target.value)} />
            </div>
            <div className="form-group">
              <label>{t('bgColor')}</label>
              <input type="color" className="form-control" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>{t('frameTheme')}</label>
              <input type="color" className="form-control" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} />
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{t('starColor')}</span>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', margin: 0 }}>
                  <input type="checkbox" checked={showStars} onChange={(e) => setShowStars(e.target.checked)} style={{ width: 'auto' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('showStars')}</span>
                </label>
              </label>
              <input type="color" className="form-control" value={starColor} onChange={(e) => setStarColor(e.target.value)} disabled={!showStars} />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>{t('frameStyle')}</label>
              <select className="form-control" value={frameStyle} onChange={(e) => setFrameStyle(e.target.value as FrameStyle)}>
                <option value="minimal">{t('styles.minimal')}</option>
                <option value="bold">{t('styles.bold')}</option>
                <option value="gradient">{t('styles.gradient')}</option>
                <option value="elegant">{t('styles.elegant')}</option>
                <option value="playful">{t('styles.playful')}</option>
              </select>
            </div>
            <div className="form-group">
              <label>{t('fontFamily')}</label>
              <select className="form-control" value={fontFamily} onChange={(e) => setFontFamily(e.target.value as FontFamily)}>
                <option value="inter">{t('fonts.inter')}</option>
                <option value="serif">{t('fonts.serif')}</option>
                <option value="mono">{t('fonts.mono')}</option>
                <option value="cursive">{t('fonts.cursive')}</option>
                <option value="rounded">{t('fonts.rounded')}</option>
              </select>
            </div>
          </div>

          <hr className="divider" />
          <h3 className="section-subtitle">{t('textOverrides')}</h3>

          <div className="grid-2">
            <div className="form-group">
              <label>{t('customTitle')}</label>
              <input type="text" className="form-control" placeholder={t('frameText')} value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label>{t('customSubtitle')}</label>
              <input type="text" className="form-control" placeholder={t('scanMe')} value={customSubtitle} onChange={(e) => setCustomSubtitle(e.target.value)} />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>{t('textAlign')}</label>
              <select className="form-control" value={textAlign} onChange={(e) => setTextAlign(e.target.value as any)}>
                <option value="left">{t('alignLeft')}</option>
                <option value="center">{t('alignCenter')}</option>
                <option value="right">{t('alignRight')}</option>
              </select>
            </div>
            <div className="form-group">
              <label>{t('titleColor')}</label>
              <input type="color" className="form-control" value={titleColor || themeColor} onChange={(e) => setTitleColor(e.target.value)} />
            </div>
          </div>

          <hr className="divider" />
          <h3 className="section-subtitle">{t('advancedOptions')}</h3>

          <div className="grid-2">
            <div className="form-group">
              <label style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                <span>{t('qrSize')}</span>
                <span style={{color: 'var(--primary)'}}>{qrSize}px</span>
              </label>
              <input type="range" min="100" max="350" step="10" value={qrSize} onChange={(e) => setQrSize(parseInt(e.target.value))} />
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                <span>{t('cornerRadius')}</span>
                <span style={{color: 'var(--primary)'}}>{cornerRadius}px</span>
              </label>
              <input type="range" min="0" max="100" step="4" value={cornerRadius} onChange={(e) => setCornerRadius(parseInt(e.target.value))} />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                <span>{t('qrMargin')}</span>
                <span style={{color: 'var(--primary)'}}>{qrPadding}px</span>
              </label>
              <input type="range" min="0" max="60" step="4" value={qrPadding} onChange={(e) => setQrPadding(parseInt(e.target.value))} />
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                <span>{t('qrBlockRadius')}</span>
                <span style={{color: 'var(--primary)'}}>{qrBlockRadius}px</span>
              </label>
              <input type="range" min="0" max="40" step="4" value={qrBlockRadius} onChange={(e) => setQrBlockRadius(parseInt(e.target.value))} />
            </div>
          </div>

          <div className="form-group">
            <label>{t('errorLevel')}</label>
            <select className="form-control" value={errorLevel} onChange={(e) => setErrorLevel(e.target.value as any)}>
              <option value="L">L (7%)</option>
              <option value="M">M (15%)</option>
              <option value="Q">Q (25%)</option>
              <option value="H">H (30%)</option>
            </select>
          </div>

          <hr className="divider" />

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>{t('language')}</label>
            <select className="form-control" value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)}>
              <option value="en">English</option>
              <option value="pt">Português</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="panel preview-container">
          <h2 className="section-title">{t('preview')}</h2>

          <div className="qr-frame-wrapper" ref={qrRef}>
            {renderFrame()}
          </div>

          <div className="action-buttons">
            <button className="btn btn-secondary" onClick={handleCopy}>
              <Copy size={20} />
              {t('copyClipboard')}
            </button>
            <button className="btn btn-primary" onClick={handleDownload} style={{marginTop: 0}}>
              <Download size={20} />
              {t('downloadPng')}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
