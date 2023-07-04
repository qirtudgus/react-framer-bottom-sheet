import React, {
  ForwardRefRenderFunction,
  MutableRefObject,
  PropsWithChildren,
  ReactNode,
} from 'react';

import { motion } from 'framer-motion';

export type SnapType = 'bottom' | 'top';

export interface FramerBottomSheetRefHandles {
  snapTo: (position: SnapType) => void;
  getPosition: () => string;
}

export type FramerBottomSheetRef = FramerBottomSheetRefHandles;

export type FramerBottomSheetProps = React.ComponentPropsWithoutRef<
  typeof motion.div
> &
  PropsWithChildren & {
    /**
     * 바텀시트 렌더링 시 초기 위치
     * @default ['bottom']
     * ```jsx
     * <FramerBottomSheet3 initialPostion={'top'}>
     * ```
     */
    initialPosition: SnapType;
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
     * bottomSheet Header 렌더링 여부
     * @default [true]
     */
    header?: boolean;
    headerElement?: ReactNode;
    /**
     * bottomSheet Footer 렌더링 여부
     */
    footer?: boolean;
    footerElement?: ReactNode;
    /**
     * bottom일때와 top일때의 스냅포인트
     */
    snapPoint: { top: { height: number }; bottom: { height: number } };
    /**
     * 바텀시트가 내려가있을때 content scrollLock 여부
     * header가 없을 경우 true를 주면 시트가 핸들링됨
     * @default [false]
     */
    bottomScrollLock?: boolean;
    style?: React.CSSProperties;
    /**
     * createPortal Container
     * @default document.body
     */
    portalContainer?: Element | DocumentFragment;
  };

export interface UsePreventScrollProps {
  scrollRef: MutableRefObject<HTMLElement | null>;
  bottomScrollLock: boolean;
  position: string;
  header: boolean;
}

export type FramerBottomSheetType = ForwardRefRenderFunction<
  FramerBottomSheetRefHandles,
  FramerBottomSheetProps
>;
