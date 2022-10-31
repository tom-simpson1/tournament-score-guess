import ClipLoader from "react-spinners/ClipLoader";
import { APP_BACKGROUND } from "../utils/colours";

const LoadingSpinner = (props) => {
  let { height, circleColour } = props;
  const defaultHeight = 100;
  const defaultCircleColour = APP_BACKGROUND;

  height = height ?? defaultHeight;

  return (
    <ClipLoader
      loading
      aria-label="Loading Spinner"
      size={height + 10}
      color={circleColour ?? defaultCircleColour}
    >
      <img src="/logo192.png" alt="World Cup" height={height} />
    </ClipLoader>
  );
};

export default LoadingSpinner;
