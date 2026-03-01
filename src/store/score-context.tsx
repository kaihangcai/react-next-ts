"use client"

import { useSession } from "next-auth/react";
import React, { useState, useCallback, useEffect, useContext } from "react";

type ScoreContextObj = {
    scoreRecords: ScoreRecord[];
    playerScore: ScoreRecord;
    replaceScoreRecords: (newRecords: ScoreRecord[]) => void;
    setPlayerScore: (gameState: string, score: number) => void;
    replacePlayerScore: (scoreRecord?: ScoreRecord) => void;
}

// "default" playerScore
const initialPlayerScore: ScoreRecord = {
	alias: 'UNKNOWN',
	id: '-1',
    scores: {
        s_15: 0,
        s_30: 0,
        s_45: 0,
        s_60: 0,
        m_15: 0,
        m_30: 0,
        m_45: 0,
        m_60: 0,
        l_15: 0,
        l_30: 0,
        l_45: 0,
        l_60: 0,
    }
};

export const ScoreContext = React.createContext<ScoreContextObj>({
    scoreRecords: [],
    playerScore: initialPlayerScore,
    replaceScoreRecords: (newRecords: ScoreRecord[]) => {},
    setPlayerScore: (gameState: string, score: number) => {},
    replacePlayerScore: (scoreRecord?: ScoreRecord) => {},
})

export const useScoreContext = () => useContext(ScoreContext);

type ScoreProviderProps = {
    children: React.ReactNode;
}

const ScoreProvider: React.FC<ScoreProviderProps> = ({ children }) => {
    const [scoreRecords, setScoreRecords] = useState<ScoreRecord[]>([]);
    const [playerScore, setPlayerScore] = useState<ScoreRecord>(initialPlayerScore);

    const {data: session} = useSession();   // "auth context"
    const user = session?.user || null;

    const replaceScoreHandler = useCallback((newRecords: ScoreRecord[]) => {
        console.log('Overwriting scoreRecords!');
        setScoreRecords(newRecords);
    }, []);

    const setPlayerScoreHandler = useCallback((gameState: string, score: number) => {
        console.log('Updating playerScore!');
        // fn expects to receive gameState and score
        setPlayerScore(prevScore => {
            return {
                alias: prevScore.alias, 
                id: prevScore.id, 
                scores: {...prevScore.scores, [gameState]: score}
            }
        });
    }, [])

    // optional scoreRecord Object as input arg (will just 'reset' by default)
    const replacePlayerScoreHandler = useCallback((scoreRecord = initialPlayerScore) => {
        console.log('Overwriting playerScore!');
        setPlayerScore(scoreRecord);
    }, []);

    // Goal: fetch score records when user switches between logged in & logged out (or expired)
    useEffect(() => {
        const fetchRecords = async () => {
            const response = await fetch(`/api/game`);
    
            if(!response.ok) {
                console.log("Error with fetching score records!");
            }
    
            const data = await response.json();
            return data.records;
        }
        fetchRecords().then((records: ScoreRecord[]) => {
            replaceScoreHandler(records);  // update scoreRecords

            if(user) {  // if user is logged in
                // find & update local playerScore with matching score record
                const existingRecord = records.find(record => record.id === user.id);
                replacePlayerScoreHandler(existingRecord);
            }
        }).catch(err => {
            console.error(err)
        })
    }, [replaceScoreHandler, replacePlayerScoreHandler, user])

    const scoreContext = {
        scoreRecords: scoreRecords,
        playerScore: playerScore,
        replaceScoreRecords: replaceScoreHandler,
        setPlayerScore: setPlayerScoreHandler,
        replacePlayerScore: replacePlayerScoreHandler,
    }

    return (
        <ScoreContext.Provider value={scoreContext}>
            {children}
        </ScoreContext.Provider>
    );
}

export default ScoreProvider;