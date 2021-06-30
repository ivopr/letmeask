import copyImage from "../../assets/images/copy.svg";
import styles from "./RoomCode.module.scss";

interface RoomCodeProps {
	code: string;
}

export function RoomCode({ code }: RoomCodeProps): JSX.Element {
	function copyRoomCodeToClipboard(): void {
		navigator.clipboard.writeText(code);
	}

	return (
		<button className={styles.component} onClick={copyRoomCodeToClipboard}>
			<div>
				<img src={copyImage} alt="Copy room code" />
			</div>
			<span>Sala #{code}</span>
		</button>
	);
}
