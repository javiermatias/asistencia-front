'use client'

import { useEffect, useMemo, useState } from "react";
import { Steps } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

export default function Step({ id }: { id: number }) {
    const [step] = useState(id);

    // Define your step data (titles and descriptions)

    const stepsData = [
        { title: 'Datos', description: 'Datos Generales', numero: 1 },
        { title: 'Gestion', description: 'Gestion', numero: 2 },
        { title: 'Herramientas', description: 'Herramientas', numero: 3 },
        { title: 'Indicadores', description: 'Entrevista Indicadores', numero: 4 },
    ];
    const [steps, setSteps] = useState(stepsData);

    useEffect(() => {
        // Calculate the range of steps to display based on the current step
        const startStep = step;
        const endStep = step + 1;
        setSteps(stepsData.slice(startStep, endStep + 1));
    }, [step])

    return (
        <div>
            <Steps current={0}>
                {steps.map((step) => (
                    <Steps.Item key={step.numero} title={step.title} description={step.description} />
                ))}
            </Steps>

        </div>

    )
}