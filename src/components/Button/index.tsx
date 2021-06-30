import { ButtonHTMLAttributes } from "react";

import styles from "./Button.module.scss";

export function Button(
	props: ButtonHTMLAttributes<HTMLButtonElement>
): JSX.Element {
	return <button className={styles.button} {...props} />;
}
