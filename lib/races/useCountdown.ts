"use client"

import { useState, useEffect } from "react"


type CountdownResult = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isFinished: boolean;
};


export function useCountdown(targetDate: string | undefined): CountdownResult {
    const calculateTimeLeft = () => {
        if (!targetDate) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                isFinished: true,
            };
        }

        const diff = new Date(targetDate).getTime() - new Date().getTime();

        if (diff <= 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                isFinished: true,
            };
        }  

        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: Math.floor((diff / 1000) % 60),
            isFinished: false,
        }
    }

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return timeLeft;

}