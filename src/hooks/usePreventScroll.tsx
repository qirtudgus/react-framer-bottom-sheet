import { useCallback, useEffect, useRef } from 'react';
import { UsePreventScrollProps } from '../sheetType';

const usePreventScroll = ({
  scrollRef,
  footerRef,
  bottomScrollLock,
  position,
  portalContainer,
}: UsePreventScrollProps) => {
  const hasScrolledRef = useRef(false);
  const initialTouchYCoordRef = useRef(0);
  const lastScrollTopRef = useRef<number>(0);
  // 요소가 스크롤을 가지고 있는지 판단하는 함수
  const doesElementHaveScroll = (element: HTMLElement) => {
    return element.scrollHeight > element.clientHeight;
  };
  // TODO [ ] - 불필요한 변수 제거하기
  // 위로 슬라이드 시 이벤트를 방지할지 결정하는 함수
  const shouldPreventOnSlideUp = useCallback(
    (hasScroll: boolean, isTopPosition: boolean) => {
      // 스크롤이 없고, 현재 위치가 'top'인지 확인
      const isNoScrollAndTop = !hasScroll && isTopPosition;
      // 바텀일 때 스크롤이 잠금이 true인지, 현재 위치가 'bottom'인지 확인
      const isBottomLocked = bottomScrollLock && position.current === 'bottom';
      return isNoScrollAndTop || isBottomLocked;
    },
    [bottomScrollLock, position]
  );
  useEffect(() => {
    if (!scrollRef.current) return;
    const handleTouchStart = (e: TouchEvent) => {
      if (!scrollRef.current) return;
      initialTouchYCoordRef.current = e.touches[0]?.clientY ?? 0; // 터치 시작점의 Y 좌표 저장
      hasScrolledRef.current = doesElementHaveScroll(scrollRef.current); // 세로 스크롤 여부를 판단
    };
    const handleTouchEnd = () => {
      if (!scrollRef.current) return;
      hasScrolledRef.current = doesElementHaveScroll(scrollRef.current); // 세로 스크롤 여부를 재확인
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!scrollRef.current || !e.touches[0]) return;
      const touchEndY = e.touches[0].clientY;
      const isSlideDown = touchEndY > initialTouchYCoordRef.current;
      const shouldPreventDown =
        !hasScrolledRef.current ||
        scrollRef.current.scrollTop <= 0 ||
        (bottomScrollLock && position.current === 'bottom');
      // 위로 움직였을 때, 스크롤이 없거나 현재 위치가 'top'이거나 바텀 스크롤 잠금이 있는 경우 위로 스크롤 막기
      const shouldPreventUP = shouldPreventOnSlideUp(
        hasScrolledRef.current,
        position.current === 'top'
      );
      // 아래로 슬라이드하고 스크롤을 막아야 할 경우
      if (isSlideDown && shouldPreventDown && e.cancelable) {
        e.preventDefault();
      } else if (!isSlideDown && shouldPreventUP && e.cancelable) {
        e.preventDefault();
      }
    };
    let prevValue = 0;
    // Safari에서의 오버스크롤을 방지하는 함수
    const preventSafariOverscrollOnStart = () => {
      if (!scrollRef.current) return;
      if (scrollRef.current.scrollTop <= 0) {
        prevValue = scrollRef.current.scrollTop;
      }
    };
    // Safari에서의 오버스크롤을 방지하는 함수
    const preventSafariOverscrollOnMove = (e: TouchEvent) => {
      if (!scrollRef.current) return;
      if (
        scrollRef.current.scrollTop <= 0 &&
        scrollRef.current.scrollTop < prevValue
      ) {
        e.preventDefault();
      }
    };

    const recordScrollTop = () => {
      if (scrollRef.current) {
        lastScrollTopRef.current = scrollRef.current.scrollTop;
      }
    };

    const bottomLockScrollEvent = (e: Event) => {
      if (bottomScrollLock && position.current === 'bottom') {
        e.preventDefault();
      }
    };
    //footerElement 이벤트 막기
    const footerPrevent = (e: TouchEvent) => {
      e.preventDefault();
    };
    if (footerRef.current) {
      footerRef.current.addEventListener('touchmove', footerPrevent, {
        passive: false,
      });
    }

    scrollRef.current.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    });
    scrollRef.current.addEventListener('touchmove', handleTouchMove, {
      passive: false,
    });
    scrollRef.current.addEventListener('touchend', handleTouchEnd);
    scrollRef.current.addEventListener(
      'touchmove',
      preventSafariOverscrollOnMove,
      {
        passive: false,
      }
    );
    scrollRef.current.addEventListener(
      'touchstart',
      preventSafariOverscrollOnStart,
      {
        passive: true,
      }
    );

    scrollRef.current.addEventListener('scroll', recordScrollTop);
    scrollRef.current.addEventListener('wheel', bottomLockScrollEvent);

    return () => {
      if (!scrollRef.current) return;
      scrollRef.current.removeEventListener('touchstart', handleTouchStart);
      scrollRef.current.removeEventListener('touchmove', handleTouchMove);
      scrollRef.current.removeEventListener('touchend', handleTouchEnd);
      scrollRef.current.removeEventListener(
        'touchmove',
        preventSafariOverscrollOnMove
      );
      scrollRef.current.removeEventListener(
        'touchstart',
        preventSafariOverscrollOnStart
      );
      scrollRef.current.removeEventListener('scroll', recordScrollTop);
      scrollRef.current.removeEventListener('wheel', bottomLockScrollEvent);
      if (footerRef.current) {
        footerRef.current.removeEventListener('touchmove', footerPrevent);
      }
    };
  }, [
    scrollRef,
    bottomScrollLock,
    position,
    shouldPreventOnSlideUp,
    footerRef,
    portalContainer,
  ]);
  return {
    hasScrolledRef,
    initialTouchYCoordRef,
    lastScrollTopRef,
  };
};
export { usePreventScroll };
