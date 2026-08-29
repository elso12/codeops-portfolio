import { useState } from 'react';

function OrderCounter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount((prev) => prev + 1)}>
        Click me
      </button>
    </div>
  );
}

export default OrderCounter;