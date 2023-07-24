import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { PanInfo, motion, useAnimation } from 'framer-motion';
import { createPortal } from 'react-dom';

import { usePreventScroll } from './hooks/usePreventScroll';
import React from 'react';
import { FramerBottomSheetType, SnapType } from './sheetType';
import useWindowSize from './hooks/useWindowSize';

const FramerBottomSheet: FramerBottomSheetType = (
  {
    initialPosition = 'bottom',
    openVelocity = 30,
    closeVelocity = -30,
    onOpenEnd,
    onCloseEnd,
    onMount,
    onUnmount,
    headerElement,
    footerElement,
    snapPoint,
    bottomScrollLock = false,
    children,
    style,
    portalContainer,
    dragTransition,
    dragMomentum,
    dragConstraints,
    ...props
  },
  externalRef
) => {
  const { height } = useWindowSize();
  const [footerHeight, setFooterHeight] = useState(0);
  const positionRef = useRef<SnapType>(initialPosition);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const controls = useAnimation();
  const maxHeight = snapPoint.top.height;
  const minHeight = snapPoint.bottom.height;
  const bottomTransFormYValue = maxHeight - minHeight;
  const initialY = initialPosition === 'top' ? 0 : bottomTransFormYValue;
  const containerY = useRef<number>(initialY);

  const heightVariantMemo = useMemo(() => {
    return {
      top: { y: `0px` },
      bottom: { y: `${bottomTransFormYValue}px` },
    };
  }, [bottomTransFormYValue]);

  const { lastScrollTopRef } = usePreventScroll({
    scrollRef,
    footerRef,
    bottomScrollLock,
    position: positionRef,
    portalContainer,
  });

  const sheetControl = (position: SnapType) => {
    controls.start(position);
    containerY.current = position === 'top' ? 0 : bottomTransFormYValue;
    positionRef.current = position;
  };

  useImperativeHandle(externalRef, () => ({
    snapTo: (position: SnapType) => {
      sheetControl(position);
    },
    getPosition: () => {
      return positionRef.current;
    },
    getContentScrollTop: () => {
      return lastScrollTopRef.current;
    },
    contentScrollTo: scrollValue => {
      if (scrollRef.current && scrollRef.current.scrollHeight) {
        scrollRef.current.scrollTop = scrollValue;
      }
    },
    getElements: () => {
      return {
        containerRef: containerRef.current,
        headerRef: headerRef.current,
        scrollRef: scrollRef.current,
        contentRef: contentRef.current,
        footerRef: footerRef.current,
      };
    },
  }));

  // 각 포지션에 맞게 Y value init
  const handleClose = async (event: MouseEvent | TouchEvent | PointerEvent) => {
    sheetControl('bottom');
    onCloseEnd && (await onCloseEnd(event));
  };
  const handleOpen = async (event: MouseEvent | TouchEvent | PointerEvent) => {
    sheetControl('top');
    onOpenEnd && (await onOpenEnd(event));
  };

  const handleSlow = async (
    event: MouseEvent | TouchEvent | PointerEvent,
    yValue: number
  ) => {
    // 'top' 스냅포인트와 'bottom' 스냅포인트까지의 거리 계산
    const distanceToTop = Math.abs(yValue - 0);
    const distanceToBottom = Math.abs(yValue - bottomTransFormYValue);

    if (distanceToTop < distanceToBottom) {
      await handleOpen(event);
    } else {
      await handleClose(event);
    }
  };

  //드래그 속도가 느릴 때 가까운 스냅포인트를 계산하기위함
  const onDrag = (
    _: MouseEvent | TouchEvent | PointerEvent,
    { delta }: PanInfo
  ) => {
    containerY.current = Math.max(containerY.current + delta.y, 0);
  };

  const onDragEnd = async (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const speedY = info.velocity.y;
    const yValue = containerY.current;
    const shouldClose = speedY > openVelocity;
    const shouldOpen = speedY < closeVelocity;
    if (shouldClose) {
      await handleClose(event);
    } else if (shouldOpen) {
      await handleOpen(event);
    } else {
      await handleSlow(event, yValue);
    }
  };

  //footerElement 높이만큼 시트의 bottom에 할당
  useLayoutEffect(() => {
    if (footerRef.current && footerElement) {
      setFooterHeight(footerRef.current.scrollHeight);
    }
  }, [footerElement]);

  // 브라우저 리사이징 대응 & 초기 포지션 설정
  useLayoutEffect(() => {
    controls.start(positionRef.current, { duration: 0 });
  }, [height, portalContainer, controls]);

  //mount, unmount 함수
  useEffect(() => {
    onMount && onMount();
    return () => {
      onUnmount && onUnmount(lastScrollTopRef.current);
    };
  }, [lastScrollTopRef, onMount, onUnmount]);

  return (
    <>
      {createPortal(
        <>
          <motion.div
            data-container-ref
            ref={containerRef}
            drag={'y'}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
            dragDirectionLock={true}
            animate={controls}
            variants={heightVariantMemo}
            dragConstraints={
              dragConstraints ?? {
                top: 0,
                bottom: bottomTransFormYValue,
              }
            }
            dragMomentum={dragMomentum ?? false}
            dragElastic={{ top: 0, bottom: 0 }}
            dragTransition={
              dragTransition ?? { min: 0, max: 0, bounceStiffness: 400 }
            }
            transition={{
              type: 'tween',
            }}
            style={{
              position: 'fixed',
              left: '0',
              display: 'flex',
              width: '100vw',
              overflow: 'hidden',
              userSelect: 'auto',
              flexDirection: 'column',
              overscrollBehavior: 'none',
              borderRadius: '1.5rem 1.5rem 0 0',
              boxShadow: '0 -3px 7px 0 rgba(0,0,0,0.1)',
              willChange: 'transform',
              zIndex: 3,
              height: maxHeight,
              bottom: footerHeight ?? 0,
              ...style,
            }}
            {...props}
          >
            {headerElement && (
              <div
                data-header-ref
                ref={headerRef}
                style={{
                  height: 'fit-content',
                  flexShrink: 0,
                  textAlign: 'center',
                }}
              >
                {headerElement}
              </div>
            )}
            <motion.div
              data-scroll-ref
              onPointerDownCapture={e => {
                if (scrollRef.current && scrollRef.current.scrollTop !== 0) {
                  e.stopPropagation();
                }
              }}
              ref={scrollRef}
              style={{
                WebkitOverflowScrolling: 'touch',
                userSelect: 'auto',
                overscrollBehavior: 'contain',
                height: '100%',
                flexGrow: 1,
                overflow: 'auto',
              }}
            >
              <div data-content-ref ref={contentRef}>
                {children}
              </div>
            </motion.div>
          </motion.div>
          {footerElement && (
            <div
              ref={footerRef}
              data-footer-ref
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                zIndex: 10,
                height: 'fit-content',
                width: '100%',
                flexShrink: 0,
              }}
            >
              {footerElement}
            </div>
          )}
        </>,
        portalContainer ? portalContainer : document.body
      )}
    </>
  );
};
const FramerBottomSheetRef = forwardRef(FramerBottomSheet);
export { FramerBottomSheetRef as FramerBottomSheet };
