import Tooltip from "./src/components/Tooltip";
import { createRoot } from "react-dom/client";

const container = document.createElement("div");
const root = createRoot(container);

Object.assign(container.style, {
	minHeight: "150px",
	position: "absolute",
	backgroundColor: "transparent",
	pointerEvents: "none",
});

document.body?.appendChild(container);

let currentSummary = "";

document.addEventListener("mouseup", async (event) => {
	const selectedText = window.getSelection()?.toString();

	if (selectedText && selectedText.length > 1 && !selectedText.includes("\n")) {
		const range = window.getSelection()?.getRangeAt(0);
		const rect = range?.getBoundingClientRect() as DOMRect;

		container.style.top = `${rect.top + window.scrollY - 50}px`;
		container.style.left = `${rect.left}px`;

		const span = document.createElement("span");
		Object.assign(span.style, {
			color: "white",
			backgroundColor: "#7d5cd1",
		});
		range?.surroundContents(span);

		span.addEventListener("mouseup", function () {
			toggleTooltip();
			root.render(<Tooltip text={currentSummary} />);
			container.style.top = `${event.pageY - span.offsetHeight - 40}px`;
			container.style.left = `${rect.left}px`;
		});

		try {
			const response = await new Promise<string>((resolve) =>
				chrome.runtime.sendMessage({ type: "SUMMARISE", data: selectedText }, resolve)
			);
			console.log(response);
			currentSummary = response;
			root.render(<Tooltip text={currentSummary} />);
		} catch (error) {
			console.error("Error sending message to background script", error);
		}
	}
});

document.addEventListener("mousedown", (event) => {
	const tooltip = document.getElementById("tooltip");
	tooltip?.style.setProperty("display", "none");
});

const toggleTooltip = (): void => {
	const tooltip = document.getElementById("tooltip");
	tooltip?.style.display === "none"
		? tooltip?.style.setProperty("display", "block")
		: tooltip?.style.setProperty("display", "none");
};
