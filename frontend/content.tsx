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
	container.style.top = `${event.pageY - span.offsetHeight - 40}px`;
	container.style.left = `${rect.left}px`;
	root.render(<Tooltip text={""} />);
	toggleTooltip();
	const response = await getAllSummaries();
	const summary = response.find((summary: Summary) => summary.highlight === span.innerText);
	if (summary) {
		console.log(summary);
		root.render(<Tooltip text={summary.data} />);
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

			root.render(<Tooltip text={""} />);
			window.getSelection()?.empty();

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

chrome.storage.onChanged.addListener(() => {
	window.location.reload();
});

chrome.storage.sync.get(["disabled"]).then(async (result) => {
	if (!result.disabled) {
		console.log(result.disabled);
		attachMouseupListener(container);
		attachMousedownListener();

		const allSummaries = await getAllSummaries();

		allSummaries.forEach((summary) => {
			const highlightText = summary.highlight.trim();
			if (highlightText.length > 0) {
				const regex = new RegExp(highlightText, "gi");

				const textNodes: Text[] = [];
				const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
				while (walker.nextNode()) {
					const node = walker.currentNode as Text;
					if (node.wholeText.trim().includes(highlightText)) {
						textNodes.push(node);
					}
				}

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

				const highlightSpans: NodeListOf<HTMLSpanElement> = document.querySelectorAll(".highlight");
				highlightSpans.forEach((span: HTMLSpanElement) => {
					span.addEventListener("mouseup", (event: MouseEvent) => {
						handleHighlightClick(event, span, span.getBoundingClientRect());
					});
				});
			}
		});
	}
});
