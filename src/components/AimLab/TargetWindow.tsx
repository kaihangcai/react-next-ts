"use client";

import { useState, useEffect, useReducer, useCallback } from "react";
import { useSession } from "next-auth/react";
import Target from "./Target";
import TargetNavigation from "./TargetNavigation";
import useTimer from "../../hooks/use-timer";
import useHttp from "@/hooks/use-http";
import { useScoreContext } from "../../store/score-context";

type TargetPosition = {
	x: number;
	y: number;
};

type StatsState = {
	score: number;
	totalClicks: number;
};

type StatsAction = { type: "SCORE" } | { type: "CLICK" } | { type: "RESET" };

const statsReducer = (state: StatsState, action: StatsAction) => {
	if (action.type === "SCORE") {
		return {
			score: state.score + 1,
			totalClicks: state.totalClicks,
		};
	}
	if (action.type === "CLICK") {
		return {
			score: state.score,
			totalClicks: state.totalClicks + 1,
		};
	}
	return { score: 0, totalClicks: 0 };
};

interface TargetWindowProps {
	state: string;
	updateState: (newState: string) => void;
}

const TargetWindow: React.FC<TargetWindowProps> = ({ state, updateState }) => {
	const { playerScore, setPlayerScore } = useScoreContext();
	const { data: session, status } = useSession();

	const user = session?.user || null;

	const [statsState, dispatchStats] = useReducer(statsReducer, {
		score: 0,
		totalClicks: 0,
	});

	const [windowSize, timeString] = state.split("_");
	const gameTime = parseInt(timeString);
	// to handle window sizing (string mapped to some x by y value) - 16:9 aspect ratio
	// so in theory I only need to track just 1 value and then perform some calculations to get the other
	/*
		s: 640 x 360
		m: 960 x 540
		l: 1280 x 720
	*/

	const getWindowHeight = (width: number, aspectRatio: number[]) => {
		// aspect ratio will be an array of 2 numbers, the ratio between width & height
		return Math.floor(width / aspectRatio[0]) * aspectRatio[1];
	};

	let windowWidth: number, windowHeight: number;
	switch (windowSize) {
		case "m":
			windowWidth = 960;
			break;
		case "l":
			windowWidth = 1280;
			break;
		default: // s
			windowWidth = 800;
	}
	windowHeight = getWindowHeight(windowWidth, [16, 9]);

	// to store the x y positions of the target (default is centered)
	const [targetPos, setTargetPos] = useState<TargetPosition>({
		x: Math.floor((windowWidth - 50) / 2),
		y: Math.floor((windowWidth - 50) / 2),
	});

	// to handle all the timer functionality
	const { timer, timerSec, startTimer, resetTimer } = useTimer(gameTime);

	const [isActive, setIsActive] = useState<boolean>(false); // to track whether the game is being played currently or not
	const [showStats, setShowStats] = useState<boolean>(false); // to 'modify' the content when game is inactive AFTER playing through >= 1 time(s)

	// to track choice of xhair -> Object: { id: number, style: string } - default is static w/ gap
	const [crosshair, setCrosshair] = useState<{ id: string; style: string }>({
		id: "1",
		style: "cursor-xhair1",
	});

	// to track color style for target - default is red
	const [targetColor, setTargetColor] = useState<{ id: string; style: string }>(
		{
			id: "r",
			style: "bg-red-400",
		}
	);

	const { sendRequest } = useHttp();

	/* Re-positioning of target */
	// Game type 1: Random re-positioning
	useEffect(() => {
		const pureRandom = () => {
			const maxLeft = windowWidth - 50;
			const maxTop = windowHeight - 50;
			setTargetPos({
				x: Math.random() * maxLeft,
				y: Math.random() * maxTop,
			});
		};
		pureRandom();
	}, [statsState.score, windowWidth, windowHeight]);

	// Game type 2: Alternate between random and center position
	// useEffect(() => {
	// 	const flickPractice = () => {
	// 		const maxLeft = windowWidth - 50;
	// 		const maxTop = windowHeight - 50;
	// 		if (statsState.score % 2 === 0) {
	// 			// score is divisible by 2
	// 			// center spawn
	// 			setTargetPos({
	// 				x: Math.floor(maxLeft / 2),
	// 				y: Math.floor(maxTop / 2),
	// 			});
	// 		} else {
	// 			// random spawn
	// 			setTargetPos({
	// 				x: Math.random() * maxLeft,
	// 				y: Math.random() * maxTop,
	// 			});
	// 		}
	// 	};
	// 	flickPractice();
	// },[statsState.score, windowWidth, windowHeight])

	// Game type 3: Random re-positioning, but higher % chance of generating a closer position
	// useEffect(() => {
	// 	const lessRandom = () => {
	// 		const maxLeft = windowWidth - 50;
	// 		const maxTop = windowHeight - 50;

	// 		// configuring spawns
	// 		const idealSpawnRange = 120; // furthest a target is allowed to spawn
	// 		let isAdd = Math.random() < 0.5; // randomize whether its a '+' or '-'
	// 		const maxAttemptsBeforeGivingUp = 5; // number of random gen. loops allowed before giving up and just doing random repos

	// 		setTargetPos((prevPos) => {
	// 			let attemptCount = 1;
	// 			// generate x pos
	// 			let newX = prevPos.x + Math.random() * idealSpawnRange;
	// 			// generate y pos
	// 			let newY = prevPos.y + Math.random() * idealSpawnRange;
	// 			if (isAdd) {
	// 				// increase value of original pos
	// 				while (newX >= maxLeft || newX <= 0) {
	// 					// newX should be within [0, maxLeft]
	// 					attemptCount++;
	// 					if (attemptCount > maxAttemptsBeforeGivingUp) {
	// 						console.log("Giving up! Generating random pos instead!");
	// 						return {
	// 							x: Math.random() * maxLeft,
	// 							y: Math.random() * maxTop,
	// 						};
	// 					}
	// 					newX = prevPos.x + Math.random() * idealSpawnRange;
	// 				}
	// 				while (newY >= maxTop || newY <= 0) {
	// 					// newY should be within [0, maxTop]
	// 					attemptCount++;
	// 					if (attemptCount > maxAttemptsBeforeGivingUp) {
	// 						console.log("Giving up! Generating random pos instead!");
	// 						return {
	// 							x: Math.random() * maxLeft,
	// 							y: Math.random() * maxTop,
	// 						};
	// 					}
	// 					newY = prevPos.y + Math.random() * idealSpawnRange;
	// 				}
	// 				return {
	// 					x: newX,
	// 					y: newY,
	// 				};
	// 			} else {
	// 				// decrease value of original pos
	// 				while (newX >= maxLeft || newX <= 0) {
	// 					// newX should be within [0, maxLeft]
	// 					attemptCount++;
	// 					if (attemptCount > maxAttemptsBeforeGivingUp) {
	// 						console.log("Giving up! Generating random pos instead!");
	// 						return {
	// 							x: Math.random() * maxLeft,
	// 							y: Math.random() * maxTop,
	// 						};
	// 					}
	// 					newX = prevPos.x - Math.random() * idealSpawnRange;
	// 				}
	// 				while (newY >= maxTop || newY <= 0) {
	// 					// newY should be within [0, maxTop]
	// 					attemptCount++;
	// 					if (attemptCount > maxAttemptsBeforeGivingUp) {
	// 						console.log("Giving up! Generating random pos instead!");
	// 						return {
	// 							x: Math.random() * maxLeft,
	// 							y: Math.random() * maxTop,
	// 						};
	// 					}
	// 					newY = prevPos.y - Math.random() * idealSpawnRange;
	// 				}
	// 				return {
	// 					x: newX,
	// 					y: newY,
	// 				};
	// 			}
	// 		});
	// 	};
	// 	lessRandom();
	// }, [statsState.score, windowWidth, windowHeight]);

	function clickWindowHandler() {
		if (isActive) {
			dispatchStats({ type: "CLICK" });
		}
	}

	// first sound is very soft...
	function playHitSound() {
		const hitSound = new Audio("/aim-trainer/audio/osu-hit.wav");
		hitSound.volume = 0.7;
		hitSound.playbackRate = 1.25;
		hitSound.play().catch((err) => {
			console.error(err);
		});
	}

	function clickTargetHandler() {
		dispatchStats({ type: "SCORE" }); // update score
		playHitSound();
	}

	function resetHandler() {
		dispatchStats({ type: "RESET" }); // reset current score
		resetTimer(); // reset timer
		setIsActive(false); // show start page
		setShowStats(false); // do NOT show stats (no point anw)
	}

	// From game -> stats
	const stopGameHandler = useCallback(() => {
		// this is called ONLY when a game concludes (i.e., timer expires)
		console.log("Stopping game...");
		setIsActive(false);
		setShowStats(true);
	}, []);

	const gameState = state;
	const topScore = playerScore.scores[gameState as keyof Scores] as number; // assert gameState to be a valid key and topScore as number

	// To trigger the stop game function once when timer ends
	useEffect(() => {
		if (timer === 0) {
			stopGameHandler();
			resetTimer(); // resetTimer is necessary so that this won't trigger again
			if (statsState.score > topScore) {
				setPlayerScore(gameState, statsState.score);
				// update backend here
				if(status === "authenticated") {
					sendRequest(
						{
							url: `/api/game`,
							method: "POST",
							data: {
								score: statsState.score,
								state: gameState,
							},
						},
						(data) => {
							console.log(data.message);
						}
					);
				} else console.log('Not logged in!')
			}
		}
	}, [timer, stopGameHandler, resetTimer, statsState.score, topScore, setPlayerScore, gameState, sendRequest, status]);

	// From start -> game
	function startGameHandler() {
		console.log("Starting game...");
		setIsActive(true); // set {targetDisplay} to show the game
		startTimer();
	}

	// id will be the same 'id' stored in the crosshair state
	function updateCrosshair(id: string) {
		if (id === crosshair.id) {
			// xhair already in use
			console.log("Crosshair already set!");
			return;
		}
		switch (id) {
			case "1":
				setCrosshair({
					id: "1",
					style: "cursor-xhair1",
				});
				break;
			case "2":
				setCrosshair({
					id: "2",
					style: "cursor-xhair2",
				});
				break;
			case "3":
				setCrosshair({
					id: "3",
					style: "cursor-xhair3",
				});
				break;
			default:
				console.log("Invalid id!");
		}
	}

	function updateTargetColor(id: string) {
		if (id === targetColor.id) {
			// target color already in use
			console.log("Target color already set!");
			return;
		}
		switch (id) {
			case "r":
				setTargetColor({
					id: id,
					style: `bg-red-400`,
				});
				break;
			case "g":
				setTargetColor({
					id: id,
					style: "bg-green-400",
				});
				break;
			case "b":
				setTargetColor({
					id: id,
					style: `bg-cyan-400`,
				});
				break;
			case "y":
				setTargetColor({
					id: id,
					style: `bg-yellow-400`,
				});
				break;
			default:
				console.log("Invalid id!");
		}
	}

	// Shows the pixel dimensions of the game
	const windowDimensions = (
		<div className="absolute right-2 bottom-0">
			<p>
				{windowWidth} x {windowHeight}
			</p>
		</div>
	);
	// Either the 'game' is shown, or the start/end screen
	const targetDisplay = isActive ? (
		<Target
			className={`absolute w-12 h-12 rounded-full ${targetColor.style}`}
			onClick={clickTargetHandler}
			position={targetPos}
		/>
	) : showStats ? (
		<div className="w-full h-full flex flex-col justify-center items-center">
			<h3 className="text-sm">
				( Game state: {windowSize}_{timerSec} )
			</h3>
			<ul>
				<li>Score: {statsState.score}</li>
				<li>Total clicks: {statsState.totalClicks}</li>
				<li>
					Accuracy: {(statsState.score / statsState.totalClicks).toFixed(2)}
				</li>
				<li>Hits per sec: {(statsState.score / timerSec).toFixed(2)}</li>
			</ul>
			<button
				type="button"
				onClick={resetHandler}
				className="border-none rounded-md py-1 px-4 hover:text-cool-gray-90 hover:bg-amber-200"
			>
				-- Click here to dismiss --
			</button>
		</div>
	) : (
		<div
			className="w-full h-full flex items-center justify-center"
			onClick={startGameHandler}
		>
			<h1 className="text-2xl font-bold">
				-- Click anywhere in the window to start --
			</h1>
		</div>
	);

	/*
        cursor-xhair1, cursor-xhair2, cursor-xhair3 placed in tailwindcss config -> toggle using id or smth here
    */

	return (
		<div className="m-4" style={{ width: `${windowWidth}px` }}>
			<TargetNavigation
				score={statsState.score}
				onReset={resetHandler}
				timer={timer}
				setTimer={resetTimer}
				gameState={state}
				setGameState={updateState}
				crosshairId={crosshair.id}
				setCrosshair={updateCrosshair}
				targetColorId={targetColor.id}
				setTargetColor={updateTargetColor}
			/>
			<div
				className={`flex relative items-center justify-center ${
					crosshair.style
				} ${isActive ? "bg-zinc-500" : "bg-zinc-700"}`}
				style={{ height: `${windowHeight}px` }}
				onClick={clickWindowHandler}
			>
				{targetDisplay}
				{windowDimensions}
			</div>
		</div>
	);
};

export default TargetWindow;
