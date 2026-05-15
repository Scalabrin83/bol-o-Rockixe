import React from 'react';

export function Button({ children, variant = 'primary', size = '', className = '', style = {}, ...props }) {
  const classes = ['btn', `btn--${variant}`, size && `btn--${size}`, className].filter(Boolean).join(' ');
  return <button className={classes} style={style} {...props}>{children}</button>;
}
