import { create } from "zustand";

// 먼저 getCallerInfo 함수를 정의합니다
const getCallerInfo = () => {
  try {
    const err = new Error();
    const stack = err.stack?.split('\n').map(line => line.trim()) || [];
    
    // 스토어 자체의 호출은 건너뜀 (첫 2개 라인)
    const callStack = stack.slice(2);

    for (const line of callStack) {
      // 불필요한 항목 필터링
      if (
        line.includes('webpack') || 
        line.includes('node_modules') || 
        line.includes('bundle.js') ||
        line.includes('webpack-internal') ||
        line.includes('<anonymous>')
      ) {
        continue;
      }

      // setCenter 호출 패턴 찾기
      const functionCallPattern = /at\s+(\w+)\s*[\(<]([^)>]+)[)>]/;
      const pathPattern = /[\\/]src[\\/](.*?)\.(js|jsx|ts|tsx):/;
      
      const matchCall = line.match(functionCallPattern);
      const matchPath = line.match(pathPattern);

      if (matchPath) {
        const [_, path] = matchPath;
        const components = path.split(/[\\/]/);
        const componentName = components[components.length - 1];
        const functionName = matchCall ? matchCall[1] : '';
        
        return {
          component: componentName,
          function: functionName,
          fullPath: path
        };
      }
    }

    // 스택에서 찾지 못한 경우 호출 컨텍스트에서 찾기 시도
    const callerContext = stack[3]?.match(/at\s+(.*?)\s+\(/)?.[1];
    if (callerContext && !callerContext.includes('webpack')) {
      return {
        component: callerContext,
        function: 'unknown',
        fullPath: callerContext
      };
    }

    return {
      component: 'unknown',
      function: 'unknown',
      fullPath: 'unknown'
    };
  } catch (error) {
    console.error('Error parsing stack:', error);
    return {
      component: 'error',
      function: 'error',
      fullPath: error.message
    };
  }
};

// 그리고 useMapStore를 정의합니다
const useMapStore = create(set => ({
  center: {
    lat: null,
    lng: null,
  },
  errMsg: null,
  isLoading: true,
  previousCenter: null,
  lastCallerInfo: null,
  actions: {
    setErrMsg: (value) =>
      set(state => ({
        errMsg: value
      })),
    setIsLoading: (value) =>
      set(state => ({
        isLoading: value
      })),
    setCenter: (lat, lng, source = '') => {
      const callerInfo = getCallerInfo();
      const currentState = useMapStore.getState();
      
      console.group('🌍 MapStore setCenter');
      console.log('📍 Component:', callerInfo.component);
      console.log('🔧 Function:', callerInfo.function);
      if (source) console.log('🏷️ Source:', source);
      console.log('🔄 Previous:', currentState.center);
      console.log('✨ New:', { lat, lng });
      console.log('⏰ Time:', new Date().toLocaleTimeString());
      
      if (callerInfo.component === 'unknown') {
        console.log('📚 Debug Stack:', new Error().stack);
      }
      
      console.groupEnd();

      set(state => ({
        ...state,
        previousCenter: state.center,
        center: {
          lat: lat,
          lng: lng
        },
        lastCallerInfo: callerInfo
      }));
    },
    resetMapState: () =>
      set({
        center: {
          lat: null,
          lng: null,
        },
        errMsg: null,
        isLoading: true,
        previousCenter: null,
        lastCallerInfo: null
      })
  }
}));

export const useMap = () => {
  return useMapStore(state => ({
    center: state.center,
    errMsg: state.errMsg,
    isLoading: state.isLoading,
    previousCenter: state.previousCenter,
    lastCallerInfo: state.lastCallerInfo
  }));
};

export const useMapActions = () => useMapStore((state) => state.actions);

export default useMapStore;