import React, {
  ForwardRefRenderFunction,
  MutableRefObject,
  PropsWithChildren,
  ReactNode,
} from 'react';

import { motion } from 'framer-motion';
export type SnapType = 'top' | 'bottom';

export interface FramerBottomSheetRefHandles {
  /**
   * 포지션을 스냅할 때 사용
   * @param position 'top' or 'bottom'
   */
  snapTo: (position: SnapType) => void;
  /**
   * 시트의 현재 포지션
   * @returns 'top' | 'bottom'
   */
  getPosition: () => string;
  /**
   * content ScrollTop Value
   * @returns number
   */
  getContentScrollTop: () => number | undefined;
  /**
   * set content scrollTop
   * @param scrollValue
   */
  contentScrollTo: (scrollValue: number) => void;
  /**
   * 시트를 구성하는 HTMLDivElement 반환
   */
  getElements: () => {
    containerRef: HTMLDivElement | null;
    headerRef: HTMLDivElement | null;
    scrollRef: HTMLDivElement | null;
    contentRef: HTMLDivElement | null;
    footerRef: HTMLDivElement | null;
  };
}
export type FramerBottomSheetRef = FramerBottomSheetRefHandles;
export type FramerBottomSheetProps = React.ComponentPropsWithoutRef<
  typeof motion.div
> &
  PropsWithChildren & {
    /**
     * 렌더링 시 초기 위치
     * @default ['bottom']
     * ```jsx
     * <FramerBottomSheet3 initialPostion={'top'}>
     * ```
     */
    initialPosition: SnapType;
    /**
     * 열리게 할 드래그 속도 일반적으로 positive number
     * @default [30]
     */
    openVelocity?: number;
    /**
     * 닫히게 할 드래그 속도 일반적으로 negative number
     * @default [-30]
     */
    closeVelocity?: number;
    /**
     * 바텀시트가 열린 후 실행될 콜백 함수
     * ```jsx
     * <FramerBottomSheet3 onOpenEnd={()=>{setState(true)}}>
     * ```
     */
    onOpenEnd?: (event?: MouseEvent | TouchEvent | PointerEvent) => void;
    /**
     * 바텀시트가 닫힌 후 실행될 콜백 함수
     * ```jsx
     * <FramerBottomSheet3 onCloseEnd={()=>{setState(true)}}>
     * ```
     */
    onCloseEnd?: (event?: MouseEvent | TouchEvent | PointerEvent) => void;
    /**
     * 마운트 될 때 실행될 함수
     */
    onMount?: () => void;
    /**
     * 언마운트 될 때 실행될 함수
     */
    onUnmount?: (scrollTop: number) => void;
    /**
     * header component
     */
    headerElement?: ReactNode;
    /**
     * footer component
     */
    footerElement?: ReactNode;
    /**
     * top, bottom snapPoint
     */
    snapPoint: { top: { height: number }; bottom: { height: number } };
    /**
     * 포지션이 bottom일 때 content scrollLock 여부
     * @default [false]
     */
    bottomScrollLock?: boolean;
    style?: React.CSSProperties;
    /**
     * createPortal Container
     * @default document.body
     */
    portalContainer?: Element | DocumentFragment | null;
  };
export interface UsePreventScrollProps {
  scrollRef: MutableRefObject<HTMLElement | null>;
  footerRef: MutableRefObject<HTMLElement | null>;
  position: MutableRefObject<SnapType>;
  bottomScrollLock: boolean;
  portalContainer?: Element | DocumentFragment | null;
}
export type FramerBottomSheetType = ForwardRefRenderFunction<
  FramerBottomSheetRefHandles,
  FramerBottomSheetProps
>;
