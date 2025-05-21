import React from 'react'

import styles from './TimelineItem.css'

interface ITimelineItem {
  date: string
  children: any
}

function TimelineItem({ date, children }: ITimelineItem) {
  return (
    <li className={styles['timeline-item']}>
      <div className={styles['timeline-item__date']}>{date}</div>
      <div className={styles['timeline-item__separator']}>
        <span className={styles['timeline-item__bullet']}></span>
        <span className={styles['timeline-item__tail']}></span>
      </div>
      <div className={styles['timeline-item__content']}>
        {children}
      </div>
    </li>
  )
}

export default TimelineItem
