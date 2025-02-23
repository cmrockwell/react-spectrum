/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {AriaCalendarCellProps, useCalendarCell} from '@react-aria/calendar';
import {CalendarDate, getDayOfWeek, isSameDay, isSameMonth, isToday} from '@internationalized/date';
import {CalendarState, RangeCalendarState} from '@react-stately/calendar';
import {classNames} from '@react-spectrum/utils';
import {mergeProps} from '@react-aria/utils';
import React, {useRef} from 'react';
import styles from '@adobe/spectrum-css-temp/components/calendar/vars.css';
import {useFocusRing} from '@react-aria/focus';
import {useHover} from '@react-aria/interactions';
import {useLocale} from '@react-aria/i18n';

interface CalendarCellProps extends AriaCalendarCellProps {
  state: CalendarState | RangeCalendarState,
  currentMonth: CalendarDate
}

export function CalendarCell({state, currentMonth, ...props}: CalendarCellProps) {
  let ref = useRef<HTMLElement>();
  let {
    cellProps,
    buttonProps,
    isPressed,
    isSelected,
    isDisabled,
    isFocused,
    formattedDate
  } = useCalendarCell({
    ...props,
    isDisabled: !isSameMonth(props.date, currentMonth)
  }, state, ref);
  let isUnavailable = state.isCellUnavailable(props.date) && !isDisabled;
  let isLastSelectedBeforeDisabled = !isDisabled && state.isCellUnavailable(props.date.add({days: 1}));
  let isFirstSelectedAfterDisabled = !isDisabled && state.isCellUnavailable(props.date.subtract({days: 1}));
  let highlightedRange = 'highlightedRange' in state && state.highlightedRange;
  let isSelectionStart = isSelected && highlightedRange && isSameDay(props.date, highlightedRange.start);
  let isSelectionEnd = isSelected && highlightedRange && isSameDay(props.date, highlightedRange.end);
  let {locale} = useLocale();
  let dayOfWeek = getDayOfWeek(props.date, locale);
  let isRangeStart = isSelected && (isFirstSelectedAfterDisabled || dayOfWeek === 0 || props.date.day === 1);
  let isRangeEnd = isSelected && (isLastSelectedBeforeDisabled || dayOfWeek === 6 || props.date.day === currentMonth.calendar.getDaysInMonth(currentMonth));
  let {focusProps, isFocusVisible} = useFocusRing();
  let {hoverProps, isHovered} = useHover({isDisabled: isDisabled || isUnavailable});

  return (
    <td
      {...cellProps}
      className={classNames(styles, 'spectrum-Calendar-tableCell')}>
      <span
        {...mergeProps(buttonProps, hoverProps, focusProps)}
        ref={ref}
        className={classNames(styles, 'spectrum-Calendar-date', {
          'is-today': isToday(props.date, state.timeZone),
          'is-selected': isSelected,
          'is-focused': isFocused && isFocusVisible,
          'is-disabled': isDisabled,
          'is-unavailable': isUnavailable,
          'is-outsideMonth': !isSameMonth(props.date, currentMonth),
          'is-range-start': isRangeStart,
          'is-range-end': isRangeEnd,
          'is-range-selection': isSelected && 'highlightedRange' in state,
          'is-selection-start': isSelectionStart,
          'is-selection-end': isSelectionEnd,
          'is-hovered': isHovered,
          'is-pressed': isPressed
        })}>
        <span className={classNames(styles, 'spectrum-Calendar-dateText')}>
          <span>{formattedDate}</span>
        </span>
      </span>
    </td>
  );
}
