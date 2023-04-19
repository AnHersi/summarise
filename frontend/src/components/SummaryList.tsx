import { FC } from "react";
import { Summary as SummaryType } from "../types";
import Summary from "./Summary";

type SummaryListProps = {
	summaries: SummaryType[];
};

const SummaryList: FC<SummaryListProps> = ({ summaries }) => {
	return (
		<div>
			{summaries.map((summary) => (
				<Summary key={summary.id} id={summary.id}>
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
