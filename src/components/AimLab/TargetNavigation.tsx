"use client"

import Timer from "./Timer";
import { RotateCcw, ChevronUp, ChevronDown } from "lucide-react";

interface TargetNavigationProps {
    score: number;
    onReset: () => void;
    timer: number;
    setTimer: (newInitialTime?: number) => void;
    gameState: string;
    setGameState: (newState: string) => void;
    crosshairId: string;
    setCrosshair: (id: string) => void;
    targetColorId: string;
    setTargetColor: (id: string) => void;
}

// to display a row of possible configurations (widgets)
const TargetNavigation: React.FC<TargetNavigationProps> = ({
	score,
	onReset,
	timer, setTimer,
	gameState,
	setGameState,
	crosshairId,setCrosshair,
	targetColorId, setTargetColor
}) => {
	const windowSize = gameState.split('_')[0];
	const gameTime = parseInt(gameState.split('_')[1]);	// gameTime should be int

	function resetHandler() {
		onReset();
	}

	function increaseTimeHandler() {
		if (gameTime < 60) {
			onReset();	// if the game is running, stop it
			const newTime = gameTime + 15;
			setGameState(`${windowSize}_${newTime}`);
			setTimer(newTime);
		} else {
			console.log("Timer should not exceed 60 seconds!");
		}
	}

	function decreaseTimeHandler() {
		if (gameTime > 15) {
			onReset();	// if the game is running, stop it
			const newTime = gameTime - 15;
			setGameState(`${windowSize}_${newTime}`);
			setTimer(newTime);
		} else {
			console.log("Timer should not be lower than 15 seconds!");
		}
	}

	function changeWindowSizeHandler(event: React.ChangeEvent<HTMLInputElement>) {
		const newWindowSize = event.target.value;
		setGameState(`${newWindowSize}_${gameTime}`);
		onReset();
	}

	function toggleCrosshairHandler(event: React.MouseEvent<HTMLButtonElement>) {
		setCrosshair(event.currentTarget.value);
	}

	function toggleColorHandler(event: React.MouseEvent<HTMLButtonElement>) {
		setTargetColor(event.currentTarget.value);
	}

    const baseBtnClass = 'px-2 border rounded-md border-solid border-amber-200 cursor-pointer hover:bg-amber-300 hover:text-cool-gray-90';

	return (
		<nav className="bg-gray-700 border-b-2 border-white">
			<ul className="flex p-4 gap-4 justify-between items-center list-none">
				<li>
					<button
						className='flex items-center justify-center border border-solid rounded-md p-2 border-white hover:bg-amber-300 hover:text-cool-gray-90'
						type="button"
						onClick={resetHandler}
					>
						<RotateCcw size={24} />
					</button>
				</li>
				<li className="flex flex-col text-center gap-1">
					<label className="text-m font-bold">Preset crosshairs</label>
					<div className='flex flex-row justify-center gap-2'>
						<button className={`${baseBtnClass} ${crosshairId === "1" ? 'bg-amber-200 text-cool-gray-90' : ''}`} onClick={toggleCrosshairHandler} value='1'>1</button>
						<button className={`${baseBtnClass} ${crosshairId === "2" ? 'bg-amber-200 text-cool-gray-90' : ''}`} onClick={toggleCrosshairHandler} value='2'>2</button>
						<button className={`${baseBtnClass} ${crosshairId === "3" ? 'bg-amber-200 text-cool-gray-90' : ''}`} onClick={toggleCrosshairHandler} value='3'>3</button>
					</div>
					<label className="text-m font-bold">Target color</label>
					<div className='flex flex-row justify-center gap-2'>
						<button className={`${baseBtnClass} ${targetColorId === 'r' ? 'bg-amber-200 text-cool-gray-90' : ''}`} onClick={toggleColorHandler} value='r'>R</button>
						<button className={`${baseBtnClass} ${targetColorId === 'g' ? 'bg-amber-200 text-cool-gray-90' : ''}`} onClick={toggleColorHandler} value='g'>G</button>
						<button className={`${baseBtnClass} ${targetColorId === 'b' ? 'bg-amber-200 text-cool-gray-90' : ''}`} onClick={toggleColorHandler} value='b'>B</button>
						<button className={`${baseBtnClass} ${targetColorId === 'y' ? 'bg-amber-200 text-cool-gray-90' : ''}`} onClick={toggleColorHandler} value='y'>Y</button>
					</div>
				</li>
				<li>
					<div className='flex flex-col items-center justify-center px-2'>
						<button type="button" onClick={increaseTimeHandler} className={`flex items-center justify-center ${baseBtnClass}`}>
							<ChevronUp size={20} />
						</button>
						<Timer time={timer} />
						<button type="button" onClick={decreaseTimeHandler} className={`flex items-center justify-center ${baseBtnClass}`}>
							<ChevronDown size={20} />
						</button>
					</div>
				</li>
				<li>
					<label className="text-m font-bold">Window size</label>
					<form className='flex flex-col gap-1'>
						<label className='flex flex-row items-center gap-2'>
							<input
								type="radio"
								value="s"
								checked={windowSize === "s"}
								onChange={changeWindowSizeHandler}
								className="scale-150 mb-1"
							/>
							S
						</label>
						<label className='flex flex-row items-center gap-2'>
							<input
								type="radio"
								value="m"
								checked={windowSize === "m"}
								onChange={changeWindowSizeHandler}
								className="scale-150 mb-1"
							/>
							M
						</label>
						<label className='flex flex-row items-center gap-2'>
							<input
								type="radio"
								value="l"
								checked={windowSize === "l"}
								onChange={changeWindowSizeHandler}
								className="scale-150 mb-1"
							/>
							L
						</label>
					</form>
				</li>
				<li>
					<div className="p-2 border border-solid rounded-lg border-white text-center">
						<h1 className="text-xl italic">Score</h1>
						<p className="text-3xl font-bold">{score}</p>
					</div>
				</li>
			</ul>
		</nav>
	);
}

export default TargetNavigation;
