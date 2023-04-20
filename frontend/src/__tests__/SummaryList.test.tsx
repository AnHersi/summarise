import { render } from "@testing-library/react";
import SummaryList from "../components/SummaryList";
import { SummaryContext } from "../components/Popup";
import { Summary } from "../types";
import "@testing-library/jest-dom";

describe("SummaryList component", () => {
	it("renders the list of summaries", () => {
		const summaries = [
			{
				_id: "64417f40aa3b053d92ae18cf",
				highlight: "Selected text 1",
				data: "Summary of selected text 1",
			},
			{
				_id: "64417f40aa3b053d92ae18cf 2",
				highlight: "Selected text",
				data: "Summary of selected text 2",
			},
		];
		const setSummaries = jest.fn();

		const { getByText } = render(
			<SummaryContext.Provider value={{ summaries, setSummaries }}>
				<SummaryList />
			</SummaryContext.Provider>
		);

		expect(getByText("Summary of selected text 1")).toBeInTheDocument();
		expect(getByText("Summary of selected text 1")).toBeInTheDocument();
	});

	it('renders "No summaries found" when there are no summaries', () => {
		const summaries: Summary[] = [];
		const setSummaries = jest.fn();

		const { getByText } = render(
			<SummaryContext.Provider value={{ summaries, setSummaries }}>
				<SummaryList />
			</SummaryContext.Provider>
		);

		expect(getByText("No summaries found")).toBeInTheDocument();
	});
});
