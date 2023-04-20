// Import required modules
import Tooltip from "./src/components/Tooltip";
import { createRoot } from "react-dom/client";
import { Summary } from "./src/types";

// Initialise the container div
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

// Initialise the highlight span
const initialiseHighlightSpan = (): HTMLSpanElement => {
	const span = document.createElement("span");
	Object.assign(span.style, {
		color: "white",
		backgroundColor: "#7d5cd1",
	});
	return span;
};

// Send a message to the service worker to add a new summary
const addSummary = (text: string): Promise<string> => {
	try {
		const response = new Promise<string>((resolve) =>
			chrome.runtime.sendMessage({ type: "ADD_SUMMARY", data: text }, resolve)
		);
		return response;
	} catch (error) {
		console.error("Error sending message to service worker", error);
		throw new Error();
	}
};

// Get all summaries from the service worker
const getAllSummaries = (): Promise<Summary[]> => {
	try {
		const response = new Promise<Summary[]>((resolve) =>
			chrome.runtime.sendMessage({ type: "GET_SUMMARIES" }, resolve)
		);
		return response;
	} catch (error) {
		console.error("Error sending message to service worker", error);
		throw new Error();
	}
};

// Handle highlight click event
const handleHighlightClick = async (
	event: MouseEvent,
	span: HTMLSpanElement,
	rect: DOMRect
): Promise<void> => {
	container.style.top = `${event.pageY - span.offsetHeight - 40}px`;
	container.style.left = `${rect.left}px`;
	root.render(<Tooltip text={""} />);
	toggleTooltip();
	const response = await getAllSummaries();
	const summary = response.find((summary: Summary) => summary.highlight === span.innerText);
	if (summary) {
		root.render(<Tooltip text={summary.data} />);
	}
};

// Handle page loading
const handlePageLoad = async (): Promise<void> => {
	chrome.storage.sync.set({ reload: false });

	attachMouseupListener(container);
	attachMousedownListener();

	const allSummaries = await getAllSummaries();

	allSummaries.forEach((summary) => {
		const highlightText = summary.highlight.trim();
		if (highlightText.length > 0) {
			const regex = new RegExp(highlightText, "gi");

			const textNodes: Text[] = [];
			const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);

			// Find all text nodes containing the highlight text
			while (walker.nextNode()) {
				const node = walker.currentNode as Text;
				if (node.wholeText.trim().includes(highlightText)) {
					textNodes.push(node);
				}
			}

			// Wrap the highlight text inside a span element
			textNodes.forEach((node) => {
				const wrapper = document.createElement("span");
				wrapper.innerHTML = node.wholeText.replace(
					regex,
					`<span class="highlight" style="background-color: #7d5cd1; color: white">${highlightText}</span>`
				);
				if (node.parentElement) {
					node.parentElement.replaceChild(wrapper, node);
				}
			});

			// Attach mouseup event listener to each highlight span
			const highlightSpans: NodeListOf<HTMLSpanElement> = document.querySelectorAll(".highlight");
			highlightSpans.forEach((span: HTMLSpanElement) => {
				span.addEventListener("mouseup", (event: MouseEvent) => {
					handleHighlightClick(event, span, span.getBoundingClientRect());
				});
			});
		}
	});
};

// Toggle the tooltip
const toggleTooltip = (): void => {
	const tooltip = document.getElementById("tooltip");
	tooltip?.style.display === "none"
		? tooltip?.style.setProperty("display", "block")
		: tooltip?.style.setProperty("display", "none");
};

// Attach mouseup event listener
const attachMouseupListener = (container: HTMLDivElement): void => {
	let currentSummary = "";
	document.addEventListener("mouseup", async (event) => {
		const selectedText = window.getSelection()?.toString();

		// Configure the toolip for the selected text
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

			root.render(<Tooltip text={""} />);
			window.getSelection()?.empty();

			const response = await addSummary(selectedText);
			currentSummary = response;
			root.render(<Tooltip text={currentSummary} />);
		}
	});
};

// Attach mouseup event listener
const attachMousedownListener = (): void => {
	// Hide the tooltip when the mouse is clicked
	document.addEventListener("mousedown", () => {
		const tooltip = document.getElementById("tooltip");
		tooltip?.style.setProperty("display", "none");
	});
};

// Attach span event listener
const attachSpanEventListener = (span: HTMLSpanElement, callback: () => void): void => {
	span.addEventListener("mouseup", callback);
};

// Setup container and root for tooltip
const container = initialiseContainer();
const root = createRoot(container);

// Reload window on storage change
chrome.storage.onChanged.addListener(() => {
	window.location.reload();
});

// Setup page on page load
chrome.storage.sync.get(["disabled"]).then(async (result) => {
	if (!result.disabled) {
		await handlePageLoad();
	}
});
