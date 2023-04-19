chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	console.log("The background has received a message", message);
	switch (message.type) {
		case "SUMMARISE":
			fetch("http://localhost:8080/summary", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message: message.data,
				}),
			})
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					console.log(data);
					sendResponse(data.summary);
				})
				.catch((error) => {
					console.error("Fetch error:", error);
				});
			return true;
		case "summary":
			break;
	}
});
