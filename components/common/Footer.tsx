import { useOpenUrl } from '@coinbase/onchainkit/minikit';
import { Button } from '@/components/common';
/**
 * フッターコンポーネント
 */
export const Footer = () => {
  const openUrl = useOpenUrl();

  return (
    <footer className="mt-4 sm:mt-2 flex justify-center pt-3 sm:pt-4 px-4">
      {/* Base（Onchain）公式ドキュメントへ遷移 */}
      <Button
        variant="ghost"
        size="sm"
        className="text-xs sm:text-sm text-[var(--ock-text-foreground-muted)] px-2 py-2 min-h-8 touch-manipulation"
        onClick={() => openUrl('https://base.org/builders/minikit')}
      >
        <span className="text-center leading-tight">Built on Base with MiniKit</span>
      </Button>
    </footer>
  );
};
