import { FormEvent, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button } from "src/components/Button";
import { useAuthentication } from "src/contexts/Authentication";
import { database } from "src/services/firebase";

import IllustrationImage from "../../assets/images/illustration.svg";
import LogoImage from "../../assets/images/logo.svg";
import styles from "./NewRoom.module.scss";

export function NewRoom(): JSX.Element {
	const { user } = useAuthentication();
	const [roomName, setRoomName] = useState("");
	const history = useHistory();

	async function handleCreateRoom(
		event: FormEvent<HTMLFormElement>
	): Promise<void> {
		event.preventDefault();

		if (roomName.trim() === "") {
			return;
		}

		const roomsRef = database.ref("rooms");

		const firebaseRoom = await roomsRef.push({
			title: roomName,
			authorId: user?.uid
		});

		history.push(`/rooms/${firebaseRoom.key}`);
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
					<h2>Criar uma nova sala</h2>
					<form onSubmit={handleCreateRoom}>
						<input
							onChange={(event) => setRoomName(event.target.value)}
							placeholder="Nome da sala"
							type="text"
							value={roomName}
						/>
						<Button type="submit">Criar sala</Button>
					</form>
					<p>
						Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
					</p>
				</div>
			</main>
		</div>
	);
}
