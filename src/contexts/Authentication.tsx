import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState
} from "react";

import { auth, firebase } from "../services/firebase";

interface AuthenticationContext {
	authenticate: () => Promise<void>;
	isAuthenticated: boolean;
	user: Pick<firebase.User, "uid" | "photoURL" | "displayName">;
}

interface AuthenticationProviderProps {
	children: ReactNode;
}

const authenticationContext = createContext({} as AuthenticationContext);

export function AuthenticationProvider({
	children
}: AuthenticationProviderProps): JSX.Element {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState(
		{} as Pick<firebase.User, "uid" | "photoURL" | "displayName">
	);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				const { displayName, photoURL, uid } = user;

				if (!displayName || !photoURL) {
					throw new Error("Missing information from Google Account");
				}

				setUser({
					displayName,
					photoURL,
					uid
				});

				setIsAuthenticated(true);
			}
		});

		return () => unsubscribe();
	}, []);

	async function authenticate(): Promise<void> {
		const provider = new firebase.auth.GoogleAuthProvider();

		await auth.signInWithPopup(provider).then((result) => {
			if (result.user) {
				const { displayName, photoURL, uid } = result.user;

				if (!displayName || !photoURL) {
					throw new Error("Missing information from Google Account");
				}

				setUser({
					displayName,
					photoURL,
					uid
				});

				setIsAuthenticated(true);
			}
		});
	}

	return (
		<authenticationContext.Provider
			value={{
				authenticate,
				isAuthenticated,
				user
			}}
		>
			{children}
		</authenticationContext.Provider>
	);
}

export function useAuthentication(): AuthenticationContext {
	return useContext(authenticationContext);
}
