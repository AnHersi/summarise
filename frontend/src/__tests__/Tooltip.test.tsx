import React from "react";
import { render } from "@testing-library/react";
import Tooltip from "../components/Tooltip";
import "@testing-library/jest-dom";

describe("Tooltip", () => {
	it("should show loading spinner when text prop is empty", () => {
		const { getByText } = render(<Tooltip text="" />);
		expect(getByText("Getting summary")).toBeInTheDocument();
		expect(getByText("Loading...")).toBeInTheDocument();
	});

	it("should show text when text prop is not empty", () => {
		const { getByText } = render(<Tooltip text="Summary text" />);
		expect(getByText("Summary text")).toBeInTheDocument();
	});
});
