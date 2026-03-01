import { HTMLProps, MouseEventHandler } from "react";

interface ButtonProps {
    label: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    className?: HTMLProps<HTMLElement>["className"];    // allows for styling to be overwritten entirely (may change to have a few fixed style values)
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, className, disabled }) => {
    const buttonClass = className ? className : "rounded border text-primary-blue-005 border-white bg-transparent px-4 py-2 hover:bg-primary-blue-005 hover:text-cool-gray-90 disabled:opacity-40 disabled:cursor-not-allowed";

    return (
        <button className={buttonClass} onClick={onClick} disabled={disabled}>
			{label}
		</button>
    )
}

export default Button;