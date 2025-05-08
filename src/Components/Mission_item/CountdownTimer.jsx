import { useEffect, useState } from 'react';

function CountdownTimer({ expireDate }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const expire = new Date(expireDate);
            const diff = expire - now;

            if (diff <= 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(interval);
    }, [expireDate]);

    return (
        <div className="text-center">
            <div className={`flex justify-center items-center ${timeLeft.days ? 'space-x-2' : ''} text-sm border rounded-badge px-1`}>
                {/* เงื่อนไขแสดง Day */}
                {timeLeft.days > 0 && (
                    <span className="font-mono">
                        {timeLeft.days} Day
                    </span>
                )}
                {/* เวลาแบบ 00:00:00 */}
                <span className="font-mono">
                    {String(timeLeft.hours).padStart(2, '0')}:
                    {String(timeLeft.minutes).padStart(2, '0')}:
                    {String(timeLeft.seconds).padStart(2, '0')}
                </span>
            </div>
        </div>

    );
}
export default CountdownTimer;
