import { FC, useState, useEffect } from "react";
import Logo from "../assets/logo.png";
import "./Tooltip";

declare const chrome: {
	runtime: any;
	action: { setBadgeText: (arg0: { text: string }) => void };
	storage: { sync: { get: (arg0: string[]) => Promise<any> } };
};

type Result = {
	highlight: string;
};

const Popup: FC = () => {
	const [enabled, setEnabled] = useState<boolean>(true);
	const [highlightText, setHighlightText] = useState<string>("");

	const handleToggle = (): void => {
		setEnabled(!enabled);
	};

	useEffect(() => {
		chrome.storage.sync.get(["highlight"]).then((result: Result) => {
			setHighlightText(result.highlight);
		});
	}, []);

	return (
		<div className="flex flex-col items-start w-72">
			{/* <h1>Highlighted text: {highlightText}</h1> */}
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
							onClick={handleToggle}
						/>
						<div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-[2px] peer-focus:ring-purple-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7d5cd1]"></div>
					</label>
				</div>
			</div>

			<hr className="w-full h-0.5 mx-auto my-6 bg-gray-200 border-0 rounded md:my-10" />

			<h1 className="text-lg font-medium text-left mb-2 select-none">Summaries</h1>

			<div className="w-full">
				<span className="flex justify-center items-center w-full h-16 text-gray-500 text-lg">
					No summaries found
				</span>
			</div>
		</div>
	);
};

export default Popup;
