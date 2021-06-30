import { FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "src/components/Button";
import { useAuthentication } from "src/contexts/Authentication";
import { database } from "src/services/firebase";

import GoogleIconImage from "../../assets/images/google-icon.svg";
import IllustrationImage from "../../assets/images/illustration.svg";
import LogoImage from "../../assets/images/logo.svg";
import styles from "./Home.module.scss";

export function Home(): JSX.Element {
	const [roomCode, setRoomCode] = useState("");
	const { authenticate, isAuthenticated } = useAuthentication();
	const history = useHistory();

	async function handleCreateNewRoom(): Promise<void> {
		if (!isAuthenticated) {
			await authenticate();
		}

		history.push("/rooms/new");
	}

	async function handleJoinRoom(event: FormEvent): Promise<void> {
		event.preventDefault();

		if (!isAuthenticated) {
			await authenticate();
		}

		if (roomCode.trim() === "") {
			return;
		}

		const roomsRef = await database.ref(`rooms/${roomCode}`).get();

		if (!roomsRef.exists()) {
			alert("Room does not exists.");
			return;
		}

		history.push(`/rooms/${roomCode}`);
	}

	return (
		<div className={styles.page}>
			<aside>
				<img src={IllustrationImage} alt="Ilustração" />
				<strong>Crie salas de Q&amp;A ao-vivo</strong>
				<p>Tire as dúvidas da sua audiência em tempo real.</p>
			</aside>
			<main>
				<div className={styles.content}>
					<img src={LogoImage} alt="letmeask" />
					<button className={styles.newRoom} onClick={handleCreateNewRoom}>
						<img src={GoogleIconImage} alt="Logo do Google" />
						Crie sua sala com o Google
					</button>
					<div className={styles.separator}>ou entre em uma sala</div>
					<form onSubmit={handleJoinRoom}>
						<input
							onChange={(event) => setRoomCode(event.target.value)}
							placeholder="Digite o código da sala"
							type="text"
							value={roomCode}
						/>
						<Button type="submit">Entrar na sala</Button>
					</form>
				</div>
			</main>
		</div>
	);
}
