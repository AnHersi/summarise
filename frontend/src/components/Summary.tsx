import { ReactNode, FC } from "react";

type SummaryProps = {
	children: ReactNode;
	id: string;
};

const Summary: FC<SummaryProps> = ({ children, id }) => {
	return (
		<div className="shadow-[0px_0px_10px_rgba(0,0,0,0.13)] mb-5 px-2 py-2 text-left rounded-md">
			<div className="flex justify-end items-center mb-2">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M5 22q-.825 0-1.413-.588T3 20V7q0-.425.288-.713T4 6q.425 0 .713.288T5 7v13h10q.425 0 .713.288T16 21q0 .425-.288.713T15 22H5Zm4-4q-.825 0-1.413-.588T7 16V4q0-.825.588-1.413T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.588 1.413T18 18H9Zm0-2h9V4H9v12Zm0 0V4v12Z"
					/>
				</svg>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
					<g fill="none" stroke="currentColor" stroke-width="1.5">
						<path
							stroke-linecap="round"
							d="M20.5 6h-17m15.333 2.5l-.46 6.9c-.177 2.654-.265 3.981-1.13 4.79c-.865.81-2.196.81-4.856.81h-.774c-2.66 0-3.991 0-4.856-.81c-.865-.809-.954-2.136-1.13-4.79l-.46-6.9M9.5 11l.5 5m4.5-5l-.5 5"
						/>
						<path d="M6.5 6h.11a2 2 0 0 0 1.83-1.32l.034-.103l.097-.291c.083-.249.125-.373.18-.479a1.5 1.5 0 0 1 1.094-.788C9.962 3 10.093 3 10.355 3h3.29c.262 0 .393 0 .51.019a1.5 1.5 0 0 1 1.094.788c.055.106.097.23.18.479l.097.291A2 2 0 0 0 17.5 6" />
					</g>
				</svg>
			</div>
			<div>{children}</div>
		</div>
	);
};

export default Summary;
