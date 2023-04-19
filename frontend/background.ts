chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	console.log("The background has received a message", message);
	switch (message.type) {
		case "ADD_SUMMARY":
			createSummary(message.data, sendResponse);
			return true;
		case "GET_SUMMARIES":
			getAllSummaries(sendResponse);
			return true;
	}
});

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
			// console.log(data);
			sendResponse(data.summary);
		})
		.catch((error) => {
			console.error("Fetch error:", error);
		});
};

const getAllSummaries = (sendResponse: (data: any) => void) => {
	return fetch("http://localhost:8080/summary/all", {
		method: "GET",
	})
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			// console.log(data);
			sendResponse(data);
		})
		.catch((error) => {
			console.error("Fetch error:", error);
		});
};
