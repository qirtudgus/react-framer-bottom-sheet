import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import { PanInfo, motion, useAnimation } from 'framer-motion';
import { createPortal } from 'react-dom';

import { usePreventScroll } from './hooks/usePreventScroll';
import React from 'react';
import { FramerBottomSheetType, SnapType } from './sheetType';

const FramerBottomSheet: FramerBottomSheetType = (
  {
    initialPosition = 'bottom',
    onOpenEnd,
    onCloseEnd,
    header = true,
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
  const [position, setPosition] = useState(initialPosition);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const maxHeight = snapPoint.top.height;
  const minHeight = snapPoint.bottom.height;

  const heightVariantMemo = useMemo(() => {
    return {
      top: { y: `0px` },
      bottom: { y: `${maxHeight - minHeight}px` },
    };
  }, [maxHeight, minHeight]);

  usePreventScroll({
    scrollRef,
    bottomScrollLock,
    position,
    header,
  });

  useImperativeHandle(externalRef, () => ({
    snapTo: (position: SnapType) => {
      setPosition(position);
    },
    getPosition: () => {
      return position;
    },
  }));

  const handleClose = async (event: MouseEvent | TouchEvent | PointerEvent) => {
    setPosition('bottom');
    controls.start('bottom');
    onCloseEnd && (await onCloseEnd(event));
  };

  const handleOpen = async (event: MouseEvent | TouchEvent | PointerEvent) => {
    setPosition('top');
    controls.start('top');
    onOpenEnd && (await onOpenEnd(event));
  };

  const handleRestorePosition = () => {
    controls.start(position);
  };

  const onDragEnd = async (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const speedY = info.velocity.y;
    const shouldClose = speedY > 0;
    const shouldOpen = speedY < -0;

    if (shouldClose) {
      await handleClose(event);
    } else if (shouldOpen) {
      await handleOpen(event);
    } else {
      handleRestorePosition();
    }
  };

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);
  //열고 닫기
  useEffect(() => {
    controls.start(position);
  }, [controls, position]);

  return (
    <>
      {createPortal(
        <motion.div
          data-container-ref
          ref={containerRef}
          onDragEnd={onDragEnd}
          drag={'y'}
          initial={position}
          animate={controls}
          variants={heightVariantMemo}
          dragConstraints={
            dragConstraints ?? {
              top: 0,
              bottom: maxHeight - minHeight,
            }
          }
          dragMomentum={dragMomentum ?? false}
          dragElastic={{ top: 0, bottom: 0 }}
          dragTransition={
            dragTransition ?? { min: 0, max: 0, bounceStiffness: 400 }
          }
          transition={{
            type: 'just',
          }}
          style={{
            position: 'fixed',
            bottom: '0',
            left: '0',
            display: 'flex',
            width: '100vw',
            overflow: 'hidden',
            userSelect: 'auto',
            flexDirection: 'column',
            overscrollBehavior: 'none',
            borderRadius: '1.5rem 1.5rem 0 0',
            boxShadow: '0 -3px 7px 0 rgba(0,0,0,0.1)',
            height: maxHeight,
            zIndex: 3,
            ...style,
          }}
          {...props}
        >
          {header && (
            <div
              data-header-ref
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
              overflow:
                bottomScrollLock && position === 'bottom' ? 'hidden' : 'auto',
            }}
          >
            <div data-content-ref ref={contentRef}>
              {children}
            </div>
          </motion.div>
          {footerElement && (
            <div
              data-footer-ref
              style={{
                height: 'fit-content',
                flexShrink: 0,
                textAlign: 'center',
              }}
            >
              {footerElement}
            </div>
          )}
        </motion.div>,
        portalContainer ?? document.body
      )}
    </>
  );
};
const FramerBottomSheetRef = forwardRef(FramerBottomSheet);
export { FramerBottomSheetRef as FramerBottomSheet };
