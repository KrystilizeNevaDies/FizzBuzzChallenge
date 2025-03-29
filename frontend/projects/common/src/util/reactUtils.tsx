import React from 'react';

/**
 * Creates wrapper divs for each element, so that react can safely handle keyed state
 */
// eslint-disable-next-line import/prefer-default-export
export function makeKeys<T extends React.JSX.Element>(arr: T[]) {
  return (
    <>
      {arr.map((element, i) => (
        <div key={i}>
          {element}
        </div>
      ))}
    </>
  );
}
