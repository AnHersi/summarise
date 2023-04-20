// Import required modules
import { FC } from "react";
import { LoadingSpinner, SpinnerText } from "./styles/Spinner";
import { TooltipWrapper } from "./styles/TooltipWrapper";

type TooltipProps = {
	text: string;
};

const Tooltip: FC<TooltipProps> = ({ text }) => {
	return (
		<TooltipWrapper id="tooltip">
			{!text && (
				<div>
					<span>Getting summary</span>
					<LoadingSpinner role="status">
						<SpinnerText>Loading...</SpinnerText>
					</LoadingSpinner>
				</div>
			)}

			{text}
		</TooltipWrapper>
	);
};

export default Tooltip;
