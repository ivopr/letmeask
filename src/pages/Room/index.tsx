import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthentication } from "src/contexts/Authentication";
import { database } from "src/services/firebase";

import logoImage from "../../assets/images/logo.svg";
import { Button } from "../../components/Button";
import { RoomCode } from "../../components/RoomCode";
import styles from "./Room.module.scss";

interface RoomParams {
	id: string;
}

interface FirebaseQuestions {
	[key: string]: {
		content: string;
		author: {
			uid: string;
			name: string;
			avatar: string;
		};
		isAnswered: boolean;
		isHighlighted: boolean;
	};
}

interface Question {
	id: string;
	content: string;
	author: {
		uid: string;
		name: string;
		avatar: string;
	};
	isAnswered: boolean;
	isHighlighted: boolean;
}

export function Room(): JSX.Element {
	const [newQuestion, setNewQuestion] = useState("");
	const [questions, setQuestions] = useState([] as Question[]);
	const [title, setTitle] = useState("");
	const { id } = useParams<RoomParams>();
	const { authenticate, isAuthenticated, user } = useAuthentication();

	useEffect(() => {
		const roomRef = database.ref(`rooms/${id}`);

		roomRef.once("value", (room) => {
			const roomSnapshot = room.val();
			const firebaseQuestions: FirebaseQuestions = roomSnapshot.questions ?? {};
			const parsedQuestions = Object.entries(firebaseQuestions).map(
				([key, question]) => ({
					id: key,
					content: question.content,
					author: question.author,
					isHighlighted: question.isHighlighted,
					isAnswered: question.isAnswered
				})
			);

			setTitle(roomSnapshot.title);
			setQuestions(parsedQuestions);
		});

		const questionsRef = database.ref(`rooms/${id}/questions`);

		questionsRef.on("value", (questions) => {
			const questionsSnapshot = questions.val();
			const firebaseQuestions: FirebaseQuestions = questionsSnapshot ?? {};
			const parsedQuestions = Object.entries(firebaseQuestions).map(
				([key, question]) => ({
					id: key,
					content: question.content,
					author: question.author,
					isHighlighted: question.isHighlighted,
					isAnswered: question.isAnswered
				})
			);

			setQuestions(parsedQuestions);
		});
	}, [id]);

	async function handleSendQuestion(
		event: FormEvent<HTMLFormElement>
	): Promise<void> {
		event.preventDefault();

		if (newQuestion.trim() === "") {
			return;
		}

		if (!isAuthenticated) {
			await authenticate();
		}

		const question = {
			content: newQuestion,
			author: {
				avatar: user.photoURL,
				name: user.displayName,
				uid: user.uid
			},
			isHighlighted: false,
			isAnswered: false
		};

		await database
			.ref(`rooms/${id}/questions`)
			.push(question)
			.then(() => setNewQuestion(""));
	}

	return (
		<div className={styles.page}>
			<header>
				<div className={styles.content}>
					<img src={logoImage} alt="letmeask" />
					<RoomCode code={id} />
				</div>
			</header>
			<main className={styles.mainContent}>
				<div className={styles.roomTitle}>
					<h1>Sala {title}</h1>
					{questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
				</div>

				<form onSubmit={handleSendQuestion}>
					<textarea
						onChange={(event) => setNewQuestion(event.target.value)}
						placeholder="O que você quer perguntar?"
						value={newQuestion}
					/>

					<div className={styles.formFooter}>
						{isAuthenticated ? (
							<div className={styles.userInfo}>
								<img src={user.photoURL ?? ""} alt={user.displayName ?? ""} />
								<span>{user.displayName}</span>
							</div>
						) : (
							<span>
								Para enviar uma pergunta, <button>faça seu login</button>
							</span>
						)}
						<Button disabled={!isAuthenticated} type="submit">
							Enviar Pergunta
						</Button>
					</div>
				</form>

				{JSON.stringify(questions)}
			</main>
		</div>
	);
}
