import type { FC } from "react";
import {
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from "react-native";

import { cardVariants, descriptionVariants, labelVariants } from "./Card";

export interface TouchableCardProps extends TouchableOpacityProps {
  label: string;
  description: string;
  selected: boolean;
  testID?: string;
}

export const TouchableCard: FC<TouchableCardProps> = ({
  label,
  description,
  selected,
  className,
  testID,
  ...props
}) => {
  return (
    <TouchableOpacity
      className={cardVariants({ selected, className })}
      testID={testID}
      {...props}
    >
      <Text className={labelVariants({ selected })}>{label}</Text>
      <Text className={descriptionVariants({ selected })}>{description}</Text>
    </TouchableOpacity>
  );
};
