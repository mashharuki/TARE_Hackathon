import { useOpenUrl } from '@coinbase/onchainkit/minikit';
import { Button } from '@/components/common';
/**
 * フッターコンポーネント
 */
export const Footer = () => {
  const openUrl = useOpenUrl();

  return (
    <footer className="mt-4 sm:mt-2 flex justify-center pt-3 sm:pt-4 px-4 cyber-panel cyber-border-glow">
      {/* Base（Onchain）公式ドキュメントへ遷移 */}
      <Button
        variant="ghost"
        size="sm"
        className="text-xs sm:text-sm cyber-text-secondary px-2 py-2 min-h-8 touch-manipulation cyber-button-secondary hover:cyber-glow-hover"
        onClick={() => openUrl('https://base.org/builders/minikit')}
      >
        <span className="text-center leading-tight cyber-glow">Built on Base with MiniKit</span>
      </Button>
    </footer>
  );}
};
