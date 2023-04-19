import Tooltip from "./src/components/Tooltip";
import { createRoot } from "react-dom/client";
import { Summary } from "./src/types";

const initialiseContainer = (): HTMLDivElement => {
	const container = document.createElement("div");
	Object.assign(container.style, {
		minHeight: "150px",
		position: "absolute",
		backgroundColor: "transparent",
		pointerEvents: "none",
	});
	document.body?.appendChild(container);
	return container;
};

const initialiseHighlightSpan = (): HTMLSpanElement => {
	const span = document.createElement("span");
	Object.assign(span.style, {
		color: "white",
		backgroundColor: "#7d5cd1",
	});
	return span;
};

const addSummary = (text: string): Promise<string> => {
	try {
		const response = new Promise<string>((resolve) =>
			chrome.runtime.sendMessage({ type: "ADD_SUMMARY", data: text }, resolve)
		);
		return response;
	} catch (error) {
		console.error("Error sending message to background script", error);
		throw new Error();
	}
};

const getAllSummaries = (): Promise<Summary[]> => {
	try {
		const response = new Promise<Summary[]>((resolve) =>
			chrome.runtime.sendMessage({ type: "GET_SUMMARIES" }, resolve)
		);
		return response;
	} catch (error) {
		console.error("Error sending message to background script", error);
		throw new Error();
	}
};

const handleHighlightClick = async (
	event: MouseEvent,
	span: HTMLSpanElement,
	rect: DOMRect
): Promise<void> => {
	root.render(<Tooltip text={""} />);
	toggleTooltip();
	const response = await getAllSummaries();
	const summaries = response;
	const summary = summaries.find((summary: any) => summary.highlight === span.innerText);
	console.log(summary);
	if (summary) {
		root.render(<Tooltip text={summary.data} />);
		container.style.top = `${event.pageY - span.offsetHeight - 40}px`;
		container.style.left = `${rect.left}px`;
	}
};

const toggleTooltip = (): void => {
	const tooltip = document.getElementById("tooltip");
	tooltip?.style.display === "none"
		? tooltip?.style.setProperty("display", "block")
		: tooltip?.style.setProperty("display", "none");
};

const attachMouseupListener = (container: HTMLDivElement): void => {
	let currentSummary = "";
	document.addEventListener("mouseup", async (event) => {
		const selectedText = window.getSelection()?.toString();

		if (selectedText && selectedText.length > 1 && !selectedText.includes("\n")) {
			const range = window.getSelection()?.getRangeAt(0);
			const rect = range?.getBoundingClientRect() as DOMRect;

			container.style.top = `${rect.top + window.scrollY - 50}px`;
			container.style.left = `${rect.left}px`;

			const span = initialiseHighlightSpan();
			range?.surroundContents(span);

			attachSpanEventListener(span, async () => {
				handleHighlightClick(event, span, rect);
			});

			const response = await addSummary(selectedText);
			console.log(response);
			currentSummary = response;
			root.render(<Tooltip text={currentSummary} />);
		}
	});
};

const attachMousedownListener = (): void => {
	document.addEventListener("mousedown", () => {
		const tooltip = document.getElementById("tooltip");
		tooltip?.style.setProperty("display", "none");
	});
};

const attachSpanEventListener = (span: HTMLSpanElement, callback: () => void): void => {
	span.addEventListener("mouseup", callback);
};

const container = initialiseContainer();
const root = createRoot(container);

attachMouseupListener(container);
attachMousedownListener();
