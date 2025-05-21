import React from 'react'
import classNames from 'classnames/bind'

import styles from './Timeline.css'

const cx = classNames.bind(styles)

interface ITimeline {
  children: any
  position?: 'alternate' | 'normal'
}

function Timeline({ children, position = 'normal' }: ITimeline) {
  const className = cx(
    'timeline',
    {
      'timeline--alternate': position === 'alternate'
    }
  )

  return (
    <ul className={className}>
      {children}
    </ul>
  )
}

export default Timeline
