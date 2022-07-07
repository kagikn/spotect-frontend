import Progress, {ProgressPropType} from './Progress';

type AudioFeaturePercentagePropType = {
  caption?: string;
} & ProgressPropType;

const AudioFeaturePercentage = (
  props: AudioFeaturePercentagePropType
): JSX.Element => {
  const {value, height, color, backgroundColor, caption} = props;

  return (
    <div className="py-5">
      {caption ? (
        <p className="my-3">{`${caption}: ${value.toFixed(2)}`}</p>
      ) : null}
      <Progress
        value={value}
        height={height}
        color={color}
        backgroundColor={backgroundColor}
        borderRadius="1.5rem"
      />
    </div>
  );
};

export default AudioFeaturePercentage;
export {AudioFeaturePercentagePropType};
