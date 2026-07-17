import { useTranslation } from 'react-i18next';

export function BmcButton() {
  const { t } = useTranslation();
  
  // We use the exact image API from Buy Me A Coffee that the script generates.
  // This guarantees the button ALWAYS renders instantly in React, without relying on async script tags that can fail in modals.
  const bmcImageUrl = `https://img.buymeacoffee.com/button-api/?text=${encodeURIComponent('Buy me a coffee')}&emoji=&slug=lickas&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff`;

  return (
    <a 
      href="https://buymeacoffee.com/lickas" 
      target="_blank" 
      rel="noreferrer" 
      className="bmc-btn-container"
      style={{ display: 'inline-block', transition: 'transform 0.2s ease' }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <img src={bmcImageUrl} alt={t('buyMeCoffee') || 'Buy me a coffee'} style={{ height: '40px', width: 'auto' }} />
    </a>
  );
}
