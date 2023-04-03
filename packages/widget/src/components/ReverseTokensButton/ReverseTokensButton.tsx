import { useEffect } from 'react';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useFormContext } from 'react-hook-form';
import { SwapFormKey } from '../../providers';
import { IconButton } from './ReverseTokensButton.style';
import { useChains } from '../../hooks';

export const ReverseTokensButton: React.FC<{ vertical?: boolean }> = ({
  vertical,
}) => {
  const { setValue, getValues } = useFormContext();
  const handleClick = () => {
    const [fromChain, fromToken, toChain, toToken] = getValues([
      SwapFormKey.FromChain,
      SwapFormKey.FromToken,
      SwapFormKey.ToChain,
      SwapFormKey.ToToken,
    ]);
    setValue(SwapFormKey.FromAmount, '', { shouldTouch: true });
    setValue(SwapFormKey.FromChain, toChain, { shouldTouch: true });
    setValue(SwapFormKey.FromToken, toToken, { shouldTouch: true });
    setValue(SwapFormKey.ToChain, fromChain, { shouldTouch: true });
    setValue(SwapFormKey.ToToken, fromToken, { shouldTouch: true });
  };



  const { fromChain, fromToken, toToken, toChain } = getValues();

  const { getChainById } = useChains();

  const data1 = getChainById(fromChain);
  const fromChainKey = data1?.key;

  const data2 = getChainById(toChain);
  const toChainKey = data2?.key;

  useEffect(()=>{
    if (fromChainKey || toChainKey) {
      const url = new URL(window.location as any);
        let params = [];
        if (fromChainKey && fromToken) {
          params.push(`?fromChain=${fromChainKey}`);
          params.push(`&fromToken=${fromToken}`);
        }
        if (toChainKey && toToken) {
          params.push(`&toChain=${toChainKey}`);
          params.push(`&toToken=${toToken}`);
        }
        const paramsString = params.join('');
        window.history.replaceState(null, '', `${url.origin}${paramsString}`);
    }
    },[fromChainKey,toChainKey,fromToken,toToken])
  
  return (
    <IconButton onClick={handleClick} size="small">
      {vertical ? <SwapVertIcon /> : <SwapHorizIcon />}
    </IconButton>
  );
};