import ClipLoader from "react-spinners/ClipLoader";

const LoadingSpinner = () => {
  return (
    <ClipLoader loading aria-label="Loading Spinner" size={110} color="#f5f2f2">
      <img src="/logo192.png" alt="World Cup" height={100} />
    </ClipLoader>
  );
};

export default LoadingSpinner;
