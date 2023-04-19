import styled from "styled-components";

export const LoadingSpinner = styled.div`
	display: inline-block;
	height: 1.1rem;
	width: 1.1rem;
	margin-left: 10px;
	border: 2px solid #7d5cd1;
	border-right-color: transparent;
	border-radius: 9999px;
	align-self: center;
	animation: spin 1.5s linear infinite;

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
`;

export const SpinnerText = styled.span`
	position: absolute;
	margin: -1px;
	height: 1px;
	width: 1px;
	overflow: hidden;
	white-space: nowrap;
	border: 0;
	padding: 0;
	clip: rect(0 0 0 0);
`;
