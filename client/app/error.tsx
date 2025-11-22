"use client";

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()} style={{
        padding: '10px 20px',
        marginTop: '10px',
        cursor: 'pointer'
      }}>Try again</button>
    </div>
  );
};

export default Error;
