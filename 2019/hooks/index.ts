import useIsMounted from './lib/useIsMounted';
import useDebounce from './lib/useDebounce';
import useThrottle from './lib/useThrottle';
import useWindowSize from './lib/useWindowSize';
import useLoadIf from './lib/useLoadIf';
import useReloadIf from './lib/useReloadIf';

const hooks = { useWindowSize, useDebounce, useThrottle, useIsMounted, useLoadIf, useReloadIf };
export { useWindowSize, useDebounce, useThrottle, useIsMounted, useLoadIf, useReloadIf };
export default hooks;
