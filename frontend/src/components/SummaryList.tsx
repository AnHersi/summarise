import { FC, useContext } from "react";
import Summary from "./Summary";
import { SummaryContext } from "./Popup";

const SummaryList: FC = () => {
	const { summaries } = useContext(SummaryContext);

	return (
		<div>
			{summaries.map((summary) => (
				<Summary key={summary._id} id={summary._id}>
					{summary.data}
				</Summary>
			))}
			{!summaries.length && (
				<span className="flex justify-center items-center w-full h-16 text-gray-500 text-lg">
					No summaries found
				</span>
			)}
		</div>
	);
};

export default SummaryList;
