import React, { useState, useEffect } from "react";

const hours = [
    "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
    "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM"
];

const ScheduleSelector = ({ onChange }) => {
    const [schedule, setSchedule] = useState({
        weekOpenTime: "11:00 AM",
        weekCloseTime: "08:00 PM",
        weekendOpenTime: "11:00 AM",
        weekendCloseTime: "08:00 PM"
    });

    // Solo enviar cambios cuando realmente cambie el estado
    useEffect(() => {
        if (typeof onChange === "function") {
            onChange({
                week: { open: schedule.weekOpenTime, close: schedule.weekCloseTime },
                weekend: { open: schedule.weekendOpenTime, close: schedule.weekendCloseTime }
            });
        }
    }, [schedule]);    

    // Manejar cambios en los select
    const handleChange = (event) => {
        setSchedule(prevSchedule => ({
            ...prevSchedule,
            [event.target.name]: event.target.value
        }));
    };

    return (
        <div className="mb-3">
            {/* Horario entre semana */}
            <div className="mb-2">
                <p>Entre semana (Lunes - Viernes)</p>
                <div className="d-flex gap-2">
                    <select className="form-select" name="weekOpenTime" value={schedule.weekOpenTime} onChange={handleChange}>
                        {hours.map(hour => <option key={hour} value={hour}>{hour}</option>)}
                    </select>

                    <select className="form-select" name="weekCloseTime" value={schedule.weekCloseTime} onChange={handleChange}>
                        {hours.map(hour => <option key={hour} value={hour}>{hour}</option>)}
                    </select>
                </div>
            </div>

            {/* Horario fines de semana */}
            <div className="mb-2">
                <p>Fines de semana (Sábado - Domingo)</p>
                <div className="d-flex gap-2">
                    <select className="form-select" name="weekendOpenTime" value={schedule.weekendOpenTime} onChange={handleChange}>
                        {hours.map(hour => <option key={hour} value={hour}>{hour}</option>)}
                    </select>

                    <select className="form-select" name="weekendCloseTime" value={schedule.weekendCloseTime} onChange={handleChange}>
                        {hours.map(hour => <option key={hour} value={hour}>{hour}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default ScheduleSelector;