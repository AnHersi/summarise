// Import required modules
import { FC, useState, useEffect, createContext, SetStateAction, Dispatch } from "react";
import Logo from "../assets/logo.png";
import SummaryList from "./SummaryList";
import { Summary } from "../types";
import axios from "axios";
import "./Tooltip";

interface SummaryContextType {
	summaries: Summary[];
	setSummaries: Dispatch<SetStateAction<Summary[]>>;
}

// Setup summary context
export const SummaryContext = createContext<SummaryContextType>({
	summaries: [],
	setSummaries: () => {},
});

const Popup: FC = () => {
	const [enabled, setEnabled] = useState<boolean>(true);
	const [summaries, setSummaries] = useState<Summary[]>([]);

	// Make request to server to get all summaries
	const getSummaries = (): void => {
		axios.get("http://localhost:8080/summary/all").then((res) => {
			setSummaries(res.data);
		});
	};

	// Handle toggling of extension
	const handleToggle = (): void => {
		chrome.runtime.sendMessage({
			type: enabled ? "DISABLE" : "ENABLE",
		});
		setEnabled(!enabled);
	};

	// Get summaries and store enabled state
	useEffect((): void => {
		getSummaries();
		chrome.storage.sync.get(["disabled"], (result) => {
			result.disabled ? setEnabled(false) : setEnabled(true);
		});
	}, []);

	return (
		<SummaryContext.Provider value={{ summaries, setSummaries }}>
			<div className="flex flex-col items-start w-80">
				<div className="flex justify-between items-center w-full mb-4">
					<div className="flex justify-between items-center">
						<img src={Logo} className="w-9 h-9 mr-4" />
						<span className="font-bold text-xl mr-16">Summarise</span>
					</div>

					<div>
						<label className="relative inline-flex items-center mr-5 cursor-pointer translate-y-1">
							<input
								type="checkbox"
								value=""
								className="sr-only peer"
								checked={enabled}
								onChange={() => handleToggle()}
							/>
							<div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-[2px] peer-focus:ring-purple-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7d5cd1]"></div>
						</label>
					</div>
				</div>

				<hr className="w-full h-0.5 mx-auto my-6 bg-gray-200 border-0 rounded md:my-10" />

				<h1 className="text-lg font-medium text-left mb-2 select-none">Summaries</h1>

				<div className="w-full">
					<SummaryList />
				</div>
			</div>
		</SummaryContext.Provider>
	);
};

export default Popup;
