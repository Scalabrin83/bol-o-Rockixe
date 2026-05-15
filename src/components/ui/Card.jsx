import React from 'react';

export function Card({ children, className = '', gold = false, flush = false, style = {}, ...props }) {
  const classes = ['card', gold && 'card--gold', flush && 'card--flush', className].filter(Boolean).join(' ');
  return <div className={classes} style={style} {...props}>{children}</div>;
}
