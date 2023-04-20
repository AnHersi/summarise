import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Popup, { SummaryContext } from "../components/Popup";
import "@testing-library/jest-dom";
import axios from "axios";

jest.mock("axios");

const mockChrome = {
	storage: {
		sync: {
			get: jest.fn(),
		},
	},
	runtime: {
		sendMessage: jest.fn(),
	},
};

(global as any).chrome = mockChrome;

describe("Popup component", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should render the logo and title", () => {
		render(<Popup />);
		const logo = screen.getByRole("img");
		const title = screen.getByText("Summarise");
		expect(logo).toBeInTheDocument();
		expect(title).toBeInTheDocument();
	});

	it("should toggle the enabled state on clicking the checkbox", () => {
		render(<Popup />);
		const checkbox = screen.getByRole("checkbox");
		expect(checkbox).toBeChecked();
		fireEvent.click(checkbox);
		expect(checkbox).not.toBeChecked();
	});

	it("should call the server API and update the context with summaries", async () => {
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
		const getMock = jest.fn().mockResolvedValueOnce({ data: summaries });
		const setSummaries = jest.fn();
		axios.get = getMock;
		render(
			<SummaryContext.Provider value={{ summaries: [], setSummaries }}>
				<Popup />
			</SummaryContext.Provider>
		);
		await act(async () => {
			expect(getMock).toHaveBeenCalledWith("http://localhost:8080/summary/all");
		});
	});
});
