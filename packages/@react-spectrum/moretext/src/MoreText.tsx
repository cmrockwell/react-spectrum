/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {classNames, useDOMRef, useStyleProps} from '@react-spectrum/utils';
import {DOMProps, DOMRef, StyleProps} from '@react-types/shared';
import {filterDOMProps} from '@react-aria/utils';
import MoreIcon from '@spectrum-icons/ui/More';
import React, {useEffect, useState} from 'react';
import {useProviderProps} from '@react-spectrum/provider';


export interface SpectrumMoreTextProps extends DOMProps, StyleProps {
  onChange?: any
}

function MoreText(props: SpectrumMoreTextProps, ref: DOMRef<HTMLDivElement>) {
  // Grabs specific props from the closest Provider (see https://react-spectrum.adobe.com/react-spectrum/Provider.html#property-groups). Remove if your component doesn't support any of the listed props.
  props = useProviderProps(props);
  // let slotProps = useSlotProps(props, 'moretext');
  // Handles RSP specific style options, UNSAFE_style, and UNSAFE_className props (see https://react-spectrum.adobe.com/react-spectrum/styling.html#style-props)
  let {styleProps} = useStyleProps(props);
  let domRef = useDOMRef(ref);
  let {
    children,
    ...otherProps
  } = props;

  const [wider, setWider] = useState(false);
  useEffect(() => {
    // Update the document title using the browser API
    setWider(domRef.current.scrollWidth > domRef.current.offsetWidth );
    console.log(wider);
  });

  return (
    <>
      <span
        {...filterDOMProps(props)}
        {...styleProps}
        ref={domRef}
        className={styleProps.className}
        style={{whiteSpace: 'nowrap', overflow: 'hidden', paddingRight: '16px', position: 'relative'}}>
        {children}
      </span>
      {wider &&
        <>
          <button style={{position: 'absolute', right: '0px', width: '35px', height: '25px'}}>
            <MoreIcon />
          </button>
        </>
      }
    </>
  );
}

/**
 * TODO: Add description of component here.
 */
const _MoreText = React.forwardRef(MoreText);
export {_MoreText as MoreText};
