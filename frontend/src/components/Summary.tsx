// Import required modules
import { ReactNode, FC, useState, useEffect, useContext } from "react";
import { IconCopy, IconBin, IconTick } from "../assets/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { SummaryContext } from "./Popup";
import axios from "axios";

type SummaryProps = {
	children: ReactNode;
	id: string;
};

const Summary: FC<SummaryProps> = ({ children, id }) => {
	const [copied, setCopied] = useState<boolean>(false);

	const { summaries, setSummaries } = useContext(SummaryContext);

	// Handle deletion of a summary and update chrome storage
	const handleDelete = (id: string): void => {
		axios.delete(`http://localhost:8080/summary/${id}`);
		setSummaries(summaries.filter((summary) => summary._id !== id));
		chrome.storage.sync.set({ reload: true });
	};

	// Handle display of icon when copied
	useEffect(() => {
		setTimeout(() => {
			setCopied(false);
		}, 5000);
	}, [copied]);

	return (
		<div className="shadow-[0px_0px_10px_rgba(0,0,0,0.13)] mb-5 px-2 py-2 text-left rounded-md">
			<div className="flex justify-end items-center mb-3">
				<CopyToClipboard text={String(children)} onCopy={() => setCopied(true)}>
					{!copied ? (
						<IconCopy aria-label="copy" className="cursor-pointer w-5 h-5" />
					) : (
						<IconTick aria-label="tick" className="cursor-pointer w-5 h-5" />
					)}
				</CopyToClipboard>

				<IconBin
					aria-label="delete"
					className="cursor-pointer w-5 h-5 mx-2"
					onClick={() => handleDelete(id)}
				/>
			</div>

			<div className="flex ">
				<div className="w-[15px] min-h-full mx-3 rounded bg-[#a074ff]">&nbsp;</div>
				{children}
			</div>
		</div>
	);
};

export default Summary;
