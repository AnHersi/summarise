// Add listener for incoming messages
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	switch (message.type) {
		case "ADD_SUMMARY":
			createSummary(message.data, sendResponse);
			return true;
		case "GET_SUMMARIES":
			getAllSummaries(sendResponse);
			return true;
		case "DISABLE":
			chrome.action.setBadgeBackgroundColor({ color: [119, 119, 119, 255] });
			chrome.action.setBadgeText({ text: "Off" });
			chrome.storage.sync.set({ disabled: true });
			return true;
		case "ENABLE":
			chrome.action.setBadgeText({ text: "" });
			chrome.storage.sync.set({ disabled: false });
			return true;
	}
});

// Make a request to the server to create a summary
const createSummary = (message: string, sendResponse: (data: any) => void) => {
	return fetch("http://localhost:8080/summary", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			message,
		}),
	})
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			sendResponse(data.summary);
		})
		.catch((error) => {
			console.error("Fetch error:", error);
		});
};

// Make a request to the server to get all summaries
const getAllSummaries = (sendResponse: (data: any) => void) => {
	return fetch("http://localhost:8080/summary/all", {
		method: "GET",
	})
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			sendResponse(data);
		})
		.catch((error) => {
			console.error("Fetch error:", error);
		});
};
