import { Address, Avatar, EthBalance, Identity, Name } from '@coinbase/onchainkit/identity';
import { useAddFrame, useMiniKit } from '@coinbase/onchainkit/minikit';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import { useCallback, useMemo, useState } from 'react';
import { Button, Icon } from '@/components/common';

/**
 * ヘッダーコンポーネント
 */
export const Header = () => {
  const { context } = useMiniKit();
  const addFrame = useAddFrame();

  const [frameAdded, setFrameAdded] = useState(false);

  // フレームをユーザーに追加してもらう（クライアントで保存操作を促す）
  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  // ヘッダー右上の「Save Frame」ボタンの表示制御
  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddFrame}
          className="p-2 sm:p-4 text-xs sm:text-sm cyber-button-accent cyber-glow min-h-8 sm:min-h-auto"
          icon={<Icon name="plus" size="sm" className="cyber-text-accent" />}
        >
          <span className="hidden sm:inline cyber-text-accent">Save Frame</span>
          <span className="sm:hidden cyber-text-accent">Save</span>
        </Button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex animate-fade-out items-center space-x-1 text-xs sm:text-sm font-medium cyber-text-success cyber-glow cyber-pulse">
          <Icon name="check" size="sm" className="cyber-text-success" />
          <span>Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  return (
    <header className="mb-2 sm:mb-4 flex min-h-10 sm:min-h-12 items-center justify-between px-2 sm:px-4 py-1 sm:py-2 cyber-panel cyber-border-glow">
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Wallet className="z-10">
            <ConnectWallet className="text-xs sm:text-base px-2 sm:px-4 py-1 sm:py-2 min-h-8 sm:min-h-10 cyber-button cyber-text-primary">
              <Name className="text-inherit truncate max-w-24 sm:max-w-none cyber-glow" />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-2 sm:px-4 pb-2 pt-3 cyber-panel" hasCopyAddressOnClick>
                <Avatar className="w-6 h-6 sm:w-10 sm:h-10 cyber-border-glow" />
                <Name className="text-xs sm:text-base cyber-text-primary" />
                <Address className="text-xs sm:text-sm cyber-text-secondary" />
                <EthBalance className="text-xs sm:text-sm cyber-text-accent" />
              </Identity>
              <WalletDropdownDisconnect className="text-xs sm:text-sm cyber-button-secondary" />
            </WalletDropdown>
          </Wallet>
        </div>
      </div>
      <div className="flex-shrink-0 ml-1 sm:ml-2">{saveFrameButton}</div>
    </header>
  );
};
