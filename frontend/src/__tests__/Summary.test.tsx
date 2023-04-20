import { render, screen, fireEvent, getByLabelText } from "@testing-library/react";
import Summary from "../components/Summary";
import "@testing-library/jest-dom";

describe("Summary", () => {
	const summaries = [
		{
			_id: "64417f40aa3b053d92ae18cf 1",
			highlight: "Selected text 1",
			data: "Summary of selected text 1",
		},
		{
			_id: "64417f40aa3b053d92ae18cf 2",
			highlight: "Selected text 2",
			data: "Summary of selected text 2",
		},
	];

	const mockChrome = {
		storage: {
			sync: {
				set: jest.fn(),
			},
		},
		runtime: {
			sendMessage: jest.fn(),
		},
	};

	(global as any).chrome = mockChrome;

	const setSummaries = jest.fn();

	beforeEach(() => {
		render(<Summary id={summaries[0]._id}>{summaries[0].data}</Summary>);
	});

	test("renders summary text", () => {
		const summaryText = screen.getByText(summaries[0].data);
		expect(summaryText).toBeInTheDocument();
	});

	test("renders copy button", () => {
		const copyButton = screen.getByLabelText("copy");
		expect(copyButton).toBeInTheDocument();
	});

	test("renders delete button", () => {
		const deleteButton = screen.getByLabelText("delete");
		expect(deleteButton).toBeInTheDocument();
	});

	test("clicking delete button removes summary", () => {
		const deleteButton = screen.getByLabelText("delete");
		fireEvent.click(deleteButton);
		expect(chrome.storage.sync.set).toHaveBeenCalled();
	});
});
